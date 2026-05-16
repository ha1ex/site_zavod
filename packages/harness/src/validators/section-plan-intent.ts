import type { AudienceIntentPlan } from '../schemas/audience-intent-plan';
import type { SectionPlan } from '../schemas/section-plan';

/**
 * section-plan-intent — P4 gate.
 *
 * Проверяет: каждая mustCoverIntent из AudienceIntentPlan покрыта хотя бы одной
 * секцией в SectionPlan.sections (через section.intent или
 * SectionPlan.storyCoverageMap для top user stories).
 *
 * Зачем: без этого LLM на P4 может построить структуру, в которой важная
 * intent-aware story не отражена ни в одной секции — лендинг получится
 * мимо аудитории.
 */

export interface SectionPlanIntentError {
  rule: 'must-cover-intent-uncovered' | 'top-story-uncovered';
  message: string;
  where?: string;
}

export interface SectionPlanIntentResult {
  ok: boolean;
  errors: SectionPlanIntentError[];
  warnings: SectionPlanIntentError[];
}

export function validateSectionPlanIntent(
  plan: SectionPlan,
  audience: AudienceIntentPlan,
): SectionPlanIntentResult {
  const errors: SectionPlanIntentError[] = [];
  const warnings: SectionPlanIntentError[] = [];

  const allCoveredIntents = new Set<string>();
  for (const s of plan.sections) {
    if (s.intent) allCoveredIntents.add(s.intent.toLowerCase());
  }

  for (const must of audience.mustCoverIntents) {
    const mustLower = must.toLowerCase();
    const covered =
      allCoveredIntents.has(mustLower) ||
      [...allCoveredIntents].some(
        (intent) => intent.includes(mustLower) || mustLower.includes(intent),
      );
    if (!covered) {
      errors.push({
        rule: 'must-cover-intent-uncovered',
        message:
          `mustCoverIntent '${must}' не покрыт ни одной секцией. ` +
          `Доступные intents: [${[...allCoveredIntents].join(', ')}]. ` +
          'Добавь секцию с этим intent или скорректируй keyMessage существующей.',
        where: 'sections[*].intent',
      });
    }
  }

  for (const storyId of audience.topUserStories) {
    const covered = plan.storyCoverageMap[storyId] && plan.storyCoverageMap[storyId]!.length > 0;
    if (!covered) {
      warnings.push({
        rule: 'top-story-uncovered',
        message:
          `Top user story '${storyId}' из audience-intent.topUserStories не упомянута ` +
          'в storyCoverageMap. Это не блокирует, но рискует что секция не закроет ' +
          'priority story.',
        where: `storyCoverageMap.${storyId}`,
      });
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function formatSectionPlanIntentErrors(result: SectionPlanIntentResult): string {
  if (result.ok && result.warnings.length === 0) return 'OK';
  const lines: string[] = [];
  for (const e of result.errors) lines.push(`  [intent:${e.rule}] ${e.where ?? '*'} — ${e.message}`);
  for (const w of result.warnings)
    lines.push(`  [intent:warn:${w.rule}] ${w.where ?? '*'} — ${w.message}`);
  return lines.join('\n');
}
