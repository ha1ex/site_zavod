import { cn } from '../../primitives/cn';

/**
 * Window: модалка «Создать шаблонный ответ» Kaiten Service Desk.
 * Шаблон с переменными {{request.owner}} / {{request.title}} и
 * чипами полей для автоподстановки. Слева — сайдбар разделов.
 */
export function WindowTemplateReplyMock() {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-(--radius-3xl)',
        'border border-(--color-border-default) bg-(--color-surface-card)',
        'shadow-[0_30px_80px_-30px_rgba(125,76,207,0.25)]',
      )}
    >
      {/* modal area */}
      <div className="p-6 md:p-7">
        <div className="mb-4 text-xs text-(--color-text-secondary)">Дэшборд</div>

        <h3 className="text-xl font-semibold text-(--color-text-primary)">
          Создать шаблонный ответ
        </h3>

        {/* name field */}
        <div className="mt-5">
          <div className="relative rounded-(--radius-lg) border border-(--color-border-default) px-3 pb-2.5 pt-3">
            <span className="absolute -top-2 left-2.5 bg-(--color-surface-card) px-1 text-[10px] text-(--color-text-secondary)">
              Название шаблонного ответа
            </span>
            <span className="text-sm text-(--color-text-primary)">Заявка принята</span>
          </div>
        </div>

        {/* body textarea (focused) */}
        <div className="mt-3 rounded-(--radius-lg) border-2 border-(--color-action-primary) p-3">
          <p className="text-sm leading-relaxed text-(--color-text-primary)">
            Здравствуйте,{' '}
            <span className="text-(--color-text-accent)">{'{{request.owner}}'}</span>, мы приняли
            вашу заявку{' '}
            <span className="text-(--color-text-accent)">{'{{request.title}}'}</span> и скоро начнём
            над ней работать.
            <br />
            Время ответа займёт приблизительно 10 минут.
          </p>
          <div className="mt-3 flex items-center gap-3 text-(--color-text-secondary)">
            <span className="text-base leading-none">+</span>
            <span className="text-sm leading-none">⋯</span>
          </div>
        </div>

        {/* autofill chips */}
        <div className="mt-4 text-xs text-(--color-text-secondary)">Поля для автоподстановки</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {['ID заявки', 'Название заявки', 'Автор заявки'].map((c) => (
            <span
              key={c}
              className="inline-flex items-center rounded-full bg-(--color-surface-section) px-3 py-1.5 text-xs text-(--color-text-primary)"
            >
              {c}
            </span>
          ))}
        </div>

        {/* actions */}
        <div className="mt-5 flex items-center gap-3">
          <span className="inline-flex h-9 items-center rounded-(--radius-lg) border border-(--color-border-default) px-4 text-xs font-medium text-(--color-text-secondary)">
            ОТМЕНА
          </span>
          <span className="inline-flex h-9 items-center rounded-(--radius-lg) border border-(--color-action-primary) px-4 text-xs font-semibold text-(--color-action-primary)">
            СОЗДАТЬ ШАБЛОННЫЙ ОТВЕТ
          </span>
        </div>
      </div>
    </div>
  );
}
