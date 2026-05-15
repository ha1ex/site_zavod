import type { Brief } from '../schemas/brief.js';
import { LandingSpecSchema, type LandingSpec } from '../schemas/landing-spec.js';

/**
 * Этап 1: детерминированный fallback brief → LandingSpec.
 *
 * Никакого LLM здесь нет — это template-based mapper, чтобы pipeline можно
 * было прогонять end-to-end до подключения модели (этап 2). LLM-версия
 * заменит эту функцию вызовом generateObject против LandingSpecSchema.
 */
export function landingSpecFromBrief(brief: Brief): LandingSpec {
  const pageType =
    brief.pageArchetype === 'waitlist'
      ? 'waitlist_landing'
      : brief.pageArchetype === 'enterprise'
        ? 'enterprise_landing'
        : 'saas_landing';

  const draft: LandingSpec = {
    pageType,
    goal: brief.primaryGoal,
    sections: [
      {
        id: 'hero',
        component: 'HeroSection',
        props: {
          eyebrow: `${brief.product}`.slice(0, 80),
          title: brief.mainPromise.slice(0, 80),
          subtitle: brief.mainPain.slice(0, 200),
          primaryCta: { label: brief.cta, href: '/demo' },
          secondaryCta:
            brief.primaryGoal === 'book_demo'
              ? { label: 'Как это работает', href: '#how-it-works' }
              : null,
          visual: { type: 'product_screenshot', assetId: 'auto-screenshot' },
        },
      },
    ],
    seo: {
      title: `${brief.product} — ${brief.mainPromise}`.slice(0, 70),
      description: brief.mainPain.slice(0, 160),
    },
    illustrationSpecs: [],
  };

  return LandingSpecSchema.parse(draft);
}
