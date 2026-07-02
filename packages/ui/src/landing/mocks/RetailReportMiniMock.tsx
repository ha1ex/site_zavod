import { cn } from '../../primitives/cn';

/**
 * Компактные мок-превью отчётов Kaiten под секцию «Отчёты собираются
 * автоматически» (ТЗ «Кайтен для ритейла»). По одному отчёту на карточку
 * FeatureGrid: статус по магазинам (дашборд), узкие места (сроки/блокировки/
 * загрузка) и прогноз срока от ИИ-аналитика. Данные захардкожены, вписывается
 * по ширине родительской карточки. Домен: pm.
 */

type RetailReportVariant = 'retail-report-stores' | 'retail-report-bottlenecks' | 'retail-report-ai';

export function RetailReportMiniMock({ variant }: { variant: RetailReportVariant }) {
  return (
    <div
      aria-hidden
      className={cn(
        'h-[200px] w-full overflow-hidden rounded-(--radius-xl)',
        'border border-(--color-border-default) bg-(--color-surface-card) p-4',
        'shadow-[0_1px_2px_rgba(45,45,45,0.05)]',
      )}
    >
      {variant === 'retail-report-stores' && <Stores />}
      {variant === 'retail-report-bottlenecks' && <Bottlenecks />}
      {variant === 'retail-report-ai' && <AiForecast />}
    </div>
  );
}

function Head({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">
      {children}
    </div>
  );
}

function Stores() {
  const rows: [string, number, 'g' | 'y' | 'b'][] = [
    ['Магазин №12 «Тверская»', 90, 'g'],
    ['Магазин №7 «Арбат»', 55, 'y'],
    ['ТЦ «Авиапарк» — открытие', 35, 'b'],
    ['Склад №3', 100, 'g'],
  ];
  const bar = { g: 'bg-(--color-green-100)', y: 'bg-amber-400', b: 'bg-(--color-action-primary)' } as const;
  const dot = { g: 'bg-(--color-green-100)', y: 'bg-amber-400', b: 'bg-(--color-action-primary)' } as const;
  return (
    <div>
      <Head>Статус по магазинам</Head>
      <div className="space-y-2.5">
        {rows.map(([name, pct, tone]) => (
          <div key={name}>
            <div className="flex items-center gap-2 text-[11px] text-(--color-text-primary)">
              <span className={cn('h-2 w-2 shrink-0 rounded-full', dot[tone])} />
              <span className="truncate">{name}</span>
              <span className="ml-auto text-(--color-text-secondary)">{pct}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-(--color-surface-section)">
              <div className={cn('h-full rounded-full', bar[tone])} style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bottlenecks() {
  const kpis: [string, string, string][] = [
    ['Просрочки', '4', 'text-red-600'],
    ['Блокировки', '2', 'text-amber-600'],
    ['Перегруз', '3', 'text-(--color-text-accent)'],
  ];
  const bars = [40, 70, 30, 85, 55, 60, 45];
  return (
    <div>
      <Head>Узкие места</Head>
      <div className="grid grid-cols-3 gap-2">
        {kpis.map(([label, val, cls]) => (
          <div key={label} className="rounded-md border border-(--color-border-default) bg-(--color-surface-section) px-1.5 py-2 text-center">
            <div className={cn('text-base font-semibold leading-none', cls)}>{val}</div>
            <div className="mt-1 text-[9.5px] text-(--color-text-secondary)">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-14 items-end gap-1.5">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-(--color-action-primary)/70" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="mt-1 text-[9.5px] text-(--color-text-secondary)">Загрузка команды по неделям</div>
    </div>
  );
}

function AiForecast() {
  return (
    <div>
      <Head>ИИ-аналитик</Head>
      <div className="rounded-lg border border-(--color-action-primary)/25 bg-(--color-action-primary-soft) p-3">
        <div className="flex items-center gap-2 text-[11px] font-medium text-(--color-text-accent)">
          <Spark /> Прогноз срока
        </div>
        <div className="mt-2 text-sm font-semibold text-(--color-text-primary)">
          Открытие точки — ~14 марта
        </div>
        <div className="mt-1 text-[10.5px] text-(--color-text-secondary)">
          На основе 18 похожих проектов сети
        </div>
      </div>
      <div className="mt-3">
        <svg viewBox="0 0 220 44" className="h-11 w-full" preserveAspectRatio="none">
          <polyline
            points="0,38 30,32 60,34 90,24 120,26 150,16 180,14 220,8"
            fill="none"
            stroke="var(--color-action-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-1 flex justify-between text-[9.5px] text-(--color-text-secondary)">
          <span>факт</span>
          <span>прогноз</span>
        </div>
      </div>
    </div>
  );
}

function Spark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.6L19 9l-4.4 3.2L16 18l-4-3-4 3 1.4-5.8L5 9l5.2-1.4z" />
    </svg>
  );
}
