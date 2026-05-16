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
  src: z.string().optional(),
  alt: z.string().optional(),
  variant: z
    .enum([
      'support-board',
      'pm-board',
      'analytics-kpi',
      'integrations-console',
      'modules-matrix',
      'sales-funnel',
      'crm-client-card',
      'omnichannel-inbox',
      'call-overlay',
      'booking-calendar',
      'crm-analytics',
      'doc-template',
      'mobile-crm',
      'generic',
    ])
    .optional(),
});
export type AssetRef = z.infer<typeof AssetRefSchema>;

/* ─── HeroSection ─────────────────────────────────────────────────── */
const HeroSectionSchema = z.object({
  id: z.literal('hero'),
  component: z.literal('HeroSection'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    accentWord: z.string().max(40).optional(),
    subtitle: z.string().min(10).max(280),
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema.nullable().optional(),
    visual: AssetRefSchema.nullable().optional(),
    visualPosition: z.enum(['side', 'below']).optional(),
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
  }),
});

/* ─── SocialProof (cases) ─────────────────────────────────────────── */
const SocialProofSchema = z.object({
  id: z.literal('social_proof'),
  component: z.literal('SocialProof'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(80).optional(),
    description: z.string().max(200).optional(),
    cases: z
      .array(
        z.object({
          brand: z.string().min(1).max(60),
          brandInitial: z.string().max(4).optional(),
          quote: z.string().min(10).max(400),
          metric: z.string().max(120).optional(),
          href: z.string().optional(),
        }),
      )
      .min(2)
      .max(6),
  }),
});

/* ─── ProcessSteps ────────────────────────────────────────────────── */
const ProcessStepsSchema = z.object({
  id: z.literal('process'),
  component: z.literal('ProcessSteps'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(80),
    description: z.string().max(200).optional(),
    steps: z
      .array(
        z.object({
          icon: z.string().optional().describe('lucide-icon name'),
          title: z.string().min(2).max(80),
          description: z.string().min(10).max(280),
        }),
      )
      .min(2)
      .max(6),
  }),
});

/* ─── CtaBanner (inline) ──────────────────────────────────────────── */
const CtaBannerSchema = z.object({
  id: z.literal('cta_banner'),
  component: z.literal('CtaBanner'),
  props: z.object({
    title: z.string().min(4).max(120),
    description: z.string().max(280).optional(),
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema.nullable().optional(),
  }),
});

/* ─── MediaCopy (alternating text+screenshot) ─────────────────────── */
const MediaCopySchema = z.object({
  id: z.literal('media_copy'),
  component: z.literal('MediaCopy'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(400).optional(),
    checklist: z
      .array(
        z.object({
          icon: z.string().optional(),
          text: z.string().min(2).max(180),
        }),
      )
      .max(8)
      .optional(),
    mediaPosition: z.enum(['left', 'right']).optional(),
    mediaPlaceholder: z.string().max(80).optional(),
    mediaVariant: z
      .enum([
        'default',
        'support-board',
        'request-card',
        'kb-public',
        'kb-internal',
        'pm-board',
        'analytics-kpi',
        'integrations-console',
        'modules-matrix',
        'sales-funnel',
        'crm-client-card',
        'omnichannel-inbox',
        'call-overlay',
        'booking-calendar',
        'crm-analytics',
        'doc-template',
        'mobile-crm',
      ])
      .optional(),
    primaryCta: CtaSchema.optional(),
    secondaryCta: CtaSchema.nullable().optional(),
  }),
});

/* ─── BenefitsStrip (thin marketing strip under hero) ─────────────── */
const BenefitsStripSchema = z.object({
  id: z.literal('benefits_strip'),
  component: z.literal('BenefitsStrip'),
  props: z.object({
    items: z.array(z.string().min(2).max(60)).min(2).max(6),
  }),
});

/* ─── MetricsSplit (text + 2x2 metrics + optional bullets) ────────── */
const MetricsSplitSchema = z.object({
  id: z.literal('metrics_split'),
  component: z.literal('MetricsSplit'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(300).optional(),
    metrics: z
      .array(
        z.object({
          value: z.string().min(1).max(20),
          label: z.string().min(2).max(80),
          trend: z.enum(['up', 'down', 'flat']).optional(),
        }),
      )
      .min(2)
      .max(6),
    bullets: z
      .array(
        z.object({
          title: z.string().min(2).max(80),
          description: z.string().min(10).max(200),
        }),
      )
      .max(6)
      .optional(),
  }),
});

/* ─── StatStrip ───────────────────────────────────────────────────── */
const StatStripSchema = z.object({
  id: z.literal('stats'),
  component: z.literal('StatStrip'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120).optional(),
    description: z.string().max(300).optional(),
    stats: z
      .array(
        z.object({
          value: z.string().min(1).max(20),
          label: z.string().min(2).max(80),
          description: z.string().max(160).optional(),
        }),
      )
      .min(2)
      .max(5),
  }),
});

/* ─── PromoBanner (full-bleed accent CTA) ─────────────────────────── */
const PromoBannerSchema = z.object({
  id: z.literal('promo_banner'),
  component: z.literal('PromoBanner'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(140),
    description: z.string().max(300).optional(),
    primaryCta: CtaSchema,
    secondaryCta: CtaSchema.nullable().optional(),
    tone: z.enum(['violet', 'soft']).optional(),
  }),
});

/* ─── Shared MockVariant enum (для секций с inline mock-визуалами) ── */
export const MockVariantSchema = z.enum([
  'support-board',
  'request-card',
  'kb-public',
  'kb-internal',
  'pm-board',
  'analytics-kpi',
  'integrations-console',
  'modules-matrix',
  'sales-funnel',
  'crm-client-card',
  'omnichannel-inbox',
  'call-overlay',
  'booking-calendar',
  'crm-analytics',
  'doc-template',
  'mobile-crm',
]);
export type MockVariant = z.infer<typeof MockVariantSchema>;

/* ─── TabbedFeatureSection ────────────────────────────────────────── */
const TabbedFeatureSectionSchema = z.object({
  id: z.literal('tabbed_feature'),
  component: z.literal('TabbedFeatureSection'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(280).optional(),
    tabs: z
      .array(
        z.object({
          id: z.string().min(1).max(40),
          label: z.string().min(2).max(40),
          icon: z.string().optional(),
          eyebrow: z.string().max(80).optional(),
          title: z.string().min(4).max(120),
          description: z.string().max(400).optional(),
          checklist: z
            .array(
              z.object({
                icon: z.string().optional(),
                text: z.string().min(2).max(180),
              }),
            )
            .max(6)
            .optional(),
          primaryCta: CtaSchema.optional(),
          mockVariant: MockVariantSchema,
        }),
      )
      .min(2)
      .max(5),
  }),
});

/* ─── ScenarioWalkthroughSection ──────────────────────────────────── */
const ScenarioWalkthroughSectionSchema = z.object({
  id: z.literal('scenario_walkthrough'),
  component: z.literal('ScenarioWalkthroughSection'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(400).optional(),
    protagonist: z.string().max(80).optional(),
    steps: z
      .array(
        z.object({
          time: z.string().min(1).max(40),
          title: z.string().min(4).max(120),
          description: z.string().min(10).max(400),
          icon: z.string().optional(),
          mockVariant: MockVariantSchema,
        }),
      )
      .min(3)
      .max(6),
  }),
});

/* ─── IndustryPickerSection ───────────────────────────────────────── */
const IndustryPickerSectionSchema = z.object({
  id: z.literal('industry_picker'),
  component: z.literal('IndustryPickerSection'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(280).optional(),
    industries: z
      .array(
        z.object({
          id: z.string().min(1).max(40),
          icon: z.string().min(1).max(40),
          name: z.string().min(2).max(60),
          summary: z.string().min(4).max(160),
          scenario: z.string().min(10).max(400),
          keyFeatures: z
            .array(
              z.object({
                icon: z.string().optional(),
                text: z.string().min(2).max(120),
              }),
            )
            .min(2)
            .max(6),
          metric: z
            .object({
              value: z.string().min(1).max(20),
              label: z.string().min(2).max(60),
            })
            .optional(),
        }),
      )
      .min(3)
      .max(8),
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
  SocialProofSchema,
  ProcessStepsSchema,
  CtaBannerSchema,
  PricingPlansSchema,
  FAQAccordionSchema,
  FinalCtaSchema,
  LandingFooterSchema,
  MediaCopySchema,
  StatStripSchema,
  PromoBannerSchema,
  BenefitsStripSchema,
  MetricsSplitSchema,
  TabbedFeatureSectionSchema,
  ScenarioWalkthroughSectionSchema,
  IndustryPickerSectionSchema,
]);
export type Section = z.infer<typeof SectionSchema>;

/* ─── LandingSpec ─────────────────────────────────────────────────── */
export const LandingSpecMetaSchema = z
  .object({
    sources: z.array(z.string()).default([]),
    generatedAt: z.string().optional(),
    generator: z.string().optional(),
    archetype: z.string().optional(),
    layout: z.string().optional().describe('Slug выбранного layout из wiki/layouts/'),
    tokenEstimate: z.number().optional(),
    promptVersion: z.string().optional(),
    domain: z
      .enum(['pm', 'support', 'crm', 'hr', 'marketing', 'bpm', 'finance', 'ecommerce', 'unknown'])
      .optional()
      .describe(
        'Резолвленный домен продукта (из brief.product/market/audience). Используется ' +
          'illustration-domain-match валидатором для блокировки cross-domain reuse. ' +
          'Если не задан явно — резолвится из brief при ingest. См. wiki/references/domain-mock-matrix.md.',
      ),
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
