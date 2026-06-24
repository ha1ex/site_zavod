import { cn } from '../primitives/cn';

export interface WaitlistFormProps {
  title: string;
  description?: string;
  submitLabel: string;
  /** Якорь секции — на него ведёт hero CTA. По умолчанию `waitlist`. */
  anchorId?: string;
  /**
   * Куда форма POST-ится. Верстальщик подменит на реальный endpoint.
   * По умолчанию `#` — заглушка.
   */
  action?: string;
  /** Ссылка на Политику конфиденциальности. */
  privacyHref?: string;
  /** Ссылка на согласие на обработку персональных данных. */
  dataConsentHref?: string;
  /** Ссылка на условия согласия на рассылку. */
  marketingHref?: string;
}

/**
 * Финальный блок-форма для waitlist-лендингов: телефон + email + домен в Kaiten,
 * плюс два обязательных согласия (политика + рассылка). Все поля required —
 * браузер сам валидирует перед submit. JS не требуется — обработчик настраивает
 * верстальщик через `action`.
 */
export function WaitlistForm({
  title,
  description,
  submitLabel,
  anchorId = 'waitlist',
  action = '#',
  privacyHref = '/privacy',
  dataConsentHref = '/privacy',
  marketingHref = '/privacy',
}: WaitlistFormProps) {
  return (
    <section
      id={anchorId}
      className={cn(
        'mx-auto w-full max-w-(--container-kaiten) scroll-mt-24',
        'px-4 py-16 md:px-6 lg:py-24',
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-(--radius-3xl)',
          'px-8 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20',
          'bg-(--color-action-primary) text-(--color-text-inverse)',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-(--color-text-inverse) opacity-10 blur-3xl"
        />
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* left: copy */}
          <div>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
              {title}
            </h2>
            {description && (
              <p className="mt-4 max-w-xl text-lg text-(--color-text-inverse)/80">
                {description}
              </p>
            )}
          </div>

          {/* right: form */}
          <form
            action={action}
            method="post"
            className={cn(
              'rounded-(--radius-2xl) bg-(--color-text-inverse) p-6 md:p-8',
              'text-(--color-text-primary) shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]',
            )}
          >
            <div className="flex flex-col gap-4">
              <Field
                id="phone"
                name="phone"
                type="tel"
                label="Телефон"
                placeholder="+7 999 000-00-00"
                autoComplete="tel"
              />
              <Field
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="name@company.ru"
                autoComplete="email"
              />
              <Field
                id="domain"
                name="domain"
                type="text"
                label="Ваш домен в Kaiten"
                placeholder="company.kaiten.ru"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Consent
                id="consent-privacy"
                name="consent_privacy"
                label={
                  <>
                    Я согласен с <ConsentLink href={privacyHref}>Политикой конфиденциальности</ConsentLink>{' '}
                    и даю <ConsentLink href={dataConsentHref}>согласие на обработку персональных данных</ConsentLink>
                  </>
                }
              />
              <Consent
                id="consent-marketing"
                name="consent_marketing"
                label={
                  <>
                    Я согласен <ConsentLink href={marketingHref}>получать рассылку</ConsentLink> от Kaiten
                    (обновления продукта и полезные материалы)
                  </>
                }
              />
            </div>

            <button
              type="submit"
              className={cn(
                'mt-6 inline-flex h-12 w-full items-center justify-center rounded-(--radius-xl)',
                'bg-(--color-action-primary) text-base font-semibold text-(--color-text-inverse)',
                'transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-(--color-action-primary) focus-visible:ring-offset-2',
              )}
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  name: string;
  type: 'text' | 'email' | 'tel';
  label: string;
  placeholder?: string;
  autoComplete?: string;
}

function Field({ id, name, type, label, placeholder, autoComplete }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-(--color-text-primary)">
        {label}
        <span aria-hidden className="ml-0.5 text-(--color-action-primary)">
          *
        </span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          'h-11 w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page)',
          'px-3.5 text-base text-(--color-text-primary) placeholder:text-(--color-text-secondary)',
          'transition focus:border-(--color-action-primary) focus:outline-none focus:ring-2',
          'focus:ring-(--color-action-primary)/30',
        )}
      />
    </div>
  );
}

function ConsentLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-(--color-action-primary) underline decoration-(--color-action-primary)/40 underline-offset-2 hover:decoration-(--color-action-primary)"
    >
      {children}
    </a>
  );
}

interface ConsentProps {
  id: string;
  name: string;
  label: React.ReactNode;
}

function Consent({ id, name, label }: ConsentProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
      <input
        id={id}
        name={name}
        type="checkbox"
        required
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0 rounded-(--radius-sm) border border-(--color-border-default)',
          'accent-(--color-action-primary)',
        )}
      />
      <span className="text-[13px] leading-snug text-(--color-text-secondary)">{label}</span>
    </label>
  );
}
