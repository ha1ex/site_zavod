import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Marketplace {
  brand: string;
  brandColor: string;
  status: 'connected' | 'sync' | 'error';
  activeCards: number;
  ordersToday: number;
  lastSync: string;
  lifted?: boolean;
}

const MARKETPLACES: Marketplace[] = [
  { brand: 'Wildberries', brandColor: 'bg-(--color-red-12) text-red-700', status: 'connected', activeCards: 248, ordersToday: 18, lastSync: '2 мин назад' },
  { brand: 'Ozon', brandColor: 'bg-(--color-blue-12) text-(--color-blue-100)', status: 'sync', activeCards: 192, ordersToday: 12, lastSync: 'синхронизация…', lifted: true },
  { brand: 'Я.Маркет', brandColor: 'bg-(--color-orange-12) text-amber-800', status: 'connected', activeCards: 156, ordersToday: 9, lastSync: '4 мин назад' },
  { brand: 'AliExpress', brandColor: 'bg-(--color-red-12) text-red-700', status: 'error', activeCards: 0, ordersToday: 0, lastSync: 'ошибка авторизации · 2 ч' },
];

const STATUS_CLASS: Record<Marketplace['status'], { tone: string; icon: string; label: string }> = {
  connected: { tone: 'bg-(--color-green-12) text-green-700', icon: 'CheckCircle2', label: 'Подключён' },
  sync: { tone: 'bg-(--color-action-primary-soft) text-(--color-text-accent)', icon: 'Loader', label: 'Синхрон.' },
  error: { tone: 'bg-(--color-red-12) text-red-700', icon: 'AlertTriangle', label: 'Ошибка' },
};

/**
 * Mock коннекторов маркетплейсов E-commerce домена: Wildberries / Ozon /
 * Я.Маркет / AliExpress со статусами подключения.
 */
export function MarketplaceConnectorMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Коннекторы маркетплейсов</span>
          <span>4 канала</span>
          <span>3 активны · 1 ошибка</span>
          <span>596 карточек всего</span>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <div className="grid gap-2.5 md:grid-cols-2">
          {MARKETPLACES.map((m) => {
            const status = STATUS_CLASS[m.status];
            return (
              <div key={m.brand} className={cn('rounded-(--radius-xl) border p-3', m.lifted ? 'border-(--color-action-primary)/40 shadow-sm' : m.status === 'error' ? 'border-(--color-red-100)/40 bg-(--color-red-12)/20' : 'border-(--color-border-default) bg-(--color-surface-page)')}>
                <div className="flex items-center justify-between">
                  <span className={cn('inline-flex h-7 items-center rounded-full px-3 text-[11px] font-semibold', m.brandColor)}>{m.brand}</span>
                  <span className={cn('inline-flex h-5 items-center gap-1 rounded-full px-2 text-[10px] font-medium', status.tone)}>
                    <Icon name={status.icon} className="h-3 w-3" strokeWidth={2.5} />
                    {status.label}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-[9px] uppercase tracking-wide text-(--color-text-secondary)">Активных карточек</dt>
                    <dd className={cn('mt-0.5 text-[14px] font-semibold tabular-nums', m.activeCards === 0 ? 'text-(--color-text-secondary)' : 'text-(--color-text-primary)')}>{m.activeCards}</dd>
                  </div>
                  <div>
                    <dt className="text-[9px] uppercase tracking-wide text-(--color-text-secondary)">Заказов сегодня</dt>
                    <dd className={cn('mt-0.5 text-[14px] font-semibold tabular-nums', m.ordersToday === 0 ? 'text-(--color-text-secondary)' : 'text-(--color-text-accent)')}>{m.ordersToday}</dd>
                  </div>
                </dl>
                <div className={cn('mt-2 text-[10px]', m.status === 'error' ? 'text-red-700' : 'text-(--color-text-secondary)')}>
                  {m.lastSync}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
