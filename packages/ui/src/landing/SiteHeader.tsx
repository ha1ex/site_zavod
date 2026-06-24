import { Icon } from '../primitives/Icon';
import { cn } from '../primitives/cn';
import { KaitenLogo } from './KaitenLogo';

/**
 * SiteHeader — шапка в стиле kaiten.ru: фиолетовый промо-бар сверху + основная
 * навигация (лого «Кайтен», пункты меню, «Войти» / «Регистрация»). Пункты —
 * простые ссылки на реальный kaiten.ru (без раскрывающихся мега-меню).
 * Контент захардкожен под бренд (one-to-one с сайтом).
 */

const NAV: { label: string; href: string; caret?: boolean }[] = [
  { label: 'Продукт', href: 'https://kaiten.ru/product', caret: true },
  { label: 'Решения', href: 'https://kaiten.ru/teams', caret: true },
  { label: 'Услуги', href: 'https://kaiten.ru/implementation', caret: true },
  { label: 'На сервер', href: 'https://kaiten.ru/onpremise' },
  { label: 'ИИ', href: 'https://kaiten.ru/ai' },
  { label: 'Тарифы', href: 'https://kaiten.ru/tariffs' },
  { label: 'Кейсы', href: 'https://kaiten.ru/blog/tag/case/' },
  { label: 'Блог', href: 'https://kaiten.ru/blog/' },
];

const LOGIN = 'https://passport.kaiten.ru/';
const SIGNUP = 'https://passport.kaiten.ru/ru/registration';
const PROMO = 'https://kaiten.ru/webinar';

export function SiteHeader() {
  return (
    <header className="relative isolate">
      {/* promo bar */}
      <div className="w-full bg-[linear-gradient(90deg,#7d4ccf_0%,#9b5de5_100%)] text-white">
        <div className="mx-auto flex w-full max-w-(--container-kaiten) flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 md:px-6">
          <span className="hidden shrink-0 sm:inline-flex">
            <PromoThumb />
          </span>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-sm font-semibold leading-tight md:text-base">
              Вживую покажем, как работать в Кайтен
            </p>
            <p className="text-xs text-white/80">Во вторник, 16:00</p>
          </div>
          <a
            href={PROMO}
            className={cn(
              'ml-1 inline-flex shrink-0 items-center rounded-(--radius-lg) bg-white px-4 py-2',
              'text-xs font-semibold uppercase tracking-wide text-(--color-text-accent) hover:bg-white/90',
            )}
          >
            Участвовать
          </a>
        </div>
      </div>

      {/* main nav */}
      <div className="border-b border-(--color-border-default) bg-(--color-surface-page)">
        <div className="mx-auto flex w-full max-w-(--container-kaiten) items-center gap-6 px-4 py-3.5 md:px-6">
          {/* logo */}
          <a href="https://kaiten.ru" className="flex shrink-0 items-center" aria-label="Kaiten">
            <KaitenLogo tone="dark" className="h-8 w-auto" />
          </a>

          {/* nav links */}
          <nav className="hidden flex-1 items-center gap-5 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-(--color-text-primary) transition-colors hover:text-(--color-text-accent)"
              >
                {item.label}
                {item.caret && (
                  <Icon name="ChevronDown" className="h-3.5 w-3.5 text-(--color-text-secondary)" strokeWidth={2} />
                )}
              </a>
            ))}
          </nav>

          {/* actions */}
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <a
              href="https://kaiten.ru"
              aria-label="Язык"
              className="hidden h-9 w-9 items-center justify-center rounded-(--radius-lg) border border-(--color-border-default) text-(--color-text-secondary) hover:text-(--color-text-primary) sm:inline-flex"
            >
              <Icon name="Globe" className="h-4 w-4" strokeWidth={2} />
            </a>
            <a
              href={LOGIN}
              className="inline-flex items-center rounded-(--radius-lg) px-4 py-2 text-sm font-medium text-(--color-text-primary) hover:text-(--color-text-accent)"
            >
              Войти
            </a>
            <a
              href={SIGNUP}
              className="inline-flex items-center rounded-(--radius-lg) bg-(--color-action-primary) px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Регистрация
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── private ─── */

/** Мини-превью продукта в промо-баре (декоративная канбан-карточка). */
function PromoThumb() {
  return (
    <span
      aria-hidden
      className="flex h-9 w-14 items-center gap-0.5 overflow-hidden rounded-md bg-white/95 p-1 shadow-sm"
    >
      {[0, 1, 2].map((c) => (
        <span key={c} className="flex h-full flex-1 flex-col gap-0.5">
          <span className="h-1 rounded-full bg-(--color-action-primary)/70" />
          <span className="h-1 rounded-full bg-neutral-300" />
          <span className="h-1 rounded-full bg-neutral-300" />
        </span>
      ))}
    </span>
  );
}
