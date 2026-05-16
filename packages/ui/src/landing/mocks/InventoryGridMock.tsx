import { cn } from '../../primitives/cn';

interface Sku {
  sku: string;
  title: string;
  warehouse: { msk: number; spb: number; nsk: number };
  minStock: number;
  status: 'ok' | 'low' | 'out';
}

const SKUS: Sku[] = [
  { sku: 'KFR-001', title: 'Кофе в зёрнах · 250г', warehouse: { msk: 120, spb: 84, nsk: 38 }, minStock: 30, status: 'ok' },
  { sku: 'KFR-002', title: 'Кофе молотый · 250г', warehouse: { msk: 38, spb: 12, nsk: 4 }, minStock: 30, status: 'low' },
  { sku: 'TEA-018', title: 'Чай зелёный · 100г', warehouse: { msk: 280, spb: 156, nsk: 92 }, minStock: 50, status: 'ok' },
  { sku: 'CUP-042', title: 'Чашка керамика 350мл', warehouse: { msk: 0, spb: 12, nsk: 0 }, minStock: 20, status: 'out' },
];

const STATUS_CLASS: Record<Sku['status'], string> = {
  ok: 'bg-(--color-green-12) text-green-700',
  low: 'bg-(--color-orange-12) text-amber-800',
  out: 'bg-(--color-red-12) text-red-700',
};

const STATUS_LABEL: Record<Sku['status'], string> = {
  ok: 'В наличии',
  low: 'Мало',
  out: 'Нет',
};

/**
 * Mock каталога остатков E-commerce домена: SKU × склады с цвет-кодом
 * наличия.
 */
export function InventoryGridMock() {
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
          <span className="font-medium text-(--color-text-primary)">Остатки · 4 SKU</span>
          <span>3 склада: МСК / СПб / НСК</span>
          <span className="rounded-md border border-(--color-red-100)/40 bg-(--color-red-12) px-1.5 py-0.5 text-red-700">1 SKU кончился</span>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <div className="overflow-hidden rounded-(--radius-xl) border border-(--color-border-default)">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-(--color-border-default) bg-(--color-surface-section) text-[9px] uppercase tracking-wide text-(--color-text-secondary)">
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Товар</th>
                <th className="px-3 py-2 text-right">МСК</th>
                <th className="px-3 py-2 text-right">СПб</th>
                <th className="px-3 py-2 text-right">НСК</th>
                <th className="px-3 py-2 text-right">Min</th>
                <th className="px-3 py-2 text-center">Статус</th>
              </tr>
            </thead>
            <tbody>
              {SKUS.map((s, i) => (
                <tr key={s.sku} className={cn(i !== SKUS.length - 1 && 'border-b border-(--color-border-default)')}>
                  <td className="px-3 py-2 font-mono tabular-nums text-(--color-text-accent)">{s.sku}</td>
                  <td className="px-3 py-2 text-(--color-text-primary)">{s.title}</td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', s.warehouse.msk === 0 ? 'text-red-700' : s.warehouse.msk < s.minStock ? 'text-amber-800' : 'text-(--color-text-primary)')}>{s.warehouse.msk}</td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', s.warehouse.spb === 0 ? 'text-red-700' : s.warehouse.spb < s.minStock ? 'text-amber-800' : 'text-(--color-text-primary)')}>{s.warehouse.spb}</td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', s.warehouse.nsk === 0 ? 'text-red-700' : s.warehouse.nsk < s.minStock ? 'text-amber-800' : 'text-(--color-text-primary)')}>{s.warehouse.nsk}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-(--color-text-secondary)">{s.minStock}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={cn('inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium', STATUS_CLASS[s.status])}>{STATUS_LABEL[s.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
