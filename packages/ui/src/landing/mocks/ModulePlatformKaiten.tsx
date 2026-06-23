import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

function Soon() { return <span className="rounded-md bg-(--color-action-primary) px-2 py-0.5 text-[12px] font-semibold text-white">Скоро</span>; }
function Tag({ children }: { children: React.ReactNode }) { return <span className="inline-flex items-center rounded-md bg-(--color-surface-section) px-2.5 py-1 text-[13px] text-(--color-text-secondary)">{children}</span>; }
function Dots({ n, w }: { n: number; w?: number }) {
  const cl = ['#7d4ccf', '#3b82f6', '#e0306e', '#e0a400', '#4caf51', '#19b3b3', '#9e9e9e'];
  return <div className="space-y-1.5">{Array.from({ length: n }).map((_, i) => <div key={i} className="flex items-center gap-2"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cl[i % 7] }} /><span className="block h-1.5 rounded-full bg-(--color-surface-section)" style={{ width: (w || 70) + 'px' }} /></div>)}</div>;
}

function GanttMock() {
  const bars: [string, number, number][] = [['#cfe9c2', 2, 18], ['#e6d4f5', 18, 40], ['#f7c9c4', 8, 22], ['#f7c9c4', 46, 16], ['#fde6b8', 26, 30], ['#cfe9c2', 58, 18], ['#cdeae0', 12, 20], ['#bcd9f7', 30, 55]];
  const dot = ['#7d4ccf', '#3b82f6', '#e0306e', '#e0a400', '#4caf51', '#19b3b3', '#9e9e9e', '#3b82f6'];
  return (
    <div className="overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-white">
      <div className="flex items-center justify-between border-b border-(--color-border-default) px-3 py-2 text-[11px] text-(--color-text-secondary)">
        <span className="font-medium text-(--color-text-primary)">Проекты</span>
        <span className="flex gap-3"><span>Часы</span><span className="font-semibold text-(--color-text-primary)">Дни</span><span>Недели</span><span>Месяцы</span></span>
      </div>
      <div className="flex border-b border-(--color-border-default) px-3 py-1 text-[10px] text-(--color-text-secondary)">
        <span className="w-[120px] shrink-0">Проекты</span>
        <div className="flex flex-1 justify-between">{Array.from({ length: 14 }).map((_, i) => <span key={i}>{i + 1}</span>)}</div>
      </div>
      <div className="space-y-2.5 px-3 py-3">
        {bars.map((b, i) => (
          <div key={i} className="flex items-center">
            <div className="flex w-[120px] shrink-0 items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: dot[i] }} /><span className="block h-1.5 w-12 rounded-full bg-(--color-surface-section)" /></div>
            <div className="relative h-3 flex-1"><div className="absolute h-3 rounded-md" style={{ left: b[1] + '%', width: b[2] + '%', background: b[0] }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function KanbanMock() {
  const cols: [string, string][] = [['Очередь', '#ededf0'], ['В работе', '#f7d9d6'], ['Согласов...', '#d6ecd9'], ['Готово', '#fbeccb']];
  return (
    <div className="overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-white">
      <div className="flex items-center gap-2 border-b border-(--color-border-default) px-3 py-2">
        <span className="text-[12px] font-semibold text-(--color-text-primary)">Задачи</span>
        <span className="ml-auto flex gap-1.5 text-(--color-text-secondary)">{['LayoutGrid', 'Table2', 'KanbanSquare', 'Grid3x3', 'AlignLeft', 'Calendar'].map((n) => <Icon key={n} name={n} className="h-3.5 w-3.5" strokeWidth={2} />)}</span>
      </div>
      <div className="flex gap-2 p-2">
        <div className="w-[70px] shrink-0 pt-5"><Dots n={6} w={44} /></div>
        {cols.map((c, ci) => (
          <div key={ci} className="flex-1">
            <div className="mb-1.5 text-[10px] text-(--color-text-secondary)">{c[0]}</div>
            <div className="space-y-1.5">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="rounded-md p-1.5" style={{ background: c[1] }}><div className="h-1 w-10 rounded-full bg-black/10" /><div className="mt-1 h-1 w-7 rounded-full bg-black/10" /></div>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function DocMock() {
  const sw = ['#3b82f6', '#e0306e', '#e0a400', '#4caf51']; const bgs = ['#dbeafe', '#fbe3ec', '#fef3cf', '#e7f3df'];
  return (
    <div className="overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-white">
      <div className="flex items-center gap-2 border-b border-(--color-border-default) px-3 py-2">
        <span className="text-[11px] font-medium text-(--color-text-primary)">Документы и регламенты компании</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-(--color-surface-section) px-2 py-0.5 text-[10px] text-(--color-text-secondary)"><Icon name="Search" className="h-3 w-3" strokeWidth={2} />Поиск</span>
      </div>
      <div className="flex gap-3 p-3">
        <div className="w-[64px] shrink-0"><Dots n={6} w={40} /></div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[12px] font-medium text-(--color-text-primary)">Название документа<span className="ml-0.5 inline-block h-3 w-px bg-(--color-action-primary)" /></div>
            <div className="flex items-center gap-1 rounded-md border border-(--color-border-default) px-1.5 py-1 text-[10px] text-(--color-text-primary)"><b>B</b><i>I</i><span className="underline">U</span><span className="line-through">S</span><Icon name="Baseline" className="h-3 w-3" strokeWidth={2} /><Icon name="Code" className="h-3 w-3" strokeWidth={2} /><Icon name="Link" className="h-3 w-3" strokeWidth={2} /></div>
          </div>
          <div className="mt-1.5 flex gap-1">{sw.map((c, i) => <span key={i} className="inline-flex h-4 w-4 items-center justify-center rounded border border-(--color-border-default) text-[9px] font-bold" style={{ color: c }}>A</span>)}{bgs.map((c, i) => <span key={i} className="inline-block h-4 w-4 rounded border border-(--color-border-default)" style={{ background: c }} />)}</div>
          <div className="mt-2 overflow-hidden rounded border border-(--color-border-default)">
            {Array.from({ length: 3 }).map((_, r) => <div key={r} className="grid grid-cols-4 border-b border-(--color-border-default) last:border-0">{Array.from({ length: 4 }).map((_, c) => <div key={c} className="border-r border-(--color-border-default) p-1.5 last:border-0"><span className="block h-1 w-4/5 rounded-full bg-(--color-surface-section)" /></div>)}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

type AI = { icon: string; title: string; desc: string; hl?: boolean; soon?: boolean };
type Mod = { label: string; title: string; tags: string[]; icon: string; hl?: boolean; soon?: boolean };

function AICard({ d }: { d: AI }) {
  return (
    <div className={cn('relative min-h-[172px] flex-1 rounded-(--radius-lg) bg-white p-6', d.hl ? 'border-2 border-(--color-action-primary)' : 'border border-(--color-border-default)')}>
      {d.soon && <span className="absolute right-4 top-4"><Soon /></span>}
      <Icon name={d.icon} className="h-7 w-7 text-(--color-blue)" strokeWidth={1.6} />
      <div className="mt-4 text-[19px] font-semibold text-(--color-text-primary)">{d.title}</div>
      <div className="mt-1.5 text-[14px] leading-snug text-(--color-text-secondary)">{d.desc}</div>
    </div>
  );
}
function CoreCard({ d }: { d: { label: string; title: string; tags: string[]; mock: React.ReactNode } }) {
  return (
    <div className="flex-1 rounded-(--radius-lg) border border-(--color-border-default) bg-white p-6">
      <div className="text-[12px] font-semibold uppercase tracking-wide text-(--color-text-accent)">{d.label}</div>
      <div className="mt-1 text-[24px] font-bold text-(--color-text-primary)">{d.title}</div>
      <div className="mt-3 flex flex-wrap gap-2">{d.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
      <div className="mt-4">{d.mock}</div>
    </div>
  );
}
function ModuleCard({ d }: { d: Mod }) {
  return (
    <div className={cn('relative min-h-[152px] flex-1 overflow-hidden rounded-(--radius-lg) bg-white p-6', d.hl ? 'border-2 border-(--color-action-primary)' : 'border border-(--color-border-default)')}>
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-10"><Icon name={d.icon} className="h-28 w-28 text-(--color-blue)" strokeWidth={1.2} /></div>
      {d.soon && <span className="absolute right-4 top-4"><Soon /></span>}
      <div className="relative">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-(--color-text-accent)">{d.label}</div>
        <div className="mt-1 text-[22px] font-bold text-(--color-text-primary)">{d.title}</div>
        <div className="mt-3 flex flex-wrap gap-2">{d.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
      </div>
    </div>
  );
}
function SectionTitle({ icon, title, rest, accent }: { icon: React.ReactNode; title: string; rest: string; accent?: boolean }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon}
      <div className={cn('text-[24px]', accent ? 'text-(--color-text-accent)' : 'text-(--color-text-primary)')}><b>{title}</b><span className="font-normal text-(--color-text-secondary)">{rest}</span></div>
    </div>
  );
}

const AI_CARDS: AI[] = [
  { icon: 'Clock', title: 'Аналитика сроков', desc: 'Отвечает, когда работа будет готова' },
  { icon: 'AudioLines', title: 'Транскрибация', desc: 'Переводит аудио и видео в текст и задачи' },
  { icon: 'SquarePen', title: 'ИИ редактор', desc: 'Помощник в карточках и документах' },
  { icon: 'GraduationCap', title: 'ИИ онбординг', desc: 'Настройка процессов с нуля под запрос', soon: true },
  { icon: 'SquareTerminal', title: 'MCP / Skills', desc: 'Подключение внешних инструментов и AI-сценариев', soon: true },
];
const MOD1: Mod[] = [
  { label: 'SERVICE DESK · ITSM', title: 'Управление сервисом', tags: ['Служба поддержки', 'Тикеты', 'SLA'], icon: 'Headset' },
  { label: 'CRM', title: 'Управление продажами', tags: ['CRM', 'Телефония', 'Отчеты'], icon: 'TrendingUp' },
  { label: 'BPM', title: 'Управление процессами', tags: ['Воркфлоу', 'Автоматизация'], icon: 'Settings', soon: true },
];
const MOD2: Mod[] = [
  { label: 'BI', title: 'Аналитика', tags: ['Данные', 'Отчеты', 'Дашборды'], icon: 'ChartBar' },
  { label: 'CANVAS', title: 'Холст', tags: ['Визуализация', 'Вайтборд'], icon: 'Shapes', soon: true },
  { label: 'COMMUNICATIONS', title: 'Коммуникации', tags: ['Чат', 'ВКС', 'Календарь'], icon: 'MessagesSquare' },
  { label: 'CUSTOM', title: 'Интеграции', tags: ['API', 'Вебхуки', 'Дополнения'], icon: 'Share2' },
];

/**
 * Лендинг-карта продукта Kaiten (PlatformKaiten): три яруса — «Сквозной ИИ»
 * (фич-карточки), «Ядро платформы» (Проекты/Задачи/Знания с мини-мокапами
 * Ганта/канбана/редактора) и «Инструменты и модули» (Service Desk, CRM, BPM,
 * BI, Canvas, Communications, Custom).
 */
export function ModulePlatformKaiten() {
  return (
    <div aria-hidden className="w-[2000px] space-y-6">
      <div className="rounded-2xl bg-(--color-surface-section) p-7">
        <SectionTitle icon={<Icon name="Sparkles" className="h-6 w-6 text-(--color-text-primary)" strokeWidth={2} />} title="Сквозной ИИ" rest=" — понимает контекст, обучается на данных компании, помогает работать эффективнее" />
        <div className="flex gap-4">{AI_CARDS.map((d, i) => <AICard key={i} d={d} />)}</div>
      </div>
      <div className="rounded-2xl p-7" style={{ background: 'linear-gradient(180deg,#e7eefb,#ece9fb)' }}>
        <SectionTitle accent icon={<Icon name="Atom" className="h-6 w-6 text-(--color-text-accent)" strokeWidth={2} />} title="Ядро платформы" rest=" — задачи, проекты и знания всей компании в единой среде" />
        <div className="flex gap-5">
          <CoreCard d={{ label: 'PROJECT MANAGEMENT', title: 'Проекты', tags: ['Гантт', 'Ресурсы', 'Канбан', 'SCRUM', 'Цели'], mock: <GanttMock /> }} />
          <CoreCard d={{ label: 'TASK MANAGEMENT', title: 'Задачи', tags: ['Доски', 'Таблицы', 'Учет времени', 'Чек-листы'], mock: <KanbanMock /> }} />
          <CoreCard d={{ label: 'KNOWLEGE BASE', title: 'Знания', tags: ['Документы', 'Базы знаний', 'Справочный центр', 'RSS'], mock: <DocMock /> }} />
        </div>
      </div>
      <div className="rounded-2xl bg-(--color-surface-section) p-7">
        <SectionTitle icon={<span className="grid grid-cols-3 gap-0.5">{Array.from({ length: 9 }).map((_, i) => <span key={i} className="h-1 w-1 rounded-full bg-(--color-text-secondary)" />)}</span>} title="Инструменты и модули" rest=" для совместной работы разных команд" />
        <div className="flex gap-5">{MOD1.map((d, i) => <ModuleCard key={i} d={d} />)}</div>
        <div className="mt-5 flex gap-5">{MOD2.map((d, i) => <ModuleCard key={i} d={d} />)}</div>
      </div>
    </div>
  );
}
