import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  type UsageRegistry,
  countMockUsesGlobal,
  fingerprintLandingSemantics,
  fingerprintLandingStructure,
  loadUsageRegistry,
  structureDistance,
} from '../registry/global-illustration-usage';
import { type Domain, resolveDomainFromBrief } from '../registry/domain-visual';
import type { Brief } from '../schemas/brief';
import { LandingSpecSchema, type LandingSpec } from '../schemas/landing-spec';

/**
 * cross-landing-diversity — детектор «два лендинга подряд почти не отличаются».
 *
 * Проблема: даже когда каждая отдельная страница проходит intra-landing проверки
 * (visual-diversity, layout-conformance), серия лендингов в одном домене
 * выходит однотипной — одинаковая последовательность секций, одинаковые mock'и,
 * одинаковая копи. Это шаблонизация на уровне portfolio, её можно поймать
 * только сравнением между лендингами.
 *
 * Поведение по умолчанию — soft warn (warnings), pipeline продолжается. С
 * флагом `strict: true` (`--strict-diversity` в CLI) — все warns превращаются
 * в errors и блокируют ingest.
 *
 * Правила:
 *   - mock-overused-globally: один и тот же `(variant, domain)` использован
 *     в >2 других лендингах. Сигнал: «пора создать новый mock для разнообразия».
 *   - landing-structure-duplicate: structureDistance < 3 с другим лендингом
 *     того же layout. Сигнал: «портфолио шаблонизируется».
 *   - landing-semantic-duplicate: semantic fingerprint совпадает с другим
 *     лендингом. Сигнал: «практически копия другого лендинга».
 *   - landing-copy-similarity: top-3 пересечений по нормализованным
 *     keyword'ам в title/subtitle/eyebrow. Soft only — копи могут пересекаться
 *     легитимно, важен top.
 */

export type CrossLandingDiversityRule =
  | 'mock-overused-globally'
  | 'landing-structure-duplicate'
  | 'landing-semantic-duplicate'
  | 'landing-copy-similarity';

export interface CrossLandingDiversityIssue {
  rule: CrossLandingDiversityRule;
  message: string;
  where?: string;
}

export interface CrossLandingDiversityResult {
  ok: boolean;
  resolvedDomain: Domain;
  structureFingerprint: string;
  semanticFingerprint: string;
  errors: CrossLandingDiversityIssue[];
  warnings: CrossLandingDiversityIssue[];
}

export interface CrossLandingDiversityOptions {
  root: string;
  slug: string;
  /** Когда true — все warnings становятся errors (используется `--strict-diversity`). */
  strict?: boolean;
  /** Лимит mock-use в одном домене. По умолчанию 2 (мягко: 3-й уже warning). */
  mockOveruseLimit?: number;
  /** Минимальная structureDistance, чтобы лендинги считались разными. По умолчанию 3. */
  structureMinDistance?: number;
  /** Опционально передать предзагруженный registry (для batch-аудита). */
  registry?: UsageRegistry;
  /** Опционально передать существующие spec'ы других лендингов (для batch). */
  otherSpecs?: Array<{ slug: string; spec: LandingSpec }>;
  /** Опционально brief (для override резолва домена). */
  brief?: Brief;
}

const DEFAULT_MOCK_LIMIT = 2;
const DEFAULT_STRUCTURE_MIN_DISTANCE = 3;

function tokenizeCopy(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[«»"«»“”‘’()\[\]{}.,;:!?\-—–]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4);
}

function collectCopyTokens(spec: LandingSpec): Set<string> {
  const tokens = new Set<string>();
  for (const s of spec.sections) {
    const eyebrow = (s.props as Record<string, unknown>).eyebrow;
    const title = (s.props as Record<string, unknown>).title;
    const subtitle = (s.props as Record<string, unknown>).subtitle;
    for (const piece of [eyebrow, title, subtitle]) {
      if (typeof piece === 'string') {
        for (const t of tokenizeCopy(piece)) tokens.add(t);
      }
    }
  }
  return tokens;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function collectUsedVariants(spec: LandingSpec): Array<{ variant: string; where: string }> {
  const usages: Array<{ variant: string; where: string }> = [];
  spec.sections.forEach((s, i) => {
    if (s.component === 'HeroSection' && s.props.visual?.variant && s.props.visual.variant !== 'generic') {
      usages.push({ variant: s.props.visual.variant, where: `sections[${i}].visual.variant` });
    } else if (s.component === 'MediaCopy' && s.props.mediaVariant && s.props.mediaVariant !== 'default') {
      usages.push({ variant: s.props.mediaVariant, where: `sections[${i}].mediaVariant` });
    } else if (s.component === 'TabbedFeatureSection') {
      s.props.tabs.forEach((tab, j) =>
        usages.push({ variant: tab.mockVariant, where: `sections[${i}].tabs[${j}].mockVariant` }),
      );
    } else if (s.component === 'ScenarioWalkthroughSection') {
      s.props.steps.forEach((step, j) =>
        usages.push({ variant: step.mockVariant, where: `sections[${i}].steps[${j}].mockVariant` }),
      );
    }
  });
  return usages;
}

async function loadOtherLandings(
  root: string,
  excludeSlug: string,
): Promise<Array<{ slug: string; spec: LandingSpec }>> {
  const dir = resolve(root, 'content', 'landings');
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }
  const result: Array<{ slug: string; spec: LandingSpec }> = [];
  for (const name of names) {
    if (!name.endsWith('.json')) continue;
    const slug = name.replace(/\.json$/, '');
    if (slug === excludeSlug) continue;
    try {
      const raw = await readFile(resolve(dir, name), 'utf-8');
      const parsed = LandingSpecSchema.safeParse(JSON.parse(raw));
      if (parsed.success) result.push({ slug, spec: parsed.data });
    } catch {
      // skip broken JSONs
    }
  }
  return result;
}

export async function validateCrossLandingDiversity(
  spec: LandingSpec,
  options: CrossLandingDiversityOptions,
): Promise<CrossLandingDiversityResult> {
  const errors: CrossLandingDiversityIssue[] = [];
  const warnings: CrossLandingDiversityIssue[] = [];

  const resolvedDomain = options.brief
    ? resolveDomainFromBrief(options.brief)
    : ((spec.meta?.archetype as Domain | undefined) ?? 'unknown');
  const mockLimit = options.mockOveruseLimit ?? DEFAULT_MOCK_LIMIT;
  const structureMin = options.structureMinDistance ?? DEFAULT_STRUCTURE_MIN_DISTANCE;
  const layoutSlug = spec.meta?.layout;

  const registry = options.registry ?? (await loadUsageRegistry(options.root));
  const otherSpecs =
    options.otherSpecs ?? (await loadOtherLandings(options.root, options.slug));

  const structureFingerprint = fingerprintLandingStructure(spec);
  const semanticFingerprint = fingerprintLandingSemantics(spec);

  // 1) mock-overused-globally
  const usedVariants = collectUsedVariants(spec);
  const reportedVariants = new Set<string>();
  for (const { variant, where } of usedVariants) {
    if (reportedVariants.has(variant)) continue;
    const count = countMockUsesGlobal(registry, {
      variant,
      domain: resolvedDomain,
      excludeSlug: options.slug,
    });
    if (count >= mockLimit) {
      reportedVariants.add(variant);
      warnings.push({
        rule: 'mock-overused-globally',
        message:
          `Variant '${variant}' уже использован в ${count} других лендингах домена '${resolvedDomain}' ` +
          `(лимит — ${mockLimit}). Подумай о создании нового mock'а для этого intent'а, ` +
          'либо подбери другой существующий variant — иначе portfolio начнёт выглядеть шаблонно.',
        where,
      });
    }
  }

  // 2) landing-structure-duplicate и landing-semantic-duplicate
  for (const other of otherSpecs) {
    const otherStructure = fingerprintLandingStructure(other.spec);
    const otherSemantics = fingerprintLandingSemantics(other.spec);

    if (otherSemantics === semanticFingerprint) {
      warnings.push({
        rule: 'landing-semantic-duplicate',
        message:
          `Semantic fingerprint совпадает с лендингом '${other.slug}' (тот же набор секций ` +
          'и тех же mock-вариантов в том же порядке). Это либо случайная копия, либо повтор — ' +
          'различи структуру и/или подбор mock\'ов осознанно.',
        where: `vs sections-of:${other.slug}`,
      });
      continue;
    }

    const otherLayout = other.spec.meta?.layout;
    if (layoutSlug && otherLayout === layoutSlug) {
      const distance = structureDistance(spec, other.spec);
      if (distance < structureMin) {
        warnings.push({
          rule: 'landing-structure-duplicate',
          message:
            `Структура лендинга почти идентична '${other.slug}' (тот же layout '${layoutSlug}', ` +
            `structureDistance=${distance}, порог=${structureMin}). Это типичный признак ` +
            'шаблонизации — добавь/убери секции или поменяй порядок, чтобы лендинги ' +
            'отличались по форме, а не только по копи.',
          where: `vs structure-of:${other.slug}`,
        });
      }
    }
  }

  // 3) landing-copy-similarity (soft only)
  const myTokens = collectCopyTokens(spec);
  const similarities: Array<{ slug: string; score: number }> = [];
  for (const other of otherSpecs) {
    const otherTokens = collectCopyTokens(other.spec);
    const score = jaccard(myTokens, otherTokens);
    if (score >= 0.4) {
      similarities.push({ slug: other.slug, score });
    }
  }
  similarities.sort((a, b) => b.score - a.score);
  for (const sim of similarities.slice(0, 3)) {
    warnings.push({
      rule: 'landing-copy-similarity',
      message:
        `Копи перекрывается с лендингом '${sim.slug}' на ${Math.round(sim.score * 100)}% ` +
        `(Jaccard по нормализованным словам в eyebrow/title/subtitle ≥ 0.4). ` +
        'Возможно повтор формулировок — переформулируй ключевые сообщения.',
      where: `vs copy-of:${sim.slug}`,
    });
  }

  // strict-mode: превращаем все warnings в errors
  if (options.strict) {
    errors.push(...warnings);
    warnings.length = 0;
  }

  return {
    ok: errors.length === 0,
    resolvedDomain,
    structureFingerprint,
    semanticFingerprint,
    errors,
    warnings,
  };
}

export function formatCrossLandingDiversityErrors(
  result: CrossLandingDiversityResult,
): string {
  if (result.ok && result.warnings.length === 0) return 'OK';
  const lines: string[] = [];
  lines.push(
    `  [diversity] domain=${result.resolvedDomain} structure=${result.structureFingerprint} semantic=${result.semanticFingerprint}`,
  );
  for (const e of result.errors) {
    lines.push(`  [diversity:${e.rule}] ${e.where ?? '*'} — ${e.message}`);
  }
  for (const w of result.warnings) {
    lines.push(`  [diversity:warn:${w.rule}] ${w.where ?? '*'} — ${w.message}`);
  }
  return lines.join('\n');
}

/**
 * Запись human-readable отчёта в `.context/pipeline/<slug>/diversity-report.md`.
 */
export async function writeCrossLandingDiversityReport(
  root: string,
  slug: string,
  result: CrossLandingDiversityResult,
): Promise<string> {
  const abs = resolve(root, '.context', 'pipeline', slug, 'diversity-report.md');
  await mkdir(dirname(abs), { recursive: true });
  const lines: string[] = [];
  lines.push(`# Cross-landing diversity report — ${slug}`);
  lines.push('');
  lines.push(`- Domain: \`${result.resolvedDomain}\``);
  lines.push(`- Structure fingerprint: \`${result.structureFingerprint}\``);
  lines.push(`- Semantic fingerprint: \`${result.semanticFingerprint}\``);
  lines.push(`- Status: ${result.ok ? 'ok' : 'issues found'}`);
  lines.push('');
  if (result.errors.length > 0) {
    lines.push('## Errors');
    for (const e of result.errors) {
      lines.push(`- **${e.rule}** @ ${e.where ?? '*'}`);
      lines.push(`  ${e.message}`);
    }
    lines.push('');
  }
  if (result.warnings.length > 0) {
    lines.push('## Warnings');
    for (const w of result.warnings) {
      lines.push(`- **${w.rule}** @ ${w.where ?? '*'}`);
      lines.push(`  ${w.message}`);
    }
    lines.push('');
  }
  await writeFile(abs, lines.join('\n') + '\n', 'utf-8');
  return abs;
}
