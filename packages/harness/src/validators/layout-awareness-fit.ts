import type { AudienceIntentPlan, AwarenessLevel } from '../schemas/audience-intent-plan';
import type { LayoutDecision } from '../schemas/layout-decision';

/**
 * layout-awareness-fit — P2 gate.
 *
 * Проверяет: выбранный layout совместим с awareness level аудитории.
 * Маппинг hardcoded на основе wiki/layouts/index.md (колонка Awareness).
 *
 * Layouts описаны через supported awareness levels — если резолвленный
 * awareness не входит, валидатор выдаёт warning (soft, потому что иногда
 * легитимно — например, `compliance-first-enterprise` может работать и для
 * product-aware с натяжкой).
 */

const LAYOUT_AWARENESS: Record<string, Set<AwarenessLevel>> = {
  'enterprise-modular-saas': new Set(['solution-aware', 'product-aware', 'most-aware']),
  'single-module-deep-dive': new Set(['problem-aware', 'solution-aware', 'product-aware']),
  'compliance-first-enterprise': new Set(['most-aware']),
  'comparison-vs-competitor': new Set(['product-aware', 'most-aware']),
  'story-led-unaware': new Set(['unaware', 'problem-aware']),
  'depersonalized-product-tour': new Set(['problem-aware', 'solution-aware']),
  'crm-product-tour': new Set(['problem-aware', 'solution-aware']),
  'migration-from-competitor': new Set(['most-aware']),
  'product-launch': new Set(['unaware', 'problem-aware']),
  'case-study-deep-dive': new Set(['product-aware', 'most-aware']),
};

export interface LayoutAwarenessFitError {
  rule: 'awareness-mismatch' | 'layout-not-registered';
  message: string;
  where?: string;
}

export interface LayoutAwarenessFitResult {
  ok: boolean;
  errors: LayoutAwarenessFitError[];
  warnings: LayoutAwarenessFitError[];
}

export function validateLayoutAwarenessFit(
  layout: LayoutDecision,
  audience: AudienceIntentPlan,
): LayoutAwarenessFitResult {
  const errors: LayoutAwarenessFitError[] = [];
  const warnings: LayoutAwarenessFitError[] = [];

  const supported = LAYOUT_AWARENESS[layout.layoutSlug];
  if (!supported) {
    warnings.push({
      rule: 'layout-not-registered',
      message:
        `Layout '${layout.layoutSlug}' не зарегистрирован в LAYOUT_AWARENESS. ` +
        'Добавь его в layout-awareness-fit.ts с поддерживаемыми awareness levels ' +
        'согласно wiki/layouts/index.md.',
      where: 'layoutSlug',
    });
    return { ok: true, errors, warnings };
  }

  if (!supported.has(audience.awareness)) {
    warnings.push({
      rule: 'awareness-mismatch',
      message:
        `Layout '${layout.layoutSlug}' не оптимален для awareness='${audience.awareness}'. ` +
        `Поддерживаемые awareness levels: [${[...supported].join(', ')}]. ` +
        'Подумай о переключении layout (см. wiki/layouts/index.md).',
      where: 'layoutSlug + audience.awareness',
    });
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function formatLayoutAwarenessFitErrors(result: LayoutAwarenessFitResult): string {
  if (result.ok && result.warnings.length === 0) return 'OK';
  const lines: string[] = [];
  for (const e of result.errors)
    lines.push(`  [awareness:${e.rule}] ${e.where ?? '*'} — ${e.message}`);
  for (const w of result.warnings)
    lines.push(`  [awareness:warn:${w.rule}] ${w.where ?? '*'} — ${w.message}`);
  return lines.join('\n');
}
