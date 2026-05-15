import { ButtonLink } from '../primitives/ButtonLink';
import { cn } from '../primitives/cn';

export interface CtaProps {
  label: string;
  href: string;
}

export interface AssetRefProps {
  type: 'product_screenshot' | 'illustration' | 'logo_cloud' | 'photo';
  assetId?: string;
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
 * Kaiten V01 hero: violet primary CTA, optional outline secondary CTA, decorative
 * product-mock on the right (xl+) — a stylised app window with a tinted gradient
 * surround. Layout rules from skill: Desktop title text-5xl/6xl SemiBold,
 * text-to-CTA gap 6/24, content-to-media 12/48.
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
        'relative isolate overflow-hidden',
        'bg-(--color-surface-page) text-(--color-text-primary)',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 -top-32 -z-10 mx-auto h-[640px] max-w-[1440px]',
          'bg-[radial-gradient(60%_60%_at_70%_0%,rgba(125,76,207,0.18)_0%,rgba(125,76,207,0)_60%),radial-gradient(40%_40%_at_15%_30%,rgba(33,150,243,0.10)_0%,rgba(33,150,243,0)_60%)]',
        )}
      />

      <div
        className={cn(
          'mx-auto w-full max-w-(--container-kaiten)',
          'px-4 pt-14 pb-12 md:px-6 lg:pt-20 lg:pb-20',
        )}
      >
        <div className="flex flex-col gap-12 xl:flex-row xl:items-center xl:gap-16">
          <div className="xl:max-w-2xl">
            {eyebrow && (
              <span
                className={cn(
                  'mb-5 inline-flex items-center rounded-full px-3 py-1',
                  'border border-(--color-action-primary)/20',
                  'bg-(--color-action-primary-soft) text-sm font-medium text-(--color-text-accent)',
                )}
              >
                {eyebrow}
              </span>
            )}
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-(--color-text-secondary) sm:text-xl">
              {subtitle}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
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
              <HeroVisual assetId={visual.assetId} src={visual.src} alt={visual.alt} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface HeroVisualProps {
  assetId?: string;
  src?: string;
  alt?: string;
}

/**
 * If a real image src is provided, render it. Otherwise render a decorative
 * "browser-window" mock with a faux kanban board — looks like Kaiten without
 * needing actual screenshots in the spec.
 */
function HeroVisual({ src, alt }: HeroVisualProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ''}
        className="block w-full rounded-(--radius-3xl) shadow-xl"
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-4 h-4 w-40 rounded-md bg-(--color-neutral-200)" />
      </div>

      {/* board */}
      <div className="grid grid-cols-3 gap-3 p-5">
        {(['Очередь', 'В работе', 'Готово'] as const).map((col, ci) => (
          <div key={col} className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-(--color-text-secondary)">
              <span>{col}</span>
              <span className="rounded-full bg-(--color-neutral-200) px-2 py-0.5">{3 - ci}</span>
            </div>
            {Array.from({ length: 3 - ci }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-3 shadow-sm',
                )}
              >
                <div
                  className={cn(
                    'mb-2 h-2 w-12 rounded-full',
                    ci === 0 && i === 0
                      ? 'bg-(--color-action-primary)'
                      : ci === 1
                        ? 'bg-(--color-orange-100)'
                        : 'bg-(--color-green-100)',
                  )}
                />
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-(--color-neutral-200)" />
                  <div className="h-2 w-3/4 rounded-full bg-(--color-neutral-200)" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="h-5 w-12 rounded-full bg-(--color-action-primary-soft)" />
                  <div className="h-5 w-5 rounded-full bg-(--color-neutral-300)" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
