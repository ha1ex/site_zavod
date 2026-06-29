import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

const LABEL_CLASS: Record<'violet' | 'blue' | 'green' | 'orange' | 'teal', string> = {
  violet: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  blue: 'bg-(--color-blue-12) text-(--color-blue-100)',
  green: 'bg-(--color-green-12) text-green-700',
  orange: 'bg-(--color-orange-12) text-amber-800',
  teal: 'bg-[#e1f5ee] text-[#0f6e56]',
};

type Card = {
  title: string;
  label: string;
  tone: keyof typeof LABEL_CLASS;
  who: string;
  check?: string;
  done?: boolean;
};

const COLUMNS: { title: string; count: number; cards: Card[] }[] = [
  {
    title: 'Очередь',
    count: 2,
    cards: [
      { title: 'Утвердить бюджет на Q3', label: 'Финансы', tone: 'teal', who: 'ГД' },
      { title: 'План найма на полугодие', label: 'HR', tone: 'violet', who: 'HR' },
    ],
  },
  {
    title: 'В работе',
    count: 2,
    cards: [
      { title: 'Стратегия развития цеха', label: 'Стратегия', tone: 'blue', who: 'ГД', check: '2/4' },
      { title: 'Ревизия поставщиков', label: 'Закупки', tone: 'orange', who: 'ОС', check: '1/3' },
    ],
  },
  {
    title: 'Готово',
    count: 2,
    cards: [
      { title: 'Отчёт по KPI за месяц', label: 'Отчёт', tone: 'blue', who: 'АН', done: true },
      { title: 'Совет директоров', label: 'Встреча', tone: 'teal', who: 'ГД', done: true },
    ],
  },
];

const COLUMNS2: { title: string; count: number; cards: Card[] }[] = [
  {
    title: 'Новые',
    count: 2,
    cards: [
      { title: 'Оплатить счёт поставщику', label: 'Счёт', tone: 'teal', who: 'БУ' },
      { title: 'Акт сверки с подрядчиком', label: 'Сверка', tone: 'violet', who: 'БУ' },
    ],
  },
  {
    title: 'На согласовании',
    count: 1,
    cards: [
      { title: 'Согласовать платёжку №56', label: 'Платёж', tone: 'orange', who: 'ФД', check: '1/2' },
    ],
  },
  {
    title: 'Закрыто',
    count: 1,
    cards: [
      { title: 'Закрытие месяца', label: 'Отчётность', tone: 'blue', who: 'ГБ', done: true },
    ],
  },
];

type TreeNode = { d: number; ex?: 'open' | 'closed'; emoji: string; label: string; active?: boolean };

const TREE: TreeNode[] = [
  { d: 0, ex: 'open', emoji: '📁', label: 'Производство' },
  { d: 1, ex: 'open', emoji: '🔧', label: 'Производство и цех' },
  { d: 2, emoji: '📋', label: 'Сменное задание' },
  { d: 2, emoji: '📋', label: 'Брак и простои' },
  { d: 1, ex: 'closed', emoji: '📦', label: 'Снабжение и логистика' },
  { d: 1, ex: 'open', emoji: '📐', label: 'Технологи и инженеры' },
  { d: 2, emoji: '📋', label: 'Оснастка' },
  { d: 2, emoji: '📋', label: 'Чертежи и ТД' },
  { d: 1, emoji: '✅', label: 'ОТК' },
  { d: 1, ex: 'closed', emoji: '💼', label: 'Руководство', active: true },
  { d: 1, emoji: '📊', label: 'Бухгалтерия и финансы' },
  { d: 1, ex: 'closed', emoji: '🧮', label: 'Проектный офис' },
  { d: 1, emoji: '🛠️', label: 'Сервис и ремонт' },
  { d: 1, ex: 'open', emoji: '🧪', label: 'Лаборатория' },
  { d: 2, emoji: '📋', label: 'Испытания и замеры' },
  { d: 1, emoji: '🚚', label: 'Транспортный цех' },
  { d: 1, emoji: '🦺', label: 'Охрана труда' },
  { d: 1, ex: 'closed', emoji: '🗄️', label: 'Архив' },
];

/** Фирменный знак Kaiten (точный SVG): красный сквиркл, мятный ромб, фиолетовый круг. */
function KaitenMark() {
  return (
    <span className="relative inline-flex h-4 w-4 items-center justify-center">
      <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <g clipPath="url(#kaitenBtMarkClip)">
          <path d="M76.8113 0H27.1887C12.1728 0 0 12.1661 0 27.1738V76.8262C0 91.8339 12.1728 104 27.1887 104H76.8113C91.8272 104 104 91.8339 104 76.8262V27.1738C104 12.1661 91.8272 0 76.8113 0Z" fill="#F11F24" />
          <path d="M41.4148 11.3364L11.3364 41.4148C5.55453 47.1967 5.55453 56.571 11.3364 62.3529L41.4148 92.4313C47.1967 98.2132 56.571 98.2132 62.3529 92.4313L92.4313 62.3529C98.2132 56.571 98.2132 47.1967 92.4313 41.4148L62.3529 11.3364C56.571 5.55453 47.1967 5.55453 41.4148 11.3364Z" fill="#78FFC7" />
          <path d="M51.715 77.4267C65.917 77.4267 77.43 65.9144 77.43 51.7133C77.43 37.5123 65.917 26 51.715 26C37.513 26 26 37.5123 26 51.7133C26 65.9144 37.513 77.4267 51.715 77.4267Z" fill="#7D4CCF" />
        </g>
        <defs><clipPath id="kaitenBtMarkClip"><rect width="104" height="104" rx="52" fill="white" /></clipPath></defs>
      </svg>
    </span>
  );
}

function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--color-action-primary-soft) text-[9px] font-semibold text-(--color-text-accent)">
      {children}
    </span>
  );
}

/** Канбан-доска слева: единая серая панель с колонками и вертикальными разделителями. */
function BoardSection({ title, subtitle, columns }: { title: string; subtitle: string; columns: { title: string; count: number; cards: Card[] }[] }) {
  return (
    <div className="shrink-0">
      <div className="flex items-center gap-2 border-b border-(--color-border-default) px-3 py-2">
        <span className="text-[13px] font-semibold text-(--color-text-primary)">{title}</span>
        <span className="text-[11px] text-(--color-text-secondary)">{subtitle}</span>
      </div>
      <div className="flex items-start gap-2 overflow-hidden p-2">
      {columns.flatMap((col, idx) => {
        const column = (
          <div key={col.title} className="flex flex-1 flex-col rounded-(--radius-lg) bg-(--color-surface-section) px-1.5">
            <div className="mb-2 flex items-center gap-1.5 px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">{col.title}</span>
              <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-border-default) px-1 text-[10px] font-semibold text-(--color-text-secondary)">
                {col.count}
              </span>
            </div>
            <div className="space-y-2">
              {col.cards.map((c, i) => (
                <div key={i} className="space-y-1 rounded-(--radius-lg) border border-[#ededed] bg-(--color-surface-card) px-2.5 py-1.5">
                  <span className={cn('inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium', LABEL_CLASS[c.tone])}>
                    {c.label}
                  </span>
                  <div className="text-[12px] font-medium leading-snug text-(--color-text-primary)">{c.title}</div>
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
  );
}

/** Развёрнутое дерево пространств (папки + вложенность, эмодзи-иконки), поиск сверху. */
function DeptTree() {
  return (
    <div className="w-[196px] shrink-0 overflow-hidden border-r border-(--color-border-default) bg-(--color-surface-section) px-2 py-2.5">
      {/* search */}
      <div className="mb-2 flex items-center gap-2 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-2.5 py-1.5">
        <span className="text-[11px] leading-none">🔍</span>
        <span className="text-[11px] text-(--color-text-secondary)">Найти..</span>
      </div>
      {/* tree */}
      <div className="space-y-0.5">
        {TREE.map((t, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-1 rounded-md py-0.5 pr-2 text-[11px] text-(--color-text-primary)',
              t.active && 'bg-(--color-action-primary-soft) font-medium',
            )}
            style={{ paddingLeft: `${4 + t.d * 12}px` }}
          >
            <span className="w-2.5 shrink-0 text-center text-[8px] text-(--color-text-secondary)">
              {t.ex === 'open' ? '▾' : t.ex === 'closed' ? '▸' : ''}
            </span>
            <span className="shrink-0 text-[11px] leading-none">{t.emoji}</span>
            <span className="flex-1 truncate">{t.label}</span>
            {t.active && (
              <span className="shrink-0 text-[11px] leading-none text-(--color-text-secondary)">+ ⋯</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Экран: топбар + канбан-доска слева и развёрнутое дерево разделов справа. */
function BoardTreeScreen() {
  return (
    <div className="flex h-full flex-col bg-(--color-surface-page)">
      {/* top bar */}
      <div className="flex items-center gap-2 border-b border-(--color-border-default) px-4 py-2.5">
        <KaitenMark />
        <span className="text-[13px] font-semibold text-(--color-text-primary)">Kaiten</span>
        <span className="h-3.5 w-px bg-(--color-border-default)" />
        <span className="text-[12px] text-(--color-text-secondary)">Производственный контур · Цех №1</span>
      </div>

      {/* body: board left, tree right */}
      <div className="flex flex-1 overflow-hidden">
        <DeptTree />
        <div className="flex flex-1 flex-col overflow-hidden bg-(--color-surface-section)">
          <BoardSection title="Руководство" subtitle="· Цех №1" columns={COLUMNS} />
          <div className="h-px shrink-0 bg-(--color-border-default)" />
          <BoardSection title="Бухгалтерия и финансы" subtitle="· Цех №1" columns={COLUMNS2} />
        </div>
      </div>
    </div>
  );
}

/**
 * Mock ноутбука (MacBook, flat-white): слева канбан-доска производства,
 * справа развёрнутое дерево разделов (цех, снабжение, технологи, ОТК,
 * руководство, бухгалтерия, проектный офис). Карточки по производственным
 * темам, без красных акцентов.
 */
export function LaptopBoardTreeMock() {
  return (
    <div aria-hidden className="inline-flex flex-col items-center">
      {/* lid */}
      <div
        className={cn(
          'relative h-[480px] w-[760px] overflow-hidden rounded-t-[18px] border-[5px] border-white bg-(--color-surface-card)',
          'shadow-[0_0_44px_-16px_rgba(45,45,45,0.20)]',
        )}
      >
        <BoardTreeScreen />
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
