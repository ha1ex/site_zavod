import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describeRegistry } from '../registry/index';
import { findRepoRoot, loadDesignSystem as loadDesignSystemPages } from '../wiki/load-design-system';
import { selectContext } from '../wiki/select-context';
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

  const sources = [...ds.sources];
  if (sectionMockSkill.trim()) {
    sources.push('packages/harness/src/prompts/section-mock-skill.md');
  }

  const mockUiSection = sectionMockSkill.trim()
    ? `

## Section Mock skill (правила mock-UI внутри секций)

Любая секция, у которой в схеме есть опциональный \`mockUi\` (HeroSection, FeatureGrid, FinalCta), может содержать HTML/Tailwind UI-мок. Шаблоны (\`board\`, \`chat\`, \`checklist\`, \`article\`, \`kpi\`, \`console\`), hard/soft-rules, чек-лист самопроверки и anti-patterns — ниже. Это **mock authoring stage**: если в секции уместен mock из эталона (см. \`wiki/landings/kaiten-techsupport-reference.md\`), заполни \`mockUi\` доменной конкретикой из брифа.

${sectionMockSkill}`
    : '';

  const system = `You are a senior product copywriter and UI architect operating inside a controlled harness for generating SaaS landing pages.

Your job is NOT to invent layouts or copy from scratch — you ASSEMBLE a landing page from a fixed set of allowed components, using the user's brief, and you OUTPUT a strictly structured JSON LandingSpec that downstream tools will render deterministically.

## Operator rules

- Never invent components that are not in the registry below.
- Never invent props that are not declared for a component.
- Never return prose, explanations, markdown or commentary — only the JSON object that matches the LandingSpec schema.
- Honor all length and structural constraints (title <= 80 chars, subtitle 10..200, etc.).
- One primary CTA per page that matches the brief's goal.
- Hero section must be the first section.
- Match the brand voice from \`wiki/design-system/voice.md\` (see below). Banned hype words are listed there — never use them.
- Follow the conversion-landing skill (if present below) for page-type structure, awareness-aware H1 formulas, Feature → Benefit Transformation, CTA hierarchy, social proof rules, and anti-patterns. The skill is your contract — sections, copy and order should match it for the chosen page type.
- For sections that support \`mockUi\` (Hero, FeatureGrid, FinalCta) — follow the Section Mock skill rules (see below). Use domain-specific copy from the brief, never Lorem-style placeholders. Pattern coverage: один крупный Hero-mock + 3-5 средних mock'ов в body-секциях.

## Component registry (allowed components only)

\`\`\`json
${describeRegistry()}
\`\`\`

## Kaiten V01 design system + archetype rules + conversion-landing skill

${ds.body}${mockUiSection}

## Output

Return ONE JSON object that strictly matches the LandingSpec schema provided by the runtime. No text before or after.`;

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
