---
slug: ds-component-cta-2-secondary
type: design-system
created: 2026-06-01
updated: 2026-06-01
sources:
  - figma: https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=2716-41358
  - figma: https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=2716-41491
  - figma: https://www.figma.com/design/6M8lLx2PgVTxwXMeRiOVH4/Landing-DS?node-id=2716-41460
related:
  - wiki/design-system/components/button.md
  - wiki/design-system/spacing.md
  - wiki/design-system/typography.md
  - wiki/design-system/radius.md
tags:
  - component
  - section
  - cta
  - migration
stale: false
---

# CTA 2 Secondary

CTA-блок для сценария миграции из Zendesk в Кайтен. Используется как промо-секция внутри лендинга или статьи, когда нужно привести пользователя к инструкции / запуску переноса данных.

## Структура

- **title** (4..80) — конкретное обещание миграции.
- **description** (10..260) — раскрывает, какие данные переносятся и как сохраняется структура.
- **primaryCta** `{ label: <=40, href }` — единственная fill-кнопка.
- **visual** — иллюстрация переноса из Zendesk в Кайтен: source-card, transition/arrow, target-card.
- **backgroundDecor** (опц.) — декоративное radial/ellipse-пятно внутри контейнера.

## Content example

- **title:** `Переезд из Zendesk — быстро и без потерь`
- **description:** `Перенесите заявки, историю обращений и базу знаний в Кайтен. Данные импортируются с сохранением структуры через CSV/XLS. Для текстов и регламентов поддержки есть раздел «Документы»`
- **primaryCta.label:** `Перенести все данные`
- **primaryCta.href:** `https://faq-ru.kaiten.site/b577083e-3d48-4760-80af-cfd687955c38`

## Variants

- **Desktop** (`CTA 2 Desktop`, node `2716:41358`) — горизонтальный CTA с текстом слева и иллюстрацией справа.
- **Tablet** (`CTA 2 Tablet`, node `2716:41491`) — промежуточная адаптация между desktop и mobile.
- **Mobile** (`Cta 2 Mobile`, node `2716:41460`) — вертикальный CTA: текст, кнопка, затем иллюстрация.

## Layout

- **Desktop:** контейнер `1216 x 364`, фон `brand-12`, radius `rounded-2xl` (`16px`), padding `spacing/12` (`48px`). Контент расположен слева шириной около `501px`, visual справа шириной около `519px`.
- **Tablet:** сохраняет CTA-композицию и порядок контента. Используйте уменьшенные горизонтальные отступы, не допускайте пересечения текста с visual. Если visual не помещается рядом с текстом, переводите блок в stacked layout как на mobile.
- **Mobile:** контейнер шириной `328px`, vertical stack, фон `brand-12`, radius `rounded-xl` (`12px`), верхний padding `spacing/6` (`24px`), gap `spacing/8` (`32px`). Текст и кнопка центрируются внутри горизонтальных отступов `spacing/6` (`24px`), иллюстрация размещается ниже.

## Typography

- **Desktop title:** `text-4xl`, SemiBold, `line-height/4xl`, цвет `text/title-color`.
- **Desktop description:** `text-md`, Regular, `line-height/md`, letter spacing `-0.2px`, цвет `text/title-color`.
- **Mobile title:** `text-xl`, SemiBold, `line-height/xl`, letter spacing `-0.2px`.
- **Mobile description:** `text-sm`, Regular, `line-height/sm`, letter spacing `-0.2px`.
- **Button label:** `text-md`, Medium, `line-height/md`, letter spacing `-0.2px`.

## Visual

- Иллюстрация показывает перенос задач из Zendesk в Кайтен.
- На desktop visual располагается справа и может частично выходить за пределы декоративного пятна, но не за пределы контейнера.
- На mobile visual занимает всю доступную ширину, сохраняет пропорцию и не должен обрезать ключевые карточки Zendesk / Кайтен.
- Декоративное ellipse-пятно располагается за visual и не влияет на читаемость текста.

## CTA

- Primary CTA всегда использует `Button` variant `fill`.
- В блоке не используется secondary CTA: действие одно и должно быть максимально очевидным.
- Кнопка ведет на инструкцию или сценарий переноса данных.

## Usage rules

- Используйте блок только для конкретного миграционного сценария, а не как generic final CTA.
- Title должен обещать результат переноса, а не просто сообщать о наличии инструкции.
- Description перечисляет переносимые сущности: заявки, история обращений, база знаний, документы / регламенты.
- На одном лендинге используйте не больше одного такого migration CTA.
- Не меняйте порядок mobile-контента: сначала promise, затем action, затем visual.

## Anti-patterns

- ❌ Использовать две fill-кнопки внутри блока.
- ❌ Ставить generic title вроде «Готовы начать?» — теряется смысл migration-сценария.
- ❌ Убирать visual: без него блок становится обычным текстовым CTA.
- ❌ Обрезать на mobile карточку Zendesk или карточку Кайтен так, что непонятен сценарий переноса.
- ❌ Делать description длиннее 260 символов — CTA превращается в справочную статью.
