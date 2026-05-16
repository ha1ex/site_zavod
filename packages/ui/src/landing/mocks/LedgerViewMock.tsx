import { cn } from '../../primitives/cn';

interface Entry {
  date: string;
  doc: string;
  desc: string;
  account: string;
  debit?: string;
  credit?: string;
  highlight?: boolean;
}

const ENTRIES: Entry[] = [
  { date: '12.05', doc: '№4521', desc: 'Поступление от ООО «Северный ветер»', account: '62.1 → 51', credit: '1 240 000 ₽' },
  { date: '13.05', doc: '№4522', desc: 'Зарплата · аванс май', account: '70 → 51', debit: '2 850 000 ₽' },
  { date: '13.05', doc: '№4523', desc: 'Аренда офиса · май', account: '26 → 60', debit: '380 000 ₽' },
  { date: '14.05', doc: '№4524', desc: 'Оплата подрядчика · ИП Орлов', account: '60 → 51', debit: '420 000 ₽', highlight: true },
  { date: '15.05', doc: '№4525', desc: 'Поступление от ГК «Энергомост»', account: '62.1 → 51', credit: '2 400 000 ₽' },
];

/**
 * Mock главной книги Finance-домена: проводки с датой, документом, счётом
 * по дебету/кредиту, балансом.
 */
export function LedgerViewMock() {
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
          <span className="font-medium text-(--color-text-primary)">Главная книга · Май 2026</span>
          <span>5 проводок</span>
          <span>Сальдо 51: 8 320 000 ₽</span>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <div className="overflow-hidden rounded-(--radius-xl) border border-(--color-border-default)">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-(--color-border-default) bg-(--color-surface-section) text-[9px] uppercase tracking-wide text-(--color-text-secondary)">
                <th className="px-3 py-2">Дата</th>
                <th className="px-3 py-2">Документ</th>
                <th className="px-3 py-2">Описание</th>
                <th className="px-3 py-2">Счета</th>
                <th className="px-3 py-2 text-right">Дебет</th>
                <th className="px-3 py-2 text-right">Кредит</th>
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map((e, i) => (
                <tr key={i} className={cn(i !== ENTRIES.length - 1 && 'border-b border-(--color-border-default)', e.highlight && 'bg-(--color-action-primary-soft)/20')}>
                  <td className="px-3 py-2 tabular-nums text-(--color-text-secondary)">{e.date}</td>
                  <td className="px-3 py-2 text-(--color-text-primary)">{e.doc}</td>
                  <td className="px-3 py-2 text-(--color-text-primary)">{e.desc}</td>
                  <td className="px-3 py-2 font-medium tabular-nums text-(--color-text-accent)">{e.account}</td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', e.debit ? 'font-semibold text-(--color-text-primary)' : 'text-(--color-text-secondary)')}>
                    {e.debit ?? '—'}
                  </td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', e.credit ? 'font-semibold text-green-700' : 'text-(--color-text-secondary)')}>
                    {e.credit ?? '—'}
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
