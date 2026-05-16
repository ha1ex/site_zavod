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

## Anti-patterns

- Calling external APIs or asking the user for API keys (the whole point of agent-mode is to avoid this).
- Writing markdown fences or commentary into the spec JSON — apply only accepts pure JSON.
- Regenerating illustrations on every landing run — they are stable artifacts in `packages/ui/src/illustrations/`.
