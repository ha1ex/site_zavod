---
slug: ds-component-section-heading
type: design-system
created: 2026-06-01
updated: 2026-06-01
sources:
  - figma: https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=2390-14392
related:
  - wiki/design-system/typography.md
  - wiki/design-system/spacing.md
  - wiki/design-system/voice.md
tags:
  - component
  - section
  - heading
  - headline
stale: true
---

# SectionHeading

Универсальный текстовый заголовок секции лендинга: headline + subline. Используется перед feature-grid, pricing, FAQ, testimonials, integrations, metrics и другими секционными модулями.

## Структура

- **eyebrow** (опц., ≤80) — короткая категория, контекст или anchor секции.
- **title** (4..80) — основной headline секции.
- **subline** (опц., 10..200) — поясняющий текст под заголовком.
- **align** (опц.) — `left | center`, default `center`.
- **maxWidth** (опц.) — ограничение ширины текстового блока.

## Variants

- **Default.** Title + subline, без eyebrow.
- **With eyebrow.** Eyebrow над title для сложных секций или якорей.
- **Title only.** Только title, если секция очевидна из контекста.
- **Left aligned.** Для секций с двухколоночной композицией или плотным B2B-контентом.
- **Center aligned.** Для самостоятельных секций с карточками, тарифами, FAQ или логотипами.

## Layout

- **Desktop:** heading располагается над контентом секции, max-width `720..840px`. Center aligned вариант центрируется относительно секции; left aligned вариант привязывается к контентной колонке.
- **Tablet:** сохраняйте выбранный align, но уменьшайте вертикальные отступы между heading и контентом.
- **Mobile:** heading занимает всю ширину контейнера. Center aligned допустим для коротких title; для длинных title используйте left aligned, чтобы улучшить читаемость.

## Typography

- **Eyebrow:** `text-sm`, Medium, `accent.violet-100` или `neutral.600`.
- **Title desktop:** `text-3xl` или `text-4xl`, SemiBold, цвет `text/title-color`.
- **Title mobile:** `text-2xl` или `text-3xl`, SemiBold.
- **Subline desktop:** `text-lg`, Regular, `neutral.600` или `neutral.700`.
- **Subline mobile:** `text-md`, Regular, `neutral.600` или `neutral.700`.

## Spacing

- Eyebrow → title: `spacing/2..3` (`8..12px`).
- Title → subline: `spacing/3..4` (`12..16px`).
- Heading → section content: `spacing/8..12` (`32..48px`) на desktop, `spacing/6..8` (`24..32px`) на mobile.

## Usage rules

- Title должен объяснять ценность секции, а не повторять название компонента.
- Subline раскрывает title на 1–2 предложения и не дублирует его дословно.
- Не используйте больше одного SectionHeading внутри одной секции.
- Если в секции есть CTA, heading не должен конкурировать с CTA-текстом.
- Для landing sections используйте `title <= 80`, чтобы заголовок не ломал mobile layout.

## Content rules

- Title формулируется как benefit / outcome: «Соберите поддержку в одном процессе» лучше, чем «Возможности».
- Subline должен быть конкретным: что пользователь получит, увидит или сможет сделать.
- Eyebrow не должен заменять title. Это только контекст или категория.

## Anti-patterns

- ❌ Generic title: «Наши преимущества», «Почему мы», «Возможности».
- ❌ Subline длиннее 200 символов — это уже body copy секции.
- ❌ Два одинаковых heading подряд перед соседними блоками.
- ❌ Hero-scale title внутри обычной секции.
- ❌ Использовать center align для очень длинного заголовка на mobile.
