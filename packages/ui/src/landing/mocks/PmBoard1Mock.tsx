import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

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
  return (
    <svg viewBox="0 0 269 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        d="M59.0856 0H20.9144C9.36367 0 0 9.35857 0 20.903V59.097C0 70.6414 9.36367 80 20.9144 80H59.0856C70.6363 80 80 70.6414 80 59.097V20.903C80 9.35857 70.6363 0 59.0856 0Z"
        fill="#F11F24"
      />
      <path
        d="M31.8576 8.72032L8.72032 31.8576C4.27271 36.3052 4.27271 43.5162 8.72032 47.9638L31.8576 71.101C36.3052 75.5486 43.5162 75.5486 47.9638 71.101L71.101 47.9638C75.5486 43.5162 75.5486 36.3052 71.101 31.8576L47.9638 8.72032C43.5162 4.27271 36.3052 4.27271 31.8576 8.72032Z"
        fill="#78FFC7"
      />
      <path
        d="M39.7808 59.559C50.7054 59.559 59.5615 50.7034 59.5615 39.7795C59.5615 28.8556 50.7054 20 39.7808 20C28.8562 20 20 28.8556 20 39.7795C20 50.7034 28.8562 59.559 39.7808 59.559Z"
        fill="#7D4CCF"
      />
      <path
        d="M187.261 31.8525H193.694V34.7574H187.261V45.5476C187.261 46.599 187.372 47.4982 187.593 48.2452C187.842 48.9646 188.161 49.5597 188.548 50.03C188.963 50.4726 189.433 50.8048 189.959 51.0261C190.484 51.2475 191.038 51.3582 191.619 51.3582C192.449 51.3582 193.251 51.2331 194.026 50.9841C194.8 50.7074 195.451 50.417 195.977 50.1127L197.221 52.8102C196.391 53.2252 195.437 53.571 194.358 53.8477C193.306 54.1243 192.255 54.263 191.204 54.2631C188.078 54.2631 185.671 53.4881 183.983 51.9388C182.295 50.3895 181.451 48.2591 181.451 45.5476V34.7574H177.508V31.8525H181.451V25.2118H187.261V31.8525Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M211.069 31.0216C212.729 31.0217 214.292 31.2703 215.759 31.7683C217.225 32.2663 218.497 33.0003 219.576 33.9686C220.655 34.9093 221.514 36.0572 222.15 37.4129C222.786 38.7685 223.104 40.304 223.104 42.0192V44.9249H205.383C205.715 47.2212 206.504 48.8673 207.749 49.8633C209.021 50.8593 210.612 51.3574 212.521 51.3574C213.877 51.3574 215.136 51.1224 216.298 50.652C217.488 50.1817 218.65 49.5175 219.784 48.6599L221.444 51.1501C220.918 51.6204 220.296 52.0489 219.576 52.4361C218.885 52.8234 218.124 53.1556 217.294 53.4322C216.492 53.6812 215.648 53.8753 214.763 54.0137C213.877 54.1797 212.992 54.2623 212.106 54.2623C210.142 54.2623 208.344 53.9999 206.711 53.4743C205.107 52.9763 203.737 52.2431 202.602 51.2748C201.468 50.2787 200.582 49.0612 199.946 47.6224C199.337 46.1837 199.033 44.5234 199.033 42.642C199.033 40.7884 199.324 39.1422 199.905 37.7036C200.513 36.2372 201.343 35.0196 202.395 34.0512C203.474 33.0552 204.747 32.3084 206.213 31.8104C207.68 31.2847 209.298 31.0216 211.069 31.0216ZM211.069 33.7192C210.267 33.7192 209.519 33.8716 208.827 34.1759C208.136 34.4803 207.527 34.9641 207.001 35.628C206.503 36.292 206.088 37.1502 205.756 38.2016C205.452 39.2529 205.286 40.5254 205.258 42.0192H216.879C216.879 40.5806 216.713 39.3355 216.381 38.2843C216.049 37.233 215.606 36.3754 215.053 35.7114C214.527 35.0197 213.904 34.5216 213.185 34.2172C212.494 33.8853 211.788 33.7192 211.069 33.7192Z"
        fill="black"
      />
      <path d="M172.774 53.433H166.964V32.2671H172.774V53.433Z" fill="black" />
      <path
        d="M239.869 31.8525C243.826 31.8525 246.745 32.572 248.626 34.0107C250.535 35.4217 251.49 37.5385 251.49 40.3606V53.433H245.679V40.3606C245.679 38.3685 245.181 36.9432 244.185 36.0855C243.189 35.2003 241.75 34.7574 239.869 34.7574H234.474V53.433H228.664V31.8525H239.869Z"
        fill="black"
      />
      <path
        d="M112.265 37.4542H119.113L128.658 24.381H135.298L124.923 38.6989L135.921 53.4322H129.073L119.527 40.5664H112.265V53.4322H106.247V24.381H112.265V37.4542Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M149.385 31.0216C151.155 31.0216 152.719 31.2294 154.075 31.6444C155.43 32.0594 156.579 32.6538 157.52 33.4285C158.46 34.2032 159.165 35.1304 159.636 36.2094C160.134 37.2608 160.383 38.4367 160.383 39.7371V53.4322H148.762C144.999 53.4322 142.219 52.8651 140.421 51.7308C138.65 50.5964 137.764 48.8813 137.764 46.585C137.764 44.2886 138.65 42.5729 140.421 41.4385C142.219 40.3042 144.999 39.7371 148.762 39.7371H154.573C154.573 37.7452 154.047 36.2788 152.996 35.338C151.972 34.3974 150.63 33.9266 148.97 33.9265C147.725 33.9265 146.507 34.1206 145.318 34.508C144.128 34.8676 143.063 35.3657 142.122 36.0021L140.669 33.5119C141.278 33.0968 141.942 32.7367 142.661 32.4324C143.222 32.2041 143.79 32.0072 144.366 31.8412L145.523 31.5302C146.099 31.385 146.666 31.2706 147.227 31.1876C148.001 31.077 148.721 31.0216 149.385 31.0216ZM148.762 42.642C145.58 42.6421 143.99 43.9567 143.99 46.585C143.99 49.2132 145.581 50.5272 148.762 50.5273H154.573V42.642H148.762Z"
        fill="black"
      />
      <path
        d="M169.869 23.5517C170.782 23.5518 171.529 23.8702 172.11 24.5065C172.691 25.1151 172.982 25.8347 172.982 26.6647C172.981 27.4946 172.691 28.2279 172.11 28.8642C171.557 29.4727 170.81 29.7768 169.869 29.7769C168.929 29.7769 168.167 29.4728 167.586 28.8642C167.033 28.2279 166.756 27.4946 166.756 26.6647C166.756 25.8347 167.033 25.1151 167.586 24.5065C168.167 23.8701 168.929 23.5517 169.869 23.5517Z"
        fill="black"
      />
    </svg>
  );
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
