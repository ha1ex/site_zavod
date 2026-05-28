import { ButtonLink } from '../primitives/ButtonLink';
import { Icon } from '../primitives/Icon';
import { Inspect } from '../primitives/Inspect';
import { cn } from '../primitives/cn';
import { MockVisual, type MockVariant } from './mocks';

export interface MediaCopyCheckItemProps {
  icon?: string;
  text: string;
}

export interface MediaCopyCtaProps {
  label: string;
  href: string;
}

export type MediaCopyVariant = 'default' | MockVariant;

export interface MediaCopyProps {
  eyebrow?: string;
  title: string;
  description?: string;
  checklist?: MediaCopyCheckItemProps[];
  mediaPosition?: 'left' | 'right';
  mediaPlaceholder?: string;
  mediaVariant?: MediaCopyVariant;
  primaryCta?: MediaCopyCtaProps;
  secondaryCta?: MediaCopyCtaProps | null;
  /**
   * Reference to an auto-generated unique SVG illustration (P8 phase).
   * Currently passed through but not rendered (M4 full integration upcoming).
   */
  customIllustrationId?: string;
}

/**
 * MediaCopy — флагманский Kaiten-блок: текст с чек-листом + большой mock
 * продуктового UI. Используется 3-5 раз на странице (knowledge-base, docs,
 * home). Mock-plaholder — это window-chrome с условной фейковой UI.
 */
export function MediaCopy({
  eyebrow,
  title,
  description,
  checklist,
  mediaPosition = 'right',
  mediaPlaceholder = 'product UI',
  mediaVariant = 'default',
  primaryCta,
  secondaryCta,
}: MediaCopyProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten)',
        'px-4 py-12 md:px-6 lg:py-20',
      )}
    >
      <div
        className={cn(
          'grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center',
          mediaPosition === 'left' && 'lg:[&>div:first-child]:order-2',
        )}
      >
        <div>
          {eyebrow && (
            <p
              data-comp="media_copy.eyebrow"
              className="mb-3 text-sm font-medium uppercase tracking-wide text-(--color-text-accent)"
            >
              {eyebrow}
            </p>
          )}
          <h2
            data-comp="media_copy.title"
            className="text-3xl font-semibold leading-tight md:text-4xl"
          >
            {title}
          </h2>
          {description && (
            <p
              data-comp="media_copy.description"
              className="mt-4 text-lg leading-relaxed text-(--color-text-secondary)"
            >
              {description}
            </p>
          )}

          {checklist && checklist.length > 0 && (
            <ul className="mt-6 space-y-3">
              {checklist.map((item, i) => (
                <Inspect
                  as="li"
                  key={i}
                  name={`media_copy.checklist[${i}]`}
                  className="flex items-start gap-3"
                >
                  <span
                    className={cn(
                      'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                      'bg-(--color-action-primary-soft) text-(--color-text-accent)',
                    )}
                  >
                    <Icon name={item.icon ?? 'Check'} className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span
                    data-comp={`media_copy.checklist[${i}].text`}
                    className="text-base leading-relaxed text-(--color-text-primary)"
                  >
                    {item.text}
                  </span>
                </Inspect>
              ))}
            </ul>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCta && (
                <Inspect name="media_copy.primaryCta">
                  <ButtonLink size="lg" href={primaryCta.href}>
                    {primaryCta.label}
                  </ButtonLink>
                </Inspect>
              )}
              {secondaryCta && (
                <Inspect name="media_copy.secondaryCta">
                  <ButtonLink variant="outline" size="lg" href={secondaryCta.href}>
                    {secondaryCta.label}
                  </ButtonLink>
                </Inspect>
              )}
            </div>
          )}
        </div>

        <Inspect as="div" name="media_copy.media">
          <MediaCopyVisual variant={mediaVariant} placeholder={mediaPlaceholder} />
        </Inspect>
      </div>
    </section>
  );
}

function MediaCopyVisual({
  variant,
  placeholder,
}: {
  variant: MediaCopyVariant;
  placeholder: string;
}) {
  if (variant === 'default') return <ProductMock label={placeholder} />;
  const rendered = <MockVisual variant={variant} />;
  return rendered ?? <ProductMock label={placeholder} />;
}

interface ProductMockProps {
  label: string;
}

function ProductMock({ label }: ProductMockProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)]',
      )}
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-4 truncate text-xs text-(--color-text-secondary)">{label}</span>
      </div>

      {/* faux app body */}
      <div className="grid grid-cols-[140px_1fr] gap-4 p-4 md:p-6">
        {/* sidebar */}
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded-full bg-(--color-action-primary-soft)" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-2.5 w-full rounded-full bg-(--color-neutral-200)" />
          ))}
        </div>

        {/* content */}
        <div className="space-y-3">
          <div className="h-4 w-1/2 rounded-full bg-(--color-neutral-200)" />
          <div className="space-y-2 rounded-(--radius-xl) border border-(--color-border-default) p-4">
            <div className="h-3 w-2/3 rounded-full bg-(--color-action-primary)" />
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-(--color-neutral-200)" />
              <div className="h-2 w-5/6 rounded-full bg-(--color-neutral-200)" />
              <div className="h-2 w-3/4 rounded-full bg-(--color-neutral-200)" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-(--radius-xl) border border-(--color-border-default)',
                  'p-3 space-y-1.5',
                )}
              >
                <div
                  className={cn(
                    'h-2 w-2/3 rounded-full',
                    i === 0 ? 'bg-(--color-blue-100)' : 'bg-(--color-green-100)',
                  )}
                />
                <div className="h-2 w-full rounded-full bg-(--color-neutral-200)" />
                <div className="h-2 w-3/4 rounded-full bg-(--color-neutral-200)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
