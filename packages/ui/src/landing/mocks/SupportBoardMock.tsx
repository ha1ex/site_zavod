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
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Заявки</span>
          <span>Очередь</span>
          <span>SLA</span>
          <span>Ответы</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Фильтры
          </span>
        </div>
      </div>

      {/* board */}
      <div className="grid grid-cols-4 gap-2.5 p-4 md:gap-3 md:p-5">
        {COLUMNS.map((col) => (
          <div key={col.name} className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-(--color-text-secondary)">
              <span className="truncate">{col.name}</span>
              <span className="rounded-full bg-(--color-neutral-200) px-1.5 py-0.5 text-[10px] text-(--color-text-primary)">
                {col.count}
              </span>
            </div>
            {col.tickets.map((t, i) => (
              <div
                key={i}
                className={cn(
                  'relative rounded-(--radius-lg) border bg-(--color-surface-page) p-2.5',
                  t.muted
                    ? 'border-(--color-border-default) opacity-60'
                    : 'border-(--color-border-default) shadow-sm',
                  t.lifted && 'translate-y-[-2px] shadow-md',
                )}
              >
                <div className={cn('mb-1.5 h-1 w-8 rounded-full', BAR_CLASS[t.bar])} />
                <div className="text-[11.5px] font-semibold leading-tight text-(--color-text-primary)">
                  {t.title}
                </div>
                <div className="mt-1 truncate text-[10px] text-(--color-text-secondary)">
                  {t.meta}
                </div>
                {(t.badge || t.sla) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {t.badge && (
                      <span
                        className={cn(
                          'inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium leading-none',
                          t.badge === 'Bug'
                            ? 'bg-(--color-red-12) text-(--color-red-100)'
                            : 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
                        )}
                      >
                        {t.badge}
                      </span>
                    )}
                    {t.sla && (
                      <span className="inline-flex h-4 items-center rounded-full bg-(--color-neutral-200) px-1.5 text-[9px] font-medium leading-none text-(--color-text-primary)">
                        {t.sla}
                      </span>
                    )}
                  </div>
                )}
                {t.lifted && (
                  <span className="pointer-events-none absolute -right-2 -bottom-2 text-lg drop-shadow-sm">
                    ☝️
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
