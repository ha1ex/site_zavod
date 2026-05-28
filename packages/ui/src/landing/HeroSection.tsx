import { ButtonLink } from '../primitives/ButtonLink';
import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';
import { MockVisual, type MockVariant } from './mocks';

export interface CtaProps {
  label: string;
  href: string;
}

export interface AssetRefProps {
  type: 'product_screenshot' | 'illustration' | 'logo_cloud' | 'photo';
  assetId?: string;
  src?: string;
  alt?: string;
  /** Built-in detailed mocks (see ./mocks). When set, ignores src. */
  variant?: MockVariant | 'generic';
  /**
   * Reference to an auto-generated unique SVG illustration (P8 phase).
   * When set, renderer uses it instead of variant. Currently passed through
   * but not rendered (M4 full integration upcoming).
   */
  illustrationId?: string;
}

export interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  /**
   * Optional accent word/phrase that will be visually highlighted inside the title
   * (Kaiten signature — фиолетовая pill вокруг ключевого слова).
   */
  accentWord?: string;
  subtitle: string;
  primaryCta: CtaProps;
  secondaryCta?: CtaProps | null;
  visual?: AssetRefProps | null;
  /**
   * 'side' (default) — mock справа, layout 50/50
   * 'below' — большой mock под текстом, контент по центру (Kaiten home pattern)
   */
  visualPosition?: 'side' | 'below';
}

/**
 * Kaiten V01 hero с двумя вариантами layout:
 * - side: текст слева, продуктовый mock справа (B2B 50/50)
 * - below: контент по центру, mock огромный под ним (как на kaiten.ru)
 *
 * Title поддерживает accentWord — кусочек заголовка оборачивается в pill
 * с фиолетовым подсветом (Kaiten signature).
 */
export function HeroSection({
  eyebrow,
  title,
  accentWord,
  subtitle,
  primaryCta,
  secondaryCta,
  visual,
  visualPosition = 'side',
}: HeroSectionProps) {
  const renderedTitle = accentWord ? highlightAccent(title, accentWord) : title;
  const isBelow = visualPosition === 'below';

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden',
        'bg-(--color-surface-page) text-(--color-text-primary)',
      )}
    >
      {/*
        Full-bleed decorative gradient — must span the entire positioned ancestor.
        Никаких `max-w-*` / `mx-auto` на background-слое: на широких мониторах
        (>1440px) такой слой обрезается полосами по бокам. Капать ширину можно
        только у контентного контейнера ниже.
      */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[720px]',
          'bg-[radial-gradient(60%_60%_at_70%_0%,rgba(125,76,207,0.22)_0%,rgba(125,76,207,0)_60%),radial-gradient(40%_40%_at_15%_30%,rgba(33,150,243,0.10)_0%,rgba(33,150,243,0)_60%)]',
        )}
      />

      <div
        className={cn(
          'mx-auto w-full max-w-(--container-kaiten)',
          'px-4 pt-14 pb-12 md:px-6 lg:pt-20',
          isBelow ? 'lg:pb-12' : 'lg:pb-20',
        )}
      >
        {isBelow ? (
          <div className="flex flex-col items-center gap-12">
            <div className="max-w-3xl text-center">
              {eyebrow && (
                <Inspect name="hero.eyebrow">
                  <EyebrowPill>{eyebrow}</EyebrowPill>
                </Inspect>
              )}
              <h1
                data-comp="hero.title"
                className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl"
              >
                {renderedTitle}
              </h1>
              <p
                data-comp="hero.subtitle"
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-(--color-text-secondary) sm:text-xl"
              >
                {subtitle}
              </p>
              <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                <Inspect name="hero.primaryCta">
                  <ButtonLink size="lg" href={primaryCta.href}>
                    {primaryCta.label}
                  </ButtonLink>
                </Inspect>
                {secondaryCta && (
                  <Inspect name="hero.secondaryCta">
                    <ButtonLink variant="outline" size="lg" href={secondaryCta.href}>
                      {secondaryCta.label}
                    </ButtonLink>
                  </Inspect>
                )}
              </div>
            </div>
            {visual && (
              <div data-comp="hero.visual" className="w-full">
                <HeroVisual src={visual.src} alt={visual.alt} variant={visual.variant} large />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-12 xl:flex-row xl:items-center xl:gap-16">
            <div className="xl:max-w-2xl">
              {eyebrow && (
                <Inspect name="hero.eyebrow">
                  <EyebrowPill>{eyebrow}</EyebrowPill>
                </Inspect>
              )}
              <h1
                data-comp="hero.title"
                className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl"
              >
                {renderedTitle}
              </h1>
              <p
                data-comp="hero.subtitle"
                className="mt-6 max-w-xl text-lg leading-relaxed text-(--color-text-secondary) sm:text-xl"
              >
                {subtitle}
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                <Inspect name="hero.primaryCta">
                  <ButtonLink size="lg" href={primaryCta.href}>
                    {primaryCta.label}
                  </ButtonLink>
                </Inspect>
                {secondaryCta && (
                  <Inspect name="hero.secondaryCta">
                    <ButtonLink variant="outline" size="lg" href={secondaryCta.href}>
                      {secondaryCta.label}
                    </ButtonLink>
                  </Inspect>
                )}
              </div>
            </div>
            {visual && (
              <div data-comp="hero.visual" className="xl:flex-1">
                <HeroVisual src={visual.src} alt={visual.alt} variant={visual.variant} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── private ─── */

function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'mb-5 inline-flex items-center rounded-full px-3 py-1',
        'border border-(--color-action-primary)/20',
        'bg-(--color-action-primary-soft) text-sm font-medium text-(--color-text-accent)',
      )}
    >
      {children}
    </span>
  );
}

/**
 * Splits the title around accentWord (case-insensitive, first match) and wraps
 * the match in a styled pill. If no match is found, returns title unchanged.
 */
function highlightAccent(title: string, accent: string): React.ReactNode {
  const idx = title.toLowerCase().indexOf(accent.toLowerCase());
  if (idx === -1) return title;
  const before = title.slice(0, idx);
  const match = title.slice(idx, idx + accent.length);
  const after = title.slice(idx + accent.length);
  return (
    <>
      {before}
      <span
        className={cn(
          'inline-block rounded-(--radius-2xl) bg-(--color-action-primary-soft)',
          'px-3 pb-1 text-(--color-text-accent)',
        )}
      >
        {match}
      </span>
      {after}
    </>
  );
}

interface HeroVisualProps {
  src?: string;
  alt?: string;
  variant?: AssetRefProps['variant'];
  large?: boolean;
}

function HeroVisual({ src, alt, variant, large = false }: HeroVisualProps) {
  if (variant && variant !== 'generic') {
    const rendered = <MockVisual variant={variant} />;
    if (rendered) return rendered;
  }
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
      <div
        className={cn(
          'grid gap-3',
          large ? 'grid-cols-4 p-6 md:p-8' : 'grid-cols-3 p-5',
        )}
      >
        {(large
          ? ['Очередь', 'В работе', 'Готовлю ответ', 'Готово']
          : ['Очередь', 'В работе', 'Готово']
        ).map((col, ci, arr) => (
          <div key={col} className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-(--color-text-secondary)">
              <span>{col}</span>
              <span className="rounded-full bg-(--color-neutral-200) px-2 py-0.5">
                {arr.length - ci}
              </span>
            </div>
            {Array.from({ length: arr.length - ci }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) shadow-sm',
                  large ? 'p-4' : 'p-3',
                )}
              >
                <div
                  className={cn(
                    'mb-2 h-2 w-12 rounded-full',
                    ci === 0 && i === 0
                      ? 'bg-(--color-action-primary)'
                      : ci === 1
                        ? 'bg-(--color-orange-100)'
                        : ci === 2
                          ? 'bg-(--color-blue-100)'
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
