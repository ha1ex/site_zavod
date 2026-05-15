import { HeroSection } from '@buffalo/ui/landing';
import type { LandingSpec, Section } from '../schemas/landing-spec.js';

/**
 * Прямой React-рендер LandingSpec в Next.js preview route.
 * В отличие от renderLandingToTSX (который генерит TSX-строку для handoff),
 * этот рендерит прямо в дереве через discriminated union на section.component.
 */

function RenderSection({ section }: { section: Section }) {
  switch (section.component) {
    case 'HeroSection':
      return <HeroSection {...section.props} />;
    case 'FeatureGrid':
    case 'FinalCta':
      // Этап 1: ещё не реализованы — заглушка, чтобы preview не падал
      return (
        <section className="mx-auto max-w-(--container-kaiten) px-4 py-12 text-(--color-text-secondary)">
          <p className="text-sm">
            [{section.component}] компонент будет добавлен в следующих этапах
          </p>
        </section>
      );
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
      {spec.sections.map((section) => (
        <RenderSection key={section.id} section={section} />
      ))}
    </>
  );
}
