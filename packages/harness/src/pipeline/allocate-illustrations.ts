import { createHash } from 'node:crypto';
import type { Brief } from '../schemas/brief';
import type { LandingSpec } from '../schemas/landing-spec';
import { IllustrationSpecSchema, type IllustrationSpec } from '../schemas/illustration-spec';
import {
  type Domain,
  getDomainEntry,
  resolveDomainFromBrief,
} from '../registry/domain-visual';
import {
  type UsageRegistry,
  loadUsageRegistry,
} from '../registry/global-illustration-usage';

/**
 * Illustration allocation (P8 фаза, полная реализация M4).
 *
 * Назначение: для секций, где не подходит ни один существующий mock-вариант
 * из домена, инициировать генерацию уникальной SVG-иллюстрации.
 *
 * Что делает:
 *   1. Анализирует spec, для каждой визуальной секции определяет decision:
 *      - `reuse-mock` — есть подходящий domain mock, используем его;
 *      - `generate-svg` — нужна уникальная SVG-иллюстрация;
 *      - `no-op` — секция без визуала.
 *   2. Для каждого `generate-svg` formируется `IllustrationSpec` (id, scene,
 *      palette, devices, uiHint) на основе brief + domain context.
 *   3. Anti-duplication: загружает existing fingerprints из global-illustration-usage
 *      registry. Передаёт их в `existingFingerprints[]` чтобы LLM при генерации
 *      варьировал композицию.
 *   4. Возвращает массив `IllustrationSpec` готовых к передаче в
 *      `generateIllustrationTSXWithRepair` (если есть API keys) или в host-agent
 *      prompt (через svg-illustration-skill.md).
 *
 * Записывает decisions в `spec.meta.illustrationAllocations`. Reuse-cache:
 *   если spec.meta.illustrationAllocations уже содержит запись с тем же
 *   semantic fingerprint — возвращает её id вместо генерации новой.
 */

export type AllocationDecisionKind = 'reuse-mock' | 'generate-svg' | 'no-op';

export interface AllocationDecision {
  sectionIdx: number;
  sectionId: string;
  intent: string;
  decision: AllocationDecisionKind;
  variant?: string;
  illustrationId?: string;
  /** Human-readable обоснование. */
  rationale: string;
  /** Если decision=generate-svg — готовая IllustrationSpec для LLM. */
  illustrationSpec?: IllustrationSpec;
}

export interface AllocateIllustrationsResult {
  domain: Domain;
  decisions: AllocationDecision[];
  suggestions: string[];
  /** SVG specs готовые к генерации через generateIllustrationTSXWithRepair. */
  illustrationsToGenerate: IllustrationSpec[];
  /** Existing fingerprints (для передачи в LLM как anti-duplication context). */
  existingFingerprints: string[];
}

export interface AllocateIllustrationsOptions {
  /** Если задан — переопределяет domain резолв из brief. */
  overrideDomain?: Domain;
  /** Pre-loaded usage registry (для batch / тестов). */
  usageRegistry?: UsageRegistry;
  /** root path (нужен для load registry если не передан). */
  root?: string;
}

/**
 * Дефолтные палитры по домену (для IllustrationSpec.palette).
 * Glow цвета подобраны под бренд Kaiten (фиолет/оранж/зелёный).
 */
const DOMAIN_PALETTES: Record<Domain, { accent: string; glowDark: string; glowLight: string }> = {
  pm: { accent: '#7d4ccf', glowDark: '#10B981', glowLight: '#FED7AA' },
  support: { accent: '#7d4ccf', glowDark: '#10B981', glowLight: '#FED7AA' },
  crm: { accent: '#7d4ccf', glowDark: '#22C55E', glowLight: '#FED7AA' },
  hr: { accent: '#7d4ccf', glowDark: '#3B82F6', glowLight: '#FBCFE8' },
  marketing: { accent: '#7d4ccf', glowDark: '#F59E0B', glowLight: '#FBCFE8' },
  bpm: { accent: '#7d4ccf', glowDark: '#10B981', glowLight: '#FCA5A5' },
  finance: { accent: '#7d4ccf', glowDark: '#10B981', glowLight: '#FED7AA' },
  ecommerce: { accent: '#7d4ccf', glowDark: '#3B82F6', glowLight: '#FBCFE8' },
  unknown: { accent: '#7d4ccf', glowDark: '#10B981', glowLight: '#FED7AA' },
};

/**
 * Формирует IllustrationSpec для секции, которая требует уникальной SVG.
 * scene/devices/uiHint определяются эвристически по component + intent + domain.
 */
function buildIllustrationSpec(params: {
  slug: string;
  sectionId: string;
  sectionIdx: number;
  intent: string;
  domain: Domain;
  brief: Brief;
}): IllustrationSpec {
  const { slug, sectionId, sectionIdx, intent, domain, brief } = params;
  const palette = DOMAIN_PALETTES[domain] ?? DOMAIN_PALETTES.unknown;
  const id = `${slug}-${sectionId}-${intent}-${sectionIdx}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  const uiHintBase = `${domain} продукт: ${brief.product}. ${brief.mainPromise}. Главное визуальное обещание для аудитории: ${(brief.audience ?? []).join(', ') || 'не определена'}.`;
  const uiHint = intent.includes('hero')
    ? `Hero dashboard для лендинга. ${uiHintBase}`
    : intent.includes('media')
      ? `Boxed UI showcase для MediaCopy секции. ${uiHintBase}`
      : uiHintBase;

  const draft = {
    id,
    scene: intent.includes('hero') ? 'device_showcase' : 'metaphor',
    palette,
    devices: intent.includes('hero')
      ? [{ type: 'laptop', uiHint, position: { x: 0, y: 0, scale: 1 } }]
      : [],
    decorations: [],
    glow: { enabled: true, centerX: 1500, centerY: 380, radius: 580 },
    viewBox: { x: 0, y: -220, width: 2150, height: 1420 },
  };

  // Прогоняем через schema для default-fill полей и type safety.
  return IllustrationSpecSchema.parse(draft);
}

/**
 * Semantic fingerprint IllustrationSpec — sha256 от key полей.
 * Используется для cross-landing dedup (две специ с одним fingerprint =
 * один и тот же визуал).
 */
function semanticFingerprint(spec: IllustrationSpec): string {
  const tokens = [
    spec.scene,
    spec.palette.accent,
    spec.palette.glowDark,
    spec.devices.map((d) => `${d.type}:${d.uiHint.slice(0, 80)}`).join('|'),
    spec.decorations.map((d) => d.type).join('|'),
  ].join('||');
  return createHash('sha256').update(tokens).digest('hex').slice(0, 16);
}

/**
 * Определяет для каждой визуальной секции, нужно ли:
 *   - reuse-mock (есть подходящий mock в домене — текущий выбор),
 *   - generate-svg (mock не подходит или явно customIllustrationId уже стоит),
 *   - no-op (секция без визуального слота, либо visual=null).
 */
export async function allocateIllustrations(
  spec: LandingSpec,
  brief: Brief,
  options: AllocateIllustrationsOptions = {},
): Promise<AllocateIllustrationsResult> {
  const domain = options.overrideDomain ?? resolveDomainFromBrief(brief);
  const entry = getDomainEntry(domain);
  const allowedVariants = new Set(entry?.mocks.map((m) => m.variant) ?? []);
  const decisions: AllocationDecision[] = [];
  const suggestions: string[] = [];
  const illustrationsToGenerate: IllustrationSpec[] = [];

  // Load existing fingerprints для anti-duplication (передаются в LLM как
  // «не повторяй эти композиции»).
  const usageRegistry =
    options.usageRegistry ?? (options.root ? await loadUsageRegistry(options.root) : undefined);
  const existingFingerprints = new Set<string>();
  if (usageRegistry) {
    for (const entry of usageRegistry.entries) {
      if (entry.fingerprint) existingFingerprints.add(entry.fingerprint);
    }
  }

  const slug = (spec.meta?.layout ?? 'landing').toString();

  function pushGenerateSvg(opts: {
    sectionIdx: number;
    sectionId: string;
    intent: string;
    customIdHint?: string;
    rationale: string;
  }) {
    const illustrationSpec = buildIllustrationSpec({
      slug,
      sectionId: opts.sectionId,
      sectionIdx: opts.sectionIdx,
      intent: opts.intent,
      domain,
      brief,
    });
    const fingerprint = semanticFingerprint(illustrationSpec);
    illustrationsToGenerate.push(illustrationSpec);
    decisions.push({
      sectionIdx: opts.sectionIdx,
      sectionId: opts.sectionId,
      intent: opts.intent,
      decision: 'generate-svg',
      illustrationId: opts.customIdHint ?? illustrationSpec.id,
      rationale: `${opts.rationale} fingerprint=${fingerprint}.`,
      illustrationSpec,
    });
  }

  spec.sections.forEach((section, idx) => {
    if (section.component === 'HeroSection') {
      const v = section.props.visual?.variant;
      const customId = section.props.visual?.illustrationId;
      if (customId) {
        pushGenerateSvg({
          sectionIdx: idx,
          sectionId: section.id,
          intent: 'hero-illustration',
          customIdHint: customId,
          rationale: 'customIllustrationId уже задан — генерируем SVG по spec.',
        });
      } else if (v && v !== 'generic' && allowedVariants.has(v)) {
        decisions.push({
          sectionIdx: idx,
          sectionId: section.id,
          intent: 'hero-mock',
          decision: 'reuse-mock',
          variant: v,
          rationale: `mock '${v}' подходит для домена '${domain}'.`,
        });
      } else if (v === 'generic' || !v) {
        decisions.push({
          sectionIdx: idx,
          sectionId: section.id,
          intent: 'hero-fallback',
          decision: 'no-op',
          rationale: 'Hero без визуала или generic — нужен фокусный mock либо SVG.',
        });
        suggestions.push(
          `[P8] sections[${idx}] Hero без domain-specific mock'а. ` +
            `Рекомендация: выбери variant из домена '${domain}' (${entry?.mocks.map((m) => m.variant).join(', ') ?? 'нет mocks'}) ` +
            'либо сгенерируй уникальную SVG по packages/harness/src/prompts/svg-illustration-skill.md.',
        );
      }
      return;
    }
    if (section.component === 'MediaCopy') {
      const v = section.props.mediaVariant;
      const customId = section.props.customIllustrationId;
      if (customId) {
        pushGenerateSvg({
          sectionIdx: idx,
          sectionId: section.id,
          intent: 'media-illustration',
          customIdHint: customId,
          rationale: 'customIllustrationId уже задан — генерируем SVG по spec.',
        });
      } else if (v && v !== 'default' && allowedVariants.has(v)) {
        decisions.push({
          sectionIdx: idx,
          sectionId: section.id,
          intent: 'media-mock',
          decision: 'reuse-mock',
          variant: v,
          rationale: `mock '${v}' подходит для домена '${domain}'.`,
        });
      } else {
        decisions.push({
          sectionIdx: idx,
          sectionId: section.id,
          intent: 'media-fallback',
          decision: 'no-op',
          rationale: 'MediaCopy без domain-mock\'а — нужен conscious выбор.',
        });
        suggestions.push(
          `[P8] sections[${idx}] MediaCopy без domain-specific mock'а. ` +
            `Подбери mediaVariant из домена '${domain}' либо задай customIllustrationId.`,
        );
      }
    }
  });

  return {
    domain,
    decisions,
    suggestions,
    illustrationsToGenerate,
    existingFingerprints: [...existingFingerprints],
  };
}

/**
 * Записывает решения allocation в spec.meta.illustrationAllocations.
 * Возвращает обновлённый spec (immutable не-обязательно — apply мутирует
 * spec до сохранения).
 */
export function applyAllocationsToSpec(
  spec: LandingSpec,
  result: AllocateIllustrationsResult,
): LandingSpec {
  spec.meta = {
    ...(spec.meta ?? {}),
    sources: spec.meta?.sources ?? [],
    illustrationAllocations: result.decisions.map((d) => ({
      sectionIdx: d.sectionIdx,
      sectionId: d.sectionId,
      intent: d.intent,
      decision: d.decision,
      variant: d.variant,
      illustrationId: d.illustrationId,
    })),
    domain: result.domain,
  };
  return spec;
}

/**
 * Path convention для autogenerated TSX-иллюстраций.
 * `packages/ui/src/illustrations/generated/<domain>/<intent>/<Name>.tsx`
 */
export function illustrationTsxPath(domain: Domain, intent: string, id: string): string {
  const componentName = pascalCaseFromId(id);
  const intentKebab = intent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `packages/ui/src/illustrations/generated/${domain}/${intentKebab}/${componentName}.tsx`;
}

export function illustrationMetaPath(domain: Domain, intent: string, id: string): string {
  const componentName = pascalCaseFromId(id);
  const intentKebab = intent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `packages/ui/src/illustrations/generated/${domain}/${intentKebab}/${componentName}.meta.json`;
}

function pascalCaseFromId(id: string): string {
  return id
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Metadata для сохранённой SVG-иллюстрации (рядом с .tsx файлом).
 */
export interface IllustrationMeta {
  id: string;
  domain: Domain;
  intent: string;
  fingerprint: string;
  semanticHash: string;
  briefSlug?: string;
  generatedAt: string;
  scene: string;
  uiHints: string[];
}
