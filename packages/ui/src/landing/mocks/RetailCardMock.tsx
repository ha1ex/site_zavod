import { cn } from '../../primitives/cn';

/**
 * Window: карточка задачи Kaiten для розничной сети — «анатомия карточки».
 * Соответствует блоку ТЗ «Всё по задаче — в одной карточке»: основные
 * параметры, метки, настраиваемые поля (бюджет, категория закупки, тип точки),
 * чек-лист проверки (акт подписан, фото с объекта, подтверждение заказчика),
 * блокировка и фактическое время. Данные захардкожены (ТЗ «Кайтен для ритейла»).
 * Домен: pm (управление задачами и проектами сети).
 */
export function RetailCardMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative mx-auto w-full max-w-[440px] overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)] p-6 md:p-7',
      )}
    >
      {/* title */}
      <h3 className="text-lg font-semibold leading-snug text-(--color-text-primary)">
        Закупка и монтаж торгового оборудования — магазин №12 «Тверская»
      </h3>

      {/* meta */}
      <div className="mt-2 text-sm text-(--color-text-secondary)">
        <span className="text-(--color-text-accent) underline underline-offset-2">#66758857</span>{' '}
        Заказчик{' '}
        <span className="text-(--color-text-accent) underline underline-offset-2">Куратор точек</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-(--color-text-secondary)">
        <ClockIcon /> Создана 2 дня назад
      </div>

      {/* action toolbar */}
      <div className="mt-4 flex items-center gap-2">
        <ToolbarButton primary>
          <PlusIcon />
        </ToolbarButton>
        <span className="h-px w-3 bg-(--color-border-default)" />
        <ToolbarPill>→ В РАБОТЕ</ToolbarPill>
        <ToolbarButton>
          <BoltIcon />
        </ToolbarButton>
        <ToolbarButton>
          <ShareIcon />
        </ToolbarButton>
      </div>

      {/* params */}
      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-(--color-text-primary)">
        <ChevronIcon /> Основные параметры
      </div>
      <dl className="mt-3 space-y-3">
        <Row label="Расположение">
          <span className="text-(--color-text-accent) underline underline-offset-2">
            Закупки / В работе
          </span>
        </Row>
        <Row label="Ответственный">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-surface-section) py-0.5 pl-0.5 pr-2.5 text-xs text-(--color-text-primary)">
              <span className="h-5 w-5 rounded-full bg-(--color-action-primary)/80" />
              Менеджер закупок
            </span>
            <Avatar letter="Л" />
          </span>
        </Row>
        <Row label="Срок">
          <span className="text-(--color-text-primary) underline underline-offset-2">18 июля</span>
        </Row>
        <Row label="Метки">
          <span className="inline-flex flex-wrap items-center gap-2">
            <Tag tone="purple">Закупки</Tag>
            <Tag tone="lime">Магазин №12</Tag>
          </span>
        </Row>
        <Row label="Приоритет">
          <Tag tone="red">Высокий</Tag>
        </Row>
      </dl>

      {/* custom fields */}
      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-(--color-text-primary)">
        <ChevronIcon /> Настраиваемые поля
      </div>
      <dl className="mt-3 space-y-3">
        <Row label="Бюджет">
          <span className="font-medium text-(--color-text-primary)">450 000 ₽</span>
        </Row>
        <Row label="Категория закупки">
          <span className="text-(--color-text-primary)">Торговое оборудование</span>
        </Row>
        <Row label="Тип точки">
          <span className="text-(--color-text-primary)">Флагман</span>
        </Row>
      </dl>

      {/* checklist */}
      <div className="mt-5 flex items-center justify-between text-sm font-medium text-(--color-text-primary)">
        <span className="flex items-center gap-2">
          <ChevronIcon /> Чек-лист проверки
        </span>
        <span className="text-xs text-(--color-text-secondary)">2 из 3</span>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        <CheckItem done>Акт приёмки подписан</CheckItem>
        <CheckItem done>Фото с объекта загружено</CheckItem>
        <CheckItem>Подтверждение заказчика</CheckItem>
      </ul>

      {/* blocker */}
      <div className="mt-5 flex items-start gap-2 rounded-(--radius-xl) bg-(--color-red-12) px-3 py-2.5 text-xs text-red-700">
        <BlockIcon />
        <span>
          <span className="font-semibold">Заблокировано:</span> ждём поставку стеллажей от подрядчика
        </span>
      </div>

      {/* footer strip */}
      <div className="mt-5 flex items-center gap-4 border-t border-(--color-border-default) pt-4 text-xs text-(--color-text-secondary)">
        <span className="inline-flex items-center gap-1.5">
          <PaperclipIcon /> 3 файла
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ChatIcon /> 4 комментария
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <ClockIcon /> 6 ч 30 мин
        </span>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] items-center gap-3 text-sm">
      <dt className="text-(--color-text-secondary)">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Tag({ tone, children }: { tone: 'purple' | 'lime' | 'red'; children: React.ReactNode }) {
  const tones = {
    purple: 'bg-(--color-purple-12) text-purple-800',
    lime: 'bg-(--color-lime-12) text-(--color-text-primary)',
    red: 'bg-(--color-red-12) text-red-700',
  } as const;
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs', tones[tone])}>
      {children}
    </span>
  );
}

function Avatar({ letter }: { letter: string }) {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--color-surface-section) text-[11px] font-medium text-(--color-text-secondary)">
      {letter}
    </span>
  );
}

function CheckItem({ done, children }: { done?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        className={cn(
          'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border',
          done
            ? 'border-transparent bg-(--color-green-100) text-white'
            : 'border-(--color-border-default) bg-(--color-surface-card)',
        )}
      >
        {done ? <TickIcon /> : null}
      </span>
      <span
        className={cn(
          done ? 'text-(--color-text-secondary) line-through' : 'text-(--color-text-primary)',
        )}
      >
        {children}
      </span>
    </li>
  );
}

function ToolbarButton({ children, primary }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full',
        primary
          ? 'bg-(--color-action-primary) text-white'
          : 'border border-(--color-border-default) bg-(--color-surface-card) text-(--color-text-primary)',
      )}
    >
      {children}
    </span>
  );
}

function ToolbarPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-9 items-center rounded-full border border-(--color-border-default) bg-(--color-surface-card) px-4 text-xs font-medium text-(--color-text-primary)">
      {children}
    </span>
  );
}

/* — icons — */
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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
function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
    </svg>
  );
}
function TickIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BlockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" strokeLinecap="round" />
    </svg>
  );
}
function PaperclipIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11l-8.5 8.5a5 5 0 01-7-7L14 4a3.3 3.3 0 015 4.5l-9 9a1.7 1.7 0 01-2.4-2.4l8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
