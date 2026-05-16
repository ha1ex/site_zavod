import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface Event {
  system: string;
  icon: string;
  tone: 'violet' | 'green' | 'blue' | 'orange';
  message: string;
  meta: string;
  status: 'sync' | 'ok' | 'queued';
  active?: boolean;
}

const EVENTS: Event[] = [
  {
    system: '1С: Документооборот',
    icon: 'Building2',
    tone: 'violet',
    message: 'Карточка заявки → согласование № 4521',
    meta: 'webhook · 230 мс',
    status: 'sync',
    active: true,
  },
  {
    system: 'AmoCRM',
    icon: 'Handshake',
    tone: 'orange',
    message: 'Сделка #1843 → задача «Подготовить КП»',
    meta: 'двусторонний sync · 1 мин назад',
    status: 'ok',
  },
  {
    system: 'Telegram',
    icon: 'Send',
    tone: 'blue',
    message: 'Бот поддержки · новая заявка из канала',
    meta: 'inbound · 3 мин назад',
    status: 'queued',
  },
  {
    system: 'GitLab',
    icon: 'GitMerge',
    tone: 'green',
    message: 'MR !318 merged → карточка закрыта',
    meta: 'webhook · 5 мин назад',
    status: 'ok',
  },
];

const TONE_CLASS: Record<Event['tone'], string> = {
  violet: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  green: 'bg-(--color-green-100) text-green-700',
  blue: 'bg-(--color-blue-12) text-(--color-blue-100)',
  orange: 'bg-(--color-orange-100) text-amber-800',
};

const STATUS_LABEL: Record<Event['status'], string> = {
  sync: 'sync',
  ok: '✓ ok',
  queued: '… в очереди',
};

const STATUS_CLASS: Record<Event['status'], string> = {
  sync: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  ok: 'bg-(--color-green-100) text-green-700',
  queued: 'bg-(--color-neutral-200) text-(--color-text-secondary)',
};

/**
 * Mock консоли интеграций — лента событий из подключённых корпоративных систем
 * (1С, AmoCRM, Telegram, GitLab). Тон: «всё, что происходит во внешних
 * системах, видно здесь». Используется в MediaCopy variant='integrations-console'
 * и Hero visual.variant='integrations-console'.
 */
export function IntegrationsConsoleMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      {/* window chrome */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Интеграции · Лента событий</span>
          <span>14 систем</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Live
          </span>
        </div>
      </div>

      <div className="space-y-2 p-4 md:p-5">
        {EVENTS.map((e, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start gap-3 rounded-(--radius-xl) border bg-(--color-surface-page) p-3',
              e.active
                ? 'border-(--color-action-primary)/40 shadow-sm'
                : 'border-(--color-border-default)',
              !e.active && i === 3 && 'opacity-60',
            )}
          >
            <span
              className={cn(
                'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-xl)',
                TONE_CLASS[e.tone],
              )}
            >
              <Icon name={e.icon} className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11.5px] font-semibold text-(--color-text-primary)">
                  {e.system}
                </span>
                <span
                  className={cn(
                    'inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium leading-none',
                    STATUS_CLASS[e.status],
                  )}
                >
                  {STATUS_LABEL[e.status]}
                </span>
              </div>
              <div className="mt-0.5 truncate text-[11px] text-(--color-text-primary)">
                {e.message}
              </div>
              <div className="mt-0.5 truncate text-[10px] text-(--color-text-secondary)">
                {e.meta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
