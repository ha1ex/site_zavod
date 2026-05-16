import { cn } from '../primitives/cn';
import { Icon } from '../primitives/Icon';

export interface ProcessStepProps {
  icon?: string;
  title: string;
  description: string;
}

export interface ProcessStepsProps {
  eyebrow?: string;
  title: string;
  description?: string;
  steps: ProcessStepProps[];
}

/**
 * Numbered process — 3-4 card grid с большой цифрой шага, заголовком и
 * описанием. Каждая карточка имеет акцентный градиент сверху.
 */
export function ProcessSteps({ eyebrow, title, description, steps }: ProcessStepsProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-16 md:px-6 lg:py-24',
      )}
    >
      <div className="mb-12 max-w-2xl">
        {eyebrow && (
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
        {description && (
          <p className="mt-4 text-lg text-(--color-text-secondary)">{description}</p>
        )}
      </div>

      <div
        className={cn(
          'grid grid-cols-1 gap-6 md:grid-cols-2',
          steps.length === 3 && 'lg:grid-cols-3',
          steps.length === 4 && 'lg:grid-cols-4',
          steps.length >= 5 && 'lg:grid-cols-3',
        )}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className={cn(
              'relative overflow-hidden rounded-(--radius-2xl)',
              'border border-(--color-border-default) bg-(--color-surface-card) p-6',
            )}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-(--color-action-primary) to-(--color-blue-100)"
            />
            <div className="mb-4 flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-(--radius-xl)',
                  'bg-(--color-action-primary-soft) text-sm font-semibold text-(--color-text-accent)',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {step.icon && (
                <Icon name={step.icon} className="h-5 w-5 text-(--color-text-secondary)" />
              )}
            </div>
            <h3 className="text-lg font-semibold leading-snug">{step.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-(--color-text-secondary)">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
