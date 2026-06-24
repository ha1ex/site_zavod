import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';
import { KaitenLogo as BrandLogo } from '../KaitenLogo';

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
  return <BrandLogo markOnly tone="dark" className="h-5 w-5" />;
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
 * Mock ноутбука (MacBook, flat-white) с канбан-доской Kaiten на экране.
 * Белый безель + петля-подставка с мягкой внешней тенью.
 */
export function LaptopKanbanMock() {
  return (
    <div aria-hidden className="inline-flex flex-col items-center">
      {/* lid */}
      <div
        className={cn(
          'relative h-[480px] w-[760px] overflow-hidden rounded-t-[18px] border-[5px] border-white bg-(--color-surface-card)',
          'shadow-[0_0_44px_-16px_rgba(45,45,45,0.20)]',
        )}
      >
        <KanbanBoard />
        {/* внутренняя тень по рамке */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-t-[13px] shadow-[inset_0_0_6px_0_rgba(0,0,0,0.1)]" />
      </div>

      {/* hinge / base */}
      <div
        className="relative"
        style={{
          width: '880px',
          height: '24px',
          marginTop: '-2px',
          background: '#ffffff',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 30px 44px -14px rgba(45,45,45,0.40), 0 8px 18px -6px rgba(45,45,45,0.18)',
        }}
      >
        <span className="absolute left-1/2 top-0 h-[7px] w-[128px] -translate-x-1/2 rounded-b-[8px] bg-[#e0e0e0]" />
      </div>
    </div>
  );
}
