import { ButtonLink } from '../primitives/ButtonLink';
import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';
import { CTAsecondaryMock, type CTAButton } from './mocks/CTAsecondaryMock';
import { MockVisual, type MockVariant } from './mocks';

export interface FinalCtaProps {
  title: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string } | null;
  /**
   * 'solid' (по умолчанию) — прежняя сплошная фиолетовая заливка (старые лендинги).
   * 'gradient' — градиентный блок `CTAsecondaryMock` (ритейл и последующие лендинги).
   */
  variant?: 'solid' | 'gradient';
  /** Интерфейс справа (только для variant='gradient') под тематику лендинга. */
  visualVariant?: MockVariant;
}

/**
 * FinalCta — финальный призыв к действию.
 *  - `variant='solid'` (дефолт): сплошная заливка — как было, для старых лендингов;
 *  - `variant='gradient'`: градиентный блок `CTAsecondaryMock` с интерфейсом справа
 *    (opt-in для ритейла и новых лендингов). Правило: `finalcta-gradient`.
 */
export function FinalCta({
  title,
  description,
  primaryCta,
  secondaryCta,
  variant = 'solid',
  visualVariant,
}: FinalCtaProps) {
  if (variant === 'gradient') {
    const buttons: CTAButton[] = [
      { label: primaryCta.label, href: primaryCta.href, variant: 'fill' },
      ...(secondaryCta
        ? [{ label: secondaryCta.label, href: secondaryCta.href, variant: 'outline' as const }]
        : []),
    ];
    return (
      <CTAsecondaryMock
        title={title}
        subtitle={description}
        buttons={buttons}
        visual={visualVariant ? <MockVisual variant={visualVariant} /> : undefined}
      />
    );
  }

  return (
    <section
      className={cn('mx-auto w-full max-w-(--container-kaiten)', 'px-4 py-16 md:px-6 lg:py-24')}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-(--radius-3xl)',
          'px-8 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20',
          'bg-(--color-action-primary) text-(--color-text-inverse)',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-(--color-text-inverse) opacity-10 blur-3xl"
        />
        <h2
          data-comp="final_cta.title"
          className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl"
        >
          {title}
        </h2>
        {description && (
          <p
            data-comp="final_cta.description"
            className="mt-4 max-w-xl text-lg text-(--color-text-inverse)/80"
          >
            {description}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Inspect name="final_cta.primaryCta">
            <ButtonLink
              href={primaryCta.href}
              size="lg"
              className="bg-(--color-text-inverse) text-(--color-action-primary) hover:bg-(--color-text-inverse)/90"
            >
              {primaryCta.label}
            </ButtonLink>
          </Inspect>
          {secondaryCta && (
            <Inspect name="final_cta.secondaryCta">
              <ButtonLink
                href={secondaryCta.href}
                size="lg"
                variant="outline"
                className="border-(--color-text-inverse)/40 bg-transparent text-(--color-text-inverse) hover:bg-(--color-text-inverse)/10 hover:text-(--color-text-inverse) hover:border-(--color-text-inverse)/60"
              >
                {secondaryCta.label}
              </ButtonLink>
            </Inspect>
          )}
        </div>
      </div>
    </section>
  );
}
