import type { CSSProperties } from 'react';

type Tone = 'violet' | 'orange' | 'red' | 'green';

interface FlowNode {
  title: string;
  board: string;
  tone: Tone;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PillLabel {
  text: string;
  x: number;
  y: number;
}

const TONE: Record<Tone, { color: string; bg: string }> = {
  violet: { color: '#7d4ccf', bg: 'rgba(125,76,207,0.12)' },
  orange: { color: '#ffa100', bg: 'rgba(255,161,0,0.12)' },
  red: { color: '#f44336', bg: 'rgba(244,67,54,0.12)' },
  green: { color: '#4caf51', bg: 'rgba(76,175,81,0.12)' },
};

const NODES: FlowNode[] = [
  { title: 'Очередь', board: 'Доска с задачами / Очередь', tone: 'violet', x: 108.9, y: 0, w: 151.4, h: 57.6 },
  { title: 'В работе', board: 'Доска с задачами / Очередь', tone: 'orange', x: 110, y: 103.3, w: 149.8, h: 57.7 },
  { title: 'Согласование', board: 'Доска с задачами / Согласование', tone: 'orange', x: 97, y: 207.3, w: 175.4, h: 57.6 },
  { title: 'Правки', board: 'Доска с задачами / Согласование', tone: 'red', x: 0, y: 282.3, w: 175.4, h: 57.6 },
  { title: 'Готово', board: 'Доска с задачами / Готово', tone: 'green', x: 196, y: 340.3, w: 174, h: 58 },
  { title: 'Передать на дизайн', board: 'Доска с задачами / Очередь', tone: 'violet', x: 1, y: 398.3, w: 175, h: 57.6 },
];

const PILLS: PillLabel[] = [
  { text: 'В работе', x: 185, y: 79.3 },
  { text: 'Согласование', x: 184.6, y: 183.3 },
  { text: 'Правки', x: 42.6, y: 235.3 },
  { text: 'Готово', x: 327, y: 236.3 },
];

const EDGES: string[] = [
  'M184.6 57.6 V103.3',
  'M184.9 161 V207.3',
  'M97 236.1 H49 Q43 236.1 43 242.1 V282.3',
  'M272.4 236.1 H321 Q327 236.1 327 242.1 V340.3',
  'M175.4 311.1 H277 Q283 311.1 283 317.1 V340.3',
  'M283 398.3 V421.1 Q283 427.1 277 427.1 H176',
];

const ARROWS: string[] = [
  '180.6,97.3 188.6,97.3 184.6,103.3',
  '180.9,201.3 188.9,201.3 184.9,207.3',
  '39,276.3 47,276.3 43,282.3',
  '323,334.3 331,334.3 327,340.3',
  '279,334.3 287,334.3 283,340.3',
  '182,423.1 182,431.1 176,427.1',
];

const pillStyle: CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%,-50%)',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#e0e0e0',
  border: '1.13px solid #bdbdbd',
  borderRadius: 9.2,
  padding: '2px 9px',
  fontWeight: 400,
  fontSize: 9,
  lineHeight: 1,
  color: '#2d2d2d',
};

/**
 * Вертикальная версия мока «Маршрут дизайн-задачи» (Figma node 8342:12700).
 * Поток статусов сверху вниз; от «Согласования» ветки расходятся влево
 * («Правки») и вправо («Готово»), «Готово» получает две стрелки сверху,
 * затем уходит к «Передать на дизайн». Карточки — цветная левая обводка
 * + инсет-тень, заголовок по центру, белый чип с путём доски.
 */
export function ModuleFlowVertical() {
  return (
    <div style={{ width: 462.5, height: 569.8125 }}>
      <div
        aria-hidden
        style={{
          position: 'relative',
          width: 370,
          height: 455.85,
          fontFamily: '"Roboto", system-ui, sans-serif',
          transform: 'scale(1.25)',
          transformOrigin: 'top left',
        }}
      >
      <svg width={370} height={455.85} viewBox="0 0 370 455.85" fill="none" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g stroke="#c4c4c4" strokeWidth={1.3} strokeLinejoin="round" strokeLinecap="round">
          {EDGES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g fill="#bdbdbd">
          {ARROWS.map((p, i) => (
            <polygon key={i} points={p} />
          ))}
        </g>
      </svg>

      {PILLS.map((p) => (
        <span key={p.text} style={{ ...pillStyle, left: p.x, top: p.y }}>
          {p.text}
        </span>
      ))}

      {NODES.map((n) => (
        <div
          key={n.title}
          style={{
            position: 'absolute',
            left: n.x,
            top: n.y,
            width: n.w,
            height: n.h,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: `1.7px solid ${TONE[n.tone].color}`,
            borderRadius: 9.2,
            padding: '9px',
            background: TONE[n.tone].bg,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 11.3, lineHeight: 1, color: TONE[n.tone].color }}>
            {n.title}
          </div>
          <div style={{ width: '100%', marginTop: 5.65, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 4.6, padding: '3.6px 4.6px' }}>
            <span style={{ fontWeight: 400, fontSize: 9, lineHeight: 1, color: '#2d2d2d', whiteSpace: 'nowrap' }}>{n.board}</span>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
