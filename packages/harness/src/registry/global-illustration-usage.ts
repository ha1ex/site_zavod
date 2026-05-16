import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { z } from 'zod';
import type { LandingSpec } from '../schemas/landing-spec';
import type { Domain } from './domain-visual';

/**
 * Global illustration / mock usage registry.
 *
 * Хранит cross-landing статистику: какой mock-variant использовался в каком
 * лендинге, в каком домене, в какой секции. На основе этих данных
 * cross-landing-diversity валидатор ловит:
 *   - повторное использование того же mock\'а во многих лендингах одного домена
 *     (mock-overused-globally);
 *   - идентичные структуры layout (landing-structure-duplicate через
 *     fingerprintLanding).
 *
 * Хранилище: content/illustrations/registry.json (append-only по сути,
 * но физически — read-modify-write с atomic rename для устойчивости при
 * параллельных запусках harness).
 */

export const UsageEntrySchema = z.object({
  kind: z.enum(['mock-use', 'svg-generated']),
  variant: z.string(),
  landingSlug: z.string(),
  sectionId: z.string(),
  sectionIdx: z.number().int().nonnegative(),
  domain: z.string(),
  fingerprint: z.string().optional(),
  recordedAt: z.string(),
});

export type UsageEntry = z.infer<typeof UsageEntrySchema>;

export const UsageRegistrySchema = z.object({
  version: z.literal(1),
  updatedAt: z.string(),
  entries: z.array(UsageEntrySchema),
});

export type UsageRegistry = z.infer<typeof UsageRegistrySchema>;

const REGISTRY_REL_PATH = 'content/illustrations/registry.json';

/**
 * Прочитать registry. Если файла нет — возвращаем пустой.
 */
export async function loadUsageRegistry(root: string): Promise<UsageRegistry> {
  const abs = resolve(root, REGISTRY_REL_PATH);
  try {
    const raw = await readFile(abs, 'utf-8');
    return UsageRegistrySchema.parse(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return { version: 1, updatedAt: new Date().toISOString(), entries: [] };
    }
    throw err;
  }
}

/**
 * Атомарная запись registry: пишем во временный файл, затем rename.
 */
export async function saveUsageRegistry(root: string, registry: UsageRegistry): Promise<void> {
  const abs = resolve(root, REGISTRY_REL_PATH);
  const tmp = `${abs}.tmp-${process.pid}-${Date.now()}`;
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(tmp, JSON.stringify(registry, null, 2) + '\n', 'utf-8');
  await rename(tmp, abs);
}

/**
 * Записать использование mock-варианта в данном лендинге.
 * Идемпотентно: если запись с тем же (landingSlug, sectionIdx, variant) уже
 * есть — заменяет recordedAt, не дублирует. Это нужно для regenerate лендинга.
 */
export async function recordMockUse(
  root: string,
  params: {
    variant: string;
    landingSlug: string;
    sectionId: string;
    sectionIdx: number;
    domain: Domain;
  },
): Promise<void> {
  const registry = await loadUsageRegistry(root);
  registry.entries = registry.entries.filter(
    (e) =>
      !(
        e.landingSlug === params.landingSlug &&
        e.sectionIdx === params.sectionIdx &&
        e.variant === params.variant
      ),
  );
  registry.entries.push({
    kind: 'mock-use',
    variant: params.variant,
    landingSlug: params.landingSlug,
    sectionId: params.sectionId,
    sectionIdx: params.sectionIdx,
    domain: params.domain,
    recordedAt: new Date().toISOString(),
  });
  registry.updatedAt = new Date().toISOString();
  await saveUsageRegistry(root, registry);
}

/**
 * Удалить все записи о текущем лендинге (для чистой регенерации).
 * Вызывается перед серией recordMockUse при regenerate.
 */
export async function clearLandingUsage(root: string, landingSlug: string): Promise<void> {
  const registry = await loadUsageRegistry(root);
  const before = registry.entries.length;
  registry.entries = registry.entries.filter((e) => e.landingSlug !== landingSlug);
  if (registry.entries.length !== before) {
    registry.updatedAt = new Date().toISOString();
    await saveUsageRegistry(root, registry);
  }
}

/**
 * Подсчёт глобального использования variant'а в данном домене (не считая
 * текущий лендинг — он будет переписан вновь).
 */
export function countMockUsesGlobal(
  registry: UsageRegistry,
  params: { variant: string; domain: Domain; excludeSlug?: string },
): number {
  return registry.entries.filter(
    (e) =>
      e.variant === params.variant &&
      e.domain === params.domain &&
      e.landingSlug !== params.excludeSlug,
  ).length;
}

/**
 * Уникальные слаги лендингов в registry.
 */
export function listLandingSlugs(registry: UsageRegistry): string[] {
  const slugs = new Set<string>();
  for (const e of registry.entries) slugs.add(e.landingSlug);
  return [...slugs];
}

/**
 * Все записи для конкретного лендинга — для построения fingerprint и сравнения.
 */
export function listUsagesForLanding(registry: UsageRegistry, slug: string): UsageEntry[] {
  return registry.entries.filter((e) => e.landingSlug === slug);
}

/**
 * Fingerprint лендинга: sha256 от sorted sequence (component:sectionId).
 * Используется для landing-structure-duplicate проверки. Не зависит от
 * конкретных variants — только от структуры компонентов.
 */
export function fingerprintLandingStructure(spec: LandingSpec): string {
  const sequence = spec.sections.map((s) => `${s.component}:${s.id}`).join('|');
  return createHash('sha256').update(sequence).digest('hex').slice(0, 16);
}

/**
 * Semantic-fingerprint: учитывает не только структуру, но и выбранные variant'ы.
 * Два лендинга с одинаковой структурой и одинаковыми variants — один и тот же
 * с точностью до копи. Сильный сигнал для landing-copy-similarity.
 */
export function fingerprintLandingSemantics(spec: LandingSpec): string {
  const parts: string[] = [];
  spec.sections.forEach((s) => {
    const variants: string[] = [];
    if (s.component === 'HeroSection' && s.props.visual?.variant) {
      variants.push(`hero:${s.props.visual.variant}`);
    } else if (s.component === 'MediaCopy' && s.props.mediaVariant) {
      variants.push(`media:${s.props.mediaVariant}`);
    } else if (s.component === 'TabbedFeatureSection') {
      s.props.tabs.forEach((tab, i) => variants.push(`tab[${i}]:${tab.mockVariant}`));
    } else if (s.component === 'ScenarioWalkthroughSection') {
      s.props.steps.forEach((step, i) => variants.push(`scenario[${i}]:${step.mockVariant}`));
    }
    parts.push(`${s.component}:${s.id}${variants.length ? `(${variants.join(',')})` : ''}`);
  });
  return createHash('sha256').update(parts.join('|')).digest('hex').slice(0, 16);
}

/**
 * Levenshtein distance между двумя последовательностями section component-id.
 * Используется для landing-structure-duplicate: distance < 3 + одинаковый
 * layout = warn о структурном дублировании.
 */
export function structureDistance(specA: LandingSpec, specB: LandingSpec): number {
  const a = specA.sections.map((s) => `${s.component}:${s.id}`);
  const b = specB.sections.map((s) => `${s.component}:${s.id}`);
  return levenshtein(a, b);
}

function levenshtein(a: string[], b: string[]): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i]![0] = i;
  for (let j = 0; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost,
      );
    }
  }
  return dp[a.length]![b.length]!;
}
