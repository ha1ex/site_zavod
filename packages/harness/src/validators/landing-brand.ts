import type { LandingSpec } from '../schemas/landing-spec';

/**
 * Brand-voice валидатор для LandingSpec (этап 4).
 *
 * Сканирует все текстовые поля на hype-лексику и общие маркетинговые штампы,
 * которые противоречат tone-of-voice Контент-завод Кайтен/Kaiten ("clear, practical,
 * confident, no hype"). Список вынесен сюда, чтобы был кросс-проверяемым
 * вместе с system prompt (где даны те же правила) — двойной контур.
 */

export interface LandingBrandError {
  rule: 'hype-word' | 'absolutist' | 'empty-marketing';
  field: string;
  message: string;
  evidence: string;
}

export interface LandingBrandResult {
  ok: boolean;
  errors: LandingBrandError[];
}

const HYPE_WORDS = [
  'revolutionary',
  'revolution',
  'game-changer',
  'game changing',
  'game-changing',
  'world-class',
  'best-in-class',
  'next-generation',
  'next generation',
  'cutting-edge',
  'cutting edge',
  'bleeding-edge',
  'state-of-the-art',
  'blazingly fast',
  'blazing fast',
  'lightning fast',
  'lightning-fast',
  'ai magic',
  'magical',
  'unparalleled',
  'unmatched',
  'mind-blowing',
  'жаркий',
  'революционный',
  'волшеб',
  'невероятный',
  'идеальный',
];

const ABSOLUTIST = [/\b10x\b/i, /\b100x\b/i, /\beverything\b/i, /\banyone\b/i, /\bвсё\b/i, /\bвсе\b/i];

const EMPTY_FILLER = [
  'leverage',
  'synergy',
  'paradigm shift',
  'best practices',
  'next level',
  'world class',
];

// Пустые маркетинговые лозунги из редполитики Kaiten §9.1 (русские фразы-подстроки).
const MARKETING_SLOGANS = [
  'на новый уровень',
  'забудьте о хаосе',
  'забудьте про хаос',
  'революционное решение',
  'идеальная система',
  'лучший инструмент',
  'лучший сервис',
  'полный контроль над',
  'больше не будет ошибаться',
  'и всё заработает',
];

export function scanText(field: string, value: string): LandingBrandError[] {
  const errors: LandingBrandError[] = [];
  const lower = value.toLowerCase();

  for (const word of HYPE_WORDS) {
    const w = word.toLowerCase();
    if (lower.includes(w)) {
      errors.push({
        rule: 'hype-word',
        field,
        message: `Hype-слово "${word}" в поле ${field}. Заменить на конкретику или убрать.`,
        evidence: value,
      });
    }
  }

  for (const re of ABSOLUTIST) {
    const m = value.match(re);
    if (m) {
      errors.push({
        rule: 'absolutist',
        field,
        message: `Абсолютистская формулировка "${m[0]}" в ${field}. Используй измеримый результат.`,
        evidence: value,
      });
    }
  }

  for (const filler of EMPTY_FILLER) {
    if (lower.includes(filler)) {
      errors.push({
        rule: 'empty-marketing',
        field,
        message: `Пустой маркетинговый штамп "${filler}" в ${field}.`,
        evidence: value,
      });
    }
  }

  for (const slogan of MARKETING_SLOGANS) {
    if (lower.includes(slogan)) {
      errors.push({
        rule: 'empty-marketing',
        field,
        message: `Пустой маркетинговый лозунг "${slogan}" в ${field}. Замени на конкретный сценарий/пользу (редполитика §9).`,
        evidence: value,
      });
    }
  }

  return errors;
}

function walkSection(prefix: string, value: unknown, out: LandingBrandError[]): void {
  if (value == null) return;
  if (typeof value === 'string') {
    out.push(...scanText(prefix, value));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walkSection(`${prefix}[${i}]`, v, out));
    return;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // Не сканируем технические поля
      if (k === 'icon' || k === 'href' || k === 'id' || k === 'component' || k === 'assetId') continue;
      walkSection(`${prefix}.${k}`, v, out);
    }
  }
}

export function validateLandingBrand(spec: LandingSpec): LandingBrandResult {
  const errors: LandingBrandError[] = [];
  spec.sections.forEach((section, i) => {
    walkSection(`sections[${i}:${section.component}]`, section.props, errors);
  });
  // SEO тоже копи
  walkSection('seo', spec.seo, errors);
  return { ok: errors.length === 0, errors };
}

export function formatLandingBrandErrors(result: LandingBrandResult): string {
  if (result.ok) return 'OK';
  return result.errors
    .map((e) => `  [brand:${e.rule}] ${e.field} — ${e.message}`)
    .join('\n');
}
