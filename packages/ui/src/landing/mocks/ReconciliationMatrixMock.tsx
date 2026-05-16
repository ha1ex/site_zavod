import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Row {
  date: string;
  doc: string;
  bank: string;
  erp: string;
  diff: 'match' | 'diff' | 'missing-bank' | 'missing-erp';
}

const ROWS: Row[] = [
  { date: '12.05', doc: 'Поступление №4521', bank: '1 240 000', erp: '1 240 000', diff: 'match' },
  { date: '13.05', doc: 'Зарплата · аванс', bank: '2 850 000', erp: '2 850 000', diff: 'match' },
  { date: '13.05', doc: 'Аренда офиса', bank: '380 000', erp: '378 500', diff: 'diff' },
  { date: '14.05', doc: 'ИП Орлов', bank: '420 000', erp: '—', diff: 'missing-erp' },
  { date: '15.05', doc: 'Курсовая разница', bank: '—', erp: '12 400', diff: 'missing-bank' },
];

const DIFF_CLASS: Record<Row['diff'], string> = {
  match: 'bg-(--color-green-12) text-green-700',
  diff: 'bg-(--color-orange-12) text-amber-800',
  'missing-bank': 'bg-(--color-red-12) text-red-700',
  'missing-erp': 'bg-(--color-red-12) text-red-700',
};

const DIFF_LABEL: Record<Row['diff'], string> = {
  match: '✓ совпало',
  diff: 'расход.',
  'missing-bank': 'нет в банке',
  'missing-erp': 'нет в ERP',
};

/**
 * Mock матрицы сверки Finance-домена: банк × ERP с расхождениями.
 */
export function ReconciliationMatrixMock() {
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
          <span className="font-medium text-(--color-text-primary)">Сверка · Банк × ERP · 12-15 мая</span>
          <span>5 операций</span>
          <span>2 расхождения · 2 пропуска</span>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <div className="mb-3 grid grid-cols-3 gap-2">
          <div className="rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-(--color-text-secondary)">Совпало</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-green-700">40%</div>
          </div>
          <div className="rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-(--color-text-secondary)">Расхождений</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-amber-800">20%</div>
          </div>
          <div className="rounded-(--radius-lg) border border-(--color-red-100)/40 bg-(--color-red-12)/30 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-(--color-text-secondary)">Пропусков</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-red-700">40%</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-(--radius-xl) border border-(--color-border-default)">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-(--color-border-default) bg-(--color-surface-section) text-[9px] uppercase tracking-wide text-(--color-text-secondary)">
                <th className="px-3 py-2">Дата</th>
                <th className="px-3 py-2">Операция</th>
                <th className="px-3 py-2 text-right">Банк</th>
                <th className="px-3 py-2 text-right">ERP</th>
                <th className="px-3 py-2 text-center">Статус</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className={cn(i !== ROWS.length - 1 && 'border-b border-(--color-border-default)')}>
                  <td className="px-3 py-2 tabular-nums text-(--color-text-secondary)">{r.date}</td>
                  <td className="px-3 py-2 text-(--color-text-primary)">{r.doc}</td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', r.bank === '—' ? 'text-(--color-text-secondary)' : 'text-(--color-text-primary)')}>{r.bank}</td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', r.erp === '—' ? 'text-(--color-text-secondary)' : 'text-(--color-text-primary)')}>{r.erp}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={cn('inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium', DIFF_CLASS[r.diff])}>{DIFF_LABEL[r.diff]}</span>
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
