# wiki/audiences — конвенции

Папка хранит профили целевых аудиторий, на которых базируется **audience-score gate** Buffalo-harness.

## Что лежит

- [`kaiten-scoring.json`](kaiten-scoring.json) — структурированный SSoT (сегменты, роли, user stories, cross-map, must-pass правила). Машино-читаемый, загружается валидатором `landing-audience.ts`.
- [`kaiten-scoring.md`](kaiten-scoring.md) — человекочитаемое зеркало JSON. Изменения держим синхронно.
- `<slug>.md` _(опционально, после ингеста брифа)_ — резолвленные сегменты и роли для конкретного брифа, если host-LLM делал audience-research.

## Когда обновлять `kaiten-scoring.*`

- Появился новый сегмент или роль с подтверждённым весом (новый кейс, новая регуляторика, новый рынок).
- Изменились web-приоритеты (например, после A/B-теста CTA).
- Появился новый user story с score ≥ 70.

Не обновляем реактивно после каждого фидбэка — собираем накопительно и обновляем версии (`version` в JSON).

## Как добавить новый сегмент

1. В `kaiten-scoring.json` добавить запись в `segments[]` со всеми полями: `id`, `name`, `compositeScore`, `websiteScore`, `wim`, `websiteZone`, `ctaTypes`, `synonyms`, `mustHaveStories`.
2. В `crossMap` добавить запись (5/4/3/2/1 для каждой story).
3. Если новый сегмент меняет must-pass правила — добавить в `mustPassRules`.
4. Синхронизировать в `kaiten-scoring.md`.
5. Прогнать `pnpm -w run harness agent score landing --slug <existing-slug>` — убедиться, что существующие лендинги не сломались.

## Как добавить опциональный профиль для конкретного брифа

После audience-research host-LLM записывает результат в `content/briefs/<slug>.json` (поле `resolvedSegments`) и **опционально** создаёт файл `wiki/audiences/<slug>.md` с обоснованием выбора (источники, цитаты, рассуждения). Это аудит-след, не машинно-читаемый — нужен только для ревью.
