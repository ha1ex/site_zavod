---
slug: kaiten-techsupport-reference
type: landing
created: 2026-05-16
updated: 2026-05-16
status: reference
sources:
  - .context/attachments/index (2).html
  - wiki/landings/kaiten-techsupport-reference/snapshot.html
related:
  - wiki/lessons.md
  - packages/harness/src/prompts/section-mock-skill.md
  - packages/harness/src/prompts/svg-illustration-skill.md
  - packages/harness/src/skills/conversion-landing.md
tags:
  - reference
  - landing
  - mock-ui
  - kaiten
stale: false
---

# Kaiten для техподдержки — reference landing

> **Что это.** Эталонный лендинг, на котором калибруется визуальный язык mock-иллюстраций для harness'а. Не генерировался автоматически — собран вручную в HCML, чтобы зафиксировать «как должно выглядеть качество с первого раза». Все правила из `wiki/lessons.md` (теги `mock.*`) выведены из этого лендинга.
>
> **Snapshot:** `wiki/landings/kaiten-techsupport-reference/snapshot.html` (116 KB, 13 секций, 5 крупных моков, ~25 lucide-иконок).
>
> **Использование:** при mock-authoring (см. [`section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md)) — открыть snapshot.html в браузере, найти секцию по теме, скопировать структуру слоёв.

## Состав моков

| # | Секция | Шаблон | Детализация |
|---|---|---|---|
| 1 | Hero | `board` (канбан-доска) | Window-chrome + 4 колонки × 2 карточки, реалистичные обращения, активная карточка приподнята |
| 2 | «Один входящий канал» | `board` (повтор Hero-мока) | Тот же mock, что в Hero — намеренно, чтобы поддержать буллет-список рядом |
| 3 | «Контекст не теряется» | `chat` + `checklist` | Карточка заявки #18524, два чат-пузыря (in/out) + чек-лист 2 done + 1 todo |
| 4 | «База знаний» | `article` | Двухколоночный grid (навигация + статья), эмодзи 📌, placeholder-полоски убывающей ширины |
| 5 | «Документы» | `article` (близнец #4) | Та же структура, синий акцент, эмодзи 🧑‍💻 |
| 6 | «Аналитика» | `kpi` 2×2 + 4 описательные карточки | 4 KPI-плитки с числом + стрелка тренда + подпись |
| 7 | «Запуск за 30 минут» | step-cards 4 шт. | Карточка с верхней градиент-полоской + номер + lucide-иконка |
| 8 | «Возможности» | FeatureGrid 4×2 | 8 карточек 44px-иконка-капсула + заголовок + описание |
| 9 | FAQ | accordion (1 открыт, 4 закрыто) | Открытая — фиолетовый фон + «−», закрытые — нейтральные + «+» |
| 10 | Клиенты | cases × 3 | Буквенный аватар-кружок + цитата в «ёлочках» + KPI |

Без моков: trust-bar, два CTA-баннера, footer.

## Приёмы — соответствие lessons

| Приём в snapshot.html | Lesson в `wiki/lessons.md` |
|---|---|
| Шапка из 3 цветных точек + табы | [window-chrome-on-product-mocks](../lessons.md#window-chrome-on-product-mocks) |
| «Не приходит код подтверждения · Telegram · новый клиент» | [realistic-russian-copy-in-mocks](../lessons.md#realistic-russian-copy-in-mocks) |
| Полоска `h-1 w-8 bg-action-primary` на карточке | [accent-bar-color-as-semantics](../lessons.md#accent-bar-color-as-semantics) |
| Активная карточка `translate-y-[-2px] shadow-md` + сосед `opacity-60` | [active-vs-inactive-contrast-in-mock](../lessons.md#active-vs-inactive-contrast-in-mock) |
| Иконки lucide в `inline-flex h-N w-N rounded-xl bg-action-primary-soft text-text-accent` | [lucide-icons-in-violet-capsule](../lessons.md#lucide-icons-in-violet-capsule) |
| ☝️/📌/🧑‍💻 — по одному в mock'е | [emoji-as-single-human-accent](../lessons.md#emoji-as-single-human-accent) |
| `bg-(--color-action-primary-soft)` всюду, без `bg-[#7d4ccf]` | [ds-tokens-only-no-hardcoded-hex](../lessons.md#ds-tokens-only-no-hardcoded-hex) |
| `shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]` | [brand-violet-drop-shadow](../lessons.md#brand-violet-drop-shadow) |
| `text-[11.5px]` заголовок карточки, `text-[9px]` бейдж | [small-font-density-inside-mock](../lessons.md#small-font-density-inside-mock) |
| 2 карточки на канбан-колонке (вторая `opacity-60`) | [three-or-four-items-per-list](../lessons.md#three-or-four-items-per-list) |
| `h-2 w-full / w-5/6 / w-4/6 rounded-full bg-neutral-200` | [placeholder-bars-with-decreasing-width](../lessons.md#placeholder-bars-with-decreasing-width) |
| `rounded-bl-md bg-neutral-100` ↔ `ml-auto rounded-br-md bg-action-primary-soft` | [chat-bubbles-asymmetric](../lessons.md#chat-bubbles-asymmetric) |
| Done с `line-through` + Todo с пустым квадратом в одном чек-листе | [checklist-states-mixed](../lessons.md#checklist-states-mixed) |
| `87% ▲ закрыто в SLA`, `18 ▼ зависли` | [kpi-tile-with-trend-arrow](../lessons.md#kpi-tile-with-trend-arrow) |
| `radial-gradient(60% 60% at 70% 0%, rgba(125,76,207,0.22), …)` | [background-decoration-radial-and-blob](../lessons.md#background-decoration-radial-and-blob) |
| `lg:[&>div:first-child]:order-2` между секциями 4 и 5 | [reverse-layout-zigzag-in-paired-sections](../lessons.md#reverse-layout-zigzag-in-paired-sections) |
| 5 крупных + 2 средних mock'а на 13 секций | [one-hero-mock-plus-3-5-section-mocks](../lessons.md#one-hero-mock-plus-3-5-section-mocks) |

## Что в snapshot НЕ работало бы как образец

- **Дублирование Hero-мока** в секции «один входящий канал». Сэкономлено на разработке, но создаёт ощущение «крутят одну картинку». В будущих лендингах — стоит делать второй mock другого ракурса (например, тот же поток заявок, но в виде списка вместо доски).
- **Буквенные аватарки кейсов** (C/P/B). Допустимо, когда нет реальных логотипов; для маркетинга-зрелого лендинга — подменить на SVG-марки клиентов.
- **FAQ без иконок и иллюстрации сбоку**. Это намеренный минимализм, но если бриф требует «вау-FAQ» — потребуется illustrated empty-state.

## Сниппеты-цитаты

### Window-chrome (из Hero)

```html
<div class="flex flex-wrap items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-surface-section) px-3 py-2.5">
  <span class="h-2 w-2 rounded-full bg-red-300"></span>
  <span class="h-2 w-2 rounded-full bg-yellow-300"></span>
  <span class="h-2 w-2 rounded-full bg-green-300"></span>
  <div class="ml-2 flex items-center gap-3 text-[11px] text-(--color-text-secondary)">
    <span class="font-medium text-(--color-text-primary)">Заявки</span>
    <span>Очередь</span><span>SLA</span><span>Ответы</span>
    <span class="rounded-md border border-(--color-border-default) bg-(--color-surface-page) px-1.5 py-0.5">Фильтры</span>
  </div>
</div>
```

### Карточка-заявка с акцент-баром / бейджами / эмодзи-hover

```html
<div class="relative rounded-(--radius-lg) border bg-(--color-surface-page) p-2.5 border-(--color-border-default) translate-y-[-2px] shadow-md">
  <div class="mb-1.5 h-1 w-8 rounded-full bg-(--color-action-primary)"></div>
  <div class="text-[11.5px] font-semibold leading-tight text-(--color-text-primary)">Ошибка в личном кабинете</div>
  <div class="mt-1 truncate text-[10px] text-(--color-text-secondary)">Передать в разработку</div>
  <div class="mt-1.5 flex flex-wrap items-center gap-1">
    <span class="inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium bg-red-100 text-red-700">Bug</span>
    <span class="inline-flex h-4 items-center rounded-full bg-(--color-neutral-200) px-1.5 text-[9px]">SLA 2ч</span>
  </div>
  <span class="pointer-events-none absolute -right-2 -bottom-2 text-lg drop-shadow-sm">☝️</span>
</div>
```

### Чат-пузыри

```html
<div class="max-w-[85%] rounded-2xl rounded-bl-md bg-(--color-neutral-100) px-4 py-2.5 text-sm">Здравствуйте, не могу оплатить тариф.</div>
<div class="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-(--color-action-primary-soft) px-4 py-2.5 text-sm">Проверили платёж — отправили новую ссылку…</div>
```

### Чек-лист со смешанными состояниями

```html
<span class="inline-flex h-5 w-5 items-center justify-center rounded-md border bg-(--color-action-primary) text-white">✓</span>
<span class="text-(--color-text-secondary) line-through">Проверить оплату</span>
<!-- … -->
<span class="inline-flex h-5 w-5 rounded-md border bg-white"></span>
<span class="text-(--color-text-primary)">Закрыть обращение</span>
```

### KPI-плитка с трендом

```html
<div class="rounded-(--radius-2xl) border bg-(--color-surface-card) p-6">
  <div class="flex items-baseline gap-2">
    <span class="text-3xl font-semibold md:text-4xl">87%</span>
    <span class="text-(--color-green-100)">▲</span>
  </div>
  <div class="mt-1.5 text-sm text-(--color-text-secondary)">закрыто в SLA</div>
</div>
```

### Брендовый drop-shadow и декор-облако

```html
<!-- На крупном mock'е -->
shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]

<!-- Декоративное "облако" за углом CTA-баннера -->
<div aria-hidden="true" class="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl bg-(--color-action-primary)"></div>
```

## Reviewer notes

_(заполняется через `harness ingest feedback kaiten-techsupport-reference "<note>"`)_

## History

- **2026-05-16** — создано вручную из приложенного `index (2).html`. Source-of-truth для всех `mock.*` правил в `wiki/lessons.md`.
