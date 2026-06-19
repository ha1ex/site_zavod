import { cn } from '../../primitives/cn';

interface Bar {
  month: string;
  inSla: number;
  overdue: number;
}

const DATA: Bar[] = [
  { month: 'февраль 2023', inSla: 132, overdue: 88 },
  { month: 'март 2023', inSla: 164, overdue: 96 },
  { month: 'апрель 2023', inSla: 181, overdue: 159 },
  { month: 'июнь 2023', inSla: 148, overdue: 72 },
];

const MAX = 200;

/**
 * Window: дашборд «Статистика по SLA» Kaiten Service Desk.
 * Столбчатая диаграмма заявок в SLA vs нарушения по месяцам.
 * Слева — сайдбар разделов, сверху — подсказка о разделе.
 */
export function WindowSlaMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative flex overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)]',
      )}
    >
      {/* sidebar */}
      <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-(--color-border-default) bg-(--color-surface-section) p-3 sm:flex">
        <div className="mb-2 px-2 text-xs font-medium text-(--color-text-secondary)">Дэшборд</div>
        {[
          { label: 'Статистика', active: false },
          { label: 'Статистика по SLA', active: true },
          { label: 'Заявки', active: false },
        ].map((item) => (
          <div
            key={item.label}
            className={cn(
              'rounded-(--radius-lg) px-2.5 py-1.5 text-xs',
              item.active
                ? 'bg-(--color-action-primary-soft) font-medium text-(--color-text-accent)'
                : 'text-(--color-text-secondary)',
            )}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* content */}
      <div className="flex-1 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-(--color-text-primary)">Статистика по SLA</h3>
            <div className="mt-0.5 text-xs text-(--color-text-secondary)">24 типа · 1 245 запусков</div>
          </div>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-(--radius-lg) border border-(--color-border-default) px-3 text-xs text-(--color-text-secondary)">
            <FilterIcon /> Фильтры
          </span>
        </div>

        {/* info tooltip */}
        <div className="mt-3 rounded-(--radius-xl) bg-(--color-blue-12) px-3 py-2 text-xs leading-relaxed text-(--color-text-secondary)">
          Портал для заявок —{' '}
          <span className="text-(--color-text-accent) underline underline-offset-2">eli.kaiten.ru/sd</span>.
          Подробнее о разделе SLA в faq.
        </div>

        {/* chart */}
        <div className="mt-4 flex items-end gap-5 border-b border-(--color-border-default) pb-2 pl-7 pt-2">
          {/* y axis */}
          <div className="absolute left-0 hidden flex-col justify-between text-[9px] text-(--color-text-secondary)">
            <span>200</span>
          </div>
          {DATA.map((d) => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-32 items-end gap-1.5">
                <div
                  className="w-5 rounded-t-sm bg-(--color-blue-100)"
                  style={{ height: `${(d.inSla / MAX) * 100}%` }}
                />
                <div
                  className="w-5 rounded-t-sm bg-(--color-neutral-800)"
                  style={{ height: `${(d.overdue / MAX) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* x labels */}
        <div className="flex gap-5 pl-7">
          {DATA.map((d) => (
            <div key={d.month} className="flex-1 text-center text-[9px] text-(--color-text-secondary)">
              {d.month}
            </div>
          ))}
        </div>

        {/* legend */}
        <div className="mt-3 flex items-center gap-4 text-[11px] text-(--color-text-secondary)">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-(--color-blue-100)" /> Заявок в SLA
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-(--color-neutral-800)" /> Нарушений SLA
          </span>
        </div>
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5h18l-7 8v5l-4 2v-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
