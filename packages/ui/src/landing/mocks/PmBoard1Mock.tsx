import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';
import { KaitenLogo as BrandLogo } from '../KaitenLogo';

/** Серый скелетон-бар (имитация строки текста на карточке). */
function Bar({ className }: { className?: string }) {
  return <div className={cn('h-1.5 rounded-full bg-(--color-neutral-200)', className)} />;
}

/** Цветной короткий акцент сверху карточки. */
const ACCENT: Record<string, string> = {
  violet: 'bg-(--color-action-primary)',
  orange: 'bg-(--color-orange-100)',
  yellow: 'bg-amber-300',
  green: 'bg-(--color-green-100)',
  red: 'bg-(--color-red-100)',
  blue: 'bg-(--color-blue-100)',
};

/** Фирменный логотип Kaiten (знак + чёрный wordmark). */
function KaitenLogo({ className }: { className?: string }) {
  return <BrandLogo tone="dark" className={className} />;
}

/** Аватар-«фото» — мягкий градиентный кружок. */
function Avatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 rounded-full bg-gradient-to-br from-pink-200 via-violet-200 to-violet-300',
        className,
      )}
    />
  );
}

/** Заголовок колонки со счётчиком. */
function ColHead({
  name,
  count,
  tone = 'amber',
  check,
}: {
  name: string;
  count: number;
  tone?: 'amber' | 'green';
  check?: boolean;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      {check && <Icon name="Check" className="h-3 w-3 text-(--color-green-100)" strokeWidth={3} />}
      <span className="text-[12px] font-semibold text-(--color-text-primary)">{name}</span>
      <span
        className={cn(
          'inline-flex h-4 min-w-4 items-center justify-center rounded-md px-1 text-[9px] font-semibold',
          tone === 'green' ? 'bg-(--color-green-12) text-green-700' : 'bg-amber-100 text-amber-700',
        )}
      >
        {count}
      </span>
    </div>
  );
}

/**
 * Mock приложения Kaiten в маркетинговом стиле (вариант `pm-board-1`): левый
 * сайдбар (лого, поиск, дерево досок-скелетоны с активным пунктом), борд со
 * свимлейнами «Цели» и «Текущие задачи», карточки-скелетоны с цветными
 * акцентами и аватарами, всплывающая карточка «Новая задача … · Срочно»,
 * аватар пользователя справа. Тон: «вся работа команды в одном окне».
 * Точная реплика эталона image 1370.svg; дорабатывается точечно.
 */
export function PmBoard1Mock() {
  return (
    <div aria-hidden className="relative">
      {/* окно — клипится по скруглению; всплывающая карточка вынесена наружу и выходит за край */}
      <div
        className={cn(
          'overflow-hidden rounded-(--radius-3xl)',
          'border border-(--color-border-default) bg-(--color-surface-card)',
          'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
        )}
      >
      {/* window chrome — верхняя панель окна (mac) */}
      <div className="flex items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-300" />
        <span className="h-2 w-2 rounded-full bg-yellow-300" />
        <span className="h-2 w-2 rounded-full bg-green-300" />
      </div>
      <div className="flex">
        {/* ─── sidebar ─────────────────────────────── */}
        <div className="hidden w-[28%] shrink-0 flex-col gap-3 border-r border-(--color-border-default) bg-(--color-surface-page) p-3 sm:flex">
          {/* logo */}
          <KaitenLogo className="h-5 w-auto" />

          {/* search */}
          <div className="flex items-center gap-1.5 rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-2 py-1.5">
            <Icon name="Search" className="h-3 w-3 text-(--color-text-secondary)" strokeWidth={2} />
            <Bar className="w-2/3" />
          </div>

          {/* nav */}
          <div className="flex flex-col gap-1">
            {[
              { icon: 'Folder', w: 'w-3/4', active: false },
              { icon: 'Star', w: 'w-1/2', active: false },
              { icon: 'LayoutGrid', w: 'w-4/5', active: true },
              { icon: 'Folder', w: 'w-2/3', active: false },
            ].map((r, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-1.5 rounded-(--radius-lg) px-1.5 py-1.5',
                  r.active && 'bg-(--color-action-primary-soft)',
                )}
              >
                <Icon
                  name={r.icon}
                  className={cn(
                    'h-3 w-3',
                    r.active ? 'text-(--color-text-accent)' : 'text-(--color-text-secondary)',
                  )}
                  strokeWidth={2}
                />
                <div
                  className={cn(
                    'h-1.5 rounded-full',
                    r.w,
                    r.active ? 'bg-(--color-action-primary)' : 'bg-(--color-neutral-200)',
                  )}
                />
              </div>
            ))}

            {/* board tree */}
            <div className="mt-1 flex flex-col gap-1.5 pl-1">
              {['w-4/5', 'w-2/3', 'w-3/4', 'w-1/2', 'w-3/5', 'w-4/5', 'w-2/3'].map((w, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Icon name="ChevronRight" className="h-2.5 w-2.5 text-(--color-text-secondary)" strokeWidth={2} />
                  <Icon name="LayoutGrid" className="h-2.5 w-2.5 text-(--color-text-secondary)" strokeWidth={2} />
                  <Bar className={w} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── main board ──────────────────────────── */}
        <div className="relative min-w-0 flex-1">
          {/* toolbar */}
          <div className="flex items-center justify-between border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2">
            <span className="inline-flex items-center gap-1.5 rounded-(--radius-lg) bg-(--color-action-primary-soft) px-2 py-1">
              <Icon name="LayoutGrid" className="h-3 w-3 text-(--color-text-accent)" strokeWidth={2} />
              <div className="h-1.5 w-10 rounded-full bg-(--color-action-primary)" />
            </span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-5 w-5 rounded-(--radius-md) bg-(--color-neutral-200)" />
              ))}
              <Avatar className="h-6 w-6 border border-(--color-surface-card)" />
            </div>
          </div>

          <div className="space-y-3 p-3">
            {/* swimlane: Цели */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-(--color-text-secondary)">
                <Icon name="GripVertical" className="h-3 w-3" strokeWidth={2} />
                Цели
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Очередь */}
                <div>
                  <ColHead name="Очередь" count={1} />
                  <div className="flex flex-col gap-2">
                    <div className="flex h-20 items-start justify-start rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2">
                      <Avatar className="h-8 w-8" />
                    </div>
                    <div className="relative overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2">
                      <div className={cn('mb-1.5 h-1 w-7 rounded-full', ACCENT.violet)} />
                      <Bar className="w-full" />
                      <Bar className="mt-1 w-2/3" />
                    </div>
                  </div>
                </div>

                {/* middle */}
                <div>
                  <div className="mb-2 h-4" />
                  <div className="flex flex-col gap-2">
                    <div className="h-20 rounded-(--radius-lg) border border-(--color-action-primary)/30 bg-(--color-action-primary-soft)/60" />
                    <div className="relative overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2">
                      <div className={cn('mb-1.5 h-1 w-7 rounded-full', ACCENT.orange)} />
                      <Bar className="w-3/4" />
                      <Bar className="mt-1 w-1/2" />
                    </div>
                  </div>
                </div>

                {/* Готово */}
                <div>
                  <ColHead name="Готово" count={1} tone="green" check />
                  <div className="relative flex h-20 flex-col overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2">
                    <div className={cn('mb-1.5 h-1 w-7 rounded-full', ACCENT.yellow)} />
                    <Bar className="w-full" />
                    <Bar className="mt-1 w-5/6" />
                    <div className="mt-1 h-1.5 w-2/3 rounded-full bg-(--color-blue-12)" />
                    <span className="mt-auto inline-block h-4 w-4 rounded-full border border-(--color-border-default)" />
                  </div>
                </div>
              </div>
            </div>

            {/* swimlane: Текущие задачи */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-(--color-text-secondary)">
                <Icon name="GripVertical" className="h-3 w-3" strokeWidth={2} />
                Текущие задачи
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Очередь */}
                <div className="flex flex-col">
                  <ColHead name="Очередь" count={1} />
                  <div className="relative flex-1 overflow-hidden rounded-(--radius-lg) border border-(--color-red-100)/30 bg-(--color-red-12) p-2">
                    <div className="mb-1 flex items-center gap-1">
                      <span className="text-[12px] leading-none">✋</span>
                      <div className={cn('h-1 w-10 rounded-full', ACCENT.red)} />
                    </div>
                    <div className={cn('mb-1.5 h-1 w-6 rounded-full', ACCENT.green)} />
                    <Bar className="w-3/4" />
                    <Bar className="mt-1 w-1/2" />
                  </div>
                </div>

                {/* В работе */}
                <div className="flex flex-col">
                  <ColHead name="В работе" count={1} />
                  <div className="relative flex-1 overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2">
                    <div className={cn('mb-1.5 h-1 w-7 rounded-full', ACCENT.orange)} />
                    <Bar className="w-full" />
                    <Bar className="mt-1 w-2/3" />
                  </div>
                </div>

                {/* Готово */}
                <div className="flex flex-col">
                  <ColHead name="Готово" count={1} tone="green" check />
                  <div className="relative flex flex-1 flex-col overflow-hidden rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) p-2">
                    <div className={cn('mb-1.5 h-1 w-7 rounded-full', ACCENT.orange)} />
                    <Bar className="w-full" />
                    <Bar className="mt-1 w-3/4" />
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="inline-block h-4 w-4 rounded-full border border-(--color-border-default)" />
                      <span className="inline-flex items-center gap-1 rounded-full bg-(--color-red-12) px-1.5 py-0.5">
                        <span className="text-[9px] leading-none">🔥</span>
                        <span className="h-1 w-6 rounded-full bg-(--color-red-100)" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* floating card — вынесена за пределы окна, выходит за верхний край */}
      <div className="absolute left-[48%] top-[-34px] w-[44%] rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-3 shadow-[0_24px_60px_-20px_rgba(125,76,207,0.45)]">
        <div className={cn('mb-2 h-1 w-8 rounded-full', ACCENT.violet)} />
        <div className="text-[13px] font-semibold leading-tight text-(--color-text-primary)">
          Новая задача: Презентация для акционеров
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <Avatar className="h-7 w-7" />
          <span className="inline-flex items-center gap-1 rounded-full bg-(--color-red-12) px-2 py-1 text-[10px] font-semibold text-(--color-red-100)">
            🔥 Срочно
          </span>
        </div>
      </div>
    </div>
  );
}
