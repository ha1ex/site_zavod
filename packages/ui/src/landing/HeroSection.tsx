import { ButtonLink } from '../primitives/ButtonLink';
import { cn } from '../primitives/cn';
import { SectionMock, type SectionMockUi } from './SectionMock';

export interface CtaProps {
  label: string;
  href: string;
}

export interface AssetRefProps {
  type: 'product_screenshot' | 'illustration' | 'logo_cloud' | 'photo';
  src?: string;
  alt?: string;
}

export interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta: CtaProps;
  secondaryCta?: CtaProps | null;
  visual?: AssetRefProps | null;
  mockUi?: SectionMockUi | null;
}

/**
 * Kaiten V01 hero: violet primary CTA, optional outline secondary CTA,
 * product screenshot on the right (xl+) or below (md and smaller).
 *
 * Layout rules from skill:
 * - Desktop hero title: text-5xl / text-6xl, SemiBold, tight leading
 * - Mobile hero title:  text-3xl SemiBold
 * - Text-to-CTA gap:    6/24
 * - Content-to-media:   12/48
 */
export function HeroSection({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  visual,
  mockUi,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden',
        'bg-(--color-surface-page) text-(--color-text-primary)',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 mx-auto h-[720px] max-w-[1440px] bg-[radial-gradient(60%_60%_at_70%_0%,rgba(125,76,207,0.22)_0%,rgba(125,76,207,0)_60%),radial-gradient(40%_40%_at_15%_30%,rgba(33,150,243,0.10)_0%,rgba(33,150,243,0)_60%)]"
      />
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-14 pb-12 md:px-6 lg:pt-20 lg:pb-12">
        <div className="mx-auto max-w-(--container-kaiten)">
          <div className="flex flex-col gap-12 xl:flex-row xl:items-center">
            <div className="xl:max-w-xl">
              {eyebrow && (
                <p className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)">
                  {eyebrow}
                </p>
              )}
              <h1 className="mb-4 text-3xl font-semibold leading-tight sm:text-5xl xl:text-6xl">
                {title}
              </h1>
              <p className="text-(--color-text-secondary) text-base sm:text-lg sm:max-w-md">
                {subtitle}
              </p>
              <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                <ButtonLink size="lg" href={primaryCta.href}>
                  {primaryCta.label}
                </ButtonLink>
                {secondaryCta && (
                  <ButtonLink variant="outline" size="lg" href={secondaryCta.href}>
                    {secondaryCta.label}
                  </ButtonLink>
                )}
              </div>
            </div>

            {mockUi ? (
              <div className="xl:flex-1">
                <SectionMock mock={mockUi} />
              </div>
            ) : visual ? (
              <div className="xl:flex-1">
                {visual.src ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={visual.src}
                    alt={visual.alt ?? ''}
                    className="block w-full rounded-(--radius-3xl) shadow-lg"
                  />
                ) : (
                  <div
                    aria-hidden
                    className={cn(
                      'flex aspect-[4/3] w-full items-center justify-center',
                      'rounded-(--radius-3xl) bg-(--color-surface-section) text-(--color-text-secondary)',
                    )}
                  >
                    <span className="text-sm">visual: {visual.type}</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
