import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  getAllowedVariants,
  getDomainEntry,
  resolveDomainFromBrief,
} from '../../registry/domain-visual';
import {
  AudienceIntentPlanSchema,
  type AudienceIntentPlan,
} from '../../schemas/audience-intent-plan';
import { LayoutDecisionSchema, type LayoutDecision } from '../../schemas/layout-decision';
import { SectionPlanSchema, type SectionPlan } from '../../schemas/section-plan';
import { MockAllocationSchema, type MockAllocation } from '../../schemas/mock-allocation';
import { LandingSpecSchema } from '../../schemas/landing-spec';
import {
  validateLayoutAwarenessFit,
  validateMockSemanticFit,
  validateSectionPlanIntent,
  validateSectionPlanMockChoice,
} from '../../validators/index';
import { runHostAgentPhase } from './host-agent-phase';
import type { PhaseContext, PhaseResult } from './types';

/**
 * Все LLM-фазы phased pipeline. Каждая использует общий runHostAgentPhase
 * helper, который реализует pattern «idempotent rerun: если artefact есть —
 * валидируй и проходи, иначе пиши prompt и стой».
 *
 * MVP: per-phase task descriptions сейчас минимальные. Полноценные prompts
 * (из wiki/audiences, wiki/layouts, design-system) — следующая итерация.
 */

async function readFileOpt(p: string): Promise<string | undefined> {
  try {
    return await readFile(p, 'utf-8');
  } catch {
    return undefined;
  }
}

function pipelineFile(ctx: PhaseContext, name: string): string {
  return resolve(ctx.root, '.context', 'pipeline', ctx.slug, name);
}

async function loadArtifact(ctx: PhaseContext, name: string): Promise<string> {
  const content = await readFileOpt(pipelineFile(ctx, name));
  return content ?? '(artifact not yet generated)';
}

/** P1 Audience Intent Analysis. */
export async function runP1AudienceIntent(ctx: PhaseContext): Promise<PhaseResult> {
  const normalized = await loadArtifact(ctx, 'p0-brief-normalized.json');
  return runHostAgentPhase({
    phase: 'P1',
    ctx,
    title: 'Audience Intent Analysis',
    taskDescription:
      'На основе нормализованного brief и `wiki/audiences/kaiten-scoring.json` определи целевую аудиторию: ' +
      'resolvedSegments (id из scoring config), awareness level, decisionMaker, top-3-7 user stories, ' +
      'mustCoverIntents (что spec обязан покрыть), forbiddenIntents (антипрофиль), preferredCtaTypes. ' +
      'В rationale (2-3 абзаца) объясни почему именно эти сегменты, awareness и DM выбраны.',
    contextBlocks: [
      { heading: 'p0-brief-normalized.json', body: '```json\n' + normalized + '\n```' },
      {
        heading: 'Подсказка',
        body:
          'Прочитай `wiki/audiences/kaiten-scoring.json` и `wiki/audiences/kaiten-scoring.md` ' +
          'для каталога сегментов, ролей и user stories. ' +
          'Если brief.resolvedSegments уже заполнен — используй его как hint, но всё равно ' +
          'переосмысли через scoring config.',
      },
    ],
    outputSchema: AudienceIntentPlanSchema,
    outputName: 'p1-audience-intent',
  });
}

/** P2 Layout Selection. */
export async function runP2LayoutSelection(ctx: PhaseContext): Promise<PhaseResult> {
  const normalized = await loadArtifact(ctx, 'p0-brief-normalized.json');
  const audience = await loadArtifact(ctx, 'p1-audience-intent.json');
  const audienceParsed = AudienceIntentPlanSchema.safeParse(JSON.parse(audience || '{}'));
  return runHostAgentPhase<LayoutDecision>({
    phase: 'P2',
    ctx,
    title: 'Layout Selection',
    taskDescription:
      'Выбери layout из `wiki/layouts/index.md`, который подходит под audience-plan. ' +
      'Учти awareness, segment, decisionMaker. Заполни layoutSlug, whyThisLayout (50+ символов), ' +
      'alternativesConsidered (top-2 отвергнутых с обоснованием), ' +
      'requiredSectionOrder (последовательность секций из wiki/layouts/<slug>.md).',
    contextBlocks: [
      { heading: 'p0-brief-normalized.json', body: '```json\n' + normalized + '\n```' },
      { heading: 'p1-audience-intent.json', body: '```json\n' + audience + '\n```' },
      {
        heading: 'Доступные layouts',
        body:
          '- `enterprise-modular-saas`\n- `single-module-deep-dive`\n- `compliance-first-enterprise`\n' +
          '- `comparison-vs-competitor`\n- `story-led-unaware`\n- `depersonalized-product-tour`\n' +
          '- `crm-product-tour`\n- `migration-from-competitor`\n- `product-launch`\n' +
          '- `case-study-deep-dive`\n\n' +
          'Полный каталог с описанием — `wiki/layouts/index.md`.',
      },
    ],
    outputSchema: LayoutDecisionSchema,
    outputName: 'p2-layout-decision',
    postValidate: audienceParsed.success
      ? async (parsed) => {
          const result = validateLayoutAwarenessFit(parsed, audienceParsed.data);
          return {
            errors: result.errors.map((e) => e.message),
            warnings: result.warnings.map((w) => w.message),
          };
        }
      : undefined,
  });
}

/** P4 Section Architect. */
export async function runP4SectionArchitect(ctx: PhaseContext): Promise<PhaseResult> {
  const normalized = await loadArtifact(ctx, 'p0-brief-normalized.json');
  const audience = await loadArtifact(ctx, 'p1-audience-intent.json');
  const layout = await loadArtifact(ctx, 'p2-layout-decision.json');
  const coverage = await loadArtifact(ctx, 'p3-coverage-report.json');
  const audienceParsed = AudienceIntentPlanSchema.safeParse(JSON.parse(audience || '{}'));
  return runHostAgentPhase<SectionPlan>({
    phase: 'P4',
    ctx,
    title: 'Section Architect',
    taskDescription:
      'Спроектируй структуру секций (БЕЗ копирайта!): для каждого слота — component, ' +
      'intent (что секция доказывает), coversStoryIds (из p1-audience-intent.topUserStories), ' +
      'coversRoleIds, keyMessage (1 строка-тезис), mockVariant (обязателен для визуальных слотов: ' +
      'Hero, MediaCopy, Tabs, Scenario). Если ставишь mockVariant=default/generic — обязательно ' +
      'mockVariantRationale.\n\n' +
      'Заполни storyCoverageMap: для каждой mustCoverIntent / topUserStory укажи в каких ' +
      'слотах она покрыта.',
    contextBlocks: [
      { heading: 'p0-brief-normalized.json', body: '```json\n' + normalized + '\n```' },
      { heading: 'p1-audience-intent.json', body: '```json\n' + audience + '\n```' },
      { heading: 'p2-layout-decision.json', body: '```json\n' + layout + '\n```' },
      { heading: 'p3-coverage-report.json', body: '```json\n' + coverage + '\n```' },
    ],
    outputSchema: SectionPlanSchema,
    outputName: 'p4-section-plan',
    postValidate: async (parsed) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const mockChoice = validateSectionPlanMockChoice(parsed);
      errors.push(...mockChoice.errors.map((e) => e.message));
      if (audienceParsed.success) {
        const intent = validateSectionPlanIntent(parsed, audienceParsed.data);
        errors.push(...intent.errors.map((e) => e.message));
        warnings.push(...intent.warnings.map((w) => w.message));
      }
      return { errors, warnings };
    },
  });
}

/** P5 Mock Allocation Refinement. */
export async function runP5MockAllocation(ctx: PhaseContext): Promise<PhaseResult> {
  const sectionPlan = await loadArtifact(ctx, 'p4-section-plan.json');
  const coverage = await loadArtifact(ctx, 'p3-coverage-report.json');
  const domain = resolveDomainFromBrief(ctx.brief);
  return runHostAgentPhase<MockAllocation>({
    phase: 'P5',
    ctx,
    title: 'Mock Allocation Refinement',
    taskDescription:
      'Финализируй per-slot выбор mock-варианта. Для каждой визуальной секции из ' +
      'p4-section-plan заполни: slot, component, mockVariant (финальный выбор), ' +
      'rationaleText (2-3 предложения почему именно этот variant). ' +
      'Используй ТОЛЬКО variants из coverage-report.slotCoverage[].recommendedMockVariant ' +
      '— это разрешённые для домена variants. Любые другие = cross-domain reuse.',
    contextBlocks: [
      { heading: 'p4-section-plan.json', body: '```json\n' + sectionPlan + '\n```' },
      { heading: 'p3-coverage-report.json', body: '```json\n' + coverage + '\n```' },
      {
        heading: 'Разрешённые variants для домена',
        body:
          `Domain: \`${domain}\`\nVariants: ${getAllowedVariants(domain).join(', ') || '<нет mocks для домена>'}`,
      },
    ],
    outputSchema: MockAllocationSchema,
    outputName: 'p5-mock-allocation',
    postValidate: async (parsed) => {
      const result = validateMockSemanticFit(parsed, domain);
      return {
        errors: result.errors.map((e) => e.message),
        warnings: result.warnings.map((w) => w.message),
      };
    },
  });
}

/** P6 Copy Generation (полный LandingSpec). */
export async function runP6CopyGeneration(ctx: PhaseContext): Promise<PhaseResult> {
  const sectionPlan = await loadArtifact(ctx, 'p4-section-plan.json');
  const mockAllocation = await loadArtifact(ctx, 'p5-mock-allocation.json');
  const audience = await loadArtifact(ctx, 'p1-audience-intent.json');
  const layout = await loadArtifact(ctx, 'p2-layout-decision.json');
  const normalized = await loadArtifact(ctx, 'p0-brief-normalized.json');
  return runHostAgentPhase({
    phase: 'P6',
    ctx,
    title: 'Copy Generation',
    taskDescription:
      'Заполни копирайт во все секции, опираясь на section-plan + mock-allocation. ' +
      'Структура уже зафиксирована — менять её НЕЛЬЗЯ. Только тексты: eyebrow, title, ' +
      'subtitle, description, items, checklist, цитаты, метрики, CTA labels. ' +
      'Voice: clear, practical, no hype (см. wiki/design-system/voice.md). ' +
      'Russian, реалистичный, доменно-релевантный. Результат — полный LandingSpec в ' +
      `content/landings/${ctx.slug}.json (а не в .context/pipeline/!). ` +
      'Дополнительно сохрани копию артефакта в указанном outputPath для трассы.',
    contextBlocks: [
      { heading: 'p4-section-plan.json', body: '```json\n' + sectionPlan + '\n```' },
      { heading: 'p5-mock-allocation.json', body: '```json\n' + mockAllocation + '\n```' },
      { heading: 'p1-audience-intent.json', body: '```json\n' + audience + '\n```' },
      { heading: 'p2-layout-decision.json', body: '```json\n' + layout + '\n```' },
      { heading: 'p0-brief-normalized.json', body: '```json\n' + normalized + '\n```' },
    ],
    outputSchema: LandingSpecSchema,
    outputName: 'p6-landing-spec-draft',
  });
}

/** P7 SEO + CTA Polish. */
export async function runP7SeoCtaPolish(ctx: PhaseContext): Promise<PhaseResult> {
  const draft = await loadArtifact(ctx, 'p6-landing-spec-draft.json');
  const audience = await loadArtifact(ctx, 'p1-audience-intent.json');
  return runHostAgentPhase({
    phase: 'P7',
    ctx,
    title: 'SEO + CTA Polish',
    taskDescription:
      'Возьми p6-landing-spec-draft.json и улучши: ' +
      '(1) seo.title и seo.description должны упоминать резолвленный сегмент или ключи top user stories ' +
      '(см. p1-audience-intent.mustCoverIntents). ' +
      '(2) Все *.Cta.label должны быть в стиле preferredCtaTypes из audience-plan. ' +
      'Структуру spec\'а НЕ меняй, только title/description в seo и labels в Cta.',
    contextBlocks: [
      { heading: 'p6-landing-spec-draft.json', body: '```json\n' + draft + '\n```' },
      { heading: 'p1-audience-intent.json', body: '```json\n' + audience + '\n```' },
    ],
    outputSchema: LandingSpecSchema,
    outputName: 'p7-landing-spec-final',
  });
}

/** P8 Illustration Allocation — полная реализация M4.
 *
 * Flow:
 *   1. Читает финальный LandingSpec из p7-landing-spec-final.json.
 *   2. Вызывает allocateIllustrations() — для каждой визуальной секции
 *      определяет reuse-mock / generate-svg / no-op.
 *   3. Если нет generate-svg decisions — phase ok, пишет artefact и идёт дальше.
 *   4. Если есть generate-svg — для каждой IllustrationSpec эмитирует
 *      host-agent prompt в .context/pipeline/<slug>/p8-illustration-<id>.prompt.md
 *      с указанием expected output path в packages/ui/src/illustrations/generated/.
 *      Status='awaiting-host-agent'.
 *   5. На rerun проверяет что все expected TSX файлы существуют — если да,
 *      загружает metadata и проходит.
 */
export async function runP8IllustrationAllocation(ctx: PhaseContext): Promise<PhaseResult> {
  const { mkdir, readFile: rf, writeFile } = await import('node:fs/promises');
  const { dirname, relative, resolve } = await import('node:path');
  const { allocateIllustrations, illustrationTsxPath } = await import('../allocate-illustrations');

  const messages: string[] = [];
  const errors: string[] = [];
  const pipelineDir = resolve(ctx.root, '.context', 'pipeline', ctx.slug);

  // Загружаем финальный spec.
  let finalSpec;
  try {
    const raw = await rf(resolve(pipelineDir, 'p7-landing-spec-final.json'), 'utf-8');
    finalSpec = JSON.parse(raw);
  } catch {
    // Fallback: используем оригинальный content/landings/<slug>.json
    try {
      const raw = await rf(resolve(ctx.root, 'content', 'landings', `${ctx.slug}.json`), 'utf-8');
      finalSpec = JSON.parse(raw);
    } catch (err) {
      errors.push(`Не найден ни p7-landing-spec-final.json, ни content/landings/${ctx.slug}.json: ${(err as Error).message}`);
      return { phase: 'P8', status: 'error', messages, errors };
    }
  }

  // Allocation.
  const allocation = await allocateIllustrations(finalSpec, ctx.brief, { root: ctx.root });
  const allocationOutputPath = resolve(pipelineDir, 'p8-illustration-allocation.json');
  await mkdir(dirname(allocationOutputPath), { recursive: true });
  await writeFile(
    allocationOutputPath,
    JSON.stringify(
      {
        domain: allocation.domain,
        decisions: allocation.decisions.map((d) => ({
          sectionIdx: d.sectionIdx,
          sectionId: d.sectionId,
          intent: d.intent,
          decision: d.decision,
          variant: d.variant,
          illustrationId: d.illustrationId,
          rationale: d.rationale,
          illustrationSpec: d.illustrationSpec,
        })),
        suggestions: allocation.suggestions,
        existingFingerprints: allocation.existingFingerprints,
      },
      null,
      2,
    ) + '\n',
    'utf-8',
  );
  messages.push(
    `allocation: ${allocation.decisions.length} decisions, ${allocation.illustrationsToGenerate.length} SVG to generate.`,
  );

  // Если нет generate-svg — phase ok.
  if (allocation.illustrationsToGenerate.length === 0) {
    if (allocation.suggestions.length > 0) {
      for (const s of allocation.suggestions) messages.push(s);
    }
    return {
      phase: 'P8',
      status: 'ok',
      artifactPath: allocationOutputPath,
      messages,
      errors,
    };
  }

  // Проверяем какие TSX уже сгенерированы.
  const pending: typeof allocation.illustrationsToGenerate = [];
  for (const ispec of allocation.illustrationsToGenerate) {
    const tsxAbs = resolve(ctx.root, illustrationTsxPath(allocation.domain, getIntentForSpec(allocation, ispec.id) ?? 'hero', ispec.id));
    try {
      await rf(tsxAbs, 'utf-8');
      messages.push(`already-generated: ${relative(ctx.root, tsxAbs)}`);
    } catch {
      pending.push(ispec);
    }
  }

  if (pending.length === 0) {
    messages.push(`Все ${allocation.illustrationsToGenerate.length} SVG уже сгенерированы.`);
    return {
      phase: 'P8',
      status: 'ok',
      artifactPath: allocationOutputPath,
      messages,
      errors,
    };
  }

  // Эмитируем host-agent prompts для каждой pending SVG.
  for (const ispec of pending) {
    const intent = getIntentForSpec(allocation, ispec.id) ?? 'hero';
    const tsxRel = illustrationTsxPath(allocation.domain, intent, ispec.id);
    const promptPath = resolve(pipelineDir, `p8-illustration-${ispec.id}.prompt.md`);
    const prompt = buildIllustrationPrompt({
      ispec,
      intent,
      domain: allocation.domain,
      tsxRelPath: tsxRel,
      existingFingerprints: allocation.existingFingerprints,
      brief: ctx.brief,
    });
    await writeFile(promptPath, prompt, 'utf-8');
    messages.push(`prompt: ${relative(ctx.root, promptPath)} → expected output: ${tsxRel}`);
  }

  return {
    phase: 'P8',
    status: 'awaiting-host-agent',
    artifactPath: allocationOutputPath,
    promptPath: pending[0]
      ? resolve(pipelineDir, `p8-illustration-${pending[0]!.id}.prompt.md`)
      : undefined,
    messages,
    errors,
  };
}

function getIntentForSpec(
  allocation: { decisions: Array<{ illustrationId?: string; intent: string }> },
  specId: string,
): string | undefined {
  return allocation.decisions.find((d) => d.illustrationId === specId)?.intent;
}

function buildIllustrationPrompt(opts: {
  ispec: import('../../schemas/illustration-spec').IllustrationSpec;
  intent: string;
  domain: string;
  tsxRelPath: string;
  existingFingerprints: string[];
  brief: import('../../schemas/brief').Brief;
}): string {
  const fence = '```';
  const lines: string[] = [];
  lines.push(`# P8 Illustration Generation — \`${opts.ispec.id}\``);
  lines.push('');
  lines.push(`> Сгенерируй уникальную SVG-иллюстрацию для секции \`${opts.intent}\` лендинга в домене \`${opts.domain}\`.`);
  lines.push('> Это **host-agent mode**: ты (LLM) пишешь TSX-код по spec ниже.');
  lines.push('');
  lines.push('## Output');
  lines.push('');
  lines.push(`Запиши TSX-файл в:`);
  lines.push('');
  lines.push(`\`${opts.tsxRelPath}\``);
  lines.push('');
  lines.push('Также создай рядом `<имя>.meta.json` с metadata (id, domain, intent, fingerprint).');
  lines.push('');
  lines.push('## Brief (контекст продукта)');
  lines.push('');
  lines.push(`${fence}json`);
  lines.push(JSON.stringify(opts.brief, null, 2));
  lines.push(fence);
  lines.push('');
  lines.push('## IllustrationSpec');
  lines.push('');
  lines.push(`${fence}json`);
  lines.push(JSON.stringify(opts.ispec, null, 2));
  lines.push(fence);
  lines.push('');
  if (opts.existingFingerprints.length > 0) {
    lines.push('## Anti-duplication: уже использованные fingerprints');
    lines.push('');
    lines.push('**НЕ повторяй эти композиции 1:1.** Допустимые оси варьирования:');
    lines.push('- ракурс (laptop vs phone vs split-screen)');
    lines.push('- sub-palette из тех же tokens');
    lines.push('- композиция decorations (растения / sparkles vs пусто)');
    lines.push('- domain-specific UI-фрагмент (board vs chart vs list)');
    lines.push('');
    lines.push(`${fence}`);
    lines.push(opts.existingFingerprints.join('\n'));
    lines.push(fence);
    lines.push('');
  }
  lines.push('## Правила');
  lines.push('');
  lines.push('Прочитай `packages/harness/src/prompts/svg-illustration-skill.md` целиком — там:');
  lines.push('- hard rules (dual light/dark render, ID suffixes -d/-l, tabular-nums, нет stopColor=transparent)');
  lines.push('- soft rules (domain-realism: внутри `<text>` нодов — реалистичные русские строки из домена)');
  lines.push('- AST-валидатор будет жёстко проверять корректность TSX');
  lines.push('');
  lines.push('## После записи');
  lines.push('');
  lines.push('1. Запусти валидатор: `pnpm -w run harness validate illustration --path <tsxPath>`');
  lines.push('2. Если AST-validator падает — поправь TSX по фидбеку и повтори.');
  lines.push('3. Когда все pending SVG созданы — повторно запусти `harness agent run-phase landing P8 --slug <slug>` — orchestrator увидит готовые файлы и пройдёт фазу.');
  return lines.join('\n');
}
