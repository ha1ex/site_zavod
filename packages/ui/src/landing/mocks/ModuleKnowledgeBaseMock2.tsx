import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

type Item = {
  i: number;
  label: string;
  emoji?: string;
  folder?: string;
  board?: string;
  chev?: 'r' | 'd';
  web?: boolean;
  active?: boolean;
};

const TREE: Item[] = [
  { i: 0, emoji: '📋', label: 'Процессы', chev: 'd' },
  { i: 1, folder: '#9e9e9e', label: 'Редакция', chev: 'r' },
  { i: 1, folder: '#b13bd0', label: 'Маркетинг', chev: 'd' },
  { i: 2, board: '#b13bd0', label: 'Маркетинг' },
  { i: 2, emoji: '🔥', label: 'Планы на Q1' },
  { i: 2, emoji: '📋', label: 'Контент-маркетинг' },
  { i: 2, emoji: '📄', label: 'Контент-план' },
  { i: 2, emoji: '📍', label: 'Регламенты', chev: 'd' },
  { i: 3, emoji: '🧑‍💼', label: 'Как мы работае...' },
  { i: 3, emoji: '✋', label: 'Инструкция по п...', active: true },
  { i: 3, emoji: '✉️', label: 'Как запускать но...' },
  { i: 3, emoji: '🎨', label: 'Адаптация в мар...' },
  { i: 2, emoji: '💬', label: 'Заметки со встреч', chev: 'r' },
  { i: 2, emoji: '📚', label: 'Документы по пр...', chev: 'r' },
  { i: 2, folder: '#9e9e9e', label: 'Клиенты', chev: 'r' },
  { i: 2, emoji: '✉️', label: 'Рассылки', chev: 'r' },
  { i: 2, emoji: '✏️', label: 'Посты', chev: 'r' },
  { i: 1, folder: '#9e9e9e', label: 'Разработка', chev: 'r' },
  { i: 1, folder: '#19b3b3', label: 'HR', chev: 'r' },
  { i: 0, emoji: '🟥', label: 'Бухгалтерия' },
  { i: 0, board: '#e0306e', label: 'Пространство руков...', chev: 'r' },
  { i: 0, board: '#2f9fd0', label: 'Продакт-менеджмент', chev: 'r' },
  { i: 0, board: '#7d4ccf', web: true, label: 'Служба поддержки' },
];

const ROWS: [string, string][] = [
  ['Начало рабочей недели', 'Доступ к доске команды в Kaiten'],
  ['После завершения спринта', 'Список задач в бэклоге'],
  ['При запуске нового проекта', '30-45 минут времени всей команды'],
  ['Когда команда теряет фокус', 'Ссылка на видеозвонок'],
];

const PREP = [
  'Просмотреть бэклог, убрать неактуальное.',
  'Выписать 3-5 приоритетных задач на неделю.',
  'Проверить, что у задач понятные названия и описания.',
  'Отправить напоминание в чат со ссылкой на доску.',
];

function FolderIcon({ color }: { color: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={color} aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l1.6 1.6H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></svg>;
}
function BoardIcon({ color }: { color: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={color} aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>;
}
function ItemIcon({ it }: { it: Item }) {
  if (it.emoji) return <span className="text-[14px] leading-none">{it.emoji}</span>;
  if (it.folder) return <FolderIcon color={it.folder} />;
  if (it.board) return <BoardIcon color={it.board} />;
  return null;
}

function Sidebar() {
  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r border-(--color-border-default) bg-(--color-surface-section)">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[15px] font-semibold text-(--color-text-primary)">Меню</span>
        <Icon name="ChevronsLeft" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />
      </div>
      <div className="flex items-center gap-2 px-3 pb-2">
        <span className="inline-flex flex-1 items-center gap-2 rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-2.5 py-1.5 text-[13px] text-(--color-text-secondary)">
          <Icon name="Search" className="h-4 w-4" strokeWidth={2} /> Найти..
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-(--color-border-default) bg-(--color-surface-page) text-(--color-text-secondary)"><Icon name="Plus" className="h-4 w-4" strokeWidth={2} /></span>
      </div>
      <div className="flex-1 overflow-hidden px-2 py-1">
        {TREE.map((it, idx) => (
          <div
            key={idx}
            className={cn('flex items-center gap-1.5 rounded-md py-1.5 pr-2 text-[13px]', it.active ? 'bg-(--color-action-primary-soft) font-medium text-(--color-text-primary)' : 'text-(--color-text-primary)')}
            style={{ paddingLeft: 8 + it.i * 16 + 'px' }}
          >
            <ItemIcon it={it} />
            {it.chev && <Icon name={it.chev === 'd' ? 'ChevronDown' : 'ChevronRight'} className="h-3 w-3 shrink-0 text-(--color-text-secondary)" strokeWidth={2} />}
            {it.web && <Icon name="Globe" className="h-3 w-3 shrink-0 text-(--color-text-secondary)" strokeWidth={2} />}
            <span className="truncate">{it.label}</span>
          </div>
        ))}
        <div className="my-2 border-t border-(--color-border-default)" />
        <div className="flex items-center gap-1.5 rounded-md py-1.5 pl-2 pr-2 text-[13px] text-(--color-text-primary)">
          <BoardIcon color="#2f9fd0" /> Шаблоны пространств
        </div>
        <div className="flex items-center gap-1.5 rounded-md py-1.5 pl-2 pr-2 text-[13px] text-(--color-text-primary)">
          <Icon name="Settings" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} /><Icon name="ChevronRight" className="h-3 w-3 text-(--color-text-secondary)" strokeWidth={2} /> Администрирование
        </div>
      </div>
    </div>
  );
}

function Doc() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-(--color-surface-page)">
      <div className="flex items-center gap-3 border-b border-(--color-border-default) px-6 py-2.5">
        <span className="inline-flex items-center rounded-md bg-(--color-surface-section) px-2.5 py-1 text-[12px] text-(--color-text-secondary)">Обновлен 16 дней назад</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#4caf51] text-[12px] font-semibold text-white shadow">3</span>
      </div>
      <div className="overflow-hidden px-10 py-8">
        <div className="mx-auto max-w-[760px]">
          <div className="text-[40px] leading-none">✋</div>
          <h1 className="mt-4 text-[34px] font-bold leading-tight text-(--color-text-primary)">Инструкция по проведению еженедельной планерки</h1>
          <div className="mt-4 flex items-center gap-2 text-[13px] text-(--color-text-secondary)">
            <Icon name="MessageSquare" className="h-4 w-4" strokeWidth={2} /> Комментарии к документу
          </div>

          <h2 className="mt-7 border-l-4 border-[#4caf51] pl-3 text-[24px] font-semibold text-(--color-text-primary)">Как провести еженедельную планерку</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-(--color-text-primary)">
            <b>Цель:</b> синхронизировать команду по задачам на неделю, выявить блокеры и распределить приоритеты за 30-45 минут.
          </p>

          {/* table */}
          <div className="mt-5 overflow-hidden rounded-(--radius-lg) border border-(--color-border-default)">
            <div className="grid grid-cols-2 border-b border-(--color-border-default) bg-(--color-surface-section)">
              <div className="border-r border-(--color-border-default) px-4 py-3 text-[14px] font-medium text-(--color-text-secondary)">Когда использовать</div>
              <div className="px-4 py-3 text-[14px] font-medium text-(--color-text-secondary)">Что понадобится</div>
            </div>
            {ROWS.map(([a, b], i) => (
              <div key={i} className="grid grid-cols-2 border-b border-(--color-border-default) last:border-b-0">
                <div className="border-r border-(--color-border-default) px-4 py-3 text-[14px] italic text-(--color-text-primary)">{a}</div>
                <div className="px-4 py-3 text-[14px] text-(--color-text-primary)">{b}</div>
              </div>
            ))}
          </div>

          <h2 className="mt-8 text-[22px] font-semibold text-(--color-text-primary)">Подготовка (за 1 день до встречи)</h2>
          <div className="mt-3 text-[15px] font-semibold text-(--color-text-primary)">Организатор:</div>
          <ul className="mt-2 space-y-2">
            {PREP.map((x, i) => (
              <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-(--color-text-primary)">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-text-primary)" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Mock базы знаний Kaiten (экран 2): сайдбар-дерево пространства «Маркетинг» и
 * документ «Инструкция по проведению еженедельной планерки» — заголовок,
 * таблица «когда использовать / что понадобится» и чек-лист подготовки.
 */
export function ModuleKnowledgeBaseMock2() {
  return (
    <div aria-hidden className="flex h-[920px] w-[1320px] overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-surface-page) shadow-[0_10px_40px_-20px_rgba(45,45,45,0.3)]">
      <Sidebar />
      <Doc />
    </div>
  );
}
