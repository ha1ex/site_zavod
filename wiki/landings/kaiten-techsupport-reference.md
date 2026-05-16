---
slug: kaiten-techsupport-reference
type: landing
created: 2026-05-16
updated: 2026-05-16
status: reference
sources:
  - apps/web/public/reference/kaiten-support.html
  - packages/ui/src/landing/mocks/SupportBoardMock.tsx
  - packages/ui/src/landing/mocks/RequestCardMock.tsx
  - packages/ui/src/landing/mocks/KnowledgeBaseMock.tsx
related:
  - wiki/landings/kaiten-support.md
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

# Kaiten для техподдержки — **internal** reference (не мировой эталон)

> ⚠️ **Это внутренний референс «лучшее что у нас получилось», а не мировой эталон.** Для настоящих эталонов визуального языка mock-иллюстраций см. [`wiki/references/external-mock-references.md`](../references/external-mock-references.md) — там Linear, Notion, Vercel Analytics, Stripe, Intercom и др. Используй этот файл только для **проверки соответствия** реализованных mock'ов нашему DS, не для **вдохновения**.
>
> **Что это.** Зафиксированная версия лендинга kaiten.ru, на которой проверяются правила [`wiki/lessons.md`](../lessons.md) (теги `mock.*`) и skill [`section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md). Не генерировался автоматически — собран вручную.
>
> **Где живёт эталон в репо:**
> - HTML-snapshot — [`apps/web/public/reference/kaiten-support.html`](../../apps/web/public/reference/kaiten-support.html) (открывается прямо в браузере по `http://localhost:3000/reference/kaiten-support.html` после `pnpm dev`).
> - Реализованные mock-компоненты — [`packages/ui/src/landing/mocks/`](../../packages/ui/src/landing/mocks/) (`SupportBoardMock`, `RequestCardMock`, `KnowledgeBaseMock`).
> - Сгенерированная страница, использующая моки — [`wiki/landings/kaiten-support.md`](kaiten-support.md) (live spec) + [`content/landings/kaiten-support.json`](../../content/landings/kaiten-support.json).
>
> **Workflow для нового mock'а:**
> 1. Открыть [`wiki/references/external-mock-references.md`](../references/external-mock-references.md) → найти эталон в нужной категории → выписать приёмы.
> 2. Сверить с правилами [`wiki/lessons.md`](../lessons.md) — если эталон делает что-то новое, добавить правило.
> 3. Открыть этот internal-snapshot и существующие mocks в `packages/ui/src/landing/mocks/` — понять как наши приёмы реализованы в DS-токенах.
> 4. Реализовать mock-компонент по [`section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md) §3.

## Состав моков в эталоне

| # | Секция | Эталон в HTML | Реализованный mock-компонент | Шаблон (skill) |
|---|---|---|---|---|
| 1 | Hero | window-chrome + 4 колонки × 2 карточки канбана | `SupportBoardMock` (хардкод-данные) | `board` |
| 2 | «Один входящий канал» | повтор Hero-мока | `SupportBoardMock` (тот же) | `board` |
| 3 | «Контекст не теряется» | карточка заявки #18524 + чат + чек-лист | `RequestCardMock` (хардкод) | `chat` + `checklist` |
| 4 | «База знаний» | публичная статья с эмодзи 📌 | `KnowledgeBaseMock variant="public"` | `article` |
| 5 | «Документы» | внутренний регламент с 🧑‍💻 | `KnowledgeBaseMock variant="internal"` | `article` |
| 6 | «Аналитика» | 4 KPI с трендами + 4 карточки | _(нужен новый: `AnalyticsKpiMock`)_ | `kpi` |
| 7 | «Запуск за 30 минут» | 4 step-карточки с градиент-полоской | `ProcessSteps` компонент секции | (часть секции) |
| 8 | «Возможности» | FeatureGrid 4×2 | `FeatureGrid` | — |
| 9 | FAQ | accordion (1 открыт, 4 закрыто) | `FAQAccordion` | — |
| 10 | Клиенты | 3 кейса с буквенными аватарами | `SocialProof` | — |

Без моков: trust-bar (`BenefitsStrip`), два CTA-баннера (`PromoBanner`), footer.

## Приёмы → правила в lessons → реализация

Каждый приём из snapshot.html → правило в `wiki/lessons.md` (для repair-loop) → реализован в одном из `mocks/*Mock.tsx`:

| Приём в snapshot.html | Lesson `wiki/lessons.md` | Где реализовано |
|---|---|---|
| Шапка из 3 цветных точек + табы | [window-chrome-on-product-mocks](../lessons.md#window-chrome-on-product-mocks) | `SupportBoardMock` lines 74-87 |
| «Не приходит код подтверждения · Telegram · новый клиент» | [realistic-russian-copy-in-mocks](../lessons.md#realistic-russian-copy-in-mocks) | `SupportBoardMock` `COLUMNS` const |
| Полоска `h-1 w-8 bg-action-primary` на карточке | [accent-bar-color-as-semantics](../lessons.md#accent-bar-color-as-semantics) | `SupportBoardMock` line 110 + `BAR_CLASS` |
| Активная карточка `translate-y-[-2px] shadow-md` + сосед `opacity-60` | [active-vs-inactive-contrast-in-mock](../lessons.md#active-vs-inactive-contrast-in-mock) | `SupportBoardMock` `lifted` / `muted` поля |
| Иконки lucide в `inline-flex h-N w-N rounded-xl bg-action-primary-soft text-text-accent` | [lucide-icons-in-violet-capsule](../lessons.md#lucide-icons-in-violet-capsule) | `FeatureGrid` Icon-капсула, `ProcessSteps` |
| ☝️/📌/🧑‍💻 — по одному в mock'е | [emoji-as-single-human-accent](../lessons.md#emoji-as-single-human-accent) | `SupportBoardMock` line 140, `KnowledgeBaseMock` line 37 |
| `bg-(--color-action-primary-soft)` всюду, без `bg-[#7d4ccf]` | [ds-tokens-only-no-hardcoded-hex](../lessons.md#ds-tokens-only-no-hardcoded-hex) | все mocks |
| `shadow-[0_30px_80px_-30px_rgba(125,76,207,0.30)]` | [brand-violet-drop-shadow](../lessons.md#brand-violet-drop-shadow) | все mocks (root-обёртка) |
| `text-[11.5px]` заголовок карточки, `text-[9px]` бейдж | [small-font-density-inside-mock](../lessons.md#small-font-density-inside-mock) | `SupportBoardMock` |
| 2 карточки на канбан-колонке (вторая `opacity-60`) | [three-or-four-items-per-list](../lessons.md#three-or-four-items-per-list) | `SupportBoardMock` |
| `h-2 w-full / w-5/6 / w-4/6 rounded-full bg-neutral-200` | [placeholder-bars-with-decreasing-width](../lessons.md#placeholder-bars-with-decreasing-width) | `KnowledgeBaseMock` lines 55-60 |
| `rounded-bl-md bg-neutral-100` ↔ `ml-auto rounded-br-md bg-action-primary-soft` | [chat-bubbles-asymmetric](../lessons.md#chat-bubbles-asymmetric) | `RequestCardMock` lines 32-47 |
| Done с `line-through` + Todo с пустым квадратом в одном чек-листе | [checklist-states-mixed](../lessons.md#checklist-states-mixed) | `RequestCardMock` lines 52-78 |
| `87% ▲ закрыто в SLA`, `18 ▼ зависли` | [kpi-tile-with-trend-arrow](../lessons.md#kpi-tile-with-trend-arrow) | _(новый mock: `AnalyticsKpiMock`)_ |
| `radial-gradient(60% 60% at 70% 0%, rgba(125,76,207,0.22), …)` | [background-decoration-radial-and-blob](../lessons.md#background-decoration-radial-and-blob) | `HeroSection` lines 72-78 |
| `lg:[&>div:first-child]:order-2` между секциями 4 и 5 | [reverse-layout-zigzag-in-paired-sections](../lessons.md#reverse-layout-zigzag-in-paired-sections) | `MediaCopy` имеет prop для зеркала |
| 5 крупных + 2 средних mock'а на 13 секций | [one-hero-mock-plus-3-5-section-mocks](../lessons.md#one-hero-mock-plus-3-5-section-mocks) | `kaiten-support.json` spec |

## Что в snapshot НЕ работало бы как образец

- **Дублирование Hero-мока** в секции «один входящий канал». В реализации — то же: `SupportBoardMock` используется и в Hero, и в `MediaCopy variant="support-board"`. В будущем — добавить отдельный `IncomingChannelsMock` (телеграм + почта + портал → одна доска).
- **Буквенные аватарки кейсов** (C/P/B). Сейчас в `SocialProof`. Когда появятся реальные SVG-марки клиентов — подменить.
- **FAQ без иконок и иллюстрации сбоку**. Намеренный минимализм; если бриф потребует «вау-FAQ» — потребуется illustrated-empty-state mock.

## Как добавить новый специализированный mock-компонент

См. [`packages/harness/src/prompts/section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md) §3 — алгоритм:
1. Подобрать шаблон-архетип (`board` / `chat` / `kpi` / `article` / `checklist` / `console`).
2. Создать файл `packages/ui/src/landing/mocks/<Name>Mock.tsx` по структуре существующих.
3. Захардкодить доменные данные (никаких props на content — только опциональные `variant`-разветвления).
4. Прогнать через чек-лист §4 skill'а (window-chrome, реалистичные тексты, accent-bar, эмодзи 0-1 и т.д.).
5. Экспортировать из `packages/ui/src/landing/mocks/index.ts`.
6. Если mock используется через `HeroSection.visual.variant` — добавить новое значение в enum в `packages/harness/src/schemas/landing-spec.ts` `AssetRefSchema.variant` + соответствующий `<NewMock />` в `HeroVisual` в `HeroSection.tsx`. Если через секцию `MediaCopy.variant` — добавить аналогично там.

## Reviewer notes

_(заполняется через `harness ingest feedback kaiten-techsupport-reference "<note>"`)_

## History

- **2026-05-16** — создано вручную как reference для всех `mock.*` правил в `wiki/lessons.md`. Связано с `wiki/landings/kaiten-support.md` (live spec) и `apps/web/public/reference/kaiten-support.html` (HTML-snapshot).
