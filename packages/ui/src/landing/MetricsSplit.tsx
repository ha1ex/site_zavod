import { cn } from '../primitives/cn';

export interface MetricCellProps {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface MetricsSplitProps {
  eyebrow?: string;
  title: string;
  description?: string;
  metrics: MetricCellProps[];
  bullets?: { title: string; description: string }[];
}

/**
 * Split-layout: текст слева + 2×2 grid живых метрик справа.
 * Внизу опц. 4-блочный grid пояснений (как в reference «Где сейчас все
 * заявки / Растёт ли нагрузка / Кто перегружен / SLA»).
 */
export function MetricsSplit({
  eyebrow,
  title,
  description,
  metrics,
  bullets,
}: MetricsSplitProps) {
  return (
    <section
      className={cn(
        'bg-(--color-surface-section)/60',
      )}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-(--container-kaiten)',
          'px-4 py-16 md:px-6 lg:py-20',
        )}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            {eyebrow && (
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
            {description && (
              <p className="mt-4 text-lg leading-relaxed text-(--color-text-secondary)">
                {description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {metrics.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-(--radius-2xl) border border-(--color-border-default)',
                  'bg-(--color-surface-card) p-6 md:p-7',
                )}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-(--color-text-primary) md:text-4xl">
                    {m.value}
                  </span>
                  {m.trend === 'up' && (
                    <span className="text-(--color-green-100)" aria-hidden>▲</span>
                  )}
                  {m.trend === 'down' && (
                    <span className="text-(--color-red-100)" aria-hidden>▼</span>
                  )}
                </div>
                <div className="mt-1.5 text-sm text-(--color-text-secondary)">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {bullets && bullets.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {bullets.map((b, i) => (
              <article
                key={i}
                className={cn(
                  'rounded-(--radius-2xl) border border-(--color-border-default)',
                  'bg-(--color-surface-card) p-6',
                )}
              >
                <h3 className="text-lg font-semibold leading-snug">{b.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-(--color-text-secondary)">
                  {b.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
