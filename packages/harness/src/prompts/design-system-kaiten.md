---
name: design-system-kaiten-v01
description: Kaiten landing design system V01. Use when designing, reviewing, or implementing Kaiten-style landing pages, marketing UI sections, responsive grids, spacing, typography, colors, component states, FAQ/accordion, review cards, CTA blocks, headers, footers, and product-led SaaS UI patterns.
---

# Design System Kaiten V01

Use this skill to keep Kaiten landing pages and UI components consistent with the studied Figma design system and landing prototype.

Canonical source of truth: `design-system/kaiten-v01/` (HTML/PDF/PNG). This file is a distilled extract — if anything conflicts, trust the source.

## Core Style

Design calm B2B/SaaS interfaces: white surfaces, light-gray sections, real product UI screenshots, restrained typography, and violet as the single primary interaction color. Prefer product-led composition over decorative marketing layouts.

Avoid scanning or relying on the Figma `Bloks` area unless the user explicitly asks.

## Colors

Use these core tokens:

```css
--neutral-000: #ffffff;
--neutral-050: #fafafa;
--neutral-100: #f5f5f5;
--neutral-200: #eeeeee;
--neutral-300: #e0e0e0;
--neutral-400: #bdbdbd;
--neutral-500: #9e9e9e;
--neutral-600: #757575;
--neutral-700: #616161;
--neutral-800: #424242;
--neutral-900: #2d2d2d;
--neutral-950: #121212;

--violet-100: #7d4ccf;
--violet-12: #efe9f9;

--purple-100: #ab47bd;
--purple-12: #f4e8f7;
--blue-100: #2196f3;
--blue-12: #e4f2fd;
--green-100: #4caf51;
--green-12: #e9f5ea;
--lime-100: #a5ca00;
--lime-12: #f4f8e0;
--orange-100: #ffa100;
--orange-12: #fff3e0;
--red-100: #f44336;
--red-12: #fde8e6;
```

Use semantic aliases:

```css
--text-primary: var(--neutral-900);
--text-secondary: var(--neutral-600);
--text-inverse: var(--neutral-000);
--text-accent: var(--violet-100);
--surface-page: var(--neutral-000);
--surface-section: var(--neutral-100);
--surface-card: var(--neutral-000);
--border-default: var(--neutral-300);
--action-primary: var(--violet-100);
--action-primary-soft: var(--violet-12);
```

Use violet for CTA, links, active states, icons, focused/opened accordions, and carousel next controls. Use neutral grays for text hierarchy, borders, section backgrounds, and inactive UI.

## Typography

Use a neutral grotesk close to Inter:

```css
--font-family-base: "Inter", system-ui, sans-serif;

--text-xs: 12px; --leading-xs: 16px;
--text-sm: 14px; --leading-sm: 20px;
--text-md: 16px; --leading-md: 24px;
--text-lg: 18px; --leading-lg: 28px;
--text-xl: 20px; --leading-xl: 28px;
--text-2xl: 24px; --leading-2xl: 32px;
--text-3xl: 30px; --leading-3xl: 36px;
--text-4xl: 36px; --leading-4xl: 40px;
--text-5xl: 48px; --leading-5xl: 52px;
--text-6xl: 60px; --leading-6xl: 64px;
```

Use weights `Regular`, `Medium`, and `SemiBold`. Prefer `SemiBold` for headings and CTA labels, `Medium` for navigation and component titles, and `Regular` for body text.

Recommended landing usage:

- Desktop hero: `text-5xl` or `text-6xl`, `SemiBold`, tight line height.
- Mobile hero: `text-3xl`, `SemiBold`.
- Section headings: `text-3xl` to `text-4xl`.
- Body: `text-md` or `text-lg`.
- UI labels and meta: `text-xs` or `text-sm`.

## Spacing

Use a 4px-based spacing scale:

```css
--space-0: 0px;
--space-0-5: 2px;
--space-1: 4px;
--space-1-5: 6px;
--space-2: 8px;
--space-2-5: 10px;
--space-3: 12px;
--space-3-5: 14px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 28px;
--space-8: 32px;
--space-9: 36px;
--space-10: 40px;
--space-11: 44px;
--space-12: 48px;
--space-14: 56px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

Read labels like `12/48` as `token / pixels`: `space-12 = 48px`.

Desktop rules:

- Header height: `80px`.
- Header/menu rhythm: `12/48`.
- Text stack gap: `4/16`.
- Text to CTA gap: `6/24`.
- Hero content to media: `12/48` or `16/64`, depending on object visual weight.
- Grid/card gap: `32px`.
- Section vertical spacing: `20/80` or `24/96`.
- Close elements in one group: `3/12`.

Tablet/mobile rules:

- Header height: `72px`.
- Side padding: `24px` on tablet, `16px` on mobile.
- Compact internal gap: `3/12`.
- Medium internal gap: `4/16`.
- Text to action gap: `6/24`.
- Larger block gap: `8/32`.
- Section spacing: `9/36` or `12/48`, depending on object visual weight.
- Grid step: `24px` on tablet, `16px` on mobile.

## Grid

Use these responsive grids:

```css
--grid-desktop-container: 1216px;
--grid-desktop-columns: 12;
--grid-desktop-column: 72px;
--grid-desktop-gutter: 32px;

--grid-tablet-columns: 6;
--grid-tablet-column: 100px;
--grid-tablet-gutter: 24px;
--grid-tablet-margin: 24px;

--grid-mobile-columns: 4;
--grid-mobile-column: 70px;
--grid-mobile-gutter: 16px;
--grid-mobile-margin: 16px;
```

Desktop: `1920px` artboard, 12-column centered fixed grid, `1216px` content width, `72px` columns, `32px` gutters, `248px` outer margins.

Tablet: `768px` artboard, 6-column stretch grid, `100px` columns, `24px` gutters, `24px` side margins.

Mobile: `360px` artboard, 4-column stretch grid, `70px` columns, `16px` gutters, `16px` side margins.

## Full-bleed & decorative layers (CRITICAL — частый баг)

Section background, gradient glows, mesh blobs, hero halos и любая декоративная подложка ОБЯЗАНЫ занимать **всю** ширину своего ближайшего `position: relative` родителя. Контентом капится только **content container**, не декорации.

Правила:

- Декоративный absolute-слой использует `inset-0` (или `inset-x-0 top-…` для частичного) **БЕЗ** `max-w-*` и **БЕЗ** `mx-auto`. Иначе на мониторах шире `1440px`/`1920px` фон обрезается полосами по бокам.
- Родитель такого слоя — `relative isolate overflow-hidden`. `overflow-hidden` нужен, чтобы фон не «вылезал» из секции, `isolate` — чтобы `-z-10` не уходил под предыдущие секции.
- Только контентный wrapper получает `mx-auto w-full max-w-(--container-kaiten)` (1216px). Это слой текста/карточек, не фона.
- Радиальные/линейные градиенты задавай в процентах (`60% 60% at 70% 0%`), чтобы они переезжали вместе с шириной экрана, а не «уплывали» в угол.
- Перед сдачей проверяй макет на 1440 / 1920 / 2560 шириной — фон должен доходить до краёв вьюпорта.

Anti-pattern (НЕ ДЕЛАЙ ТАК):

```tsx
// ❌ на ширине >1440px фон обрезается полосами слева/справа
<div class="absolute inset-x-0 -top-32 -z-10 mx-auto h-[720px] max-w-[1440px] bg-[radial-gradient(...)]" />
```

Pattern (ДЕЛАЙ ТАК):

```tsx
// ✅ фон тянется на всю ширину секции, контент капится отдельно
<section class="relative isolate overflow-hidden">
  <div aria-hidden class="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[720px] bg-[radial-gradient(...)]" />
  <div class="mx-auto w-full max-w-(--container-kaiten) px-4 md:px-6">
    {/* content */}
  </div>
</section>
```

## Radius

Use:

```css
--radius-none: 0px;
--radius-sm: 2px;
--radius-base: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-3xl: 24px;
--radius-4xl: 32px;
--radius-full: 9999px;
```

Use `lg/xl` for buttons and accordion rows, `2xl/3xl` for cards and large sections, and `full` for pills, badges, round buttons, and avatars.

## Components

Structure work around landing sections and reusable organisms:

- Atoms: logo mark, icon, badge, button, avatar, divider, chevron, plus/minus, text styles.
- Molecules: nav item, CTA group, feature item, FAQ row, tab item, review card, author identity.
- Organisms: header, hero, benefits strip, testimonials carousel, FAQ section, slider accordion, CTA block, footer, comparison block.
- Templates: desktop/mobile landing layouts and responsive section shells.

Button atom:

Use `Roboto`, `Medium`, letter spacing `-0.2px`, radius `8px`, and no layout shift between states. Buttons can be text with optional left/right icons or icon-only.

```css
--button-radius: 8px;
--button-fill-bg: #7d4ccf;
--button-fill-bg-hover: #6f43b8;
--button-fill-bg-disabled: #f5f5f5;
--button-fill-text: #ffffff;
--button-fill-text-disabled: #9e9e9e;
--button-outline-bg: #ffffff;
--button-outline-bg-hover: #efe9f9;
--button-outline-border: #e0e0e0;
--button-outline-border-hover: rgba(125, 76, 207, 0.48);
--button-outline-text: #7d4ccf;
--button-outline-text-hover: #6f43b8;
--button-outline-text-disabled: #e0e0e0;
--button-focus-brand: 0 0 0 4px rgba(55, 88, 249, 0.2);
--button-focus-default: 0 0 0 4px rgba(152, 162, 179, 0.14);
```

Button sizes:

- `sm`: height `40px`, text padding `10px 14px`, text+icon gap `6px`, icon `20px`, label text `14/20`.
- `sm icon-only`: `40px` square, padding `10px`, icon `20px`.
- `md`: height `44px`, text padding `10px 16px`, text+icon gap `4px`, icon `24px`, label text `16/24`.
- `md icon-only`: `44px` square, padding `10px`, icon `24px`.
- `lg`: height `48px`, text padding `12px 20px`, text+icon gap `4px`, icon `24px`, label text `16/24`.
- `lg icon-only`: `48px` square, padding `12px`, icon `24px`.

Button variants and states:

- Fill default: violet background `#7d4ccf`, white text and icons.
- Fill hover: background `#6f43b8`, white text and icons.
- Fill focus: default fill plus `--button-focus-brand`.
- Fill disabled: background `#f5f5f5`, text/icons `#9e9e9e`, no hover.
- Outline default: white background, `#e0e0e0` border, violet text/icons.
- Outline hover: `#efe9f9` background, `rgba(125, 76, 207, 0.48)` border, text/icons `#6f43b8`.
- Outline focus: default outline plus `--button-focus-default`.
- Outline disabled: white background, `#e0e0e0` border, text/icons `#e0e0e0`, no hover.

Use `fill` for primary conversion actions and active icon actions. Use `outline` for secondary actions, header secondary CTAs, previous controls, neutral utility actions, and icon-only phone/menu actions when they sit on white.

FAQ/accordion states:

- Closed: white row, neutral text, plus icon.
- Hover/accent: title or border shifts to violet.
- Open: white or soft violet panel, violet border, violet title, minus/chevron-up icon, body text below.

Carousel:

- Previous button: white circular button with neutral border.
- Next button: filled violet circular button.
- Counter: neutral text with current index emphasis.

Header:

- Desktop: full logo, nav items with chevrons, CTA/action area.
- Mobile: logo plus hamburger.

## Motion

Use restrained UI motion:

```css
--duration-fast: 120ms;
--duration-base: 180ms;
--duration-slow: 240ms;
--ease-ui: cubic-bezier(.2, 0, .2, 1);
```

Animate hover, focus, accordion open/close, carousel slide transitions, and button press feedback. Keep motion functional and quiet.
