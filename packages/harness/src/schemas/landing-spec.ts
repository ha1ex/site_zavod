import { z } from 'zod';

/**
 * LandingSpec — строгий output контракт LLM-генерации.
 *
 * Sections — discriminated union по полю `component`. Каждый компонент имеет
 * жёсткие props через zod, чтобы validator ловил расхождения и repair-loop мог
 * исправлять только проблемные секции.
 */

export const CtaSchema = z.object({
  label: z.string().min(1).max(40),
  href: z.string().min(1),
});
export type Cta = z.infer<typeof CtaSchema>;

export const AssetRefSchema = z.object({
  type: z.enum(['product_screenshot', 'illustration', 'logo_cloud', 'photo']),
  assetId: z.string(),
});
export type AssetRef = z.infer<typeof AssetRefSchema>;

/* ─── MockUiSpec ──────────────────────────────────────────────────── */
/**
 * MockUiSpec — HTML/Tailwind UI-мок, который рендерится внутри секции
 * (рядом с текстом или вместо `visual`). 7 шаблонов выведены из эталонного
 * лендинга `wiki/landings/kaiten-techsupport-reference.md`. Правила —
 * `packages/harness/src/prompts/section-mock-skill.md` (загружается в
 * системный промпт LLM-генератора). Все content-строки — domain-specific
 * (имена клиентов, темы обращений, реальные KPI), Lorem запрещён.
 *
 * Backwards-compatible: `mockUi` на секциях опционален; компоненты, которые
 * его не поддерживают, игнорируют prop без ошибки.
 */

const MockAccentTone = z.enum(['primary', 'green', 'orange', 'red', 'blue']);
const MockBadgeTone = z.enum(['red', 'amber', 'emerald', 'neutral', 'blue']);

const BoardMockSchema = z.object({
  template: z.literal('board'),
  content: z.object({
    tabs: z.array(z.string().min(1).max(40)).min(2).max(6),
    activeTab: z.string().min(1).max(40).optional(),
    columns: z
      .array(
        z.object({
          title: z.string().min(1).max(40),
          count: z.number().int().nonnegative().optional(),
          cards: z
            .array(
              z.object({
                title: z.string().min(2).max(80),
                meta: z.string().max(80).optional(),
                accent: MockAccentTone,
                badges: z
                  .array(
                    z.object({
                      label: z.string().min(1).max(20),
                      tone: MockBadgeTone,
                    }),
                  )
                  .max(3)
                  .optional(),
                active: z.boolean().optional(),
                dim: z.boolean().optional(),
              }),
            )
            .min(1)
            .max(4),
        }),
      )
      .min(3)
      .max(5),
    activeEmoji: z.enum(['☝️', '✋']).nullable().optional(),
  }),
});

const ChatMockSchema = z.object({
  template: z.literal('chat'),
  content: z.object({
    ticketId: z.string().min(1).max(20),
    ticketTitle: z.string().min(2).max(80),
    ticketSubtitle: z.string().max(120).optional(),
    messages: z
      .array(
        z.object({
          role: z.enum(['in', 'out']),
          author: z.string().max(40).optional(),
          text: z.string().min(2).max(300),
        }),
      )
      .min(2)
      .max(4),
    checklist: z
      .array(z.object({ label: z.string().min(2).max(80), done: z.boolean() }))
      .min(2)
      .max(5)
      .optional(),
  }),
});

const ChecklistMockSchema = z.object({
  template: z.literal('checklist'),
  content: z.object({
    title: z.string().max(80).optional(),
    items: z
      .array(z.object({ label: z.string().min(2).max(120), done: z.boolean() }))
      .min(3)
      .max(6),
  }),
});

const ArticleMockSchema = z.object({
  template: z.literal('article'),
  content: z.object({
    sidebarItems: z
      .array(z.object({ label: z.string().min(2).max(40), active: z.boolean() }))
      .min(3)
      .max(7),
    emoji: z.enum(['📌', '🧑‍💻', '📋', '📒', '🔒']).nullable().optional(),
    badge: z.object({
      label: z.string().min(1).max(30),
      tone: z.enum(['violet', 'blue', 'emerald', 'amber']),
    }),
    title: z.string().min(2).max(80),
    subtitle: z.string().max(120).optional(),
    bodyBars: z.union([z.literal(3), z.literal(4)]).default(3),
  }),
});

const KpiMockSchema = z.object({
  template: z.literal('kpi'),
  content: z.object({
    tiles: z
      .array(
        z.object({
          value: z.string().min(1).max(12),
          trend: z
            .object({
              direction: z.enum(['up', 'down']),
              tone: z.enum(['positive', 'negative']),
            })
            .optional(),
          label: z.string().min(2).max(60),
        }),
      )
      .min(3)
      .max(4),
  }),
});

const ConsoleMockSchema = z.object({
  template: z.literal('console'),
  content: z.object({
    title: z.string().max(60).optional(),
    lines: z
      .array(
        z.object({
          kind: z.enum(['comment', 'cmd', 'output', 'success', 'error']),
          text: z.string().min(1).max(200),
        }),
      )
      .min(4)
      .max(10),
  }),
});

export const MockUiSchema = z.discriminatedUnion('template', [
  BoardMockSchema,
  ChatMockSchema,
  ChecklistMockSchema,
  ArticleMockSchema,
  KpiMockSchema,
  ConsoleMockSchema,
]);
export type MockUi = z.infer<typeof MockUiSchema>;

/* ─── HeroSection ─────────────────────────────────────────────────── */
const HeroSectionSchema = z.object({
  id: z.literal('hero'),
  component: z.literal('HeroSection'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(80),
    subtitle: z.string().min(10).max(200),
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema.nullable().optional(),
    visual: AssetRefSchema.nullable().optional(),
    mockUi: MockUiSchema.nullable().optional(),
  }),
});

/* ─── FeatureGrid ─────────────────────────────────────────────────── */
const FeatureGridSchema = z.object({
  id: z.literal('features'),
  component: z.literal('FeatureGrid'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(80),
    description: z.string().max(200).optional(),
    items: z
      .array(
        z.object({
          icon: z.string().describe('lucide-icon name'),
          title: z.string().min(2).max(60),
          description: z.string().min(10).max(200),
        }),
      )
      .min(2)
      .max(8),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    mockUi: MockUiSchema.nullable().optional(),
  }),
});

/* ─── PricingPlans ────────────────────────────────────────────────── */
const PricingPlansSchema = z.object({
  id: z.literal('pricing'),
  component: z.literal('PricingPlans'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(80),
    description: z.string().max(200).optional(),
    plans: z
      .array(
        z.object({
          name: z.string().min(2).max(40),
          price: z.string().min(1).max(20),
          pricePeriod: z.string().max(20).optional(),
          description: z.string().max(120).optional(),
          features: z.array(z.string().min(2).max(100)).min(1).max(10),
          cta: CtaSchema,
          highlighted: z.boolean().default(false),
        }),
      )
      .min(2)
      .max(4),
  }),
});

/* ─── FAQAccordion ────────────────────────────────────────────────── */
const FAQAccordionSchema = z.object({
  id: z.literal('faq'),
  component: z.literal('FAQAccordion'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(80),
    description: z.string().max(200).optional(),
    items: z
      .array(
        z.object({
          question: z.string().min(4).max(140),
          answer: z.string().min(10).max(600),
        }),
      )
      .min(2)
      .max(12),
  }),
});

/* ─── FinalCta ────────────────────────────────────────────────────── */
const FinalCtaSchema = z.object({
  id: z.literal('final_cta'),
  component: z.literal('FinalCta'),
  props: z.object({
    title: z.string().min(4).max(80),
    description: z.string().max(200).optional(),
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema.nullable().optional(),
    mockUi: MockUiSchema.nullable().optional(),
  }),
});

/* ─── LandingFooter ───────────────────────────────────────────────── */
const LandingFooterSchema = z.object({
  id: z.literal('footer'),
  component: z.literal('LandingFooter'),
  props: z.object({
    brandName: z.string().min(1).max(60),
    brandTagline: z.string().max(200).optional(),
    columns: z
      .array(
        z.object({
          title: z.string().min(2).max(40),
          links: z
            .array(z.object({ label: z.string().min(1).max(40), href: z.string().min(1) }))
            .min(1)
            .max(8),
        }),
      )
      .min(1)
      .max(5),
    copyright: z.string().max(200).optional(),
  }),
});

/* ─── Section union ───────────────────────────────────────────────── */
export const SectionSchema = z.discriminatedUnion('component', [
  HeroSectionSchema,
  FeatureGridSchema,
  PricingPlansSchema,
  FAQAccordionSchema,
  FinalCtaSchema,
  LandingFooterSchema,
]);
export type Section = z.infer<typeof SectionSchema>;

/* ─── LandingSpec ─────────────────────────────────────────────────── */
export const LandingSpecMetaSchema = z
  .object({
    sources: z.array(z.string()).default([]),
    generatedAt: z.string().optional(),
    generator: z.string().optional(),
    archetype: z.string().optional(),
    tokenEstimate: z.number().optional(),
    promptVersion: z.string().optional(),
  })
  .optional();
export type LandingSpecMeta = z.infer<typeof LandingSpecMetaSchema>;

export const LandingSpecSchema = z.object({
  pageType: z.enum(['saas_landing', 'waitlist_landing', 'enterprise_landing']),
  goal: z.string(),
  sections: z.array(SectionSchema).min(1),
  seo: z.object({
    title: z.string().min(4).max(70),
    description: z.string().min(10).max(160),
  }),
  illustrationSpecs: z.array(z.string()).default([]).describe('ID связанных IllustrationSpec'),
  meta: LandingSpecMetaSchema,
});

export type LandingSpec = z.infer<typeof LandingSpecSchema>;
