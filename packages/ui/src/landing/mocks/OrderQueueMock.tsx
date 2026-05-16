import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Order {
  id: string;
  source: 'wildberries' | 'ozon' | 'ya-market' | 'site';
  sourceLabel: string;
  items: string;
  amount: string;
  status: 'new' | 'assembly' | 'shipping' | 'delivered';
  customer: string;
  lifted?: boolean;
}

const ORDERS: Order[] = [
  { id: '#48201', source: 'wildberries', sourceLabel: 'Wildberries', items: '3 ед.', amount: '4 280 ₽', status: 'new', customer: 'Москва · ПВЗ 2841' },
  { id: '#48202', source: 'ozon', sourceLabel: 'Ozon', items: '1 ед.', amount: '6 500 ₽', status: 'assembly', customer: 'СПб · ПВЗ 0124', lifted: true },
  { id: '#48203', source: 'ya-market', sourceLabel: 'Я.Маркет', items: '2 ед.', amount: '2 950 ₽', status: 'assembly', customer: 'Казань · курьер' },
  { id: '#48204', source: 'site', sourceLabel: 'Сайт', items: '5 ед.', amount: '12 800 ₽', status: 'shipping', customer: 'Екатеринбург · Boxberry' },
  { id: '#48205', source: 'wildberries', sourceLabel: 'Wildberries', items: '1 ед.', amount: '1 890 ₽', status: 'delivered', customer: 'Новосибирск · ПВЗ 5512' },
];

const SOURCE_CLASS: Record<Order['source'], string> = {
  wildberries: 'bg-(--color-red-12) text-red-700',
  ozon: 'bg-(--color-blue-12) text-(--color-blue-100)',
  'ya-market': 'bg-(--color-orange-12) text-amber-800',
  site: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
};

const STATUS_CLASS: Record<Order['status'], string> = {
  new: 'bg-(--color-blue-12) text-(--color-blue-100)',
  assembly: 'bg-(--color-orange-12) text-amber-800',
  shipping: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  delivered: 'bg-(--color-green-12) text-green-700',
};

const STATUS_LABEL: Record<Order['status'], string> = {
  new: 'Новый',
  assembly: 'Сборка',
  shipping: 'В пути',
  delivered: 'Доставлен',
};

/**
 * Mock ленты заказов E-commerce домена: заказы с маркетплейсов и сайта со
 * статусами сборки/доставки.
 */
export function OrderQueueMock() {
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
          <span className="font-medium text-(--color-text-primary)">Заказы · Сегодня</span>
          <span>5 новых</span>
          <span>Сумма: 28 420 ₽</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">Все · Маркетплейсы · Сайт</span>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <div className="space-y-2">
          {ORDERS.map((o) => (
            <div key={o.id} className={cn('flex items-center gap-3 rounded-(--radius-xl) border p-3', o.lifted ? 'border-(--color-action-primary)/40 bg-(--color-action-primary-soft)/30 shadow-sm translate-y-[-1px]' : 'border-(--color-border-default) bg-(--color-surface-page)')}>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-xl) bg-(--color-action-primary-soft) text-(--color-text-accent)">
                <Icon name="Package" className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] font-semibold tabular-nums text-(--color-text-primary)">{o.id}</span>
                  <span className={cn('inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium', SOURCE_CLASS[o.source])}>{o.sourceLabel}</span>
                </div>
                <div className="mt-0.5 truncate text-[10.5px] text-(--color-text-secondary)">{o.customer}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[13px] font-semibold tabular-nums text-(--color-text-primary)">{o.amount}</div>
                <div className="mt-0.5 text-[9px] text-(--color-text-secondary)">{o.items}</div>
              </div>
              <span className={cn('shrink-0 inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium', STATUS_CLASS[o.status])}>{STATUS_LABEL[o.status]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
