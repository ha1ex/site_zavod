import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

const TAG: Record<'design' | 'admin' | 'text', [string, string]> = {
  design: ['#cdeee0', '#0a6e52'],
  admin: ['#e0d4f5', '#6b3fa0'],
  text: ['#fbd4d0', '#c2342b'],
};

type Step = { tag: 'design' | 'admin' | 'text'; t: string; sum?: number; subs: number; doc?: boolean };
type RCard = { t: string; st?: 'done' | 'wait'; sum?: number; subs?: number };

const BACKBONE: ({ t: string; doc?: boolean } | null)[] = [
  { t: 'Регистрация аккаунта', doc: true }, null, { t: 'Управление документами' }, null, null,
  { t: 'Редактирование документов' }, null, { t: 'Завершение работы с документами' }, null,
];

const YELLOW: Step[] = [
  { tag: 'design', t: 'Внешний вид страницы', sum: 10, subs: 1, doc: true },
  { tag: 'admin', t: 'Страница регистрации', subs: 1 },
  { tag: 'text', t: 'Открыть документ', subs: 1 },
  { tag: 'admin', t: 'Управлять документом', subs: 1 },
  { tag: 'admin', t: 'Удалить документ', subs: 1 },
  { tag: 'text', t: 'Редактировать документ', subs: 1, doc: true },
  { tag: 'text', t: 'Добавление вложений', subs: 1 },
  { tag: 'admin', t: 'Сохранить документ', subs: 1 },
  { tag: 'admin', t: 'Поделиться документом', subs: 1 },
];

const R1: RCard[][] = [
  [{ t: 'Дизайн и верстка лендинга регистрации', st: 'done', subs: 1 }],
  [{ t: 'Форма регистрации через почту', st: 'done', sum: 4, subs: 1 }, { t: 'Письмо с подтверждением с почты', st: 'done', subs: 1 }],
  [{ t: 'Создать новый документ', st: 'done', subs: 1 }, { t: 'Открыть существующий документ', st: 'done', subs: 1 }],
  [{ t: 'Объединять документы в папки', st: 'wait', subs: 1 }, { t: 'Поиск по документам', st: 'wait', subs: 1 }],
  [{ t: 'Удаление документов', st: 'wait', subs: 1 }],
  [{ t: 'Форматирование текста', st: 'wait', subs: 1 }, { t: 'Заголовки разных уровней', st: 'wait', subs: 1 }, { t: 'Шрифты и цвета шрифтов', st: 'wait', subs: 1 }],
  [{ t: 'Добавление изображений', st: 'wait', subs: 1 }, { t: 'Добавление таблиц', st: 'wait', subs: 1 }],
  [],
  [{ t: 'Автосохранение документа', st: 'wait', subs: 1 }, { t: 'Скачивание документов разных форматах', st: 'wait', subs: 1 }],
];

const R2: RCard[][] = [
  [{ t: 'Адаптивный дизайн для мобильных устройств' }],
  [{ t: 'Автосохранение пароля' }],
  [{ t: 'Сортировка по популярности' }, { t: 'Сортировка по цене' }],
  [{ t: 'Управлять доступом к документам' }, { t: 'Управлять доступом к папкам' }],
  [{ t: 'Восстановление удаленных документов' }],
  [{ t: 'Дизайн-блоки с выделенной информацией' }, { t: 'Распознавание голоса и адаптация' }],
  [{ t: 'Создание mindmap' }, { t: 'Встраиваемый контент' }],
  [],
  [{ t: 'печать документа' }],
];

function Tag({ tone }: { tone: 'design' | 'admin' | 'text' }) {
  const t = TAG[tone];
  return <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-medium" style={{ background: t[0], color: t[1] }}>{tone}</span>;
}
function MetaChip({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[12px] text-(--color-text-secondary)" style={light ? { background: 'rgba(255,255,255,0.6)' } : { background: 'var(--color-surface-section)' }}>{children}</span>;
}
function Status({ st }: { st: 'done' | 'wait' }) {
  return st === 'done'
    ? <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#39b54a] text-white"><Icon name="Check" className="h-3 w-3" strokeWidth={3} /></span>
    : <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#bfbfc4] text-white"><Icon name="Clock" className="h-3 w-3" strokeWidth={2.5} /></span>;
}

function YellowCard({ d }: { d: Step }) {
  return (
    <div className="space-y-2 rounded-(--radius-lg) p-3" style={{ background: '#fce9b0' }}>
      <div><Tag tone={d.tag} /></div>
      <div className="text-[13.5px] font-medium leading-snug text-(--color-text-primary)">{d.t}</div>
      <div className="flex items-center gap-1.5">
        {d.sum != null && <MetaChip light>Σ {d.sum}</MetaChip>}
        <MetaChip light><Icon name="Workflow" className="h-3.5 w-3.5" strokeWidth={2} />{d.subs}</MetaChip>
        {d.doc && <Icon name="FileText" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />}
      </div>
    </div>
  );
}
function ReleaseCard({ d }: { d: RCard }) {
  if (!d.st) {
    return <div className="rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-3 text-[13.5px] leading-snug text-(--color-text-primary) shadow-[0_1px_2px_rgba(45,45,45,0.05)]">{d.t}</div>;
  }
  return (
    <div className="space-y-2 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-3 shadow-[0_1px_2px_rgba(45,45,45,0.05)]">
      <div className="text-[13.5px] leading-snug text-(--color-text-primary)">{d.t}</div>
      <div className="flex items-center gap-1.5">
        <Status st={d.st} />
        {d.sum != null && <MetaChip>Σ {d.sum}</MetaChip>}
        <MetaChip><Icon name="Workflow" className="h-3.5 w-3.5" strokeWidth={2} />{d.subs}</MetaChip>
      </div>
    </div>
  );
}

function Lane({ name, dot, band, body, prog, info, cells }: { name: string; dot: string; band: string; body: string; prog: string; info?: boolean; cells: RCard[][] }) {
  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: band }}>
        <span className="text-[14px] font-semibold text-(--color-text-primary)">{name}</span>
        <span className="h-3 w-3 rounded-full" style={{ background: dot }} />
        {info && <Icon name="Info" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />}
        <span className="text-[13px] text-(--color-text-primary)">Σ {prog}</span>
        <span className="inline-flex items-center gap-1 text-[12px] font-medium uppercase tracking-wide text-(--color-text-secondary)"><Icon name="SquarePlus" className="h-4 w-4" strokeWidth={2} /> Создать на досках</span>
        <Icon name="ChevronUp" className="ml-auto h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />
      </div>
      <div className="px-4 py-4" style={{ background: body }}>
        <div className="flex gap-3">
          {cells.map((cards, i) => (
            <div key={i} className="w-[145px] shrink-0 space-y-3">
              {cards.map((d, j) => <ReleaseCard key={j} d={d} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Mock User Story Map (USM) Kaiten: «хребет» активностей (белые карточки),
 * ряд шагов-историй с тегами (design / admin / text), и релизы-свимлейны
 * («Первый релиз», «Следующий релиз») с карточками по колонкам и статусами.
 */
export function ModuleUsmMock() {
  return (
    <div aria-hidden className="w-max overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-surface-page)">
      {/* toolbar */}
      <div className="flex items-center justify-between border-b border-(--color-border-default) px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-9 items-center rounded-full bg-(--color-border-default) p-0.5"><span className="h-4 w-4 rounded-full bg-white shadow" /></span>
          <span className="text-[14px] text-(--color-text-primary)">Подробный</span>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md bg-(--color-surface-section) px-3 py-1.5 text-[13px] text-(--color-text-secondary)"><Icon name="Search" className="h-4 w-4" strokeWidth={2} /> Поиск</span>
      </div>

      {/* backbone + steps */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex gap-3">
          {BACKBONE.map((b, i) => (
            <div key={i} className="w-[145px] shrink-0">
              {b && (
                <div className="flex min-h-[92px] flex-col rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-3">
                  <div className="text-[13.5px] font-medium leading-snug text-(--color-text-primary)">{b.t}</div>
                  {b.doc && <Icon name="FileText" className="mt-auto h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          {YELLOW.map((d, i) => <div key={i} className="w-[145px] shrink-0"><YellowCard d={d} /></div>)}
        </div>
      </div>

      {/* releases */}
      <Lane name="Первый релиз" dot="#2f9fd0" band="#a3e4f0" body="#ddf3f9" prog="8 / 20" info cells={R1} />
      <Lane name="Следующий релиз" dot="#f5b800" band="#f3d886" body="#fdf4e0" prog="0 / 12" cells={R2} />
    </div>
  );
}
