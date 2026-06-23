import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

type Tone = 'violet' | 'coral' | 'green' | 'gray' | 'blue' | 'yellow' | 'pink' | 'teal';
const TONE: Record<Tone, [string, string]> = {
  violet: ['#efe9f9', '#7d4ccf'],
  coral: ['#fbe4da', '#c0552b'],
  green: ['#e7f3df', '#4a8a2f'],
  gray: ['#ededf0', '#6b6b70'],
  blue: ['#e2eefb', '#2f6fb0'],
  yellow: ['#f7f0cf', '#8a6a00'],
  pink: ['#fbe3ec', '#c2185b'],
  teal: ['#d9f0ec', '#0e7a66'],
};

const COLS = ['Название', 'Дорожка', 'Колонка', 'Участники', 'Доска', 'Очередь', 'Подрядчик', 'Начало работы', 'Номер дома', 'ЖК', 'ID'];
const GRID = '32px 232px 116px 136px 96px 188px 116px 148px 126px 96px 132px 80px';

type Row =
  | { type: 'group'; label: string }
  | { type: 'add' }
  | {
      type?: undefined;
      icon: string; name: string; lane: string; col: string;
      av: [string, 'v' | 'g'][]; board: string;
      q: [string, Tone]; c: [string, Tone]; start: string; house: string; zhk: [string, Tone]; id: string;
    };

const ROWS: Row[] = [
  { type: 'group', label: 'Процесс строительства' },
  { icon: '🏗️', name: 'Поставка материалов', lane: 'Высокий пр...', col: 'Очередь', av: [['TR', 'v']], board: 'Процесс строительства', q: ['Этап 5.4', 'violet'], c: ['Внешний АК', 'violet'], start: '29.03.2024', house: '5к4', zhk: ['Поляна', 'pink'], id: '4358274' },
  { icon: '🏗️', name: 'Поставка материалов', lane: 'Высокий пр...', col: 'Очередь', av: [['A', 'g']], board: 'Процесс строительства', q: ['Этап 4.3', 'coral'], c: ['Внешний АК', 'violet'], start: '09.12.2021', house: '2к2', zhk: ['Чистый лес', 'teal'], id: '4358309' },
  { type: 'add' },
  { icon: '🏗️', name: 'Фасад', lane: 'Высокий пр...', col: 'В работе', av: [['TR', 'v'], ['A', 'g']], board: 'Процесс строительства', q: ['Этап 4.3', 'coral'], c: ['Внешний АК', 'violet'], start: '18.03.2022', house: '2к1', zhk: ['Чистый лес', 'teal'], id: '4358315' },
  { type: 'add' },
  { icon: '🏗️', name: 'Территория', lane: 'Средний пр...', col: 'Очередь', av: [['TR', 'g']], board: 'Процесс строительства', q: ['Этап 4.3', 'coral'], c: ['Внешний АК', 'violet'], start: '26.07.2022', house: '2к2', zhk: ['Чистый лес', 'teal'], id: '4358337' },
  { icon: '🏗️', name: 'Территория', lane: 'Средний пр...', col: 'Очередь', av: [['Г', 'g']], board: 'Процесс строительства', q: ['Этап 4.3', 'coral'], c: ['Внешний АК', 'violet'], start: '09.12.2021', house: '1к3', zhk: ['Ягода', 'green'], id: '4358338' },
  { type: 'add' },
  { icon: '🏗️', name: 'Фасад', lane: 'Средний пр...', col: 'Согласование', av: [['TR', 'v'], ['M', 'g']], board: 'Процесс строительства', q: ['Этап 2.3', 'green'], c: ['Внешний СКМ', 'blue'], start: '02.06.2023', house: '1к2', zhk: ['Ягода', 'green'], id: '4358319' },
  { type: 'add' },
  { icon: '🏗️', name: 'Фасад', lane: 'Средний пр...', col: 'Готово', av: [['TR', 'v'], ['П', 'g']], board: 'Процесс строительства', q: ['Этап 3.7', 'coral'], c: ['Внешний СКМ', 'blue'], start: '23.09.2022', house: '5к4', zhk: ['Ягода', 'green'], id: '4358327' },
  { type: 'group', label: 'Сдача в эксплуатацию' },
  { icon: '💥', name: 'Оформление', lane: 'Срочно', col: 'Очередь', av: [['TR', 'v'], ['O', 'g']], board: 'Сдача в эксплуатацию', q: ['Финал', 'gray'], c: ['Внешний СКМ', 'blue'], start: '20.01.2022', house: '62к3', zhk: ['Первый', 'violet'], id: '4358351' },
  { icon: '💥', name: 'Оформление', lane: 'Срочно', col: 'Очередь', av: [['TR', 'v'], ['O', 'g']], board: 'Сдача в эксплуатацию', q: ['Финал', 'gray'], c: ['Внешний СКМ', 'blue'], start: '18.03.2022', house: '23к4', zhk: ['Респект', 'teal'], id: '4358358' },
  { type: 'add' },
  { icon: '✍️', name: 'Продажа', lane: 'Обычный п...', col: 'Очередь', av: [['TR', 'v'], ['O', 'g']], board: 'Сдача в эксплуатацию', q: ['Финал', 'gray'], c: ['Внутренний ОП', 'yellow'], start: '18.03.2022', house: '23к4', zhk: ['Респект', 'teal'], id: '4358365' },
  { type: 'add' },
  { icon: '✍️', name: 'Продажа', lane: 'Обычный п...', col: 'В работе', av: [['TR', 'v'], ['O', 'g']], board: 'Сдача в эксплуатацию', q: ['Финал', 'gray'], c: ['Внутренний ОП', 'yellow'], start: '28.03.2022', house: '23к4', zhk: ['Первый', 'violet'], id: '4358372' },
];

function Pill({ v }: { v: [string, Tone] }) {
  const t = TONE[v[1]];
  return <span className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12.5px] font-medium" style={{ background: t[0], color: t[1] }}>{v[0]}</span>;
}
function Av({ list }: { list: [string, 'v' | 'g'][] }) {
  return (
    <div className="flex -space-x-1.5">
      {list.map(([t, k], i) => (
        <span key={i} className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white" style={{ background: k === 'v' ? '#7d4ccf' : '#bdbdbd' }}>{t}</span>
      ))}
    </div>
  );
}
function Cell({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('flex min-w-0 items-center border-r border-(--color-border-default) px-3 py-1.5 text-[13.5px] text-(--color-text-primary)', className)}>{children}</div>;
}
function TBtn({ icon, label, active }: { icon: string; label?: string; active?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5', active ? 'bg-(--color-action-primary-soft) text-(--color-text-accent)' : 'text-(--color-text-secondary)')}>
      <Icon name={icon} className="h-5 w-5" strokeWidth={2} />
      {label && <span className="text-[14px] font-semibold">{label}</span>}
    </span>
  );
}

/**
 * Mock табличного вида проектного управления Kaiten: тулбар с переключателем
 * видов, группы-дорожки и строки задач с колонками (дорожка, колонка, участники,
 * доска, очередь-этап, подрядчик, даты, ЖК, ID) и цветными пилюлями.
 */
export function ModuleTableMock() {
  return (
    <div aria-hidden className="w-max overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-surface-page) shadow-[0_10px_40px_-20px_rgba(45,45,45,0.3)]">
      {/* toolbar */}
      <div className="flex items-center gap-1 border-b border-(--color-border-default) px-3 py-2">
        <TBtn icon="LayoutGrid" /><TBtn icon="List" /><TBtn icon="Table2" label="ТАБЛИЦА" active /><TBtn icon="AlignLeft" /><TBtn icon="Calendar" /><TBtn icon="ChartLine" /><TBtn icon="SquareChevronDown" />
        <span className="ml-2 inline-flex items-center rounded-lg border border-(--color-action-primary) px-3 py-1.5 text-[13px] font-semibold text-(--color-text-accent)">ДОБАВИТЬ</span>
        <span className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-(--color-border-default) px-3 py-1.5 text-[13px] font-medium text-(--color-text-secondary)"><Icon name="ListFilter" className="h-4 w-4" strokeWidth={2} /> ФИЛЬТРЫ</span>
        <div className="ml-auto flex items-center gap-3 text-(--color-text-secondary)">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#7d4ccf] text-[11px] font-semibold text-white">TR</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 border-b border-(--color-border-default) px-3 py-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-(--color-border-default) px-3 py-1.5 text-[13px] font-medium text-(--color-text-secondary)"><Icon name="CloudDownload" className="h-4 w-4" strokeWidth={2} /> СКАЧАТЬ</span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-(--color-border-default) px-3 py-1.5 text-[13px] font-medium text-(--color-text-secondary)"><Icon name="Settings" className="h-4 w-4" strokeWidth={2} /> НАСТРОЙКИ</span>
      </div>

      {/* header */}
      <div className="grid border-b border-(--color-border-default) bg-(--color-surface-page)" style={{ gridTemplateColumns: GRID }}>
        <div className="flex items-center justify-center py-1.5 text-(--color-text-secondary)"><Icon name="ChevronDown" className="h-4 w-4" strokeWidth={2} /></div>
        {COLS.map((c) => <div key={c} className="border-r border-(--color-border-default) px-3 py-1.5 text-[13px] font-semibold text-(--color-text-primary)">{c}</div>)}
      </div>

      {/* rows */}
      {ROWS.map((r, idx) => {
        if (r.type === 'group') {
          return (
            <div key={idx} className="border-b border-(--color-border-default) py-1.5 pl-[44px] text-[14px] font-semibold text-(--color-text-accent)">{r.label}</div>
          );
        }
        if (r.type === 'add') {
          return <div key={idx} className="border-b border-(--color-border-default) py-1.5 pl-[68px] text-[13px] italic text-(--color-text-secondary)">Добавить карточку</div>;
        }
        return (
          <div key={idx} className="grid items-center border-b border-(--color-border-default) hover:bg-(--color-surface-section)" style={{ gridTemplateColumns: GRID }}>
            <div />
            <Cell className="gap-1.5 font-medium"><span className="text-[15px]">{r.icon}</span><span className="min-w-0 truncate">{r.name}</span></Cell>
            <Cell className="truncate">{r.lane}</Cell>
            <Cell>{r.col}</Cell>
            <Cell><Av list={r.av} /></Cell>
            <Cell className="truncate">{r.board}</Cell>
            <Cell><Pill v={r.q} /></Cell>
            <Cell><Pill v={r.c} /></Cell>
            <Cell>{r.start}</Cell>
            <Cell>{r.house}</Cell>
            <Cell><Pill v={r.zhk} /></Cell>
            <Cell>{r.id}</Cell>
          </div>
        );
      })}
    </div>
  );
}
