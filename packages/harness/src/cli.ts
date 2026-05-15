#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { HARNESS_VERSION } from './index.js';
import { BriefSchema, IllustrationSpecSchema, LandingSpecSchema } from './schemas/index.js';
import {
  generateIllustrationTSXWithLLM,
  generateLandingSpecWithLLM,
  landingSpecFromBrief,
  pascalCase,
  renderIllustrationStory,
  renderIllustrationStub,
} from './pipeline/index.js';
import { renderLandingToTSX } from './render/index.js';
import { describeRegistry } from './registry/index.js';
import { describeActiveProvider, hasLLMCredentials } from './providers/index.js';
import { formatIllustrationErrors, validateIllustrationTSX } from './validators/index.js';

const ROOT = resolve(process.cwd());

async function findRepoRoot(start: string): Promise<string> {
  // Ищем pnpm-workspace.yaml вверх по дереву; CLI могут вызывать из подпакета.
  let dir = start;
  for (let i = 0; i < 10; i++) {
    try {
      await readFile(resolve(dir, 'pnpm-workspace.yaml'));
      return dir;
    } catch {
      // not found here, go up
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return start;
}

const program = new Command();

program
  .name('harness')
  .description('LLM harness CLI — генерация SaaS-лендингов из brief')
  .version(HARNESS_VERSION);

program
  .command('generate')
  .description('Сгенерировать артефакт из brief или illustration-spec')
  .argument('<kind>', 'тип артефакта: landing | illustration')
  .option('-b, --brief <path>', 'для landing: путь к brief.json')
  .option('-S, --spec <path>', 'для illustration: путь к IllustrationSpec.json')
  .option('-s, --slug <slug>', 'slug черновика (только для landing)', 'draft')
  .option('--no-llm', 'детерминированный fallback вместо LLM (для тестов/CI)')
  .option(
    '--strict',
    'illustration: при ошибках валидатора падать (без --strict — печатает и пишет файл)',
    false,
  )
  .action(
    async (
      kind: string,
      opts: { brief?: string; spec?: string; slug: string; llm: boolean; strict: boolean },
    ) => {
      const root = await findRepoRoot(ROOT);

      if (kind === 'landing') {
        await runGenerateLanding(root, opts);
        return;
      }
      if (kind === 'illustration') {
        await runGenerateIllustration(root, opts);
        return;
      }
      console.error(chalk.red(`[harness] kind=${kind} не поддерживается (landing | illustration)`));
      process.exit(1);
    },
  );

async function runGenerateLanding(
  root: string,
  opts: { brief?: string; slug: string; llm: boolean },
) {
  if (!opts.brief) {
    console.error(chalk.red('[harness] --brief обязателен для landing'));
    process.exit(1);
  }

  const briefPath = resolve(root, opts.brief);
  console.log(chalk.cyan(`[harness] read brief: ${briefPath}`));

  const briefRaw = await readFile(briefPath, 'utf-8');
  const brief = BriefSchema.parse(JSON.parse(briefRaw));

  const wantLLM = opts.llm !== false;
  const canLLM = hasLLMCredentials();
  const useLLM = wantLLM && canLLM;

  let spec;
  if (useLLM) {
    console.log(chalk.cyan(`[harness] provider: ${describeActiveProvider()}`));
    console.log(chalk.dim(`[harness] generating with LLM…`));
    const t0 = Date.now();
    spec = await generateLandingSpecWithLLM(brief);
    console.log(chalk.green(`[harness] ✓ LLM spec in ${Date.now() - t0}ms`));
  } else {
    const reason = !wantLLM ? '--no-llm' : 'no API key';
    console.log(chalk.yellow(`[harness] deterministic fallback (${reason})`));
    spec = landingSpecFromBrief(brief);
  }
  const specPath = resolve(root, 'content', 'landings', `${opts.slug}.json`);
  await mkdir(dirname(specPath), { recursive: true });
  await writeFile(specPath, JSON.stringify(spec, null, 2) + '\n', 'utf-8');
  console.log(chalk.green(`[harness] ✓ spec  → ${specPath}`));

  const tsx = renderLandingToTSX(spec, opts.slug);
  const tsxPath = resolve(root, 'generated', 'landings', opts.slug, 'page.tsx');
  await mkdir(dirname(tsxPath), { recursive: true });
  await writeFile(tsxPath, tsx, 'utf-8');
  console.log(chalk.green(`[harness] ✓ tsx   → ${tsxPath}`));

  console.log(chalk.dim(`\nПревью: http://localhost:3000/landings/${opts.slug}`));
}

async function runGenerateIllustration(
  root: string,
  opts: { spec?: string; llm: boolean; strict: boolean },
) {
  if (!opts.spec) {
    console.error(chalk.red('[harness] --spec <path> обязателен для illustration'));
    process.exit(1);
  }

  const specPath = resolve(root, opts.spec);
  console.log(chalk.cyan(`[harness] read spec: ${specPath}`));
  const specRaw = await readFile(specPath, 'utf-8');
  const spec = IllustrationSpecSchema.parse(JSON.parse(specRaw));

  const wantLLM = opts.llm !== false;
  const canLLM = hasLLMCredentials();
  const useLLM = wantLLM && canLLM;

  let tsx: string;
  if (useLLM) {
    console.log(chalk.cyan(`[harness] provider: ${describeActiveProvider()}`));
    console.log(chalk.dim(`[harness] generating illustration with LLM…`));
    const t0 = Date.now();
    tsx = await generateIllustrationTSXWithLLM(spec);
    console.log(chalk.green(`[harness] ✓ LLM tsx in ${Date.now() - t0}ms`));
  } else {
    const reason = !wantLLM ? '--no-llm' : 'no API key';
    console.log(chalk.yellow(`[harness] deterministic stub (${reason})`));
    tsx = renderIllustrationStub(spec);
  }

  const result = validateIllustrationTSX(tsx);
  if (result.ok) {
    console.log(chalk.green('[harness] ✓ AST validator passed'));
  } else {
    console.log(chalk.red(`[harness] ✗ AST validator: ${result.errors.length} error(s)`));
    console.log(formatIllustrationErrors(result));
    if (opts.strict) {
      console.error(chalk.red('[harness] aborting (--strict). Файл не записан.'));
      process.exit(1);
    }
    console.log(chalk.yellow('[harness] продолжаю запись (без --strict); ошибки уйдут в repair-loop этапа 4'));
  }

  const Name = pascalCase(spec.id);
  const outDir = resolve(root, 'packages', 'ui', 'src', 'illustrations');
  const tsxPath = resolve(outDir, `${Name}.tsx`);
  const storyPath = resolve(outDir, `${Name}.stories.tsx`);
  await mkdir(outDir, { recursive: true });
  await writeFile(tsxPath, tsx, 'utf-8');
  console.log(chalk.green(`[harness] ✓ tsx   → ${tsxPath}`));
  await writeFile(storyPath, renderIllustrationStory(spec), 'utf-8');
  console.log(chalk.green(`[harness] ✓ story → ${storyPath}`));

  await upsertIllustrationBarrel(outDir, Name);
  console.log(chalk.dim(`\nStorybook: http://localhost:6006/?path=/story/illustrations-${Name.toLowerCase()}--light`));
}

async function upsertIllustrationBarrel(outDir: string, Name: string) {
  const barrelPath = resolve(outDir, 'index.ts');
  let body = '';
  try {
    body = await readFile(barrelPath, 'utf-8');
  } catch {
    body = '';
  }
  const exportLine = `export { default as ${Name} } from './${Name}.js';`;
  if (body.includes(exportLine)) return;
  const stripped = body.replace(/^\/\/ Этап 3:.*$/m, '').replace(/^export \{\};\s*$/m, '').trim();
  const next = `// Auto-maintained barrel for generated SVG illustrations.\n${stripped ? stripped + '\n' : ''}${exportLine}\n`;
  await writeFile(barrelPath, next, 'utf-8');
}

program
  .command('validate')
  .description('Валидировать существующий spec')
  .argument('<slug>', 'slug черновика')
  .action(async (slug: string) => {
    const root = await findRepoRoot(ROOT);
    const path = resolve(root, 'content', 'landings', `${slug}.json`);
    const raw = await readFile(path, 'utf-8');
    const parsed = LandingSpecSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.error(chalk.red(`[harness] ✗ spec invalid`));
      console.error(parsed.error.format());
      process.exit(1);
    }
    console.log(chalk.green(`[harness] ✓ spec valid (${parsed.data.sections.length} sections)`));
  });

program
  .command('registry')
  .description('Показать component registry (для system prompt LLM)')
  .action(() => {
    console.log(describeRegistry());
  });

program
  .command('providers')
  .description('Показать активный LLM-провайдер и наличие ключей')
  .action(() => {
    console.log(`[harness] ${describeActiveProvider()}`);
    if (!hasLLMCredentials()) {
      console.log(
        chalk.yellow(
          '\nLLM недоступен. Положите ключ в .env.local:\n' +
            '  AI_GATEWAY_API_KEY=...   (рекомендуется)\n' +
            '  ANTHROPIC_API_KEY=...    (direct fallback)\n' +
            '  OPENAI_API_KEY=...       (direct fallback)\n',
        ),
      );
    }
  });

program
  .command('handoff')
  .description('Собрать ZIP-пакет для передачи разработчикам')
  .argument('<slug>', 'slug черновика')
  .action((slug: string) => {
    console.log(chalk.yellow(`[harness] handoff ${slug} — будет добавлено на этапе 6`));
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(chalk.red('[harness] fatal:'), err);
  process.exit(1);
});
