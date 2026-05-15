import { ButtonLink } from '../primitives/ButtonLink.js';
import { cn } from '../primitives/cn.js';

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
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'bg-(--color-surface-page) text-(--color-text-primary)',
        'mx-auto w-full max-w-[1440px]',
        'px-4 py-14 md:px-6 lg:py-20',
      )}
    >
      <div className="mx-auto max-w-(--container-kaiten)">
        <div className="flex flex-col gap-12 xl:flex-row xl:items-center">
          <div className="xl:max-w-xl">
            {eyebrow && (
              <p className="mb-3 text-sm font-medium text-(--color-text-accent) uppercase tracking-wide">
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

          {visual && (
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
          )}
        </div>
      </div>
    </section>
  );
}
