import { cn } from '../../primitives/cn';

/**
 * Mock мобильного приложения Kaiten для розничной сети: куратор магазина
 * обновляет статус задачи прямо в торговом зале. Телефон с карточкой задачи,
 * чек-листом, кнопкой «Готово», push-уведомлением и нижней навигацией.
 * Соответствует блоку ТЗ «Куратор магазина обновляет статус прямо в зале».
 * Данные захардкожены (ТЗ «Кайтен для ритейла»). Домен: pm.
 */
export function RetailMobileMock() {
  return (
    <div aria-hidden className="flex justify-center py-2">
      <div
        className={cn(
          'relative w-[290px] overflow-hidden rounded-[2.4rem] border-[6px] border-(--color-neutral-800)',
          'bg-(--color-surface-section) shadow-[0_30px_80px_-30px_rgba(125,76,207,0.35)]',
        )}
      >
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-(--color-neutral-800)" />

        {/* app header */}
        <div className="flex items-center gap-2 bg-(--color-surface-card) px-4 pb-3 pt-7">
          <ChevronLeft />
          <span className="text-sm font-semibold text-(--color-text-primary)">Магазин №12 «Тверская»</span>
        </div>

        {/* screen */}
        <div className="relative space-y-3 px-3.5 pb-3.5 pt-3">
          {/* push toast */}
          <div className="flex items-start gap-2 rounded-(--radius-xl) border border-(--color-action-primary)/25 bg-(--color-action-primary-soft) px-3 py-2.5">
            <BellIcon />
            <span className="text-xs leading-snug text-(--color-text-primary)">
              <span className="font-semibold">Новая задача</span> от руководителя сети
            </span>
          </div>

          {/* task card */}
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-3.5 shadow-[0_1px_2px_rgba(45,45,45,0.05)]">
            <div className="text-sm font-medium leading-snug text-(--color-text-primary)">
              Обновить ценники к акции «Скидки недели»
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-(--color-purple-12) px-2.5 py-0.5 text-[11px] text-purple-800">
                Магазины
              </span>
              <span className="rounded-full bg-(--color-red-12) px-2.5 py-0.5 text-[11px] text-red-700">
                Срочно
              </span>
            </div>

            {/* checklist */}
            <div className="mt-3 space-y-1.5">
              <CheckRow done>Проверить зал</CheckRow>
              <CheckRow done>Заменить ценники</CheckRow>
              <CheckRow>Фото на согласование</CheckRow>
            </div>

            {/* footer */}
            <div className="mt-3 flex items-center justify-between border-t border-(--color-border-default) pt-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-(--color-text-secondary)">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--color-surface-section) text-[9px] font-medium">
                  К
                </span>
                Куратор точки
              </span>
              <span className="rounded-full bg-(--color-green-100) px-3 py-1 text-[11px] font-medium text-white">
                Готово
              </span>
            </div>
          </div>

          {/* comment reply hint */}
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) px-3 py-2 text-[11px] text-(--color-text-secondary)">
            Ответить можно из Telegram или Макс — ответ появится в карточке
          </div>

          {/* bottom nav */}
          <div className="flex items-center justify-around rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) py-2">
            <NavDot active />
            <NavDot />
            <NavDot />
            <NavDot />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckRow({ done, children }: { done?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={cn(
          'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border',
          done
            ? 'border-transparent bg-(--color-green-100) text-white'
            : 'border-(--color-border-default) bg-(--color-surface-card)',
        )}
      >
        {done ? <Tick /> : null}
      </span>
      <span className={cn(done ? 'text-(--color-text-secondary) line-through' : 'text-(--color-text-primary)')}>
        {children}
      </span>
    </div>
  );
}

function NavDot({ active }: { active?: boolean }) {
  return (
    <span
      className={cn(
        'h-6 w-6 rounded-lg',
        active ? 'bg-(--color-action-primary)/85' : 'bg-(--color-neutral-200)',
      )}
    />
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-text-secondary)">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-(--color-text-accent)">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7 21a2 2 0 01-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Tick() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
