import { cn } from '../../primitives/cn';

interface Param {
  label: string;
  value: React.ReactNode;
}

/**
 * Window: карточка задачи Kaiten — поручение с основными параметрами.
 * Соответствует экрану «Подготовить отчёт по исполнению бюджета».
 * Тулбар действий, блок «Основные параметры», метки и приоритет.
 */
export function WindowCardMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)] p-6 md:p-7',
      )}
    >
      {/* title */}
      <h3 className="text-xl font-semibold leading-snug text-(--color-text-primary)">
        Подготовить отчёт по исполнению бюджета за I квартал 2025 года
      </h3>

      {/* meta */}
      <div className="mt-3 text-sm text-(--color-text-secondary)">
        <span className="text-(--color-text-accent) underline underline-offset-2">#64925252</span>{' '}
        Заказчик{' '}
        <span className="text-(--color-text-accent) underline underline-offset-2">Teamlead</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-(--color-text-secondary)">
        <ClockIcon /> Создана день назад
      </div>

      {/* action toolbar */}
      <CardToolbar />

      {/* section header */}
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-(--color-text-primary)">
        <ChevronIcon /> Основные параметры
      </div>

      {/* params */}
      <dl className="mt-4 space-y-3.5">
        <Row label="Расположение">
          <span className="inline-flex items-center gap-2">
            <span className="text-(--color-text-accent) underline underline-offset-2">
              Новая доска / Очередь
            </span>
            <SearchIcon />
          </span>
        </Row>
        <Row label="Тип">
          <span className="inline-flex items-center gap-2 rounded-full bg-(--color-surface-section) px-2.5 py-1 text-xs text-(--color-text-primary)">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-(--color-neutral-400) text-[10px] font-semibold text-white">
              C
            </span>
            Card
          </span>
        </Row>
        <Row label="Участники">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-surface-section) py-0.5 pl-0.5 pr-2.5 text-xs text-(--color-text-primary)">
              <span className="h-5 w-5 rounded-full bg-(--color-action-primary)/80" />
              Ответственный
            </span>
            <Avatar letter="N" />
            <Avatar letter="E" />
            <span className="text-(--color-text-secondary)">+</span>
          </span>
        </Row>
        <Row label="Срок">
          <span className="text-(--color-text-primary) underline underline-offset-2">1 мая</span>
        </Row>
        <Row label="Метки">
          <span className="inline-flex flex-wrap items-center gap-2">
            <Tag tone="purple">поручение</Tag>
            <Tag tone="lime">Финансово-экономичес…</Tag>
          </span>
        </Row>
        <Row label="Основание">
          <span className="text-(--color-text-primary)">
            Протокол совещания № 12 от 09.04.2025, п. 3.2
          </span>
        </Row>
        <Row label="Приоритет">
          <Tag tone="red">Высокий</Tag>
        </Row>
      </dl>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-3 text-sm">
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

function CardToolbar() {
  return (
    <div className="mt-5 flex items-center gap-2">
      <ToolbarButton primary>
        <PlusIcon />
      </ToolbarButton>
      <span className="h-px w-3 bg-(--color-border-default)" />
      <ToolbarButton>
        <PlayIcon />
      </ToolbarButton>
      <ToolbarPill>→ В РАБОТЕ</ToolbarPill>
      <ToolbarButton>
        <BoltIcon />
      </ToolbarButton>
      <ToolbarButton>
        <span className="text-base font-bold leading-none text-(--color-text-primary)">!</span>
      </ToolbarButton>
      <ToolbarButton>
        <ShareIcon />
      </ToolbarButton>
      <ToolbarButton>
        <span className="text-base leading-none text-(--color-text-primary)">⋮</span>
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) {
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
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-text-secondary)">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" strokeLinecap="round" />
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
