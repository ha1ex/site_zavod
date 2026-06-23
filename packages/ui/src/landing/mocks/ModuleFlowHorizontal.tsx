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
  { title: 'Очередь', board: 'Доска с задачами / Очередь', tone: 'violet', x: 19.8, y: 55.2, w: 113.7, h: 43.5 },
  { title: 'В работе', board: 'Доска с задачами / Очередь', tone: 'orange', x: 115.6, y: 114.3, w: 113, h: 43.5 },
  { title: 'Согласование', board: 'Доска с задачами / Согласование', tone: 'orange', x: 309.2, y: 114.1, w: 132.7, h: 43.5 },
  { title: 'Правки', board: 'Доска с задачами / Согласование', tone: 'red', x: 452.8, y: 55.6, w: 132.7, h: 43.5 },
  { title: 'Готово', board: 'Доска с задачами / Готово', tone: 'green', x: 452.8, y: 171.2, w: 132, h: 43.5 },
  { title: 'Передать на дизайн', board: 'Доска с задачами / Очередь', tone: 'violet', x: 624, y: 55.6, w: 113.7, h: 43.5 },
];

const PILLS: PillLabel[] = [
  { text: 'В работе', x: 77.5, y: 136 },
  { text: 'Согласование', x: 266.2, y: 136 },
  { text: 'Правки', x: 403.2, y: 76.3 },
  { text: 'Готово', x: 403.5, y: 192.3 },
  { text: 'Правки внесены', x: 519.1, y: 135.4 },
  { text: 'Задача в дизайне', x: 681, y: 192.3 },
];

const EDGES: string[] = [
  'M76.7 98.7 V130 Q76.7 136 82.7 136 H115.6',
  'M228.6 136 H309.2',
  'M403.2 114.1 V82.3 Q403.2 76.3 409.2 76.3 H452.8',
  'M403.2 157.6 V186.3 Q403.2 192.3 409.2 192.3 H452.8',
  'M519.1 99.1 V171.2',
  'M584.8 192.9 H675 Q681 192.9 681 186.9 V99.1',
];

const ARROWS: string[] = [
  '110.6,132.5 110.6,139.5 115.6,136',
  '304.2,132.5 304.2,139.5 309.2,136',
  '447.8,72.8 447.8,79.8 452.8,76.3',
  '447.8,188.8 447.8,195.8 452.8,192.3',
  '515.6,166.2 522.6,166.2 519.1,171.2',
  '677.5,104.1 684.5,104.1 681,99.1',
];

const pillStyle: CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%,-50%)',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#e0e0e0',
  border: '0.862px solid #bdbdbd',
  borderRadius: 6.9,
  padding: '3.9px 6.9px 1.6px',
  fontWeight: 400,
  fontSize: 6.9,
  lineHeight: 1,
  color: '#2d2d2d',
};

/**
 * Горизонтальная версия мока «Маршрут дизайн-задачи» (Figma node 7196:3110).
 * Белая карта 761×273 с потоком статусов слева направо; ветвление от
 * «Согласования» на «Правки» и «Готово». Карточки — цветная левая обводка
 * + инсет-тень, заголовок по центру, белый чип с путём доски. Связи и
 * стрелки — SVG-слой поверх абсолютно спозиционированных карточек.
 */
export function ModuleFlowHorizontal() {
  return (
    <div style={{ width: 951.25, height: 341.6375 }}>
      <div
        aria-hidden
        style={{
          position: 'relative',
          width: 761,
          height: 273.31,
          background: '#fff',
          borderRadius: 10.349,
          fontFamily: '"Roboto", system-ui, sans-serif',
          transform: 'scale(1.25)',
          transformOrigin: 'top left',
        }}
      >
      <svg width={761} height={273.31} viewBox="0 0 761 273.31" fill="none" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g stroke="#c4c4c4" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round">
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
            borderLeft: `1.3px solid ${TONE[n.tone].color}`,
            borderRadius: 6.9,
            padding: '4.312px 6.9px 6.9px',
            background: TONE[n.tone].bg,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: 8.625, lineHeight: 1.8, color: TONE[n.tone].color }}>
            {n.title}
          </div>
          <div style={{ width: '100%', marginTop: 4.312, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 3.45, padding: '2.76px 3.45px' }}>
            <span style={{ fontWeight: 400, fontSize: 6.9, lineHeight: 1, color: '#2d2d2d', whiteSpace: 'nowrap' }}>{n.board}</span>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
