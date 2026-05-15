import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describeRegistry } from '../registry/index.js';
import type { IllustrationSpec } from '../schemas/illustration-spec.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadDesignSystem(): Promise<string> {
  const dsPath = resolve(__dirname, 'design-system-kaiten.md');
  return readFile(dsPath, 'utf-8').catch(() => '(design system not loaded)');
}

async function loadIllustrationSkill(): Promise<string> {
  const path = resolve(__dirname, 'svg-illustration-skill.md');
  return readFile(path, 'utf-8').catch(() => '(svg illustration skill not loaded)');
}

/**
 * Собирает system prompt для LLM-генерации LandingSpec.
 *
 * Слои контекста:
 *   1. Роль и задача (operator mindset, не "creative writer")
 *   2. Component registry — что разрешено использовать и какие props валидны
 *   3. Conversion-landing skill — page types, awareness, hero, копирайт, CTA, audit
 *   4. Kaiten V01 design system — токены, типографика, spacing, бренд
 *   5. Жёсткие правила вывода (JSON по schema, никакого свободного текста)
 *
 * Чем строже промпт — тем выше доля прохождений в validator'е с первого раза.
 */
export async function buildLandingSystemPrompt(): Promise<string> {
  const designSystem = await loadDesignSystem();

  const skillPath = resolve(__dirname, '../skills/conversion-landing.md');
  const conversionLanding = await readFile(skillPath, 'utf-8').catch(
    () => '(conversion-landing skill not loaded)',
  );

  return `You are a senior product copywriter and UI architect operating inside a controlled harness for generating SaaS landing pages.

Your job is NOT to invent layouts or copy from scratch — you ASSEMBLE a landing page from a fixed set of allowed components, using the user's brief, and you OUTPUT a strictly structured JSON LandingSpec that downstream tools will render deterministically.

## Operator rules

- Never invent components that are not in the registry below.
- Never invent props that are not declared for a component.
- Never return prose, explanations, markdown or commentary — only the JSON object that matches the LandingSpec schema.
- Honor all length and structural constraints (title <= 80 chars, subtitle 10..200, etc.).
- One primary CTA per page that matches the brief's goal.
- Hero section must be the first section.
- Match the brand voice from the brief — never use hype ("revolutionary", "10x", "AI magic", unsupported claims).
- Follow the conversion-landing skill below for page-type structure, awareness-aware H1 formulas, Feature → Benefit Transformation, CTA hierarchy, social proof rules, and anti-patterns. The skill is your contract — sections, copy and order should match it for the chosen page type.

## Component registry (allowed components only)

\`\`\`json
${describeRegistry()}
\`\`\`

## Conversion-landing skill (rulebook)

${conversionLanding}

## Kaiten V01 design system (style + voice context)

${designSystem}

## Output

Return ONE JSON object that strictly matches the LandingSpec schema provided by the runtime. No text before or after.`;
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
  const [skill, designSystem] = await Promise.all([loadIllustrationSkill(), loadDesignSystem()]);

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
