import { cn } from '../../primitives/cn';
import { ScaleToFit } from './ScaleToFit';

interface Comment {
  author: string;
  time: string;
  text: React.ReactNode;
  reactions?: string[];
}

const COMMENTS: Comment[] = [
  {
    author: 'Алексей',
    time: '20 апр. 2026 г., 14:20',
    text: (
      <>
        <Mention>@e_lebedeva</Mention> Созвон провели, обещали вернуться с правками завтра
      </>
    ),
    reactions: ['🔥', '💪', '❤️'],
  },
  {
    author: 'Елена',
    time: '14 апр. 2026 г., 13:01',
    text: (
      <>
        <Mention>@a_filimonov</Mention> <Mention>@e_lebedeva</Mention> Коллеги, посмотрели концепты,
        всё нравится, но есть пара моментов — давайте проговорим голосом на статусе 20 апреля в 12:00
      </>
    ),
  },
  {
    author: 'Алексей',
    time: '14 апр. 2026 г., 12:53',
    text: (
      <>
        <Mention>@e_lebedeva</Mention> Супер, назначаю встречу с клиентом для презентации
      </>
    ),
  },
  {
    author: 'Екатерина',
    time: '14 апр. 2026 г., 10:20',
    text: (
      <>
        <Mention>@a_filimonov</Mention> Новые концепты прикрепила в карточку
      </>
    ),
  },
];

const CHECKLIST = [
  { text: 'Собрать требования от клиента', done: true },
  { text: 'Отправить концепт на согласование', done: true },
  { text: 'Утвердить финальный дизайн', done: false },
];

/**
 * Window: модальное окно проектной карточки со сплит-видом —
 * слева проект (блокировка, метки, таймлайн, бюджет, чек-лист, дочерние
 * карточки), справа панель комментариев. Экран «Редизайн сайта».
 */
export function WindowProjectModalMock() {
  return (
    <ScaleToFit designWidth={800} className="mx-auto w-full max-w-[800px]">
    <div
      aria-hidden
      className={cn(
        'grid w-[800px] grid-cols-[1.35fr_1fr] overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)]',
      )}
    >
      {/* — card column — */}
      <div className="border-r border-(--color-border-default) p-5">
        <h3 className="text-xl font-semibold text-(--color-text-primary)">Редизайн сайта</h3>
        <div className="mt-2 text-sm text-(--color-text-secondary)">
          <span className="text-(--color-text-accent) underline underline-offset-2">#54670184</span>{' '}
          Заказчик{' '}
          <span className="text-(--color-text-accent) underline underline-offset-2">Алексей</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-(--color-text-secondary)">
          <ClockIcon /> Создана 16 дней назад
        </div>

        {/* toolbar with running timer */}
        <div className="mt-3 flex items-center gap-2">
          <TBtn primary>
            <PlusIcon />
          </TBtn>
          <span className="mx-2 h-px flex-1 bg-(--color-border-default)" />
          <span className="inline-flex h-9 items-center gap-2 rounded-full border border-(--color-border-default) bg-(--color-surface-card) px-3 text-xs font-medium tabular-nums text-(--color-text-primary)">
            <span className="h-3 w-3 rounded-[3px] bg-(--color-action-primary)" /> 1:12:09
          </span>
          <TPill>→ ГОТОВО</TPill>
          <TBtn>
            <b className="text-base leading-none">!</b>
          </TBtn>
          <TBtn>
            <ShareIcon />
          </TBtn>
          <TBtn>⋮</TBtn>
        </div>

        {/* blocked banner */}
        <div className="mt-4 rounded-(--radius-2xl) bg-(--color-red-12) p-3.5">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="h-6 w-6 shrink-0 rounded-full bg-(--color-neutral-400)" />
            <span className="font-semibold text-(--color-text-primary)">
              Алексей заблокировал(а) карточку
            </span>
            <span className="text-[11px] text-(--color-text-secondary)">14 февр. 2026 г., 15:02</span>
          </div>
          <div className="mt-1.5 pl-8 text-[13px] text-(--color-text-primary)">
            Утверждение нового концепта
          </div>
        </div>

        {/* params */}
        <dl className="mt-4 space-y-2.5">
          <Row label="Расположение">
            <span className="inline-flex items-center gap-2">
              <span className="text-(--color-text-accent) underline underline-offset-2">
                Задачи на проектах / В работе
              </span>
              <SearchIcon />
            </span>
          </Row>
          <Row label="Тип">
            <span className="inline-flex items-center gap-2 rounded-full bg-(--color-surface-section) px-2.5 py-1 text-xs text-(--color-text-primary)">
              💼 Проект
            </span>
          </Row>
          <Row label="Участники">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-surface-section) py-0.5 pl-0.5 pr-2.5 text-xs">
                <span className="h-5 w-5 rounded-full bg-(--color-action-primary)/70" /> Ответственный
              </span>
              <span className="h-5 w-5 rounded-full bg-(--color-neutral-300)" />
              <span className="text-lg text-(--color-text-secondary)">+</span>
            </span>
          </Row>
          <Row label="Метки">
            <span className="inline-flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-(--color-orange-12) px-3 py-1 text-xs text-(--color-text-primary)">
                Дизайн
              </span>
              <span className="inline-flex items-center rounded-full bg-(--color-blue-12) px-3 py-1 text-xs text-(--color-text-primary)">
                Редизайн
              </span>
            </span>
          </Row>
          <Row label="Timeline">
            <span className="text-(--color-text-accent) underline underline-offset-2">
              2 марта 9:00 – 15 апреля 18:00
            </span>
          </Row>
          <Row label="Бюджет">
            <span className="tabular-nums text-(--color-text-primary)">800 000</span>
          </Row>
          <Row label="Проект">
            <span className="inline-flex items-center rounded-full bg-(--color-orange-12) px-3 py-1 text-xs text-(--color-text-primary)">
              Доставка продуктов
            </span>
          </Row>
        </dl>

        {/* checklist */}
        <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-(--color-text-primary)">
          <CheckIcon /> Чек-лист
        </div>
        <div className="mt-2.5 flex items-center gap-3">
          <span className="text-xs tabular-nums text-(--color-text-secondary)">66%</span>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-(--color-surface-section)">
            <span className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-(--color-action-primary)" />
          </span>
          <span className="text-xs tabular-nums text-(--color-text-secondary)">2/3</span>
        </div>
        <div className="mt-2.5 space-y-2">
          {CHECKLIST.map((it) => (
            <div key={it.text} className="flex items-center gap-2.5 text-[13px]">
              <span
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center rounded-md border text-[12px]',
                  it.done
                    ? 'border-(--color-action-primary) bg-(--color-action-primary) text-white'
                    : 'border-(--color-border-default) bg-white',
                )}
              >
                {it.done ? '✓' : ''}
              </span>
              <span className="text-(--color-text-primary)">{it.text}</span>
            </div>
          ))}
        </div>
        <span className="mt-3 inline-flex h-8 items-center rounded-(--radius-lg) border border-(--color-border-default) px-3 text-xs font-medium text-(--color-text-secondary)">
          ДОБАВИТЬ ПУНКТ
        </span>

        {/* relations */}
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[13px] font-medium text-(--color-text-primary)">
            <RelationIcon /> Связи
          </span>
          <span className="flex items-center gap-2 text-(--color-text-secondary)">
            <FilterIcon />
            <span className="inline-flex overflow-hidden rounded-(--radius-lg)">
              {['◷', '»', '✓'].map((s, i) => (
                <span
                  key={i}
                  className="flex h-6 w-7 items-center justify-center bg-(--color-action-primary) text-xs text-white"
                >
                  {s}
                </span>
              ))}
            </span>
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[13px] text-(--color-text-secondary)">
          Дочерние карточки
          <span className="inline-flex items-center gap-1 rounded-(--radius-lg) border border-(--color-border-default) px-2 py-1 text-xs">
            Список <CaretIcon />
          </span>
        </div>
        <ChildCard title="Верстка главной страницы" />
        <ChildCard title="Тестирование главной и каталога" />
        <span className="mt-3 inline-flex h-8 items-center rounded-(--radius-lg) border border-(--color-border-default) px-3 text-xs font-medium text-(--color-text-secondary)">
          ДОБАВИТЬ ДОЧЕРНЮЮ КАРТОЧКУ
        </span>
      </div>

      {/* — comments column — */}
      <div className="flex flex-col bg-(--color-surface-card) p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-(--color-text-primary)">Комментарии</span>
          <span className="flex items-center gap-3 text-(--color-text-secondary)">
            <ExpandFullIcon />
            <CloseIcon />
          </span>
        </div>
        <div className="flex-1 rounded-(--radius-2xl) border border-(--color-border-default) p-4">
          <div className="mb-3 flex items-center justify-end gap-2 text-(--color-text-secondary)">
            <span className="inline-flex items-center gap-1 rounded-(--radius-lg) border border-(--color-border-default) px-2 py-1 text-xs">
              Все <CaretIcon />
            </span>
            <span className="h-4 w-5 rounded-sm border border-(--color-border-default)" />
            <span className="h-4 w-5 rounded-sm border border-(--color-border-default) bg-(--color-surface-section)" />
            <ExpandArrowsIcon />
          </div>
          <div className="flex items-center gap-2.5 rounded-(--radius-xl) border border-(--color-border-default) px-3 py-2.5 text-sm text-(--color-text-secondary)">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--color-surface-section) text-[11px]">
              A
            </span>
            Напишите комментарий
          </div>
          <div className="mt-3 space-y-3">
            {COMMENTS.map((c, i) => (
              <CommentItem key={i} {...c} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </ScaleToFit>
  );
}

/* ——— blocks ——— */
function CommentItem({ author, time, text, reactions }: Comment) {
  return (
    <div className="flex gap-2.5">
      <span className="h-7 w-7 shrink-0 rounded-full bg-(--color-surface-section)" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-(--color-text-primary)">{author}</span>
          <span className="text-[11px] text-(--color-text-secondary)">{time}</span>
        </div>
        <div className="mt-1.5 rounded-(--radius-xl) bg-(--color-surface-section) px-3 py-2 text-xs leading-snug text-(--color-text-primary)">
          {text}
        </div>
        {reactions && (
          <div className="mt-1.5 flex gap-1.5">
            {reactions.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 rounded-full bg-(--color-surface-section) px-2 py-0.5 text-xs text-(--color-text-secondary)"
              >
                {r} 1
              </span>
            ))}
          </div>
        )}
        <div className="mt-1.5 flex gap-2 text-xs text-(--color-text-secondary)">
          <span className="underline underline-offset-2">цитировать</span>
          или
          <span className="underline underline-offset-2">ответить</span>
        </div>
      </div>
    </div>
  );
}

function Mention({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-(--color-text-accent)">{children}</span>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-3 text-[13px]">
      <dt className="text-(--color-text-secondary)">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ChildCard({ title }: { title: string }) {
  return (
    <div className="relative mt-2 overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) px-3 py-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-(--color-text-primary)">{title}</span>
        <span className="flex items-center gap-2 text-(--color-text-secondary)">
          <span className="inline-flex items-center gap-0.5 text-xs">
            <ClipIcon /> 1
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs">
            <ChatIcon /> 1
          </span>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--color-surface-section) text-[10px]">
            A
          </span>
          <span className="text-(--color-green-100)">
            <CalIcon />
          </span>
        </span>
      </div>
    </div>
  );
}

function TBtn({ children, primary }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full text-(--color-text-primary)',
        primary
          ? 'bg-(--color-action-primary) text-white'
          : 'border border-(--color-border-default) bg-(--color-surface-card)',
      )}
    >
      {children}
    </span>
  );
}
function TPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-9 items-center rounded-full border border-(--color-border-default) bg-(--color-surface-card) px-4 text-xs font-medium text-(--color-text-primary)">
      {children}
    </span>
  );
}

/* ——— icons ——— */
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
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
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-text-secondary)">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11l-8.5 8.5a4 4 0 01-6-6L14 5a2.7 2.7 0 014 4l-8.5 8.5a1.3 1.3 0 01-2-2L14 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RelationIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="12" r="2" />
      <path d="M8 6h4a4 4 0 014 4M8 18h4a4 4 0 004-4" strokeLinecap="round" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5h18l-7 8v5l-4 2v-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
function CaretIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ExpandFullIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
function ExpandArrowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 7L4 12l4 5M16 7l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
