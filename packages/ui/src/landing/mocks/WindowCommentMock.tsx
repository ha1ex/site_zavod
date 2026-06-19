import { cn } from '../../primitives/cn';

/**
 * Window: панель комментариев Kaiten поверх карточки обращения.
 * Соответствует экрану ответа агента с выбором шаблона и
 * переносом карточки. Затемнённая карточка-подложка + плавающая панель.
 */
export function WindowCommentMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-section)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)] p-5 md:p-6',
      )}
    >
      {/* faded card underneath */}
      <div className="opacity-40">
        <h3 className="text-lg font-semibold text-(--color-text-primary)">
          Как сменить владельца аккаунта?
        </h3>
        <div className="mt-1 text-xs text-(--color-text-accent) underline underline-offset-2">
          #60517284
        </div>
        <div className="mt-1 text-[11px] text-(--color-text-secondary)">
          Создана 3 дня назад · Перемещена час назад
        </div>
      </div>

      {/* floating comments panel */}
      <div className="mt-3 rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-card) p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
        {/* header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-(--color-text-primary)">Комментарии</span>
          <div className="flex items-center gap-2 text-(--color-text-secondary)">
            <span className="inline-flex items-center gap-1 rounded-(--radius-lg) border border-(--color-border-default) px-2 py-1 text-xs">
              Все <CaretIcon />
            </span>
            <span className="h-4 w-5 rounded-sm border border-(--color-border-default)" />
            <span className="h-4 w-5 rounded-sm border border-(--color-border-default)" />
            <ExpandIcon />
          </div>
        </div>

        {/* comment input */}
        <div className="mt-3 flex gap-2.5 rounded-(--radius-xl) border border-(--color-border-default) p-3">
          <span className="h-7 w-7 shrink-0 rounded-full bg-(--color-surface-section)" />
          <p className="text-sm leading-relaxed text-(--color-text-primary)">
            Здравствуйте, Жанна, мы приняли вашу заявку «Как сменить владельца аккаунта?» и скоро
            начнём над ней работать. Время ответа займёт приблизительно 10 минут.
          </p>
        </div>

        {/* input toolbar */}
        <div className="mt-2 flex items-center gap-3 text-(--color-text-secondary)">
          <span className="text-base leading-none">+</span>
          <ClipIcon />
          <LinkIcon />
          <span className="text-sm">@</span>
          <ImageIcon />
          <span className="text-sm">☺</span>
          <MailIcon />
          <span className="text-sm leading-none">⋯</span>
          <span className="ml-auto text-sm leading-none">✕</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-(--color-action-primary)">
            <SendIcon />
          </span>
        </div>

        {/* template select */}
        <div className="mt-3 flex items-center justify-between rounded-(--radius-lg) border border-(--color-border-default) px-3 py-2.5 text-sm text-(--color-text-primary)">
          Заявка принята
          <CaretIcon />
        </div>

        {/* move card */}
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <div className="flex items-center justify-between rounded-(--radius-lg) border border-(--color-border-default) px-3 py-2.5 text-sm text-(--color-text-secondary)">
            Переместить карточку в…
            <CaretIcon />
          </div>
          <div className="flex min-w-[96px] items-center justify-between rounded-(--radius-lg) border border-(--color-border-default) px-3 py-2.5 text-sm text-(--color-text-secondary)">
            <span className="text-[11px]">(без наз…)</span>
            <CaretIcon />
          </div>
        </div>

        {/* checkbox */}
        <label className="mt-3 flex items-start gap-2 text-sm text-(--color-text-primary)">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-(--color-action-primary) text-xs text-white">
            ✓
          </span>
          <span>
            Не отправлять для Veronika Vesterovskaya{' '}
            <span className="text-(--color-text-secondary)">(veronika@kaiten.io)</span>
          </span>
        </label>
      </div>
    </div>
  );
}

/* — icons — */
function CaretIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 7L4 12l4 5M16 7l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClipIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11l-8.5 8.5a4 4 0 01-6-6L14 5a2.7 2.7 0 014 4l-8.5 8.5a1.3 1.3 0 01-2-2L14 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.5 1.5M14 11a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5-5L5 20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 11l18-8-8 18-2-7z" />
    </svg>
  );
}
