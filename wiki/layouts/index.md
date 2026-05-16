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
> `harness agent prepare` подгрузит соответствующий layout-плейбук в system
> prompt. Если ни один не подходит — НЕ изобретай свой на лету, опиши кейс
> пользователю и предложи добавить шестой layout в библиотеку.

## Доступные layouts

| Slug | Когда выбрать | Целевая аудитория | Awareness | Mock-плотность |
|---|---|---|---|---|
| [`enterprise-modular-saas`](./enterprise-modular-saas.md) | Платформа с ядром + модулями, B2B mid+enterprise, импортозамещение | ИТ-директор, PMO, Operations | solution-aware | High (5 уникальных) |
| [`single-module-deep-dive`](./single-module-deep-dive.md) | Один продуктовый модуль с прозрачным сценарием (поддержка, HR, BPM) | Руководитель функции (saas/IT-руководитель) | problem-aware → solution-aware | High (5 уникальных) |
| [`compliance-first-enterprise`](./compliance-first-enterprise.md) | Enterprise-предложение с акцентом на безопасность, реестр ПО, on-premise | Служба безопасности, IT-Compliance, госсектор | most-aware | Medium (2-3 mock'а, упор на трасты) |
| [`comparison-vs-competitor`](./comparison-vs-competitor.md) | Vs-страница «миграция с X» (Jira, Notion, Asana, Trello) | ИТ-руководитель, выбирающий PM-инструмент | product-aware (сравнивает) | Medium (1 board side-by-side + 2 поддержки) |
| [`story-led-unaware`](./story-led-unaware.md) | Cold-аудитория / unaware top-funnel, когда нужно сначала эмпатия, потом продукт | Топ-менеджер, не идентифицирующий проблему как «PM-проблему» | unaware → problem-aware | Low (1 крупный mock, остальное — нарратив) |

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
