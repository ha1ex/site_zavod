/**
 * Component registry — статический каталог разрешённых компонентов.
 * На этапе 1 — ручной список из @buffalo/ui. На этапе 4 расширим
 * автогенерацией из Storybook stories через react-docgen-typescript.
 *
 * LLM получает эту структуру как часть system prompt — чтобы выбирать
 * только существующие компоненты с валидными props.
 */

export interface ComponentEntry {
  name: string;
  category:
    | 'hero'
    | 'features'
    | 'pricing'
    | 'faq'
    | 'cta'
    | 'footer'
    | 'social_proof'
    | 'process'
    | 'banner'
    | 'media_copy'
    | 'stats'
    | 'promo'
    | 'tabbed_feature'
    | 'scenario_walkthrough'
    | 'industry_picker';
  description: string;
  props: Record<string, string>;
  constraints: string[];
  specComponent: string;
  /** Какой `id` использовать в spec.sections[].id (literal в schema). */
  sectionId: string;
}

export const REGISTRY: ComponentEntry[] = [
  {
    name: 'HeroSection',
    specComponent: 'HeroSection',
    sectionId: 'hero',
    category: 'hero',
    description:
      'Главный hero-блок: eyebrow (опц.), заголовок (с опц. accentWord-pill), подзаголовок, primary CTA + опционально outline secondary CTA, и визуал. Визуал задаётся через `visual.variant` — выбери из реестра mock-компонентов под смысл лендинга. ОБЯЗАТЕЛЬНО осознанный выбор: `generic` РАЗРЕШЁН ТОЛЬКО когда ни один из реальных mock\'ов смыслово не подходит. Доступные варианты: `support-board` — канбан службы поддержки; `pm-board` — канбан PM-команды с эпиками, story points и спринтами; `analytics-kpi` — дашборд руководителя с 2×2 KPI и загрузкой команд; `integrations-console` — лента событий из 1С/AmoCRM/Telegram/GitLab; `modules-matrix` — bento-grid модулей платформы. Новые специализированные mock-компоненты создаются в `packages/ui/src/landing/mocks/` по правилам `packages/harness/src/prompts/section-mock-skill.md` — после создания добавь новое значение в enum `visual.variant`.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..120)',
      accentWord: 'string (<=40) | undefined — кусок title в фиолетовой pill',
      subtitle: 'string (10..280)',
      primaryCta: '{ label: string<=40; href: string }',
      secondaryCta: '{ label; href } | null | undefined',
      visual:
        "{ type: 'product_screenshot'|'illustration'|'logo_cloud'|'photo'; assetId: string; src?: string; alt?: string; variant: 'support-board'|'pm-board'|'analytics-kpi'|'integrations-console'|'modules-matrix'|'generic' } | null | undefined",
      visualPosition: "'side' (default) | 'below' — раскладка mock'а относительно текста",
    },
    constraints: ['title <= 120', 'subtitle 10..280', 'must_have_primary_cta', 'one_hero_per_landing'],
  },
  {
    name: 'FeatureGrid',
    specComponent: 'FeatureGrid',
    sectionId: 'features',
    category: 'features',
    description: 'Grid карточек "иконка + заголовок + описание". 2-8 items, 2/3/4 колонки.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..80)',
      description: 'string (<=200) | undefined',
      items: 'Array<{ icon: string; title: 2..60; description: 10..200 }> (2..8)',
      columns: '2 | 3 | 4 (default 3)',
    },
    constraints: ['min_2_items', 'max_8_items', 'titles_unique_per_section'],
  },
  {
    name: 'PricingPlans',
    specComponent: 'PricingPlans',
    sectionId: 'pricing',
    category: 'pricing',
    description: '2-4 тарифа с фичами и CTA. Один план можно отметить highlighted=true.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..80)',
      description: 'string (<=200) | undefined',
      plans:
        'Array<{ name: 2..40; price: 1..20; pricePeriod?: string<=20; description?: string<=120; features: 1..10 strings; cta: {label,href}; highlighted?: boolean }> (2..4)',
    },
    constraints: ['min_2_plans', 'max_4_plans', 'at_most_one_highlighted', 'each_plan_has_cta'],
  },
  {
    name: 'FAQAccordion',
    specComponent: 'FAQAccordion',
    sectionId: 'faq',
    category: 'faq',
    description: 'Accordion FAQ. 2-12 пар "вопрос/ответ".',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..80)',
      description: 'string (<=200) | undefined',
      items: 'Array<{ question: 4..140; answer: 10..600 }> (2..12)',
    },
    constraints: ['min_2_items', 'questions_unique'],
  },
  {
    name: 'FinalCta',
    specComponent: 'FinalCta',
    sectionId: 'final_cta',
    category: 'cta',
    description: 'Финальный CTA-блок: заголовок + описание + primary CTA + опционально secondary.',
    props: {
      title: 'string (4..80)',
      description: 'string (<=200) | undefined',
      primaryCta: '{ label; href }',
      secondaryCta: '{ label; href } | null | undefined',
    },
    constraints: ['must_have_primary_cta', 'final_cta_matches_page_goal'],
  },
  {
    name: 'LandingFooter',
    specComponent: 'LandingFooter',
    sectionId: 'footer',
    category: 'footer',
    description: 'Подвал лендинга: бренд + tagline + 1-5 колонок ссылок + copyright.',
    props: {
      brandName: 'string (1..60)',
      brandTagline: 'string (<=200) | undefined',
      columns: 'Array<{ title: 2..40; links: Array<{label,href}> (1..8) }> (1..5)',
      copyright: 'string (<=200) | undefined',
    },
    constraints: ['always_last_section'],
  },
  {
    name: 'SocialProof',
    specComponent: 'SocialProof',
    sectionId: 'social_proof',
    category: 'social_proof',
    description:
      'Карточки клиентских кейсов: 2-6 карточек с brand-инициалом, цитатой и опц. metric/href на полный кейс.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..80) | undefined',
      description: 'string (<=200) | undefined',
      cases:
        'Array<{ brand: 1..60; brandInitial?: <=4; quote: 10..400; metric?: <=120; href? }> (2..6)',
    },
    constraints: ['min_2_cases', 'max_6_cases'],
  },
  {
    name: 'ProcessSteps',
    specComponent: 'ProcessSteps',
    sectionId: 'process',
    category: 'process',
    description:
      'Шаги процесса с большими цифрами: 2-6 пронумерованных карточек с lucide-иконкой, заголовком и описанием.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..80)',
      description: 'string (<=200) | undefined',
      steps:
        'Array<{ icon?: lucide-name; title: 2..80; description: 10..280 }> (2..6)',
    },
    constraints: ['min_2_steps', 'max_6_steps'],
  },
  {
    name: 'CtaBanner',
    specComponent: 'CtaBanner',
    sectionId: 'cta_banner',
    category: 'banner',
    description:
      'Inline CTA-баннер между секциями: заголовок, опц. описание, primary + опц. secondary CTA. Фиолетовый фон.',
    props: {
      title: 'string (4..120)',
      description: 'string (<=280) | undefined',
      primaryCta: '{ label; href }',
      secondaryCta: '{ label; href } | null | undefined',
    },
    constraints: ['must_have_primary_cta'],
  },
  {
    name: 'MediaCopy',
    specComponent: 'MediaCopy',
    sectionId: 'media_copy',
    category: 'media_copy',
    description:
      'Флагманский Kaiten-блок: текст с чек-листом по одну сторону и большой mock продуктового UI по другую. Используется 3-5 раз на странице с alternating mediaPosition. ОБЯЗАТЕЛЬНО для каждой MediaCopy явно указать mediaVariant под смысл секции — НЕЛЬЗЯ оставлять `default` ради лени: это generic-placeholder, который выглядит одинаково везде и нарушает уникальность лендинга. Если ни один существующий variant не подходит — создай новый mock-компонент по правилам section-mock-skill.md.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..120)',
      description: 'string (<=400) | undefined',
      checklist: 'Array<{ icon?: lucide-name; text: 2..180 }> (<=8) | undefined',
      mediaPosition: '"left" | "right" (default "right") — alternating обязательно при 2+ MediaCopy подряд',
      mediaPlaceholder: 'string (label inside window-chrome, виден только при mediaVariant=default)',
      mediaVariant:
        '"support-board" (канбан поддержки) | "request-card" (карточка заявки с чатом) | "kb-public" (статья КБ для клиентов) | "kb-internal" (внутренний регламент) | "pm-board" (канбан PM-команды) | "analytics-kpi" (дашборд KPI) | "integrations-console" (лента интеграций) | "modules-matrix" (модули платформы) | "default" (generic — ТОЛЬКО когда оправдано)',
      primaryCta: '{ label; href } | undefined',
      secondaryCta: '{ label; href } | null | undefined',
    },
    constraints: [
      'alternate_media_position_when_repeated',
      'media_variant_must_be_explicit_unless_no_fit',
      'default_variant_max_1_per_landing',
    ],
  },
  {
    name: 'StatStrip',
    specComponent: 'StatStrip',
    sectionId: 'stats',
    category: 'stats',
    description:
      'Горизонтальная полоса 2-5 цифровых фактов (например: 235+ обращений, 500 сотрудников, 30 минут запуск). Используется как social-proof выше fold или итоги секции.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..120) | undefined',
      description: 'string (<=300) | undefined',
      stats:
        'Array<{ value: 1..20; label: 2..80; description?: <=160 }> (2..5)',
    },
    constraints: ['min_2_stats', 'max_5_stats'],
  },
  {
    name: 'TabbedFeatureSection',
    specComponent: 'TabbedFeatureSection',
    sectionId: 'tabbed_feature',
    category: 'tabbed_feature',
    description:
      'Секция с горизонтальными табами по сегментам (например: Продажи / Сервис / Маркетинг или роли менеджер / руководитель / маркетолог). Под выбранным табом — пара mock + текст с чек-листом и опц. CTA. Заменяет вертикальный простыни из 3-5 MediaCopy одной интерактивной секцией. Каждый таб обязан указывать mockVariant из общего реестра mock\'ов.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..120)',
      description: 'string (<=280) | undefined',
      tabs:
        'Array<{ id: 1..40; label: 2..40; icon?: lucide-name; eyebrow?: <=80; title: 4..120; description?: <=400; checklist?: Array<{icon?, text: 2..180}> (<=6); primaryCta?: {label,href}; mockVariant: MockVariant }> (2..5)',
    },
    constraints: ['min_2_tabs', 'max_5_tabs', 'each_tab_has_unique_mockvariant_preferred'],
  },
  {
    name: 'ScenarioWalkthroughSection',
    specComponent: 'ScenarioWalkthroughSection',
    sectionId: 'scenario_walkthrough',
    category: 'scenario_walkthrough',
    description:
      'Нарративная секция «День из жизни» (например, «День менеджера продаж»). Вертикальный таймлайн из 3-6 шагов с alternating layout (mock слева, текст справа — и наоборот). У каждого шага: время суток, заголовок действия, описание, и mock интерфейса в этот момент. Дает живое представление о продукте без сухого MediaCopy×N.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..120)',
      description: 'string (<=400) | undefined',
      protagonist: 'string (<=80) | undefined — кто герой сценария (роль)',
      steps:
        'Array<{ time: 1..40; title: 4..120; description: 10..400; icon?: lucide-name; mockVariant: MockVariant }> (3..6)',
    },
    constraints: ['min_3_steps', 'max_6_steps', 'steps_in_chronological_order'],
  },
  {
    name: 'IndustryPickerSection',
    specComponent: 'IndustryPickerSection',
    sectionId: 'industry_picker',
    category: 'industry_picker',
    description:
      'Интерактивный picker отраслей: слева список отраслей с иконкой и кратким описанием, справа раскрывается сценарий выбранной отрасли с ключевыми функциями и опц. метрикой. Заменяет вторую FeatureGrid когда «карточки индустрий» выглядят как монотонная сетка из 12 одинаковых блоков. Дает реальный отраслевой сценарий вместо однострочников.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..120)',
      description: 'string (<=280) | undefined',
      industries:
        'Array<{ id: 1..40; icon: lucide-name; name: 2..60; summary: 4..160; scenario: 10..400; keyFeatures: Array<{icon?, text: 2..120}> (2..6); metric?: {value: 1..20, label: 2..60} }> (3..8)',
    },
    constraints: ['min_3_industries', 'max_8_industries', 'each_industry_has_unique_id'],
  },
  {
    name: 'PromoBanner',
    specComponent: 'PromoBanner',
    sectionId: 'promo_banner',
    category: 'promo',
    description:
      'Большая полноширинная акцентная секция (фиолетовый или мягкий фон) с центрированным заголовком и CTA. Заменяет CtaBanner когда нужен сильный визуальный акцент.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..140)',
      description: 'string (<=300) | undefined',
      primaryCta: '{ label; href }',
      secondaryCta: '{ label; href } | null | undefined',
      tone: '"violet" | "soft" (default "violet")',
    },
    constraints: ['must_have_primary_cta'],
  },
];

export function getComponent(specComponent: string): ComponentEntry | undefined {
  return REGISTRY.find((c) => c.specComponent === specComponent);
}

export function describeRegistry(): string {
  return JSON.stringify(
    REGISTRY.map((c) => ({
      component: c.specComponent,
      sectionId: c.sectionId,
      category: c.category,
      description: c.description,
      props: c.props,
      constraints: c.constraints,
    })),
    null,
    2,
  );
}

export {
  DOMAIN_REGISTRY,
  getAllowedVariants,
  getCoveredDomains,
  getDomainEntry,
  getDomainOfVariant,
  getMissingMocksForDomain,
  getUncoveredDomains,
  isVariantValidForDomain,
  resolveDomainFromBrief,
} from './domain-visual';
export type { Domain, DomainEntry, DomainMockEntry, MissingMockHint } from './domain-visual';

export {
  UsageEntrySchema,
  UsageRegistrySchema,
  clearLandingUsage,
  countMockUsesGlobal,
  fingerprintLandingSemantics,
  fingerprintLandingStructure,
  listLandingSlugs,
  listUsagesForLanding,
  loadUsageRegistry,
  recordMockUse,
  saveUsageRegistry,
  structureDistance,
} from './global-illustration-usage';
export type { UsageEntry, UsageRegistry } from './global-illustration-usage';
