'use client';

import { useState } from 'react';
import { Icon } from '../primitives/Icon';
import { KaitenLogo } from './KaitenLogo';

/**
 * KaitenFooter — подвал one-to-one с kaiten.ru (тёмная тема): три колонки ссылок,
 * карточки соцсетей и статей, форма подписки, блок сравнений, статус ИТ-разработчика,
 * юр-реквизиты, нижняя панель с контактами и cookie-баннер. Контент захардкожен под
 * бренд, ссылки ведут на реальный kaiten.ru.
 */

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Компания',
    links: [
      { label: 'Тарифы', href: 'https://kaiten.ru/tariffs' },
      { label: 'Контакты', href: 'https://kaiten.ru/contacts' },
      { label: 'Сертификаты', href: 'https://kaiten.ru/certificates' },
      { label: 'Скачать презентацию', href: 'https://kaiten.ru/presentation' },
    ],
  },
  {
    title: 'Ресурсы',
    links: [
      { label: 'База знаний', href: 'https://kaiten.ru/help' },
      { label: 'Кейсы', href: 'https://kaiten.ru/blog/tag/case/' },
      { label: 'Блог', href: 'https://kaiten.ru/blog/' },
      { label: 'API', href: 'https://developers.kaiten.ru/' },
      { label: 'Дорожная карта', href: 'https://kaiten.ru/roadmap' },
      { label: 'Комьюнити', href: 'https://t.me/kaiten_ru' },
    ],
  },
  {
    title: 'Возможности',
    links: [
      { label: 'Партнерская программа', href: 'https://kaiten.ru/partners' },
      { label: 'Реферальная программа', href: 'https://kaiten.ru/referral' },
      { label: 'Дополнения', href: 'https://kaiten.ru/addons' },
      { label: 'On-premise', href: 'https://kaiten.ru/onpremise' },
      { label: 'Внедрение', href: 'https://kaiten.ru/implementation' },
      { label: 'Кайтен AI', href: 'https://kaiten.ru/ai' },
    ],
  },
];

const ARTICLES: { label: string; href: string }[] = [
  {
    label: '800 задач в год вместо 254: ИТ-отдел сети ветклиник справился с ростом нагрузки',
    href: 'https://kaiten.ru/blog/sase-belyi-klyk/',
  },
  {
    label: 'Как производства теряют часы на ручном контроле продаж — и как это решает CRM',
    href: 'https://kaiten.ru/blog/kak-proizvodstva-tieriaiut-chasy-na-ruchnom-kontrolie-prodazh-i-kak-eto-rieshaiet-crm/',
  },
];

const COMPARE: string[] = [
  'Trello', 'Jira', 'Asana', 'Weeek', 'Wrike', 'ClickUp', 'EvaTeam', 'MS Project',
  'Notion', 'Confluence', 'GanttPRO', 'Google Docs', 'Redmine', 'YouTrack',
  'Zendesk', 'Okdesk', 'Юздеск',
];

const SOCIAL: { label: string; href: string }[] = [
  { label: 'VK', href: 'https://vk.com/kaitenru' },
  { label: 'Rutube', href: 'https://rutube.ru/channel/42853908/' },
  { label: 'Habr', href: 'https://habr.com/ru/companies/kaiten/articles/' },
  { label: 'Telegram', href: 'https://t.me/kaiten_ru' },
  { label: 'Max', href: 'https://max.ru/id7714426252_biz' },
];

const LEGAL: { label: string; href: string }[] = [
  { label: 'Политика конфиденциальности', href: 'https://kaiten.ru/privacy' },
  { label: 'Лицензионный договор', href: 'https://kaiten.ru/terms-of-service' },
  { label: 'Пользовательское соглашение', href: 'https://kaiten.ru/eula' },
  { label: 'Оплата банковскими картами', href: 'https://kaiten.ru/payments' },
  { label: 'Техническая поддержка', href: 'https://kaiten.ru/contacts' },
];

export function KaitenFooter() {
  return (
    <>
      <footer className="bg-[#0e0f15] text-neutral-300">
        <div className="mx-auto w-full max-w-(--container-kaiten) px-4 pt-16 pb-10 md:px-6">
          {/* top grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* link columns */}
            {COLUMNS.map((col) => (
              <div key={col.title} className="lg:col-span-2">
                <p className="mb-4 text-sm font-semibold text-neutral-100">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* social + articles cards */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="rounded-(--radius-2xl) bg-neutral-900 p-5">
                <p className="text-sm font-semibold text-neutral-100">Каналы в соцсетях</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Фичи, новости и статьи про эффективное управление
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href="https://t.me/kaiten_ru"
                    className="inline-flex items-center gap-1.5 rounded-(--radius-lg) bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-100 hover:bg-neutral-700"
                  >
                    <Icon name="Send" className="h-3.5 w-3.5" strokeWidth={2} />
                    Telegram
                  </a>
                  <a
                    href="https://max.ru/id7714426252_biz"
                    className="inline-flex items-center gap-1.5 rounded-(--radius-lg) bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-100 hover:bg-neutral-700"
                  >
                    <Icon name="MessageCircle" className="h-3.5 w-3.5" strokeWidth={2} />
                    Max
                  </a>
                </div>
              </div>

              <div className="rounded-(--radius-2xl) bg-neutral-900 p-5">
                <p className="text-sm font-semibold text-neutral-100">Новые статьи</p>
                <ul className="mt-3 space-y-3">
                  {ARTICLES.map((a) => (
                    <li key={a.href}>
                      <a href={a.href} className="flex gap-2 text-xs leading-snug text-neutral-400 hover:text-white">
                        <Icon name="ArrowUpRight" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--color-text-accent)" strokeWidth={2} />
                        <span className="line-clamp-2">{a.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* newsletter */}
            <div className="lg:col-span-3">
              <NewsletterCard />
            </div>
          </div>

          {/* comparisons */}
          <div className="mt-12">
            <p className="mb-4 text-sm font-semibold text-neutral-100">
              Сравнили Кайтен с другими сервисами
            </p>
            <div className="flex flex-wrap gap-2">
              {COMPARE.map((name) => (
                <a
                  key={name}
                  href="https://kaiten.ru/blog/"
                  className="rounded-(--radius-lg) border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-white/25 hover:text-white"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* legal status + requisites */}
          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
            <div className="flex gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-lg) bg-(--color-action-primary-soft) text-(--color-text-accent)">
                <Icon name="ShieldCheck" className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-100">
                  Официальный статус российского ИТ‑разработчика
                </p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                  Кайтен внесен в реестр отечественного ПО{' '}
                  <a href="https://reestr.digital.gov.ru/reestr/870368/" className="text-(--color-text-accent) hover:underline">
                    №14347
                  </a>
                  , а компания аккредитована как ИТ‑организация
                </p>
                <a href="https://kaiten.ru/contacts" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-(--color-text-accent) hover:underline">
                  Подробнее
                  <Icon name="ArrowRight" className="h-3.5 w-3.5" strokeWidth={2} />
                </a>
              </div>
            </div>
            <div className="text-xs leading-relaxed text-neutral-400">
              <p className="font-medium text-neutral-200">
                Общество с ограниченной ответственностью «Кайтен Софтвер»
              </p>
              <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <span className="text-neutral-500">ИНН</span><span>7714426252</span>
                <span className="text-neutral-500">КПП</span><span>771401001</span>
                <span className="text-neutral-500">Юридический адрес</span>
                <span>125252, г. Москва, проезд Берёзовой рощи, д. 12, этаж 2, комната 55</span>
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center">
              <KaitenLogo tone="light" className="h-8 w-auto" />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="tel:+74958682599" className="text-sm font-medium text-neutral-100 hover:text-white">
                +7 (495) 868-25-99
              </a>
              <a href="mailto:sales@kaiten.ru" className="text-sm text-neutral-400 hover:text-white">
                sales@kaiten.ru
              </a>
              <div className="flex items-center gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="inline-flex h-8 items-center justify-center rounded-(--radius-md) border border-white/10 bg-neutral-900 px-2.5 text-[11px] font-medium text-neutral-300 hover:border-white/25 hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* legal links + copyright */}
          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL.map((l) => (
                <a key={l.label} href={l.href} className="hover:text-neutral-300">
                  {l.label}
                </a>
              ))}
            </div>
            <p>© {new Date().getFullYear()} Кайтен. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </>
  );
}

/* ─── private ─── */

function NewsletterCard() {
  const [sent, setSent] = useState(false);
  return (
    <div className="rounded-(--radius-2xl) bg-(--color-action-primary-soft) p-5">
      <p className="text-sm font-semibold text-(--color-text-primary)">Подписаться на рассылку</p>
      <p className="mt-1 text-xs text-(--color-text-secondary)">
        Получайте кейсы пользователей, статьи и обновления.
      </p>
      <form
        className="mt-3 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <input
          type="email"
          required
          placeholder="Ваш email"
          className="w-full rounded-(--radius-lg) border border-(--color-border-default) bg-white px-3 py-2 text-sm text-(--color-text-primary) outline-none focus:border-(--color-action-primary)"
        />
        <button
          type="submit"
          className="w-full rounded-(--radius-lg) bg-(--color-action-primary) px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {sent ? 'Готово ✓' : 'Подписаться'}
        </button>
      </form>
      <label className="mt-3 flex items-start gap-2 text-[11px] leading-snug text-(--color-text-secondary)">
        <input type="checkbox" className="mt-0.5 accent-[var(--color-action-primary)]" />
        <span>
          Я согласен с{' '}
          <a href="https://kaiten.ru/privacy" className="text-(--color-text-accent) hover:underline">
            Политикой конфиденциальности
          </a>{' '}
          и даю согласие на обработку персональных данных
        </span>
      </label>
      <label className="mt-2 flex items-start gap-2 text-[11px] leading-snug text-(--color-text-secondary)">
        <input type="checkbox" className="mt-0.5 accent-[var(--color-action-primary)]" />
        <span>Я согласен получать рассылку от Кайтен (обновления продукта и полезные материалы)</span>
      </label>
    </div>
  );
}

function CookieBanner() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#1b1c24] text-neutral-300">
      <div className="mx-auto flex w-full max-w-(--container-kaiten) flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-xs leading-relaxed text-neutral-400">
          Мы используем cookie, чтобы сделать сайт удобнее для вас. Продолжая пользоваться сайтом, вы
          соглашаетесь с{' '}
          <a href="https://kaiten.ru/privacy" className="text-(--color-text-accent) hover:underline">
            Политикой конфиденциальности
          </a>{' '}
          и правилами использования cookie.
        </p>
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="shrink-0 self-start rounded-(--radius-lg) bg-(--color-action-primary) px-5 py-2 text-sm font-semibold text-white hover:opacity-90 md:self-auto"
        >
          Хорошо
        </button>
      </div>
    </div>
  );
}
