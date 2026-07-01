/**
 * Mock базы знаний финансового отдела: коллаж из двух документов Kaiten —
 * «Регламент согласования платежей» (с оглавлением и таблицей лимитов) и
 * «Шаблон финансового отчёта» (с полями и сводкой по бюджету). Иллюстрация к
 * блоку «Учётная политика, регламенты и шаблоны — там же, где задачи».
 * Данные захардкожены.
 */

function DocCard({
  emoji,
  title,
  className,
  children,
}: {
  emoji: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        'overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-surface-card) ' +
        'shadow-[0_24px_60px_-28px_rgba(45,45,45,0.4)] p-5 ' +
        (className ?? '')
      }
    >
      <div className="mb-2 text-2xl leading-none">{emoji}</div>
      <div className="text-[15px] font-semibold leading-snug text-(--color-text-primary)">{title}</div>
      <div className="mt-1 flex items-center gap-1 text-[10px] text-(--color-text-tertiary)">
        <span className="text-xs leading-none">＋</span> Добавить участников
      </div>
      <div className="mt-3 border-t border-(--color-border-default) pt-3">{children}</div>
    </div>
  );
}

function RegulationDoc() {
  const toc = [
    'Виды платежей и лимиты',
    'Порядок согласования',
    'Сроки согласования',
    'Основания для отклонения',
  ];
  const rows: [string, string, string][] = [
    ['Аванс', 'до 100 000 ₽', 'Руководитель'],
    ['Платёж', 'от 100 000 ₽', 'Фин. директор'],
    ['Расход', 'от 1 000 000 ₽', 'Правление'],
  ];
  return (
    <DocCard emoji="✋" title="Регламент согласования платежей" className="ml-auto w-[96%]">
      <div className="rounded-lg border-l-2 border-(--color-action-primary) bg-(--color-surface-page) px-3 py-2 text-[11px] leading-snug text-(--color-text-secondary)">
        Порядок согласования платёжных поручений, авансов и расходных операций в
        финансовом отделе.
      </div>
      <div className="mt-3 text-[10px] font-medium uppercase tracking-wide text-(--color-text-tertiary)">
        Содержание
      </div>
      <ul className="mt-1.5 space-y-1">
        {toc.map((t) => (
          <li key={t} className="text-[11.5px] text-(--color-text-accent) underline underline-offset-2">
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-3 overflow-hidden rounded-lg border border-(--color-border-default)">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 bg-(--color-surface-page) px-3 py-1.5 text-[10px] font-medium text-(--color-text-tertiary)">
          <span>Тип платежа</span>
          <span className="text-right">Сумма</span>
          <span className="text-right">Согласующий</span>
        </div>
        {rows.map(([type, sum, who], i) => (
          <div
            key={type}
            className={
              'grid grid-cols-[1fr_auto_auto] gap-x-3 px-3 py-1.5 text-[11px] text-(--color-text-primary) ' +
              (i < rows.length - 1 ? 'border-b border-(--color-border-default)' : '')
            }
          >
            <span>{type}</span>
            <span className="text-right tabular-nums text-(--color-text-secondary)">{sum}</span>
            <span className="text-right text-(--color-text-secondary)">{who}</span>
          </div>
        ))}
      </div>
    </DocCard>
  );
}

function ReportTemplateDoc() {
  const fields: [string, string][] = [
    ['Период', 'месяц, квартал, год'],
    ['Подготовил', 'ФИО, должность'],
    ['Согласовано', 'финансовый директор'],
  ];
  const rows: [string, string][] = [
    ['Фонд оплаты труда', '98%'],
    ['Аренда и услуги', '104%'],
    ['Закупки', '76%'],
  ];
  return (
    <DocCard emoji="✉️" title="Шаблон финансового отчёта" className="relative z-10 -mt-28 w-[82%]">
      <div className="space-y-1">
        {fields.map(([label, val]) => (
          <div key={label} className="text-[11px] leading-snug">
            <span className="font-semibold text-(--color-text-primary)">{label}: </span>
            <span className="text-(--color-text-tertiary)">[{val}]</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[12px] font-semibold text-(--color-text-primary)">
        1. Сводка по бюджету
      </div>
      <div className="mt-1.5 overflow-hidden rounded-lg border border-(--color-border-default)">
        <div className="grid grid-cols-[1fr_auto] gap-x-3 bg-(--color-surface-page) px-3 py-1.5 text-[10px] font-medium text-(--color-text-tertiary)">
          <span>Статья расходов</span>
          <span className="text-right">% исполнения</span>
        </div>
        {rows.map(([item, pct], i) => (
          <div
            key={item}
            className={
              'grid grid-cols-[1fr_auto] gap-x-3 px-3 py-1.5 text-[11px] text-(--color-text-primary) ' +
              (i < rows.length - 1 ? 'border-b border-(--color-border-default)' : '')
            }
          >
            <span>{item}</span>
            <span className="text-right tabular-nums text-(--color-text-secondary)">{pct}</span>
          </div>
        ))}
      </div>
    </DocCard>
  );
}

export function FinanceKbDocsMock() {
  return (
    <div aria-hidden className="w-full max-w-[540px]">
      <RegulationDoc />
      <ReportTemplateDoc />
    </div>
  );
}
