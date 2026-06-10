---
name: kaiten-build-landing
description: Сгенерировать Kaiten-стайл лендинг по brief через Контент-завод Кайтен в любом ассистенте (Claude Code, Codex CLI, Cursor, Gemini CLI). Не требует API-ключей — host LLM сам генерирует LandingSpec. Триггеры — «сгенерируй лендинг», «новый лендинг для X», «kaiten build <slug>», «harness landing». Версия для маркетинговой команды — пошагово, без CLI-магии.
---

# Kaiten Build Landing — кросс-инструментальный playbook для маркетинга

> Этот файл — **единая точка входа** для всех ассистентов (Claude Code / Codex / Cursor / Gemini). Любой из них прочитает его и поймёт, как собрать лендинг.

## Что делает этот skill

Превращает маркетинговый бриф (`brief.json`) в готовый Kaiten-лендинг:
1. Маркетолог пишет короткий бриф.
2. Ассистент запускает одну команду — `harness agent build landing`.
3. Harness проверяет покрытие домена (гейт) и ведёт сборку по фазам P0–P8 с валидацией на каждой.
4. На выходе — preview по `http://localhost:3000/landings/<slug>` + approval UI.

**Без API-ключей.** Harness не вызывает внешний LLM — host-агент (ты) и есть LLM. CLI готовит prompt + JSON schema, ты пишешь spec, CLI валидирует и рендерит TSX.

---

## Когда вызывать (триггеры)

- «Сгенерируй лендинг по [brief]» / «новый лендинг для [продукт]».
- «Контент-завод Кайтен build <slug>» / «harness landing <slug>».
- Пользователь дал JSON brief'а или ссылку на `content/briefs/<slug>.json`.
- Просьба переделать существующий лендинг (regenerate).

---

## Шаги для не-разработчика

### Шаг −1 — ритуал сессии (обязательно, один раз за сеанс)

```bash
pnpm install                          # один раз на машину (заодно включает git-гейты)
pnpm -w run harness agent context     # детект твоего ассистента + горячий контекст + правила
```

Работает в любом ассистенте (Claude Code / Codex / Cursor / Gemini); Claude Code делает это сам через SessionStart-хук. Если ассистент не определился — `export HARNESS_AGENT=codex` (или `gemini`). Полный контракт — [`AGENTS.md`](AGENTS.md).

### Шаг 0 — выбрать домен

Открой [`wiki/references/domain-mock-matrix.md`](wiki/references/domain-mock-matrix.md) и определи домен продукта по brief:

| Домен | Когда | Готовые mocks |
|---|---|---|
| **PM · Project Management** | Канбан, спринты, story points (Jira-like) | pm-board, analytics-kpi, modules-matrix, integrations-console |
| **Support · Service Desk** | Поддержка, SLA, чат с клиентом | support-board, request-card, kb-public, kb-internal |
| **CRM · Sales** | Воронка, клиенты, омниканальность | sales-funnel, crm-client-card, omnichannel-inbox, …(8 шт) |
| **HR · Recruiting** | Кандидаты, оффер, онбординг | hiring-pipeline, candidate-card, …(5 шт) |
| **Marketing automation** | Кампании, email, A/B | campaign-dashboard, email-sequence, …(4 шт) |
| **BPM · Workflow** | Процессы, согласования, SLA | process-flowchart, approval-chain, sla-tracker |
| **Finance · Accounting** | Проводки, счета, сверка | ledger-view, invoice-status, reconciliation-matrix |
| **E-commerce · Retail** | Заказы, остатки, маркетплейсы | order-queue, inventory-grid, marketplace-connector |
| **Docs · Knowledge base** | Документы, регламенты, шеринг | docs-tree, doc-editor-rich, …(6 шт) |

Если домена нет в списке — **STOP**. Сначала создаём набор mock'ов (это инженерная задача, маркетолог в одиночку не делает). Пиши в команду: «нужно создать 5-8 mock'ов под домен X».

### Шаг 1 — заполнить brief

Создай `content/briefs/<slug>.json`. Минимум:

```json
{
  "product": "Короткое описание продукта",
  "audience": ["роль 1", "роль 2"],
  "market": "B2B SaaS",
  "primaryGoal": "book_demo",
  "mainPain": "Какую боль решаем",
  "mainPromise": "Что обещаем",
  "proofPoints": ["факт 1", "факт 2", "факт 3"],
  "tone": "clear, professional, non-hype",
  "cta": "Получить демо",
  "pageArchetype": "saas",
  "pageLayout": "enterprise-modular-saas"
}
```

См. подробное описание полей — [`wiki/marketing/brief-fields.md`](wiki/marketing/brief-fields.md).

### Шаг 2 — запустить harness

**Одна команда. Гейт домена + сборка автоматически:**

```bash
pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json
```

Возможные исходы:
- 🔀 **phased** (домен покрыт): orchestrator P0..P8 с per-phase repair-loop. Ты заполняешь prompt'ы LLM-фаз, harness валидирует каждую.
- 🛑 **manual-creation-required**: pipeline отказывается. Получаешь todo-список mock'ов к созданию (инженерная задача).

### Шаг 3 — preview

```bash
pnpm dev
# → http://localhost:3000/landings/<slug>
```

### Шаг 4 — approve

`http://localhost:3000/approve/<slug>` — split-screen preview + форма (status, reviewer, comments). Состояние пишется в `content/approvals/<slug>.json`.

### Шаг 5 — handoff (для фронта)

```bash
pnpm -w run harness handoff <slug> --require-approved
# → out/landing-<slug>.zip
```

---

## Доработки уже сгенерированного лендинга

Если нужно поменять заголовок, переставить секции, заменить mock — см. [`wiki/marketing/edit-recipes.md`](wiki/marketing/edit-recipes.md). Сводно:

| Что хочу | Что делать |
|---|---|
| Изменить копию (заголовок, описание) | Открыть `content/landings/<slug>.json`, поправить поле в `props`, запустить `pnpm -w run harness agent apply landing --slug <slug> --brief …` |
| Переставить секции | Пересортировать массив `sections[]` в JSON, повторить apply |
| Поменять mock-variant (картинку) | Поменять `visual.variant` / `mediaVariant` в нужной секции на любой из своего домена (см. [`wiki/marketing/brief-fields.md`](wiki/marketing/brief-fields.md)). Валидатор `mock-semantic-fit` блокирует cross-domain. |
| Подсмотреть как выглядит блок | `pnpm storybook` → раздел `Landing/*` (22 секции) или `Mocks/_Catalog` (все 39 моков) |
| Перегенерить с нуля | Удалить `content/landings/<slug>.json`, запустить `harness agent build` заново |

---

## Что НЕ делать

- ❌ Не использовать `harness generate landing` (прямой вызов LLM по API-ключу) — только `agent build`.
- ❌ Не править существующие `content/briefs/*.json` — заблокировано на трёх слоях (git pre-commit + harness CLI + Claude-hook). Новая итерация = новый файл `<slug>-v2.json`.
- ❌ Не подменять mock из чужого домена (`pm-board` в CRM-лендинге — блокер ревью).
- ❌ Не ставить `mediaVariant: 'default'` дважды на одном лендинге — `landing-visual-diversity` валидатор завалит.
- ❌ Не править `generated/landings/<slug>/page.tsx` вручную — он автогенерируется из spec'а.
- ❌ Не выдумывать новые компоненты — registry жёстко ограничен 22 секциями.

---

## Если что-то пошло не так

См. [`wiki/marketing/troubleshooting.md`](wiki/marketing/troubleshooting.md). Частые случаи:

- **«Router отказался, manual-creation-required»** → домен не покрыт mock'ами. Создать набор перед генерацией.
- **«Validator упал на illustration-domain-match»** → mock из чужого домена в spec'е. Заменить на свой.
- **«Audience score < 70»** → пересмотреть копию hero / features под аудиторию. См. отчёт в `.context/audience-score/<slug>.md`.
- **«Cross-landing diversity warning»** → лендинг слишком похож на другие. Изменить структуру или формулировки.

---

## Куда смотреть глубже (для разработки)

- [`AGENTS.md`](AGENTS.md) — конвенции репо.
- [`README.md`](README.md) — полная техническая документация.
- [`docs/pipeline.md`](docs/pipeline.md) — все 9 фаз pipeline'а.
- [`.claude/skills/kaiten-generate/SKILL.md`](.claude/skills/kaiten-generate/SKILL.md) — детальный engineer-flow.
- [`wiki/marketing/`](wiki/marketing/) — маркетинговые playbook'и.
- Storybook: `pnpm --filter @kaiten/ui storybook` → визуальный каталог всех блоков.
