import { cn } from '../primitives/cn';
import { Icon } from '../primitives/Icon';

export interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

export interface FeatureGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: FeatureItemProps[];
  columns?: 2 | 3 | 4;
}

const colsClass: Record<NonNullable<FeatureGridProps['columns']>, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

export function FeatureGrid({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
}: FeatureGridProps) {
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

      <div className={cn('grid grid-cols-1 gap-6', colsClass[columns])}>
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              'group rounded-(--radius-2xl) border border-(--color-border-default)',
              'bg-(--color-surface-card) p-6 transition',
              'hover:-translate-y-0.5 hover:border-(--color-action-primary)/40 hover:shadow-sm',
            )}
          >
            <div
              className={cn(
                'mb-5 inline-flex h-11 w-11 items-center justify-center',
                'rounded-(--radius-xl) bg-(--color-action-primary-soft) text-(--color-text-accent)',
              )}
            >
              <Icon name={item.icon} className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-(--color-text-secondary)">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
