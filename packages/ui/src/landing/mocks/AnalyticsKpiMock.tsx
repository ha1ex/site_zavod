import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Kpi {
  value: string;
  label: string;
  trend: 'up' | 'down' | 'flat';
  delta: string;
  accent?: boolean;
}

const KPIS: Kpi[] = [
  { value: '94%', label: 'спринт в срок', trend: 'up', delta: '+6 пп', accent: true },
  { value: '128', label: 'задач в работе', trend: 'flat', delta: '±0' },
  { value: '12 дн', label: 'средний цикл story', trend: 'down', delta: '–2 дн' },
  { value: '37', label: 'задач в зоне риска', trend: 'up', delta: '+4' },
];

const TREND_ICON: Record<Kpi['trend'], string> = {
  up: 'TrendingUp',
  down: 'TrendingDown',
  flat: 'Minus',
};

const TREND_CLASS: Record<Kpi['trend'], string> = {
  up: 'text-green-700 bg-(--color-green-100)',
  down: 'text-green-700 bg-(--color-green-100)',
  flat: 'text-(--color-text-secondary) bg-(--color-neutral-200)',
};

const TEAMS = [
  { name: 'Платформа', share: 'w-4/5', tone: 'bg-(--color-action-primary)' },
  { name: 'Поддержка', share: 'w-3/5', tone: 'bg-(--color-blue-100)' },
  { name: 'Мобильное', share: 'w-2/5', tone: 'bg-(--color-orange-100)' },
];

/**
 * Mock дашборда руководителя: 2×2 KPI-плитки + загрузка команд. Подчёркивает
 * «аналитика без графиков-сложностей»: число, стрелка, дельта. Используется в
 * MediaCopy variant='analytics-kpi' и Hero visual.variant='analytics-kpi'.
 */
export function AnalyticsKpiMock() {
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
          <span className="font-medium text-(--color-text-primary)">Аналитика · Май</span>
          <span>4 команды</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Период · 30 дней
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-4 md:gap-4 md:p-5">
        {/* KPI 2×2 */}
        <div className="grid grid-cols-2 gap-2.5 md:gap-3">
          {KPIS.map((k) => (
            <div
              key={k.label}
              className={cn(
                'rounded-(--radius-xl) border bg-(--color-surface-page) p-3 md:p-4',
                k.accent
                  ? 'border-(--color-action-primary)/40 shadow-sm'
                  : 'border-(--color-border-default)',
              )}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold leading-none text-(--color-text-primary) md:text-3xl">
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
              <div className="mt-1 text-[10px] uppercase tracking-wide text-(--color-text-secondary) md:text-[11px]">
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* Teams load */}
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-3 md:p-4">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-(--color-text-secondary) md:text-[11px]">
            <span>Загрузка команд</span>
            <span>capacity</span>
          </div>
          <div className="space-y-2">
            {TEAMS.map((t) => (
              <div key={t.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-(--color-text-primary)">
                  <span>{t.name}</span>
                  <span className="text-(--color-text-secondary)">{t.share === 'w-4/5' ? '82%' : t.share === 'w-3/5' ? '64%' : '38%'}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--color-neutral-200)">
                  <div className={cn('h-full rounded-full', t.tone, t.share)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
