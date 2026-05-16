import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { z } from 'zod';
import type { PhaseContext, PhaseId, PhaseResult } from './types';

/**
 * Generic host-agent phase runner с per-phase repair-loop.
 *
 * Pattern для всех LLM-фаз (P1, P2, P4, P5, P6, P7, P8):
 *   1) Idempotent rerun: если artifact уже есть и валиден (schema + postValidate)
 *      — фаза возвращает status='ok' без действий.
 *   2) Если artifact отсутствует — пишет prompt в `<name>.prompt.md`, возвращает
 *      awaiting-host-agent.
 *   3) Если artifact есть, но валидация падает — backup в `<name>.invalid-<N>.json`,
 *      пишет `<name>.repair.md` с конкретными ошибками + suggestions, удаляет
 *      `<name>.json` чтобы host-agent перегенерировал. Counter attempts: max 3,
 *      после чего возвращает status='error' для эскалации.
 *
 * Это позволяет phased pipeline работать в любом host (Claude Code, Codex,
 * ChatGPT-with-files) без API-ключей и при этом давать LLM конкретный
 * фидбек на каждую итерацию.
 */

const MAX_REPAIR_ATTEMPTS = 3;

export interface HostAgentPhaseOptions<T> {
  phase: PhaseId;
  ctx: PhaseContext;
  /** Краткое название фазы для prompt'а (e.g. "Audience Intent Analysis"). */
  title: string;
  /** Описание задачи, попадает в prompt. Что должен сделать host-LLM. */
  taskDescription: string;
  /** Контекст, который LLM должен прочитать (другие артефакты, brief, registry). */
  contextBlocks: Array<{ heading: string; body: string }>;
  /** Schema для output'а — для validation после host-agent записи. */
  outputSchema: z.ZodTypeAny;
  /** Имя файла output'а в pipeline dir (без расширения). */
  outputName: string;
  /**
   * Опциональный semantic validator. Вызывается после успешной schema-валидации.
   * Если возвращает errors[] не пустой — фаза выпускает repair.md (если есть
   * attempts) либо status='error'.
   */
  postValidate?: (parsed: T) => Promise<{ errors: string[]; warnings: string[] }>;
  /** Override max attempts (default 3). */
  maxAttempts?: number;
}

interface AttemptsRecord {
  count: number;
  history: Array<{
    attemptNumber: number;
    timestamp: string;
    errors: string[];
  }>;
}

async function readAttempts(pipelineDir: string, outputName: string): Promise<AttemptsRecord> {
  const path = resolve(pipelineDir, `${outputName}.attempts.json`);
  try {
    const raw = await readFile(path, 'utf-8');
    return JSON.parse(raw) as AttemptsRecord;
  } catch {
    return { count: 0, history: [] };
  }
}

async function writeAttempts(
  pipelineDir: string,
  outputName: string,
  record: AttemptsRecord,
): Promise<void> {
  const path = resolve(pipelineDir, `${outputName}.attempts.json`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(record, null, 2) + '\n', 'utf-8');
}

export async function runHostAgentPhase<T>(
  options: HostAgentPhaseOptions<T>,
): Promise<PhaseResult> {
  const { phase, ctx, title, taskDescription, contextBlocks, outputSchema, outputName } = options;
  const maxAttempts = options.maxAttempts ?? MAX_REPAIR_ATTEMPTS;
  const messages: string[] = [];
  const errors: string[] = [];
  const pipelineDir = resolve(ctx.root, '.context', 'pipeline', ctx.slug);
  const outputPath = resolve(pipelineDir, `${outputName}.json`);
  const promptPath = resolve(pipelineDir, `${outputName}.prompt.md`);
  const repairPath = resolve(pipelineDir, `${outputName}.repair.md`);

  // Идемпотентный rerun: если артефакт уже есть — валидируем и возвращаем.
  let raw: string | undefined;
  try {
    raw = await readFile(outputPath, 'utf-8');
  } catch {
    // Файл не существует — нужен host-agent input.
  }

  if (raw !== undefined) {
    const parsed = outputSchema.safeParse(JSON.parse(raw));

    if (parsed.success) {
      // Schema OK — теперь semantic validation если задана.
      if (options.postValidate) {
        const sem = await options.postValidate(parsed.data as T);
        for (const w of sem.warnings) messages.push(`semantic warning: ${w}`);

        if (sem.errors.length > 0) {
          // Schema валидна, но семантика — нет. Triggering repair-loop.
          return handleValidationFailure({
            phase,
            ctx,
            outputName,
            pipelineDir,
            outputPath,
            promptPath,
            repairPath,
            invalidContent: raw,
            errors: sem.errors,
            failureKind: 'semantic',
            maxAttempts,
            messages,
            title,
            taskDescription,
            contextBlocks,
            outputSchema,
          });
        }
      }

      // Всё успешно — очищаем attempts (если были).
      try {
        await rm(resolve(pipelineDir, `${outputName}.attempts.json`));
      } catch {
        // ok если не было.
      }

      messages.push(`artifact уже существует и валиден: ${relative(ctx.root, outputPath)}`);
      return {
        phase,
        status: 'ok',
        artifactPath: outputPath,
        messages,
        errors,
      };
    } else {
      // Schema failure → repair-loop.
      return handleValidationFailure({
        phase,
        ctx,
        outputName,
        pipelineDir,
        outputPath,
        promptPath,
        repairPath,
        invalidContent: raw,
        errors: parsed.error.issues.map(
          (i) => `[${i.path.join('.') || 'root'}] ${i.message} (${i.code})`,
        ),
        failureKind: 'schema',
        maxAttempts,
        messages,
        title,
        taskDescription,
        contextBlocks,
        outputSchema,
      });
    }
  }

  // Первая итерация — нет artifact ещё. Эмитируем prompt.
  const schemaJson = z.toJSONSchema(outputSchema as z.ZodType, { reused: 'inline' });
  const prompt = buildPhasePrompt({
    phase,
    title,
    taskDescription,
    contextBlocks,
    schemaJson,
    outputPathRel: relative(ctx.root, outputPath),
  });

  await mkdir(dirname(promptPath), { recursive: true });
  await writeFile(promptPath, prompt, 'utf-8');

  // Reset attempts (новая phase, чистый старт).
  try {
    await rm(resolve(pipelineDir, `${outputName}.attempts.json`));
  } catch {
    // ok если не было.
  }

  messages.push(
    `prompt для host-agent: ${relative(ctx.root, promptPath)}. ` +
      `Запиши output в ${relative(ctx.root, outputPath)} и снова запусти orchestrator.`,
  );

  return {
    phase,
    status: 'awaiting-host-agent',
    promptPath,
    expectedOutputPath: outputPath,
    messages,
    errors,
  };
}

interface ValidationFailureParams {
  phase: PhaseId;
  ctx: PhaseContext;
  outputName: string;
  pipelineDir: string;
  outputPath: string;
  promptPath: string;
  repairPath: string;
  invalidContent: string;
  errors: string[];
  failureKind: 'schema' | 'semantic';
  maxAttempts: number;
  messages: string[];
  title: string;
  taskDescription: string;
  contextBlocks: Array<{ heading: string; body: string }>;
  outputSchema: z.ZodTypeAny;
}

async function handleValidationFailure(p: ValidationFailureParams): Promise<PhaseResult> {
  const attempts = await readAttempts(p.pipelineDir, p.outputName);
  const newCount = attempts.count + 1;

  // Перенесём невалидный artifact в backup (для аудита).
  const invalidBackupPath = resolve(
    p.pipelineDir,
    `${p.outputName}.invalid-${newCount}.json`,
  );
  try {
    await rename(p.outputPath, invalidBackupPath);
  } catch {
    // Если rename упал — оставим originals.
  }

  attempts.count = newCount;
  attempts.history.push({
    attemptNumber: newCount,
    timestamp: new Date().toISOString(),
    errors: p.errors,
  });
  await writeAttempts(p.pipelineDir, p.outputName, attempts);

  if (newCount >= p.maxAttempts) {
    p.messages.push(
      `attempts exhausted: ${newCount}/${p.maxAttempts}. ` +
        `Сохранена история: ${relative(p.ctx.root, resolve(p.pipelineDir, `${p.outputName}.attempts.json`))}. ` +
        `Невалидные артефакты: ${p.outputName}.invalid-1..${newCount}.json. ` +
        'Проверь вручную и удали repair.md + invalid-*.json чтобы начать заново.',
    );
    return {
      phase: p.phase,
      status: 'error',
      artifactPath: invalidBackupPath,
      messages: p.messages,
      errors: [
        `${p.failureKind} validation failed after ${newCount} attempts:`,
        ...p.errors,
      ],
    };
  }

  // Пишем repair.md для следующей попытки.
  const repair = buildRepairPrompt({
    phase: p.phase,
    title: p.title,
    taskDescription: p.taskDescription,
    contextBlocks: p.contextBlocks,
    schemaJson: z.toJSONSchema(p.outputSchema as z.ZodType, { reused: 'inline' }),
    outputPathRel: relative(p.ctx.root, p.outputPath),
    invalidContent: p.invalidContent,
    errors: p.errors,
    failureKind: p.failureKind,
    attemptNumber: newCount,
    maxAttempts: p.maxAttempts,
  });
  await writeFile(p.repairPath, repair, 'utf-8');

  p.messages.push(
    `${p.failureKind} validation failed (attempt ${newCount}/${p.maxAttempts}). ` +
      `Repair prompt: ${relative(p.ctx.root, p.repairPath)}. ` +
      `Поправь output по фидбеку и снова запусти orchestrator.`,
  );

  return {
    phase: p.phase,
    status: 'awaiting-host-agent',
    promptPath: p.repairPath,
    expectedOutputPath: p.outputPath,
    messages: p.messages,
    errors: [],
  };
}

function buildPhasePrompt(opts: {
  phase: PhaseId;
  title: string;
  taskDescription: string;
  contextBlocks: Array<{ heading: string; body: string }>;
  schemaJson: unknown;
  outputPathRel: string;
}): string {
  const fence = '```';
  const parts: string[] = [];

  parts.push(`# Buffalo phased pipeline — ${opts.phase} ${opts.title}`);
  parts.push('');
  parts.push(`> **Host-agent mode.** Этот prompt был эмитирован orchestrator'ом фазы ${opts.phase}.`);
  parts.push('> Прочитай context и task, напиши JSON по schema в указанный файл,');
  parts.push('> затем снова запусти orchestrator (он подберёт твой output и пойдёт дальше).');
  parts.push('');
  parts.push('## Task');
  parts.push('');
  parts.push(opts.taskDescription);
  parts.push('');
  parts.push(`## Output`);
  parts.push('');
  parts.push(`Запиши JSON по schema (без markdown-обрамлений, чистый JSON) в:`);
  parts.push('');
  parts.push(`\`${opts.outputPathRel}\``);
  parts.push('');

  for (const block of opts.contextBlocks) {
    parts.push(`## ${block.heading}`);
    parts.push('');
    parts.push(block.body);
    parts.push('');
  }

  parts.push('## Schema (JSON Schema)');
  parts.push('');
  parts.push(`${fence}json`);
  parts.push(JSON.stringify(opts.schemaJson, null, 2));
  parts.push(fence);

  return parts.join('\n');
}

function buildRepairPrompt(opts: {
  phase: PhaseId;
  title: string;
  taskDescription: string;
  contextBlocks: Array<{ heading: string; body: string }>;
  schemaJson: unknown;
  outputPathRel: string;
  invalidContent: string;
  errors: string[];
  failureKind: 'schema' | 'semantic';
  attemptNumber: number;
  maxAttempts: number;
}): string {
  const fence = '```';
  const parts: string[] = [];

  parts.push(`# Buffalo phased pipeline — REPAIR ${opts.phase} ${opts.title}`);
  parts.push('');
  parts.push(
    `> **Repair attempt ${opts.attemptNumber}/${opts.maxAttempts}** — твой предыдущий output не прошёл ${opts.failureKind} валидацию.`,
  );
  parts.push('> Поправь конкретные проблемы ниже, перезапиши JSON, снова запусти orchestrator.');
  parts.push(
    `> После ${opts.maxAttempts} безуспешных попыток фаза падает с error — эскалирует человеку.`,
  );
  parts.push('');

  parts.push('## Errors to fix');
  parts.push('');
  if (opts.failureKind === 'schema') {
    parts.push('Schema validation (zod) сообщает:');
  } else {
    parts.push('Semantic validation (post-schema, бизнес-правила) сообщает:');
  }
  parts.push('');
  for (const e of opts.errors) {
    parts.push(`- ❌ ${e}`);
  }
  parts.push('');

  parts.push('## Previous (invalid) output');
  parts.push('');
  parts.push(`Сохранён как \`${opts.outputPathRel.replace(/\.json$/, '')}.invalid-${opts.attemptNumber}.json\` для аудита. Ниже — его содержимое для опоры:`);
  parts.push('');
  parts.push(`${fence}json`);
  parts.push(opts.invalidContent.trim());
  parts.push(fence);
  parts.push('');

  parts.push('## How to repair');
  parts.push('');
  parts.push('1. Прочитай каждый error в списке выше.');
  parts.push('2. Сравни с предыдущим output — где конкретно поле/секция, которая нарушила правило.');
  parts.push('3. Перепиши JSON, исправив ТОЛЬКО проблемные места. НЕ переделывай всё с нуля.');
  parts.push(`4. Запиши результат в \`${opts.outputPathRel}\``);
  parts.push('5. Запусти `harness agent run landing` (или `run-phase`) — orchestrator проверит.');
  parts.push('');

  parts.push('## Original task (для контекста)');
  parts.push('');
  parts.push(opts.taskDescription);
  parts.push('');

  for (const block of opts.contextBlocks) {
    parts.push(`## ${block.heading}`);
    parts.push('');
    parts.push(block.body);
    parts.push('');
  }

  parts.push('## Schema (JSON Schema)');
  parts.push('');
  parts.push(`${fence}json`);
  parts.push(JSON.stringify(opts.schemaJson, null, 2));
  parts.push(fence);

  return parts.join('\n');
}
