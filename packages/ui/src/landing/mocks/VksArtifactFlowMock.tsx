import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

/**
 * Mock-схема «От разговора к бизнес-артефакту»: контраст старой и новой
 * парадигмы (звонок → генератор артефактов → Документ Kaiten + Задача в
 * Kaiten, со стрелками от генератора). Используется в MediaCopy с
 * mediaVariant='vks-artifact-flow'.
 */
export function VksArtifactFlowMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl) p-5',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]',
      )}
    >
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1.1fr_auto_1fr]">
        {/* left: two paradigm cards */}
        <div className="flex flex-col gap-3">
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-3">
            <div className="text-[14px] font-semibold text-(--color-text-secondary)">
              Старая парадигма
            </div>
            <p className="mt-1 text-[13px] leading-snug text-(--color-text-secondary)">
              Звонок — оторванное от рабочего процесса событие.
            </p>
          </div>
          <div className="rounded-(--radius-xl) border border-(--color-action-primary) bg-(--color-action-primary-soft) p-3">
            <div className="text-[14px] font-semibold text-(--color-text-primary)">
              Новая парадигма
            </div>
            <p className="mt-1 text-[13px] leading-snug text-(--color-text-primary)">
              Созвон двигает рабочий процесс вперед, создавая новые артефакты.
            </p>
          </div>
        </div>

        {/* center: generator */}
        <div className="flex flex-col items-center justify-center gap-2 px-1">
          <div className="flex h-6 items-end gap-0.5">
            {[5, 11, 7, 16, 9, 14, 6, 12, 8].map((h, i) => (
              <span
                key={i}
                className="w-0.5 rounded-full bg-(--color-action-primary)"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-(--radius-2xl)',
              'bg-gradient-to-br from-(--color-action-primary) to-violet-400 text-white',
              'shadow-[0_12px_30px_-10px_rgba(125,76,207,0.6)]',
            )}
          >
            <Icon name="Video" className="h-6 w-6" />
          </div>
          <div className="text-center text-[12px] font-semibold leading-tight text-(--color-text-primary)">
            Звонок
            <br />в Kaiten
          </div>
        </div>

        {/* right: outputs with arrows from the generator */}
        <div className="flex flex-col gap-3">
          {/* Документ Kaiten */}
          <div className="flex items-center gap-1.5">
            <Icon
              name="ArrowRight"
              className="h-4 w-4 shrink-0 text-(--color-action-primary)"
            />
            <div className="flex-1 rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-3">
              <div className="flex items-center gap-1.5">
                <Icon name="FileText" className="h-3.5 w-3.5 text-(--color-action-primary)" />
                <span className="text-[13px] font-semibold text-(--color-text-primary)">
                  Документ Kaiten
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                <span className="block h-1.5 w-full rounded-full bg-(--color-neutral-200)" />
                <span className="block h-1.5 w-4/5 rounded-full bg-(--color-neutral-200)" />
                <span className="block h-1.5 w-3/5 rounded-full bg-(--color-neutral-200)" />
              </div>
            </div>
          </div>
          {/* Задача в Kaiten */}
          <div className="flex items-center gap-1.5">
            <Icon
              name="ArrowRight"
              className="h-4 w-4 shrink-0 text-(--color-action-primary)"
            />
            <div className="flex-1 rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-3">
              <div className="flex items-center gap-1.5">
                <Icon name="SquareCheckBig" className="h-3.5 w-3.5 text-(--color-action-primary)" />
                <span className="text-[13px] font-semibold text-(--color-text-primary)">
                  Задача в Kaiten
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-(--radius-sm) bg-(--color-action-primary-soft)">
                  <Icon name="Check" className="h-2.5 w-2.5 text-(--color-action-primary)" />
                </span>
                <span className="block h-1.5 flex-1 rounded-full bg-(--color-neutral-200)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
