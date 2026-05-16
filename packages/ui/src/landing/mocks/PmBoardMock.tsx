import { cn } from '../../primitives/cn';

interface Card {
  bar: 'violet' | 'orange' | 'blue' | 'green';
  title: string;
  meta: string;
  badge?: string;
  estimate?: string;
  muted?: boolean;
  lifted?: boolean;
}

interface Column {
  name: string;
  count: number;
  cards: Card[];
}

const COLUMNS: Column[] = [
  {
    name: 'Бэклог',
    count: 12,
    cards: [
      { bar: 'blue', title: 'Подключить SSO для команды', meta: 'Эпик · Безопасность', badge: 'Story', estimate: '3 sp' },
      { bar: 'orange', title: 'Импорт задач из Jira', meta: 'Миграция · Q2', muted: true },
    ],
  },
  {
    name: 'В работе',
    count: 4,
    cards: [
      { bar: 'violet', title: 'Дашборд по нагрузке команд', meta: 'Анна Петрова · до 22 мая', badge: 'Эпик', estimate: '8 sp', lifted: true },
      { bar: 'orange', title: 'Связь карточек с документами', meta: 'Илья · в ревью', muted: true },
    ],
  },
  {
    name: 'Ревью',
    count: 3,
    cards: [
      { bar: 'blue', title: 'API webhook для GitLab', meta: '2 ревьюера', badge: 'Story', estimate: '2 sp' },
    ],
  },
  {
    name: 'Готово',
    count: 27,
    cards: [
      { bar: 'green', title: 'Шаблоны досок для HR', meta: 'Закрыта 18 мая', muted: true },
    ],
  },
];

const BAR_CLASS: Record<Card['bar'], string> = {
  violet: 'bg-(--color-action-primary)',
  orange: 'bg-(--color-orange-100)',
  blue: 'bg-(--color-blue-100)',
  green: 'bg-(--color-green-100)',
};

/**
 * Mock канбан-доски проектной команды (PM-ядро): 4 колонки Бэклог → В работе →
 * Ревью → Готово, карточки с типами Эпик/Story, оценками story points и
 * исполнителями. Подсвеченная карточка — «эпик в работе». Используется в
 * MediaCopy variant='pm-board' и Hero visual.variant='pm-board'.
 */
export function PmBoardMock() {
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
          <span className="font-medium text-(--color-text-primary)">Проект · Платформа Q2</span>
          <span>Спринт 12</span>
          <span>46 / 60 sp</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Доска · Бэклог · Дорожная карта
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
            {col.cards.map((c, i) => (
              <div
                key={i}
                className={cn(
                  'relative rounded-(--radius-lg) border bg-(--color-surface-page) p-2.5',
                  c.muted
                    ? 'border-(--color-border-default) opacity-60'
                    : 'border-(--color-border-default) shadow-sm',
                  c.lifted && 'translate-y-[-2px] shadow-md',
                )}
              >
                <div className={cn('mb-1.5 h-1 w-8 rounded-full', BAR_CLASS[c.bar])} />
                <div className="text-[11.5px] font-semibold leading-tight text-(--color-text-primary)">
                  {c.title}
                </div>
                <div className="mt-1 truncate text-[10px] text-(--color-text-secondary)">
                  {c.meta}
                </div>
                {(c.badge || c.estimate) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {c.badge && (
                      <span
                        className={cn(
                          'inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium leading-none',
                          c.badge === 'Эпик'
                            ? 'bg-(--color-action-primary-soft) text-(--color-text-accent)'
                            : 'bg-(--color-blue-12) text-(--color-blue-100)',
                        )}
                      >
                        {c.badge}
                      </span>
                    )}
                    {c.estimate && (
                      <span className="inline-flex h-4 items-center rounded-full bg-(--color-neutral-200) px-1.5 text-[9px] font-medium leading-none text-(--color-text-primary)">
                        {c.estimate}
                      </span>
                    )}
                  </div>
                )}
                {c.lifted && (
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
