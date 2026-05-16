/**
 * lessons-loader — извлекает релевантные правила из wiki/lessons.md по типу ошибки.
 *
 * Формат записи (см. wiki/lessons.md):
 *   ## <slug>
 *   - **rule:** ...
 *   - **constraint:** subtitle.length | hero.headline.tone | ...
 *   - **applies_to:** archetype/audience/...
 *   - **reason:** ...
 *   - **first_observed:** ...
 *
 * Используется в repair-loop (после merge ветки со stage-4 — `pipeline/repair.ts`):
 *   - При validation-ошибке выбираем lessons, у которых `constraint` matches type ошибки.
 *   - Если совпадений нет — возвращаем пустой массив (repair работает без подсказок).
 *   - При успешном repair можно дополнять lessons.md новыми правилами (LLM-extract).
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export interface Lesson {
  slug: string;
  rule: string;
  constraint: string;
  appliesTo?: string;
  reason?: string;
  firstObserved?: string;
  raw: string;
}

const LESSON_HEADING = /^##\s+([\w-]+)\s*$/;

export async function loadLessons(repoRoot: string): Promise<Lesson[]> {
  const path = resolve(repoRoot, 'wiki', 'lessons.md');
  const raw = await readFile(path, 'utf-8').catch(() => '');
  return parseLessons(raw);
}

export function parseLessons(content: string): Lesson[] {
  const lines = content.split(/\r?\n/);
  const result: Lesson[] = [];

  let current: Lesson | null = null;
  let buffer: string[] = [];

  const finalize = () => {
    if (!current) return;
    current.raw = buffer.join('\n').trim();
    if (current.rule || current.constraint) result.push(current);
  };

  for (const line of lines) {
    const headingMatch = line.match(LESSON_HEADING);
    if (headingMatch && headingMatch[1]) {
      finalize();
      current = { slug: headingMatch[1], rule: '', constraint: '', raw: '' };
      buffer = [line];
      continue;
    }
    if (!current) continue;
    buffer.push(line);
    const ruleMatch = line.match(/^-\s+\*\*rule:\*\*\s+(.+)$/i);
    const constraintMatch = line.match(/^-\s+\*\*constraint:\*\*\s+(.+)$/i);
    const appliesMatch = line.match(/^-\s+\*\*applies_to:\*\*\s+(.+)$/i);
    const reasonMatch = line.match(/^-\s+\*\*reason:\*\*\s+(.+)$/i);
    const firstMatch = line.match(/^-\s+\*\*first_observed:\*\*\s+(.+)$/i);
    if (ruleMatch?.[1]) current.rule = ruleMatch[1].trim();
    if (constraintMatch?.[1]) current.constraint = constraintMatch[1].trim();
    if (appliesMatch?.[1]) current.appliesTo = appliesMatch[1].trim();
    if (reasonMatch?.[1]) current.reason = reasonMatch[1].trim();
    if (firstMatch?.[1]) current.firstObserved = firstMatch[1].trim();
  }

  finalize();
  return result;
}

/**
 * Найти lessons, релевантные конкретной ошибке validation.
 *
 * `errorPaths` — массив строковых путей валидации (например, "sections[0].props.subtitle").
 * Матчинг:
 *   - Прямое совпадение constraint и пути (subtitle.length matches sections.*.props.subtitle).
 *   - Прямое совпадение по slug или substring.
 *   - Fallback: по archetype/audience через applies_to (если переданы).
 */
export interface FindRelevantLessonsInput {
  lessons: Lesson[];
  errorPaths: string[];
  archetype?: string;
  audiences?: string[];
}

export function findRelevantLessons(input: FindRelevantLessonsInput): Lesson[] {
  const { lessons, errorPaths, archetype, audiences } = input;
  const matches: Lesson[] = [];

  for (const lesson of lessons) {
    if (!lesson.constraint) continue;
    const constraintKey = lesson.constraint.toLowerCase();

    let pathMatch = false;
    for (const ep of errorPaths) {
      const epLower = ep.toLowerCase();
      if (
        epLower.includes(constraintKey) ||
        constraintKey.split('.').every((p) => epLower.includes(p))
      ) {
        pathMatch = true;
        break;
      }
    }

    if (pathMatch) {
      matches.push(lesson);
      continue;
    }

    if (lesson.appliesTo) {
      const applies = lesson.appliesTo.toLowerCase();
      if (archetype && applies.includes(archetype.toLowerCase())) {
        matches.push(lesson);
        continue;
      }
      if (audiences && audiences.some((a) => applies.includes(a.toLowerCase()))) {
        matches.push(lesson);
        continue;
      }
    }
  }

  return matches;
}

/**
 * Форматирует выбранные lessons как блок для встраивания в repair-prompt.
 */
export function formatLessonsForRepair(lessons: Lesson[]): string {
  if (lessons.length === 0) return '';
  const lines: string[] = ['', '## Relevant lessons from prior generations (must apply)', ''];
  for (const l of lessons) {
    lines.push(`- **${l.slug}** [${l.constraint}]: ${l.rule}`);
    if (l.reason) lines.push(`  - Why: ${l.reason}`);
  }
  return lines.join('\n');
}

/**
 * Добавляет новое правило в wiki/lessons.md (append). Если slug уже есть — не дублирует,
 * вместо этого возвращает { added: false }. Создаёт файл если отсутствует.
 */
export interface AppendLessonInput {
  slug: string;
  rule: string;
  constraint: string;
  appliesTo?: string;
  reason?: string;
}

export async function appendLesson(repoRoot: string, input: AppendLessonInput, now: Date = new Date()): Promise<{ added: boolean; path: string }> {
  const path = resolve(repoRoot, 'wiki', 'lessons.md');
  const existing = await readFile(path, 'utf-8').catch(() => '');
  if (existing.includes(`## ${input.slug}\n`) || existing.includes(`## ${input.slug}\r\n`)) {
    return { added: false, path };
  }
  const today = formatDate(now);
  const block = [
    '',
    `## ${input.slug}`,
    `- **rule:** ${input.rule}`,
    `- **constraint:** ${input.constraint}`,
    `- **applies_to:** ${input.appliesTo ?? 'any'}`,
    `- **reason:** ${input.reason ?? '(not specified)'}`,
    `- **first_observed:** ${today}`,
    '',
  ].join('\n');
  await writeFile(path, existing.trimEnd() + '\n' + block, 'utf-8');
  return { added: true, path };
}

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
