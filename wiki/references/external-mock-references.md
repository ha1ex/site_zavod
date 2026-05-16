---
slug: external-mock-references
type: reference
created: 2026-05-16
updated: 2026-05-16
status: reference
sources:
  - https://linear.app/
  - https://linear.app/insights
  - https://linear.app/customers
  - https://www.notion.com/product/projects
  - https://www.notion.com/product/docs
  - https://vercel.com/analytics
  - https://stripe.com/
  - https://stripe.com/payments
  - https://stripe.com/billing
  - https://www.intercom.com/inbox
  - https://www.intercom.com/copilot
  - https://www.helpscout.com/
  - https://www.slite.com/
  - https://document360.com/
  - https://www.atlassian.com/software/jira
  - https://pitch.com/
related:
  - wiki/lessons.md
  - wiki/landings/kaiten-techsupport-reference.md
  - packages/harness/src/prompts/section-mock-skill.md
tags:
  - reference
  - external
  - mock-ui
  - inspiration
stale: false
---

# External mock-illustration references

> **Что это.** Подборка лендингов мирового уровня, на которых mock-иллюстрации продукта сделаны эталонно. Это **внешний** эталон визуального языка — то, к чему стремятся `packages/ui/src/landing/mocks/*Mock.tsx`. Наш собственный лендинг kaiten.ru — **внутренний** референс «лучшее что у нас получилось», но не эталон; см. [`wiki/landings/kaiten-techsupport-reference.md`](../landings/kaiten-techsupport-reference.md).
>
> **Источники собраны** через WebSearch + WebFetch (31 запрос, 2026-05-16); каждая ссылка проверена на наличие реального mock-контента. Российские SaaS отдельно проверены — эталонов уровня Linear/Stripe не нашлось.
>
> **Кто читает:** агент-разработчик или дизайнер, который создаёт новый специализированный mock-компонент по правилам [`section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md). Перед написанием TSX — открыть эталон в браузере, заглянуть в DevTools, перенести приём в DS-токенах.

## Как использовать

1. Определи категорию нового mock'а — board / chat / kb / kpi / hero / body-rhythm.
2. Открой 2-3 эталона из этой категории ниже. Mandatory первыми, Nice-to-have как альтернативы стиля.
3. Прогони эталон через универсальный гайд DevTools (см. ниже) — выпиши конкретные приёмы.
4. Сверь с правилами в [`wiki/lessons.md`](../lessons.md) (теги `mock.*`) — если эталон делает что-то новое, **добавь правило в lessons**.
5. Реализуй mock-компонент в `packages/ui/src/landing/mocks/<Name>Mock.tsx` через DS-токены (не hex'ы из эталона напрямую).
6. Прогони через чек-лист [`section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md) §4.

## Универсальный гайд: как читать эталон в DevTools

Когда открыл эталон в браузере, прежде чем закрыть вкладку:

- **Структура слоёв.** Inspect Hero. Сколько `<div>`-слоёв до контента? Где decoration (`pointer-events: none`)? Где z-index? У премиум-лендингов часто 2-3 фоновых слоя (gradient blob + radial-gradient + текстура).
- **Тени и радиусы.** На крупный mock — `getComputedStyle(el).boxShadow`. Цветной (с rgb'/rgba)? Размер blur > 60px? Это брендовый «парящий» shadow. Радиус карточек — обычно 16-24px (наш `--radius-2xl/3xl`).
- **Типографика.** Hero h1 — `font-size` и `font-weight`. У Linear/Vercel — Inter Variable, weight 500-600, tracking -0.025em. Внутри mock'а шрифты МЕЛЬЧЕ базового body — это small-density rule (см. `wiki/lessons.md` → `small-font-density-inside-mock`).
- **Цвета.** Hover любого цветного элемента → DevTools покажет HSL. У эталонов цвета берутся из CSS-переменных дизайн-системы (часто можно прочитать имя переменной в `:root`). Скопируй HEX и сопоставь с нашими токенами в `packages/ui/src/tokens.css`.
- **Иконки.** Inspect иконку → это `<svg>` или `<img>`? Какая библиотека (по `viewBox` и stroke-width)? Linear/Vercel/Notion — собственные SVG, Help Scout/Intercom — lucide-подобные.
- **Данные внутри mock'а.** Реальные тексты или Lorem? Если реальные — какой паттерн (имена клиентов, IDs, метрики)? Скопируй 3-5 примеров в свой mock как образец для подобной доменной конкретики.
- **Анимация.** Если есть hover/scroll-анимация — это `transition` или Framer Motion? Часто эталоны используют `transform: translateY(-2px)` + `box-shadow` для «парения» при hover.

---

## Mandatory — топ-5 с самой высокой плотностью приёмов

### 1. Linear

- **URL:** [linear.app](https://linear.app/) + [/insights](https://linear.app/insights) + [/customers](https://linear.app/customers)
- **Категории:** board, kpi/dashboard, hero composition, body rhythm
- **Что эталонно:** Hero — реальная канбан-доска Intake с 4 колонками (`Backlog (8)`, `Todo (71)`, `In Progress (3)`, `Done (53)`), карточками с ID `ENG-XXX`, иконками категорий (Bug/Design/AI/Performance), аватарками исполнителей. На лендинге 5 mock'ов подряд — целый цикл (Intake → Plan → Build → Diff → Monitor). Dashboards на `/insights` — «modular» с фирменной терминологией (cycle time, lead time, triage time).
- **Приёмы которые стоит зафиксировать:**
  - **Счётчик количества в названии колонки** (`Backlog (8)`) — мгновенно даёт ощущение реальной нагрузки.
  - **ID задачи `PREFIX-NUMBER`** — фирменный признак инженерных тулов. Для Kaiten аналог — `SUP-3421`, `TASK-128`.
  - **Иконки категорий слева от заголовка карточки** — заменяют текстовый бейдж «Bug» когда таких категорий много.
  - **5 mock'ов подряд = workflow** — не один статичный экран, а нарратив этапов.
  - **Dark-mock на светлом лендинге** — высокий контраст mock'а с фоном.
  - **Полупрозрачные блоки фильтрации** поверх mock'а (показывают что инструмент гибкий).
- **Что искать в DevTools:**
  - Inspect карточки задачи → найти `font-size` заголовка (намеренно ~12-13px, не 16px). Это small-density.
  - Inspect фон Hero → `background-image: linear-gradient(...)` от тёмно-фиолетового к чёрному.
  - Hover любую интерактивную карточку → проверить `transition: transform, box-shadow`.
  - Inspect иконку категории → это `<svg>` стиля Phosphor или собственный custom set, не lucide.
- **Applicability к нашим mock-компонентам:**
  - `SupportBoardMock` — добавить `count` в названии колонки, использовать `SUP-XXX` ID.
  - Новый `WorkflowOverviewMock` — нарратив этапов из 3-5 mock'ов подряд.

### 2. Notion

- **URL:** [/product/projects](https://www.notion.com/product/projects) + [/product/docs](https://www.notion.com/product/docs)
- **Категории:** board (kanban), knowledge base / article
- **Что эталонно:** «Filtered kanban» с явно применённым фильтром (mock как рабочий инструмент, а не статика). Реальные шаблоны: «Launch checklist», «Product roadmap», «Project tracker». Интеграционные иконки (Figma/GitHub/Slack/Jira) на карточках = намёк на синхронизацию. Тот же data-set показан в 4 видах (Kanban/Timeline/Dashboard/Calendar). Для docs — sidebar иерархия → документ с embedded видео + toggle-блоки + 50+ типов блоков.
- **Приёмы которые стоит зафиксировать:**
  - **Видимая полоса фильтрации** сверху mock'а (`Status: Active`, `Owner: Anna`) — показывает что доска отфильтрована.
  - **Иконки интеграций на карточке** — Figma/GitHub/Slack в углу = «синхронизация работает». Для Kaiten аналог — иконки `Telegram / Почта / Портал`.
  - **Один data-set, много представлений** — board → таблица → календарь → Gantt. Демонстрирует гибкость.
  - **Cover image** для документа в KB — fresh look без рамки.
  - **Toggle-блоки** в статье — показывают глубину контента без перегрузки.
- **Что искать в DevTools:**
  - Inspect карточку → найти `padding` (обычно `8px 12px`, компактнее обычного), плюс маленькие иконки интеграций (`width: 14px`, не 24px).
  - Inspect toggle-блок → это `<details>` с custom styling.
  - Цветовая палитра Notion — мягкие пастельные (Light Green, Light Blue) с opacity ~10-15% для backgrounds.
- **Applicability к нашим mock-компонентам:**
  - `SupportBoardMock` — добавить иконки источника (`📱 Telegram`, `✉️ Почта`) на каждой карточке.
  - `KnowledgeBaseMock` — добавить cover-image сверху статьи + toggle для FAQ-разделов.
  - Новый `BoardViewsCarouselMock` — переключатель «Доска / Таблица / Календарь».

### 3. Vercel Observability

- **URL:** [vercel.com/analytics](https://vercel.com/analytics)
- **Категории:** kpi / metrics dashboard
- **Что эталонно:** Самый детально описанный dashboard-mock из найденных. Hero — несколько панелей: visitor traffic с большим числом (`634,200`), временной меткой, App Logs с цветными status кодами (200/500), Top Sources с доменами, Alerts с аномалиями. Light + Dark обе версии одного скрина.
- **Приёмы которые стоит зафиксировать:**
  - **Hero-метрика крупным шрифтом** + временная подпись (`Fri May 10 4pm - 5pm`) — даёт контекст «свежести» данных.
  - **Delta со стрелкой** (`+25%`, `-30%`) на одной baseline с числом.
  - **Цветовые status-коды в логах** — зелёный 200, красный 500. Визуальный паттерн строки лога.
  - **Real Experience Score (одно число `92`)** — hero-показатель качества без расшифровки.
  - **Перцентили P75/P90/P95/P99** как табличный детализатор — стандарт инженерной метрики.
  - **Light + Dark пара** для одного и того же скрина = двойной mock внутри секции.
- **Что искать в DevTools:**
  - Inspect большое число → `font-size: 48-56px`, `font-weight: 600`, `font-variant-numeric: tabular-nums`.
  - Inspect строку лога → grid с фиксированной первой колонкой (status code), моноширинный шрифт.
  - Inspect график trends → SVG path с gradient fill (linear от brand-color к transparent).
  - Цветовая палитра — нейтральные slate + один акцент-цвет на dashboard. Никаких «карнавалов».
- **Applicability к нашим mock-компонентам:**
  - Новый `AnalyticsKpiMock` для секции «Аналитика» в Kaiten Support — реализовать ровно по этой структуре (числа + delta + tabular-nums + light/dark пара).
  - Новый `SlaLogMock` — лента событий по тикетам с цветными status-кодами SLA (OK/Warning/Breach).

### 4. Stripe

- **URL:** [stripe.com](https://stripe.com/) + [/payments](https://stripe.com/payments) + [/billing](https://stripe.com/billing)
- **Категории:** hero composition, body rhythm, kpi
- **Что эталонно:** Hero — фоновая «волна» (`wave-fallback-desktop.png`) как декоративный gradient blob, поверх — крупные KPI компании (`135+ currencies`, `$1.9T processed`, `99.999% uptime`). Mock'и checkout-формы рядом с реальными данными. На `/payments` — чёткий вертикальный ритм: online → global → terminals → analytics → platform со zigzag layouts. На `/billing` — stacked-area график MRR с сегментацией «защищено / не защищено» (3 оттенка одного цвета).
- **Приёмы которые стоит зафиксировать:**
  - **Wave/blob фон** как background-layer — оживляет голый Hero без перегруза.
  - **4 hero-метрики компании** рядом с продуктовым mock'ом (`$1.9T processed`) — social proof без логотипов.
  - **Bento-grid** в body для разных категорий продукта.
  - **Layering text-over-photo** — текст поверх фоновой фотографии устройства.
  - **Zigzag layouts** между body-секциями (left/right alternation) — антидот «слипания».
  - **Stacked-area график с сегментацией** — три оттенка одного цвета = разделение категорий без палитры из 5 разных цветов.
  - **i18n в моках** — на немецкой версии цены в евро, не в долларах. Mock = инструмент, а не картинка.
- **Что искать в DevTools:**
  - Inspect Hero background → `background-image: url(...wave-fallback...)` + `background-position`, `background-size`.
  - Inspect bento-grid → `display: grid; grid-template-columns: repeat(...)` с разными `grid-row: span`.
  - Inspect stacked area → SVG `<g>` с тремя `<path>` разных opacity (`0.3`, `0.6`, `0.9`).
  - Типографика — sans-serif (`Sohne` или fallback), heavy weight (700), tight tracking.
- **Applicability к нашим mock-компонентам:**
  - `HeroSection` — добавить опциональный `wave` decoration слой.
  - Любая body-секция через `MediaCopy` — обязательный zigzag через `reverse: true` в каждой второй.
  - Новый `RevenueMrrMock` для финансовых лендингов — stacked-area с тремя оттенками.

### 5. Intercom

- **URL:** [/inbox](https://www.intercom.com/inbox) + [/copilot](https://www.intercom.com/copilot)
- **Категории:** chat / conversation, AI-chat
- **Что эталонно:** Hero — двухслойная композиция (foreground скриншот + размытый фон для глубины). Body — вертикальная колонка чередующихся секций с фоновыми изображениями vs скриншотами интерфейса (Copilot, переводы, типы тикетов, омниканальность). Аккордеоны для деталей фич. На `/copilot` — чат-пузыри с AI-ответами + цитирование источников (footnote-стиль ссылок на статьи KB).
- **Приёмы которые стоит зафиксировать:**
  - **Двойное наслоение** — основной скрин + размытый фон того же скрина смещённый позади. Глубина за счёт `blur(40px)` + `opacity 0.3`.
  - **Чередование `abstract background` секций с `product screenshot` секциями** — визуальный ритм, который не утомляет.
  - **Аккордеоны для деталей фич** — позволяют показать много mock'ов без перегруза первого экрана.
  - **AI-ответ с inline-цитатой источника** (название KB-статьи + иконка-сноска). Критично для AI-агентов поддержки.
  - **Конкретная метрика клиента** (`Lightspeed: +31% closed conversations`) рядом с mock'ом — social proof в контексте.
  - **Real-time dashboard мониторинга команды** — статус «свободен / занят / на встрече» по агентам.
- **Что искать в DevTools:**
  - Inspect Hero → найти два `<img>` или `<div>` с одинаковым background-image, но один с `filter: blur()` + `opacity` + сдвиг.
  - Inspect AI-message → footnote-link как inline `<sup>` или `<button>` с иконкой.
  - Inspect аккордеон → `<details>` или Radix `Accordion`, transition на `max-height` и `opacity`.
- **Applicability к нашим mock-компонентам:**
  - `RequestCardMock` — добавить двухслойный фон (текущий запрос + размытый предыдущий).
  - Новый `AiAgentChatMock` — для будущего Kaiten AI: ответ с цитатой KB-статьи.
  - Новый `TeamStatusMock` — real-time статус агентов.

---

## Nice to have — 4 для расширения охвата стилей

### 6. Help Scout

- **URL:** [helpscout.com](https://www.helpscout.com/)
- **Категория:** chat / conversation (минималистичный стиль)
- **Что эталонно:** Hero — крупный mock объединённого Inbox с несколькими каналами. Каждая фича = отдельный mock в своей секции (а не всё в одном). Beacon-widget показан in-context (на сайте клиента, не изолированно).
- **Применимо:** Когда нужно скромнее, чем у Intercom — «один скрин, одна мысль». Альтернатива для `RequestCardMock`.

### 7. Slite

- **URL:** [slite.com](https://www.slite.com/)
- **Категория:** knowledge base / article
- **Что эталонно:** Цветные обложки документов (cover image) — узнаваемая фишка. Левая панель с иерархией + категориями. Слайдер с переключением шаблонов под Engineering/HR/Operations.
- **Применимо:** Если `KnowledgeBaseMock` хочется делать с обложками статей вместо текстовых полосок-плейсхолдеров.

### 8. Document360

- **URL:** [document360.com](https://document360.com/)
- **Категория:** knowledge base / article (с AI-поиском)
- **Что эталонно:** Hero — полнофункциональный help center с боковой навигацией + AI Search bar в ChatGPT-стиле (с автокомплитом и preview-ответом). Метрика «-30% тикетов» рядом с mock'ом.
- **Применимо:** Если на лендинге Kaiten Knowledge Base планируется акцент на AI-поиск.

### 9. Atlassian Jira

- **URL:** [atlassian.com/software/jira](https://www.atlassian.com/software/jira)
- **Категория:** board / kanban (с видео)
- **Что эталонно:** Hero подаётся через **видео-демонстрацию** доски в движении (а не статичный PNG). Body группирует mock'и по командам (dev / marketing / IT / ops) с разными layout-вариантами.
- **Применимо:** Когда статичный mock «не передаёт» движение — заменить на 5-10-секундное silent loop video. Подход для будущей итерации Hero.

### 10. Pitch

- **URL:** [pitch.com](https://pitch.com/)
- **Категория:** hero composition (альтернативный декор)
- **Что эталонно:** Hero с 5 декоративными объектами — абстрактные геометрические фигуры за текстом (вместо gradient blob). Body — 4-шаговый flow (Start → Edit → Share → Measure), template-галерея в сетке (20+ карточек).
- **Применимо:** Если хотим уйти от gradient blob к более «product-ориентированному» декору. Альтернативный визуальный язык для будущих лендингов.

---

## Российские SaaS — пусто

Из проверенных (Kaiten.ru, amoCRM, Yougile, Kontur) ни один не даёт mock-иллюстраций уровня Linear / Stripe / Notion:

- **Kaiten.ru** — наш собственный, [internal reference](../landings/kaiten-techsupport-reference.md). Качественный для своего сегмента, но не мировой эталон.
- **amoCRM** — фокус на эмоциях («НЕ ТЕРЯЙТЕ КЛИЕНТОВ»), реальные mock'и вынесены на отдельные tour-страницы.
- **Yougile, Kontur** — fetch вернул редирект / 403 без подтверждения mock'ов.

**Вывод:** ориентир команды Kaiten — западные референсы из этого файла.

---

## История

- **2026-05-16** — собрано research-агентом через 31 web-запрос (6 WebSearch + 25 WebFetch). Все Mandatory 5 проверены по нескольким страницам каждый. Nice-to-have проверены одной страницей.
