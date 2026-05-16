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

### 1. Lock the brief

Open `content/briefs/<slug>.json`. If it does not exist:

- Ask the user for: product, audience, market, primary goal (`book_demo` / `signup` / `waitlist` / `contact_sales` / `try_free` / `download`), main pain, main promise, 3 proof points, tone (default: "clear, practical, confident, no hype"), CTA label, `pageArchetype` (`saas` / `waitlist` / `enterprise`).
- Write the brief to `content/briefs/<slug>.json` matching `BriefSchema` from `@buffalo/harness/schemas`.

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

You are the LLM. From the brief + system prompt, write ONE JSON object matching `LandingSpec`. Constraints to remember:

- `sections[0].id === "hero"` and uses `HeroSection`.
- `sections[last].id === "footer"` and uses `LandingFooter` (if present).
- Exactly one `HeroSection`. At most one `FinalCta`. At most one `highlighted: true` plan.
- All `href` values start with `http(s)://`, `/`, or `#`.
- Primary CTA copy aligns with the brief's `cta` (or `primaryGoal`).
- Brand voice: no hype words ("revolutionary", "world-class", "game-changer", "next-generation", "cutting-edge", "best-in-class", "10x", "supercharge", "AI-powered" used as filler, …). Use clear, practical language.
- Title/subtitle/description length limits per the schema (e.g. title 4..80, subtitle 10..200).
- Only the 6 registered components: `HeroSection`, `FeatureGrid`, `PricingPlans`, `FAQAccordion`, `FinalCta`, `LandingFooter`.

Write the JSON to `content/landings/<slug>.json` (the `outputPath` from prepare).

### 3a. Mock authoring stage (для секций с `mockUi`)

`HeroSection`, `FeatureGrid` и `FinalCta` поддерживают опциональный `mockUi` — HTML/Tailwind UI-мок, который рендерится через компонент `SectionMock` (см. `packages/ui/src/landing/SectionMock.tsx`). Шесть шаблонов: `board`, `chat`, `checklist`, `article`, `kpi`, `console`. Эталон — `wiki/landings/kaiten-techsupport-reference.md` (snapshot + распаковка приёмов). Правила — `packages/harness/src/prompts/section-mock-skill.md` (грузится в системный промпт).

**Цель этапа:** заменить «голые» секции (только текст + кнопки) на секции с живой иллюстрацией продукта. На крупном SaaS-лендинге целевая пропорция — один Hero-mock + 3-5 mock'ов в body-секциях.

**Что делать:**

1. Для каждой секции из spec'а реши, нужен ли mock:
   - Hero → почти всегда нужен (board / chat / kpi — что лучше всего иллюстрирует main promise брифа).
   - FeatureGrid → нужен, если секция про конкретный workflow (поток заявок, чат, БЗ). Не нужен, если секция — общий список «возможностей».
   - FinalCta → нужен только для social-proof KPI («87% закрыто в SLA», «120 команд»).
2. Выбери шаблон по правилам из section-mock-skill.md §0. Один шаблон на секцию.
3. Заполни `content` доменной конкретикой ИЗ БРИФА. Все строки — реальные:
   - Темы обращений / названия задач — из `brief.audience` + `brief.mainPain`.
   - Имена клиентов / агентов — generic-русские (Анна Петрова, Команда поддержки), либо из `brief.proofPoints`.
   - KPI-числа — из `brief.proofPoints` (если бриф даёт метрики) или маркетинг-разумные (78-95% для positive, единицы для negative).
   - Чат-диалоги — пара «жалоба → решение» по сценарию из `brief.mainPain`.
   - Никаких "Item 1", "Card", "Title", "Lorem ipsum".
4. Соблюди ось цвета: одна семантическая ось на mock (`accent`-цвета карточек = только статус, ИЛИ только приоритет, ИЛИ только тип — не смешивать).
5. Один активный элемент на mock (`active: true`), остальные приглушены (`dim: true` в board, `done: true/false` mix в checklist).
6. Эмодзи — 0 или 1 на mock, из разрешённого набора шаблона.
7. **Чек-лист самопроверки** (из section-mock-skill.md §4) — пройди мысленно по каждому пункту до записи spec'а в файл.

**Пример (Hero для kaiten-техподдержки):**

```json
{
  "id": "hero",
  "component": "HeroSection",
  "props": {
    "eyebrow": "Кайтен для техподдержки",
    "title": "Служба поддержки без потерянных заявок",
    "subtitle": "Принимайте обращения из почты, мессенджера и с портала на одной доске.",
    "primaryCta": { "label": "Получить демо", "href": "/demo" },
    "secondaryCta": { "label": "Как это работает", "href": "#how" },
    "mockUi": {
      "template": "board",
      "content": {
        "tabs": ["Заявки", "Очередь", "SLA", "Ответы", "Фильтры"],
        "activeTab": "Заявки",
        "columns": [
          {
            "title": "Новые",
            "count": 8,
            "cards": [
              { "title": "Не приходит код подтверждения", "meta": "Telegram · новый клиент", "accent": "primary", "badges": [{ "label": "P1", "tone": "red" }], "active": true },
              { "title": "Ошибка в личном кабинете", "meta": "Передать в разработку", "accent": "red", "badges": [{ "label": "Bug", "tone": "red" }, { "label": "SLA 2ч", "tone": "neutral" }], "dim": true }
            ]
          },
          {
            "title": "В работе",
            "cards": [
              { "title": "Нужен акт сверки", "meta": "Почта · бухгалтерия", "accent": "orange" },
              { "title": "Восстановить доступ", "meta": "Чат · повторное обращение", "accent": "primary", "dim": true }
            ]
          },
          {
            "title": "Готово",
            "cards": [
              { "title": "Доступ восстановлен", "meta": "Оценка: 5/5", "accent": "green", "badges": [{ "label": "Закрыта", "tone": "emerald" }] },
              { "title": "Возврат оплаты обработан", "meta": "Telegram", "accent": "green", "dim": true }
            ]
          }
        ],
        "activeEmoji": "☝️"
      }
    }
  }
}
```

Если mock для секции не нужен — просто не клади `mockUi` в props.

### 4. Apply (validate + render TSX) — deterministic, no LLM

```bash
pnpm -w run harness agent apply landing \
  --slug <slug> \
  --brief content/briefs/<slug>.json
```

This will:

1. Parse the spec against `LandingSpecSchema` (zod).
2. Run brand-voice deny-list + business-rules validators.
3. Enrich `spec.meta` (sources, archetype, generator: "host-agent", generatedAt).
4. Render TSX to `generated/landings/<slug>/page.tsx`.
5. File back to `wiki/landings/<slug>.md`.

On success, you get the preview URL.

### 5. Repair loop (still no LLM call)

If apply returns errors, the CLI lists them per-section. Use `--json` to get machine-readable output:

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
- **Never skip mock authoring** на SaaS-лендингах. Лендинг без mock'ов в Hero и body-секциях выглядит «голым» — это блокер ревью (см. memory `visual-review-required`). Минимум: Hero + 2 body-секции с mockUi.

## Anti-patterns

- Calling external APIs or asking the user for API keys (the whole point of agent-mode is to avoid this).
- Writing markdown fences or commentary into the spec JSON — apply only accepts pure JSON.
- Regenerating illustrations on every landing run — they are stable artifacts in `packages/ui/src/illustrations/`.
- Lorem-style or abstract content inside `mockUi.content` (e.g. `"title": "Card 1"`, `"meta": "Source · Tag"`). Use domain-specific copy from the brief.
- Mixing two semantic color axes inside one mock (priority + type via `accent`). One axis per mock.
- Two or more emoji glyphs inside one `mockUi.content` block. Zero or one.
- A landing where every body section has the same layout (text+mock, text+mock, …). Apply zigzag: alternating sections with mocks left/right (the renderer can flip via CSS — but plan visually).
