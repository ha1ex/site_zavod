#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { HARNESS_VERSION } from './index';
import { BriefSchema, IllustrationSpecSchema, LandingSpecSchema } from './schemas/index';
import {
  generateIllustrationTSXWithRepair,
  generateLandingSpecWithLLMResult,
  generateLandingSpecWithRepair,
  landingSpecFromBrief,
  pascalCase,
  renderIllustrationStory,
  renderIllustrationStub,
  runPhasedPipeline,
  formatPhasedRunReport,
  routePipeline,
  formatRouteDecision,
  type PhaseId,
} from './pipeline/index';
import { renderLandingToTSX } from './render/index';
import { describeRegistry, REGISTRY } from './registry/index';
import { describeActiveProvider, hasLLMCredentials } from './providers/index';
import {
  formatIllustrationErrors,
  formatLandingBrandErrors,
  formatLandingBusinessErrors,
  validateIllustrationTSX,
  validateLandingBrand,
  validateLandingBusiness,
} from './validators/index';
import { listApprovals, readApproval } from './approvals/index';
import type { ApprovalStatus } from './schemas/approval';
import { buildHandoff } from './handoff/index';
import { buildLandingSystemPromptWithMeta } from './prompts/system';
import {
  ingestLanding,
  ingestIntake,
  prepareIntake,
  renderIntakePrepareAsMarkdown,
} from './agent/index';
import {
  appendLog,
  appendReviewerNote,
  fileLandingToWiki,
  ingestBrief,
  readLog,
  rebuildIndex,
  runLint,
  scaffoldWikiPage,
  updateLandingStatus,
  wikiSync,
  type LandingStatus,
  type LintScope,
  type LogOp,
  type WikiPageType,
} from './wiki/index';
import {
  agentNotes,
  buildChecklistText,
  buildSessionContextText,
  buildSlugContextText,
  detectHostAgent,
  extractGatesCard,
  staticBootstrapText,
} from './host/index';
import { assertBriefsUnmodifiedOrExit } from './gates/index';

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

/**
 * Баннер детекта host-агента. Пишем в stderr, чтобы не ломать --json stdout.
 * Сессия, пропустившая шаг 0 (agent context), самокорректируется при первом
 * касании pipeline-команд.
 */
function printHostBanner(override?: string): void {
  const d = detectHostAgent({ override });
  console.error(chalk.dim(`[harness] host agent: ${d.profile.label} (via ${d.via})`));
}

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
    'при ошибках валидатора падать (без --strict — печатает и пишет файл)',
    false,
  )
  .option(
    '--max-repair-attempts <n>',
    'сколько попыток LLM с фидбеком ошибок валидатора (включая первую)',
    '2',
  )
  .action(
    async (
      kind: string,
      opts: {
        brief?: string;
        spec?: string;
        slug: string;
        llm: boolean;
        strict: boolean;
        maxRepairAttempts: string;
      },
    ) => {
      const root = await findRepoRoot(ROOT);
      const maxAttempts = Math.max(1, Number.parseInt(opts.maxRepairAttempts, 10) || 1);

      if (kind === 'landing') {
        await runGenerateLanding(root, { ...opts, maxAttempts });
        return;
      }
      if (kind === 'illustration') {
        await runGenerateIllustration(root, { ...opts, maxAttempts });
        return;
      }
      console.error(chalk.red(`[harness] kind=${kind} не поддерживается (landing | illustration)`));
      process.exit(1);
    },
  );

async function runGenerateLanding(
  root: string,
  opts: { brief?: string; slug: string; llm: boolean; strict: boolean; maxAttempts: number },
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
  let durationMs = 0;
  let generator = '';
  if (useLLM) {
    generator = describeActiveProvider();
    console.log(chalk.cyan(`[harness] provider: ${generator}`));
    console.log(chalk.dim(`[harness] LLM + repair-loop (max ${opts.maxAttempts} attempts)…`));
    const t0 = Date.now();
    const repair = await generateLandingSpecWithRepair(brief, { maxAttempts: opts.maxAttempts });
    durationMs = Date.now() - t0;
    if (repair.ok) {
      console.log(chalk.green(`[harness] ✓ landing valid after ${repair.attempts.length} attempt(s) (${durationMs}ms)`));
    } else {
      console.log(chalk.red(`[harness] ✗ landing has ${repair.finalErrors.length} unresolved error(s) after ${repair.attempts.length} attempt(s):`));
      const brandErrs = repair.finalErrors.filter((e) => e.kind === 'brand');
      const bizErrs = repair.finalErrors.filter((e) => e.kind === 'business');
      if (brandErrs.length) console.log(formatLandingBrandErrors({ ok: false, errors: brandErrs }));
      if (bizErrs.length) console.log(formatLandingBusinessErrors({ ok: false, errors: bizErrs }));
      if (opts.strict || !repair.result) {
        await appendLog(root, {
          op: 'generate',
          slug: opts.slug,
          status: 'fail',
          note: `unresolved errors=${repair.finalErrors.length} attempts=${repair.attempts.length} strict=${opts.strict}`,
        }).catch(() => {});
        console.error(chalk.red('[harness] aborting (--strict или нет кандидата).'));
        process.exit(1);
      }
      console.log(chalk.yellow('[harness] пишу последнего кандидата (без --strict).'));
    }
    spec = repair.result;
  } else {
    const reason = !wantLLM ? '--no-llm' : 'no API key';
    console.log(chalk.yellow(`[harness] deterministic fallback (${reason})`));
    spec = landingSpecFromBrief(brief);
    generator = `deterministic-fallback (${reason})`;
    const brand = validateLandingBrand(spec);
    const biz = validateLandingBusiness(spec, brief);
    if (!brand.ok) console.log(formatLandingBrandErrors(brand));
    if (!biz.ok) console.log(formatLandingBusinessErrors(biz));
  }

  if (!spec) {
    console.error(chalk.red('[harness] нет финального spec — выход.'));
    process.exit(1);
  }

  // Stage-8: получаем sources через отдельный read-only вызов (не нужен повторный LLM).
  // Это даёт traceability "какие wiki-страницы повлияли на эту генерацию".
  let sources: string[] = [];
  let archetype: string = spec.pageType;
  let tokenEstimate: number | undefined;
  try {
    const meta = await buildLandingSystemPromptWithMeta({ brief });
    sources = meta.sources;
    if (meta.archetype) archetype = meta.archetype;
    tokenEstimate = meta.tokenEstimate;
  } catch (err) {
    console.log(chalk.yellow(`[harness] warn: не удалось получить sources: ${(err as Error).message}`));
  }

  // Stage-8: сохраняем meta в spec для traceability.
  spec.meta = {
    sources,
    generatedAt: new Date().toISOString(),
    generator,
    archetype,
    tokenEstimate,
  };

  const specPath = resolve(root, 'content', 'landings', `${opts.slug}.json`);
  await mkdir(dirname(specPath), { recursive: true });
  await writeFile(specPath, JSON.stringify(spec, null, 2) + '\n', 'utf-8');
  console.log(chalk.green(`[harness] ✓ spec  → ${specPath}`));

  const tsx = renderLandingToTSX(spec, opts.slug);
  const tsxPath = resolve(root, 'generated', 'landings', opts.slug, 'page.tsx');
  await mkdir(dirname(tsxPath), { recursive: true });
  await writeFile(tsxPath, tsx, 'utf-8');
  console.log(chalk.green(`[harness] ✓ tsx   → ${tsxPath}`));

  // Stage-8 M4b filing back: wiki/landings/<slug>.md
  try {
    const wikiPath = await fileLandingToWiki(root, {
      slug: opts.slug,
      brief,
      briefPath: opts.brief!,
      spec,
      sources,
      archetype,
      durationMs,
      generator,
      tokenEstimate,
    });
    console.log(chalk.green(`[harness] ✓ wiki  → ${wikiPath}`));
  } catch (err) {
    console.log(chalk.yellow(`[harness] warn: filing back failed: ${(err as Error).message}`));
  }

  // Stage-8 M3 post-generate hook: wiki/log.md
  await appendLog(root, {
    op: 'generate',
    slug: opts.slug,
    status: 'ok',
    note: `archetype=${archetype} sections=${spec.sections.length} via=${useLLM ? 'llm' : 'fallback'} sources=${sources.length} dur=${durationMs}ms`,
  }).catch((err) => {
    console.log(chalk.yellow(`[harness] warn: не удалось записать в wiki/log.md: ${(err as Error).message}`));
  });

  console.log(chalk.dim(`\nПревью: http://localhost:3000/landings/${opts.slug}`));
}

async function runGenerateIllustration(
  root: string,
  opts: { spec?: string; llm: boolean; strict: boolean; maxAttempts: number },
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
  let validatorPassed = true;
  if (useLLM) {
    console.log(chalk.cyan(`[harness] provider: ${describeActiveProvider()}`));
    console.log(chalk.dim(`[harness] LLM + repair-loop (max ${opts.maxAttempts} attempts)…`));
    const repair = await generateIllustrationTSXWithRepair(spec, { maxAttempts: opts.maxAttempts });
    if (repair.ok && repair.result) {
      console.log(chalk.green(`[harness] ✓ AST clean after ${repair.attempts.length} attempt(s)`));
      tsx = repair.result;
    } else {
      validatorPassed = false;
      console.log(chalk.red(`[harness] ✗ AST: ${repair.finalErrors.length} unresolved error(s) after ${repair.attempts.length} attempt(s)`));
      console.log(formatIllustrationErrors({ ok: false, errors: repair.finalErrors }));
      if (opts.strict || !repair.result) {
        console.error(chalk.red('[harness] aborting (--strict или нет кандидата). Файл не записан.'));
        process.exit(1);
      }
      console.log(chalk.yellow('[harness] продолжаю запись последнего кандидата (без --strict).'));
      tsx = repair.result;
    }
  } else {
    const reason = !wantLLM ? '--no-llm' : 'no API key';
    console.log(chalk.yellow(`[harness] deterministic stub (${reason})`));
    tsx = renderIllustrationStub(spec);
    const result = validateIllustrationTSX(tsx);
    if (result.ok) {
      console.log(chalk.green('[harness] ✓ AST validator passed (stub)'));
    } else {
      validatorPassed = false;
      console.log(chalk.red(`[harness] ✗ stub AST violations: ${result.errors.length}`));
      console.log(formatIllustrationErrors(result));
      if (opts.strict) {
        console.error(chalk.red('[harness] aborting (--strict).'));
        process.exit(1);
      }
    }
  }
  void validatorPassed;

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
  const exportLine = `export { default as ${Name} } from './${Name}';`;
  if (body.includes(exportLine)) return;
  const stripped = body.replace(/^\/\/ Этап 3:.*$/m, '').replace(/^export \{\};\s*$/m, '').trim();
  const next = `// Auto-maintained barrel for generated SVG illustrations.\n${stripped ? stripped + '\n' : ''}${exportLine}\n`;
  await writeFile(barrelPath, next, 'utf-8');
}

/* ─── Agent-mode commands — нет API-ключей, LLM = хост-агент ─────────── */

const agent = program
  .command('agent')
  .description(
    'Agent-mode (без API-ключей): build/run ведут phased pipeline (P0..P8), apply валидирует spec, написанный хост-агентом.',
  );

agent
  .command('context')
  .description(
    'Session bootstrap для любого host-агента (Claude Code / Codex / Gemini / …): детект агента, горячий контекст, hard gates, подсказки. Шаг 0 из AGENTS.md.',
  )
  .option('-s, --slug <slug>', 'подгрузить сводку по slug (brief + spec + approval + pipeline)')
  .option('--agent <name>', 'переопределить детект host-агента (codex | gemini | claude-code | …)')
  .option('--full', 'печатать полный горячий контекст даже под Claude Code (хуки уже инжектировали его)', false)
  .action(async (opts: { slug?: string; agent?: string; full: boolean }) => {
    const root = await findRepoRoot(ROOT);
    const detection = detectHostAgent({ override: opts.agent });
    const { profile } = detection;

    console.log(`[harness] host agent: ${chalk.cyan(profile.label)} (via ${detection.via})`);
    console.log(
      chalk.dim(
        `         hooks: ${profile.hasHooks ? 'да' : 'нет'} · skills: ${profile.hasSkills ? 'да' : 'нет'}` +
          (profile.needsExplicitContext ? ' → этот вывод и есть твой bootstrap, следуй ему' : ''),
      ),
    );
    console.log('');

    // Горячий контекст: под Claude Code его уже инжектировал SessionStart-хук — не дублируем без --full.
    if (profile.needsExplicitContext || opts.full) {
      console.log(buildSessionContextText(root) ?? staticBootstrapText());
      console.log('');
    } else {
      console.log(chalk.dim('(горячий контекст уже инжектирован SessionStart-хуком; повторить: --full)'));
      console.log('');
    }

    if (opts.slug) {
      const slugCtx = buildSlugContextText(root, opts.slug);
      if (slugCtx) {
        console.log(slugCtx);
      } else {
        console.log(chalk.yellow(`(slug "${opts.slug}": бриф не найден в content/briefs/ — проверь имя)`));
      }
      console.log('');
    }

    console.log('## Hard gates (enforced: git pre-commit + harness CLI + Claude hooks)');
    console.log('');
    console.log(extractGatesCard(root));
    console.log('');

    console.log(`## Заметки для тебя (${profile.label})`);
    for (const note of agentNotes(profile)) console.log(`- ${note}`);
    console.log('');
    console.log(
      chalk.dim(
        'Дальше: pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json',
      ),
    );
  });

agent
  .command('checklist')
  .description(
    'Финальный чек-лист релиза (uncommitted / typecheck / визуальная верификация / wiki). Advisory — всегда exit 0. Паритет Stop-хука Claude для всех агентов.',
  )
  .action(async () => {
    const root = await findRepoRoot(ROOT);
    const text = buildChecklistText(root);
    if (text) {
      console.log(text);
      console.log('');
      console.log(chalk.dim('(advisory: команда не блокирует — разберись с пунктами до финального ответа)'));
    } else {
      console.log(
        chalk.green('[harness] ✓ чек-лист чист: нет uncommitted в критичных директориях, нет pending typecheck.'),
      );
    }
  });

agent
  .command('apply')
  .description(
    'Принять spec от хост-агента: валидация (brand+business+audience) + рендер TSX + filing back. Без LLM.',
  )
  .argument('<kind>', 'тип артефакта: landing')
  .option('-s, --slug <slug>', 'slug черновика')
  .option('-b, --brief <path>', 'путь к brief.json для business-валидатора (рекомендуется)')
  .option('--strict', 'падать на ошибках валидатора (не писать TSX)', false)
  .option('--no-render', 'не рендерить TSX (только валидация)')
  .option('--json', 'machine-readable JSON-вывод результата (для repair-loop агента)', false)
  .option('--audience-threshold <n>', 'минимальный Audience Score (default 70)', (v) => parseFloat(v))
  .option('--no-audience-gate', 'полностью отключить audience-score gate')
  .option('--skip-gates', 'пропустить жёсткие гейты (briefs-immutable) — осознанный обход', false)
  .action(
    async (
      kind: string,
      opts: {
        slug?: string;
        brief?: string;
        strict: boolean;
        render: boolean;
        json: boolean;
        audienceThreshold?: number;
        audienceGate: boolean;
        skipGates: boolean;
      },
    ) => {
      const root = await findRepoRoot(ROOT);
      printHostBanner();
      assertBriefsUnmodifiedOrExit(root, { skip: opts.skipGates });
      if (kind !== 'landing') {
        console.error(
          chalk.red(`[harness] ingest: kind=${kind} не поддерживается (поддерживается: landing)`),
        );
        process.exit(1);
      }
      if (!opts.slug) {
        console.error(chalk.red('[harness] ingest landing: --slug обязателен'));
        process.exit(1);
      }
      const result = await ingestLanding({
        root,
        slug: opts.slug,
        briefPath: opts.brief,
        strict: opts.strict,
        noRender: opts.render === false,
        audienceThreshold: opts.audienceThreshold,
        noAudienceGate: opts.audienceGate === false,
      });

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.ok ? 0 : 1);
      }

      if (result.ok) {
        console.log(
          chalk.green(
            `[harness] ✓ spec valid (${result.sectionsCount} sections, archetype=${result.archetype})`,
          ),
        );
        console.log(chalk.green(`         spec  → ${result.specPathRel}`));
        if (result.tsxPathRel) console.log(chalk.green(`         tsx   → ${result.tsxPathRel}`));
        if (result.wikiPathRel) console.log(chalk.green(`         wiki  → ${result.wikiPathRel}`));
        if (result.audienceScore) {
          console.log(
            chalk.green(
              `         audience-score: ${result.audienceScore.score}/${result.audienceScore.threshold} (segments: ${result.audienceScore.resolvedSegments.join(', ') || 'n/a'})`,
            ),
          );
          if (result.audienceReportMdRel)
            console.log(chalk.green(`         audience report → ${result.audienceReportMdRel}`));
        }
        for (const w of result.warnings) console.log(chalk.yellow(`  ! ${w}`));
        console.log(chalk.dim(`\n         preview: ${result.previewUrl}`));
        process.exit(0);
      }

      console.log(chalk.red(`[harness] ✗ ingest landing/${result.slug} — ${result.errors.length} error(s):`));
      for (const e of result.errors) {
        const pathPart = e.path ? chalk.dim(` [${e.path}]`) : '';
        const codePart = e.code ? chalk.dim(` (${e.code})`) : '';
        console.log(`  ${chalk.red('✗')} ${e.kind}: ${e.message}${pathPart}${codePart}`);
      }
      for (const w of result.warnings) console.log(chalk.yellow(`  ! ${w}`));
      if (result.audienceScore) {
        console.log(
          chalk.yellow(
            `\n  audience-score: ${result.audienceScore.score}/${result.audienceScore.threshold} ` +
              `(segments: ${result.audienceScore.resolvedSegments.join(', ') || 'n/a'})`,
          ),
        );
        if (result.audienceReportMdRel)
          console.log(chalk.yellow(`  full report → ${result.audienceReportMdRel}`));
      }
      console.log(
        chalk.cyan(
          `\nПравь ${result.specPathRel} и запусти команду снова. Используй --json для structured output.`,
        ),
      );
      process.exit(1);
    },
  );

agent
  .command('intake')
  .description(
    'Фабрика ТЗ: из сырых данных (--request и/или --inputs) собрать prompt+schema для хост-агента (ТЗ + Brief). Без LLM.',
  )
  .argument('<kind>', 'тип артефакта: landing')
  .option('-s, --slug <slug>', 'slug черновика', 'draft')
  .option('-r, --request <path>', 'путь к файлу запроса (free-text / markdown)')
  .option('-i, --inputs <dir>', 'папка с материалами (например inputs/<slug>/)')
  .option('-o, --out <path>', 'путь к prompt-файлу (default: .context/intake/<slug>/intake.prompt.md)')
  .option('--format <fmt>', 'json | md', 'md')
  .action(
    async (
      kind: string,
      opts: { slug: string; request?: string; inputs?: string; out?: string; format: string },
    ) => {
      const root = await findRepoRoot(ROOT);
      if (kind !== 'landing') {
        console.error(chalk.red(`[harness] intake: kind=${kind} не поддерживается (поддерживается: landing)`));
        process.exit(1);
      }
      if (!opts.request && !opts.inputs) {
        console.error(chalk.red('[harness] intake: нужен хотя бы --request <файл> или --inputs <папка>'));
        process.exit(1);
      }
      const artifact = await prepareIntake({
        root,
        slug: opts.slug,
        requestPath: opts.request,
        inputsDir: opts.inputs,
      });
      const format = (opts.format ?? 'md').toLowerCase();
      const payload =
        format === 'json' ? JSON.stringify(artifact, null, 2) : renderIntakePrepareAsMarkdown(artifact);
      const outRel = opts.out ?? `.context/intake/${opts.slug}/intake.prompt.md`;
      const outPath = resolve(root, outRel);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, payload, 'utf-8');
      console.error(chalk.green(`[harness] ✓ intake prepare → ${outRel}`));
      console.error(chalk.dim(`         напиши JSON { tz, brief } в ${artifact.outputPathRel}`));
      console.error(chalk.dim(`         затем: ${artifact.nextCommand}`));
    },
  );

agent
  .command('intake-apply')
  .description(
    'Принять { tz, brief } от хост-агента: валидация + brief-quality (hard gate) → публикация brief + рендер ТЗ.md. Без LLM.',
  )
  .argument('<kind>', 'тип артефакта: landing')
  .option('-s, --slug <slug>', 'slug черновика')
  .option('--json', 'machine-readable JSON-вывод (для repair-loop агента)', false)
  .option('--skip-gates', 'пропустить жёсткие гейты (briefs-immutable) — осознанный обход', false)
  .action(async (kind: string, opts: { slug?: string; json: boolean; skipGates: boolean }) => {
    const root = await findRepoRoot(ROOT);
    printHostBanner();
    assertBriefsUnmodifiedOrExit(root, { skip: opts.skipGates });
    if (kind !== 'landing') {
      console.error(chalk.red(`[harness] intake-apply: kind=${kind} не поддерживается (поддерживается: landing)`));
      process.exit(1);
    }
    if (!opts.slug) {
      console.error(chalk.red('[harness] intake-apply: --slug обязателен'));
      process.exit(1);
    }
    const result = await ingestIntake({ root, slug: opts.slug });
    if (opts.json) {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.ok ? 0 : 1);
    }
    if (result.ok) {
      console.log(chalk.green('[harness] ✓ ТЗ + brief валидны (brief-quality пройден)'));
      console.log(chalk.green(`         brief → ${result.briefPathRel}`));
      console.log(chalk.green(`         ТЗ    → ${result.tzPathRel}`));
      for (const w of result.warnings) console.log(chalk.yellow(`  ! ${w}`));
      for (const n of result.needsConfirmation) console.log(chalk.cyan(`  ? needs confirmation: ${n}`));
      if (result.reviewUrl) console.log(chalk.dim(`\n         ревью ТЗ: ${result.reviewUrl}  (pnpm dev)`));
      console.log(chalk.dim(`         next: ${result.nextCommand}`));
      process.exit(0);
    }
    console.log(chalk.red(`[harness] ✗ intake ${result.slug} — ${result.errors.length} error(s):`));
    for (const e of result.errors) {
      const pathPart = e.path ? chalk.dim(` [${e.path}]`) : '';
      const codePart = e.code ? chalk.dim(` (${e.code})`) : '';
      console.log(`  ${chalk.red('✗')} ${e.kind}: ${e.message}${pathPart}${codePart}`);
    }
    for (const w of result.warnings) console.log(chalk.yellow(`  ! ${w}`));
    if (result.repairPathRel) {
      console.log(chalk.cyan(`\n  repair: ${result.repairPathRel} — поправь intake.json и запусти команду снова`));
    }
    process.exit(1);
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

agent
  .command('score')
  .description('Пересчитать audience-score для уже сгенерированного spec, без апплая. Без LLM.')
  .argument('<kind>', 'тип артефакта: landing')
  .option('-s, --slug <slug>', 'slug черновика')
  .option('-b, --brief <path>', 'путь к brief.json (обязателен для скоринга)')
  .option('--audience-threshold <n>', 'минимальный Audience Score (default 70)', (v) => parseFloat(v))
  .option('--json', 'machine-readable JSON-вывод', false)
  .action(
    async (
      kind: string,
      opts: { slug?: string; brief?: string; audienceThreshold?: number; json: boolean },
    ) => {
      const root = await findRepoRoot(ROOT);
      if (kind !== 'landing') {
        console.error(chalk.red(`[harness] score: kind=${kind} не поддерживается (поддерживается: landing)`));
        process.exit(1);
      }
      if (!opts.slug) {
        console.error(chalk.red('[harness] score landing: --slug обязателен'));
        process.exit(1);
      }
      if (!opts.brief) {
        console.error(chalk.red('[harness] score landing: --brief обязателен'));
        process.exit(1);
      }
      const { loadAudienceScoring } = await import('./schemas/audience-scoring');
      const { validateLandingAudience, formatAudienceReportMarkdown } = await import('./validators/landing-audience');
      const specRaw = await readFile(resolve(root, 'content', 'landings', `${opts.slug}.json`), 'utf-8');
      const spec = LandingSpecSchema.parse(JSON.parse(specRaw));
      const briefRaw = await readFile(resolve(root, opts.brief), 'utf-8');
      const brief = BriefSchema.parse(JSON.parse(briefRaw));
      const scoring = await loadAudienceScoring(root);
      const result = validateLandingAudience(spec, scoring, { brief, threshold: opts.audienceThreshold });

      const reportAt = new Date().toISOString();
      const md = formatAudienceReportMarkdown(opts.slug, result, reportAt);
      const jsonAbs = resolve(root, '.context', 'audience-score', `${opts.slug}.json`);
      const mdAbs = resolve(root, '.context', 'audience-score', `${opts.slug}.md`);
      await mkdir(dirname(jsonAbs), { recursive: true });
      await writeFile(jsonAbs, JSON.stringify({ generatedAt: reportAt, ...result }, null, 2) + '\n', 'utf-8');
      await writeFile(mdAbs, md + '\n', 'utf-8');

      if (opts.json) {
        console.log(JSON.stringify({ generatedAt: reportAt, ...result }, null, 2));
        process.exit(result.ok ? 0 : 1);
      }

      const status = result.ok ? chalk.green('✓ pass') : chalk.red('✗ fail');
      console.log(`[harness] audience-score landing/${opts.slug} — ${result.score}/${result.threshold} — ${status}`);
      console.log(chalk.dim(`         segments: ${result.resolvedSegments.join(', ') || 'n/a'}`));
      console.log(chalk.dim(`         ctaTypes: ${result.ctaTypes.join(', ') || 'n/a'}`));
      for (const b of result.breakdown) {
        console.log(chalk.dim(`         ${b.id} ${b.label}: raw=${b.raw} weighted=${b.weighted}`));
      }
      for (const e of result.errors) {
        console.log(`  ${chalk.red('✗')} ${e.kind}${e.ruleId ? `/${e.ruleId}` : ''}: ${e.message}`);
        if (e.suggestion) console.log(chalk.dim(`     → ${e.suggestion}`));
      }
      console.log(chalk.dim(`\n         full report → ${relative(root, mdAbs)}`));
      process.exit(result.ok ? 0 : 1);
    },
  );

agent
  .command('build')
  .description(
    'ENTRY POINT для нового brief: читает brief, проверяет покрытие домена (гейт) и запускает phased pipeline (P0..P8). Непокрытый домен → стоп с todo-списком mock\'ов.',
  )
  .argument('<kind>', 'тип артефакта: landing')
  .option('-s, --slug <slug>', 'slug черновика')
  .option('-b, --brief <path>', 'путь к brief.json (обязателен)')
  .option('--route-only', 'только показать routing decision, не запускать pipeline', false)
  .option('--require-intake-approved', 'не запускать сборку, пока ТЗ (intake) не approved на /intake/<slug>', false)
  .option('--skip-gates', 'пропустить жёсткие гейты (briefs-immutable) — осознанный обход', false)
  .action(
    async (
      kind: string,
      opts: {
        slug?: string;
        brief?: string;
        routeOnly: boolean;
        requireIntakeApproved: boolean;
        skipGates: boolean;
      },
    ) => {
      const root = await findRepoRoot(ROOT);
      printHostBanner();
      assertBriefsUnmodifiedOrExit(root, { skip: opts.skipGates });
      if (kind !== 'landing') {
        console.error(chalk.red(`[harness] agent build: kind=${kind} не поддерживается`));
        process.exit(1);
      }
      if (!opts.slug || !opts.brief) {
        console.error(chalk.red('[harness] agent build landing: --slug и --brief обязательны'));
        process.exit(1);
      }

      // Опциональный гейт: не собирать, пока ТЗ (intake) не согласовано (mirror handoff --require-approved).
      if (opts.requireIntakeApproved) {
        const intakeApproval = await readApproval(root, opts.slug, 'intake');
        if (intakeApproval.status !== 'approved') {
          console.error(
            chalk.red(
              `[harness] agent build: ТЗ (intake) не approved (статус: ${intakeApproval.status}). ` +
                `Согласуй на /intake/${opts.slug} или убери --require-intake-approved.`,
            ),
          );
          process.exit(1);
        }
        console.log(chalk.green('[harness] ✓ intake approved — продолжаю сборку'));
      }

      // Загрузка brief.
      const briefAbs = resolve(root, opts.brief);
      let brief;
      try {
        const briefRaw = await readFile(briefAbs, 'utf-8');
        brief = BriefSchema.parse(JSON.parse(briefRaw));
      } catch (err) {
        console.error(
          chalk.red(`[harness] agent build: не удалось прочитать brief: ${(err as Error).message}`),
        );
        process.exit(1);
      }

      // Routing (гейт домена).
      const decision = routePipeline(brief, opts.slug);

      console.log(formatRouteDecision(decision));
      console.log('');

      // Сохраняем decision в pipeline dir для трассировки.
      const decisionPath = resolve(
        root,
        '.context',
        'pipeline',
        opts.slug,
        'route-decision.json',
      );
      await mkdir(dirname(decisionPath), { recursive: true });
      await writeFile(decisionPath, JSON.stringify(decision, null, 2) + '\n', 'utf-8');
      console.log(chalk.dim(`route decision → ${relative(root, decisionPath)}`));
      console.log('');

      if (opts.routeOnly) {
        console.log(chalk.dim('[harness] --route-only: завершено без запуска pipeline.'));
        process.exit(0);
      }

      // HARD halt: manual-creation-required.
      if (decision.mode === 'manual-creation-required') {
        console.error(chalk.red('[harness] ✗ STOP. Pipeline отказывается работать.'));
        console.error(chalk.red('       Создай нужные mock\'и (см. список выше), затем запусти заново.'));
        process.exit(2);
      }

      // PHASED — единственный конвейер сборки.
      console.log(chalk.cyan('[harness] → запуск phased pipeline...'));
      console.log('');
      const report = await runPhasedPipeline({
        root,
        slug: opts.slug,
        briefPath: opts.brief,
      });
      console.log(formatPhasedRunReport(report));
      process.exit(report.ok ? 0 : 1);
    },
  );

agent
  .command('run')
  .description(
    'Phased pipeline: end-to-end orchestrator (P0..P8). Идемпотентен — пропускает уже сделанные фазы.',
  )
  .argument('<kind>', 'тип артефакта: landing')
  .option('-s, --slug <slug>', 'slug черновика')
  .option('-b, --brief <path>', 'путь к brief.json (обязателен)')
  .option('--skip-gates', 'пропустить жёсткие гейты (briefs-immutable) — осознанный обход', false)
  .action(async (kind: string, opts: { slug?: string; brief?: string; skipGates: boolean }) => {
    const root = await findRepoRoot(ROOT);
    printHostBanner();
    assertBriefsUnmodifiedOrExit(root, { skip: opts.skipGates });
    if (kind !== 'landing') {
      console.error(chalk.red(`[harness] agent run: kind=${kind} не поддерживается`));
      process.exit(1);
    }
    if (!opts.slug || !opts.brief) {
      console.error(chalk.red('[harness] agent run landing: --slug и --brief обязательны'));
      process.exit(1);
    }
    const report = await runPhasedPipeline({
      root,
      slug: opts.slug,
      briefPath: opts.brief,
    });
    console.log(formatPhasedRunReport(report));
    process.exit(report.ok ? 0 : 1);
  });

agent
  .command('run-phase')
  .description(
    'Запустить одну фазу phased pipeline (для debugging / rerun). Артефакты других фаз должны существовать.',
  )
  .argument('<kind>', 'тип артефакта: landing')
  .argument('<phase>', 'фаза: P0, P1, P2, P3, P4, P5, P6, P7, P8')
  .option('-s, --slug <slug>', 'slug черновика')
  .option('-b, --brief <path>', 'путь к brief.json (обязателен)')
  .option('--skip-gates', 'пропустить жёсткие гейты (briefs-immutable) — осознанный обход', false)
  .action(
    async (
      kind: string,
      phase: string,
      opts: { slug?: string; brief?: string; skipGates: boolean },
    ) => {
      const root = await findRepoRoot(ROOT);
      printHostBanner();
      assertBriefsUnmodifiedOrExit(root, { skip: opts.skipGates });
      if (kind !== 'landing') {
        console.error(chalk.red(`[harness] agent run-phase: kind=${kind} не поддерживается`));
        process.exit(1);
      }
      if (!opts.slug || !opts.brief) {
        console.error(chalk.red('[harness] agent run-phase: --slug и --brief обязательны'));
        process.exit(1);
      }
      const phaseId = phase.toUpperCase() as PhaseId;
      if (!['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'].includes(phaseId)) {
        console.error(chalk.red(`[harness] agent run-phase: phase=${phase} не валидна`));
        process.exit(1);
      }
      const report = await runPhasedPipeline({
        root,
        slug: opts.slug,
        briefPath: opts.brief,
        onlyPhase: phaseId,
      });
      console.log(formatPhasedRunReport(report));
      process.exit(report.ok ? 0 : 1);
    },
  );

program
  .command('diversity')
  .description('Standalone cross-landing diversity audit (без orchestrator).')
  .argument('<action>', 'audit')
  .option('-s, --slug <slug>', 'slug лендинга')
  .option('-b, --brief <path>', 'путь к brief.json (для резолва домена)')
  .option('--strict', 'превратить warnings в errors', false)
  .action(
    async (
      action: string,
      opts: { slug?: string; brief?: string; strict: boolean },
    ) => {
      const root = await findRepoRoot(ROOT);
      if (action !== 'audit') {
        console.error(chalk.red(`[harness] diversity: action=${action} не поддерживается`));
        process.exit(1);
      }
      if (!opts.slug) {
        console.error(chalk.red('[harness] diversity audit: --slug обязателен'));
        process.exit(1);
      }
      const { validateCrossLandingDiversity, formatCrossLandingDiversityErrors, writeCrossLandingDiversityReport } =
        await import('./validators/cross-landing-diversity');
      const specRaw = await readFile(resolve(root, 'content', 'landings', `${opts.slug}.json`), 'utf-8');
      const spec = LandingSpecSchema.parse(JSON.parse(specRaw));
      const brief = opts.brief
        ? BriefSchema.parse(JSON.parse(await readFile(resolve(root, opts.brief), 'utf-8')))
        : undefined;
      const result = await validateCrossLandingDiversity(spec, {
        root,
        slug: opts.slug,
        brief,
        strict: opts.strict,
      });
      const reportAbs = await writeCrossLandingDiversityReport(root, opts.slug, result);
      console.log(formatCrossLandingDiversityErrors(result));
      console.log(chalk.dim(`\nreport → ${relative(root, reportAbs)}`));
      process.exit(result.ok ? 0 : 1);
    },
  );

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

/* ─── Stage-8: wiki / lint / ingest / log / approve commands ─────────── */

const wiki = program
  .command('wiki')
  .description('Команды для работы с wiki/ (sync, index, new, validate)');

wiki
  .command('sync')
  .description('Регенерировать derived из design-system/kaiten-v01/tokens.json: tokens.css, wiki/design-system/*.md gen-blocks')
  .action(async () => {
    const root = await findRepoRoot(ROOT);
    console.log(chalk.cyan('[harness] wiki sync: tokens.json → tokens.css + wiki/design-system/*.md'));
    const result = await wikiSync(root);
    for (const p of result.written) console.log(chalk.green(`  written  ${p}`));
    for (const p of result.unchanged) console.log(chalk.dim(`  ok       ${p}`));
    for (const p of result.missingPages)
      console.log(chalk.yellow(`  missing  ${p}  (создайте страницу руками)`));
    console.log(
      chalk.cyan(
        `[harness] wiki sync done: ${result.written.length} written, ${result.unchanged.length} unchanged, ${result.missingPages.length} missing`,
      ),
    );
    await appendLog(root, {
      op: 'wiki-sync',
      status: 'ok',
      note: `written=${result.written.length} unchanged=${result.unchanged.length} missing=${result.missingPages.length}`,
    });
  });

wiki
  .command('index')
  .description('Регенерировать wiki/index.md из всех страниц wiki/**.md (читает front-matter)')
  .action(async () => {
    const root = await findRepoRoot(ROOT);
    const result = await rebuildIndex(root);
    if (result.changed) {
      console.log(chalk.green(`[harness] ✓ wiki/index.md regenerated (${result.pageCount} pages)`));
    } else {
      console.log(chalk.dim(`[harness] wiki/index.md уже актуален (${result.pageCount} pages)`));
    }
    await appendLog(root, {
      op: 'wiki-index',
      status: 'ok',
      note: `pages=${result.pageCount} changed=${result.changed}`,
    });
  });

wiki
  .command('new')
  .description('Создать новую wiki-страницу (audience | pattern | landing | archetype)')
  .argument('<type>', 'тип страницы: audience | pattern | landing | archetype')
  .argument('<slug>', 'kebab-case идентификатор')
  .action(async (type: string, slug: string) => {
    const allowed: WikiPageType[] = ['audience', 'pattern', 'landing', 'archetype'];
    if (!allowed.includes(type as WikiPageType)) {
      console.error(chalk.red(`[harness] неподдерживаемый тип: ${type} (ожидается: ${allowed.join(', ')})`));
      process.exit(1);
    }
    const root = await findRepoRoot(ROOT);
    const result = await scaffoldWikiPage(root, type as WikiPageType, slug);
    if (result.alreadyExists) {
      console.log(chalk.yellow(`[harness] ${result.path} уже существует — не перетёрт`));
    } else {
      console.log(chalk.green(`[harness] ✓ scaffolded ${result.path}`));
    }
  });

wiki
  .command('validate')
  .description('Алиас для `harness lint --scope wiki`')
  .action(async () => {
    const root = await findRepoRoot(ROOT);
    const result = await runLint(root, 'wiki', REGISTRY.map((c) => c.name));
    printLintResult(result);
  });

program
  .command('lint')
  .description('Проверки drift и валидность wiki/, tokens, registry, agent-контракта')
  .option('--scope <scope>', 'all | wiki | registry | prompts | agents', 'all')
  .option('--json', 'JSON вывод (для CI)', false)
  .action(async (opts: { scope: string; json: boolean }) => {
    const root = await findRepoRoot(ROOT);
    const scope = (['all', 'wiki', 'registry', 'prompts', 'agents'].includes(opts.scope) ? opts.scope : 'all') as LintScope;
    const result = await runLint(root, scope, REGISTRY.map((c) => c.name));
    if (opts.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printLintResult(result);
    }
    await appendLog(root, {
      op: 'lint',
      status: result.issues.some((i) => i.severity === 'error') ? 'fail' : 'ok',
      note: `scope=${scope} files=${result.filesChecked} errors=${result.issues.filter((i) => i.severity === 'error').length} warnings=${result.issues.filter((i) => i.severity === 'warning').length}`,
    });
    if (result.issues.some((i) => i.severity === 'error')) process.exit(1);
  });

const ingest = program
  .command('ingest')
  .description('Ingest brief/feedback в wiki (audiences, lessons, reviewer notes)');

ingest
  .command('brief')
  .description('Классифицировать brief через LLM и создать wiki/audiences/*.md')
  .argument('<path>', 'путь к brief.json')
  .option('--no-llm', 'детерминированный fallback')
  .action(async (path: string, opts: { llm: boolean }) => {
    const root = await findRepoRoot(ROOT);
    const briefPath = resolve(root, path);
    const briefRaw = await readFile(briefPath, 'utf-8');
    const brief = BriefSchema.parse(JSON.parse(briefRaw));
    console.log(chalk.cyan(`[harness] ingest brief: ${path}`));
    const result = await ingestBrief(root, brief, path, { useLLM: opts.llm !== false });
    console.log(chalk.green(`  archetype hint: ${result.archetypeHint}`));
    for (const p of result.audiencesCreated) console.log(chalk.green(`  created  ${p}`));
    for (const p of result.audiencesUpdated) console.log(chalk.dim(`  exists   ${p}`));
    if (result.patternCandidates.length) {
      console.log(chalk.cyan(`  pattern hints: ${result.patternCandidates.join(', ')}`));
    }
    if (!result.llmUsed) {
      console.log(chalk.yellow('  (no-llm fallback использован)'));
    }
  });

ingest
  .command('feedback')
  .description('Добавить заметку ревьюера в wiki/landings/<slug>.md')
  .argument('<slug>', 'slug лендинга')
  .argument('<note>', 'текст заметки')
  .action(async (slug: string, note: string) => {
    const root = await findRepoRoot(ROOT);
    const path = await appendReviewerNote(root, { slug, note });
    console.log(chalk.green(`[harness] ✓ reviewer note → ${path}`));
    await appendLog(root, { op: 'ingest', slug, status: 'ok', note: `feedback: ${note.slice(0, 60)}${note.length > 60 ? '…' : ''}` });
  });

program
  .command('approve')
  .description('Обновить status в wiki/landings/<slug>.md на approved (Stage-8 filing back)')
  .argument('<slug>', 'slug лендинга')
  .option('--baseline-ref <ref>', 'ссылка на visual baseline')
  .option('--note <text>', 'дополнительная заметка', '')
  .action(async (slug: string, opts: { baselineRef?: string; note?: string }) => {
    const root = await findRepoRoot(ROOT);
    const path = await updateLandingStatus(root, {
      slug,
      status: 'approved' as LandingStatus,
      baselineRef: opts.baselineRef,
      note: opts.note || 'approved via CLI',
    });
    console.log(chalk.green(`[harness] ✓ wiki status=approved → ${path}`));
    await appendLog(root, { op: 'approve', slug, status: 'ok', note: opts.baselineRef ? `baseline=${opts.baselineRef}` : '' });
  });

program
  .command('log')
  .description('Показать последние записи wiki/log.md')
  .option('-n, --tail <n>', 'количество последних записей', '20')
  .option('--filter <op>', 'фильтр по операции: generate | ingest | lint | wiki-sync | approve | handoff')
  .action(async (opts: { tail: string; filter?: string }) => {
    const root = await findRepoRoot(ROOT);
    const entries = await readLog(root, {
      tail: parseInt(opts.tail, 10) || 20,
      filter: opts.filter as LogOp | undefined,
    });
    if (entries.length === 0) {
      console.log(chalk.dim('(log пуст или фильтр ничего не нашёл)'));
      return;
    }
    for (const line of entries) console.log(line);
  });

function printLintResult(result: { issues: { code: string; severity: string; message: string; path?: string }[]; filesChecked: number }): void {
  const errors = result.issues.filter((i) => i.severity === 'error');
  const warnings = result.issues.filter((i) => i.severity === 'warning');
  for (const i of errors) {
    console.log(chalk.red(`  ✗ [${i.code}] ${i.message}`));
  }
  for (const i of warnings) {
    console.log(chalk.yellow(`  ! [${i.code}] ${i.message}`));
  }
  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green(`[harness] ✓ lint clean (${result.filesChecked} files checked)`));
  } else {
    console.log(
      chalk.cyan(
        `[harness] ${errors.length} error(s), ${warnings.length} warning(s) across ${result.filesChecked} files`,
      ),
    );
  }
}

/* ─── Stage-5 approvals (JSON-based, content/approvals/) ─────────────── */

const approvals = program.command('approvals').description('Работа с approval-статусами лендингов (content/approvals/*.json)');

approvals
  .command('list')
  .description('Список всех approval-файлов со статусами')
  .action(async () => {
    const root = await findRepoRoot(ROOT);
    const items = await listApprovals(root);
    if (items.length === 0) {
      console.log(chalk.yellow('[harness] нет approval-файлов в content/approvals/'));
      return;
    }
    const STATUS_COLOR: Record<ApprovalStatus, (s: string) => string> = {
      pending: chalk.dim,
      changes_requested: chalk.yellow,
      approved: chalk.green,
      rejected: chalk.red,
    };
    for (const a of items) {
      const tag = STATUS_COLOR[a.status](`[${a.status}]`);
      const reviewer = a.reviewer ? ` · ${a.reviewer}` : '';
      console.log(`${tag} ${a.slug}${reviewer} · ${a.updatedAt}`);
    }
  });

approvals
  .command('status')
  .description('Подробный статус для конкретного slug')
  .argument('<slug>', 'slug черновика')
  .action(async (slug: string) => {
    const root = await findRepoRoot(ROOT);
    const a = await readApproval(root, slug);
    console.log(JSON.stringify(a, null, 2));
  });

approvals
  .command('check')
  .description('CI-проверка: все ли указанные slug одобрены (exit≠0 если нет)')
  .argument('<slugs...>', 'один или несколько slug')
  .action(async (slugs: string[]) => {
    const root = await findRepoRoot(ROOT);
    let bad = 0;
    for (const slug of slugs) {
      const a = await readApproval(root, slug);
      if (a.status === 'approved') {
        console.log(chalk.green(`✓ ${slug} approved`));
      } else {
        console.log(chalk.red(`✗ ${slug} status=${a.status}`));
        bad++;
      }
    }
    if (bad > 0) process.exit(1);
  });

/* ─── Handoff (stage-6 ZIP packer) ────────────────────────────────────── */

program
  .command('handoff')
  .description('Собрать ZIP-пакет для передачи разработчикам')
  .argument('<slug>', 'slug черновика')
  .option('--require-approved', 'отказать если approval.status != approved', false)
  .option('-o, --out <path>', 'путь к ZIP (по умолчанию <root>/out/landing-<slug>.zip)')
  .action(async (slug: string, opts: { requireApproved: boolean; out?: string }) => {
    const root = await findRepoRoot(ROOT);

    if (opts.requireApproved) {
      const approval = await readApproval(root, slug);
      if (approval.status !== 'approved') {
        console.error(
          chalk.red(
            `[harness] handoff blocked: approval.status="${approval.status}" (требуется "approved"). ` +
              `Открой /approve/${slug} в Next.js или сними флаг --require-approved.`,
          ),
        );
        process.exit(1);
      }
      console.log(chalk.green(`[harness] ✓ approval check passed (${approval.reviewer ?? 'unknown'})`));
    }

    console.log(chalk.cyan(`[harness] handoff ${slug}…`));
    const t0 = Date.now();
    const manifest = await buildHandoff(slug, { root, outPath: opts.out });
    const ms = Date.now() - t0;
    const kb = (manifest.bytes / 1024).toFixed(1);
    console.log(chalk.green(`[harness] ✓ ZIP → ${manifest.zipPath} (${kb} KB, ${manifest.files.length} files, ${ms}ms)`));
    console.log(chalk.dim(`         components: ${manifest.components.join(', ') || '(none)'}`));
    if (manifest.illustrations.length) {
      console.log(chalk.dim(`         illustrations: ${manifest.illustrations.join(', ')}`));
    }

    // Stage-8: после handoff обновить wiki/landings/<slug>.md и log.
    try {
      await updateLandingStatus(root, {
        slug,
        status: 'shipped' as LandingStatus,
        zipRef: manifest.zipPath,
        note: `handoff ZIP (${kb} KB, ${manifest.files.length} files)`,
      });
    } catch {
      // wiki/landings/<slug>.md может ещё не существовать — это OK
    }
    await appendLog(root, {
      op: 'handoff',
      slug,
      status: 'ok',
      note: `zip=${manifest.zipPath} files=${manifest.files.length} bytes=${manifest.bytes}`,
    }).catch(() => {});
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(chalk.red('[harness] fatal:'), err);
  process.exit(1);
});
