import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';
import { Icon } from '../primitives/Icon';

export interface BentoCellProps {
  icon?: string;
  title: string;
  description: string;
  /** Размер ячейки: 1x1 (small), 2x1 (wide), 1x2 (tall), 2x2 (large). */
  size?: 'small' | 'wide' | 'tall' | 'large';
  accent?: boolean;
}

export interface BentoGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  cells: BentoCellProps[];
}

const SIZE_CLASS: Record<NonNullable<BentoCellProps['size']>, string> = {
  small: 'md:col-span-1 md:row-span-1',
  wide: 'md:col-span-2 md:row-span-1',
  tall: 'md:col-span-1 md:row-span-2',
  large: 'md:col-span-2 md:row-span-2',
};

/**
 * Bento-grid: 6-9 ячеек разного размера для feature overview платформы.
 * Заменяет однотонный FeatureGrid когда нужна визуальная иерархия
 * (одна крупная фича + 5 поддерживающих).
 */
export function BentoGrid({ eyebrow, title, description, cells }: BentoGridProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-16 md:px-6 lg:py-20',
      )}
    >
      <div className="mb-10 max-w-2xl">
        {eyebrow && (
          <p
            data-comp="bento_grid.eyebrow"
            className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)"
          >
            {eyebrow}
          </p>
        )}
        <h2
          data-comp="bento_grid.title"
          className="text-3xl font-semibold leading-tight md:text-4xl"
        >
          {title}
        </h2>
        {description && (
          <p
            data-comp="bento_grid.description"
            className="mt-4 text-lg text-(--color-text-secondary)"
          >
            {description}
          </p>
        )}
      </div>

      <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {cells.map((c, i) => (
          <Inspect
            as="div"
            key={i}
            name={`bento_grid.cells[${i}]`}
            className={cn(
              'flex flex-col rounded-(--radius-2xl) border p-6',
              SIZE_CLASS[c.size ?? 'small'],
              c.accent
                ? 'border-(--color-action-primary)/40 bg-(--color-action-primary-soft)'
                : 'border-(--color-border-default) bg-(--color-surface-card)',
            )}
          >
            {c.icon && (
              <span
                aria-hidden
                className={cn(
                  'mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-(--radius-xl)',
                  c.accent
                    ? 'bg-(--color-surface-card) text-(--color-text-accent)'
                    : 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
                )}
              >
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
            )}
            <h3
              data-comp={`bento_grid.cells[${i}].title`}
              className={cn(
                'text-lg font-semibold',
                c.accent ? 'text-(--color-text-accent)' : 'text-(--color-text-primary)',
              )}
            >
              {c.title}
            </h3>
            <p
              data-comp={`bento_grid.cells[${i}].description`}
              className="mt-2 text-sm text-(--color-text-secondary)"
            >
              {c.description}
            </p>
          </Inspect>
        ))}
      </div>
    </section>
  );
}
