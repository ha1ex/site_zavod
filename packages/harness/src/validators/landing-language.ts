import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { LandingSpec } from '../schemas/landing-spec';

/**
 * Language-валидатор (англицизмы, §10 редполитики Kaiten).
 *
 * Сканирует текстовые поля LandingSpec (и, переиспользуемо, поля брифа) на:
 *   - англицизмы с понятным русским аналогом (словарь замен);
 *   - латинские Kanban/Scrum вне контекста «метод/фреймворк» (нужна кириллица);
 *   - аббревиатуры без русской расшифровки.
 *
 * Правила и исключения вынесены в data-файл wiki/references/anglicism-dictionary.json
 * (источник истины — его MD-зеркало). Это второй контур к brand-канону в system-prompt:
 * промпт ПРОСИТ соблюдать §10, валидатор ЛОВИТ нарушения.
 *
 * Severity error/warning берётся из словаря. Решение блокировать или нет — на стороне
 * вызывающего (ingest по умолчанию soft: всё в warnings; strict — error блокирует).
 */

export interface AnglicismReplacement {
  term: string;
  replacement: string;
  severity: 'error' | 'warning';
  audienceException?: boolean;
}

export interface CyrillicRequiredRule {
  latin: string;
  cyrillic: string;
  qualifiers: string[];
}

export interface AbbreviationRule {
  abbr: string;
  expansion: string;
}

export interface AnglicismDictionary {
  replacements: AnglicismReplacement[];
  serviceNames: string[];
  cyrillicRequired: CyrillicRequiredRule[];
  abbreviations: AbbreviationRule[];
}

export interface LandingLanguageError {
  rule: 'anglicism' | 'kanban-cyrillic' | 'abbreviation-unexpanded';
  field: string;
  message: string;
  evidence: string;
  suggestion?: string;
  severity: 'error' | 'warning';
}

export interface LandingLanguageResult {
  ok: boolean;
  errors: LandingLanguageError[];
}

export interface TextField {
  field: string;
  value: string;
}

const DICTIONARY_REL = 'wiki/references/anglicism-dictionary.json';
let dictCache: AnglicismDictionary | null = null;

export async function loadAnglicismDictionary(root: string): Promise<AnglicismDictionary> {
  if (dictCache) return dictCache;
  const raw = await readFile(resolve(root, DICTIONARY_REL), 'utf-8');
  const parsed = JSON.parse(raw) as Partial<AnglicismDictionary>;
  dictCache = {
    replacements: parsed.replacements ?? [],
    serviceNames: parsed.serviceNames ?? [],
    cyrillicRequired: parsed.cyrillicRequired ?? [],
    abbreviations: parsed.abbreviations ?? [],
  };
  return dictCache;
}

export function clearAnglicismDictionaryCache(): void {
  dictCache = null;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Строгое совпадение слова (обе границы по unicode-буквам/цифрам). Намеренно НЕ ловим
 * словоформы (фича≠фичами), чтобы не давать ложных срабатываний на русских словах
 * (колл≠коллега). Регистронезависимо по умолчанию.
 */
function wordPresent(text: string, term: string, caseSensitive = false): boolean {
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(term)}(?![\\p{L}\\p{N}])`, caseSensitive ? 'u' : 'iu');
  return re.test(text);
}

/** Технические ключи, которые не сканируем (href/id/иконки/коды компонентов). */
function isTechnicalKey(k: string): boolean {
  return k === 'icon' || k === 'href' || k === 'id' || k === 'component' || k === 'assetId' || k === 'variant' || k === 'mediaVariant' || k === 'mockVariant';
}

/** Собирает пары {field, value} из произвольной структуры (секции/props/seo). */
export function collectTextFields(prefix: string, value: unknown, out: TextField[]): void {
  if (value == null) return;
  if (typeof value === 'string') {
    out.push({ field: prefix, value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectTextFields(`${prefix}[${i}]`, v, out));
    return;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (isTechnicalKey(k)) continue;
      collectTextFields(`${prefix}.${k}`, v, out);
    }
  }
}

/**
 * Ядро проверки: гоняет словарь по списку текстовых полей.
 * Переиспользуется и для LandingSpec, и для брифа (brief-quality).
 */
export function scanTextFieldsForLanguage(texts: TextField[], dict: AnglicismDictionary): LandingLanguageError[] {
  const errors: LandingLanguageError[] = [];
  const fullText = texts.map((t) => t.value).join('\n');

  for (const { field, value } of texts) {
    // 1. Англицизмы из словаря замен
    for (const r of dict.replacements) {
      if (wordPresent(value, r.term)) {
        errors.push({
          rule: 'anglicism',
          field,
          message: `Англицизм «${r.term}» → «${r.replacement}» (§10).`,
          evidence: value,
          suggestion: r.replacement,
          severity: r.severity,
        });
      }
    }

    // 2. Kanban/Scrum латиницей вне контекста «метод/фреймворк» / имени сервиса
    const lowVal = value.toLowerCase();
    for (const c of dict.cyrillicRequired) {
      if (!wordPresent(value, c.latin)) continue;
      const idx = lowVal.indexOf(c.latin.toLowerCase());
      const window = lowVal.slice(Math.max(0, idx - 16), idx + c.latin.length + 16);
      const qualified =
        c.qualifiers.some((q) => window.includes(q.toLowerCase())) ||
        dict.serviceNames.some((s) => s.toLowerCase() !== c.latin.toLowerCase() && window.includes(s.toLowerCase()));
      if (!qualified) {
        errors.push({
          rule: 'kanban-cyrillic',
          field,
          message: `Латинское «${c.latin}» на публичной поверхности — пиши кириллицей «${c.cyrillic}» (§10).`,
          evidence: value,
          suggestion: c.cyrillic,
          severity: 'error',
        });
      }
    }
  }

  // 3. Аббревиатуры без расшифровки (один раз по всему тексту)
  for (const a of dict.abbreviations) {
    if (!wordPresent(fullText, a.abbr, true)) continue;
    // §10: первое употребление = «русская расшифровка (АББР)». Паттерн «(АББР» в тексте
    // → считаем расшифрованной; иначе голая аббревиатура → warning.
    if (fullText.includes(`(${a.abbr}`)) continue;
    const host = texts.find((t) => wordPresent(t.value, a.abbr, true));
    errors.push({
      rule: 'abbreviation-unexpanded',
      field: host?.field ?? '*',
      message: `Аббревиатура «${a.abbr}» без русской расшифровки. При первом употреблении: ${a.expansion} (${a.abbr}).`,
      evidence: host?.value ?? a.abbr,
      suggestion: `${a.expansion} (${a.abbr})`,
      severity: 'warning',
    });
  }

  return errors;
}

export async function validateLandingLanguage(
  spec: LandingSpec,
  opts: { root: string },
): Promise<LandingLanguageResult> {
  const dict = await loadAnglicismDictionary(opts.root);
  const texts: TextField[] = [];
  spec.sections.forEach((section, i) => {
    collectTextFields(`sections[${i}:${section.component}]`, section.props, texts);
  });
  collectTextFields('seo', spec.seo, texts);

  const errors = scanTextFieldsForLanguage(texts, dict);
  return { ok: errors.every((e) => e.severity !== 'error'), errors };
}

export function formatLandingLanguageErrors(result: LandingLanguageResult): string {
  if (result.ok && result.errors.length === 0) return 'OK';
  return result.errors
    .map((e) => `  [language:${e.rule}:${e.severity}] ${e.field} — ${e.message}`)
    .join('\n');
}
