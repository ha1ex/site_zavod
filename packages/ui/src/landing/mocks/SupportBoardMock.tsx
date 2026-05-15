import { cn } from '../../primitives/cn';

interface Ticket {
  bar: 'violet' | 'green' | 'orange' | 'blue';
  title: string;
  meta: string;
  badge?: string;
  sla?: string;
  muted?: boolean;
  lifted?: boolean;
}

interface Column {
  name: string;
  count: number;
  tickets: Ticket[];
}

const COLUMNS: Column[] = [
  {
    name: 'Очередь',
    count: 4,
    tickets: [
      { bar: 'violet', title: 'Не приходит код подтверждения', meta: 'Telegram · новый клиент', badge: 'Высокий', sla: '12 мин' },
      { bar: 'green', title: 'Вопрос по тарифу', meta: 'Портал поддержки', muted: true },
    ],
  },
  {
    name: 'В работе',
    count: 3,
    tickets: [
      { bar: 'violet', title: 'Ошибка в личном кабинете', meta: 'Передать в разработку', badge: 'Bug', sla: 'SLA 2ч', lifted: true },
    ],
  },
  {
    name: 'Готовлю ответ',
    count: 2,
    tickets: [
      { bar: 'orange', title: 'Нужен акт сверки', meta: 'Почта · бухгалтерия' },
    ],
  },
  {
    name: 'Закрыто',
    count: 12,
    tickets: [
      { bar: 'green', title: 'Доступ восстановлен', meta: 'Оценка: 5/5', muted: true },
    ],
  },
];

const BAR_CLASS: Record<Ticket['bar'], string> = {
  violet: 'bg-(--color-action-primary)',
  green: 'bg-(--color-green-100)',
  orange: 'bg-(--color-orange-100)',
  blue: 'bg-(--color-blue-100)',
};

/**
 * Детализированный mock канбан-доски службы поддержки: 4 колонки с реальными
 * заявками, метками приоритета и SLA, курсор-указатель на активной карточке.
 * Используется в HeroSection и MediaCopy с variant='support-board'.
 */
export function SupportBoardMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <div className="ml-3 flex items-center gap-4 text-xs text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Заявки</span>
          <span>Очередь</span>
          <span>SLA</span>
          <span>Ответы</span>
          <span className="ml-2 rounded-md border border-(--color-border-default) px-2 py-1">Фильтры</span>
        </div>
      </div>

      {/* board */}
      <div className="grid grid-cols-4 gap-3 p-5 md:gap-4 md:p-6">
        {COLUMNS.map((col) => (
          <div key={col.name} className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-(--color-text-secondary)">
              <span>{col.name}</span>
              <span className="rounded-full bg-(--color-neutral-200) px-2 py-0.5 text-(--color-text-primary)">
                {col.count}
              </span>
            </div>
            {col.tickets.map((t, i) => (
              <div
                key={i}
                className={cn(
                  'relative rounded-(--radius-xl) border bg-(--color-surface-page) p-3',
                  t.muted
                    ? 'border-(--color-border-default) opacity-60'
                    : 'border-(--color-border-default) shadow-sm',
                  t.lifted && 'translate-y-[-2px] shadow-md',
                )}
              >
                <div className={cn('mb-2 h-1.5 w-12 rounded-full', BAR_CLASS[t.bar])} />
                <div className="text-[13px] font-semibold leading-snug text-(--color-text-primary)">
                  {t.title}
                </div>
                <div className="mt-1 text-[11px] text-(--color-text-secondary)">{t.meta}</div>
                {(t.badge || t.sla) && (
                  <div className="mt-2 flex items-center gap-1.5">
                    {t.badge && (
                      <span
                        className={cn(
                          'inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium',
                          t.badge === 'Bug'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
                        )}
                      >
                        {t.badge}
                      </span>
                    )}
                    {t.sla && (
                      <span className="inline-flex h-5 items-center rounded-full bg-(--color-neutral-200) px-2 text-[10px] font-medium text-(--color-text-primary)">
                        {t.sla}
                      </span>
                    )}
                  </div>
                )}
                {t.lifted && (
                  <span className="pointer-events-none absolute -right-4 -bottom-3 text-2xl drop-shadow-sm">☝️</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
