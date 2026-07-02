import { cn } from '../../primitives/cn';

/**
 * Mock карточки проекта Kaiten с дочерними карточками для розничной сети.
 * Соответствует блоку ТЗ «Внедрение маркировки, открытие точки, ребрендинг —
 * под контролем от начала до конца»: проект «Открытие точки» разбит на дочерние
 * карточки (список в стиле интерфейса Kaiten — метка-акцент, название, иконки
 * подзадач/ответственного/таймера). Данные захардкожены. Домен: pm.
 */

const AV = ['#c98a8a', '#8a9bc9', '#8ac9a0', '#c9b78a', '#b88ac9', '#7d9ac9'];

type Child = { title: string; av: number; alert?: boolean };

const CHILDREN: Child[] = [
  { title: 'Завоз первой партии товара', av: 0, alert: true },
  { title: 'Маркетинг: анонс открытия и промо', av: 4 },
  { title: 'Ремонт и отделка торгового зала', av: 2, alert: true },
  { title: 'Монтаж холодильного оборудования', av: 3 },
  { title: 'Установка касс и ПО', av: 1 },
  { title: 'Найм и обучение персонала', av: 5 },
];

export function RetailProjectMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative mx-auto w-full max-w-[460px] overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)] p-6 md:p-7',
      )}
    >
      {/* project header */}
      <div className="flex items-center gap-2 text-xs text-(--color-text-secondary)">
        <FolderIcon /> Проект
      </div>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-(--color-text-primary)">
        Открытие точки — ТЦ «Авиапарк»
      </h3>
      <div className="mt-1 text-sm text-(--color-text-secondary)">
        Срок 30 августа · ответственный — Директор по развитию
      </div>

      {/* overall progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-(--color-text-secondary)">Прогресс проекта</span>
          <span className="font-semibold text-(--color-text-primary)">2 из 6 карточек</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--color-surface-section)">
          <div className="h-full rounded-full bg-(--color-action-primary)" style={{ width: '33%' }} />
        </div>
      </div>

      {/* child cards header */}
      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-(--color-text-primary)">
          <TreeIcon /> Дочерние карточки
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-(--color-border-default) bg-(--color-surface-card) px-2.5 py-1 text-xs text-(--color-text-secondary)">
          Список <ChevronDown />
        </span>
      </div>

      {/* child cards list */}
      <ul className="mt-3 space-y-2.5">
        {CHILDREN.map((c) => (
          <li
            key={c.title}
            className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) px-3.5 py-3 shadow-[0_1px_2px_rgba(45,45,45,0.04)]"
          >
            <span className="block h-1 w-9 rounded-full bg-(--color-action-primary)" />
            <div className="mt-2.5 flex items-center gap-2">
              <span className="flex-1 truncate text-sm text-(--color-text-primary)">{c.title}</span>
              <SubtaskIcon />
              <span className="relative inline-block">
                <span
                  className="inline-block h-6 w-6 rounded-full border-2 border-white"
                  style={{ background: AV[c.av] }}
                />
                {c.alert && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-(--color-red-100)" />
                )}
              </span>
              <PlayButton />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* — icons — */
function FolderIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinejoin="round" />
    </svg>
  );
}
function TreeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="3" width="7" height="5" rx="1.5" />
      <rect x="13" y="9" width="7" height="5" rx="1.5" />
      <rect x="13" y="16" width="7" height="5" rx="1.5" />
      <path d="M7.5 8v9h5.5M7.5 11.5h5.5" strokeLinecap="round" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SubtaskIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-(--color-text-secondary)">
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M6 8.4V15a3 3 0 003 3h6.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlayButton() {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-blue-12) text-(--color-blue-100)">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}
