import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

type Item = {
  i: number;
  label: string;
  emoji?: string;
  folder?: string;
  board?: string;
  doc?: boolean;
  chev?: 'r' | 'd';
  web?: boolean;
  active?: boolean;
};

const TREE: Item[] = [
  { i: 0, emoji: '❤️', label: 'Маркетинг', chev: 'r' },
  { i: 0, emoji: '📚', label: 'База знаний', chev: 'r' },
  { i: 0, emoji: '🧑', label: 'Команда' },
  { i: 0, emoji: '📋', label: 'Процессы', chev: 'd' },
  { i: 1, folder: '#9e9e9e', label: 'Редакция', chev: 'r' },
  { i: 1, folder: '#b13bd0', label: 'Маркетинг', chev: 'r' },
  { i: 1, folder: '#9e9e9e', label: 'Разработка', chev: 'r' },
  { i: 1, folder: '#2f9fd0', label: 'HR', chev: 'd' },
  { i: 2, board: '#e0306e', label: 'HR', chev: 'r' },
  { i: 2, emoji: '📑', web: true, label: 'Регламент по о...', active: true },
  { i: 2, emoji: '✋', label: 'Регламент по оффбо...' },
  { i: 2, emoji: '🚀', label: 'Оценка 360: инструк...' },
  { i: 2, emoji: '💯', label: 'Проведение eNPS: и...' },
  { i: 2, folder: '#2f9fd0', label: 'Материалы по оценк...' },
  { i: 2, folder: '#2f9fd0', label: 'Должностные инстр...' },
  { i: 2, emoji: '👍', web: true, label: 'Корпоративное...' },
  { i: 0, emoji: '🟥', label: 'Бухгалтерия' },
  { i: 0, board: '#e0306e', label: 'Пространство руков...', chev: 'r' },
  { i: 0, board: '#2f9fd0', label: 'Продакт-менеджмент', chev: 'r' },
  { i: 0, board: '#7d4ccf', web: true, label: 'Служба поддержки' },
  { i: 0, folder: '#9e9e9e', label: 'Проекты', chev: 'r' },
  { i: 0, emoji: '🚚', label: 'Документ' },
  { i: 0, doc: true, web: true, label: 'Программа на семестры 1-...' },
];

const STEPS: [string, string[]][] = [
  ['За неделю до выхода', ['Назначение наставника (buddy) из команды.', 'Создание рабочего места и учетных записей во всех системах.', 'Доступ к внутренним документам и базе знаний.']],
  ['Первый рабочий день', ['Встреча с HR и наставником.', 'Ознакомление с миссией, ценностями и структурой компании.', 'Настройка рабочих инструментов: почта, мессенджеры, Kaiten и т.д.']],
  ['Первая неделя', ['Знакомство с командой и встречи 1:1.', 'Первые задачи под присмотром наставника.', 'Изучение регламентов и базы знаний.']],
  ['Первый месяц', ['Полное погружение в рабочие процессы.', 'Промежуточная встреча с руководителем.', 'Сбор обратной связи и план развития.']],
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
  if (it.doc) return <Icon name="FileText" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />;
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
            className={cn('flex items-center gap-1.5 rounded-md py-1.5 pr-2 text-[13px]', it.active ? 'bg-(--color-border-default) font-medium text-(--color-text-primary)' : 'text-(--color-text-primary)')}
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
      <div className="border-b border-(--color-border-default) px-6 py-2.5">
        <span className="inline-flex items-center rounded-md bg-(--color-surface-section) px-2.5 py-1 text-[12px] text-(--color-text-secondary)">Обновлен месяц назад</span>
      </div>
      <div className="overflow-hidden px-10 py-8">
        <div className="mx-auto max-w-[760px]">
          <div className="text-[40px] leading-none">🥳</div>
          <h1 className="mt-4 text-[34px] font-bold leading-tight text-(--color-text-primary)">Регламент по онбордингу нового сотрудника</h1>
          <div className="mt-4 flex items-center gap-2 text-[13px] text-(--color-text-secondary)">
            <Icon name="MessageSquare" className="h-4 w-4" strokeWidth={2} /> Комментарии к документу
          </div>

          {/* callout */}
          <div className="mt-5 flex items-start gap-3 rounded-(--radius-lg) bg-[#e8f5e9] p-4">
            <Icon name="CircleCheck" className="mt-0.5 h-5 w-5 shrink-0 text-[#43a047]" strokeWidth={2} />
            <div className="flex-1 text-[14px] leading-relaxed text-[#2f6b33]">
              <b>Цель:</b> обеспечить эффективное включение нового сотрудника в работу команды, познакомить с процессами, инструментами и корпоративной культурой.
            </div>
            <Icon name="EllipsisVertical" className="h-4 w-4 shrink-0 text-(--color-text-secondary)" strokeWidth={2} />
          </div>

          <h2 className="mt-8 text-[22px] font-semibold text-(--color-text-primary)">Область применения</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-(--color-text-primary)">
            Применяется ко всем новым сотрудникам компании с момента подписания трудового договора и <span className="rounded bg-[#c8e6c9] px-0.5">в течение первых 30 календарных дней</span>.
          </p>

          <h2 className="mt-8 text-[22px] font-semibold text-(--color-text-primary)">Процесс онбординга</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {STEPS.map(([title, items], i) => (
              <div key={i} className="rounded-(--radius-lg) border border-(--color-border-default) p-5">
                <div className="text-[16px] font-semibold text-(--color-text-primary)">{title}</div>
                <div className="mt-3 space-y-3">
                  {items.map((x, j) => (
                    <div key={j} className="text-[14px] leading-relaxed text-(--color-text-primary)">— {x}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mock базы знаний Kaiten: сайдбар-дерево пространств и документ
 * «Регламент по онбордингу» — заголовок с эмодзи, callout «Цель»,
 * разделы и карточки этапов процесса онбординга.
 */
export function ModuleKnowledgeBaseMock() {
  return (
    <div aria-hidden className="flex h-[920px] w-[1320px] overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-surface-page) shadow-[0_10px_40px_-20px_rgba(45,45,45,0.3)]">
      <Sidebar />
      <Doc />
    </div>
  );
}
