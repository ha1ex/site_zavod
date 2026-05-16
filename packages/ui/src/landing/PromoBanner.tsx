import { ButtonLink } from '../primitives/ButtonLink';
import { cn } from '../primitives/cn';

export interface PromoBannerCtaProps {
  label: string;
  href: string;
}

export interface PromoBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta: PromoBannerCtaProps;
  secondaryCta?: PromoBannerCtaProps | null;
  tone?: 'violet' | 'soft';
}

/**
 * PromoBanner — большая полноширинная акцентная секция в фиолетовом
 * (violet) или мягкой (soft) тональности. Используется на Kaiten как
 * «переходный мост» между блоками — «Перейти на Кайтен», «Документы
 * бесплатно», и т.п.
 */
export function PromoBanner({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  tone = 'violet',
}: PromoBannerProps) {
  const isViolet = tone === 'violet';
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-12 md:px-6 lg:py-16',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-(--radius-3xl) px-8 py-12 md:px-14 md:py-16 lg:py-20',
          isViolet
            ? 'bg-(--color-action-primary) text-(--color-text-inverse)'
            : 'border border-(--color-action-primary)/20 bg-(--color-action-primary-soft) text-(--color-text-primary)',
        )}
      >
        {/* decorative blob */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl',
            isViolet ? 'bg-white' : 'bg-(--color-action-primary)',
          )}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p
              className={cn(
                'mb-3 text-sm font-medium uppercase tracking-wide',
                isViolet ? 'text-white/80' : 'text-(--color-text-accent)',
              )}
            >
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                'mx-auto mt-4 max-w-2xl text-lg leading-relaxed',
                isViolet ? 'text-white/85' : 'text-(--color-text-secondary)',
              )}
            >
              {description}
            </p>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink
              size="lg"
              variant={isViolet ? 'invert' : 'fill'}
              href={primaryCta.href}
            >
              {primaryCta.label}
            </ButtonLink>
            {secondaryCta && (
              <ButtonLink
                size="lg"
                variant={isViolet ? 'ghost-on-violet' : 'outline'}
                href={secondaryCta.href}
              >
                {secondaryCta.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
