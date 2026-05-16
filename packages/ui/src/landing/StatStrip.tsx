import { cn } from '../primitives/cn';

export interface StatItemProps {
  value: string;
  label: string;
  description?: string;
}

export interface StatStripProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  stats: StatItemProps[];
}

/**
 * StatStrip — горизонтальная полоса 3-5 карточек с цифрами/фактами.
 * Используется как social-proof или как «итоги» секции.
 */
export function StatStrip({ eyebrow, title, description, stats }: StatStripProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-12 md:px-6 lg:py-16',
      )}
    >
      {(eyebrow || title || description) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
          )}
          {description && (
            <p className="mt-4 text-lg text-(--color-text-secondary)">{description}</p>
          )}
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6',
          stats.length === 3 && 'md:grid-cols-3',
          stats.length === 5 && 'md:grid-cols-5',
        )}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className={cn(
              'rounded-(--radius-2xl) border border-(--color-border-default)',
              'bg-(--color-surface-card) p-6 md:p-7',
            )}
          >
            <div className="text-3xl font-semibold text-(--color-text-accent) md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-2 text-base font-medium text-(--color-text-primary)">
              {stat.label}
            </div>
            {stat.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-(--color-text-secondary)">
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
