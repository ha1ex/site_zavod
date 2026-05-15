import { ButtonLink } from '../primitives/ButtonLink';
import { cn } from '../primitives/cn';

export interface CtaBannerCtaProps {
  label: string;
  href: string;
}

export interface CtaBannerProps {
  title: string;
  description?: string;
  primaryCta: CtaBannerCtaProps;
  secondaryCta?: CtaBannerCtaProps | null;
}

/**
 * Inline CTA banner для размещения между секциями (вроде «Документы Кайтен
 * — бесплатно и без ограничений»). Слабый фиолетовый фон, скруглённая
 * карточка с CTA справа.
 */
export function CtaBanner({ title, description, primaryCta, secondaryCta }: CtaBannerProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-10 md:px-6 lg:py-12',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-6 rounded-(--radius-3xl)',
          'border border-(--color-action-primary)/20 bg-(--color-action-primary-soft)',
          'px-6 py-8 md:px-10 md:py-10 lg:flex-row lg:items-center lg:justify-between',
        )}
      >
        <div className="max-w-2xl">
          <h3 className="text-2xl font-semibold leading-tight md:text-3xl">{title}</h3>
          {description && (
            <p className="mt-3 text-base leading-relaxed text-(--color-text-secondary)">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
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
    </section>
  );
}
