/**
 * Mock отчётов Kaiten для финансового блока: две наложенные карточки —
 * «Накопительная диаграмма потока» (CFD, stacked area) и «Контрольный график»
 * (scatter + красная контрольная линия). Иллюстрация к «Отчёты собираются в
 * 2 клика». Данные захардкожены.
 */

// ── CFD (накопительная диаграмма потока) ─────────────────────────────
const CFD_X = [46, 98, 150, 202, 254, 306, 358, 410, 458];
const cfdY = (v: number) => 190 - v * 4; // value(0..45) → y
// Накопительные верхние границы слоёв (снизу вверх): зелёный, бирюзовый, фиолетовый, светло-фиолетовый
const CFD_LAYERS: { fill: string; top: number[] }[] = [
  { fill: '#a5c34a', top: [0, 0, 3, 6, 9, 13, 17, 23, 30] },
  { fill: '#4db6ac', top: [0, 1, 5, 9, 13, 17, 21, 27, 34] },
  { fill: '#9575cd', top: [3, 5, 9, 14, 19, 23, 27, 32, 38] },
  { fill: '#d1c4e9', top: [10, 13, 18, 22, 27, 31, 35, 39, 42] },
];

function cfdArea(top: number[], bottom: number[]): string {
  const up = CFD_X.map((x, i) => `${x},${cfdY(top[i]!)}`);
  const down = CFD_X.map((x, i) => `${x},${cfdY(bottom[i]!)}`).reverse();
  return `M ${up.join(' L ')} L ${down.join(' L ')} Z`;
}

function CfdChart() {
  const gridVals = [10, 15, 20, 25, 30, 35, 40, 45];
  let prev = CFD_X.map(() => 0);
  return (
    <svg viewBox="0 0 480 210" className="w-full" role="img" aria-label="Накопительная диаграмма потока">
      {/* фон области */}
      <rect x={40} y={10} width={430} height={180} fill="#f4f1fb" />
      {/* сетка + подписи Y */}
      {gridVals.map((v) => (
        <g key={v}>
          <line x1={40} y1={cfdY(v)} x2={470} y2={cfdY(v)} stroke="#e6e6ea" strokeWidth={1} />
          <text x={32} y={cfdY(v) + 4} textAnchor="end" fontSize={11} fill="#9a9aa0">{v}</text>
        </g>
      ))}
      {/* слои */}
      {CFD_LAYERS.map((l, i) => {
        const d = cfdArea(l.top, prev);
        prev = l.top;
        return <path key={i} d={d} fill={l.fill} />;
      })}
      {/* подписи X */}
      <text x={330} y={205} textAnchor="middle" fontSize={11} fill="#9a9aa0">11.02</text>
      <text x={452} y={205} textAnchor="middle" fontSize={11} fill="#9a9aa0">18.02</text>
    </svg>
  );
}

// ── Контрольный график (scatter + контрольная линия) ─────────────────
const CC_Y = (v: number) => 200 - ((v - 1) / 12) * 186; // value(1..13) → y
type Dot = [number, number, 'p' | 'b' | 'y'];
const CC_DOTS: Dot[] = [
  [50, 1, 'y'], [66, 1.1, 'y'], [86, 2.3, 'b'], [104, 1.9, 'y'], [120, 1.9, 'y'],
  [150, 2.1, 'b'], [140, 1.1, 'p'], [166, 4.5, 'b'], [180, 4.6, 'y'], [196, 1.4, 'b'],
  [210, 1, 'p'], [224, 1, 'p'], [204, 5.9, 'b'], [238, 1.1, 'p'], [252, 1.1, 'p'],
  [96, 11.4, 'p'], [188, 3.4, 'b'], [246, 4.5, 'p'], [268, 2.3, 'p'], [282, 2.1, 'b'],
  [300, 5.6, 'y'], [316, 1.1, 'p'], [332, 1.8, 'p'], [318, 3.4, 'b'], [300, 2, 'b'],
  [286, 10.1, 'y'], [274, 13.2, 'b'], [346, 1.2, 'p'], [360, 1.1, 'p'], [352, 1.9, 'p'],
  [128, 1.1, 'p'],
];
const CC_COLORS = { p: '#7e57c2', b: '#29b6f6', y: '#fdd835' } as const;

function ControlChart() {
  const gridVals = Array.from({ length: 13 }, (_, i) => i + 1);
  return (
    <svg viewBox="0 0 380 220" className="w-full" role="img" aria-label="Контрольный график">
      {gridVals.map((v) => (
        <g key={v}>
          <line x1={34} y1={CC_Y(v)} x2={372} y2={CC_Y(v)} stroke="#ededf0" strokeWidth={1} />
          <text x={26} y={CC_Y(v) + 4} textAnchor="end" fontSize={10.5} fill="#9a9aa0">{v}</text>
        </g>
      ))}
      {/* контрольная линия (среднее/предел) */}
      <line x1={34} y1={CC_Y(5)} x2={372} y2={CC_Y(5)} stroke="#e5484d" strokeWidth={1.5} />
      {CC_DOTS.map(([x, v, c], i) => (
        <circle key={i} cx={x} cy={CC_Y(v)} r={4.5} fill={CC_COLORS[c]} />
      ))}
    </svg>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        'rounded-2xl border border-(--color-border-default) bg-(--color-surface-page) p-4 shadow-[0_20px_50px_-24px_rgba(45,45,45,0.35)] ' +
        (className ?? '')
      }
    >
      <div className="mb-2 text-center text-[13px] font-medium text-(--color-text-primary)">{title}</div>
      {children}
    </div>
  );
}

export function ReportsChartsMock() {
  return (
    <div aria-hidden className="w-full max-w-[560px]">
      <Card title="Накопительная диаграмма потока" className="ml-auto w-[94%]">
        <CfdChart />
      </Card>
      <Card title="Контрольный график" className="relative z-10 -mt-28 w-[78%]">
        <ControlChart />
      </Card>
    </div>
  );
}
