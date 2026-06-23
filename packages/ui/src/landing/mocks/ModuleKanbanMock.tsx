import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

const TONE: Record<'violet' | 'yellow' | 'pink', [string, string]> = {
  violet: ['#efe9f9', '#7d4ccf'],
  yellow: ['#fbf0c9', '#8a6a00'],
  pink: ['#fbe3ec', '#c2185b'],
};

type Card = {
  name: string;
  plain?: boolean;
  banner?: string;
  sub?: string;
  subPlain?: boolean;
  dept?: [string, 'violet' | 'yellow' | 'pink'];
  chips?: string[];
  resume?: boolean;
  brief?: boolean;
  checks?: [string, string][];
  drive?: string;
  avatars?: number;
};

type Col = { title: string; count: number; done?: boolean; cards: Card[] };

const SEARCH_COLS: Col[] = [
  { title: 'Очередь', count: 1, cards: [
    { name: 'Иванова И.', dept: ['Закупки', 'violet'], chips: ['Директор по закупкам'], resume: true, brief: true },
  ]},
  { title: 'Получили резюме', count: 1, cards: [
    { banner: 'Жду свободный слот для назначения собеседования', name: 'Мамина Н.', dept: ['Бэк-офис', 'yellow'], chips: ['Юрист'], resume: true, brief: true, avatars: 1 },
  ]},
  { title: 'Собеседование 1 этап', count: 2, cards: [
    { name: 'Мусин С.', dept: ['Маркетинг', 'pink'], chips: ['13 апр. 14:00', 'Дизайнер'], resume: true, brief: true, avatars: 2 },
    { banner: 'Отправить тестовое', name: 'Контентова М.', dept: ['Маркетинг', 'pink'], chips: ['15 апр. 18:00', 'Контент-маркетолог'], resume: true, brief: true, avatars: 2 },
  ]},
  { title: 'Собеседование 2 этап', count: 2, cards: [
    { name: 'Маркетологова К.', dept: ['Маркетинг', 'pink'], chips: ['15 апр. 13:00', 'Контент-маркетолог'], resume: true, brief: true, avatars: 2 },
    { name: 'Цветков Г.', dept: ['Бэк-офис', 'yellow'], chips: ['13 апр. 15:00', 'Юрист'], resume: true, brief: true, avatars: 2 },
  ]},
  { title: 'Подготовка оффера', count: 1, cards: [
    { name: 'Попов В.', sub: '1/3', dept: ['Разработка', 'yellow'], chips: ['20 апр.', '12 мар.', 'Frontend-разработчик'], resume: true, brief: true, checks: [['Чек-лист', '0/5'], ['Документы для оформления кан…', '0/8']], drive: 'Тестовое', avatars: 2 },
  ]},
];

const ADAPT_COLS: Col[] = [
  { title: 'Очередь', count: 0, cards: [] },
  { title: 'Первая неделя', count: 1, cards: [
    { name: 'Попов В.', plain: true },
    { name: 'Онбординг Попов В.', subPlain: true, dept: ['Разработка', 'yellow'], chips: ['Frontend-разработчик'], resume: true, avatars: 2 },
  ]},
  { title: 'Первый месяц', count: 1, cards: [
    { name: 'Кривова А.Н. (офис-менеджер)', dept: ['Бэк-офис', 'yellow'], checks: [['Оформление', '0/3']], avatars: 1 },
  ]},
  { title: 'Конец испытательного срока', count: 0, cards: [] },
  { title: 'Готово', count: 0, done: true, cards: [] },
];

const BACKLOG: Col = { title: 'Очередь', count: 3, cards: [
  { name: 'Аналитик в отдел маркетинга', plain: true },
  { name: 'Васильчук А. В.', plain: true },
  { name: 'Нужен рассчетный лист', plain: true },
]};

function Tag({ label, tone }: { label: string; tone: 'violet' | 'yellow' | 'pink' }) {
  const t = TONE[tone];
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium" style={{ background: t[0], color: t[1] }}>{label}</span>;
}
function Outline({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-(--color-border-default) bg-(--color-surface-card) px-2 py-0.5 text-[12px] text-(--color-text-primary)">{children}</span>;
}
function Avatars({ n }: { n: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#7b3fd6] text-white">
          <Icon name="User" className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      ))}
    </div>
  );
}
function Resume() {
  return (
    <div className="flex items-center gap-1.5 text-[12px]">
      <span className="relative inline-flex h-3 w-3 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-[#e5484d]" />
        <span className="h-1 w-1 rounded-full bg-[#2f6fed]" />
      </span>
      <span className="font-medium text-(--color-text-primary) underline">Резюме</span>
    </div>
  );
}

function CardView({ c }: { c: Card }) {
  if (c.plain) {
    return <div className="rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-3 text-[14px] text-(--color-text-primary)">{c.name}</div>;
  }
  return (
    <div className="overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) shadow-[0_1px_2px_rgba(45,45,45,0.04)]">
      {c.banner && (
        <div className="flex items-start gap-1.5 bg-[#f23b30] px-3 py-2 text-[12px] font-medium leading-snug text-white">
          <Icon name="Hand" className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          {c.banner}
        </div>
      )}
      <div className="space-y-2 p-3">
        <div className="text-[14px] font-medium text-(--color-text-primary)">{c.name}</div>
        {(c.sub || c.subPlain) && (
          <div className="flex items-center gap-1 text-[12px] text-(--color-text-secondary)">
            <Icon name="Workflow" className="h-3.5 w-3.5" strokeWidth={2} />
            {c.sub}
          </div>
        )}
        {c.dept && <div><Tag label={c.dept[0]} tone={c.dept[1]} /></div>}
        {c.chips && <div className="flex flex-wrap gap-1.5">{c.chips.map((x, i) => <Outline key={i}>{x}</Outline>)}</div>}
        {c.resume && <Resume />}
        {c.brief && <div><span className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium" style={{ background: '#bdebda', color: '#0a6e52' }}>Бриф есть</span></div>}
        {c.checks && (
          <div className="space-y-1 border-t border-(--color-border-default) pt-2">
            {c.checks.map(([label, val], i) => (
              <div key={i} className="flex items-center justify-between text-[12px] text-(--color-text-secondary)">
                <span className="truncate">{label}</span><span className="ml-2 shrink-0">{val}</span>
              </div>
            ))}
          </div>
        )}
        {c.drive && (
          <div className="flex items-center gap-1.5 text-[12px]">
            <span style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '8px solid #1d9e75', display: 'inline-block' }} />
            <span className="text-(--color-text-primary) underline">{c.drive}</span>
          </div>
        )}
        {c.avatars && <Avatars n={c.avatars} />}
      </div>
    </div>
  );
}

function Column({ col, last }: { col: Col; last?: boolean }) {
  return (
    <div className={cn('flex w-[290px] shrink-0 flex-col px-3', !last && 'border-r border-(--color-border-default)')}>
      <div className="mb-3 flex items-center gap-2">
        {col.done && <Icon name="Check" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2.5} />}
        <span className="text-[13px] font-medium text-(--color-text-primary)">{col.title}</span>
        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-(--color-surface-section) px-1.5 text-[12px] font-medium text-(--color-text-secondary)">{col.count}</span>
      </div>
      <div className="space-y-3">{col.cards.map((c, i) => <CardView key={i} c={c} />)}</div>
    </div>
  );
}

function Swimlane({ title, cols }: { title: string; cols: Col[] }) {
  return (
    <div className="rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page)">
      <div className="flex items-center justify-between border-b border-(--color-border-default) px-4 py-2.5">
        <span className="text-[15px] font-semibold text-(--color-text-primary)">{title}</span>
        <Icon name="ChevronUp" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />
      </div>
      <div className="flex py-3">
        {cols.map((col, i) => <Column key={col.title} col={col} last={i === cols.length - 1} />)}
      </div>
    </div>
  );
}

/**
 * Mock HR-канбана Kaiten: бэклог «Все заявки», дорожка «Поиск новых сотрудников»
 * (5 колонок воронки найма с карточками-кандидатами, метками, действиями,
 * чек-листами) и дорожка «Адаптация новых сотрудников».
 */
export function HiringKanbanMock() {
  return (
    <div aria-hidden className="flex gap-4 rounded-2xl bg-(--color-surface-section) p-4" style={{ minWidth: '1880px' }}>
      {/* backlog */}
      <div className="w-[300px] shrink-0 self-start rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page)">
        <div className="flex items-center justify-between border-b border-(--color-border-default) px-4 py-2.5">
          <span className="text-[15px] font-semibold text-(--color-text-primary)">Все заявки</span>
          <Icon name="ChevronUp" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />
        </div>
        <div className="py-3"><Column col={BACKLOG} last /></div>
      </div>

      {/* swimlanes */}
      <div className="flex flex-1 flex-col gap-4">
        <Swimlane title="Поиск новых сотрудников" cols={SEARCH_COLS} />
        <Swimlane title="Адаптация новых сотрудников" cols={ADAPT_COLS} />
      </div>
    </div>
  );
}
