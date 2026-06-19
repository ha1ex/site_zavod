import { cn } from '../../primitives/cn';

/**
 * Window: карточка обращения в техподдержку Kaiten (Service Desk).
 * Соответствует экрану «Как сменить владельца аккаунта?».
 * Синяя плашка техподдержки с автором, SLA и полями карточки.
 */
export function WindowSupportMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)] p-6 md:p-7',
      )}
    >
      {/* title + favorite */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold leading-tight text-(--color-text-primary)">
          Как сменить владельца аккаунта?
        </h3>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--color-border-default) text-(--color-text-secondary)">
          <StarIcon />
        </span>
      </div>

      {/* meta */}
      <div className="mt-2 text-sm text-(--color-text-accent) underline underline-offset-2">
        #60517284
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-(--color-text-secondary)">
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon /> Создана 3 дня назад
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MoveIcon /> Перемещена час назад
        </span>
      </div>

      {/* action toolbar */}
      <div className="mt-5 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-(--color-action-primary) text-white">
          <PlusIcon />
        </span>
        <span className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--color-border-default) bg-(--color-surface-card) text-(--color-text-primary)">
          <PlayIcon />
        </span>
        <span className="inline-flex h-9 items-center rounded-full border border-(--color-border-default) bg-(--color-surface-card) px-4 text-xs font-medium text-(--color-text-primary)">
          → L2. ОЧЕР…
        </span>
        <span className="ml-auto text-base leading-none text-(--color-text-secondary)">⋮</span>
      </div>

      {/* blue support panel */}
      <div className="mt-5 rounded-(--radius-2xl) bg-(--color-blue-12) p-3.5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-(--color-text-primary)">
          <HeadsetIcon /> Техподдержка
        </div>
        <div className="mt-1.5 text-[11px] text-(--color-text-primary)">
          Автор: Жанна (8nn77@comfythings.com){' '}
          <span className="text-(--color-text-accent) underline underline-offset-2">изменить</span>
        </div>
        <div className="mt-1 text-[11px] text-(--color-text-primary)">
          SLA:{' '}
          <span className="text-(--color-text-accent) underline underline-offset-2">выбрать sla</span>
        </div>
        <p className="mt-2.5 text-[11px] leading-snug text-(--color-text-secondary)">
          Новые комментарии будут отправлены автору заявки. Этого можно избежать, отметив флажок
          «Не отправлять».
        </p>
        <p className="mt-1.5 text-[11px] leading-snug text-(--color-text-secondary)">
          Поля карточки, видимые автором: название, текущая колонка, комментарии с прикреплёнными
          файлами.
        </p>
        <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-(--color-text-accent)">
          <span className="underline underline-offset-2">
            Добавить дополнительных адресатов для получения уведомлений
          </span>
          <HelpIcon />
        </div>
      </div>

      {/* params */}
      <dl className="mt-5 space-y-3.5">
        <Row label="Расположение">
          <span className="inline-flex items-start gap-2">
            <span className="text-(--color-text-accent) underline underline-offset-2">
              Служба поддержки. L1 и L2 / L1. Дан ответ / проверка
            </span>
            <SearchIcon />
          </span>
        </Row>
        <Row label="Тип">
          <span className="inline-flex items-center gap-2 rounded-full bg-(--color-surface-section) px-2.5 py-1 text-xs text-(--color-text-primary)">
            <span className="text-red-600">?</span> Вопрос в поддержку
          </span>
        </Row>
        <Row label="Участники">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-surface-section) py-0.5 pl-0.5 pr-2.5 text-xs text-(--color-text-primary)">
              <span className="h-5 w-5 rounded-full bg-(--color-neutral-300)" />
              Ответственный
            </span>
            <span className="h-6 w-6 rounded-full bg-(--color-surface-section)" />
            <span className="text-(--color-text-secondary)">+</span>
          </span>
        </Row>
        <Row label="Метки">
          <span className="inline-flex items-center rounded-full bg-(--color-lime-12) px-3 py-1 text-xs text-(--color-text-primary)">
            🙋 Запрос пользователя
          </span>
        </Row>
        <Row label="1. Клиент">
          <span className="text-(--color-text-primary)">Петров Сергей Викторович</span>
        </Row>
        <Row label="email клиента">
          <span className="text-(--color-text-accent) underline underline-offset-2">
            petrov@mail.com
          </span>
        </Row>
        <Row label="Телефон">
          <span className="text-(--color-text-primary)">+7 (495) 555-55-55</span>
        </Row>
      </dl>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-start gap-3 text-sm">
      <dt className="pt-0.5 text-(--color-text-secondary)">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/* — icons — */
function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9z" strokeLinejoin="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function MoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h13l-3-3M20 16H7l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function HeadsetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-blue-100)">
      <path d="M4 13v-1a8 8 0 0116 0v1" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 113.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-(--color-text-secondary)">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" strokeLinecap="round" />
    </svg>
  );
}
