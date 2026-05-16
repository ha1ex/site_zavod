import { cn } from '../../primitives/cn';

interface KbVariantProps {
  variant: 'public' | 'internal';
}

const PUBLIC_TITLE = 'Как восстановить доступ';
const PUBLIC_META = 'Пошаговая инструкция для клиентов';
const INTERNAL_TITLE = 'Скрипт ответа на инцидент';
const INTERNAL_META = 'Регламент для L1 и L2';

/**
 * Карточка-документ для блока «База знаний». Имитирует превью статьи в КБ.
 */
export function KnowledgeBaseMock({ variant }: KbVariantProps) {
  const isPublic = variant === 'public';
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_24px_60px_-30px_rgba(125,76,207,0.25)] p-6 md:p-7',
      )}
    >
      {/* sidebar + doc */}
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <div className="space-y-2">
          <div className={cn('h-2.5 w-3/4 rounded-full', isPublic ? 'bg-(--color-action-primary-soft)' : 'bg-(--color-blue-12)')} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-2 w-full rounded-full bg-(--color-neutral-200)" />
          ))}
        </div>

        <div className="rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-4 md:p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xl">{isPublic ? '📌' : '🧑‍💻'}</span>
            <span
              className={cn(
                'inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium',
                isPublic
                  ? 'bg-(--color-action-primary-soft) text-(--color-text-accent)'
                  : 'bg-(--color-blue-12) text-(--color-blue-100)',
              )}
            >
              {isPublic ? 'Опубликовано' : 'Только команда'}
            </span>
          </div>
          <h4 className="text-base font-semibold text-(--color-text-primary)">
            {isPublic ? PUBLIC_TITLE : INTERNAL_TITLE}
          </h4>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            {isPublic ? PUBLIC_META : INTERNAL_META}
          </p>
          <div className="mt-4 space-y-1.5">
            <div className="h-2 w-full rounded-full bg-(--color-neutral-200)" />
            <div className="h-2 w-5/6 rounded-full bg-(--color-neutral-200)" />
            <div className="h-2 w-4/6 rounded-full bg-(--color-neutral-200)" />
          </div>
        </div>
      </div>
    </div>
  );
}
