import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

type TagTone = 'violet' | 'blue' | 'pink' | 'gray' | 'green' | 'teal';
const TAG: Record<TagTone, [string, string]> = {
  violet: ['#efe9f9', '#7d4ccf'],
  blue: ['#e7eefc', '#2f6fed'],
  pink: ['#fbe3ec', '#c2185b'],
  gray: ['#ececee', '#5f5e5a'],
  green: ['#e6f5ea', '#2e7d32'],
  teal: ['#dceef2', '#0e7490'],
};

type DateTone = 'green' | 'red' | 'orange';
const DATE: Record<DateTone, [string, string]> = {
  green: ['#e9f5ea', '#4caf51'],
  red: ['#fde8e6', '#f44336'],
  orange: ['#fff3e0', '#ef9f27'],
};

type Card = {
  title: string;
  price?: string;
  tags?: [string, TagTone][];
  av: [string, string];
  date: [string, DateTone];
};
type Col = { title: string; count: number; cards: Card[] };

const COLS: Col[] = [
  { title: 'Первичный контакт', count: 2, cards: [
    { title: 'Первичный контакт — как работать', av: ['Б', '#f5722f'], date: ['3 июн.', 'green'] },
    { title: 'ООО «ТехноПоток» — внедрение CRM', price: '127 000 ₽', av: ['П', '#7d4ccf'], date: ['5 июн.', 'red'] },
  ]},
  { title: 'Обсуждение предложения', count: 1, cards: [
    { title: 'Сделка: Ритейл Групп — тариф Бизнес 15 users', price: '127 000 ₽', tags: [['Горячий лид', 'violet'], ['Ритейл', 'blue']], av: ['В', '#7d4ccf'], date: ['9 июн.', 'orange'] },
  ]},
  { title: 'Принимают решение', count: 3, cards: [
    { title: 'Принимают решение — как работать', av: ['И', '#4caf51'], date: ['2 июн.', 'green'] },
    { title: 'Сделка: Технологии Будущего — корп. лицензия 50 users', price: '127 000 ₽', tags: [['IT', 'gray'], ['Крупный клиент', 'pink']], av: ['Г', '#2f6fed'], date: ['11 июн.', 'red'] },
    { title: 'Сделка: МедиаСфера — пакет Pro 30 users', price: '98 000 ₽', tags: [['Медиа', 'pink'], ['Тёплый лид', 'teal']], av: ['Л', '#1d9e75'], date: ['14 июн.', 'orange'] },
  ]},
  { title: 'Подписывают договор', count: 3, cards: [
    { title: 'Подписывают договор — как работать', av: ['Р', '#7d4ccf'], date: ['6 июн.', 'green'] },
    { title: 'Сделка: ГринлайтЛоджистик — годовой контракт', price: '210 000 ₽', tags: [['Логистика', 'violet'], ['Договор', 'pink']], av: ['Д', '#4caf51'], date: ['18 июн.', 'red'] },
    { title: 'Сделка: АльфаСтрой — 25 users', price: '127 000 ₽', tags: [['Стройка', 'violet'], ['Тёплый лид', 'teal']], av: ['Т', '#e0306e'], date: ['21 июн.', 'green'] },
  ]},
  { title: 'Оплата получена', count: 4, cards: [
    { title: 'Сделка: Эконива — оплачено', av: ['Т', '#4caf51'], date: ['1 июн.', 'green'] },
    { title: 'Сделка: ФинГрупп — оплачено', price: '127 000 ₽', tags: [['Оплачено', 'green'], ['Финансы', 'blue']], av: ['Ю', '#3b5bdb'], date: ['24 июн.', 'orange'] },
    { title: 'Сделка: ЭкоТрейд — продление лицензии', price: '89 000 ₽', tags: [['Продление', 'violet'], ['Тёплый', 'teal']], av: ['Е', '#3b5bdb'], date: ['27 июн.', 'green'] },
    { title: 'Сделка: НордТех — расширение до 40 users', price: '156 000 ₽', tags: [['Апсейл', 'violet'], ['IT', 'gray']], av: ['К', '#f5392f'], date: ['30 июн.', 'red'] },
  ]},
];

function Tag({ label, tone }: { label: string; tone: TagTone }) {
  const t = TAG[tone];
  return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium" style={{ background: t[0], color: t[1] }}>{label}</span>;
}
function DateChip({ value, tone }: { value: string; tone: DateTone }) {
  const t = DATE[tone];
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px]" style={{ background: t[0], color: t[1] }}>
      <Icon name="Calendar" className="h-3.5 w-3.5" strokeWidth={2} />
      <span style={{ color: '#444' }}>{value}</span>
    </span>
  );
}
function Avatar({ letter, color }: { letter: string; color: string }) {
  return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ background: color }}>{letter}</span>;
}

function CardView({ c }: { c: Card }) {
  return (
    <div className="space-y-3 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-3.5 shadow-[0_1px_2px_rgba(45,45,45,0.05)]">
      <div className="text-[15px] font-medium leading-snug text-(--color-text-primary)">{c.title}</div>
      {c.price && <div className="text-[15px] text-(--color-text-primary)">{c.price}</div>}
      {c.tags && <div className="flex flex-wrap gap-2">{c.tags.map(([l, t], i) => <Tag key={i} label={l} tone={t} />)}</div>}
      <div className="flex items-center justify-between pt-0.5">
        <Avatar letter={c.av[0]} color={c.av[1]} />
        <DateChip value={c.date[0]} tone={c.date[1]} />
      </div>
    </div>
  );
}

function Column({ col, last }: { col: Col; last?: boolean }) {
  return (
    <div className={cn('flex w-[300px] shrink-0 flex-col px-4', !last && 'border-r border-(--color-border-default)')}>
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="text-[15px] font-medium text-(--color-text-primary)">{col.title}</span>
        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-(--color-border-default) px-1.5 text-[12px] font-medium text-(--color-text-secondary)">{col.count}</span>
      </div>
      <div className="space-y-3">{col.cards.map((c, i) => <CardView key={i} c={c} />)}</div>
    </div>
  );
}

/**
 * Mock CRM-воронки Kaiten: дорожка «Воронка продаж (CRM)» с 5 колонками
 * (Первичный контакт → Обсуждение → Принимают решение → Подписывают договор →
 * Оплата получена) и карточками-сделками: сумма, теги, аватар, дата-чип.
 */
export function ModuleCrmMock() {
  return (
    <div aria-hidden className="w-max rounded-2xl bg-(--color-surface-section) p-4">
      <div className="mb-4 flex items-center gap-2 px-1">
        <Icon name="GripVertical" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />
        <span className="text-[16px] font-semibold text-(--color-text-primary)">Воронка продаж (CRM)</span>
      </div>
      <div className="flex">
        {COLS.map((col, i) => <Column key={col.title} col={col} last={i === COLS.length - 1} />)}
      </div>
    </div>
  );
}
