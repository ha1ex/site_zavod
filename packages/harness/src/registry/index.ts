/**
 * Component registry — статический каталог разрешённых компонентов.
 * На этапе 1 — ручной список из @buffalo/ui. На этапе 2 расширим автогенерацией
 * из Storybook stories (через react-docgen-typescript).
 *
 * LLM получает эту структуру как часть context layer — чтобы выбирать только
 * существующие компоненты с валидными props.
 */

export interface ComponentEntry {
  /** Имя компонента, как он подключается в TSX. */
  name: string;
  /** Категория для группировки и promptов. */
  category: 'hero' | 'features' | 'pricing' | 'faq' | 'cta' | 'footer' | 'navbar';
  /** Кратко: что это, когда использовать. */
  description: string;
  /** Props в формате {name: tsType}. */
  props: Record<string, string>;
  /** Жёсткие ограничения (валидаторы будут проверять). */
  constraints: string[];
  /** Какой LandingSpec section.component указывает на этот компонент. */
  specComponent: string;
}

export const REGISTRY: ComponentEntry[] = [
  {
    name: 'HeroSection',
    specComponent: 'HeroSection',
    category: 'hero',
    description:
      'Главный hero-блок: eyebrow (опц.), заголовок, подзаголовок, primary CTA + опционально outline secondary CTA, и визуал справа (xl+) или снизу.',
    props: {
      eyebrow: 'string | undefined',
      title: 'string (4..80 chars)',
      subtitle: 'string (10..200 chars)',
      primaryCta: '{ label: string; href: string }',
      secondaryCta: '{ label: string; href: string } | null | undefined',
      visual:
        "{ type: 'product_screenshot' | 'illustration' | 'logo_cloud' | 'photo'; src?: string; alt?: string } | null | undefined",
    },
    constraints: [
      'title <= 80 chars',
      'subtitle 10..200 chars',
      'must_have_primary_cta',
      'one_hero_per_landing',
    ],
  },
];

export function getComponent(specComponent: string): ComponentEntry | undefined {
  return REGISTRY.find((c) => c.specComponent === specComponent);
}

export function describeRegistry(): string {
  /** Компактный JSON-вид для system prompt'а LLM. */
  return JSON.stringify(
    REGISTRY.map((c) => ({
      component: c.specComponent,
      category: c.category,
      props: c.props,
      constraints: c.constraints,
    })),
    null,
    2,
  );
}
