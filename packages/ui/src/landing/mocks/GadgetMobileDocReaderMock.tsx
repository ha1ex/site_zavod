import { Icon } from '../../primitives/Icon';
import { cn } from '../../primitives/cn';

/**
 * Mock мобильного экрана с открытым документом: верхний бар с возвратом и
 * заголовком, мини-оглавление, чек-лист, нижняя навигация (Документы / Поиск /
 * Уведомления / Я). Тон: «инструкция всегда под рукой — даже в дороге».
 */
export function MobileDocReaderMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative mx-auto flex aspect-[286/549] w-full max-w-[280px] flex-col overflow-hidden rounded-[34px]',
        'border-[8px] border-white bg-(--color-surface-card)',
        'shadow-[0_0_44px_-16px_rgba(45,45,45,0.38)]',
      )}
    >
      {/* status bar */}
      <div className="relative flex items-center justify-between bg-(--color-surface-page) px-4 py-1.5 text-[10px] font-medium text-(--color-text-primary)">
        <span>9:41</span>
        <span className="absolute left-1/2 top-0 h-4 w-20 -translate-x-1/2 rounded-b-2xl bg-(--color-surface-page)" />
        <div className="flex items-center gap-1">
          <Icon name="Wifi" className="h-3 w-3" strokeWidth={2.5} />
          <Icon name="Battery" className="h-3 w-3" strokeWidth={2.5} />
        </div>
      </div>

      {/* nav */}
      <div className="flex items-center gap-2 border-b border-(--color-border-default) bg-(--color-surface-page) px-3 py-2.5">
        <Icon name="ChevronLeft" className="h-4 w-4 text-(--color-text-primary)" strokeWidth={2} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-(--color-text-primary)">
            Регламент работы поддержки
          </div>
          <div className="text-[10.5px] text-(--color-text-secondary)">База знаний · Поддержка</div>
        </div>
        <Icon name="MoreHorizontal" className="h-4 w-4 text-(--color-text-secondary)" strokeWidth={2} />
      </div>

      {/* content */}
      <div className="flex-1 space-y-3 bg-(--color-surface-page) px-3 py-3">
        {/* outline pill */}
        <div className="flex items-center gap-1.5 rounded-(--radius-lg) bg-(--color-surface-section) p-2">
          <Icon name="ListTree" className="h-3 w-3 text-(--color-text-secondary)" strokeWidth={2} />
          <span className="text-[9.5px] text-(--color-text-secondary)">
            Содержание · 7 разделов
          </span>
          <Icon name="ChevronDown" className="ml-auto h-3 w-3 text-(--color-text-secondary)" strokeWidth={2} />
        </div>

        <div className="text-[13px] font-semibold leading-tight text-(--color-text-primary)">
          Как обработать обращение
        </div>

        <div className="text-[10.5px] leading-relaxed text-(--color-text-secondary)">
          Если обращение пришло в нерабочее время, дежурный сначала отвечает клиенту в течение
          15 минут, а затем заводит карточку в общей очереди.
        </div>

        {/* checklist */}
        <div className="space-y-1.5 rounded-(--radius-lg) border border-(--color-action-primary)/20 bg-(--color-action-primary-soft)/30 p-2.5">
          <div className="text-[8.5px] font-semibold uppercase tracking-wide text-(--color-text-accent)">
            Что сделать
          </div>
          {[
            { text: 'Подтвердить, что разбираемся', done: true },
            { text: 'Завести карточку обращения', done: true },
            { text: 'Передать тимлиду, если P1', done: false },
            { text: 'Закрыть с резюме решения', done: false },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span
                className={cn(
                  'mt-0.5 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-(--radius-sm) border text-[8px]',
                  c.done
                    ? 'border-(--color-action-primary) bg-(--color-action-primary) text-white'
                    : 'border-(--color-border-default) bg-(--color-surface-card)',
                )}
              >
                {c.done && '✓'}
              </span>
              <span
                className={cn(
                  'text-[10px]',
                  'text-(--color-text-primary)',
                )}
              >
                {c.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* tab bar */}
      <div className="flex items-center justify-around border-t border-(--color-border-default) bg-(--color-surface-section) px-2 pb-3 pt-2">
        {[
          { icon: 'FileText', label: 'Документы', active: true },
          { icon: 'Search', label: 'Поиск' },
          { icon: 'Bell', label: 'События' },
          { icon: 'User', label: 'Я' },
        ].map((t, i) => (
          <span
            key={i}
            className={cn(
              'flex flex-col items-center gap-0.5',
              t.active ? 'text-(--color-text-accent)' : 'text-(--color-text-secondary)',
            )}
          >
            <Icon name={t.icon} className="h-4 w-4" strokeWidth={2} />
            <span className="text-[8.5px]">{t.label}</span>
          </span>
        ))}
      </div>

      {/* внутреннее свечение/тень по рамке (как в реф-SVG: blur ~6px, чёрный 10%) */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[26px] shadow-[inset_0_0_6px_0_rgba(0,0,0,0.1)]" />
    </div>
  );
}
