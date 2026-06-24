import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

const PARTICIPANTS = [
  { initials: 'АС', name: 'Анна', speaking: true },
  { initials: 'ДП', name: 'Дмитрий', speaking: false },
  { initials: 'МК', name: 'Марина', speaking: false },
];

const AI_ITEMS = [
  { icon: 'CheckCircle2', kind: 'Решение', text: 'Релиз переносим на пятницу' },
  { icon: 'ListChecks', kind: 'Задача', text: 'Собрать чек-лист регресса · Марина' },
];

/**
 * Mock комнаты Kaiten-созвона (тёмная тема): слева — сетка участников и
 * управление встречей, справа — живая ИИ-панель, которая прямо во время
 * разговора превращает речь в решения и задачи. Тон концепта: «единое окно —
 * созвон и работа рядом, контекст не теряется». Вариант `meeting-room`.
 */
export function MeetingRoomMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-neutral-700/60 bg-neutral-900',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.45)]',
      )}
    >
      {/* window chrome */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 bg-neutral-800 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <div className="ml-2 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
          <span className="font-medium text-neutral-100">Kaiten · Встреча — Планёрка команды</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] font-medium text-green-400">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            Идёт встреча · 14:32
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1.25fr_1fr] md:p-5">
        {/* left: video grid + controls */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {PARTICIPANTS.map((p, i) => (
              <div
                key={i}
                className={cn(
                  'relative flex aspect-[4/3] items-center justify-center rounded-(--radius-xl) border bg-neutral-800',
                  p.speaking
                    ? 'border-(--color-action-primary) ring-2 ring-(--color-action-primary)/40'
                    : 'border-neutral-700',
                  i === 2 && 'col-span-1',
                )}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--color-action-primary-soft) text-[13px] font-semibold text-(--color-text-accent)">
                  {p.initials}
                </span>
                <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  <Icon name={p.speaking ? 'Mic' : 'MicOff'} className="h-2.5 w-2.5" strokeWidth={2} />
                  {p.name}
                </span>
              </div>
            ))}
            {/* tile: screen share placeholder */}
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-(--radius-xl) border border-dashed border-neutral-700 bg-neutral-800/50 text-neutral-400">
              <Icon name="MonitorUp" className="h-4 w-4" strokeWidth={2} />
              <span className="text-center text-[9px]">Демонстрация экрана</span>
            </div>
          </div>

          {/* controls */}
          <div className="flex items-center justify-center gap-1.5 rounded-(--radius-2xl) border border-white/10 bg-neutral-800 px-2 py-2">
            {(['Mic', 'Video', 'MonitorUp'] as const).map((n) => (
              <button
                key={n}
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 text-neutral-100"
              >
                <Icon name={n} className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            ))}
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-full bg-red-500 px-3 text-[11px] font-medium text-white"
            >
              <Icon name="PhoneOff" className="h-3.5 w-3.5" strokeWidth={2.5} />
              Выйти
            </button>
          </div>
        </div>

        {/* right: live AI panel */}
        <div className="flex flex-col rounded-(--radius-2xl) border border-(--color-action-primary)/40 bg-neutral-800 p-3 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--color-action-primary) text-white">
              <Icon name="Sparkles" className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <span className="text-[13px] font-semibold text-neutral-100">ИИ ведёт встречу</span>
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-neutral-400">
              <Icon name="Circle" className="h-2 w-2 fill-red-500 text-red-500" />
              запись
            </span>
          </div>

          {/* transcript line */}
          <div className="mt-2.5 rounded-(--radius-lg) border border-white/10 bg-neutral-900 p-2">
            <div className="text-[11px] uppercase tracking-wide text-neutral-500">Транскрипт</div>
            <p className="mt-1 text-[12px] leading-snug text-neutral-400">
              <span className="font-medium text-neutral-200">Анна:</span> давайте перенесём релиз на пятницу и закроем регресс…
            </p>
          </div>

          {/* captured artifacts */}
          <div className="mt-2.5 space-y-1.5">
            {AI_ITEMS.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-(--radius-lg) border border-white/10 bg-neutral-900 p-2"
              >
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-(--color-action-primary-soft) text-(--color-text-accent)">
                  <Icon name={a.icon} className="h-2.5 w-2.5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-(--color-action-primary)">
                    {a.kind}
                  </div>
                  <div className="truncate text-[12px] leading-tight text-neutral-100">{a.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 flex items-center gap-1 border-t border-white/10 pt-2 text-[11px] text-neutral-400">
            <Icon name="Clock" className="h-2.5 w-2.5" strokeWidth={2} />
            Время встречи списывается в учёт автоматически
          </div>
        </div>
      </div>
    </div>
  );
}
