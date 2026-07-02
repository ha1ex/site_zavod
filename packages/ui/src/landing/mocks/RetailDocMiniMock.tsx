import { cn } from '../../primitives/cn';

/**
 * Компактные мок-превью документов Kaiten под секцию «Регламенты и инструкции
 * доступны из любого магазина» (ТЗ «Кайтен для ритейла»). По одному документу
 * на карточку FeatureGrid: инструкция по открытию точки (с таблицей задач),
 * стандарты работы куратора (с расписанием) и список договоров. Данные
 * захардкожены, вписывается по ширине родительской карточки. Домен: pm.
 */

type RetailDocVariant = 'retail-doc-instruction' | 'retail-doc-standards' | 'retail-doc-contracts';

export function RetailDocMiniMock({ variant }: { variant: RetailDocVariant }) {
  return (
    <div
      aria-hidden
      className={cn(
        'h-[200px] w-full overflow-hidden rounded-(--radius-xl)',
        'border border-(--color-border-default) bg-(--color-surface-card) p-4',
        'shadow-[0_1px_2px_rgba(45,45,45,0.05)]',
      )}
    >
      {variant === 'retail-doc-instruction' && <Instruction />}
      {variant === 'retail-doc-standards' && <Standards />}
      {variant === 'retail-doc-contracts' && <Contracts />}
    </div>
  );
}

function DocHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-(--color-action-primary-soft) text-(--color-text-accent)">
        <DocIcon />
      </span>
      <span className="text-sm font-semibold leading-tight text-(--color-text-primary)">{children}</span>
    </div>
  );
}

function Instruction() {
  const rows: [string, string, string][] = [
    ['Договор аренды', 'Юр. отдел', 'День 0'],
    ['Пространство в Кайтене', 'Опер. директор', 'День 1'],
    ['Приглашение куратора', 'HR', 'День 5'],
  ];
  return (
    <div>
      <DocHead>Инструкция по открытию новой точки</DocHead>
      <div className="mt-3 text-[11px] font-medium text-(--color-text-secondary)">
        Подготовительный этап (за 90 дней)
      </div>
      <div className="mt-2 overflow-hidden rounded-md border border-(--color-border-default)">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 bg-(--color-surface-section) px-2.5 py-1.5 text-[10px] font-medium text-(--color-text-secondary)">
          <span>Задача</span>
          <span>Ответственный</span>
          <span>Срок</span>
        </div>
        {rows.map(([a, b, c]) => (
          <div
            key={a}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-t border-(--color-border-default) px-2.5 py-1.5 text-[10.5px] text-(--color-text-primary)"
          >
            <span className="truncate">{a}</span>
            <span className="truncate text-(--color-text-secondary)">{b}</span>
            <span className="whitespace-nowrap text-(--color-text-secondary)">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Standards() {
  return (
    <div>
      <DocHead>Стандарты работы куратора магазина</DocHead>
      <div className="mt-3 space-y-1.5">
        <Bar className="w-full" />
        <Bar className="w-[92%]" />
        <Bar className="w-[70%]" />
      </div>
      <div className="mt-3 text-[11px] font-medium text-(--color-text-secondary)">Ежедневные обязанности</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {['09:00', '10:00', '18:00'].map((t) => (
          <div
            key={t}
            className="rounded-md border border-(--color-border-default) bg-(--color-surface-section) px-1 py-2 text-center"
          >
            <div className="text-[11px] font-semibold text-(--color-text-primary)">{t}</div>
            <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-(--color-neutral-200)" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Contracts() {
  const items = [
    'Поставщик — ООО «Свежие продукты»',
    'Аренда площадей — ТЦ «Радуга»',
    'Техобслуживание оборудования',
    'Рекламное агентство',
    'Охрана объектов',
    'NDA с подрядчиком',
  ];
  return (
    <div>
      <DocHead>Договоры</DocHead>
      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2 text-[11px] text-(--color-text-primary)">
            <FileIcon />
            <span className="truncate">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bar({ className }: { className?: string }) {
  return <div className={cn('h-1.5 rounded-full bg-(--color-neutral-200)', className)} />;
}

function DocIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" strokeLinejoin="round" />
      <path d="M14 3v6h6" strokeLinejoin="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-(--color-text-accent)">
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" strokeLinejoin="round" />
      <path d="M14 3v6h6" strokeLinejoin="round" />
    </svg>
  );
}
