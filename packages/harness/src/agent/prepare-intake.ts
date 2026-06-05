import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { z } from 'zod';
import { BriefSchema } from '../schemas/brief';
import { IntakeTzSchema } from '../schemas/intake-tz';
import { buildIntakeSystemPrompt, buildIntakeUserPrompt } from '../prompts/intake-system';

/** Объединённый выход intake: ТЗ для ревью + согласованный машинный бриф. */
export const IntakeOutputSchema = z.object({
  tz: IntakeTzSchema,
  brief: BriefSchema,
});

export interface PrepareIntakeArtifact {
  kind: 'intake';
  slug: string;
  system: string;
  user: string;
  schema: unknown;
  /** Куда хост-агент пишет JSON { tz, brief }. */
  outputPath: string;
  outputPathRel: string;
  nextCommand: string;
  sources: string[];
  instructions: string;
}

const INTAKE_INSTRUCTIONS = [
  'You are the host LLM (Claude Code / Codex / ChatGPT-with-files).',
  'Read `system` (методология + брендовый канон) and `user` (запрос + материалы).',
  'Research Kaiten facts, then produce ONE JSON object { "tz": <IntakeTz>, "brief": <Brief> } that satisfies `schema`.',
  'Write that JSON (no markdown fences) to `outputPath`, then run `nextCommand` — оно валидирует ТЗ+бриф, публикует бриф и рендерит ТЗ.md. При ошибках поправь JSON и запусти команду снова (repair-loop).',
].join(' ');

const TEXT_INLINE_RE = /\.(md|txt|json|csv|ya?ml)$/i;
const MAX_INLINE_CHARS = 4000;

async function buildInputsManifest(root: string, inputsDir?: string): Promise<string> {
  if (!inputsDir) return '_(папка материалов не передана — опирайся на запрос и веб-ресёрч)_';
  const abs = resolve(root, inputsDir);
  let entries;
  try {
    entries = await readdir(abs, { withFileTypes: true });
  } catch {
    return `_(папка \`${inputsDir}\` не найдена)_`;
  }
  const blocks: string[] = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    const rel = relative(root, join(abs, e.name));
    if (TEXT_INLINE_RE.test(e.name)) {
      const content = await readFile(join(abs, e.name), 'utf-8').catch(() => '');
      const snippet = content.length > MAX_INLINE_CHARS ? `${content.slice(0, MAX_INLINE_CHARS)}\n…(обрезано)…` : content;
      blocks.push(`### ${rel}\n\n\`\`\`\n${snippet}\n\`\`\``);
    } else {
      blocks.push(`### ${rel}\n\n_(нетекстовый файл — открой при необходимости)_`);
    }
  }
  return blocks.length ? blocks.join('\n\n') : '_(в папке нет файлов)_';
}

export async function prepareIntake(opts: {
  root: string;
  slug: string;
  requestPath?: string;
  request?: string;
  inputsDir?: string;
}): Promise<PrepareIntakeArtifact> {
  const request =
    opts.request ??
    (opts.requestPath ? await readFile(resolve(opts.root, opts.requestPath), 'utf-8') : '');
  const inputsManifest = await buildInputsManifest(opts.root, opts.inputsDir);

  const { system, sources } = await buildIntakeSystemPrompt();
  const user = buildIntakeUserPrompt({ request, inputsManifest });
  const schema = z.toJSONSchema(IntakeOutputSchema, { reused: 'inline' });

  const outputPathAbs = resolve(opts.root, '.context', 'intake', opts.slug, 'intake.json');
  const outputPathRel = relative(opts.root, outputPathAbs);

  return {
    kind: 'intake',
    slug: opts.slug,
    system,
    user,
    schema,
    outputPath: outputPathAbs,
    outputPathRel,
    nextCommand: `pnpm -w run harness agent intake-apply landing --slug ${opts.slug}`,
    sources,
    instructions: INTAKE_INSTRUCTIONS,
  };
}

export function renderIntakePrepareAsMarkdown(a: PrepareIntakeArtifact): string {
  const fence = '```';
  return `# Контент-завод Кайтен — intake (фабрика ТЗ) / ${a.slug}

> **Host-agent mode** — нет API-ключей, всё генерирует LLM хоста.

## How to use

1. Прочитай **System prompt** и **User prompt** ниже.
2. Проведи ресёрч и сгенерируй ОДИН JSON-объект \`{ "tz": <IntakeTz>, "brief": <Brief> }\` по **Schema**.
3. Запиши JSON (без markdown-обрамлений) в файл: \`${a.outputPathRel}\`
4. Запусти: \`${a.nextCommand}\`
5. Если apply вернёт ошибки — поправь JSON и снова запусти команду из шага 4 (repair-loop).

---

## System prompt

${fence}
${a.system}
${fence}

## User prompt

${fence}
${a.user}
${fence}

## Schema ({ tz, brief } — JSON Schema)

${fence}json
${JSON.stringify(a.schema, null, 2)}
${fence}

## Sources

${a.sources.map((s) => `- \`${s}\``).join('\n') || '_(none)_'}
`;
}
