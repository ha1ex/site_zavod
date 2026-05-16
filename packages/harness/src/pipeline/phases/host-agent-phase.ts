import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { z } from 'zod';
import type { PhaseContext, PhaseId, PhaseResult } from './types';

/**
 * Generic host-agent phase runner.
 *
 * Pattern для всех LLM-фаз (P1, P2, P4, P5, P6, P7, P8):
 *   1) Если outputPath уже существует — читает JSON, валидирует через schema,
 *      возвращает status='ok' (idempotent rerun).
 *   2) Иначе пишет prompt + schema в .context/pipeline/<slug>/p{N}-prompt.md
 *      и возвращает status='awaiting-host-agent' — orchestrator останавливается,
 *      host-agent читает prompt, пишет artifact, повторно запускает phase.
 *
 * Это позволяет phased pipeline работать в любом host (Claude Code, Codex,
 * ChatGPT-with-files) без API-ключей.
 */

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
   * Если возвращает errors[] не пустой — фаза переходит в status='error' с
   * этими сообщениями. Warnings проходят в PhaseResult.messages.
   */
  postValidate?: (parsed: T) => Promise<{ errors: string[]; warnings: string[] }>;
}

export async function runHostAgentPhase<T>(
  options: HostAgentPhaseOptions<T>,
): Promise<PhaseResult> {
  const { phase, ctx, title, taskDescription, contextBlocks, outputSchema, outputName } = options;
  const messages: string[] = [];
  const errors: string[] = [];
  const pipelineDir = resolve(ctx.root, '.context', 'pipeline', ctx.slug);
  const outputPath = resolve(pipelineDir, `${outputName}.json`);
  const promptPath = resolve(pipelineDir, `${outputName}.prompt.md`);

  // Идемпотентный rerun: если артефакт уже есть — валидируем и возвращаем.
  try {
    const raw = await readFile(outputPath, 'utf-8');
    const parsed = outputSchema.safeParse(JSON.parse(raw));
    if (parsed.success) {
      // Schema OK — теперь semantic validation если задана.
      if (options.postValidate) {
        const sem = await options.postValidate(parsed.data as T);
        for (const w of sem.warnings) messages.push(`semantic warning: ${w}`);
        if (sem.errors.length > 0) {
          errors.push(...sem.errors.map((e) => `semantic validation failed: ${e}`));
          return { phase, status: 'error', artifactPath: outputPath, messages, errors };
        }
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
      messages.push(
        `artifact существует, но schema-валидация провалилась: ${parsed.error.message}. ` +
          'Перепиши его или удали для перегенерации.',
      );
      errors.push(`schema validation failed: ${parsed.error.message}`);
      return {
        phase,
        status: 'error',
        artifactPath: outputPath,
        messages,
        errors,
      };
    }
  } catch {
    // Файл не существует — нужен host-agent input.
  }

  // Сгенерируем prompt для host-agent.
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
