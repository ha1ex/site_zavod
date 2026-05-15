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
