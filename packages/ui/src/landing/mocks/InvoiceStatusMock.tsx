import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Invoice {
  number: string;
  client: string;
  amount: string;
  dueDate: string;
  status: 'paid' | 'sent' | 'overdue' | 'draft';
  daysOverdue?: number;
  lifted?: boolean;
}

const INVOICES: Invoice[] = [
  { number: '№156', client: 'ООО «Северный ветер»', amount: '1 240 000 ₽', dueDate: '10.05', status: 'paid' },
  { number: '№157', client: 'Pixel Studio', amount: '180 000 ₽', dueDate: '14.05', status: 'sent' },
  { number: '№158', client: 'ГК «Энергомост»', amount: '2 400 000 ₽', dueDate: '10.05', status: 'overdue', daysOverdue: 5, lifted: true },
  { number: '№159', client: 'Меркурий-Логистика', amount: '480 000 ₽', dueDate: '20.05', status: 'sent' },
  { number: '№160', client: 'Bright Coffee', amount: '95 000 ₽', dueDate: '—', status: 'draft' },
];

const STATUS_CLASS: Record<Invoice['status'], string> = {
  paid: 'bg-(--color-green-12) text-green-700',
  sent: 'bg-(--color-blue-12) text-(--color-blue-100)',
  overdue: 'bg-(--color-red-12) text-red-700',
  draft: 'bg-(--color-neutral-200) text-(--color-text-secondary)',
};

const STATUS_LABEL: Record<Invoice['status'], string> = {
  paid: 'Оплачен',
  sent: 'Отправлен',
  overdue: 'Просрочен',
  draft: 'Черновик',
};

/**
 * Mock статуса счетов Finance-домена: список с компанией, суммой, сроком
 * оплаты, статусом просрочки.
 */
export function InvoiceStatusMock() {
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
          <span className="font-medium text-(--color-text-primary)">Счета · Дебиторка</span>
          <span>5 активных</span>
          <span>Сумма: 4,4 млн ₽</span>
          <span className="rounded-md border border-(--color-red-100)/40 bg-(--color-red-12) px-1.5 py-0.5 text-red-700">1 просрочен · 2,4 млн ₽</span>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <div className="space-y-2">
          {INVOICES.map((inv) => (
            <div key={inv.number} className={cn('flex items-center gap-3 rounded-(--radius-xl) border p-3', inv.lifted ? 'border-(--color-red-100)/40 bg-(--color-red-12)/30 shadow-sm translate-y-[-1px]' : 'border-(--color-border-default) bg-(--color-surface-page)')}>
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-xl) bg-(--color-action-primary-soft) text-(--color-text-accent)">
                <Icon name="FileText" className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[12px] font-semibold text-(--color-text-primary)">{inv.number} · {inv.client}</span>
                  <span className="shrink-0 text-[13px] font-semibold tabular-nums text-(--color-text-primary)">{inv.amount}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-(--color-text-secondary)">
                  <span>Срок оплаты: {inv.dueDate}</span>
                  <span className={cn('inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium', STATUS_CLASS[inv.status])}>{STATUS_LABEL[inv.status]}</span>
                  {inv.daysOverdue && (
                    <span className="inline-flex items-center gap-1 text-red-700">
                      <Icon name="AlertTriangle" className="h-3 w-3" strokeWidth={2.5} />
                      просрочка {inv.daysOverdue} дн.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
