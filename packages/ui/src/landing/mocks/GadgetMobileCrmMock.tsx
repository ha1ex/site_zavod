import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

const DEALS = [
  {
    company: 'ГК «Энергомост»',
    amount: '1 250 000 ₽',
    stage: 'Демо',
    stageTone: 'violet' as const,
    next: 'Сегодня 11:00 · Игорь',
  },
  {
    company: 'Pixel Studio',
    amount: '180 000 ₽',
    stage: 'Лид',
    stageTone: 'blue' as const,
    next: 'Перезвонить · 14:30',
  },
  {
    company: 'Bright Coffee',
    amount: '95 000 ₽',
    stage: 'Оплата',
    stageTone: 'green' as const,
    next: 'Счёт отправлен',
  },
];

const TAB_ITEMS = [
  { icon: 'LayoutGrid', label: 'Главная', active: true },
  { icon: 'Inbox', label: 'Сделки' },
  { icon: 'MessageSquare', label: 'Чаты', badge: 3 },
  { icon: 'CheckSquare', label: 'Задачи' },
];

const STAGE_CLASS: Record<'violet' | 'blue' | 'green' | 'orange', string> = {
  violet: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  blue: 'bg-(--color-blue-12) text-(--color-blue-100)',
  green: 'bg-(--color-green-12) text-green-700',
  orange: 'bg-(--color-orange-12) text-amber-800',
};

/**
 * Mock мобильного CRM — телефон с экраном «Сегодня»: pull-down уведомление
 * о пропущенном звонке, список активных сделок, нижняя таб-навигация. Тон:
 * «работайте со сделками в дороге, ничего не пропустите».
 */
export function MobileCrmMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative flex items-center justify-center',
      )}
    >
      {/* phone frame */}
      <div
        className={cn(
          'relative flex aspect-[286/549] w-[280px] flex-col overflow-hidden rounded-[34px]',
          'border-[8px] border-white',
          'bg-(--color-surface-card) shadow-[0_0_44px_-16px_rgba(45,45,45,0.38)]',
        )}
      >
        {/* notch + status bar */}
        <div className="relative flex items-center justify-between bg-(--color-surface-page) px-4 py-1.5 text-[10px] font-medium text-(--color-text-primary)">
          <span>09:42</span>
          <span className="absolute left-1/2 top-0 h-4 w-20 -translate-x-1/2 rounded-b-2xl bg-(--color-surface-page)" />
          <div className="flex items-center gap-1">
            <Icon name="Wifi" className="h-3 w-3" strokeWidth={2.5} />
            <Icon name="Battery" className="h-3 w-3" strokeWidth={2.5} />
          </div>
        </div>

        {/* content (прижимает нижнюю навигацию к низу) */}
        <div className="flex-1">
        {/* header */}
        <div className="px-3.5 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-(--color-text-secondary)">
                Сегодня · 14 мая
              </div>
              <div className="text-[14px] font-semibold text-(--color-text-primary)">
                Привет, Анна
              </div>
            </div>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--color-action-primary-soft) text-[10px] font-semibold text-(--color-text-accent)">
              АС
            </span>
          </div>
        </div>

        {/* missed call notification */}
        <div className="mx-3.5 mb-2 flex items-start gap-2 rounded-(--radius-xl) border border-(--color-action-primary)/30 bg-(--color-action-primary-soft) p-2.5">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--color-action-primary) text-white">
            <Icon name="PhoneMissed" className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-semibold text-(--color-text-primary)">
              Пропущенный · Игорь Лебедев
            </div>
            <div className="truncate text-[10px] text-(--color-text-secondary)">
              ГК «Энергомост» · 9:38
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-medium text-(--color-text-accent)">
            Открыть
          </span>
        </div>

        {/* day summary KPIs */}
        <div className="mx-3.5 mb-2 grid grid-cols-3 gap-1.5">
          {[
            { value: '7', label: 'задач' },
            { value: '3', label: 'звонка' },
            { value: '2', label: 'демо' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) p-1.5 text-center"
            >
              <div className="text-[14px] font-bold text-(--color-text-primary) leading-tight">
                {s.value}
              </div>
              <div className="text-[9px] text-(--color-text-secondary)">{s.label}</div>
            </div>
          ))}
        </div>

        {/* deals list */}
        <div className="mx-3.5 mb-2 space-y-1.5">
          <div className="text-[10px] uppercase tracking-wide text-(--color-text-secondary)">
            Активные сделки
          </div>
          {DEALS.map((d, i) => (
            <div
              key={i}
              className="rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) p-2"
            >
              <div className="flex items-center justify-between">
                <span className="truncate text-[11px] font-semibold text-(--color-text-primary)">
                  {d.company}
                </span>
                <span className="shrink-0 text-[10px] font-semibold text-(--color-text-accent)">
                  {d.amount}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    'inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium',
                    STAGE_CLASS[d.stageTone],
                  )}
                >
                  {d.stage}
                </span>
                <span className="truncate text-[9px] text-(--color-text-secondary)">{d.next}</span>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* bottom nav */}
        <div className="flex items-center justify-around border-t border-(--color-border-default) bg-(--color-surface-section) px-2 py-2">
          {TAB_ITEMS.map((t) => (
            <div
              key={t.label}
              className={cn(
                'relative flex flex-col items-center gap-0.5',
                t.active ? 'text-(--color-text-accent)' : 'text-(--color-text-secondary)',
              )}
            >
              <Icon name={t.icon} className="h-4 w-4" strokeWidth={2} />
              <span className="text-[8.5px] font-medium">{t.label}</span>
              {t.badge && (
                <span className="absolute -top-0.5 right-0 inline-flex h-3 min-w-3 items-center justify-center rounded-full bg-(--color-action-primary) px-1 text-[8px] font-semibold text-white">
                  {t.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* FAB */}
        <div className="absolute bottom-14 right-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-(--color-action-primary) text-white shadow-lg">
            <Icon name="Plus" className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </div>

        {/* внутренняя тень по рамке (как у DocReader) */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-[26px] shadow-[inset_0_0_6px_0_rgba(0,0,0,0.1)]" />
      </div>
    </div>
  );
}
