import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface ChatItem {
  letter: string;
  tone: 'violet' | 'blue' | 'green' | 'orange';
  name: string;
  preview: string;
  time: string;
  active?: boolean;
  unread?: boolean;
}

interface Message {
  from: 'me' | 'them';
  author?: string;
  text: string;
  time: string;
  reaction?: string;
  replies?: number;
  avatars?: number;
}

const CHATS: ChatItem[] = [
  {
    letter: 'T',
    tone: 'violet',
    name: 'Нам надо срочно что-то обсуд…',
    preview: 'Екатерина: а еще если перейти в другой чат…',
    time: '15:55',
    active: true,
  },
  {
    letter: 'G',
    tone: 'blue',
    name: 'General',
    preview: 'Сообщений пока нет',
    time: '10:54',
  },
  {
    letter: 'M',
    tone: 'green',
    name: 'Marketing team',
    preview: 'Коллеги, у меня мм вот в с…',
    time: '10 июн.',
  },
  {
    letter: 'K',
    tone: 'orange',
    name: 'Kaiten Team',
    preview: 'Сообщений пока нет',
    time: '8 июн.',
  },
  {
    letter: 'Э',
    tone: 'violet',
    name: 'Экспресс-дизайн',
    preview: 'Сообщений пока нет',
    time: '6 апр.',
  },
];

const MAIN: Message[] = [
  {
    from: 'them',
    author: 'Kaiten',
    text: '📌 Это чат маркетинга в Кайтен. Всех рады приветствовать. Здесь удобно обсуждать рабочие процессы не отходя от досок с задачами. Чтобы тегнуть, используйте символ @',
    time: '15:31',
  },
  {
    from: 'me',
    text: 'Нам надо срочно что-то обсудить. Го в тред 🧵',
    time: '15:52',
    replies: 4,
    avatars: 2,
  },
];

const THREAD: Message[] = [
  { from: 'me', text: 'Нам надо срочно что-то обсудить. Го в тред 🧵', time: '15:52' },
  {
    from: 'me',
    text: 'Удобно, что сообщения не смешиваются с остальными в чате.',
    time: '15:53',
  },
  {
    from: 'them',
    author: 'Екатерина Борщева',
    text: 'действительно очень удобно, что можно одну тему обсуждать в треде! и не флудить',
    time: '15:53',
    reaction: '❤️',
  },
  {
    from: 'me',
    text: 'А еще их потом легко найти. Во вкладке рядом с чатами)',
    time: '15:54',
  },
  {
    from: 'them',
    author: 'Екатерина Борщева',
    text: 'а еще если перейти в другой чат, то открытый тред всегда справа. можно легко что-то решить в другом чате или оставить открытым, чтобы не забыть ответить 👌',
    time: '15:55',
    reaction: '🔥',
  },
];

const TONE_CLASS: Record<ChatItem['tone'], string> = {
  violet: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  blue: 'bg-(--color-blue-12) text-(--color-blue-100)',
  green: 'bg-(--color-green-12) text-green-700',
  orange: 'bg-(--color-orange-12) text-amber-800',
};

function Bubble({ m }: { m: Message }) {
  const mine = m.from === 'me';
  return (
    <div className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
      {m.author && !mine && (
        <span className="mb-0.5 text-[10px] font-medium text-(--color-text-secondary)">
          {m.author}
        </span>
      )}
      <div
        className={cn(
          'max-w-[88%] rounded-(--radius-xl) px-2.5 py-1.5 text-[11px] leading-snug',
          mine
            ? 'bg-(--color-action-primary) text-white'
            : 'border border-(--color-border-default) bg-(--color-surface-page) text-(--color-text-primary)',
        )}
      >
        {m.text}
      </div>
      <div
        className={cn(
          'mt-0.5 flex items-center gap-1 text-[9px] text-(--color-text-secondary)',
          mine ? 'flex-row-reverse' : 'flex-row',
        )}
      >
        <span>{m.time}</span>
        {m.reaction && (
          <span className="inline-flex h-4 items-center rounded-full border border-(--color-border-default) bg-(--color-surface-page) px-1 leading-none">
            {m.reaction}
          </span>
        )}
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className="flex items-center gap-2 border-t border-(--color-border-default) bg-(--color-surface-page) px-2.5 py-2">
      <Icon name="Paperclip" className="h-3.5 w-3.5 text-(--color-text-secondary)" strokeWidth={2} />
      <span className="flex-1 truncate text-[10px] text-(--color-text-secondary)">
        Напишите сообщение…
      </span>
      <Icon name="Smile" className="h-3.5 w-3.5 text-(--color-text-secondary)" strokeWidth={2} />
      <Icon name="Send" className="h-3.5 w-3.5 text-(--color-action-primary)" strokeWidth={2} />
    </div>
  );
}

export function ThreadsChatMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-secondary)">
          <span className="font-medium text-(--color-text-primary)">Сообщения · Треды</span>
          <span>Marketing team</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Тред открыт
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[150px_1fr_1fr] divide-x divide-(--color-border-default)">
        {/* Список чатов */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-(--color-border-default) px-3 py-2 text-[11px]">
            <span className="inline-flex items-center gap-1 text-(--color-text-secondary)">
              Чаты
              <span className="rounded-full bg-(--color-neutral-200) px-1 text-[9px] text-(--color-text-primary)">
                1
              </span>
            </span>
            <span className="border-b-2 border-(--color-action-primary) pb-0.5 font-medium text-(--color-text-accent)">
              Треды
            </span>
          </div>
          <div className="space-y-0.5 p-1.5">
            {CHATS.map((c, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-2 rounded-(--radius-lg) px-1.5 py-1.5',
                  c.active ? 'bg-(--color-action-primary-soft)' : 'bg-transparent',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                    TONE_CLASS[c.tone],
                  )}
                >
                  {c.letter}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-[10.5px] font-medium text-(--color-text-primary)">
                      {c.name}
                    </span>
                    <span className="ml-auto shrink-0 text-[9px] text-(--color-text-secondary)">
                      {c.time}
                    </span>
                  </div>
                  <div className="truncate text-[9.5px] text-(--color-text-secondary)">
                    {c.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Основной чат */}
        <div className="flex flex-col">
          <div className="flex-1 space-y-3 p-3">
            <div className="flex justify-center">
              <span className="rounded-full bg-(--color-surface-section) px-2 py-0.5 text-[9px] text-(--color-text-secondary)">
                Сегодня
              </span>
            </div>
            {MAIN.map((m, i) => (
              <div key={i}>
                <Bubble m={m} />
                {m.replies && (
                  <div className="mt-1 flex justify-end">
                    <span className="inline-flex items-center gap-1 rounded-full border border-(--color-border-default) bg-(--color-surface-page) px-2 py-0.5 text-[9px] font-medium text-(--color-action-primary)">
                      💬 {m.replies} ответа
                      <Icon name="ChevronRight" className="h-2.5 w-2.5" strokeWidth={2} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Composer />
        </div>

        {/* Панель треда */}
        <div className="flex flex-col bg-(--color-surface-section)/40">
          <div className="flex items-center justify-between border-b border-(--color-border-default) px-3 py-2">
            <span className="text-[11px] font-semibold text-(--color-text-primary)">Тред</span>
            <Icon name="X" className="h-3.5 w-3.5 text-(--color-text-secondary)" strokeWidth={2} />
          </div>
          <div className="flex-1 space-y-2.5 p-3">
            {THREAD.map((m, i) => (
              <Bubble key={i} m={m} />
            ))}
          </div>
          <Composer />
        </div>
      </div>
    </div>
  );
}
