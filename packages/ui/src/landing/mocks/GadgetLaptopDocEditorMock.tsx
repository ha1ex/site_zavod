import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

const TREE: { icon: string; label: string; tint?: string; open?: boolean }[] = [
  { icon: 'Folder', label: 'Рабочее пространства', tint: '#e0a400' },
  { icon: 'LayoutGrid', label: 'Доски' },
  { icon: 'ClipboardList', label: 'Задачи / карточки' },
  { icon: 'Table2', label: 'Колонки, дорожки, ячейки' },
  { icon: 'FileText', label: 'Документы', open: true },
];

const DOC_SUB = [
  'Как создать и редактировать...',
  'Возможности документов',
  'Создание публичной базы знаний и...',
  'Как выдать доступ к документу',
];

const TILES = [
  { n: '1', bg: '#fdecec', fg: '#e5484d' },
  { n: '2', bg: '#fef6e0', fg: '#e0a400' },
  { n: '3', bg: '#e9f5ea', fg: '#4caf51' },
  { n: '4', bg: '#efe9f9', fg: '#7d4ccf' },
];

const TEXT_COLORS: [string, boolean?][] = [
  ['#2d2d2d', true], ['#9e9e9e'], ['#4caf51'], ['#1d9e75'],
  ['#2f6fed'], ['#e5484d'], ['#ffa100'], ['#e0a400'],
];
const BG_COLORS: [string, boolean?][] = [
  ['#ffffff', true], ['#eeeeee'], ['#e9f5ea'], ['#e1f5ee'],
  ['#e7eefc'], ['#fbeaf0'], ['#fff3e0'], ['#fef6e0'],
];

function KaitenLogo() {
  return (
    <span className="relative inline-flex h-4 w-4 items-center justify-center">
      <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><g clipPath="url(#kaitenMarkClip)"><path d="M76.8113 0H27.1887C12.1728 0 0 12.1661 0 27.1738V76.8262C0 91.8339 12.1728 104 27.1887 104H76.8113C91.8272 104 104 91.8339 104 76.8262V27.1738C104 12.1661 91.8272 0 76.8113 0Z" fill="#F11F24"/><path d="M41.4148 11.3364L11.3364 41.4148C5.55453 47.1967 5.55453 56.571 11.3364 62.3529L41.4148 92.4313C47.1967 98.2132 56.571 98.2132 62.3529 92.4313L92.4313 62.3529C98.2132 56.571 98.2132 47.1967 92.4313 41.4148L62.3529 11.3364C56.571 5.55453 47.1967 5.55453 41.4148 11.3364Z" fill="#78FFC7"/><path d="M51.715 77.4267C65.917 77.4267 77.43 65.9144 77.43 51.7133C77.43 37.5123 65.917 26 51.715 26C37.513 26 26 37.5123 26 51.7133C26 65.9144 37.513 77.4267 51.715 77.4267Z" fill="#7D4CCF"/></g><defs><clipPath id="kaitenMarkClip"><rect width="104" height="104" rx="52" fill="white"/></clipPath></defs></svg>
    </span>
  );
}

function Toolbar() {
  return (
    <div className="absolute right-4 top-2.5 z-30 flex items-center gap-0.5 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-1.5 py-1 shadow-[0_8px_20px_-10px_rgba(45,45,45,0.35)]">
      <span className="px-1.5 text-[12px] font-bold text-(--color-text-primary)">B</span>
      <span className="px-1.5 text-[12px] italic text-(--color-text-primary)">I</span>
      <Icon name="Underline" className="mx-0.5 h-3.5 w-3.5 text-(--color-text-primary)" strokeWidth={2} />
      <Icon name="Strikethrough" className="mx-0.5 h-3.5 w-3.5 text-(--color-text-primary)" strokeWidth={2} />
      <span className="mx-1 h-4 w-px bg-(--color-border-default)" />
      <span className="inline-flex items-center gap-0.5">
        <Icon name="Baseline" className="h-3.5 w-3.5 text-(--color-text-primary)" strokeWidth={2} />
        <Icon name="ChevronDown" className="h-3 w-3 text-(--color-text-secondary)" strokeWidth={2} />
      </span>
      <span className="mx-1 h-4 w-px bg-(--color-border-default)" />
      <Icon name="Code" className="mx-0.5 h-3.5 w-3.5 text-(--color-text-primary)" strokeWidth={2} />
      <Icon name="Link" className="mx-0.5 h-3.5 w-3.5 text-(--color-text-primary)" strokeWidth={2} />
      <Icon name="AlignLeft" className="mx-0.5 h-3.5 w-3.5 text-(--color-text-primary)" strokeWidth={2} />
    </div>
  );
}

/** Пикер цвета текста/фона — вынесен за правый край ноутбука, «вылетает» из корпуса. */
function ColorPopover() {
  return (
    <div
      className="absolute z-40 flex gap-5 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-3 shadow-[0_12px_18px_-14px_rgba(45,45,45,0.26)]"
      style={{ top: '315px', left: '620px' }}
    >
      <div>
        <div className="mb-2 text-[10px] font-semibold text-(--color-text-primary)">Цвет текста</div>
        <div className="grid grid-cols-4 gap-1.5">
          {TEXT_COLORS.map(([c, sel], i) => (
            <span
              key={i}
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded-md border text-[12px] font-semibold',
                sel ? 'border-(--color-action-primary)' : 'border-(--color-border-default)',
              )}
              style={{ color: c }}
            >
              A
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-[10px] font-semibold text-(--color-text-primary)">Цвет фона</div>
        <div className="grid grid-cols-4 gap-1.5">
          {BG_COLORS.map(([c, sel], i) => (
            <span
              key={i}
              className={cn(
                'inline-flex h-6 w-6 rounded-md border',
                sel ? 'border-(--color-action-primary)' : 'border-(--color-border-default)',
              )}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Экран редактора документа Kaiten: сайдбар-дерево, панель форматирования, контент. */
function DocEditor() {
  return (
    <div className="flex h-full flex-col bg-(--color-surface-page)">
      {/* top bar */}
      <div className="flex items-center gap-2 border-b border-(--color-border-default) px-4 py-2.5">
        <KaitenLogo />
        <span className="text-[13px] font-semibold text-(--color-text-primary)">Kaiten</span>
        <span className="h-3.5 w-px bg-(--color-border-default)" />
        <span className="text-[12px] text-(--color-text-secondary)">Документация и инструкции</span>
      </div>

      {/* body */}
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar tree */}
        <div className="w-[200px] shrink-0 space-y-0.5 overflow-hidden border-r border-(--color-border-default) bg-(--color-surface-section) px-2 py-2.5">
          <div className="flex items-center justify-between rounded-md px-2 py-1">
            <span className="text-[11px] font-semibold text-(--color-text-primary)">Основные возможности</span>
            <Icon name="ChevronDown" className="h-3 w-3 text-(--color-text-secondary)" strokeWidth={2} />
          </div>
          {TREE.map((t) => (
            <div key={t.label}>
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <span className={cn('shrink-0', t.tint ? '' : 'text-(--color-text-secondary)')} style={t.tint ? { color: t.tint } : undefined}>
                  <Icon name={t.icon} className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <span className="flex-1 truncate text-[11px] text-(--color-text-secondary)">{t.label}</span>
                <Icon name={t.open ? 'ChevronDown' : 'ChevronRight'} className="h-3 w-3 shrink-0 text-(--color-text-secondary)" strokeWidth={2} />
              </div>
              {t.open && (
                <div className="space-y-0.5 pb-1 pl-7 pr-1">
                  {DOC_SUB.map((s, i) => (
                    <div
                      key={i}
                      className={cn(
                        'truncate rounded-md px-2 py-1 text-[10.5px]',
                        i === 1
                          ? 'bg-(--color-action-primary-soft) font-medium text-(--color-text-accent)'
                          : 'text-(--color-text-secondary)',
                      )}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="my-1 border-t border-(--color-border-default)" />
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <Icon name="ClipboardList" className="h-3.5 w-3.5 shrink-0 text-(--color-text-secondary)" strokeWidth={2} />
            <span className="flex-1 truncate text-[11px] text-(--color-text-secondary)">Задачи / карточки</span>
            <Icon name="ChevronRight" className="h-3 w-3 shrink-0 text-(--color-text-secondary)" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <Icon name="Table2" className="h-3.5 w-3.5 shrink-0 text-(--color-text-secondary)" strokeWidth={2} />
            <span className="flex-1 truncate text-[11px] text-(--color-text-secondary)">Колонки, дорожки, ячейки</span>
            <Icon name="ChevronRight" className="h-3 w-3 shrink-0 text-(--color-text-secondary)" strokeWidth={2} />
          </div>
        </div>

        {/* editor */}
        <div className="relative flex-1 overflow-hidden bg-(--color-surface-page) px-6 py-3">
          <Toolbar />

          {/* title */}
          <div className="flex items-center text-[20px] font-bold text-(--color-text-primary)">
            Название нового документа
            <span className="ml-0.5 inline-block h-5 w-px bg-(--color-action-primary)" />
          </div>

          {/* body text (заглушка-абзацы) */}
          <div className="mt-3 space-y-3.5">
            <div className="space-y-2">
              <span className="block h-2 w-full rounded-full bg-[#e8e8e8]" />
              <span className="block h-2 w-11/12 rounded-full bg-[#e8e8e8]" />
              <span className="block h-2 w-3/5 rounded-full bg-[#e8e8e8]" />
            </div>
            <div className="space-y-2">
              <span className="block h-2 w-full rounded-full bg-[#e8e8e8]" />
              <span className="block h-2 w-5/6 rounded-full bg-[#e8e8e8]" />
              <span className="block h-2 w-2/5 rounded-full bg-[#e8e8e8]" />
            </div>
          </div>

          {/* colored number tiles */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {TILES.map((t, i) => (
              <div
                key={i}
                className="flex h-12 items-center justify-center rounded-(--radius-lg) text-[26px] font-bold"
                style={{ background: t.bg, color: t.fg }}
              >
                {t.n}
              </div>
            ))}
          </div>

          {/* table */}
          <div className="mt-3 overflow-hidden rounded-(--radius-lg) border border-(--color-border-default)">
            <div className="grid grid-cols-4 border-b border-(--color-border-default) bg-(--color-surface-section)">
              {['Задача', 'Статус', 'Исполнитель', 'Срок'].map((h, i) => (
                <div key={i} className="border-r border-(--color-border-default) px-3 py-2 text-[11px] font-medium text-(--color-text-secondary) last:border-r-0">
                  {h}
                </div>
              ))}
            </div>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} className="grid grid-cols-4 border-b border-(--color-border-default) last:border-b-0">
                {[0, 1, 2, 3].map((c) => (
                  <div key={c} className="space-y-1.5 border-r border-(--color-border-default) px-3 py-2.5 last:border-r-0">
                    <span className="block h-1.5 w-4/5 rounded-full bg-(--color-border-default)" />
                    <span className="block h-1.5 w-3/5 rounded-full bg-(--color-border-default)" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mock ноутбука (MacBook, flat-white) с экраном редактора документа Kaiten:
 * сайдбар-дерево разделов, плавающая панель форматирования, заголовок,
 * абзацы-заглушки, цветные нумерованные блоки, таблица и пикер цвета,
 * «вылетающий» за правый край корпуса.
 */
export function LaptopDocEditorMock() {
  return (
    <div aria-hidden className="relative inline-flex flex-col items-center">
      {/* lid */}
      <div
        className={cn(
          'relative h-[480px] w-[760px] overflow-hidden rounded-t-[18px] border-[5px] border-white bg-(--color-surface-card)',
          'shadow-[0_0_44px_-16px_rgba(45,45,45,0.20)]',
        )}
      >
        <DocEditor />
        {/* внутренняя тень по рамке */}
        <div className="pointer-events-none absolute inset-0 z-50 rounded-t-[13px] shadow-[inset_0_0_6px_0_rgba(0,0,0,0.1)]" />
      </div>

      {/* hinge / base */}
      <div
        className="relative"
        style={{
          width: '880px',
          height: '24px',
          marginTop: '-2px',
          background: '#ffffff',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 30px 44px -14px rgba(45,45,45,0.40), 0 8px 18px -6px rgba(45,45,45,0.18)',
        }}
      >
        <span className="absolute left-1/2 top-0 h-[7px] w-[128px] -translate-x-1/2 rounded-b-[8px] bg-[#e0e0e0]" />
      </div>

      {/* плашка пикера цвета — поверх корпуса, выходит за правую грань */}
      <ColorPopover />
    </div>
  );
}
