---
name: buffalo-generate
description: Run the Buffalo LLM harness end-to-end in agent-mode (no API keys — the host LLM is YOU). Turn a marketing brief into a Kaiten landing: prepare prompt → generate LandingSpec → ingest (validate + render TSX) → preview. Use when the user wants to generate, regenerate, or iterate on a landing for a brief; or when they reference Buffalo harness, a slug, a brief.json, or `pnpm -w run harness agent`.
---

# Buffalo — Generate landing in agent-mode

Use this skill whenever the user wants to assemble a Kaiten-style SaaS landing from a brief — phrases like "buffalo", "harness", "сгенерируй лендинг", "новый лендинг для X", or just hand you a brief JSON.

**Key idea (agent-mode):** the harness is API-key-free. It does NOT call any external LLM. You — the host agent — are the LLM. The CLI emits a prompt + JSON schema for you, you write the spec, the CLI validates & renders TSX.

## Trigger phrases

- "сгенерируй лендинг по [brief]"
- "новый лендинг для [продукт]"
- "buffalo generate [slug]"
- "regenerate landing [slug]"
- "harness landing [slug]"

## Preconditions

- Repo is the Buffalo harness monorepo (`pnpm-workspace.yaml` at root).
- `pnpm install` has been run once.
- **No API keys required.** Agent-mode works in any host (Claude Code, Codex, ChatGPT with file access).

## End-to-end flow

### 0. Pick a layout from the library — ОБЯЗАТЕЛЬНО

**Это первый шаг. Не пропускать.** Раньше у нас был один `pageArchetype: saas` с фиксированным порядком секций — это привело к проблеме «все лендинги одинаковые». Library of 5 layouts в [`wiki/layouts/`](../../../wiki/layouts/) покрывает основные сценарии.

1. Открой [`wiki/layouts/index.md`](../../../wiki/layouts/index.md) и сопоставь бриф с одним из 5 layouts:
   - `enterprise-modular-saas` — платформа с ядром + модулями (PM + KB + поддержка + …), B2B mid+enterprise, импортозамещение.
   - `single-module-deep-dive` — один модуль с прозрачным сценарием (поддержка, HR, BPM).
   - `compliance-first-enterprise` — фокус на безопасность, реестр ПО, on-premise, госсектор.
   - `comparison-vs-competitor` — vs-страница (миграция с Jira / Notion / Yandex.Трекер).
   - `story-led-unaware` — холодная аудитория, эмоциональный путь.
2. Открой `wiki/layouts/<slug>.md` и прочитай: when-to-use, audience, awareness, **обязательную последовательность секций с per-slot mock-рекомендациями**, anti-patterns.
3. Запиши выбор в `content/briefs/<slug>.json` поле `pageLayout: '<slug>'`. Это включит layout-плейбук в system prompt prepare-команды и активирует `landing-layout-conformance` валидатор.

**Если ни один layout не подходит:** не миксуй секции на лету. Опиши новый кейс пользователю → добавь шестой layout в `wiki/layouts/` по образцу существующих → потом собирай лендинг. Лучше потратить время на инфраструктуру, чем выпустить ещё один однотипный лендинг.

### 1. Lock the brief

Open `content/briefs/<slug>.json`. If it does not exist:

- Ask the user for: product, audience, market, primary goal (`book_demo` / `signup` / `waitlist` / `contact_sales` / `try_free` / `download`), main pain, main promise, 3 proof points, tone (default: "clear, practical, confident, no hype"), CTA label, `pageArchetype` (`saas` / `waitlist` / `enterprise`), **`pageLayout`** (slug из шага 0).
- Write the brief to `content/briefs/<slug>.json` matching `BriefSchema` from `@buffalo/harness/schemas`.

**Audience pre-resolve (optional but speeds up the gate):** если знаешь явно — какие сегменты из [`wiki/audiences/kaiten-scoring.md`](../../../wiki/audiences/kaiten-scoring.md) подходят к брифу — добавь `resolvedSegments: ["IT", ...]`. Если не уверен — оставь пустым, audience-score gate сам сделает lexical-match. Если match провалится — на шаге 4½ сделаешь audience research и впишешь.

### 2. Prepare prompt (CLI emits it; no LLM call)

```bash
pnpm -w run harness agent prepare landing \
  --brief content/briefs/<slug>.json \
  --slug <slug> \
  --out .context/agent/<slug>.prompt.md
```

The artifact contains:

- **system** — operator rules + component registry + design-system + conversion-landing skill
- **user** — formatted brief
- **schema** — JSON Schema for LandingSpec (the contract)
- **outputPath** — where to write the spec (`content/landings/<slug>.json`)
- **nextCommand** — the apply command

Read the artifact carefully. The schema is the source of truth — every field, every constraint.

### 3. Generate the LandingSpec yourself

You are the LLM. From the brief + system prompt + layout playbook, write ONE JSON object matching `LandingSpec`. Constraints to remember:

- `sections[0].id === "hero"` and uses `HeroSection`.
- `sections[last].id === "footer"` and uses `LandingFooter` (if present).
- Exactly one `HeroSection`. At most one `FinalCta`. At most one `highlighted: true` plan.
- All `href` values start with `http(s)://`, `/`, or `#`.
- Primary CTA copy aligns with the brief's `cta` (or `primaryGoal`).
- Brand voice: no hype words ("revolutionary", "world-class", "game-changer", "next-generation", "cutting-edge", "best-in-class", "10x", "supercharge", "AI-powered" used as filler, …). Use clear, practical language.
- Title/subtitle/description length limits per the schema (e.g. title 4..80, subtitle 10..200).
- Follow `wiki/layouts/<slug>.md` table — порядок секций обязателен. Layout-conformance валидатор провалит spec, если порядок required секций нарушен.
- **Set `spec.meta.layout`** to the chosen layout slug (так apply сохранит его в досье и в дальнейших проверках).
- Доступные components (актуальный список см. `pnpm -w run harness registry`): `HeroSection`, `FeatureGrid`, `PricingPlans`, `FAQAccordion`, `FinalCta`, `LandingFooter`, `SocialProof`, `ProcessSteps`, `CtaBanner`, `MediaCopy`, `StatStrip`, `PromoBanner`, `BenefitsStrip`, `MetricsSplit`.

Write the JSON to `content/landings/<slug>.json` (the `outputPath` from prepare).

### 3a. Mock authoring stage — ОБЯЗАТЕЛЬНО для каждой визуальной секции

**Архитектура:** mock'и — отдельные TSX-компоненты в [`packages/ui/src/landing/mocks/`](../../../packages/ui/src/landing/mocks/), с захардкоженными доменными данными. Spec выбирает mock через enum-поле — например, `HeroSection.visual.variant: 'pm-board'` (рендерит `<PmBoardMock />`), `MediaCopy.mediaVariant: 'analytics-kpi'` и т.д.

**Эталон визуального качества** — `wiki/landings/kaiten-techsupport-reference.md`. Правила реализации mock'а — `packages/harness/src/prompts/section-mock-skill.md` (грузится в системный промпт).

**КРИТИЧЕСКОЕ ПРАВИЛО:** `mediaVariant: 'default'` и `visual.variant: 'generic'` — это generic three-bar placeholder. Если ты ставишь его «потому что не нашёл подходящий» — ты создаёшь ту самую проблему, ради которой существует эта библиотека. Валидатор `landing-visual-diversity` теперь блокирует:
- ❌ Больше 1 MediaCopy с `default` на лендинг (исключение — нарративный `story-led-unaware` layout).
- ⚠️ Hero `generic` без обоснования.
- ❌ Одинаковый `mediaVariant` в 2+ MediaCopy подряд (нужно чередовать).

**Существующие mock-компоненты** (`packages/ui/src/landing/mocks/`):

| Mock | Variant slug | Что иллюстрирует | Для каких сценариев |
|---|---|---|---|
| `SupportBoardMock` | `support-board` | Канбан-доска заявок поддержки | Лендинги модуля поддержки, обращения, SLA |
| `RequestCardMock` | `request-card` | Карточка заявки с чатом + чек-листом | «контекст в одной карточке», переписка |
| `KnowledgeBaseMock` | `kb-public` / `kb-internal` | Превью статьи КБ или внутреннего регламента | База знаний, документы, статьи |
| `PmBoardMock` | `pm-board` | Канбан PM-команды с эпиками, story points, спринтами | PM-ядро платформы, Kanban/Scrum/Gantt |
| `AnalyticsKpiMock` | `analytics-kpi` | Дашборд руководителя с 2×2 KPI + загрузка команд | Аналитика, отчёты, метрики команд |
| `IntegrationsConsoleMock` | `integrations-console` | Лента событий из 1С/AmoCRM/Telegram/GitLab | Интеграции, API, корпоративные системы |
| `ModulesMatrixMock` | `modules-matrix` | Bento-grid модулей платформы (PM, KB, поддержка, BPM, BI, AI) | Модульность платформы, выбор тарифа |

**Алгоритм (для каждой секции отдельно):**

1. Открой layout-плейбук — там для каждой секции есть колонка «Mock-рекомендация» с конкретным slug-ом. Это default-выбор.
2. Если рекомендация подходит по смыслу контента — используй её.
3. Если контент брифа сильно отличается (например, в лендинге не PM, а DevOps) — выбери другой существующий variant из таблицы выше.
4. Если ни один не подходит по смыслу — НЕ ставь `default`. Останови spec, опиши пользователю что нужен новый mock, создай его по [`section-mock-skill.md`](../../../packages/harness/src/prompts/section-mock-skill.md):
   - `<Name>Mock.tsx` в `packages/ui/src/landing/mocks/`
   - Хардкод доменных данных из брифа
   - Прогон через чек-лист §4
   - Расширить enum в `landing-spec.ts` (AssetRefSchema.variant или MediaCopy.mediaVariant)
   - Подключить case в HeroVisual / MediaCopy
   - Обновить registry description
5. После создания нового mock'а — возвращайся к spec и используй его.

**Это допустимо.** Лучше потратить 30 минут на новый mock-компонент, чем оставить лендинг с тремя `default` placeholder'ами.

**Пример spec-фрагмента — Hero с PmBoardMock:**

```json
{
  "id": "hero",
  "component": "HeroSection",
  "props": {
    "eyebrow": "Российская платформа управления работой",
    "title": "Задачи, документы и процессы в одной платформе",
    "accentWord": "одной",
    "subtitle": "Глубокий PM, база знаний, сервисные модули — в едином контуре.",
    "primaryCta": { "label": "Попробовать бесплатно", "href": "/signup" },
    "secondaryCta": { "label": "Записаться на демо", "href": "/demo" },
    "visual": {
      "type": "product_screenshot",
      "assetId": "kaiten-pm-board",
      "variant": "pm-board"
    },
    "visualPosition": "below"
  }
}
```

**Пример MediaCopy с уникальными mock'ами в трёх секциях подряд (для enterprise-modular-saas):**

```json
[
  { "id": "media_copy", "component": "MediaCopy", "props": { "title": "Ядро PM", "mediaVariant": "pm-board", "mediaPosition": "right", "...": "..." }},
  { "id": "media_copy", "component": "MediaCopy", "props": { "title": "База знаний", "mediaVariant": "kb-internal", "mediaPosition": "left", "...": "..." }},
  { "id": "media_copy", "component": "MediaCopy", "props": { "title": "Модули", "mediaVariant": "modules-matrix", "mediaPosition": "right", "...": "..." }}
]
```

Если для секции mock реально не нужен (FAQ, footer, BenefitsStrip) — просто не используй секцию с mock-slot'ом. НЕ ставь `default` ради заполнения слота.

### 4. Apply (validate + render TSX) — deterministic, no LLM

```bash
pnpm -w run harness agent apply landing \
  --slug <slug> \
  --brief content/briefs/<slug>.json
```

This will:

1. Parse the spec against `LandingSpecSchema` (zod).
2. Run brand-voice deny-list + business-rules validators.
3. **Run `landing-visual-diversity` validator** — блокирует `default` >1, collision variant'ов подряд.
4. **Run `landing-layout-conformance` validator** — если задан `pageLayout`, проверяет порядок required секций.
5. Run audience-score gate (см. 4½).
6. Enrich `spec.meta` (sources, archetype, layout, generator: "host-agent", generatedAt).
7. Render TSX to `generated/landings/<slug>/page.tsx`.
8. File back to `wiki/landings/<slug>.md`.

On success, you get the preview URL.

### 4½. Audience-score gate (новое — обязательно)

После того как brand + business валидаторы прошли и TSX отрендерен, `agent apply` **автоматически** прогоняет audience-score gate из `wiki/audiences/kaiten-scoring.json`. Это последний барьер перед preview.

**Что считается:**

- `S1 Story coverage (×0.4)` — закрыты ли top-N user stories (Score ≥ 87 — must-have; см. `wiki/audiences/kaiten-scoring.md`).
- `S2 Segment fit (×0.3)` — упоминаются ли резолвленные сегменты в hero/features/FAQ.
- `S3 Role addressability (×0.2)` — Тимлид/PM и ЛПР закрыты явно; для финансов/госа — плюс IT-директор (on-prem/ГОСТ).
- `S4 CTA alignment (×0.1)` — CTA соответствуют preferred типу сегмента (Trial для PLG-сегментов, Demo для Sales-Enable).

**Гейт по умолчанию:** `score ≥ 70` И все must-pass правила green. Если нет — `agent apply` exits с error, отчёт пишется в:

- `.context/audience-score/<slug>.{json,md}` (детально, по каждой story / роли / правилу)
- секцию `## Audience score` в `wiki/landings/<slug>.md` (часть досье)

**Что делать при `audience-resolve-needed`:**

Этот маркер появляется, когда в brief.audience/market нет ни одного известного сегмента из scoring-конфига. Тогда:

1. Сделай короткий audience-research для темы брифа: «кто типично использует продукт такого типа, кто принимает решение». РФ/СНГ — в первую очередь, мир — во вторую.
2. Запиши результат в `content/briefs/<slug>.json` в поле `resolvedSegments` (массив id из `wiki/audiences/kaiten-scoring.md`, напр. `["IT", "Агентства"]`).
3. По желанию — заведи `wiki/audiences/<slug>.md` с обоснованием выбора (аудит-след).
4. Запусти apply снова — теперь scoring сразу попадёт.

**Что делать при `score < threshold` или must-pass fail:**

Прочитай `.context/audience-score/<slug>.md` — там для каждой непокрытой story есть suggestion со списком ключевых слов и типом контента, которого не хватает. Правь `content/landings/<slug>.json` точечно: добавляй секции/копи/CTA по подсказкам. Repeat apply.

**Бюджет:** до 3 итераций аудиенс-исправлений (как brand/business). Если за 3 итерации не сошлось — сообщи пользователю, не пытайся бесконечно.

**Эскейп-хатч:** `agent apply landing --no-audience-gate` отключает гейт целиком (для отладки, не для регулярного использования). `--audience-threshold 60` — мягче порог.

**Пересчитать score без апплая:** `agent score landing --slug <slug> --brief <path>`.

### 5. Repair loop (still no LLM call)

If apply returns errors (brand / business / audience), the CLI lists them per-section. Use `--json` to get machine-readable output:

```bash
pnpm -w run harness agent apply landing --slug <slug> --brief content/briefs/<slug>.json --json
```

Edit `content/landings/<slug>.json` to fix each error, then re-run apply. Repeat until ok. Budget: up to 3 iterations. If still failing, ask the user.

### 6. Preview

```bash
pnpm dev
```

Open `http://localhost:3000/landings/<slug>`. Verify visually.

### 7. Handoff (optional)

```bash
pnpm -w run harness handoff <slug>
```

Self-contained ZIP for the frontend team.

## Important

- **Never use `harness generate landing`** unless the user explicitly asks for the legacy API-key path. The agent-mode path is `agent prepare` → write spec → `agent apply`.
- **Never invent components.** Only the 6 in the registry. Check with `pnpm -w run harness registry`.
- **Never hand-edit `generated/landings/<slug>/page.tsx`** — it's derived from the spec. Re-run apply.
- If the spec already exists, you can skip prepare and start from apply (e.g. for re-validation after manual edits).
- **Never skip mock authoring** на SaaS-лендингах. Лендинг без mock'ов в Hero и body-секциях выглядит «голым» — это блокер ревью (см. memory `visual-review-required`). Минимум: Hero с `visual.variant: '<specific>'` (НЕ `generic`) + 2-4 body-секции с уникальными mock'ами (НЕ `default`).
- **Never skip layout selection.** Если в брифе нет `pageLayout` — выбери его перед написанием spec, опираясь на `wiki/layouts/index.md`. Запиши в `spec.meta.layout`.
- **Never use `mediaVariant: 'default'` twice на одном лендинге.** Валидатор завалит. Создай новый mock-компонент или подбери другой variant из реестра.

## Anti-patterns

- Calling external APIs or asking the user for API keys (the whole point of agent-mode is to avoid this).
- Writing markdown fences or commentary into the spec JSON — apply only accepts pure JSON.
- Regenerating illustrations on every landing run — they are stable artifacts in `packages/ui/src/illustrations/`.
- Lorem-style или abstract данные в новом mock-компоненте. Контент — domain-specific из брифа.
- Mixing two semantic color axes inside one mock (priority + type через accent-bar). One axis per mock.
- Two or more эмодзи в одном mock-компоненте. Zero or one.
- A landing where every body section has the same layout (text+mock, text+mock, …). Apply zigzag: alternating sections with mocks left/right (`MediaCopy.reverse: true` в каждой второй).
- Reuse того же mock-компонента в двух разных сценариях через `variant` без визуального обоснования. Если сценарии визуально разные — это два разных компонента.
- Props на content в mock-компоненте (`tickets: Ticket[]`, `messages: Message[]`). Контент — хардкод; для разветвления — только `variant: 'a' | 'b'`.
