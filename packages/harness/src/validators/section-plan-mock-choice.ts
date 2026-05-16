import type { SectionPlan } from '../schemas/section-plan';

/**
 * section-plan-mock-choice — P4 gate.
 *
 * Проверяет:
 *   - визуальные секции (HeroSection, MediaCopy, TabbedFeatureSection,
 *     ScenarioWalkthroughSection) должны иметь mockVariant;
 *   - если mockVariant=default/generic — обязательно mockVariantRationale ≥ 20
 *     символов (форсирует осознанный выбор).
 *
 * Зачем: запрет на «забыл указать mock и поэтому default» — это закрывает
 * проблему «лендинг с тремя default-плейсхолдерами».
 */

const VISUAL_COMPONENTS = new Set([
  'HeroSection',
  'MediaCopy',
  'TabbedFeatureSection',
  'ScenarioWalkthroughSection',
]);

const PLACEHOLDER_VARIANTS = new Set(['default', 'generic']);

export interface SectionPlanMockChoiceError {
  rule: 'visual-section-missing-mock' | 'placeholder-without-rationale';
  message: string;
  where?: string;
}

export interface SectionPlanMockChoiceResult {
  ok: boolean;
  errors: SectionPlanMockChoiceError[];
  warnings: SectionPlanMockChoiceError[];
}

export function validateSectionPlanMockChoice(
  plan: SectionPlan,
): SectionPlanMockChoiceResult {
  const errors: SectionPlanMockChoiceError[] = [];
  const warnings: SectionPlanMockChoiceError[] = [];

  plan.sections.forEach((s, idx) => {
    if (!VISUAL_COMPONENTS.has(s.component)) return;
    if (!s.mockVariant) {
      errors.push({
        rule: 'visual-section-missing-mock',
        message:
          `Section ${idx} (${s.component}) — визуальная секция без mockVariant. ` +
          'Укажи variant из allowed (см. mock-allocation phase для domain-fit).',
        where: `sections[${idx}].mockVariant`,
      });
      return;
    }
    if (PLACEHOLDER_VARIANTS.has(s.mockVariant)) {
      const rationaleLen = (s.mockVariantRationale ?? '').trim().length;
      if (rationaleLen < 20) {
        errors.push({
          rule: 'placeholder-without-rationale',
          message:
            `Section ${idx} (${s.component}) использует mockVariant='${s.mockVariant}' — ` +
            'это placeholder, требует обоснования. Добавь mockVariantRationale ' +
            `(≥ 20 символов, сейчас ${rationaleLen}). Если обоснования нет — ` +
            'выбери domain-specific variant вместо placeholder.',
          where: `sections[${idx}].mockVariantRationale`,
        });
      }
    }
  });

  return { ok: errors.length === 0, errors, warnings };
}

export function formatSectionPlanMockChoiceErrors(
  result: SectionPlanMockChoiceResult,
): string {
  if (result.ok && result.warnings.length === 0) return 'OK';
  const lines: string[] = [];
  for (const e of result.errors)
    lines.push(`  [mock-choice:${e.rule}] ${e.where ?? '*'} — ${e.message}`);
  for (const w of result.warnings)
    lines.push(`  [mock-choice:warn:${w.rule}] ${w.where ?? '*'} — ${w.message}`);
  return lines.join('\n');
}
