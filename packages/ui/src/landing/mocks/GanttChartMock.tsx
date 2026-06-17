import { cn } from '../../primitives/cn';

const DAY_W = 26;
const ROW_H = 40;
const DAYS = 28;
const WEEKENDS = [6, 7, 13, 14, 20, 21, 27, 28];

/** Цвета полос диаграммы (data-viz, вне токенов DS — взяты из Figma-исходника). */
const PURPLE_BAR = '#9034aa';
// Палитра цветных плашек: teal-слот держит фиолетовый, amber-слот — оранжевый.
const FILL: Record<string, string> = {
  green: '#5cb85c',
  lime: '#a0c517',
  amber: '#f5a623',
  teal: '#a23db5',
  violet: '#7d4ccf',
};

/** Светлый тон того же цвета для иконок-аватаров. */
const TINT: Record<string, string> = {
  green: '#9dd49d',
  lime: '#c6dc74',
  amber: '#f9ca7b',
  teal: '#c78bd3',
  violet: '#b194e2',
};

interface SideRow {
  kind: 'group' | 'link' | 'task';
  initial?: string;
  name: string;
}

const SIDEBAR: SideRow[] = [
  { kind: 'group', initial: 'И', name: 'Инициация' },
  { kind: 'link', name: 'Работа с проектом' },
  { kind: 'task', name: 'Экономическое обосн...' },
  { kind: 'task', name: 'План работ' },
  { kind: 'group', initial: 'П', name: 'Планирование' },
  { kind: 'link', name: 'Работа с проектом' },
  { kind: 'task', name: 'Анализ идей' },
  { kind: 'task', name: 'Дорожная карта проек...' },
  { kind: 'group', initial: 'Р', name: 'Реализация' },
  { kind: 'link', name: 'Работа с проектом' },
  { kind: 'task', name: 'Подзадача Альфа' },
  { kind: 'task', name: 'Подзадача Бета' },
  { kind: 'task', name: 'Подзадача Гамма' },
];

interface Bar {
  row: number;
  s: number;
  e: number;
  summary?: boolean;
  color?: keyof typeof FILL;
  avatars?: (keyof typeof FILL)[];
}

const BARS: Bar[] = [
  { row: 0, s: 1, e: 5, summary: true },
  { row: 2, s: 1, e: 3, color: 'green', avatars: ['green'] },
  { row: 3, s: 4, e: 5, color: 'green', avatars: ['green', 'violet'] },
  { row: 4, s: 8, e: 18, summary: true },
  { row: 6, s: 8, e: 10, color: 'lime', avatars: ['lime'] },
  { row: 7, s: 11, e: 15, color: 'lime', avatars: ['lime'] },
  { row: 8, s: 16, e: 18, color: 'amber', avatars: ['amber'] },
  { row: 9, s: 19, e: 29, summary: true },
  { row: 11, s: 19, e: 23, color: 'green', avatars: ['green'] },
  { row: 12, s: 24, e: 29, color: 'green' },
];

const rc = (r: number) => r * ROW_H + ROW_H / 2;
const ARROWS = [
  { x1: 5 * DAY_W, y1: rc(0), x2: 7 * DAY_W + 1, y2: rc(4), scurve: false },
  { x1: 18 * DAY_W, y1: rc(4), x2: 18 * DAY_W + 1, y2: rc(9), scurve: true },
];
const arrowPath = (a: (typeof ARROWS)[number]) => {
  if (a.scurve) {
    const nub = 34;
    const cr = 22;
    const ax = a.x1 + nub;
    const bx = a.x2 - nub;
    const ddx = bx - ax;
    const ddy = a.y2 - a.y1;
    const len = Math.sqrt(ddx * ddx + ddy * ddy);
    const ux = ddx / len;
    const uy = ddy / len;
    return (
      `M ${a.x1} ${a.y1} L ${ax - cr} ${a.y1} ` +
      `Q ${ax} ${a.y1} ${ax + cr * ux} ${a.y1 + cr * uy} ` +
      `L ${bx - cr * ux} ${a.y2 - cr * uy} ` +
      `Q ${bx} ${a.y2} ${bx + cr} ${a.y2} L ${a.x2} ${a.y2}`
    );
  }
  const R = 12;
  const xv = Math.round((a.x2 - 20) / DAY_W) * DAY_W;
  const dir = xv >= a.x1 ? 1 : -1;
  return (
    `M ${a.x1} ${a.y1} L ${xv - dir * R} ${a.y1} Q ${xv} ${a.y1} ${xv} ${a.y1 + R} ` +
    `L ${xv} ${a.y2 - R} Q ${xv} ${a.y2} ${xv + R} ${a.y2} L ${a.x2} ${a.y2}`
  );
};

/** Форма summary-плашки этапа (скруглённый верх + V-вырез снизу), как в Figma. */
const SummaryBar = ({ w }: { w: number }) => {
  const d =
    `M0 4C0 1.79086 1.79086 0 4 0L${w - 4} 0C${w - 1.79086} 0 ${w} 1.79086 ${w} 4V32L` +
    `${w - 6.41017} 26.6215C${w - 7.13056} 26.017 ${w - 8.04087} 25.6857 ${w - 8.98125} 25.6857H8.98125C` +
    `8.04087 25.6857 7.13056 26.017 6.41017 26.6215L0 32V4Z`;
  return (
    <svg width={w} height={32} viewBox={`0 0 ${w} 32`} fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
      <path d={d} fill={PURPLE_BAR} />
    </svg>
  );
};

const Person = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[26px] w-[26px]">
    <path
      d="M13 0C20.176 0 26 5.824 26 13C26 20.176 20.176 26 13 26C5.824 26 0 20.176 0 13C0 5.824 5.824 0 13 0ZM13 2.6C7.267 2.6 2.6 7.267 2.6 13C2.6 15.3659 3.40561 17.5371 4.73154 19.2791C6.59054 17.0171 11.102 16.25 13 16.25C14.898 16.25 19.4095 17.0171 21.2685 19.2791C22.5944 17.5371 23.4 15.3659 23.4 13C23.4 7.267 18.733 2.6 13 2.6ZM13 5.2C15.522 5.2 17.55 7.228 17.55 9.75C17.55 12.272 15.522 14.3 13 14.3C10.478 14.3 8.45 12.272 8.45 9.75C8.45 7.228 10.478 5.2 13 5.2Z"
      fill={color}
    />
  </svg>
);

/**
 * Mock диаграммы Ганта по проектам (PM-домен) — точная реконструкция экрана
 * Кайтена из Figma (Landing-DS, node 8170-40416): navbar приложения, строка
 * «Проекты», сайдбар с этапами Инициация → Планирование → Реализация, таймлайн
 * «июнь 2026» с шейдингом выходных, summary-полосами этапов (#9034aa),
 * цветными задачами, аватарами исполнителей и связями-зависимостями.
 * Свёрстан без картинки — в общем стиле mock-ов (см. DocEditorRichMock).
 */
export function GanttChartMock() {
  const bodyW = DAYS * DAY_W;
  const bodyH = SIDEBAR.length * ROW_H;

  return (
    <div
      aria-hidden
      className="relative w-max overflow-hidden rounded-2xl border border-(--color-border-default) bg-white font-['Roboto',system-ui,sans-serif] shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]"
    >
      {/* window chrome */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-[#f5f5f5] px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[13px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Диаграмма Ганта · Проекты</span>
        </div>
      </div>

      {/* board */}
      <div className="flex">
        {/* sidebar */}
        <div className="w-[300px] flex-none border-r border-(--color-border-default)">
          <div className="flex h-[72px] items-center border-b border-(--color-border-default) bg-[#f5f5f5] px-4 text-[18px] font-medium tracking-[0.15px] text-(--color-text-primary)">
            Название
          </div>
          {SIDEBAR.map((row, i) => (
            <div
              key={i}
              className={cn(
                'flex h-10 items-center border-b border-(--color-border-default)',
                row.kind === 'group' ? 'gap-3 pl-[13px]' : 'pl-20',
              )}
            >
              {row.kind === 'group' && (
                <>
                  <span className="flex h-5 w-5 flex-none items-center justify-center text-(--color-text-secondary)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                      <path d="M6 15l6-6 6 6" />
                    </svg>
                  </span>
                  <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-(--color-action-primary) text-[16px] text-white">
                    {row.initial}
                  </span>
                  <span className="text-[18px] tracking-[0.15px] text-(--color-text-primary)">{row.name}</span>
                </>
              )}
              {row.kind === 'link' && (
                <span className="text-[18px] font-medium tracking-[0.15px] text-(--color-text-accent)">{row.name}</span>
              )}
              {row.kind === 'task' && (
                <span className="truncate text-[18px] tracking-[0.15px] text-(--color-text-primary)">{row.name}</span>
              )}
            </div>
          ))}
        </div>

        {/* timeline */}
        <div className="relative">
          <div className="flex h-9 items-center justify-center bg-[#f5f5f5] text-[18px] font-medium tracking-[0.15px] text-(--color-text-primary)">
            июнь 2026
          </div>
          <div className="flex h-9 border-y border-(--color-border-default) bg-[#f5f5f5]">
            {Array.from({ length: DAYS }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'flex w-[26px] flex-none items-center justify-center border-l border-(--color-border-default) text-[16px] font-medium text-black/25',
                  i === 0 && 'border-l-0',
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="relative" style={{ width: bodyW, height: bodyH }}>
            {/* day columns + weekend shading (vertical full-height grid, like the source) */}
            {Array.from({ length: DAYS }, (_, i) => (
              <div
                key={i}
                className={cn('absolute bottom-0 top-0 w-[26px] border-r border-(--color-border-default)', i === DAYS - 1 && 'border-r-0', WEEKENDS.includes(i + 1) && 'bg-[#f5f5f5]')}
                style={{ left: i * DAY_W }}
              />
            ))}

            {/* bars + avatars */}
            {BARS.map((b, i) => {
              const left = (b.s - 1) * DAY_W + 1;
              const width = (b.e - b.s + 1) * DAY_W - 2;
              const h = b.summary ? 32 : 26;
              const top = b.row * ROW_H + (ROW_H - h) / 2;
              return (
                <div key={i}>
                  {b.summary ? (
                    <div className="absolute" style={{ left, top }}>
                      <SummaryBar w={width} />
                    </div>
                  ) : (
                    <div className="absolute rounded" style={{ left, width, top, height: h, background: FILL[b.color!] }} />
                  )}
                  {(b.avatars ?? []).map((col, j) => (
                    <div
                      key={j}
                      className="absolute h-[26px] w-[26px]"
                      style={{ left: (b.e + j) * DAY_W + (DAY_W - 26) / 2, top: b.row * ROW_H + (ROW_H - 26) / 2 }}
                    >
                      <Person color={TINT[col]} />
                    </div>
                  ))}
                </div>
              );
            })}

            {/* dependency connectors */}
            <svg className="pointer-events-none absolute inset-0 overflow-visible" width={bodyW} height={bodyH} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="gantt-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                  <path d="M0.5 0.5L9 5L0.5 9.5Z" fill="#808080" />
                </marker>
              </defs>
              {ARROWS.map((a, i) => (
                <path key={i} d={arrowPath(a)} fill="none" stroke="#808080" strokeWidth={2} strokeLinecap="round" markerEnd="url(#gantt-arrow)" />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
