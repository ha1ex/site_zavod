import { cn } from '../primitives/cn';

export interface BenefitsStripProps {
  items: string[];
}

/**
 * Узкая полоса под hero с короткими маркетинговыми пунктами через разделители.
 * Из референса: «Российский сервис · Настройка за 30 минут · Шаблонные ответы · Аналитика и SLA».
 */
export function BenefitsStrip({ items }: BenefitsStripProps) {
  return (
    <section className="border-y border-(--color-border-default) bg-(--color-surface-section)/50">
      <div
        className={cn(
          'mx-auto w-full max-w-(--container-kaiten)',
          'flex flex-wrap items-center justify-center gap-x-8 gap-y-2',
          'px-4 py-4 md:px-6',
        )}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-sm font-medium text-(--color-text-secondary)"
          >
            {item}
            {i < items.length - 1 && (
              <span className="h-1 w-1 rounded-full bg-(--color-neutral-400)" aria-hidden />
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
