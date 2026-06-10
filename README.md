# Контент-завод Кайтен — сборка лендингов на LLM

> Превращаем маркетинговый бриф в готовый Kaiten-лендинг за минуту, а не за неделю.

Контент-завод Кайтен — это управляемый контур вокруг LLM (Claude / GPT / любой хост-агент), который
собирает SaaS-лендинги **строго на наших компонентах**, в фирменном стиле Kaiten, с
автоматической проверкой бренда, доступности, бизнес-правил **и domain-fit на трёх
уровнях**. На выходе — обычный TSX, который проходит ревью и мержится как любой PR.

📖 **Подробная техническая документация пайплайна:** [`docs/pipeline.md`](docs/pipeline.md)

---

## Что нового (M1-M6, май 2026)

После CRM-инцидента «pm-board в CRM-лендинге» (см. [`wiki/lessons.md`](wiki/lessons.md))
переработана архитектура pipeline:

- 🆕 **Auto-routing entry point** (`harness agent build`) — сам определяет какой
  pipeline применить под brief (legacy / phased / manual-creation).
- 🆕 **Phased pipeline** (P0..P8) с per-phase repair-loop (max 3 attempts) — для
  сложных brief'ов.
- 🆕 **8 покрытых доменов** (раньше 4): PM, Support, CRM, HR, Marketing, BPM,
  Finance, E-commerce. **27 mocks + 5 structural components + 10 layouts**.
- 🆕 **Domain-fit hard validators** (3 уровня защиты): `illustration-domain-match`,
  `mock-semantic-fit`, `cross-landing-diversity`. `pm-board` в CRM физически
  невозможен.
- 🆕 **Cross-landing diversity audit** — отчёт о схожести с другими лендингами
  по structure/semantic fingerprints.
- 🆕 **Illustration allocation P8** — для секций без подходящего mock'а
  автоматически формируется IllustrationSpec для уникальной SVG с
  anti-duplication через global usage registry.

---

## 🏭 Что нового (Контент-фабрика, июнь 2026)

Методология **Kaiten Content Factory** (редполитика + метод написания ТЗ лендингов)
интегрирована как источник истины + новый верхний этап пайплайна:

- 🆕 **Этап «фабрика ТЗ» (intake)** — команда приносит **сырые данные** (свободный
  запрос + папка материалов), агент готовит человекочитаемое **ТЗ**
  (`content/briefs/<slug>.tz.md`) и согласованный машинный **brief**, который уходит в
  обычный pipeline. Поток: `agent intake` → `agent intake-apply` → `agent build`.
  Skill [`kaiten-intake`](.claude/skills/kaiten-intake/SKILL.md).
- 🆕 **Брендовый канон Kaiten** как источник истины, грузится в КАЖДЫЙ system-prompt:
  [`wiki/brand/redpolitika.md`](wiki/brand/redpolitika.md),
  [`wiki/references/kaiten-product-facts.md`](wiki/references/kaiten-product-facts.md),
  [`wiki/references/anglicism-dictionary.md`](wiki/references/anglicism-dictionary.md).
- 🆕 **Валидатор языка** (`landing-language`, §10 англицизмы по словарю — soft по
  умолчанию) + **brief-quality** (домен резолвится / тонкие поля / лозунги /
  needs_confirmation).
- 🆕 **Веб-ревью ТЗ** `/intake/<slug>` + approval-поверхность intake +
  `agent build --require-intake-approved`.

---

## Что нового (июнь 2026): один конвейер сборки

- 🗑 **Быстрый конвейер (legacy one-shot `prepare → spec → apply`) удалён.**
  Остался один конвейер сборки — phased (P0..P8). Routing теперь — чистый
  гейт домена: домен покрыт → phased, не покрыт → стоп с todo-списком mock'ов.
- Убраны флаги `--force-legacy` / `--force-phased` и команда `agent prepare`;
  `agent apply` остался как финальный пакет проверок + рендер TSX.

---

## Зачем это маркетингу

**Проблема.** Каждый новый лендинг отнимает у фронтенд-команды дни. Часто получается
не в фирменном стиле и собирается «из чего попало», а не из дизайн-системы.

**Что даёт Контент-завод Кайтен:**

- 🟢 **Бриф → лендинг за ~1 минуту.** Заполнили JSON (или форму) — получили работающую страницу в превью.
- 🟢 **Только наши компоненты.** LLM физически не может вставить «левый» блок — registry компонентов жёстко ограничен.
- 🟢 **Только domain-relevant mocks.** Для CRM-лендинга нельзя поставить PM-доску, для HR — карточку тикета. Защищено в 3 местах (matrix, validator, P5 gate).
- 🟢 **Авто-проверки на каждом шаге.** Бренд-voice, бизнес-правила, accessibility, визуал, domain-fit, cross-landing diversity. Если что-то не так — pipeline сам чинит и пробует снова (repair-loop, 3 attempts).
- 🟢 **Готово к проду.** Выход — TSX-файл, который проходит обычный PR-флоу, типизацию и визуальные тесты.
- 🟢 **Agent-mode по умолчанию.** Не нужны API-ключи: LLM = твой хост-агент (Claude Code / Codex / ChatGPT с file access).

---

## Как это работает (pipeline)

### 🏭 Этап 0 — фабрика ТЗ (intake), если brief'а ещё нет

Если на входе **сырые данные**, а не готовый `brief.json` — сначала прогони фабрику ТЗ
(методология Content Factory §18 + брендовый канон):

```bash
pnpm -w run harness agent intake landing --slug <slug> --request inputs/<slug>/request.md --inputs inputs/<slug>
# … хост-агент пишет .context/intake/<slug>/intake.json { tz, brief } …
pnpm -w run harness agent intake-apply landing --slug <slug>   # brief-quality (hard gate) → публикует brief + ТЗ.md
```

На выходе — `content/briefs/<slug>.json` (контракт пайплайна) и
`content/briefs/<slug>.tz.md` (человекочитаемое ТЗ для ревью на `/intake/<slug>`).
Дальше — обычный `agent build` (опционально с `--require-intake-approved`).

### 🚀 Единый entry point — `harness agent build`

Новый brief? Запусти `agent build`: гейт домена + конвейер сборки
автоматически. **Это рекомендуемый flow.**

```bash
pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json
```

### Routing decision — гейт домена (deterministic, без LLM)

```
                       brief.json
                            │
                            ▼
              ┌─────────────────────────┐
              │ routePipeline(brief)    │
              │ • resolveDomainFromBrief│
              │ • mock coverage check   │
              └────────────┬────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        🛑 manual-                  🔀 phased
        creation-required           (домен покрыт)
              │                         │
              ▼                         ▼
        STOP +                  orchestrator
        список mock'ов          P0..P8 + per-phase
        к созданию              repair-loop
```

### Два исхода routing

| Исход | Когда | Что происходит |
|---|---|---|
| 🛑 **manual-creation-required** | Домен НЕ покрыт mock-набором ИЛИ `unknown` | Pipeline **отказывается работать**. Выдаёт todo-список mock'ов. Сначала создай новые mocks, обнови matrix + registry + reference, потом повтори. |
| 🔀 **phased** | Домен покрыт | Orchestrator P0..P8 с per-phase repair-loop. Фазированный контроль качества для любого брифа. |

Логика в [`packages/harness/src/pipeline/route-pipeline.ts`](packages/harness/src/pipeline/route-pipeline.ts).

### Phased pipeline (9 фаз с per-phase gates)

Запускается автоматически, когда гейт домена пройден:

```
P0 Brief Normalize       (deterministic) → p0-brief-normalized.json
P1 Audience Intent        (LLM host-agent) → p1-audience-intent.json
P2 Layout Selection       (LLM + layout-awareness-fit) → p2-layout-decision.json
P3 Library Coverage Audit (deterministic, hard gate)   → p3-coverage-report.json
P4 Section Architect      (LLM + section-plan validators) → p4-section-plan.json
P5 Mock Allocation        (LLM + mock-semantic-fit)    → p5-mock-allocation.json
P6 Copy Generation        (LLM, заполняет копи в готовую структуру) → p6-spec-draft.json
P7 SEO + CTA Polish       (LLM + audience-score gate)  → p7-spec-final.json
P8 Illustration Allocation (для секций без mock'а — IllustrationSpec) → p8-illustration-allocation.json
→ Cross-Landing Diversity Audit → diversity-report.md
→ Render TSX → generated/landings/<slug>/page.tsx
```

Каждая фаза идемпотентна (rerun пропускает уже сделанные). При validation
failure — `<name>.repair.md` с конкретными ошибками + previous output +
counter attempts (max 3).

Полная документация фаз — [`wiki/pipeline/phase-gates.md`](wiki/pipeline/phase-gates.md).

### Финальный ingest — `agent apply`

После фаз P0..P8 спецификация проходит финальный пакет проверок и рендер:

```
content/landings/<slug>.json (написан в P6/P7)
          → apply (validators chain) → render TSX → preview
```

Validators chain на ingest:
- **Zod schema** — структура и длины
- **brand-voice deny-list** — hype-слова, штампы
- **business-rules** — hero-first, single-hero, CTA aligned, href shape
- **visual-diversity** — `default` >1, повтор variant'ов подряд
- **layout-conformance** — порядок секций vs `wiki/layouts/<slug>.md`
- **illustration-domain-match** — domain-fit (cross-domain reuse blocked)
- **audience-score gate** — story coverage, segment fit (threshold 70)
- **cross-landing-diversity** — структурное и семантическое сходство с другими лендингами

При errors — `--json` даёт structured output для repair-loop.

---

## Domain-mock matrix (что покрыто)

| Domain | Mocks | Reference |
|---|---|---|
| **PM** | 5 (pm-board, kb-internal, analytics-kpi, integrations-console, modules-matrix) | [`wiki/landings/kaiten-platform.md`](wiki/landings/kaiten-platform.md) |
| **Support** | 4 (support-board, request-card, kb-public, kb-internal) | [`wiki/landings/kaiten-techsupport-reference.md`](wiki/landings/kaiten-techsupport-reference.md) |
| **CRM** | 8 (sales-funnel, crm-client-card, omnichannel-inbox, call-overlay, crm-analytics, doc-template, mobile-crm, booking-calendar) | [`wiki/landings/crm-reference.md`](wiki/landings/crm-reference.md) |
| **HR** | 5 (hiring-pipeline, candidate-card, onboarding-checklist, org-chart, performance-review) | [`wiki/landings/hr-reference.md`](wiki/landings/hr-reference.md) |
| **Marketing** | 4 (campaign-dashboard, email-sequence, ab-test-results, audience-segments) | [`wiki/landings/marketing-reference.md`](wiki/landings/marketing-reference.md) |
| **BPM** | 3 (process-flowchart, approval-chain, sla-tracker) | [`wiki/landings/bpm-reference.md`](wiki/landings/bpm-reference.md) |
| **Finance** | 3 (ledger-view, invoice-status, reconciliation-matrix) | [`wiki/landings/finance-reference.md`](wiki/landings/finance-reference.md) |
| **E-commerce** | 3 (order-queue, inventory-grid, marketplace-connector) | [`wiki/landings/ecommerce-reference.md`](wiki/landings/ecommerce-reference.md) |

**Total: 8 покрытых доменов / 27 mocks** (+ 5 structural components: ComparisonTable, TimelineRoadmap, BentoGrid, LogoCloud, TestimonialQuote).

Главный rule-document: [`wiki/references/domain-mock-matrix.md`](wiki/references/domain-mock-matrix.md).
TypeScript-зеркало: [`packages/harness/src/registry/domain-visual.ts`](packages/harness/src/registry/domain-visual.ts).

Каталог всех reference docs: [`wiki/landings/index.md`](wiki/landings/index.md).

### Не покрыто (создавай при первом brief'е в домене)

Healthcare, Education, Legal и др. → `routePipeline` вернёт
`manual-creation-required` с инструкцией.

---

## Layouts (10 playbooks)

| Slug | Когда | Awareness |
|---|---|---|
| `enterprise-modular-saas` | Платформа + модули | solution-aware |
| `single-module-deep-dive` | Один модуль с прозрачным сценарием | problem-aware → solution-aware |
| `compliance-first-enterprise` | Реестр ПО, on-premise, госсектор | most-aware |
| `comparison-vs-competitor` | vs-страница (Jira / Notion / etc.) | product-aware |
| `story-led-unaware` | Cold-аудитория, нарратив | unaware → problem-aware |
| `depersonalized-product-tour` | Обезличенный SMB SaaS, длинный tour | problem-aware → solution-aware |
| `crm-product-tour` | CRM-multi-feature с tabs/scenario/picker | problem-aware → solution-aware |
| 🆕 `migration-from-competitor` | План перехода с конкретного конкурента | most-aware |
| 🆕 `product-launch` | Анонс нового продукта (awareness=0) | unaware → problem-aware |
| 🆕 `case-study-deep-dive` | Один кейс на всю страницу | product-aware → most-aware |

Каталог: [`wiki/layouts/index.md`](wiki/layouts/index.md).

---

## Качество — где оно зашито (8 контуров + 4 P-validators)

| Контур | Где живёт | Что ловит |
|---|---|---|
| **Структура** | `schemas/landing-spec.ts` (Zod) | Несуществующие компоненты, неверные props, длины строк |
| **Registry** | `registry/index.ts` | LLM видит только разрешённые компоненты (22 секционных) |
| **Brand voice** | `validators/landing-brand.ts` | Hype-слова, абсолютизмы, штампы (+ русские лозунги §9) |
| 🆕 **Language (англицизмы)** | `validators/landing-language.ts` | §10 англицизмы по словарю (soft по умолчанию, strict опц.); канбан/скрам кириллицей |
| 🆕 **Brief-quality** | `validators/brief-quality.ts` | Домен резолвится, тонкие поля, лозунги, needs_confirmation (hard gate на intake) |
| **Business rules** | `validators/landing-business.ts` | Hero first, footer last, single hero, href shape, CTA aligned |
| **Visual diversity** | `validators/landing-visual-diversity.ts` | `default` mediaVariant >1, повторы variant'ов подряд |
| **Layout conformance** | `validators/landing-layout-conformance.ts` | Порядок секций vs `wiki/layouts/<slug>.md` |
| 🆕 **Illustration domain-match** | `validators/illustration-domain-match.ts` | Cross-domain reuse (pm-board в CRM): hard error с suggestions |
| 🆕 **Cross-landing diversity** | `validators/cross-landing-diversity.ts` | Structural/semantic дубликаты, mock-overuse, copy-similarity |
| **Audience score** | `validators/landing-audience.ts` | Story coverage, segment fit (threshold 70) |
| **Illustration AST** | `validators/illustration-ast.ts` | SVG-правила (viewBox, no raster, a11y) |
| **Визуал** | `apps/web/tests/visual/landing.spec.ts` | Pixel-diff vs baseline (Playwright) |

### Phased pipeline post-validation hooks (4 P-validators)

| Validator | Phase | Что проверяет |
|---|---|---|
| 🆕 `layout-awareness-fit` | P2 | Layout совместим с awareness аудитории |
| 🆕 `section-plan-intent` | P4 | Каждая `mustCoverIntent` покрыта в секциях |
| 🆕 `section-plan-mock-choice` | P4 | Placeholder без rationale = error |
| 🆕 `mock-semantic-fit` | P5 | Каждый mock-variant входит в allowed для домена |

При validation failure — `<name>.repair.md` с конкретными ошибками + counter attempts (max 3, потом эскалация).

---

## Skills — плейбуки внутри LLM

| Skill | Где | Что внутри |
|---|---|---|
| 🆕 [`kaiten-intake`](.claude/skills/kaiten-intake/SKILL.md) | Claude Code skill | Фабрика ТЗ: сырьё → ТЗ + brief → пайплайн (`agent intake` → `intake-apply` → `build`) |
| [`kaiten-generate`](.claude/skills/kaiten-generate/SKILL.md) | Claude Code skill | E2E workflow: **Domain audit → agent build → routing → execute** |
| [`kaiten-review`](.claude/skills/kaiten-review/SKILL.md) | Claude Code skill | QA-цикл: validators chain + visual regression + /approve |
| [`design-system-kaiten-v01`](.claude/skills/design-system-kaiten-v01/SKILL.md) | Claude Code skill | Выжимка DS: цвета, типографика, сетка |
| [`conversion-landing.md`](packages/harness/src/skills/conversion-landing.md) | system prompt | 8 page types, awareness levels, hero/CTA правила, 100-балльный audit |
| [`section-mock-skill.md`](packages/harness/src/prompts/section-mock-skill.md) | system prompt | Правила mock-компонентов: §0 Domain fit, DS-tokens, lucide, density |
| [`svg-illustration-skill.md`](packages/harness/src/prompts/svg-illustration-skill.md) | system prompt | Правила SVG: dual light/dark, AST-validatable, domain realism |

---

## Быстрый старт (agent-mode, без API-ключей)

> Идея: Контент-завод Кайтен сам не вызывает внешнюю LLM. Он готовит prompt + JSON Schema, а
> **хост-агент (Claude Code, Codex, ChatGPT с file access) сам и есть LLM**. Поэтому
> никаких `.env.local` и API-ключей не нужно.

**Один раз:**

```bash
pnpm install                          # заодно включает git-гейты (.githooks/) через prepare
```

**Шаг 0 каждой сессии (любой агент):**

```bash
pnpm -w run harness agent context     # детект host-агента + горячий контекст + hard gates
```

Claude Code делает это автоматически SessionStart-хуком; Codex/Gemini/другие — вручную (контракт: [`AGENTS.md`](AGENTS.md)).

**1. Создать бриф** — скопируй `content/briefs/kaiten-factory.json` и поправь поля:

```json
{
  "product": "...",
  "audience": ["..."],
  "market": "B2B SaaS",
  "primaryGoal": "book_demo",
  "mainPain": "...",
  "mainPromise": "...",
  "proofPoints": ["...", "...", "..."],
  "tone": "clear, practical, confident, no hype",
  "cta": "Получить демо",
  "pageArchetype": "saas",
  "pageLayout": "enterprise-modular-saas"
}
```

Подсказка: чем полнее brief (явный `pageLayout`, `resolvedSegments`, ≥3 proof
points) — тем меньше работы фазам P1/P2 и тем быстрее пройдёт сборка.

**2. Entry point — `agent build`:**

```bash
pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json
```

Что произойдёт:
- 🛑 Если домен не покрыт → STOP с todo-списком mock'ов к созданию.
- 🔀 Если домен покрыт → запускается phased orchestrator P0..P8.

В любом случае — routing decision сохраняется в
`.context/pipeline/<slug>/route-decision.json` для трассировки.

**3. Host-agent (Claude Code / Codex) пишет artifact'ы.**

Skill [`kaiten-generate`](.claude/skills/kaiten-generate/SKILL.md) триггерится
автоматически. Скажи:

> «Сгенерируй лендинг по `content/briefs/<slug>.json`, slug `<slug>`».

Agent сам запустит `agent build`, прочитает prompt'ы, напишет spec / phase
artifacts, прогонит apply.

**4. Посмотреть в превью:**

```bash
pnpm dev
# → http://localhost:3000/landings/<slug>
```

**5. Cross-landing diversity check (опционально):**

```bash
pnpm -w run harness diversity audit --slug <slug> --brief content/briefs/<slug>.json
# → .context/pipeline/<slug>/diversity-report.md
```

**6. Visual regression:**

```bash
pnpm --filter @kaiten/web test:visual
```

**7. Approve.** Открой `http://localhost:3000/approve/<slug>` — форма с превью
в iframe и статусами. Состояние пишется в `content/approvals/<slug>.json`.

**8. Handoff для фронта:**

```bash
pnpm -w run harness handoff <slug> --require-approved
# → out/landing-<slug>.zip
```

> **Старый flow `harness generate landing` с внешним API-ключом** остаётся как
> fallback (если у команды есть Vercel AI Gateway / Anthropic / OpenAI ключ).

---

## Запуск под любым агентом (Codex CLI / Gemini / Cursor / …)

Пайплайн не привязан к Claude Code: ядро — обычный Node CLI, контракт описан в
[`AGENTS.md`](AGENTS.md) (Codex и большинство агентов читают его автоматически),
а жёсткие гейты работают на провайдер-нейтральных слоях.

**Codex CLI (GPT):**

```bash
cd <repo>
codex      # интерактивно: Codex сам прочитает AGENTS.md → выполнит шаг 0
# или non-interactive:
codex exec -C <repo> -s workspace-write \
  "Выполни шаг 0 из AGENTS.md, затем собери лендинг по content/briefs/<slug>.json (slug <slug>)"
```

**Любой другой агент / автодетект молчит:**

```bash
export HARNESS_AGENT=gemini           # codex | gemini | claude-code | <name>
pnpm -w run harness agent context
```

**Гейты без Claude-хуков.** Неизменяемость брифов и прочие жёсткие правила
enforced на трёх слоях: git pre-commit (`.githooks/`, включается сам при
`pnpm install`) + проверки в harness CLI (`agent build/apply/run/intake-apply`)
+ Claude-хуки (третий слой, только под Claude Code). Поведение идентично под
любой нейронкой; осознанный обход — `HARNESS_SKIP_GATES=1` / `--skip-gates`.

Подробный гайд: [`wiki/marketing/run-with-codex.md`](wiki/marketing/run-with-codex.md).
Опционально: MCP-сервер для Codex / Claude Desktop / Copilot —
[`packages/mcp-server/README.md`](packages/mcp-server/README.md).

---

## Все команды

```bash
# Установка и preview
pnpm install                                  # + активация git-гейтов (prepare → setup-githooks.mjs)
pnpm dev                                      # Next.js preview :3000
pnpm storybook                                # Storybook :6006

# === РИТУАЛ СЕССИИ (шаг 0, любой host-агент) ===
pnpm -w run harness agent context                           # детект агента + контекст + hard gates
pnpm -w run harness agent context --slug X                  # + сводка по slug (brief/spec/approval/pipeline)
pnpm -w run harness agent context --agent codex --full      # override детекта; полный вывод под Claude
pnpm -w run harness agent checklist                         # финальный чек-лист (паритет Stop-хука Claude)

# === ФАБРИКА ТЗ (intake): сырьё → ТЗ + brief ===
pnpm -w run harness agent intake landing --slug X --request inputs/X/request.md --inputs inputs/X
# … хост-агент пишет .context/intake/X/intake.json { tz, brief } …
pnpm -w run harness agent intake-apply landing --slug X     # brief-quality gate → content/briefs/X.json + X.tz.md
# ревью ТЗ: http://localhost:3000/intake/X

# === СБОРКА (рекомендуемый default): гейт домена + phased ===
pnpm -w run harness agent build landing --slug X --brief content/briefs/X.json
pnpm -w run harness agent build landing --slug X --brief Y.json --route-only        # только decision
pnpm -w run harness agent build landing --slug X --brief Y.json --require-intake-approved  # gate: ТЗ approved на /intake/X

# === PHASED PIPELINE (вручную, для отладки) ===
pnpm -w run harness agent run landing --slug X --brief content/briefs/X.json        # end-to-end P0..P8
pnpm -w run harness agent run-phase landing P4 --slug X --brief Y.json              # single-phase rerun

# === APPLY: финальные проверки + рендер ===
pnpm -w run harness agent apply landing --slug X --brief content/briefs/X.json
pnpm -w run harness agent apply landing --slug X --brief Y.json --strict-diversity  # hard cross-landing

# === DIVERSITY AUDIT (standalone) ===
pnpm -w run harness diversity audit --slug X --brief content/briefs/X.json
pnpm -w run harness diversity audit --slug X --strict                               # warnings → errors

# === AUDIENCE SCORE (без apply) ===
pnpm -w run harness agent score landing --slug X --brief content/briefs/X.json

# === HANDOFF ===
pnpm -w run harness handoff X                                                       # → out/landing-X.zip
pnpm -w run harness handoff X --require-approved

# === APPROVE ===
pnpm -w run harness approvals list                                                  # все approval'ы
pnpm -w run harness approvals status X                                              # JSON одной записи
pnpm -w run harness approvals check X...                                            # CI: exit≠0 если не approved
pnpm -w run harness approve X --baseline-ref <ref>                                  # CLI-approve + filing back

# === WIKI / LINT / LOG ===
pnpm -w run harness wiki sync                                                       # tokens.json → tokens.css
pnpm -w run harness wiki index                                                      # регенерация wiki/index.md
pnpm -w run harness lint                                                            # drift checks (вкл. agent-контракт)
pnpm -w run harness lint --scope agents                                             # только agent-контракт (strict в CI)
pnpm -w run harness ingest brief content/briefs/X.json                              # классификация
pnpm -w run harness ingest feedback X "<note>"                                      # reviewer note → wiki
pnpm -w run harness log -n 30 --filter generate                                     # последние записи

# === REGISTRY ===
pnpm -w run harness registry                                                        # component registry

# === ПРЯМАЯ ГЕНЕРАЦИЯ с API-ключом (опционально, fallback) ===
pnpm -w run harness generate landing --brief content/briefs/X.json --slug X
pnpm -w run harness validate X

# === ILLUSTRATIONS ===
pnpm -w run harness generate illustration --spec content/illustrations/<file>.json
pnpm -w run harness generate illustration --spec ... --no-llm                       # детерминированный stub
pnpm -w run harness generate illustration --spec ... --strict                       # упасть при провале AST

# === VISUAL REGRESSION ===
pnpm --filter @kaiten/web test:visual                                              # прогон против baseline
pnpm --filter @kaiten/web test:visual:update                                       # перебить baseline
```

---

## Структура репозитория

```
apps/web/                       Next.js 16 preview + API (generate, validate, handoff, approve, intake-ревью ТЗ)
packages/harness/               Ядро: schemas, registry, prompts, skills, pipeline, CLI, validators
  └── src/pipeline/             Pipeline:
      ├── route-pipeline.ts     🆕 Гейт домена (phased / manual-creation)
      ├── orchestrator.ts       🆕 Phased pipeline runner P0..P8
      ├── phases/               🆕 9 phase runners (P0..P8) + host-agent-phase + repair-loop
      ├── allocate-illustrations.ts  🆕 P8 illustration allocation + anti-duplication
      ├── repair.ts             Generic LLM repair-loop
      └── generate-*.ts         LLM generation по API-ключу (landing + illustration)
  └── src/registry/
      ├── domain-visual.ts      🆕 8-domain registry (TypeScript-зеркало domain-mock-matrix.md)
      └── global-illustration-usage.ts  🆕 Cross-landing tracking (content/illustrations/registry.json)
  └── src/validators/
      ├── illustration-domain-match.ts  🆕 Hard gate против cross-domain reuse
      ├── cross-landing-diversity.ts    🆕 Soft/hard cross-landing audit
      ├── section-plan-intent.ts        🆕 P4 gate: mustCoverIntent coverage
      ├── section-plan-mock-choice.ts   🆕 P4 gate: rationale для placeholder
      ├── mock-semantic-fit.ts          🆕 P5 gate: variant ∈ allowed для домена
      ├── layout-awareness-fit.ts       🆕 P2 gate: awareness compatible
      ├── landing-language.ts           🆕 §10 англицизмы (словарь anglicism-dictionary.json)
      ├── brief-quality.ts              🆕 Качество брифа (домен/поля/лозунги/needs_confirmation)
      └── landing-*.ts          Brand, business, visual-diversity, layout-conformance, audience
  └── src/agent/                🆕 prepare/ingest-intake + render-tz-markdown (фабрика ТЗ) + prepare/ingest-landing
  └── src/schemas/
      ├── landing-spec.ts       LandingSpec + 22 section schemas + 33 mock variants enum
      ├── brief.ts              + 10 pageLayout slugs
      ├── audience-intent-plan.ts       🆕 P1 output
      ├── layout-decision.ts            🆕 P2 output
      ├── coverage-report.ts            🆕 P3 output
      ├── section-plan.ts               🆕 P4 output
      ├── mock-allocation.ts            🆕 P5 output
      ├── diversity-report.ts           🆕 Final cross-landing audit
      └── intake-tz.ts                  🆕 ТЗ-схема (§18) для фабрики ТЗ
packages/ui/                    27 mocks + 22 components + primitives + tokens.css
  └── src/landing/mocks/        PM(5) + Support(4) + CRM(8) + HR(5) + Marketing(4) + BPM(3) + Finance(3) + Ecommerce(3) + MockVisual dispatcher
  └── src/landing/              14 базовых + 3 интерактивных + 5 structural (Comparison/Timeline/Bento/Logo/Testimonial)
content/briefs/                 Брифы маркетинга (+ <slug>.tz.md — ТЗ от фабрики ТЗ)
content/landings/               Сохранённые LandingSpec (regeneratable)
content/approvals/              Approval-статусы
content/illustrations/
  ├── registry.json             🆕 Cross-landing mock usage (auto-updated)
  └── domain-visual.registry.json   🆕 Snapshot DOMAIN_REGISTRY (для CLI inspector)
generated/landings/             Output TSX (regeneratable, руками не править)
design-system/kaiten-v01/       SSoT дизайн-системы
wiki/                           LLM-maintained знание
  ├── brand/
  │   └── redpolitika.md        🆕 Редполитика Kaiten — источник истины по тону/языку
  ├── references/
  │   ├── domain-mock-matrix.md     🆕 Источник правды по domain → mocks (rule-document)
  │   ├── kaiten-product-facts.md   🆕 Продуктовые факты/тарифы (источник истины)
  │   ├── anglicism-dictionary.{json,md}  🆕 Словарь §10 (читает landing-language)
  │   └── external-mock-references.md   Внешние эталоны (Linear, Stripe, Notion, …)
  ├── landings/
  │   ├── index.md              🆕 Каталог 8 domain references + production landings
  │   ├── crm-reference.md      Образец structure для domain reference
  │   ├── hr-reference.md       🆕
  │   ├── marketing-reference.md    🆕
  │   ├── bpm-reference.md      🆕
  │   ├── finance-reference.md  🆕
  │   └── ecommerce-reference.md    🆕
  ├── layouts/                  10 layout playbooks
  └── pipeline/
      └── phase-gates.md        🆕 Таблица hard/soft gates per phase
.claude/skills/                 Project-level Claude Code skills (kaiten-generate, kaiten-review, …)
.context/                       Workspace context (gitignored)
  └── pipeline/<slug>/          🆕 Phased pipeline artefacts (route-decision, p0..p8, repair, diversity)
out/                            Handoff ZIP пакеты (gitignored)
docs/                           Документация для команды
```

---

## Что нельзя сделать (защищено)

| Хочу… | Почему нельзя |
|---|---|
| Поставить `pm-board` в CRM-лендинге | 3 уровня защиты: matrix-rule, `illustration-domain-match` validator (hard error), `mock-semantic-fit` P5 gate |
| Сделать HR-лендинг без HR-mock'ов | `routePipeline` сразу вернёт `manual-creation-required` с todo-списком 5 нужных mock'ов |
| Запустить `agent build` для Healthcare brief'а | Domain не резолвится → `manual-creation-required` с инструкцией уточнить brief |
| Использовать `default` mediaVariant 3 раза подряд | `landing-visual-diversity` hard error |
| Сгенерировать 5 подряд CRM-лендингов с одинаковой структурой | `cross-landing-diversity` warning (с `--strict-diversity` → hard error) |
| Использовать неразрешённый компонент | Zod schema + registry — LLM физически не видит других компонентов |
| Hardcode'нуть цвет/радиус в UI | Design-tokens-only (см. `wiki/lessons.md` `ds-tokens-only-no-hardcoded-hex`) |
| Передать handoff без approval | `--require-approved` блокирует |

---

## Стек

- **Next.js 16** (App Router) — preview лендингов
- **Storybook 9** — registry компонентов и визуальный workshop
- **TailGrids v3** — закупленный набор landing-блоков (внутри `packages/ui/`)
- **Tailwind v4** — стили + tokens.css
- **Vercel AI SDK** — провайдер-агностичный LLM-слой (прямой flow с API-ключом: `harness generate`)
- **zod** — output contracts (LandingSpec, IllustrationSpec, BriefSchema, 6 phase schemas)
- **Playwright** — visual regression
- **pnpm workspaces** — монорепо

---

## Куда что класть

| Что | Куда |
|-----|------|
| API ключи (LLM) — опционально | `.env.local` (шаблон в `.env.example`) |
| Дизайн-система | `design-system/kaiten-v01/` |
| Новый бриф | `content/briefs/<slug>.json` |
| Новый компонент-секция | `packages/ui/src/landing/` + zod в `landing-spec.ts` + регистрация в `registry/index.ts` + case в `render-spec-react.tsx` |
| Новый mock-компонент | `packages/ui/src/landing/mocks/` + barrel + MockVisual switch + 3 enum'а в `landing-spec.ts` + DOMAIN_REGISTRY entry + matrix.md row + reference.md |
| Новый layout | `wiki/layouts/<slug>.md` + slug в `BriefSchema.pageLayout` + строка в `wiki/layouts/index.md` + поддержка в `layout-awareness-fit.ts` |
| Новый домен | matrix.md (раздел) → `DOMAIN_REGISTRY` (TypeScript) → `wiki/landings/<domain>-reference.md` |
| Новый skill / промпт | `packages/harness/src/skills/<name>.md` или `packages/harness/src/prompts/<name>.md` |
| Документация для команды | `docs/` |

---

## Правило обновления README

**README — это лицо проекта для команды маркетинга.** Любое изменение, которое
затрагивает то, что описано выше, обязано обновить README **в том же PR**.

Когда README **обязательно** трогать:

- Поменялся CLI (флаги, имена команд, новые подкоманды).
- Поменялась структура каталогов.
- Поменялись схемы (`LandingSpec`, `IllustrationSpec`, `BriefSchema`, phase schemas) — поля брифа в примере.
- Добавились / удалились env-переменные (`.env.example`).
- Поменялись шаги пайплайна или появилась новая стадия / phase.
- Добавился новый skill или изменилось поведение существующего.
- Добавился новый домен в `DOMAIN_REGISTRY` (нужна строка в domain-mock matrix таблице).
- Добавился новый layout (нужна строка в layouts таблице).
- Добавился новый validator (нужна строка в «Качество» таблице).

Это закреплено технически:

- **PR-шаблон** (`.github/pull_request_template.md`) содержит чек-лист «README обновлён?».
- **CI-проверка** `.github/workflows/readme-freshness.yml` — если PR трогает
  чувствительные пути (CLI / schemas / pipeline / structure / `.env.example`), но
  README не обновлён, бот оставляет комментарий и помечает проверку warning.

Не обходить эту проверку без явного «README не нужно» в описании PR.

---

## Глубже

- 📖 **[`docs/pipeline.md`](docs/pipeline.md)** — подробный разбор пайплайна для команды
- 📖 **[`wiki/pipeline/phase-gates.md`](wiki/pipeline/phase-gates.md)** — таблица hard/soft gates per phase
- 📖 **[`wiki/references/domain-mock-matrix.md`](wiki/references/domain-mock-matrix.md)** — главный rule-document по domain → mocks
- 📖 **[`wiki/landings/index.md`](wiki/landings/index.md)** — каталог 8 domain references
- 📖 **[`wiki/layouts/index.md`](wiki/layouts/index.md)** — каталог 10 layouts
- 📖 **[`wiki/lessons.md`](wiki/lessons.md)** — кумулятивные правила (с тегами `domain.*`, `phase.*`, `cross-landing.*`)
- 📖 **[`AGENTS.md`](AGENTS.md)** — конвенции для LLM-сессий
- 📖 **[`wiki/AGENTS.md`](wiki/AGENTS.md)** — правила работы с wiki
- 📖 **[`design-system/kaiten-v01/README.md`](design-system/kaiten-v01/README.md)** — дизайн-система
- 📖 **[`packages/harness/src/skills/conversion-landing.md`](packages/harness/src/skills/conversion-landing.md)** — конверсионный плейбук
- 📖 **[`packages/harness/src/prompts/section-mock-skill.md`](packages/harness/src/prompts/section-mock-skill.md)** — правила mock-компонентов
- 📖 **[`packages/harness/src/prompts/svg-illustration-skill.md`](packages/harness/src/prompts/svg-illustration-skill.md)** — правила SVG-иллюстраций
