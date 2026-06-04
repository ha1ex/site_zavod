---
slug: ds-component-navigation
type: design-system
created: 2026-06-04
updated: 2026-06-04
sources:
  - https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7098-8822&m=dev
  - https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=7098-9467&m=dev
  - apps/web/public/reference/index.html
  - apps/web/public/reference/styles.css
related:
  - wiki/design-system/components/logo_kaiten.md
  - wiki/design-system/components/button.md
  - wiki/design-system/grid.md
  - wiki/design-system/spacing.md
  - wiki/design-system/typography.md
tags:
  - component
  - navigation
  - header
  - logo
stale: false
---

# LandingNavigation

Верхняя навигация лендингов Kaiten. Компонент всегда стоит первым элементом страницы, фиксирует бренд, основные разделы продукта и короткую action-зону. Desktop-версия повторяет Figma node `7098:8822`, mobile-версия повторяет node `7098:9467`.

## Структура

- **logo** - `Logo` primitive из `packages/ui/src/primitives/Logo.tsx`, вариант `language="eng"`, `tone="dark"`, `size="md"`. Знак: красный скругленный квадрат, зеленый скругленный ромб, фиолетовый круг; не использовать русскую текстовую версию.
- **sections** `7 items`:
  - `Продукт` + chevron down
  - `Решения` + chevron down, active violet
  - `Услуги` + chevron down
  - `On-premise`
  - `AI`
  - `Тарифы`
  - `Кейсы`
- **phoneAction** - icon-only outline button `44x44`, phone icon violet.
- **loginAction** - fill button `Войти`, `85x44`.
- **trialAction** - outline button `Попробовать`, `135x44`.
- **mobileMenuAction** - icon-only hamburger button `40x40`, visible below `1200px`.
- **mobileMenuPanel** - optional dropdown/list panel for opened state; it is not visible in the supplied Figma closed-state frame.

## Визуальный код

```tsx
import { Logo } from '../primitives';

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  active?: boolean;
  short?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Продукт', href: '#product', hasDropdown: true },
  { label: 'Решения', href: '#solutions', hasDropdown: true, active: true },
  { label: 'Услуги', href: '#services', hasDropdown: true },
  { label: 'On-premise', href: '#on-premise' },
  { label: 'AI', href: '#ai', short: true },
  { label: 'Тарифы', href: '#pricing' },
  { label: 'Кейсы', href: '#cases' },
];

export function LandingNavigation() {
  return (
    <header className="kaiten-nav">
      <div className="kaiten-nav__container">
        <div className="kaiten-nav__content">
          <div className="kaiten-nav__left">
            <Logo href="#top" language="eng" tone="dark" size="md" className="kaiten-nav__logo" />

            <nav className="kaiten-nav__menu" aria-label="Основная навигация">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  className={[
                    'kaiten-nav__link',
                    item.active ? 'is-active' : '',
                    item.short ? 'is-short' : '',
                  ].join(' ')}
                  href={item.href}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDownIcon />}
                </a>
              ))}
            </nav>
          </div>

          <div className="kaiten-nav__actions">
            <a className="kaiten-nav__phone" href="tel:+74994906499" aria-label="Позвонить">
              <PhoneIcon />
            </a>
            <a className="kaiten-nav__login" href="#login">Войти</a>
            <a className="kaiten-nav__trial" href="#trial">Попробовать</a>
          </div>

          <button
            className="kaiten-nav__menu-button"
            type="button"
            aria-label="Открыть меню"
            aria-expanded="false"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M5.2 7.4 10 12.2l4.8-4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.6 3.3c.6-.6 1.5-.6 2.1 0l2 2c.5.5.6 1.2.2 1.8l-.9 1.7a13 13 0 0 0 5.2 5.2l1.7-.9c.6-.3 1.3-.2 1.8.2l2 2c.6.6.6 1.5 0 2.1l-1.4 1.4c-1.2 1.2-3 1.5-4.6.9A18.4 18.4 0 0 1 4.3 9.3c-.6-1.6-.3-3.4.9-4.6l1.4-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 7h14M5 12h14M5 17h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

## CSS

```css
.kaiten-nav {
  position: relative;
  z-index: 20;
  display: flex;
  width: 100%;
  height: 80px;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #2d2d2d;
  font-family: Inter, system-ui, sans-serif;
}

.kaiten-nav__container {
  display: flex;
  width: 1280px;
  max-width: 1280px;
  height: 44px;
  align-items: center;
  padding: 0 32px;
}

.kaiten-nav__content {
  display: flex;
  width: 1216px;
  height: 44px;
  flex: 1 0 0;
  align-items: center;
}

.kaiten-nav__left {
  display: flex;
  width: 936px;
  height: 44px;
  flex: 1 0 0;
  align-items: center;
  gap: 16px;
}

.kaiten-nav__logo {
  display: flex;
  width: 148px;
  height: 44px;
  flex: 0 0 auto;
  align-items: center;
  color: #000000;
  text-decoration: none;
}

.kaiten-nav__logo-asset,
.kaiten-nav__logo svg,
.kaiten-nav__logo img {
  display: block;
  width: 100%;
  height: 100%;
}

.kaiten-nav__menu {
  display: flex;
  width: 772px;
  height: 24px;
  flex: 1 0 0;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.kaiten-nav__link {
  display: flex;
  height: 24px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  color: #2d2d2d;
  filter: drop-shadow(0 1px 2px rgba(16, 24, 40, 0.05));
  font-family: Roboto, Inter, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  line-height: 24px;
  text-align: center;
  text-decoration: none;
  transition: color 180ms cubic-bezier(.2, 0, .2, 1);
}

.kaiten-nav__link svg {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
}

.kaiten-nav__link.is-active,
.kaiten-nav__link:hover {
  color: #7d4ccf;
}

.kaiten-nav__actions {
  display: flex;
  width: 280px;
  height: 44px;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
}

.kaiten-nav__phone,
.kaiten-nav__login,
.kaiten-nav__trial {
  display: flex;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-family: Roboto, Inter, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  line-height: 24px;
  text-decoration: none;
}

.kaiten-nav__phone {
  width: 44px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  color: #7d4ccf;
}

.kaiten-nav__login {
  width: 85px;
  padding: 10px 16px;
  background: #7d4ccf;
  color: #ffffff;
}

.kaiten-nav__trial {
  width: 135px;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  color: #7d4ccf;
}

.kaiten-nav__login:hover {
  background: #6f43b8;
}

.kaiten-nav__phone:hover,
.kaiten-nav__trial:hover {
  border-color: rgba(125, 76, 207, .48);
  background: #efe9f9;
  color: #6f43b8;
}

.kaiten-nav__phone:focus-visible,
.kaiten-nav__login:focus-visible,
.kaiten-nav__trial:focus-visible,
.kaiten-nav__menu-button:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 4px rgba(152, 162, 179, .14);
}

.kaiten-nav__login:focus-visible {
  box-shadow: 0 0 0 4px rgba(55, 88, 249, .2);
}

.kaiten-nav__menu-button {
  display: none;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 8px;
  border: 0;
  border-radius: 8px;
  background: #ffffff;
  color: #2d2d2d;
}

@media (max-width: 1199px) {
  .kaiten-nav {
    height: 72px;
  }

  .kaiten-nav__container {
    width: 100%;
    max-width: none;
    height: 44px;
    align-self: stretch;
    padding: 0 12px 0 16px;
  }

  .kaiten-nav__content {
    width: 100%;
    height: 40px;
    flex: 1 1 auto;
    justify-content: space-between;
  }

  .kaiten-nav__left {
    width: 134px;
    height: 40px;
    flex: 0 0 auto;
  }

  .kaiten-nav__logo {
    width: 134px;
    height: 40px;
  }

  .kaiten-nav__menu,
  .kaiten-nav__actions {
    display: none;
  }

  .kaiten-nav__menu-button {
    display: flex;
  }
}
```

## Адаптация

- **Desktop 1280+**: header `80px`, внутренний контейнер `1280px`, рабочая ширина `1216px`, горизонтальные поля `32px`. Логотип занимает `148x44`, меню `772x24`, action-зона `280x44`.
- **Tablet и mobile до 1199px**: header `72px`, контейнер на всю ширину, поля `16px` слева и `12px` справа. Скрываются menu и action-зона, остается `Logo` primitive (`language="eng"`) высотой `40-44px` и hamburger `40x40`.
- **Mobile 360px**: расстояние от левого края до логотипа `16px`, от hamburger до правого края `12px`; строка не переносится и не меняет высоту.
- Closed mobile state не показывает dropdown. Open state должен раскрываться отдельной панелью под header и не сдвигать саму nav-строку.

## Состояния

- Default nav link: `#2d2d2d`.
- Active nav link: `#7d4ccf`; в Figma активен пункт `Решения`.
- Dropdown items используют chevron down `20x20`, stroke `currentColor`.
- Phone button: outline `44x44`, violet icon.
- `Войти`: fill violet, white text.
- `Попробовать`: outline white, violet text.
- Hover/focus не меняют размеры, padding или расположение элементов.

## Usage rules

- Используйте full logo в header на всех ширинах, если доступно место под брендовый SVG. Не пересобирайте logo mark и wordmark вручную.
- Для этого navigation component используйте только английский брендовый вариант `Logo`: `language="eng"`, `tone="dark"`. Русский wordmark `Кайтен` здесь не применять.
- На desktop не удаляйте пункт `AI`: он короткий, но самостоятельный пункт навигации.
- Пункты с будущими dropdown-меню должны всегда иметь chevron, даже если dropdown еще не реализован.
- На лендингах с одной продуктовой вертикалью active item выбирается по разделу аудитории или решения; по умолчанию `Решения`.
- Phone icon-only action должен иметь `aria-label`, потому что в header нет видимого номера.
- Mobile hamburger должен быть настоящей button-кнопкой с `aria-expanded`.

## Anti-patterns

- Не заменять логотип текстовой надписью без знака.
- Не рисовать форму логотипа CSS-слоями: знак и wordmark должны приходить из точного SVG/vector asset.
- Не показывать desktop-CTA на mobile: справа должен быть только hamburger.
- Не делать header sticky без отдельного решения по тени и overlap-состояниям.
- Не использовать capsule/pill-обводки для nav links: в Figma пункты навигации текстовые.
- Не менять порядок action-кнопок: телефон, `Войти`, `Попробовать`.
