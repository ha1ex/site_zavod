import { cn } from '../../primitives/cn';

/**
 * Сигнатурный визуал лендинга «MCP-сервер Kaiten»: слева окно ИИ-ассистента,
 * который через MCP вызывает Kaiten и заводит задачу; справа — доска Kaiten
 * «Спринт 24», где созданная карточка встала в колонку «В работе».
 * Между панелями — связка MCP. Показывает суть возможности: ассистент
 * управляет задачами Kaiten прямо из диалога. Данные захардкожены
 * (бриф «MCP-сервер Kaiten»). Домен: pm (управление задачами разработки).
 */
export function McpAgentBoardMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative mx-auto w-full max-w-[760px] overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.28)] p-4 md:p-5',
      )}
    >
      <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1.05fr]">
        {/* — ИИ-ассистент — */}
        <AssistantPanel />

        {/* — связка MCP — */}
        <McpLink />

        {/* — доска Kaiten — */}
        <BoardPanel />
      </div>
    </div>
  );
}

function AssistantPanel() {
  return (
    <div className="flex flex-col rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-section) p-3.5">
      {/* window chrome */}
      <div className="flex items-center gap-2 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-red-100)" />
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-lime-100)" />
        <span className="h-2.5 w-2.5 rounded-full bg-(--color-green-100)" />
        <span className="ml-1.5 text-xs font-medium text-(--color-text-secondary)">
          ИИ-ассистент
        </span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-(--color-purple-12) px-2 py-0.5 text-[10px] font-semibold text-purple-800">
          <PlugIcon /> MCP
        </span>
      </div>

      {/* user message */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-(--color-action-primary) px-3 py-2 text-xs leading-snug text-white">
          Заведи задачу: починить flaky-тесты в CI, спринт 24
        </div>
      </div>

      {/* assistant tool call + reply */}
      <div className="mt-3 flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 self-start rounded-lg border border-(--color-border-default) bg-(--color-surface-card) px-2.5 py-1.5 text-[11px] font-medium text-(--color-text-secondary)">
          <TerminalIcon />
          <span className="text-(--color-text-primary)">kaiten.create_card</span>
          <span className="text-(--color-text-secondary)">→ «Спринт 24»</span>
          <TickBadge />
        </div>
        <div className="max-w-[90%] self-start rounded-2xl rounded-bl-sm border border-(--color-border-default) bg-(--color-surface-card) px-3 py-2 text-xs leading-snug text-(--color-text-primary)">
          Готово. Карточку «Починить flaky-тесты в CI» создал и поставил в колонку «В работе».
        </div>
      </div>

      {/* input hint */}
      <div className="mt-auto flex items-center gap-2 pt-3">
        <div className="flex h-8 flex-1 items-center rounded-full border border-(--color-border-default) bg-(--color-surface-card) px-3 text-[11px] text-(--color-text-secondary)">
          Спросить статус спринта…
        </div>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--color-action-primary) text-white">
          <SendIcon />
        </span>
      </div>
    </div>
  );
}

function McpLink() {
  return (
    <div className="flex items-center justify-center">
      {/* horizontal on desktop, vertical on mobile */}
      <div className="hidden items-center gap-1 md:flex md:flex-col">
        <span className="text-[10px] font-semibold tracking-wide text-(--color-text-secondary)">
          MCP
        </span>
        <div className="flex items-center">
          <span className="h-px w-6 bg-(--color-border-strong)" />
          <ArrowRightIcon />
        </div>
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <span className="h-px w-8 bg-(--color-border-strong)" />
        <span className="text-[10px] font-semibold text-(--color-text-secondary)">MCP</span>
        <span className="h-px w-8 bg-(--color-border-strong)" />
      </div>
    </div>
  );
}

function BoardPanel() {
  return (
    <div className="flex flex-col rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-section) p-3.5">
      <div className="flex items-center gap-2 pb-3">
        <BoardIcon />
        <span className="text-xs font-semibold text-(--color-text-primary)">Спринт 24</span>
        <span className="ml-auto text-[10px] text-(--color-text-secondary)">Kaiten</span>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2">
        <Column title="Бэклог" count={5}>
          <Card>Вынести конфиг в env</Card>
          <Card>Обновить зависимости</Card>
        </Column>
        <Column title="В работе" count={3}>
          <Card highlight>Починить flaky-тесты в CI</Card>
          <Card>Ревью API аутентификации</Card>
        </Column>
        <Column title="Готово" count={8}>
          <Card muted>Кеш сборки в CI</Card>
          <Card muted>Логи в JSON</Card>
        </Column>
      </div>
    </div>
  );
}

function Column({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-(--color-text-secondary)">
          {title}
        </span>
        <span className="text-[10px] text-(--color-text-secondary)">{count}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Card({
  children,
  highlight,
  muted,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-(--color-surface-card) px-2 py-2 text-[10px] leading-snug',
        highlight
          ? 'border-(--color-action-primary) text-(--color-text-primary) shadow-[0_0_0_2px_rgba(125,76,207,0.18)]'
          : 'border-(--color-border-default)',
        muted ? 'text-(--color-text-secondary)' : 'text-(--color-text-primary)',
      )}
    >
      <div className="flex items-start gap-1.5">
        <span
          className={cn(
            'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
            highlight ? 'bg-(--color-action-primary)' : 'bg-(--color-border-strong)',
          )}
        />
        <span>{children}</span>
      </div>
      {highlight ? (
        <span className="mt-1.5 inline-flex items-center rounded-full bg-(--color-purple-12) px-1.5 py-0.5 text-[9px] font-semibold text-purple-800">
          новая · от ассистента
        </span>
      ) : null}
    </div>
  );
}

/* — icons — */
function PlugIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 01-10 0zM12 16v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TerminalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TickBadge() {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-(--color-green-100) text-white">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-border-strong)">
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BoardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-text-accent)">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M15 4v16" />
    </svg>
  );
}
