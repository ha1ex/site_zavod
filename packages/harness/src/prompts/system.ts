import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describeRegistry } from '../registry/index';
import { findRepoRoot, loadDesignSystem as loadDesignSystemPages } from '../wiki/load-design-system';
import { selectContext } from '../wiki/select-context';
import { loadLayoutPlaybook } from '../wiki/load-layouts';
import { parseFrontmatter } from '../wiki/frontmatter';
import type { Brief } from '../schemas/brief';
import type { IllustrationSpec } from '../schemas/illustration-spec';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface BuildSystemPromptResult {
  system: string;
  sources: string[];
  archetype?: string;
  tokenEstimate?: number;
}

export interface BuildSystemPromptOptions {
  /**
   * Если передан — собираем контекст селективно по archetype/audience/goal (stage-8 M4a).
   * Если не передан — fallback на полный wiki/design-system/*.md.
   */
  brief?: Brief;
  /** Force full DS даже при наличии brief — для отладки и сравнения промптов. */
  fullContext?: boolean;
}

async function loadLegacyDesignSystem(): Promise<string> {
  const dsPath = resolve(__dirname, 'design-system-kaiten.md');
  return readFile(dsPath, 'utf-8').catch(() => '(design system not loaded)');
}

async function loadConversionLandingSkill(): Promise<string> {
  const skillPath = resolve(__dirname, '../skills/conversion-landing.md');
  return readFile(skillPath, 'utf-8').catch(() => '');
}

async function loadIllustrationSkill(): Promise<string> {
  const path = resolve(__dirname, 'svg-illustration-skill.md');
  return readFile(path, 'utf-8').catch(() => '(svg illustration skill not loaded)');
}

async function loadSectionMockSkill(): Promise<string> {
  const path = resolve(__dirname, 'section-mock-skill.md');
  return readFile(path, 'utf-8').catch(() => '');
}

// Брендовый канон Kaiten — источник истины по тону, продуктовым фактам и языку (§9/§10/§11).
const BRAND_CANON_FILES = [
  'wiki/brand/redpolitika.md',
  'wiki/references/kaiten-product-facts.md',
  'wiki/references/anglicism-dictionary.md',
];

/**
 * Грузит брендовый канон Kaiten в КАЖДЫЙ system-prompt — вне зависимости от DS-режима
 * (selective / full / legacy). Имеет наивысший приоритет: при конфликте с design-system,
 * layout или брифом выигрывает канон. Возвращает body (без frontmatter) + sources для traceability.
 */
async function loadBrandCanon(repoRoot: string): Promise<{ body: string; sources: string[] }> {
  const blocks: string[] = [];
  const sources: string[] = [];
  for (const rel of BRAND_CANON_FILES) {
    const content = await readFile(resolve(repoRoot, rel), 'utf-8').catch(() => null);
    if (!content) continue;
    blocks.push(parseFrontmatter(content).body.trim());
    sources.push(rel);
  }
  return { body: blocks.join('\n\n---\n\n'), sources };
}

/**
 * Внутренняя функция — собирает контент и список sources.
 *
 * Режимы (по убыванию приоритета):
 *   1. Selective (stage-8 M4a). При наличии brief и без fullContext — селективная
 *      сборка через selectContext (по archetype/audience/components).
 *   2. Full wiki. wiki/design-system/*.md + опционально conversion-landing.md.
 *   3. Legacy fallback. packages/harness/src/prompts/design-system-kaiten.md +
 *      conversion-landing.md (при отсутствии wiki/).
 */
async function composeDesignSystemBlock(options: BuildSystemPromptOptions): Promise<{
  body: string;
  sources: string[];
  archetype?: string;
  tokenEstimate?: number;
}> {
  const repoRoot = await findRepoRoot(__dirname);

  // 1. Селективный режим
  if (options.brief && !options.fullContext) {
    const selected = await selectContext(repoRoot, options.brief);
    if (selected.body.trim()) {
      return {
        body: selected.body,
        sources: selected.sources,
        archetype: selected.archetype,
        tokenEstimate: selected.tokenEstimate,
      };
    }
  }

  // 2. Full wiki + conversion-landing
  const wikiDS = await loadDesignSystemPages(repoRoot);
  if (wikiDS.body.trim()) {
    const conversionLanding = await loadConversionLandingSkill();
    const blocks: string[] = [wikiDS.body];
    const sources = [...wikiDS.sources];
    if (conversionLanding.trim()) {
      blocks.push(conversionLanding);
      sources.push('packages/harness/src/skills/conversion-landing.md');
    }
    return { body: blocks.join('\n\n---\n\n'), sources };
  }

  // 3. Legacy fallback
  const legacyDS = await loadLegacyDesignSystem();
  const conversionLanding = await loadConversionLandingSkill();
  const blocks: string[] = [legacyDS];
  const sources = ['packages/harness/src/prompts/design-system-kaiten.md (legacy)'];
  if (conversionLanding.trim()) {
    blocks.push(conversionLanding);
    sources.push('packages/harness/src/skills/conversion-landing.md');
  }
  return { body: blocks.join('\n\n---\n\n'), sources };
}

/**
 * Собирает system prompt для LLM-генерации LandingSpec (backwards-compatible API).
 *
 * Возвращает только строку — для stage-4 repair-loop и любых других callers,
 * которые не нуждаются в metadata (sources, archetype, tokenEstimate).
 *
 * Для filing back и token-tracking используй `buildLandingSystemPromptWithMeta`.
 */
export async function buildLandingSystemPrompt(
  options: BuildSystemPromptOptions = {},
): Promise<string> {
  const { system } = await buildLandingSystemPromptWithMeta(options);
  return system;
}

/**
 * Расширенная версия `buildLandingSystemPrompt` (stage-8): возвращает system + sources.
 * Используется в `generateLandingSpecWithLLMResult` для filing back в wiki/landings/<slug>.md.
 */
export async function buildLandingSystemPromptWithMeta(
  options: BuildSystemPromptOptions = {},
): Promise<BuildSystemPromptResult> {
  const ds = await composeDesignSystemBlock(options);
  const sectionMockSkill = await loadSectionMockSkill();
  const repoRoot = await findRepoRoot(__dirname);
  const layoutPlaybook = await loadLayoutPlaybook(repoRoot, options.brief?.pageLayout);
  const brandCanon = await loadBrandCanon(repoRoot);

  const sources = [...brandCanon.sources, ...ds.sources];
  if (sectionMockSkill.trim()) {
    sources.push('packages/harness/src/prompts/section-mock-skill.md');
  }
  sources.push(...layoutPlaybook.sources);

  const mockUiSection = sectionMockSkill.trim()
    ? `

## Section Mock skill (правила mock-UI внутри секций)

Любая визуальная секция (HeroSection, MediaCopy, FeatureGrid, FinalCta) обязана выбрать осознанный mock-вариант. ЗАПРЕЩЕНО оставлять \`mediaVariant: 'default'\` или \`visual.variant: 'generic'\` ради экономии — это создаёт однотипные лендинги. Если ни один существующий variant не подходит — попроси разработчика добавить новый mock-компонент по правилам ниже, потом продолжай spec.

Шаблоны (\`board\`, \`chat\`, \`checklist\`, \`article\`, \`kpi\`, \`console\`), hard/soft-rules, чек-лист самопроверки и anti-patterns — ниже.

${sectionMockSkill}`
    : '';

  const layoutSection = layoutPlaybook.body.trim()
    ? `

## Layout playbook (обязательная структура и mock-рекомендации для выбранного layout)

ПРЯМАЯ ИНСТРУКЦИЯ: следуй порядку секций и per-slot mock-рекомендациям из layout-плейбука ниже. Не миксуй порядок «по вкусу» — это и приводило к однотипным лендингам. Если в брифе указан \`pageLayout\`, используй именно его layout; если нет — изучи index и выбери осознанно (опиши свой выбор в spec.meta.layout).

${layoutPlaybook.body}`
    : '';

  const brandCanonSection = brandCanon.body.trim()
    ? `## Брендовый канон Kaiten — ИСТОЧНИК ИСТИНЫ (приоритет над всем ниже)

При конфликте этих правил с design-system, layout-плейбуком или брифом — выигрывают эти. Это редполитика Kaiten (тон, имя продукта Kaiten/Кайтен, запрет пустых лозунгов), продуктовые факты (позиционирование, тарифы, канбан-метод/скрам-фреймворк) и словарь англицизмов (§10). На маркетинговой поверхности — русский язык без англицизмов с понятным русским аналогом; канбан/скрам кириллицей; имена сервисов не переводим.

${brandCanon.body}

`
    : '';

  const system = `You are a senior product copywriter and UI architect operating inside a controlled harness for generating SaaS landing pages.

Your job is NOT to invent layouts or copy from scratch — you ASSEMBLE a landing page from a fixed set of allowed components, using the user's brief and the layout playbook, and you OUTPUT a strictly structured JSON LandingSpec that downstream tools will render deterministically.

## Operator rules

- Never invent components that are not in the registry below.
- Never invent props that are not declared for a component.
- Never return prose, explanations, markdown or commentary — only the JSON object that matches the LandingSpec schema.
- Honor all length and structural constraints (title <= 80 chars, subtitle 10..200, etc.).
- One primary CTA per page that matches the brief's goal.
- Hero section must be the first section.
- Match the brand voice and language rules from the **Брендовый канон Kaiten** below — источник истины: \`wiki/brand/redpolitika.md\` + \`wiki/references/anglicism-dictionary.md\`. На маркетинговой поверхности — без англицизмов (landing→страница, CTA→кнопка действия, deadline→срок). Пустые лозунги и hype-слова блокируются валидаторами \`landing-brand\` и \`landing-language\`.
- Follow the conversion-landing skill (if present below) for page-type structure, awareness-aware H1 formulas, Feature → Benefit Transformation, CTA hierarchy, social proof rules, and anti-patterns.
- **Pick a layout from \`wiki/layouts/\` BEFORE writing sections.** Brief может уже содержать \`pageLayout\` — используй его. Если не указан, прочитай \`wiki/layouts/index.md\` и выбери осознанно. Запиши выбор в \`spec.meta.layout\`.
- **Mock authoring per section is MANDATORY.** Для каждой визуальной секции явно выбери mock-variant из реестра компонентов — НЕЛЬЗЯ оставлять \`mediaVariant: 'default'\` или \`visual.variant: 'generic'\` ради скорости. Это приводит к лендингам, где все блоки выглядят одинаково. Если нужен новый mock — попроси разработчика добавить компонент.

${brandCanonSection}## Component registry (allowed components only)

\`\`\`json
${describeRegistry()}
\`\`\`

## Kaiten V01 design system + archetype rules + conversion-landing skill

${ds.body}${layoutSection}${mockUiSection}

## Output

Return ONE JSON object that strictly matches the LandingSpec schema provided by the runtime. No text before or after. Don't forget to set \`spec.meta.layout\` to the chosen layout slug.`;

  return {
    system,
    sources,
    archetype: ds.archetype,
    tokenEstimate: ds.tokenEstimate,
  };
}

export function buildBriefPrompt(briefJson: string): string {
  return `Brief from product team:

\`\`\`json
${briefJson}
\`\`\`

Generate the LandingSpec now.`;
}

/**
 * Этап 3: system prompt для генерации TSX SVG-иллюстрации по IllustrationSpec.
 * Skill-инструкция (правила, AST-чек-лист) + Kaiten DS для палитры и стиля.
 */
export async function buildIllustrationSystemPrompt(): Promise<string> {
  const [skill, designSystem] = await Promise.all([
    loadIllustrationSkill(),
    loadLegacyDesignSystem(),
  ]);

  return `You are a senior frontend illustrator operating inside a deterministic build pipeline. You generate ONE TSX file containing a React SVG hero illustration matching a strict IllustrationSpec. Downstream, an AST validator checks your output — any rule violation fails the build and triggers repair.

${skill}

## Kaiten V01 design system (palette, neutrals, brand voice)

${designSystem}

## Output

Return ONLY the TSX file content. No markdown fences, no commentary. Start with the AUTO-GENERATED comment line.`;
}

export function buildIllustrationUserPrompt(spec: IllustrationSpec): string {
  return `IllustrationSpec to render:

\`\`\`json
${JSON.stringify(spec, null, 2)}
\`\`\`

Component id: \`${spec.id}\` → use PascalCase for the default-export function name.
Generate the TSX now.`;
}
