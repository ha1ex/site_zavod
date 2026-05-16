/**
 * Интеграционный слой для repair-loop'а.
 *
 * Эта ветка (ha1ex/karpathy-harness-optimize) форкнулась от main до merge'а
 * stage-4 (validators + repair loop). Сам `pipeline/repair.ts` появится после merge'а.
 *
 * Пока — этот файл предоставляет **готовый билдер repair-message'а**, который
 * другая ветка просто подключит:
 *
 *   import { buildRepairMessageWithLessons } from '@buffalo/harness/wiki';
 *   runWithRepair({ buildRepairMessage: buildRepairMessageWithLessons, ... });
 *
 * Также экспортирует `extractLessonFromIncident` — для пост-фактум обогащения
 * `wiki/lessons.md` после успешного repair.
 */

import type { Lesson } from './lessons-loader';
import { findRelevantLessons, formatLessonsForRepair, loadLessons } from './lessons-loader';

export interface RepairContext {
  previousSpec: unknown;
  validationErrors: Array<{ path: string; message: string; code?: string }>;
  archetype?: string;
  audiences?: string[];
}

/**
 * Building block для buildRepairMessage в pipeline/repair.ts.
 *
 * Принимает контекст ошибок, грузит lessons.md, возвращает дополнительный
 * markdown-блок, который имеет смысл подмешать в user-prompt repair'а.
 *
 * Если lessons.md пуст или совпадений нет — возвращает пустую строку.
 */
export async function buildLessonsHint(repoRoot: string, ctx: RepairContext): Promise<string> {
  const lessons = await loadLessons(repoRoot);
  if (lessons.length === 0) return '';
  const relevant = findRelevantLessons({
    lessons,
    errorPaths: ctx.validationErrors.map((e) => e.path),
    archetype: ctx.archetype,
    audiences: ctx.audiences,
  });
  return formatLessonsForRepair(relevant);
}

/**
 * Композирует full repair-message с уроки прошлого:
 *   <user prompt> + <validation errors block> + <relevant lessons block>
 *
 * Pipeline/repair.ts (после merge stage-4) использует это так:
 *
 *   const message = await composeRepairMessage(repoRoot, {
 *     basePrompt: userPrompt,
 *     errors: validationErrors,
 *     previousSpecJson: JSON.stringify(prev),
 *     archetype: brief.pageArchetype,
 *     audiences: brief.audience,
 *   });
 *
 * Тут — лишь пример композиции; конкретный формат адаптируется к API repair.ts.
 */
export interface ComposeRepairMessageInput {
  basePrompt: string;
  errors: Array<{ path: string; message: string; code?: string }>;
  previousSpecJson: string;
  archetype?: string;
  audiences?: string[];
}

export async function composeRepairMessage(repoRoot: string, input: ComposeRepairMessageInput): Promise<string> {
  const lessons = await buildLessonsHint(repoRoot, {
    previousSpec: undefined,
    validationErrors: input.errors,
    archetype: input.archetype,
    audiences: input.audiences,
  });

  const errorsBlock = input.errors
    .map((e) => `- \`${e.path}\`: ${e.message}${e.code ? ` (code=${e.code})` : ''}`)
    .join('\n');

  return `${input.basePrompt}

## Previous spec (invalid — fix it, don't regenerate from scratch)

\`\`\`json
${input.previousSpecJson}
\`\`\`

## Validation errors

${errorsBlock || '_(no structured errors)_'}
${lessons}

Return ONE corrected JSON object. Address each error path above. Honor lessons (if any).`;
}

/**
 * После успешного repair: предложить LLM извлечь правило, чтобы записать его в lessons.md.
 * Это пока — заготовка функции, реальный LLM-вызов — в pipeline/repair.ts (после stage-4).
 */
export interface ProposedLessonFromIncident {
  slug: string;
  rule: string;
  constraint: string;
  appliesTo: string;
  reason: string;
}

export function suggestLessonFromIncident(input: {
  errors: Array<{ path: string; message: string }>;
  archetype?: string;
}): ProposedLessonFromIncident | null {
  if (input.errors.length === 0) return null;
  const e = input.errors[0]!;
  const constraint = e.path.replace(/sections\[\d+\]\.props\./, '').replace(/\[\d+\]/g, '');
  const slug = `${input.archetype ?? 'general'}-${constraint.replace(/\./g, '-')}`.toLowerCase();
  return {
    slug,
    rule: `Avoid the error: ${e.message}`,
    constraint,
    appliesTo: input.archetype ?? 'any',
    reason: 'extracted automatically from repair incident',
  };
}

export type { Lesson };
