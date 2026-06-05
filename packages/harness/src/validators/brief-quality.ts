import type { Brief } from '../schemas/brief';
import { scanText } from './landing-brand';
import {
  loadAnglicismDictionary,
  scanTextFieldsForLanguage,
  type TextField,
} from './landing-language';
import { resolveDomainFromBrief } from '../registry/domain-visual';

/**
 * Brief-quality валидатор — семантические проверки брифа СВЕРХ Zod (BriefSchema уже
 * гарантирует наличие/типы полей). Детерминированный, без LLM — дешёвый гейт перед
 * запуском P1..P8 и перед публикацией брифа из intake-этапа (фабрика ТЗ).
 *
 * Переиспользует существующие контуры (без дублирования правил):
 *   - scanText (landing-brand) — те же лозунги/hype-слова §9;
 *   - scanTextFieldsForLanguage (landing-language) — тот же словарь англицизмов §10;
 *   - resolveDomainFromBrief (registry) — тот же резолв домена, что P0/P3/routing.
 *
 * Контракт severity: структурные проблемы (пустой/тонкий бриф, лозунг, нерезолвимый
 * домен) — `error`. Стилистика (англицизмы в брифе, нет proofPoints) — `warning`:
 * копирайт брифа всё равно переписывается на P6, а финальный лендинг ловит language
 * validator. Неподтверждённые факты — в needsConfirmation (§5/§18).
 */

export interface BriefQualityError {
  rule:
    | 'field-too-thin'
    | 'slogan-in-field'
    | 'anglicism'
    | 'domain-unresolvable'
    | 'proof-missing';
  field: string;
  message: string;
  evidence?: string;
  severity: 'error' | 'warning';
}

export interface BriefQualityResult {
  ok: boolean;
  errors: BriefQualityError[];
  needsConfirmation: string[];
}

const MIN_FIELD_CHARS = 24;
const CONFIRM_KEYWORDS = ['импорт', 'перенос', 'перенес', 'миграц', 'бесплатн', 'on-prem', 'on prem', 'реестр', 'гост', 'sla', 'тариф'];

export async function validateBriefQuality(
  brief: Brief,
  opts: { root: string },
): Promise<BriefQualityResult> {
  const errors: BriefQualityError[] = [];
  const needsConfirmation: string[] = [];

  const product = (brief.product ?? '').trim();
  const pain = (brief.mainPain ?? '').trim();
  const promise = (brief.mainPromise ?? '').trim();
  const cta = (brief.cta ?? '').trim();

  // 1. Содержательность полей (сверх Zod min-length)
  if (pain.length < MIN_FIELD_CHARS) {
    errors.push({ rule: 'field-too-thin', field: 'mainPain', message: `mainPain слишком короткий/неинформативный (< ${MIN_FIELD_CHARS} симв.) — нужен конкретный сценарий боли.`, evidence: pain, severity: 'error' });
  }
  if (promise.length < MIN_FIELD_CHARS) {
    errors.push({ rule: 'field-too-thin', field: 'mainPromise', message: `mainPromise слишком короткий (< ${MIN_FIELD_CHARS} симв.).`, evidence: promise, severity: 'error' });
  }
  if (pain && product && pain.toLowerCase() === product.toLowerCase()) {
    errors.push({ rule: 'field-too-thin', field: 'mainPain', message: 'mainPain дублирует product — опиши боль аудитории, а не продукт.', evidence: pain, severity: 'error' });
  }

  // 2. Лозунги/hype в ключевых полях (переиспользуем landing-brand scanText)
  const sloganFields: Array<[string, string]> = [
    ['brief.mainPain', pain],
    ['brief.mainPromise', promise],
    ['brief.cta', cta],
  ];
  for (const [field, value] of sloganFields) {
    if (!value) continue;
    for (const e of scanText(field, value)) {
      errors.push({ rule: 'slogan-in-field', field, message: e.message, evidence: e.evidence, severity: 'error' });
    }
  }

  // 3. Англицизмы (переиспользуем словарь §10) — severity downgrade до warning:
  //    бриф — промежуточный, финальный лендинг проверит language validator.
  const texts: TextField[] = [
    { field: 'brief.product', value: product },
    { field: 'brief.mainPain', value: pain },
    { field: 'brief.mainPromise', value: promise },
    { field: 'brief.cta', value: cta },
    ...(brief.proofPoints ?? []).map((p, i) => ({ field: `brief.proofPoints[${i}]`, value: p })),
  ].filter((t) => t.value);
  try {
    const dict = await loadAnglicismDictionary(opts.root);
    for (const e of scanTextFieldsForLanguage(texts, dict)) {
      errors.push({ rule: 'anglicism', field: e.field, message: e.message, evidence: e.evidence, severity: 'warning' });
    }
  } catch {
    // словарь недоступен — пропускаем языковую проверку брифа (не блокируем)
  }

  // 4. Домен должен резолвиться (как в routing/P0/P3) — иначе плохой лендинг гарантирован
  const domain = resolveDomainFromBrief(brief);
  if (domain === 'unknown') {
    errors.push({
      rule: 'domain-unresolvable',
      field: 'product/market/audience',
      message: 'Домен не резолвится из брифа — уточни product/market/audience конкретикой (например, не «B2B SaaS», а «CRM для салонов красоты»).',
      severity: 'error',
    });
  }

  // 5. ProofPoints для не-waitlist целей (мягко)
  if ((!brief.proofPoints || brief.proofPoints.length === 0) && brief.primaryGoal !== 'waitlist') {
    errors.push({ rule: 'proof-missing', field: 'proofPoints', message: 'Нет proofPoints — добавь факты/доказательства для trust (или вынеси в needs_confirmation).', severity: 'warning' });
  }

  // 6. needs_confirmation: эвристика на неподтверждённые продуктовые факты (§5/§18)
  const blob = `${pain} ${promise} ${(brief.proofPoints ?? []).join(' ')}`.toLowerCase();
  for (const kw of CONFIRM_KEYWORDS) {
    if (blob.includes(kw)) {
      needsConfirmation.push(`Проверь по базе знаний/продуктовым фактам утверждение со словом «${kw}» (§5/§18) перед публикацией.`);
    }
  }

  return { ok: errors.every((e) => e.severity !== 'error'), errors, needsConfirmation };
}

export function formatBriefQualityErrors(result: BriefQualityResult): string {
  const lines: string[] = [];
  for (const e of result.errors) lines.push(`  [brief:${e.rule}:${e.severity}] ${e.field} — ${e.message}`);
  for (const n of result.needsConfirmation) lines.push(`  [brief:needs-confirmation] ${n}`);
  return lines.length ? lines.join('\n') : 'OK';
}
