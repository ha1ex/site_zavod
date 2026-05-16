import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

type Trend = 'up' | 'down';

interface Kpi {
  value: string;
  label: string;
  delta: string;
  trend: Trend;
  accent?: boolean;
}

const KPIS: Kpi[] = [
  { value: '8,4 млн ₽', label: 'Выручка за май', delta: '+18%', trend: 'up', accent: true },
  { value: '34%', label: 'Конверсия в оплату', delta: '+4 пп', trend: 'up' },
  { value: '1 240 ₽', label: 'Стоимость лида', delta: '−12%', trend: 'down' },
  { value: '12 дн', label: 'Длина сделки', delta: '−3 дн', trend: 'down' },
];

const FUNNEL = [
  { stage: 'Лид', value: 412, share: 'w-full', tone: 'bg-(--color-blue-100)' },
  { stage: 'Квалификация', value: 178, share: 'w-[68%]', tone: 'bg-(--color-action-primary)' },
  { stage: 'Демо', value: 96, share: 'w-[42%]', tone: 'bg-(--color-orange-100)' },
  { stage: 'Договор', value: 54, share: 'w-[28%]', tone: 'bg-purple-500' },
  { stage: 'Оплата', value: 38, share: 'w-[18%]', tone: 'bg-(--color-green-100)' },
];

const SOURCES = [
  { name: 'Контекст · Яндекс', value: 142, share: 'w-3/5', tone: 'bg-(--color-action-primary)' },
  { name: 'SEO', value: 96, share: 'w-2/5', tone: 'bg-(--color-blue-100)' },
  { name: 'Соцсети', value: 74, share: 'w-1/3', tone: 'bg-(--color-orange-100)' },
  { name: 'Партнёры', value: 58, share: 'w-1/4', tone: 'bg-(--color-green-100)' },
];

const TREND_ICON: Record<Trend, string> = { up: 'TrendingUp', down: 'TrendingDown' };
const TREND_CLASS: Record<Trend, string> = {
  up: 'text-green-700 bg-(--color-green-12)',
  down: 'text-green-700 bg-(--color-green-12)',
};

/**
 * Mock CRM-дашборда руководителя: 2×2 KPI плитки (выручка, конверсия, CPL,
 * длина сделки), воронка по стадиям, источники лидов. Тон: «решения на
 * основе данных — деньги, конверсия, окупаемость рекламы».
 */
export function CrmAnalyticsMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window chrome */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Аналитика · Май 2026</span>
          <span>Отдел продаж</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Период · 30 дней
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-4 md:p-5">
        {/* KPI 2×2 */}
        <div className="grid grid-cols-2 gap-2.5">
          {KPIS.map((k) => (
            <div
              key={k.label}
              className={cn(
                'rounded-(--radius-xl) border bg-(--color-surface-page) p-3',
                k.accent
                  ? 'border-(--color-action-primary)/40 shadow-sm'
                  : 'border-(--color-border-default)',
              )}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-semibold leading-none text-(--color-text-primary) md:text-2xl">
                  {k.value}
                </span>
                <span
                  className={cn(
                    'inline-flex h-5 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium',
                    TREND_CLASS[k.trend],
                  )}
                >
                  <Icon name={TREND_ICON[k.trend]} className="h-3 w-3" strokeWidth={2.5} />
                  {k.delta}
                </span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-(--color-text-secondary)">
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* Funnel chart */}
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-3">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-(--color-text-secondary)">
            <span>Воронка продаж · конверсия по стадиям</span>
            <span>9,2% Лид → Оплата</span>
          </div>
          <div className="space-y-1.5">
            {FUNNEL.map((f) => (
              <div key={f.stage} className="flex items-center gap-2">
                <div className="w-24 shrink-0 text-[11px] font-medium text-(--color-text-primary)">
                  {f.stage}
                </div>
                <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-(--color-neutral-200)">
                  <div
                    className={cn('h-full rounded-md', f.tone, f.share)}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-[11px] font-semibold text-(--color-text-primary) tabular-nums">
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-3">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-(--color-text-secondary)">
            <span>Источники лидов</span>
            <span>сквозная аналитика</span>
          </div>
          <div className="space-y-1.5">
            {SOURCES.map((s) => (
              <div key={s.name} className="space-y-0.5">
                <div className="flex items-center justify-between text-[11px] text-(--color-text-primary)">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-(--color-text-secondary) tabular-nums">{s.value} лидов</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--color-neutral-200)">
                  <div className={cn('h-full rounded-full', s.tone, s.share)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
