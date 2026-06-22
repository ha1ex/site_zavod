import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

const ROWS = [
  { name: '80a3aae7-8e66-4a87-aaf9-7a982fee3208', id: '80A3AAE7', author: 'viktorognev', activity: 'Сегодня, 13:50' },
  { name: 'SMB × Marketing · Weekly Growth Review', id: '48AE7598', author: 'a_khalezov', activity: '17 июня, 16:30' },
  { name: '70383a5a-6860-4b4f-b530-e9765e9acab4', id: '70383A5A', author: 'din9', activity: '16 июня, 14:01' },
  { name: 'f1176700', id: '08FF93AB', author: 'd_lebedeva', activity: '16 июня, 17:44' },
  { name: '03fda81b-8fa5-460e-957e-4eee767ed89f', id: '03FDA81B', author: 'a_khalezov', activity: '16 июня, 13:30' },
  { name: '5c4a1519-058f-462b-a39c-ce72ab703d6b', id: '5C4A1519', author: 'din9', activity: '11 июня, 19:43' },
];

const GRID = 'grid grid-cols-[minmax(0,1fr)_56px_84px] items-center gap-2 md:grid-cols-[minmax(0,1fr)_64px_92px_104px_132px]';

/**
 * Mock интерфейса «Kaiten Meet» (вариант `meet-list`): шапка с созданием и
 * подключением к встрече, выбором места хранения записей, и таблица встреч
 * (название / ID / создатель / активность) с кнопкой «Подключиться». Тон:
 * «все созвоны команды — на одной странице внутри Kaiten».
 */
export function MeetListMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
      </div>

      <div className="space-y-3 bg-(--color-surface-page) p-3 md:p-4">
        {/* header panel */}
        <div className="rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-card) p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[17px] font-bold text-(--color-text-primary)">
                Kaiten <span className="text-(--color-action-primary)">Meet</span>
              </span>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-(--radius-lg) bg-(--color-action-primary) px-3 text-[10px] font-semibold uppercase tracking-wide text-white">
                <Icon name="Video" className="h-3.5 w-3.5" strokeWidth={2} />
                Создать встречу
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 min-w-[150px] items-center rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) px-2.5 text-[11px] text-(--color-text-secondary)">
                Ссылка или ID встречи
              </span>
              <span className="inline-flex h-8 items-center rounded-(--radius-lg) border border-(--color-border-default) px-3 text-[10px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">
                Подключиться
              </span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex h-8 min-w-[230px] items-center justify-between gap-2 rounded-(--radius-lg) border border-(--color-action-primary)/50 bg-(--color-surface-card) px-2.5 text-[11px] text-(--color-text-secondary)">
              Выберите место хранения записей
              <Icon name="ChevronDown" className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            </span>
            <span className="text-[11px] text-(--color-text-secondary)">— необходимо для записи созвонов</span>
          </div>
        </div>

        {/* table panel */}
        <div className="overflow-hidden rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-card)">
          {/* tabs */}
          <div className="flex items-center gap-4 border-b border-(--color-border-default) px-4 pt-2.5">
            <span className="border-b-2 border-(--color-action-primary) pb-2 text-[11px] font-semibold text-(--color-text-primary)">
              Встречи
            </span>
            <span className="pb-2 text-[11px] font-semibold text-(--color-text-secondary)">Записи</span>
          </div>

          {/* table header */}
          <div className={cn(GRID, 'border-b border-(--color-border-default) px-3 py-2.5 text-[9px] font-semibold uppercase tracking-wide text-(--color-text-secondary)')}>
            <span className="inline-flex items-center gap-1">
              Название <Icon name="Search" className="h-3 w-3" strokeWidth={2} />
            </span>
            <span>ID</span>
            <span className="hidden items-center gap-1 md:inline-flex">
              Создатель
            </span>
            <span className="hidden items-center gap-1 md:inline-flex">
              Активность <Icon name="ArrowDown" className="h-3 w-3" strokeWidth={2} />
            </span>
            <span className="hidden md:block" />
          </div>

          {/* rows */}
          {ROWS.map((r, i) => (
            <div
              key={i}
              className={cn(
                GRID,
                'px-3 py-2.5 text-[11px]',
                i < ROWS.length - 1 && 'border-b border-(--color-border-default)',
              )}
            >
              <span className="truncate font-medium text-(--color-text-primary)">{r.name}</span>
              <span className="font-mono text-[10px] text-(--color-text-secondary)">{r.id}</span>
              <span className="hidden truncate text-(--color-text-secondary) md:block">{r.author}</span>
              <span className="hidden truncate text-(--color-text-secondary) md:block">{r.activity}</span>
              <span className="hidden items-center justify-end gap-1.5 md:flex">
                <span className="inline-flex h-6 items-center rounded-(--radius-md) bg-(--color-action-primary) px-2 text-[10px] font-medium text-white">
                  Подключиться
                </span>
                <Icon name="Copy" className="h-3.5 w-3.5 text-(--color-text-secondary)" strokeWidth={2} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
