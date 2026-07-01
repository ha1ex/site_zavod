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
      'hiring-pipeline',
      'candidate-card',
      'onboarding-checklist',
      'org-chart',
      'performance-review',
      'campaign-dashboard',
      'email-sequence',
      'ab-test-results',
      'audience-segments',
      'process-flowchart',
      'approval-chain',
      'sla-tracker',
      'ledger-view',
      'invoice-status',
      'reconciliation-matrix',
      'order-queue',
      'inventory-grid',
      'marketplace-connector',
      'docs-tree',
      'permissions-panel',
      'share-link-card',
      'doc-editor-rich',
      'template-gallery',
      'mobile-doc-reader',
      'production-board',
      'order-flow',
      'production-gantt',
      'production-task-card',
      'production-departments',
      'vks-artifact-flow',
      'meeting-room',
      'meet-list',
      'pm-board-1',
      'portfolio-board',
      'approval-board',
      'reports-charts',
      'finance-kb-docs',
      'generic',
    ])
    .optional(),
  /**
   * Опциональная ссылка на уникальную SVG-иллюстрацию (генерируется в P8
   * illustration allocation). Когда задана — рендерер использует её вместо
   * variant из enum. См. wiki/pipeline/phase-gates.md (P8).
   */
  illustrationId: z.string().optional(),
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

/* ─── ReviewSlider (слайдер клиентских отзывов) ───────────────────── */
const ReviewSliderSchema = z.object({
  id: z.literal('reviews'),
  component: z.literal('ReviewSlider'),
  props: z.object({
    title: z.string().max(120).optional(),
    subtitle: z.string().max(280).optional(),
    reviews: z
      .array(
        z.object({
          logo: z.string().max(60).optional(),
          quote: z.string().min(10).max(600),
          name: z.string().min(2).max(80),
          role: z.string().min(2).max(120),
          avatar: z.string().optional(),
          avatarInitial: z.string().max(4).optional(),
          avatarBg: z.string().max(30).optional(),
          caseUrl: z.string().optional(),
          caseLabel: z.string().max(40).optional(),
        }),
      )
      .min(1)
      .max(12),
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
        'hiring-pipeline',
        'candidate-card',
        'onboarding-checklist',
        'org-chart',
        'performance-review',
        'campaign-dashboard',
        'email-sequence',
        'ab-test-results',
        'audience-segments',
        'process-flowchart',
        'approval-chain',
        'sla-tracker',
        'ledger-view',
        'invoice-status',
        'reconciliation-matrix',
        'order-queue',
        'inventory-grid',
        'marketplace-connector',
        'docs-tree',
        'permissions-panel',
        'share-link-card',
        'doc-editor-rich',
        'template-gallery',
        'mobile-doc-reader',
        'production-board',
        'order-flow',
        'production-gantt',
        'production-task-card',
        'production-departments',
        'vks-artifact-flow',
        'meeting-room',
        'meet-list',
        'pm-board-1',
        'portfolio-board',
        'approval-board',
      'reports-charts',
      'finance-kb-docs',
      ])
      .optional(),
    /**
     * Опциональная ссылка на уникальную SVG-иллюстрацию (генерируется в P8).
     * Когда задана — рендерер использует её вместо mediaVariant.
     */
    customIllustrationId: z.string().optional(),
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

/* ─── ComparisonTable (vs-страницы, migration) ────────────────────── */
const ComparisonTableSchema = z.object({
  id: z.literal('comparison_table'),
  component: z.literal('ComparisonTable'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(400).optional(),
    columns: z
      .array(
        z.object({
          name: z.string().min(1).max(60),
          badge: z.string().max(40).optional(),
          highlighted: z.boolean().default(false),
        }),
      )
      .min(2)
      .max(4),
    rows: z
      .array(
        z.object({
          label: z.string().min(2).max(120),
          values: z.array(z.union([z.string().max(80), z.boolean()])).min(2).max(4),
        }),
      )
      .min(3)
      .max(20),
  }),
});

/* ─── TimelineRoadmap (migration plan, product launch, case study) ── */
const TimelineRoadmapSchema = z.object({
  id: z.literal('timeline_roadmap'),
  component: z.literal('TimelineRoadmap'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(400).optional(),
    milestones: z
      .array(
        z.object({
          period: z.string().min(1).max(40),
          title: z.string().min(2).max(120),
          description: z.string().max(280).optional(),
          status: z.enum(['done', 'in-progress', 'planned']).optional(),
          bullets: z.array(z.string().min(2).max(160)).max(6).optional(),
        }),
      )
      .min(2)
      .max(8),
    orientation: z.enum(['horizontal', 'vertical']).default('vertical'),
  }),
});

/* ─── BentoGrid (feature overview с visual hierarchy) ─────────────── */
const BentoGridSchema = z.object({
  id: z.literal('bento_grid'),
  component: z.literal('BentoGrid'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(400).optional(),
    cells: z
      .array(
        z.object({
          icon: z.string().describe('lucide-icon name').optional(),
          title: z.string().min(2).max(80),
          description: z.string().min(10).max(280),
          size: z.enum(['small', 'wide', 'tall', 'large']).default('small'),
          accent: z.boolean().default(false),
        }),
      )
      .min(3)
      .max(9),
  }),
});

/* ─── LogoCloud (trust signal) ────────────────────────────────────── */
const LogoCloudSchema = z.object({
  id: z.literal('logo_cloud'),
  component: z.literal('LogoCloud'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120).optional(),
    description: z.string().max(280).optional(),
    items: z
      .array(
        z.object({
          brand: z.string().min(1).max(60),
          brandInitial: z.string().max(4).optional(),
        }),
      )
      .min(4)
      .max(20),
  }),
});

/* ─── TestimonialQuote (case-study deep-dive, story-led) ──────────── */
const TestimonialQuoteSchema = z.object({
  id: z.literal('testimonial_quote'),
  component: z.literal('TestimonialQuote'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    quote: z.string().min(20).max(600),
    authorName: z.string().min(2).max(80),
    authorRole: z.string().max(120).optional(),
    brandName: z.string().max(60).optional(),
    brandInitial: z.string().max(4).optional(),
    metric: z.string().max(120).optional(),
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
  'hiring-pipeline',
  'candidate-card',
  'onboarding-checklist',
  'org-chart',
  'performance-review',
  'campaign-dashboard',
  'email-sequence',
  'ab-test-results',
  'audience-segments',
  'process-flowchart',
  'approval-chain',
  'sla-tracker',
  'ledger-view',
  'invoice-status',
  'reconciliation-matrix',
  'order-queue',
  'inventory-grid',
  'marketplace-connector',
  'docs-tree',
  'permissions-panel',
  'share-link-card',
  'doc-editor-rich',
  'template-gallery',
  'mobile-doc-reader',
  'production-board',
  'order-flow',
  'production-gantt',
  'production-task-card',
  'production-departments',
  'vks-artifact-flow',
  'meeting-room',
  'meet-list',
  'pm-board-1',
  'portfolio-board',
  'approval-board',
'reports-charts',
'finance-kb-docs',
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

/* ─── AccordionFeatureSection ─────────────────────────────────────── */
const AccordionFeatureSectionSchema = z.object({
  id: z.literal('accordion_feature'),
  component: z.literal('AccordionFeatureSection'),
  props: z.object({
    eyebrow: z.string().max(80).optional(),
    title: z.string().min(4).max(120),
    description: z.string().max(280).optional(),
    items: z
      .array(
        z.object({
          id: z.string().min(1).max(40),
          title: z.string().min(4).max(90),
          description: z.string().min(10).max(400),
          icon: z.string().optional(),
          mockVariant: MockVariantSchema,
        }),
      )
      .min(2)
      .max(5),
    primaryCta: CtaSchema.optional(),
    secondaryCta: CtaSchema.optional(),
    mediaPosition: z.enum(['left', 'right']).optional(),
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

const SiteHeaderSchema = z.object({
  id: z.literal('site_header'),
  component: z.literal('SiteHeader'),
  props: z.object({}).default({}),
});

const LandingFooterMockSchema = z.object({
  id: z.literal('kaiten_footer'),
  component: z.literal('LandingFooterMock'),
  props: z.object({}).default({}),
});

/* ─── Section union ───────────────────────────────────────────────── */
export const SectionSchema = z.discriminatedUnion('component', [
  HeroSectionSchema,
  FeatureGridSchema,
  SocialProofSchema,
  ReviewSliderSchema,
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
  AccordionFeatureSectionSchema,
  ScenarioWalkthroughSectionSchema,
  IndustryPickerSectionSchema,
  ComparisonTableSchema,
  TimelineRoadmapSchema,
  BentoGridSchema,
  LogoCloudSchema,
  TestimonialQuoteSchema,
  SiteHeaderSchema,
  LandingFooterMockSchema,
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
      .enum([
        'pm',
        'support',
        'crm',
        'hr',
        'marketing',
        'bpm',
        'finance',
        'ecommerce',
        'docs',
        'manufacturing',
        'unknown',
      ])
      .optional()
      .describe(
        'Резолвленный домен продукта (из brief.product/market/audience). Используется ' +
          'illustration-domain-match валидатором для блокировки cross-domain reuse. ' +
          'Если не задан явно — резолвится из brief при ingest. См. wiki/references/domain-mock-matrix.md.',
      ),
    illustrationAllocations: z
      .array(
        z.object({
          sectionIdx: z.number().int().nonnegative(),
          sectionId: z.string(),
          intent: z.string(),
          decision: z.enum(['reuse-mock', 'generate-svg', 'no-op']),
          variant: z.string().optional(),
          illustrationId: z.string().optional(),
        }),
      )
      .optional()
      .describe(
        'Решения phase P8 illustration allocation. Заполняется orchestrator\'ом. ' +
          'Используется для трассировки: какая секция получила какой mock/SVG.',
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
