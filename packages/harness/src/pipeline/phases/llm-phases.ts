import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getAllowedVariants, getDomainEntry } from '../../registry/domain-visual';
import { AudienceIntentPlanSchema } from '../../schemas/audience-intent-plan';
import { LayoutDecisionSchema } from '../../schemas/layout-decision';
import { SectionPlanSchema } from '../../schemas/section-plan';
import { MockAllocationSchema } from '../../schemas/mock-allocation';
import { LandingSpecSchema } from '../../schemas/landing-spec';
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
  return runHostAgentPhase({
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
          '- `crm-product-tour`\n\n' +
          'Полный каталог с описанием — `wiki/layouts/index.md`.',
      },
    ],
    outputSchema: LayoutDecisionSchema,
    outputName: 'p2-layout-decision',
  });
}

/** P4 Section Architect. */
export async function runP4SectionArchitect(ctx: PhaseContext): Promise<PhaseResult> {
  const normalized = await loadArtifact(ctx, 'p0-brief-normalized.json');
  const audience = await loadArtifact(ctx, 'p1-audience-intent.json');
  const layout = await loadArtifact(ctx, 'p2-layout-decision.json');
  const coverage = await loadArtifact(ctx, 'p3-coverage-report.json');
  return runHostAgentPhase({
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
  });
}

/** P5 Mock Allocation Refinement. */
export async function runP5MockAllocation(ctx: PhaseContext): Promise<PhaseResult> {
  const sectionPlan = await loadArtifact(ctx, 'p4-section-plan.json');
  const coverage = await loadArtifact(ctx, 'p3-coverage-report.json');
  return runHostAgentPhase({
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
    ],
    outputSchema: MockAllocationSchema,
    outputName: 'p5-mock-allocation',
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

/** P8 Illustration Allocation (skeleton — MVP). */
export async function runP8IllustrationAllocation(ctx: PhaseContext): Promise<PhaseResult> {
  const normalized = await loadArtifact(ctx, 'p0-brief-normalized.json');
  const finalSpec = await loadArtifact(ctx, 'p7-landing-spec-final.json');
  const domain = getDomainEntry(
    JSON.parse(normalized.startsWith('{') ? normalized : '{"resolvedDomain":"unknown"}')
      ?.resolvedDomain ?? 'unknown',
  );
  return runHostAgentPhase({
    phase: 'P8',
    ctx,
    title: 'Illustration Allocation',
    taskDescription:
      'Для секций без подходящего mock\'а — определи, нужно ли генерировать уникальную SVG. ' +
      'MVP: для каждой Hero/MediaCopy секции с mockVariant=default или customIllustrationId — ' +
      `сгенерируй IllustrationSpec по правилам packages/harness/src/prompts/svg-illustration-skill.md. ` +
      'Если все секции имеют валидный domain-mock — возвращай empty allocations.',
    contextBlocks: [
      { heading: 'p7-landing-spec-final.json', body: '```json\n' + finalSpec + '\n```' },
      {
        heading: 'Allowed variants для домена',
        body: domain
          ? `Domain: \`${domain.domain}\` (${domain.displayName})\n` +
            `Variants: ${getAllowedVariants(domain.domain).join(', ')}`
          : 'Domain unknown — обнови brief.',
      },
    ],
    outputSchema: AudienceIntentPlanSchema, // placeholder schema — MVP, M4 заменит
    outputName: 'p8-illustration-allocation',
  });
}
