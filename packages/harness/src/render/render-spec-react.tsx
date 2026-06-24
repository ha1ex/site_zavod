import {
  HeroSection,
  FeatureGrid,
  PricingPlans,
  FAQAccordion,
  FinalCta,
  LandingFooter,
  SocialProof,
  ProcessSteps,
  CtaBanner,
  MediaCopy,
  StatStrip,
  PromoBanner,
  BenefitsStrip,
  MetricsSplit,
  TabbedFeatureSection,
  ScenarioWalkthroughSection,
  IndustryPickerSection,
  ComparisonTable,
  TimelineRoadmap,
  BentoGrid,
  LogoCloud,
  TestimonialQuote,
  SiteHeader,
  LandingFooterMock,
} from '@kaiten/ui/landing';
import type { LandingSpec, Section } from '../schemas/landing-spec';

/**
 * Прямой React-рендер LandingSpec в Next.js preview route.
 * В отличие от renderLandingToTSX (генерит TSX-строку для handoff),
 * этот рендерит прямо в дереве через discriminated union на section.component.
 */

function RenderSection({ section }: { section: Section }) {
  switch (section.component) {
    case 'HeroSection':
      return <HeroSection {...section.props} />;
    case 'FeatureGrid':
      return <FeatureGrid {...section.props} />;
    case 'PricingPlans':
      return <PricingPlans {...section.props} />;
    case 'FAQAccordion':
      return <FAQAccordion {...section.props} />;
    case 'FinalCta':
      return <FinalCta {...section.props} />;
    case 'LandingFooter':
      return <LandingFooter {...section.props} />;
    case 'SiteHeader':
      return <SiteHeader />;
    case 'LandingFooterMock':
      return <LandingFooterMock />;
    case 'SocialProof':
      return <SocialProof {...section.props} />;
    case 'ProcessSteps':
      return <ProcessSteps {...section.props} />;
    case 'CtaBanner':
      return <CtaBanner {...section.props} />;
    case 'MediaCopy':
      return <MediaCopy {...section.props} />;
    case 'StatStrip':
      return <StatStrip {...section.props} />;
    case 'PromoBanner':
      return <PromoBanner {...section.props} />;
    case 'BenefitsStrip':
      return <BenefitsStrip {...section.props} />;
    case 'MetricsSplit':
      return <MetricsSplit {...section.props} />;
    case 'TabbedFeatureSection':
      return <TabbedFeatureSection {...section.props} />;
    case 'ScenarioWalkthroughSection':
      return <ScenarioWalkthroughSection {...section.props} />;
    case 'IndustryPickerSection':
      return <IndustryPickerSection {...section.props} />;
    case 'ComparisonTable':
      return <ComparisonTable {...section.props} />;
    case 'TimelineRoadmap':
      return <TimelineRoadmap {...section.props} />;
    case 'BentoGrid':
      return <BentoGrid {...section.props} />;
    case 'LogoCloud':
      return <LogoCloud {...section.props} />;
    case 'TestimonialQuote':
      return <TestimonialQuote {...section.props} />;
    default: {
      const _exhaustive: never = section;
      void _exhaustive;
      return null;
    }
  }
}

export function RenderLanding({ spec }: { spec: LandingSpec }) {
  return (
    <>
      {spec.sections.map((section, i) => (
        <div
          key={`${section.id}-${i}`}
          data-comp={section.id}
          data-comp-index={String(i)}
        >
          <RenderSection section={section} />
        </div>
      ))}
    </>
  );
}
