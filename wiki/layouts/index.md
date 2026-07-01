---
slug: layouts-index
type: layout-index
created: 2026-05-16
updated: 2026-05-16
sources:
  - packages/harness/src/schemas/landing-spec.ts
  - packages/harness/src/registry/index.ts
  - packages/harness/src/skills/conversion-landing.md
related:
  - wiki/archetypes/saas_landing.md
  - packages/harness/src/prompts/section-mock-skill.md
tags:
  - layout
  - landing
  - architecture
stale: false
---

# Layout library — индекс

> **Зачем.** Раньше у нас был единственный `pageArchetype: saas` с фиксированным
> порядком секций. Это привело к проблеме: все лендинги получались внешне
> одинаковыми, даже когда смысл их совершенно разный (платформа vs модуль
> поддержки vs сравнение с конкурентом vs enterprise-предложение).
>
> **Что это решает.** Library of 5 проверенных layouts покрывает основные
> сценарии. Каждый layout — это не просто порядок секций, а связка:
> - целевой сегмент аудитории,
> - awareness-level трафика,
> - порядок секций (часто нелинейный — иногда proof перед benefits),
> - per-slot рекомендация какой mock-variant использовать,
> - правила альтернативы (если контент брифа не наполняет какую-то секцию).
>
> **Как использовать.** В `Brief.pageLayout` выбери slug одного из layouts.
> Конвейер подгрузит соответствующий layout-плейбук в контекст фаз P2/P6
> (а сборщик system-prompt — в прямой API-flow). Если ни один не подходит —
> НЕ изобретай свой на лету, опиши кейс пользователю и предложи добавить
> шестой layout в библиотеку.

## Доступные layouts

| Slug | Когда выбрать | Целевая аудитория | Awareness | Mock-плотность |
|---|---|---|---|---|
| [`enterprise-modular-saas`](./enterprise-modular-saas.md) | Платформа с ядром + модулями, B2B mid+enterprise, импортозамещение | ИТ-директор, PMO, Operations | solution-aware | High (5 уникальных) |
| [`single-module-deep-dive`](./single-module-deep-dive.md) | Один продуктовый модуль с прозрачным сценарием (поддержка, HR, BPM) | Руководитель функции (saas/IT-руководитель) | problem-aware → solution-aware | High (5 уникальных) |
| [`compliance-first-enterprise`](./compliance-first-enterprise.md) | Enterprise-предложение с акцентом на безопасность, реестр ПО, on-premise | Служба безопасности, IT-Compliance, госсектор | most-aware | Medium (2-3 mock'а, упор на трасты) |
| [`comparison-vs-competitor`](./comparison-vs-competitor.md) | Vs-страница «миграция с X» (Jira, Notion, Asana, Trello) | ИТ-руководитель, выбирающий PM-инструмент | product-aware (сравнивает) | Medium (1 board side-by-side + 2 поддержки) |
| [`story-led-unaware`](./story-led-unaware.md) | Cold-аудитория / unaware top-funnel, когда нужно сначала эмпатия, потом продукт | Топ-менеджер, не идентифицирующий проблему как «PM-проблему» | unaware → problem-aware | Low (1 крупный mock, остальное — нарратив) |
| [`depersonalized-product-tour`](./depersonalized-product-tour.md) | Обезличенный SMB SaaS (CRM, white-label, материнский landing). Длинный product tour без брендов и без Pricing на странице | Владелец SMB, РОП, маркетолог, операционный директор | problem-aware → solution-aware | High (6+ MediaCopy с разными mock-вариантами) |
| [`crm-product-tour`](./crm-product-tour.md) | Обезличенный CRM (или CRM-подобный multi-feature SaaS для SMB) с интерактивным ритмом: tabs по ролям + day-in-the-life сценарий + industry picker. Заменяет MediaCopy×N интерактивными секциями | Владелец SMB, РОП, маркетолог, руководитель сервиса | problem-aware → solution-aware | High (8+ CRM-specific mock'ов в 3 интерактивных секциях + 1-3 MediaCopy) |
| [`migration-from-competitor`](./migration-from-competitor.md) | Лендинг про **процесс перехода** с конкретного конкурента (не сравнение, а how-to migrate). Hero «План миграции с {Brand} за {N} дней», главная секция — Timeline/Process | ИТ-директор, COO, ответственный за миграционный проект | most-aware | Medium (1-2 mock'а по домену + Timeline) |
| [`product-launch`](./product-launch.md) | Анонс нового продукта / модуля / большой версии. Главная цель — early-access sign-up | Innovator-сегмент, early adopter | unaware → problem-aware | Medium-High (Bento + Hero mock + 1-2 MediaCopy + Timeline) |
| [`case-study-deep-dive`](./case-study-deep-dive.md) | Один кейс конкретного клиента на всю страницу: «Как {Company} увеличил {KPI} на {N%} за {T}». Long-form lead-magnet | Похожий ЛПР по профилю с героем кейса (та же роль / отрасль / размер) | product-aware → most-aware | Medium (2 TestimonialQuote + 2 MediaCopy + Timeline) |

## Жёсткие правила выбора

1. **Один лендинг = один layout.** Не миксовать секции из разных layouts «по
   вкусу» — это и привело к однотипности раньше.
2. **`generic` mock-variant запрещён, если есть смысловой fit.** В layout-доке
   для каждой mock-секции указано: что должно быть (например, `pm-board` для
   media_copy «ядро PM»). Если рекомендация не подходит контенту брифа — сначала
   создай новый mock-компонент по `section-mock-skill.md`, потом выбирай.
3. **MediaCopy `mediaVariant: "default"` — максимум 1 на лендинг,** и только
   если в layout-доке явно сказано «default допустим для этого слота».
4. **Layout-conformance.** Если в layout сказано «hero → social_proof →
   media_copy ×3 → …», валидатор `landing-layout-conformance` проверит, что
   spec следует этому порядку (с допуском на опциональные слоты).
5. **Chrome (шапка/подвал) — НЕ авторишь.** Каждый лендинг фабрики автоматически
   получает статичную шапку kaiten.ru (`SiteHeader`) первой секцией и статичный
   подвал kaiten.ru (`LandingFooterMock`) — последней. Это делает `agent apply`
   (нормализация `factory-chrome` в `ingest-landing.ts`). Поэтому:
   - **не пиши `SiteHeader` / `LandingFooter` / `LandingFooterMock` в spec** — их
     подставят автоматически (любые написанные вручную — отбрасываются);
   - **состав ссылок в подвале не сочиняем** — подвал ставится «как есть»;
   - **после шапки всегда идёт Hero** (правило `hero-first` теперь = «Hero сразу
     за `SiteHeader`»). В таблицах секций ниже строки Header/Footer подразумеваются
     неявно — начинай план с Hero и заканчивай последним контентным блоком.
6. **`AccordionFeatureSection` — OPT-IN.** Этот блок (аккордеон фич + синхронный
   mock) используется **только если тип блока явно прописан в ТЗ**. При генерации
   из **brief** или **свободного запроса** — НЕ выбирай его: разворачивай фичи
   обычными `MediaCopy` (или `TabbedFeatureSection`, если ТЗ просит табы). Правило:
   `accordion-only-if-tz`.
7. **Слот отзывов/доверия → `ReviewSlider` ПО УМОЛЧАНИЮ.** Там, где в таблицах
   секций стоит `SocialProof`, по умолчанию ставь `ReviewSlider` (слайдер отзывов).
   `SocialProof` (статичная сетка), `TestimonialQuote` (одна цитата), `LogoCloud`
   (полоса лого) — альтернативы, только если явно нужны/просят в ТЗ. Conformance
   считает эти четыре блока взаимозаменяемыми для слота `SocialProof`. Правило:
   `reviews-default-slider`.

## Когда добавлять шестой layout

Если бриф не ложится ни на один из 5 — это сигнал, что нужен новый layout, а не
костыль. Алгоритм:

1. Опиши новый кейс пользователю.
2. Подбери прототип: посмотри 3-4 эталонных лендинга в этом жанре (Linear,
   Notion, Vercel, Stripe).
3. Опиши layout по той же структуре: `when_to_use`, `awareness`, `audience`,
   `sections[]` с per-slot mock-рекомендациями, `voice`, `anti_patterns`.
4. Положи `wiki/layouts/<slug>.md` и допиши в эту таблицу.
5. Только после этого собирай по нему лендинг.

## Связанные документы

- [`packages/harness/src/skills/conversion-landing.md`](../../packages/harness/src/skills/conversion-landing.md) — общая методика конверсионных секций (page-type matrix, awareness, hero formulas). Layouts — это applied вариант методики под наши сегменты.
- [`packages/harness/src/prompts/section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md) — правила mock-компонентов (6 архетипов, hard/soft rules, чек-лист).
- [`wiki/archetypes/saas_landing.md`](../archetypes/saas_landing.md) — legacy archetype (более широкая категория, осталась для backwards-compat).
