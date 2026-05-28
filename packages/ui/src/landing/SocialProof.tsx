import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';

export interface CaseProps {
  brand: string;
  brandInitial?: string;
  quote: string;
  metric?: string;
  href?: string;
}

export interface SocialProofProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  cases: CaseProps[];
}

/**
 * Client cases / quotes — 3 card grid с логотипом-инициалом, цитатой и линком.
 */
export function SocialProof({ eyebrow, title, description, cases }: SocialProofProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-16 md:px-6 lg:py-20',
      )}
    >
      {(eyebrow || title || description) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p
              data-comp="social_proof.eyebrow"
              className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)"
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              data-comp="social_proof.title"
              className="text-3xl font-semibold leading-tight md:text-4xl"
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              data-comp="social_proof.description"
              className="mt-4 text-lg text-(--color-text-secondary)"
            >
              {description}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cases.map((c, i) => (
          <Inspect
            as="div"
            key={i}
            name={`social_proof.cases[${i}]`}
            className={cn(
              'flex flex-col rounded-(--radius-2xl) border border-(--color-border-default)',
              'bg-(--color-surface-card) p-6',
            )}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-(--radius-xl)',
                  'bg-(--color-action-primary-soft) text-base font-semibold text-(--color-text-accent)',
                )}
                aria-hidden
              >
                {c.brandInitial ?? c.brand.charAt(0).toUpperCase()}
              </div>
              <p
                data-comp={`social_proof.cases[${i}].brand`}
                className="text-base font-semibold"
              >
                {c.brand}
              </p>
            </div>
            <p
              data-comp={`social_proof.cases[${i}].quote`}
              className="flex-1 text-base leading-relaxed text-(--color-text-primary)"
            >
              «{c.quote}»
            </p>
            {c.metric && (
              <p
                data-comp={`social_proof.cases[${i}].metric`}
                className="mt-4 text-sm font-medium text-(--color-text-accent)"
              >
                {c.metric}
              </p>
            )}
            {c.href && (
              <a
                data-comp={`social_proof.cases[${i}].href`}
                href={c.href}
                className={cn(
                  'mt-4 inline-flex items-center gap-1 text-sm font-medium',
                  'text-(--color-action-primary) hover:underline',
                )}
              >
                Читать кейс →
              </a>
            )}
          </Inspect>
        ))}
      </div>
    </section>
  );
}
