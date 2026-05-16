import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

interface ModuleTile {
  icon: string;
  title: string;
  meta: string;
  state: 'core' | 'on' | 'off' | 'beta';
  span?: 'col-span-2' | 'col-span-1';
}

const MODULES: ModuleTile[] = [
  {
    icon: 'KanbanSquare',
    title: 'Задачи и проекты',
    meta: 'Kanban · Scrum · Gantt',
    state: 'core',
    span: 'col-span-2',
  },
  {
    icon: 'BookOpen',
    title: 'База знаний',
    meta: 'Документы рядом с задачами',
    state: 'core',
  },
  {
    icon: 'Headphones',
    title: 'Служба поддержки',
    meta: 'Заявки из почты, Telegram',
    state: 'on',
  },
  {
    icon: 'Workflow',
    title: 'Бизнес-процессы',
    meta: 'Согласования по шагам',
    state: 'on',
  },
  {
    icon: 'BarChart3',
    title: 'Аналитика',
    meta: 'Дашборды для руководства',
    state: 'beta',
  },
  {
    icon: 'Sparkles',
    title: 'AI-помощник',
    meta: 'Резюме, шаблоны, подсказки',
    state: 'off',
  },
];

const STATE_LABEL: Record<ModuleTile['state'], string> = {
  core: 'ядро',
  on: 'подключено',
  off: 'добавить',
  beta: 'бета',
};

const STATE_CLASS: Record<ModuleTile['state'], string> = {
  core: 'border-(--color-action-primary)/40 bg-(--color-action-primary-soft)',
  on: 'border-(--color-border-default) bg-(--color-surface-page)',
  off: 'border-dashed border-(--color-border-default) bg-(--color-surface-page) opacity-70',
  beta: 'border-(--color-border-default) bg-(--color-surface-page)',
};

const STATE_PILL: Record<ModuleTile['state'], string> = {
  core: 'bg-(--color-action-primary) text-white',
  on: 'bg-(--color-green-100) text-green-700',
  off: 'bg-(--color-neutral-200) text-(--color-text-secondary)',
  beta: 'bg-(--color-blue-12) text-(--color-blue-100)',
};

/**
 * Mock-матрица модулей платформы (bento grid 3×2 с одним wide-слотом).
 * Подсвечивает «core» модули (PM, KB) фиолетом, подключённые — белым,
 * отключённые — пунктиром. Используется в MediaCopy variant='modules-matrix'
 * и Hero visual.variant='modules-matrix'.
 */
export function ModulesMatrixMock() {
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
          <span className="font-medium text-(--color-text-primary)">Модули платформы</span>
          <span>6 из 6</span>
          <span className="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">
            Тариф · Стандарт
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 p-4 md:gap-3 md:p-5">
        {MODULES.map((m) => (
          <div
            key={m.title}
            className={cn(
              'rounded-(--radius-xl) border p-3 md:p-3.5',
              STATE_CLASS[m.state],
              m.span ?? 'col-span-1',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-(--radius-xl)',
                  m.state === 'core'
                    ? 'bg-(--color-action-primary) text-white'
                    : 'bg-(--color-action-primary-soft) text-(--color-text-accent)',
                )}
              >
                <Icon name={m.icon} className="h-4 w-4" strokeWidth={2} />
              </span>
              <span
                className={cn(
                  'inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium leading-none',
                  STATE_PILL[m.state],
                )}
              >
                {STATE_LABEL[m.state]}
              </span>
            </div>
            <div className="mt-2.5 text-[11.5px] font-semibold leading-tight text-(--color-text-primary)">
              {m.title}
            </div>
            <div className="mt-0.5 text-[10px] text-(--color-text-secondary)">{m.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
