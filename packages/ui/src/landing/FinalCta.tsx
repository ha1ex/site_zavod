import { ButtonLink } from '../primitives/ButtonLink';
import { cn } from '../primitives/cn';

export interface FinalCtaProps {
  title: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string } | null;
}

export function FinalCta({ title, description, primaryCta, secondaryCta }: FinalCtaProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-16 md:px-6 lg:py-24',
      )}
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
        <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-xl text-lg text-(--color-text-inverse)/80">{description}</p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={primaryCta.href}
            size="lg"
            className="bg-(--color-text-inverse) text-(--color-action-primary) hover:bg-(--color-text-inverse)/90"
          >
            {primaryCta.label}
          </ButtonLink>
          {secondaryCta && (
            <ButtonLink
              href={secondaryCta.href}
              size="lg"
              variant="outline"
              className="border-(--color-text-inverse)/40 bg-transparent text-(--color-text-inverse) hover:bg-(--color-text-inverse)/10 hover:text-(--color-text-inverse) hover:border-(--color-text-inverse)/60"
            >
              {secondaryCta.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
