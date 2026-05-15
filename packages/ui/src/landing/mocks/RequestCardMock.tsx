import { cn } from '../../primitives/cn';

/**
 * Mock карточки заявки с переписками клиент/агент и чек-листом.
 * Соответствует блоку «Отвечайте на запросы в карточках» из референса.
 */
export function RequestCardMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)] p-6 md:p-7',
      )}
    >
      {/* window chrome */}
      <div className="mb-5 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-3 text-xs text-(--color-text-secondary)">Заявка #18524</span>
      </div>

      <h3 className="text-xl font-semibold text-(--color-text-primary)">Оплата не прошла</h3>
      <p className="mt-1 text-sm text-(--color-text-secondary)">
        Клиент пишет в Telegram, команда отвечает прямо из карточки.
      </p>

      {/* messages */}
      <div className="mt-5 space-y-3">
        <div
          className={cn(
            'max-w-[85%] rounded-2xl rounded-bl-md',
            'bg-(--color-neutral-100) px-4 py-2.5 text-sm text-(--color-text-primary)',
          )}
        >
          Здравствуйте, не могу оплатить тариф.
        </div>
        <div
          className={cn(
            'ml-auto max-w-[85%] rounded-2xl rounded-br-md',
            'bg-(--color-action-primary-soft) px-4 py-2.5 text-sm text-(--color-text-primary)',
          )}
        >
          Проверили платёж — отправили новую ссылку. Подтвердите получение, пожалуйста.
        </div>
      </div>

      {/* checklist */}
      <div className="mt-6 space-y-2 rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-section)/40 p-3">
        {[
          { text: 'Проверить оплату', done: true },
          { text: 'Отправить инструкцию', done: true },
          { text: 'Закрыть обращение', done: false },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <span
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center rounded-md border text-[12px]',
                item.done
                  ? 'border-(--color-action-primary) bg-(--color-action-primary) text-white'
                  : 'border-(--color-border-default) bg-white',
              )}
            >
              {item.done ? '✓' : ''}
            </span>
            <span
              className={cn(
                item.done
                  ? 'text-(--color-text-secondary) line-through'
                  : 'text-(--color-text-primary)',
              )}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
