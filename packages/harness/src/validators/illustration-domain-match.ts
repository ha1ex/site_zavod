import type { Brief } from '../schemas/brief';
import type { LandingSpec, Section } from '../schemas/landing-spec';
import {
  type Domain,
  type MissingMockHint,
  getAllowedVariants,
  getDomainEntry,
  getDomainOfVariant,
  getMissingMocksForDomain,
  resolveDomainFromBrief,
} from '../registry/domain-visual';

/**
 * illustration-domain-match — валидатор «домен mock'а = домен продукта».
 *
 * Проблема, которую он закрывает: ассистент мог выбрать pm-board для CRM-лендинга
 * под предлогом «канбан-доска — это универсально». Это самая частая и грубая
 * ошибка визуального качества. Документационный слой (wiki/references/domain-mock-matrix.md,
 * §0 Domain fit в section-mock-skill, шаг 0 Domain audit в buffalo-generate)
 * правило вводит, но эта проверка — страховка на уровне кода: если ассистент
 * проигнорирует skill, ingest откажется писать TSX.
 *
 * Hard errors:
 *   - domain-unresolved: brief не позволяет резолвить домен. Пользователь
 *     должен либо переписать brief.product/market/audience с конкретикой,
 *     либо вручную проставить домен через явный input. Это «вы не сказали
 *     что мы делаем» — продолжать опасно.
 *   - cross-domain-reuse: spec использует variant, принадлежащий чужому домену.
 *     Например, brief={CRM}, spec.hero.visual.variant='pm-board' (PM-домен).
 *     Suggestion перечисляет разрешённые variants для домена + ссылку на matrix.
 *   - domain-missing-mocks: brief в непокрытом домене (HR/Marketing/...),
 *     а spec пытается использовать существующие mock'и. Это значит, что
 *     ассистент не остановился на шаге 0 Domain audit и подобрал «похожие»
 *     из чужого домена. Список нужных к созданию mock'ов выдаётся в error.
 *
 * Соответствует требованиям wiki/references/domain-mock-matrix.md §«Жёсткие правила».
 */

export type IllustrationDomainMatchRule =
  | 'domain-unresolved'
  | 'cross-domain-reuse'
  | 'domain-missing-mocks';

export interface IllustrationDomainMatchError {
  rule: IllustrationDomainMatchRule;
  message: string;
  where?: string;
}

export interface IllustrationDomainMatchResult {
  ok: boolean;
  resolvedDomain: Domain;
  errors: IllustrationDomainMatchError[];
  warnings: IllustrationDomainMatchError[];
}

export interface IllustrationDomainMatchOptions {
  /**
   * Явное переопределение домена. Если задано — используется вместо
   * resolveDomainFromBrief. Полезно когда host-LLM явно классифицировал.
   */
  overrideDomain?: Domain;
}

interface SectionVariantUsage {
  index: number;
  component: Section['component'];
  variant: string;
  sectionSlot: 'hero' | 'media' | 'tab' | 'scenario';
  where: string;
}

/**
 * Извлечь все используемые variants из spec'а (с указанием секции и слота).
 * Покрывает все секции, которые умеют рендерить mock: HeroSection, MediaCopy,
 * TabbedFeatureSection (tabs[].mockVariant), ScenarioWalkthroughSection
 * (steps[].mockVariant).
 */
function collectUsedVariants(spec: LandingSpec): SectionVariantUsage[] {
  const usages: SectionVariantUsage[] = [];

  spec.sections.forEach((section, idx) => {
    if (section.component === 'HeroSection') {
      const v = section.props.visual?.variant;
      if (v && v !== 'generic') {
        usages.push({
          index: idx,
          component: section.component,
          variant: v,
          sectionSlot: 'hero',
          where: `sections[${idx}].props.visual.variant`,
        });
      }
      return;
    }
    if (section.component === 'MediaCopy') {
      const v = section.props.mediaVariant;
      if (v && v !== 'default') {
        usages.push({
          index: idx,
          component: section.component,
          variant: v,
          sectionSlot: 'media',
          where: `sections[${idx}].props.mediaVariant`,
        });
      }
      return;
    }
    if (section.component === 'TabbedFeatureSection') {
      section.props.tabs.forEach((tab, tabIdx) => {
        usages.push({
          index: idx,
          component: section.component,
          variant: tab.mockVariant,
          sectionSlot: 'tab',
          where: `sections[${idx}].props.tabs[${tabIdx}].mockVariant`,
        });
      });
      return;
    }
    if (section.component === 'ScenarioWalkthroughSection') {
      section.props.steps.forEach((step, stepIdx) => {
        usages.push({
          index: idx,
          component: section.component,
          variant: step.mockVariant,
          sectionSlot: 'scenario',
          where: `sections[${idx}].props.steps[${stepIdx}].mockVariant`,
        });
      });
      return;
    }
  });

  return usages;
}

function formatVariantList(variants: string[]): string {
  if (variants.length === 0) return '<пусто — нужно создать новые mock\'и>';
  return variants.map((v) => `'${v}'`).join(', ');
}

function formatMissingMockHints(hints: MissingMockHint[]): string {
  return hints.map((h) => `  - \`${h.variant}\` — ${h.description}`).join('\n');
}

export function validateIllustrationDomainMatch(
  spec: LandingSpec,
  brief: Brief,
  options: IllustrationDomainMatchOptions = {},
): IllustrationDomainMatchResult {
  const errors: IllustrationDomainMatchError[] = [];
  const warnings: IllustrationDomainMatchError[] = [];

  const resolvedDomain = options.overrideDomain ?? resolveDomainFromBrief(brief);

  if (resolvedDomain === 'unknown') {
    errors.push({
      rule: 'domain-unresolved',
      message:
        'Домен продукта не резолвится из brief (product / market / audience / mainPain / mainPromise). ' +
        'Это означает, что мы не понимаем, для какого домена собираем лендинг — продолжать опасно ' +
        '(может получиться выбор mock\'ов из чужого домена). ' +
        'Уточни brief одним из способов: ' +
        '(1) добавь конкретику в product/market (например, "CRM для салонов красоты", не "B2B SaaS"); ' +
        '(2) добавь известные ключи в audience (например, ["отдел продаж", "сервисные менеджеры"]); ' +
        '(3) проставь overrideDomain явно при вызове validator\'а. ' +
        'Доступные домены: pm, support, crm, hr, marketing, bpm, finance, ecommerce. ' +
        'См. wiki/references/domain-mock-matrix.md.',
      where: 'brief',
    });
    // Если домен не резолвлен, остальные проверки невозможны — возвращаем сразу.
    return { ok: false, resolvedDomain, errors, warnings };
  }

  const domainEntry = getDomainEntry(resolvedDomain);
  const allowedVariants = getAllowedVariants(resolvedDomain);
  const isDomainCovered = (domainEntry?.mocks.length ?? 0) > 0;
  const usages = collectUsedVariants(spec);

  // domain-missing-mocks: brief в непокрытом домене, а spec использует ЛЮБЫЕ mock'и.
  // Эти mock'и неизбежно из чужого домена (PM/Support/CRM), потому что для
  // (hr/marketing/bpm/finance/ecommerce) ещё нет своих.
  if (!isDomainCovered && usages.length > 0) {
    const missing = getMissingMocksForDomain(resolvedDomain);
    errors.push({
      rule: 'domain-missing-mocks',
      message:
        `Brief относится к домену '${resolvedDomain}' (${domainEntry?.displayName ?? resolvedDomain}), ` +
        `но для этого домена ещё не созданы свои mock\'и. ` +
        `Spec использует ${usages.length} mock-вариантов — все они из чужих доменов ` +
        `(${[...new Set(usages.map((u) => u.variant))].join(', ')}), что нарушает domain-fit. ` +
        `\n\nЧто делать: останови генерацию лендинга и создай нужные mock'и:\n` +
        `${formatMissingMockHints(missing)}\n\n` +
        `Алгоритм создания — packages/harness/src/prompts/section-mock-skill.md. ` +
        `Образец готового набора по другому домену — wiki/landings/crm-reference.md. ` +
        `После создания обнови wiki/references/domain-mock-matrix.md и DOMAIN_REGISTRY ` +
        `в packages/harness/src/registry/domain-visual.ts.`,
      where: 'spec.sections.*',
    });
  }

  // cross-domain-reuse: каждый использованный variant должен принадлежать
  // резолвленному домену. Применяется только для покрытых доменов
  // (для непокрытых уже отработал domain-missing-mocks).
  if (isDomainCovered) {
    for (const usage of usages) {
      if (allowedVariants.includes(usage.variant as (typeof allowedVariants)[number])) {
        continue;
      }
      const wrongDomain = getDomainOfVariant(usage.variant);
      const wrongDomainEntry = wrongDomain ? getDomainEntry(wrongDomain) : undefined;
      errors.push({
        rule: 'cross-domain-reuse',
        message:
          `Variant '${usage.variant}' выбран в ${usage.where}, ` +
          `но он принадлежит домену '${wrongDomain ?? 'unknown'}' ` +
          `${wrongDomainEntry ? `(${wrongDomainEntry.displayName})` : ''}, ` +
          `а brief — про '${resolvedDomain}' (${domainEntry?.displayName ?? resolvedDomain}). ` +
          `\nЭто cross-domain reuse — самая частая ошибка визуального качества. ` +
          `Реальный сценарий лендинга и визуал не совпадают, лендинг получится ` +
          `неубедительным. ` +
          `\n\nЧто делать: замени на один из разрешённых для домена '${resolvedDomain}': ` +
          `${formatVariantList(allowedVariants)}. ` +
          `Если ни один из них не подходит по смыслу — создай новый mock в домене '${resolvedDomain}' ` +
          `по packages/harness/src/prompts/section-mock-skill.md, добавь его в ` +
          `MockVariantSchema + DOMAIN_REGISTRY + wiki/references/domain-mock-matrix.md.`,
        where: usage.where,
      });
    }
  }

  return {
    ok: errors.length === 0,
    resolvedDomain,
    errors,
    warnings,
  };
}

export function formatIllustrationDomainMatchErrors(
  result: IllustrationDomainMatchResult,
): string {
  if (result.ok && result.warnings.length === 0) return 'OK';
  const lines: string[] = [];
  lines.push(`  [domain] resolvedDomain=${result.resolvedDomain}`);
  for (const e of result.errors) {
    lines.push(`  [domain:${e.rule}] ${e.where ?? '*'} — ${e.message}`);
  }
  for (const w of result.warnings) {
    lines.push(`  [domain:warn:${w.rule}] ${w.where ?? '*'} — ${w.message}`);
  }
  return lines.join('\n');
}
