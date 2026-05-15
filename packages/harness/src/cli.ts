#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { HARNESS_VERSION } from './index.js';
import { BriefSchema, LandingSpecSchema } from './schemas/index.js';
import { landingSpecFromBrief } from './pipeline/index.js';
import { renderLandingToTSX } from './render/index.js';
import { describeRegistry } from './registry/index.js';

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
  .description('Сгенерировать артефакт из brief')
  .argument('<kind>', 'тип артефакта: landing | illustration')
  .option('-b, --brief <path>', 'путь к brief.json (относительно репозитория)')
  .option('-s, --slug <slug>', 'slug черновика', 'draft')
  .action(async (kind: string, opts: { brief?: string; slug: string }) => {
    if (kind !== 'landing') {
      console.error(chalk.red(`[harness] kind=${kind} не поддерживается (пока только landing)`));
      process.exit(1);
    }
    if (!opts.brief) {
      console.error(chalk.red('[harness] --brief обязателен'));
      process.exit(1);
    }

    const root = await findRepoRoot(ROOT);
    const briefPath = resolve(root, opts.brief);
    console.log(chalk.cyan(`[harness] read brief: ${briefPath}`));

    const briefRaw = await readFile(briefPath, 'utf-8');
    const brief = BriefSchema.parse(JSON.parse(briefRaw));

    const spec = landingSpecFromBrief(brief);
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
  });

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
