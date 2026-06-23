import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

const LABEL_CLASS: Record<'violet' | 'blue' | 'green' | 'orange', string> = {
  violet: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  blue: 'bg-(--color-blue-12) text-(--color-blue-100)',
  green: 'bg-(--color-green-12) text-green-700',
  orange: 'bg-(--color-orange-12) text-amber-800',
};

type Card = {
  title: string;
  label: string;
  tone: 'violet' | 'blue' | 'green' | 'orange';
  who: string;
  check?: string;
  done?: boolean;
};

const COLUMNS: { title: string; count: number; cards: Card[] }[] = [
  {
    title: 'Очередь',
    count: 3,
    cards: [
      { title: 'Свёрстать лендинг для рассылки', label: 'Дизайн', tone: 'violet', who: 'АК' },
      { title: 'Подключить продуктовую аналитику', label: 'Аналитика', tone: 'blue', who: 'ИЛ' },
      { title: 'Тексты для онбординг-писем', label: 'Контент', tone: 'green', who: 'МС' },
    ],
  },
  {
    title: 'В работе',
    count: 2,
    cards: [
      { title: 'Интеграция с CRM amoCRM', label: 'Backend', tone: 'orange', who: 'МС', check: '3/5' },
      { title: 'Сценарий онбординга клиентов', label: 'Product', tone: 'violet', who: 'АС', check: '2/4' },
    ],
  },
  {
    title: 'Готово',
    count: 2,
    cards: [
      { title: 'Релиз мобильного приложения', label: 'Mobile', tone: 'green', who: 'ДВ', done: true },
      { title: 'A/B-тест главной страницы', label: 'Аналитика', tone: 'blue', who: 'АК', done: true },
    ],
  },
];

const RAIL = ['LayoutGrid', 'Calendar', 'FileText', 'ChartBar', 'Users', 'Settings'];

function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--color-action-primary-soft) text-[9px] font-semibold text-(--color-text-accent)">
      {children}
    </span>
  );
}

/** Фирменный знак Kaiten: красный круг, мятный повёрнутый ромб, фиолетовый круг. */
function KaitenMark() {
  return (
    <span className="relative inline-flex h-5 w-5 items-center justify-center">
      <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><g clipPath="url(#kaitenMarkClip)"><path d="M76.8113 0H27.1887C12.1728 0 0 12.1661 0 27.1738V76.8262C0 91.8339 12.1728 104 27.1887 104H76.8113C91.8272 104 104 91.8339 104 76.8262V27.1738C104 12.1661 91.8272 0 76.8113 0Z" fill="#F11F24"/><path d="M41.4148 11.3364L11.3364 41.4148C5.55453 47.1967 5.55453 56.571 11.3364 62.3529L41.4148 92.4313C47.1967 98.2132 56.571 98.2132 62.3529 92.4313L92.4313 62.3529C98.2132 56.571 98.2132 47.1967 92.4313 41.4148L62.3529 11.3364C56.571 5.55453 47.1967 5.55453 41.4148 11.3364Z" fill="#78FFC7"/><path d="M51.715 77.4267C65.917 77.4267 77.43 65.9144 77.43 51.7133C77.43 37.5123 65.917 26 51.715 26C37.513 26 26 37.5123 26 51.7133C26 65.9144 37.513 77.4267 51.715 77.4267Z" fill="#7D4CCF"/></g><defs><clipPath id="kaitenMarkClip"><rect width="104" height="104" rx="52" fill="white"/></clipPath></defs></svg>
    </span>
  );
}

/** Канбан-доска Kaiten: топбар, сайдбар с иконками, три колонки с карточками. */
function KanbanBoard() {
  return (
    <div className="flex h-full flex-col bg-(--color-surface-page)">
      {/* top bar */}
      <div className="flex items-center gap-2 border-b border-(--color-border-default) px-4 py-2.5">
        <KaitenMark />
        <span className="text-[13px] font-semibold text-(--color-text-primary)">Разработка</span>
        <span className="text-[12px] text-(--color-text-secondary)">/ Спринт 24</span>
      </div>

      {/* body */}
      <div className="flex flex-1 overflow-hidden">
        {/* rail */}
        <div className="flex w-12 flex-col items-center gap-3 border-r border-(--color-border-default) bg-(--color-surface-section) py-3">
          {RAIL.map((n, i) => (
            <span
              key={n}
              className={cn(
                'inline-flex h-7 w-7 items-center justify-center rounded-lg',
                i === 0 ? 'bg-(--color-action-primary-soft) text-(--color-text-accent)' : 'text-(--color-text-secondary)',
              )}
            >
              <Icon name={n} className="h-4 w-4" strokeWidth={2} />
            </span>
          ))}
        </div>

        {/* columns (единая серая панель с вертикальными разделителями) */}
        <div className="flex flex-1 items-start gap-2 overflow-hidden bg-(--color-surface-section) p-2">
          {COLUMNS.flatMap((col, idx) => {
            const column = (
              <div key={col.title} className="flex flex-1 flex-col rounded-(--radius-lg) bg-(--color-surface-section) px-1.5">
                <div className="mb-2 flex items-center gap-1.5 px-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">
                    {col.title}
                  </span>
                  <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-border-default) px-1 text-[10px] font-semibold text-(--color-text-secondary)">
                    {col.count}
                  </span>
                </div>
                <div className="space-y-2">
                  {col.cards.map((c, i) => (
                    <div
                      key={i}
                      className="space-y-2 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2.5"
                    >
                      <span className={cn('inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium', LABEL_CLASS[c.tone])}>
                        {c.label}
                      </span>
                      <div className="text-[12px] font-medium leading-snug text-(--color-text-primary)">
                        {c.title}
                      </div>
                      <div className="flex items-center justify-between">
                        <Avatar>{c.who}</Avatar>
                        {c.done ? (
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-green-700">
                            <Icon name="Check" className="h-3 w-3" strokeWidth={2.5} />
                            Готово
                          </span>
                        ) : c.check ? (
                          <span className="inline-flex items-center gap-1 text-[9.5px] text-(--color-text-secondary)">
                            <Icon name="SquareCheck" className="h-3 w-3" strokeWidth={2} />
                            {c.check}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9.5px] text-(--color-text-secondary)">
                            <Icon name="Calendar" className="h-3 w-3" strokeWidth={2} />
                            12 авг
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
            return idx === 0
              ? [column]
              : [<div key={`${col.title}-divider`} className="w-px self-stretch bg-(--color-border-default)" />, column];
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Mock планшета (iPad, альбомная ориентация, flat-white) с канбан-доской Kaiten.
 * Ровный тонкий белый безель, фронтальная камера, мягкая внешняя и внутренняя тень.
 */
export function TabletKanbanMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative h-[480px] w-[720px] overflow-hidden rounded-[28px] border-[8px] border-white bg-(--color-surface-card)',
        'shadow-[0_0_44px_-16px_rgba(45,45,45,0.20)]',
      )}
    >
      {/* front camera */}
      <span className="absolute left-1/2 top-1 z-30 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-(--color-border-default)" />
      <KanbanBoard />
      {/* внутренняя тень по рамке */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[14px] shadow-[inset_0_0_6px_0_rgba(0,0,0,0.1)]" />
    </div>
  );
}
