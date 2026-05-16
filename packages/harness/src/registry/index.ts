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
  category: 'hero' | 'features' | 'pricing' | 'faq' | 'cta' | 'footer';
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
      'Главный hero-блок: eyebrow (опц.), заголовок, подзаголовок, primary CTA + опционально outline secondary CTA, и визуал справа (xl+). Визуал — либо `visual` (статичная картинка), либо `mockUi` (HTML/Tailwind UI-мок: board / chat / kpi / article / checklist / console). Если задан mockUi — он приоритетен над visual.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..80)',
      subtitle: 'string (10..200)',
      primaryCta: '{ label: string<=40; href: string }',
      secondaryCta: '{ label; href } | null | undefined',
      visual:
        "{ type: 'product_screenshot'|'illustration'|'logo_cloud'|'photo'; assetId: string } | null | undefined",
      mockUi:
        "MockUi | null | undefined — discriminated union по template: 'board'|'chat'|'checklist'|'article'|'kpi'|'console'. Правила контента — см. section-mock-skill.md.",
    },
    constraints: [
      'title <= 80',
      'subtitle 10..200',
      'must_have_primary_cta',
      'one_hero_per_landing',
      'mockUi_or_visual_not_both_required',
    ],
  },
  {
    name: 'FeatureGrid',
    specComponent: 'FeatureGrid',
    sectionId: 'features',
    category: 'features',
    description:
      'Grid карточек "иконка + заголовок + описание". 2-8 items, 2/3/4 колонки. Опционально перед грид-карточек можно показать UI-мок (mockUi: board / chat / kpi / article / checklist / console) — например, доска заявок для секции про поток обращений.',
    props: {
      eyebrow: 'string (<=80) | undefined',
      title: 'string (4..80)',
      description: 'string (<=200) | undefined',
      items: 'Array<{ icon: string; title: 2..60; description: 10..200 }> (2..8)',
      columns: '2 | 3 | 4 (default 3)',
      mockUi:
        "MockUi | null | undefined — опциональный UI-мок над гридом. Правила контента — см. section-mock-skill.md.",
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
    description:
      'Финальный CTA-блок: заголовок + описание + primary CTA + опционально secondary. Опционально снизу можно показать дополнительный UI-мок (mockUi) — например, kpi-плитки с социальным доказательством.',
    props: {
      title: 'string (4..80)',
      description: 'string (<=200) | undefined',
      primaryCta: '{ label; href }',
      secondaryCta: '{ label; href } | null | undefined',
      mockUi:
        "MockUi | null | undefined — опциональный UI-мок под кнопками. Правила — см. section-mock-skill.md.",
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
