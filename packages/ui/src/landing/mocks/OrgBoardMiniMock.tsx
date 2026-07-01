/**
 * Компактные мок-превью досок Kaiten под секцию «Кайтен работает для всей
 * финансовой организации». По одному мини-борду на подразделение — структура
 * (колонки/логика) взята 1-в-1 из реальных пространств Kaiten, имена людей
 * заменены на инициалы-аватары, чувствительные тайтлы причёсаны. Данные
 * захардкожены; вписывается по ширине родительской карточки FeatureGrid.
 */

type Tone = 'v' | 'g' | 'b' | 'y' | 'r' | 'n';

const TAG_TONE: Record<Tone, string> = {
  v: 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
  g: 'bg-[#e6f4ea] text-[#2f7d32]',
  b: 'bg-[#e4f0fb] text-[#1769aa]',
  y: 'bg-[#faf0cf] text-[#8a6a00]',
  r: 'bg-[#fbe3ec] text-[#c2185b]',
  n: 'bg-(--color-neutral-200) text-(--color-text-secondary)',
};
const DOT_TONE: Record<Tone, string> = {
  v: 'bg-(--color-action-primary)',
  g: 'bg-[#3f9d4a]',
  b: 'bg-[#2b8fd6]',
  y: 'bg-[#e0a92e]',
  r: 'bg-[#e5548a]',
  n: 'bg-(--color-neutral-300)',
};

interface MiniCard {
  title: string;
  tag?: string;
  tone?: Tone;
}
interface MiniCol {
  name: string;
  count: number;
  cards: MiniCard[];
}
interface MiniBoard {
  title: string;
  cols: MiniCol[];
}

const BOARDS: Record<string, MiniBoard> = {
  'mini-org-clients': {
    title: 'Воронка продаж',
    cols: [
      {
        name: 'Входящий поток',
        count: 3,
        cards: [
          { title: 'ООО СпринтЛайн', tag: 'SMB', tone: 'n' },
          { title: 'АО ОблакоПро', tag: 'Mid-market', tone: 'b' },
        ],
      },
      {
        name: 'Согласование',
        count: 2,
        cards: [{ title: 'ООО МетрикЛаб', tag: 'Партнёр', tone: 'v' }],
      },
      {
        name: 'Оплата',
        count: 2,
        cards: [{ title: 'ООО ФлоуБит', tag: 'Enterprise', tone: 'g' }],
      },
    ],
  },
  'mini-org-it': {
    title: 'Sprint',
    cols: [
      {
        name: 'Бэклог',
        count: 4,
        cards: [{ title: 'Форматирование текста', tag: 'Срочно', tone: 'r' }],
      },
      {
        name: 'В работе',
        count: 2,
        cards: [{ title: 'Страница регистрации', tag: 'admin', tone: 'v' }],
      },
      {
        name: 'Готово',
        count: 6,
        cards: [
          { title: 'Поиск по документам', tone: 'g' },
          { title: 'Форма регистрации', tone: 'g' },
        ],
      },
    ],
  },
  'mini-org-legal': {
    title: 'Поручения и дела',
    cols: [
      {
        name: 'Новое поручение',
        count: 3,
        cards: [{ title: 'Договор поставки — ООО «Вектор»', tag: 'Договор', tone: 'b' }],
      },
      {
        name: 'На согласовании',
        count: 3,
        cards: [{ title: 'Аренда офиса — АйТи Сервис', tag: 'Договор', tone: 'b' }],
      },
      {
        name: 'Исполнено',
        count: 4,
        cards: [{ title: 'Претензия ООО «СтройГрад»', tag: 'Урегулировано', tone: 'g' }],
      },
    ],
  },
  'mini-org-ops': {
    title: 'Оплата счетов',
    cols: [
      {
        name: 'Очередь',
        count: 2,
        cards: [{ title: 'Счёт на сервис аналитики', tone: 'n' }],
      },
      {
        name: 'Платёж в банке',
        count: 1,
        cards: [{ title: 'Оплата подрядчику', tag: 'Регулярный', tone: 'y' }],
      },
      {
        name: 'Оплачено',
        count: 5,
        cards: [{ title: 'Продление лицензий', tag: 'Готово', tone: 'g' }],
      },
    ],
  },
  'mini-org-management': {
    title: 'Портфель проектов',
    cols: [
      {
        name: 'Идея',
        count: 3,
        cards: [{ title: 'Проект Д', tag: 'Большой', tone: 'v' }],
      },
      {
        name: 'Реализация',
        count: 2,
        cards: [{ title: 'Проект В', tag: 'Средний', tone: 'b' }],
      },
      {
        name: 'Контроль',
        count: 2,
        cards: [
          { title: 'Проект А', tag: 'Средний', tone: 'y' },
          { title: 'Проект Б', tag: 'Большой', tone: 'v' },
        ],
      },
    ],
  },
};

function MiniCardView({ card }: { card: MiniCard }) {
  const tone = card.tone ?? 'n';
  return (
    <div className="rounded-md border border-(--color-border-default) bg-(--color-surface-card) p-1.5">
      <div className="flex items-start gap-1">
        <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT_TONE[tone]}`} />
        <span className="line-clamp-2 text-[9px] font-medium leading-tight text-(--color-text-primary)">
          {card.title}
        </span>
      </div>
      {card.tag && (
        <span className={`mt-1 inline-block rounded-full px-1.5 py-px text-[7.5px] font-medium ${TAG_TONE[tone]}`}>
          {card.tag}
        </span>
      )}
    </div>
  );
}

export function OrgBoardMiniMock({ variant }: { variant: string }) {
  const board = BOARDS[variant];
  if (!board) return null;
  return (
    <div
      aria-hidden
      className="flex h-[184px] w-full flex-col overflow-hidden rounded-(--radius-xl) bg-[#e9eaee] p-2.5"
    >
      {/* заголовок доски */}
      <div className="mb-2 flex items-center gap-1.5 px-0.5">
        <span className="grid grid-cols-2 gap-px">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-[3px] w-[3px] rounded-full bg-(--color-neutral-300)" />
          ))}
        </span>
        <span className="text-[10px] font-semibold text-(--color-text-primary)">{board.title}</span>
      </div>
      {/* колонки — карточки выровнены по верху, серое «пространство» заполняет низ */}
      <div className="grid flex-1 grid-cols-3 content-start gap-1.5">
        {board.cols.map((col) => (
          <div key={col.name} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-1">
              <span className="truncate text-[8px] font-medium uppercase tracking-wide text-(--color-text-tertiary)">
                {col.name}
              </span>
              <span className="rounded bg-(--color-neutral-200) px-1 text-[7.5px] font-semibold text-(--color-text-secondary)">
                {col.count}
              </span>
            </div>
            {col.cards.map((c, i) => (
              <MiniCardView key={i} card={c} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
