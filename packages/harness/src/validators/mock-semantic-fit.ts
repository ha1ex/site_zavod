import type { MockAllocation } from '../schemas/mock-allocation';
import {
  type Domain,
  getAllowedVariants,
  getDomainOfVariant,
} from '../registry/domain-visual';

/**
 * mock-semantic-fit — P5 gate.
 *
 * Проверяет: каждое решение в MockAllocation.decisions содержит variant,
 * который входит в allowed variants для резолвленного домена.
 *
 * Это второй слой защиты от cross-domain reuse (первый — illustration-domain-match
 * на ingest-level). Здесь мы ловим её на уровне SectionPlan/MockAllocation
 * до того, как spec вообще будет сформирован.
 */

const PLACEHOLDER_VARIANTS = new Set(['default', 'generic']);

export interface MockSemanticFitError {
  rule: 'variant-not-in-domain' | 'placeholder-when-domain-has-options';
  message: string;
  where?: string;
}

export interface MockSemanticFitResult {
  ok: boolean;
  errors: MockSemanticFitError[];
  warnings: MockSemanticFitError[];
}

export function validateMockSemanticFit(
  allocation: MockAllocation,
  domain: Domain,
): MockSemanticFitResult {
  const errors: MockSemanticFitError[] = [];
  const warnings: MockSemanticFitError[] = [];
  const allowed = new Set<string>(getAllowedVariants(domain));

  allocation.decisions.forEach((d, idx) => {
    if (PLACEHOLDER_VARIANTS.has(d.mockVariant)) {
      if (allowed.size > 0) {
        warnings.push({
          rule: 'placeholder-when-domain-has-options',
          message:
            `Decision ${idx} (slot ${d.slot}) использует placeholder '${d.mockVariant}', ` +
            `но домен '${domain}' имеет ${allowed.size} domain-specific variants: ` +
            `${[...allowed].join(', ')}. Выбери один из них.`,
          where: `decisions[${idx}].mockVariant`,
        });
      }
      return;
    }
    if (!allowed.has(d.mockVariant)) {
      const wrongDomain = getDomainOfVariant(d.mockVariant) ?? 'unknown';
      errors.push({
        rule: 'variant-not-in-domain',
        message:
          `Decision ${idx} (slot ${d.slot}) выбрал variant '${d.mockVariant}' из домена ` +
          `'${wrongDomain}', а резолвленный домен — '${domain}'. ` +
          (allowed.size > 0
            ? `Используй один из: ${[...allowed].join(', ')}.`
            : `Домен '${domain}' не имеет своих mocks — нужно создать набор сначала.`),
        where: `decisions[${idx}].mockVariant`,
      });
    }
  });

  return { ok: errors.length === 0, errors, warnings };
}

export function formatMockSemanticFitErrors(result: MockSemanticFitResult): string {
  if (result.ok && result.warnings.length === 0) return 'OK';
  const lines: string[] = [];
  for (const e of result.errors)
    lines.push(`  [semantic-fit:${e.rule}] ${e.where ?? '*'} — ${e.message}`);
  for (const w of result.warnings)
    lines.push(`  [semantic-fit:warn:${w.rule}] ${w.where ?? '*'} — ${w.message}`);
  return lines.join('\n');
}
