import type { ReactNode } from 'react';
import { cn } from '../primitives/cn';

/**
 * SectionMock — HTML/Tailwind UI-моки для секций лендинга.
 *
 * Реализует 6 шаблонов, выведенных из эталонного лендинга
 * `wiki/landings/kaiten-techsupport-reference.md` и описанных в skill'е
 * `packages/harness/src/prompts/section-mock-skill.md`. Каждая структура
 * соответствует `MockUiSchema` в `packages/harness/src/schemas/landing-spec.ts`.
 *
 * Используется через prop `mockUi` на `HeroSection`, `FeatureGrid`, `FinalCta`.
 * Если prop не передан — компонент не рендерится (backwards-compatible).
 *
 * Все цвета/радиусы/тени — через DS-токены (см. `packages/ui/src/tokens.css`).
 * Эмодзи — 0-1 на mock. Тексты — domain-specific, никаких Lorem ipsum.
 */

/* ─── Types (mirrors MockUiSchema from harness) ───────────────────── */

type AccentTone = 'primary' | 'green' | 'orange' | 'red' | 'blue';
type BadgeTone = 'red' | 'amber' | 'emerald' | 'neutral' | 'blue';

export interface BoardMockProps {
  template: 'board';
  content: {
    tabs: string[];
    activeTab?: string;
    columns: Array<{
      title: string;
      count?: number;
      cards: Array<{
        title: string;
        meta?: string;
        accent: AccentTone;
        badges?: Array<{ label: string; tone: BadgeTone }>;
        active?: boolean;
        dim?: boolean;
      }>;
    }>;
    activeEmoji?: '☝️' | '✋' | null;
  };
}

export interface ChatMockProps {
  template: 'chat';
  content: {
    ticketId: string;
    ticketTitle: string;
    ticketSubtitle?: string;
    messages: Array<{ role: 'in' | 'out'; author?: string; text: string }>;
    checklist?: Array<{ label: string; done: boolean }>;
  };
}

export interface ChecklistMockProps {
  template: 'checklist';
  content: {
    title?: string;
    items: Array<{ label: string; done: boolean }>;
  };
}

export interface ArticleMockProps {
  template: 'article';
  content: {
    sidebarItems: Array<{ label: string; active: boolean }>;
    emoji?: '📌' | '🧑‍💻' | '📋' | '📒' | '🔒' | null;
    badge: { label: string; tone: 'violet' | 'blue' | 'emerald' | 'amber' };
    title: string;
    subtitle?: string;
    bodyBars?: 3 | 4;
  };
}

export interface KpiMockProps {
  template: 'kpi';
  content: {
    tiles: Array<{
      value: string;
      trend?: { direction: 'up' | 'down'; tone: 'positive' | 'negative' };
      label: string;
    }>;
  };
}

export interface ConsoleMockProps {
  template: 'console';
  content: {
    title?: string;
    lines: Array<{
      kind: 'comment' | 'cmd' | 'output' | 'success' | 'error';
      text: string;
    }>;
  };
}

export type SectionMockUi =
  | BoardMockProps
  | ChatMockProps
  | ChecklistMockProps
  | ArticleMockProps
  | KpiMockProps
  | ConsoleMockProps;

export interface SectionMockProps {
  mock: SectionMockUi;
  className?: string;
}

/* ─── Shared primitives ───────────────────────────────────────────── */

const BRAND_SHADOW = 'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]';

const accentBarClass: Record<AccentTone, string> = {
  primary: 'bg-(--color-action-primary)',
  green: 'bg-(--color-green-100)',
  orange: 'bg-(--color-orange-100)',
  red: 'bg-(--color-red-100)',
  blue: 'bg-(--color-blue-100)',
};

const badgeToneClass: Record<BadgeTone, string> = {
  red: 'bg-(--color-red-100)/15 text-(--color-red-700)',
  amber: 'bg-(--color-amber-100) text-(--color-amber-800)',
  emerald: 'bg-(--color-emerald-100) text-(--color-emerald-800)',
  neutral: 'bg-(--color-neutral-200) text-(--color-text-secondary)',
  blue: 'bg-(--color-blue-12) text-(--color-blue-100)',
};

const articleBadgeToneClass: Record<'violet' | 'blue' | 'emerald' | 'amber', string> = {
  violet: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  blue: 'bg-(--color-blue-12) text-(--color-blue-100)',
  emerald: 'bg-(--color-emerald-100) text-(--color-emerald-800)',
  amber: 'bg-(--color-amber-100) text-(--color-amber-800)',
};

function WindowChrome({ tabs, activeTab }: { tabs: string[]; activeTab?: string }) {
  const active = activeTab ?? tabs[0];
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
      <span className="h-2 w-2 rounded-full bg-(--color-red-300)" />
      <span className="h-2 w-2 rounded-full bg-(--color-yellow-300)" />
      <span className="h-2 w-2 rounded-full bg-(--color-green-300)" />
      <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
        {tabs.map((t) =>
          t === active ? (
            <span key={t} className="font-medium text-(--color-text-primary)">
              {t}
            </span>
          ) : (
            <span key={t}>{t}</span>
          ),
        )}
      </div>
    </div>
  );
}

function MockShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl) border border-(--color-border-default)',
        'bg-(--color-surface-card)',
        BRAND_SHADOW,
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Template: board ─────────────────────────────────────────────── */

function BoardMock({ content }: BoardMockProps) {
  const { tabs, activeTab, columns, activeEmoji } = content;
  return (
    <MockShell>
      <WindowChrome tabs={tabs} activeTab={activeTab} />
      <div
        className={cn(
          'grid gap-3 p-3 md:p-4',
          columns.length === 3 && 'grid-cols-3',
          columns.length === 4 && 'grid-cols-4',
          columns.length === 5 && 'grid-cols-5',
        )}
      >
        {columns.map((col, ci) => (
          <div key={ci} className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-(--color-text-secondary)">
              <span>{col.title}</span>
              {typeof col.count === 'number' && (
                <span className="rounded-full bg-(--color-neutral-200) px-1.5 text-[9px] text-(--color-text-secondary)">
                  {col.count}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {col.cards.map((card, i) => (
                <div
                  key={i}
                  className={cn(
                    'relative rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) p-2.5',
                    card.active && 'translate-y-[-2px] shadow-md',
                    card.dim && 'opacity-60',
                  )}
                >
                  <div className={cn('mb-1.5 h-1 w-8 rounded-full', accentBarClass[card.accent])} />
                  <div className="text-[11.5px] font-semibold leading-tight text-(--color-text-primary)">
                    {card.title}
                  </div>
                  {card.meta && (
                    <div className="mt-1 truncate text-[10px] text-(--color-text-secondary)">
                      {card.meta}
                    </div>
                  )}
                  {card.badges && card.badges.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      {card.badges.map((b, bi) => (
                        <span
                          key={bi}
                          className={cn(
                            'inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium',
                            badgeToneClass[b.tone],
                          )}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {card.active && activeEmoji && (
                    <span className="pointer-events-none absolute -right-2 -bottom-2 text-lg drop-shadow-sm">
                      {activeEmoji}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MockShell>
  );
}

/* ─── Template: chat ──────────────────────────────────────────────── */

function ChatMock({ content }: ChatMockProps) {
  const { ticketId, ticketTitle, ticketSubtitle, messages, checklist } = content;
  return (
    <MockShell>
      <WindowChrome tabs={[ticketId, 'История', 'Связанные']} activeTab={ticketId} />
      <div className="space-y-4 p-4 md:p-5">
        <div>
          <div className="text-sm font-semibold text-(--color-text-primary)">{ticketTitle}</div>
          {ticketSubtitle && (
            <div className="mt-0.5 text-xs text-(--color-text-secondary)">{ticketSubtitle}</div>
          )}
        </div>
        <div className="space-y-2.5">
          {messages.map((m, i) =>
            m.role === 'in' ? (
              <div
                key={i}
                className="max-w-[85%] rounded-2xl rounded-bl-md bg-(--color-neutral-100) px-4 py-2.5 text-sm text-(--color-text-primary)"
              >
                {m.text}
              </div>
            ) : (
              <div
                key={i}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-(--color-action-primary-soft) px-4 py-2.5 text-sm text-(--color-text-primary)"
              >
                {m.text}
              </div>
            ),
          )}
        </div>
        {checklist && checklist.length > 0 && (
          <div className="space-y-2 rounded-(--radius-xl) bg-(--color-surface-section) p-3">
            {checklist.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {c.done ? (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-(--color-action-primary) text-xs font-semibold text-(--color-text-inverse)">
                    ✓
                  </span>
                ) : (
                  <span className="inline-flex h-5 w-5 rounded-md border border-(--color-border-default) bg-(--color-surface-page)" />
                )}
                <span
                  className={cn(
                    'text-sm',
                    c.done
                      ? 'text-(--color-text-secondary) line-through'
                      : 'text-(--color-text-primary)',
                  )}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </MockShell>
  );
}

/* ─── Template: checklist ─────────────────────────────────────────── */

function ChecklistMock({ content }: ChecklistMockProps) {
  const { title, items } = content;
  return (
    <div
      aria-hidden
      className={cn(
        'rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-card) p-6',
        BRAND_SHADOW,
      )}
    >
      {title && (
        <div className="mb-4 text-sm font-semibold text-(--color-text-primary)">{title}</div>
      )}
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            {item.done ? (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-(--color-action-primary) text-xs font-semibold text-(--color-text-inverse)">
                ✓
              </span>
            ) : (
              <span className="inline-flex h-5 w-5 rounded-md border border-(--color-border-default) bg-(--color-surface-page)" />
            )}
            <span
              className={cn(
                'text-sm',
                item.done
                  ? 'text-(--color-text-secondary) line-through'
                  : 'text-(--color-text-primary)',
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Template: article ───────────────────────────────────────────── */

function ArticleMock({ content }: ArticleMockProps) {
  const { sidebarItems, emoji, badge, title, subtitle, bodyBars = 3 } = content;
  const barWidths = bodyBars === 4 ? ['w-full', 'w-5/6', 'w-4/6', 'w-3/4'] : ['w-full', 'w-5/6', 'w-4/6'];
  return (
    <MockShell>
      <WindowChrome tabs={['База знаний', 'Поиск', 'Категории']} activeTab="База знаний" />
      <div className="grid grid-cols-[120px_1fr] gap-3 p-4 md:gap-4 md:p-5">
        <div className="space-y-1.5">
          {sidebarItems.map((it, i) => (
            <div
              key={i}
              className={cn(
                'h-2 rounded-full',
                it.active
                  ? 'w-full bg-(--color-action-primary)'
                  : 'w-5/6 bg-(--color-neutral-200)',
              )}
            />
          ))}
        </div>
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-4">
          <div className="flex items-center gap-2">
            {emoji && <span className="text-lg leading-none">{emoji}</span>}
            <span
              className={cn(
                'inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium',
                articleBadgeToneClass[badge.tone],
              )}
            >
              {badge.label}
            </span>
          </div>
          <div className="mt-2 text-sm font-semibold leading-tight text-(--color-text-primary)">
            {title}
          </div>
          {subtitle && (
            <div className="mt-1 text-xs text-(--color-text-secondary)">{subtitle}</div>
          )}
          <div className="mt-3 space-y-1.5">
            {barWidths.map((w, i) => (
              <div
                key={i}
                className={cn('h-2 rounded-full bg-(--color-neutral-200)', w)}
              />
            ))}
          </div>
        </div>
      </div>
    </MockShell>
  );
}

/* ─── Template: kpi ───────────────────────────────────────────────── */

function KpiMock({ content }: KpiMockProps) {
  const { tiles } = content;
  return (
    <div
      aria-hidden
      className={cn(
        'grid gap-4',
        tiles.length === 3 && 'grid-cols-3',
        tiles.length === 4 && 'grid-cols-2 md:grid-cols-4',
      )}
    >
      {tiles.map((tile, i) => (
        <div
          key={i}
          className={cn(
            'rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-card) p-6',
          )}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tabular-nums text-(--color-text-primary) md:text-4xl">
              {tile.value}
            </span>
            {tile.trend && (
              <span
                className={cn(
                  'text-sm',
                  tile.trend.tone === 'positive'
                    ? 'text-(--color-green-100)'
                    : 'text-(--color-red-100)',
                )}
              >
                {tile.trend.direction === 'up' ? '▲' : '▼'}
              </span>
            )}
          </div>
          <div className="mt-1.5 text-sm text-(--color-text-secondary)">{tile.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Template: console ───────────────────────────────────────────── */

const consoleLineClass: Record<ConsoleMockProps['content']['lines'][number]['kind'], string> = {
  comment: 'text-(--color-neutral-500)',
  cmd: 'text-(--color-neutral-100)',
  output: 'text-(--color-neutral-300)',
  success: 'text-(--color-green-300)',
  error: 'text-(--color-red-300)',
};

function ConsoleMock({ content }: ConsoleMockProps) {
  const { title, lines } = content;
  return (
    <div
      aria-hidden
      className={cn(
        'overflow-hidden rounded-(--radius-3xl) border border-(--color-slate-700)',
        'bg-(--color-slate-950) font-mono text-sm',
        BRAND_SHADOW,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-(--color-slate-700) bg-(--color-slate-700)/30 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-(--color-red-300)" />
        <span className="h-2 w-2 rounded-full bg-(--color-yellow-300)" />
        <span className="h-2 w-2 rounded-full bg-(--color-green-300)" />
        {title && (
          <span className="ml-2 text-[11px] text-(--color-neutral-400)">{title}</span>
        )}
      </div>
      <div className="space-y-1 p-4">
        {lines.map((line, i) => (
          <div key={i} className={cn('leading-snug', consoleLineClass[line.kind])}>
            {line.kind === 'cmd' ? (
              <span>
                <span className="text-(--color-neutral-500)">$ </span>
                {line.text}
              </span>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dispatcher ──────────────────────────────────────────────────── */

export function SectionMock({ mock, className }: SectionMockProps) {
  const inner = (() => {
    switch (mock.template) {
      case 'board':
        return <BoardMock {...mock} />;
      case 'chat':
        return <ChatMock {...mock} />;
      case 'checklist':
        return <ChecklistMock {...mock} />;
      case 'article':
        return <ArticleMock {...mock} />;
      case 'kpi':
        return <KpiMock {...mock} />;
      case 'console':
        return <ConsoleMock {...mock} />;
    }
  })();
  return className ? <div className={className}>{inner}</div> : inner;
}
