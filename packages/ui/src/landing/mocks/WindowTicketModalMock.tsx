import { cn } from '../../primitives/cn';
import { ScaleToFit } from './ScaleToFit';

interface Comment {
  author: string;
  time: string;
  text: React.ReactNode;
  tone: 'amber' | 'gray';
}

const COMMENTS: Comment[] = [
  {
    author: 'Алексей',
    time: '13 февр. 2026 г., 12:53',
    tone: 'amber',
    text: (
      <>
        <Mention>@e_lebedeva</Mention> Зафиксировал, забираю в работу
      </>
    ),
  },
  {
    author: 'Екатерина',
    time: '13 февр. 2026 г., 12:46',
    tone: 'amber',
    text: (
      <>
        <Mention>@a_savin</Mention> Обрати внимание, что изображения формата GIF имеют проблемы с
        загрузкой. Нужно сделать предупреждение об этом в форме.
      </>
    ),
  },
  {
    author: 'Екатерина',
    time: '12 февр. 2026 г., 10:24',
    tone: 'gray',
    text: 'Анна, проблема по вашей заявке «Не могу загрузить изображение» решена. Вы можете проверить, всё ли у вас работает, и поставить оценку нашей службе поддержки прямо в письме или на портале Service Desk.',
  },
];

/**
 * Window: модальное окно карточки обращения Service Desk со сплит-видом —
 * слева карточка (техподдержка, описание, файлы, связи), справа панель
 * комментариев с перепиской команды. Экран «Не могу загрузить изображение».
 */
export function WindowTicketModalMock() {
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
        <h3 className="text-xl font-semibold text-(--color-text-primary)">
          Не могу загрузить изображение
        </h3>
        <div className="mt-1.5 text-sm text-(--color-text-accent) underline underline-offset-2">
          #54670184
        </div>

        {/* toolbar */}
        <div className="mt-3 flex items-center gap-2">
          <TBtn primary>
            <PlusIcon />
          </TBtn>
          <span className="mx-2 h-px flex-1 bg-(--color-border-default)" />
          <TBtn>
            <PlayIcon />
          </TBtn>
          <TPill>→ ГОТОВО</TPill>
          <TBtn>
            <b className="text-base leading-none">!</b>
          </TBtn>
          <TBtn>
            <ShareIcon />
          </TBtn>
          <TBtn>⋮</TBtn>
        </div>

        {/* support panel */}
        <div className="mt-4 rounded-(--radius-2xl) bg-(--color-blue-12) p-3.5 text-xs">
          <div className="flex items-center gap-2 text-sm font-semibold text-(--color-text-primary)">
            <HeadsetIcon /> Техподдержка
          </div>
          <div className="mt-2 text-(--color-text-primary)">
            Автор: Анна (anna@mail.ru){' '}
            <span className="text-(--color-text-accent) underline underline-offset-2">изменить</span>
          </div>
          <div className="mt-1 text-(--color-text-primary)">
            SLA:{' '}
            <span className="text-(--color-text-accent) underline underline-offset-2">выбрать sla</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-(--color-text-accent)">
            <span className="underline underline-offset-2">
              Добавить дополнительных адресатов для получения уведомлений
            </span>
            <HelpIcon />
          </div>
          <div className="my-2.5 h-px bg-(--color-blue-100)/20" />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-medium text-(--color-blue-100)">
              <ChatIcon /> Новые комментарии в заявке
            </span>
            <span className="font-medium text-(--color-blue-100)">ОТМЕТИТЬ КАК ПРОЧИТАННОЕ</span>
          </div>
        </div>

        {/* params */}
        <dl className="mt-4 space-y-2.5">
          <Row label="Расположение">
            <span className="inline-flex items-center gap-2">
              <span className="text-(--color-text-accent) underline underline-offset-2">
                Спринт / В работе (Срочно)
              </span>
              <SearchIcon />
            </span>
          </Row>
          <Row label="Тип">
            <span className="inline-flex items-center gap-2 rounded-full bg-(--color-surface-section) px-2.5 py-1 text-xs text-(--color-text-primary)">
              <span className="text-(--color-red-100)">✳</span> Card
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
          <Row label="Срок">
            <span className="text-(--color-text-primary) underline underline-offset-2">22 февр.</span>
          </Row>
        </dl>

        {/* description */}
        <Section icon={<LinesIcon />} title="Описание" />
        <p className="mt-2 text-[13px] text-(--color-text-primary)">
          Не могу загрузить изображение в статью. Пишет, что файл не подходит под стандарты.
        </p>

        {/* files */}
        <Section icon={<ClipIcon />} title="Файлы" />
        <div className="mt-3 flex items-center gap-3">
          <span className="h-12 w-16 overflow-hidden rounded-md border border-(--color-border-default)">
            <svg width="64" height="48" viewBox="0 0 64 48" aria-hidden>
              <rect width="64" height="48" fill="white" />
              <polygon points="2,44 2,40 16,38 31,36 46,34 62,32 62,44" fill="var(--color-green-100)" />
              <polygon points="2,34 16,30 31,27 46,24 62,21 62,32 46,34 31,36 16,38 2,40" fill="var(--color-blue-100)" />
              <polygon points="2,28 16,23 31,18 46,14 62,10 62,21 46,24 31,27 16,30 2,34" fill="var(--color-action-primary)" />
            </svg>
          </span>
          <div>
            <div className="text-sm text-(--color-text-accent) underline underline-offset-2">
              накопительная диаграмма
            </div>
            <div className="text-xs text-(--color-text-secondary)">Добавлен 3 минуты назад</div>
          </div>
        </div>

        {/* relations */}
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-(--color-text-primary)">
            <RelationIcon /> Связи
          </span>
          <RelationToggle />
        </div>
        <div className="mt-3 flex items-center justify-between text-[13px] text-(--color-text-secondary)">
          Дочерние карточки
          <span className="inline-flex items-center gap-1 rounded-(--radius-lg) border border-(--color-border-default) px-2 py-1 text-xs">
            Список <CaretIcon />
          </span>
        </div>
        <ChildCard title="Исправить баг при добавлении GIF" />
      </div>

      {/* — comments column — */}
      <CommentsColumn withTemplate />
    </div>
    </ScaleToFit>
  );
}

/* ——— shared blocks ——— */
function CommentsColumn({ withTemplate }: { withTemplate?: boolean }) {
  return (
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
        {withTemplate && (
          <div className="mt-2 flex items-center justify-between rounded-(--radius-xl) border border-(--color-border-default) px-3 py-2.5 text-sm text-(--color-text-secondary)">
            Выберите шаблонный ответ <CaretIcon />
          </div>
        )}
        <div className="mt-3 space-y-3">
          {COMMENTS.map((c, i) => (
            <CommentItem key={i} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  author,
  time,
  text,
  tone,
  reactions,
}: Comment & { reactions?: string[] }) {
  return (
    <div className="flex gap-2.5">
      <span className="h-7 w-7 shrink-0 rounded-full bg-(--color-surface-section)" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-(--color-text-primary)">{author}</span>
          <span className="text-[11px] text-(--color-text-secondary)">{time}</span>
        </div>
        <div
          className={cn(
            'mt-1.5 rounded-(--radius-xl) px-3 py-2 text-xs leading-snug text-(--color-text-primary)',
            tone === 'amber' ? 'bg-(--color-orange-12)' : 'bg-(--color-surface-section)',
          )}
        >
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

function Section({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-(--color-text-primary)">
      {icon} {title}
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

function RelationToggle() {
  return (
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
function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 113.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01" strokeLinecap="round" />
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
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--color-text-secondary)">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" strokeLinecap="round" />
    </svg>
  );
}
function LinesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
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
