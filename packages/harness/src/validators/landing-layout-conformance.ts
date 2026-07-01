import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { LandingSpec } from '../schemas/landing-spec';

/**
 * landing-layout-conformance — проверяет, что spec следует обязательной структуре
 * выбранного layout из wiki/layouts/<slug>.md.
 *
 * Подход: layout-доки описывают ordered section table. Мы парсим из markdown
 * последовательность обязательных секций (рассматривая только колонку Component)
 * и проверяем, что spec.sections содержит каждую из них в правильном порядке.
 * Допускаются дополнительные секции между ними (опциональные слоты).
 *
 * Если layout не указан в spec.meta.layout — валидатор пропускается (warning).
 */

export interface LandingLayoutConformanceError {
  rule:
    | 'layout-not-found'
    | 'missing-required-section'
    | 'out-of-order-section'
    | 'layout-parse-failed';
  message: string;
  where?: string;
}

export interface LandingLayoutConformanceResult {
  ok: boolean;
  errors: LandingLayoutConformanceError[];
  warnings: LandingLayoutConformanceError[];
  layout?: string;
  required?: string[];
}

interface RequiredSection {
  rowIndex: number;
  componentName: string;
  optional: boolean;
}

/**
 * Парсит из markdown layout-документа последовательность секций.
 * Распознаёт markdown-таблицу с колонками "# | Section | Component | ... | Опционально".
 */
function parseLayoutRequiredSections(md: string): RequiredSection[] {
  const lines = md.split('\n');
  let inTable = false;
  let columnMap: { component: number; optional: number } | null = null;
  const rows: RequiredSection[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    // Header row of section sequence table.
    if (!inTable && /^\|\s*#\s*\|\s*Section\s*\|\s*Component\s*\|/i.test(line)) {
      const headers = line.split('|').map((h) => h.trim().toLowerCase());
      const compIdx = headers.findIndex((h) => h === 'component');
      const optIdx = headers.findIndex((h) => h.startsWith('опциональ'));
      if (compIdx === -1 || optIdx === -1) continue;
      columnMap = { component: compIdx, optional: optIdx };
      inTable = true;
      // Skip alignment row.
      i++;
      continue;
    }

    if (inTable) {
      if (!line.trim().startsWith('|')) {
        inTable = false;
        columnMap = null;
        continue;
      }
      const cells = line.split('|').map((c) => c.trim());
      const rowIdxCell = cells[1] ?? '';
      const rowIdx = Number.parseInt(rowIdxCell, 10);
      if (!Number.isFinite(rowIdx)) continue;
      const componentCell = cells[columnMap!.component] ?? '';
      const optionalCell = cells[columnMap!.optional] ?? '';
      const compMatch = componentCell.match(/`([A-Z][A-Za-z]+)`/);
      if (!compMatch) continue;
      const optionalLower = optionalCell.toLowerCase();
      const isOptional =
        optionalLower.includes('опциональ') &&
        !optionalLower.includes('обязател');
      rows.push({
        rowIndex: rowIdx,
        componentName: compMatch[1]!,
        optional: isOptional,
      });
    }
  }

  return rows;
}

export interface LandingLayoutConformanceOptions {
  /** Корень репозитория для поиска wiki/layouts/<slug>.md. */
  root: string;
  /** Slug layout'а — обычно spec.meta.layout. */
  layout?: string;
}

export async function validateLandingLayoutConformance(
  spec: LandingSpec,
  options: LandingLayoutConformanceOptions,
): Promise<LandingLayoutConformanceResult> {
  const errors: LandingLayoutConformanceError[] = [];
  const warnings: LandingLayoutConformanceError[] = [];

  if (!options.layout) {
    warnings.push({
      rule: 'layout-not-found',
      message:
        'В spec.meta.layout не указан layout — пропускаем layout-conformance. ' +
        'Выбери layout явно из wiki/layouts/ и пропиши в brief.pageLayout.',
    });
    return { ok: true, errors, warnings };
  }

  const layoutPath = resolve(options.root, 'wiki', 'layouts', `${options.layout}.md`);
  let md: string;
  try {
    md = await readFile(layoutPath, 'utf-8');
  } catch {
    errors.push({
      rule: 'layout-not-found',
      message: `Layout '${options.layout}' не найден в wiki/layouts/. Доступные см. в wiki/layouts/index.md.`,
    });
    return { ok: false, errors, warnings, layout: options.layout };
  }

  let required: RequiredSection[];
  try {
    required = parseLayoutRequiredSections(md);
  } catch (err) {
    errors.push({
      rule: 'layout-parse-failed',
      message: `Не удалось распарсить таблицу секций в ${layoutPath}: ${(err as Error).message}`,
    });
    return { ok: false, errors, warnings, layout: options.layout };
  }

  const requiredOnly = required.filter((r) => !r.optional);
  const requiredNames = requiredOnly.map((r) => r.componentName);

  // Проверяем, что все required секции присутствуют в нужном порядке (с допуском
  // на лишние между ними).
  // Эквивалентность компонентов:
  // - официальный подвал LandingFooterMock удовлетворяет требование LandingFooter;
  // - интерактивные фиче-секции (TabbedFeatureSection / AccordionFeatureSection)
  //   удовлетворяют требование MediaCopy — это их прямое назначение: свернуть
  //   простынь из 3-5 MediaCopy в одну секцию.
  const INTERACTIVE_MEDIA = new Set(['TabbedFeatureSection', 'AccordionFeatureSection']);
  // Блоки отзывов/доверия взаимозаменяемы в слоте SocialProof. Дефолт — ReviewSlider.
  const TRUST_COMPONENTS = new Set(['SocialProof', 'ReviewSlider', 'TestimonialQuote', 'LogoCloud']);
  const componentMatches = (actual: string, required: string) =>
    actual === required ||
    (required === 'LandingFooter' && actual === 'LandingFooterMock') ||
    (required === 'MediaCopy' && INTERACTIVE_MEDIA.has(actual)) ||
    (required === 'SocialProof' && TRUST_COMPONENTS.has(actual));

  let cursor = 0;
  for (const req of requiredOnly) {
    const found = spec.sections.findIndex(
      (s, i) => i >= cursor && componentMatches(s.component, req.componentName),
    );
    if (found === -1) {
      errors.push({
        rule: 'missing-required-section',
        message:
          `Layout '${options.layout}' (строка ${req.rowIndex}) требует ${req.componentName}, ` +
          `но в spec такой секции нет (или она раньше cursor=${cursor}). ` +
          'Добавь секцию или поставь точнее в порядке.',
        where: `sections after ${cursor}`,
      });
      // Cursor не двигаем — следующие required будут искаться с того же места.
      continue;
    }
    // Одна интерактивная фиче-секция закрывает несколько подряд идущих требований
    // MediaCopy — не двигаем cursor за неё, чтобы следующий MediaCopy-req тоже сматчился.
    const matched = spec.sections[found]!;
    const coversMultiple = req.componentName === 'MediaCopy' && INTERACTIVE_MEDIA.has(matched.component);
    cursor = coversMultiple ? found : found + 1;
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    layout: options.layout,
    required: requiredNames,
  };
}

export function formatLandingLayoutConformanceErrors(
  result: LandingLayoutConformanceResult,
): string {
  if (result.ok && result.warnings.length === 0) return 'OK';
  const lines: string[] = [];
  for (const e of result.errors) {
    lines.push(`  [layout:${e.rule}] ${e.where ?? '*'} — ${e.message}`);
  }
  for (const w of result.warnings) {
    lines.push(`  [layout:warn:${w.rule}] ${w.where ?? '*'} — ${w.message}`);
  }
  return lines.join('\n');
}
