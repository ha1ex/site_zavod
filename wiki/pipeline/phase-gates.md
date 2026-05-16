---
slug: phase-gates
type: reference
created: 2026-05-16
updated: 2026-05-16
status: rule
related:
  - packages/harness/src/pipeline/orchestrator.ts
  - packages/harness/src/pipeline/phases/types.ts
  - wiki/references/domain-mock-matrix.md
tags:
  - pipeline
  - rules
  - phases
stale: false
---

# Phase gates — phased pipeline

> Phased pipeline (`packages/harness/src/pipeline/orchestrator.ts`) проходит
> 9 фаз P0..P8 последовательно. Каждая имеет hard/soft gate.

## Что такое phased pipeline

Замена one-shot LLM-генерации (где одна модель за один вызов решает audience,
layout, секции, копирайт, mock'и) на 9 узких фаз. Каждая фаза:

- решает одну задачу,
- имеет собственный schema (zod) и validator,
- пишет artifact в `.context/pipeline/<slug>/p{N}-*.json`,
- идемпотентна (повторный запуск пропускает уже сделанные фазы).

LLM-фазы (P1, P2, P4, P5, P6, P7, P8) работают в host-agent mode: эмитируют
prompt + schema в `p{N}-*.prompt.md`, host-LLM (Claude Code / Codex) пишет
ответный JSON, orchestrator валидирует и идёт дальше.

## Список фаз и gates

| Phase | Кто | Что делает | Gate | Hard / Soft |
|---|---|---|---|---|
| **P0** | deterministic | Brief normalize + резолв домена через `resolveDomainFromBrief` | `BriefSchema.parse` ok | **HARD** |
| **P1** | LLM (host-agent) | Audience Intent Analysis: сегменты, awareness, DM, stories, mustCoverIntents | `AudienceIntentPlanSchema` parse + ≥1 segment | **HARD** |
| **P2** | LLM (host-agent) | Layout Selection: layout + alternatives + requiredSectionOrder | `LayoutDecisionSchema` parse + layoutSlug exists | **HARD** |
| **P3** | deterministic | Library Coverage Audit: достаточно ли mock'ов для (domain, layout) | status ∈ {ok, enrich-recommended}. `domain-missing` / `enrich-required` блокируют | **HARD** |
| **P4** | LLM (host-agent) | Section Architect: структура секций без копирайта | `SectionPlanSchema` parse + (TODO) mustCoverIntent 100% covered | **HARD** |
| **P5** | LLM (host-agent) | Mock Allocation Refinement: финальный per-slot выбор mock-варианта | `MockAllocationSchema` parse + (TODO) mock-semantic-fit pass | **HARD** |
| **P6** | LLM (host-agent) | Copy Generation: полный LandingSpec с копи в готовую структуру | `LandingSpecSchema` parse + brand + business validators | **HARD** |
| **P7** | LLM (host-agent) | SEO + CTA Polish: SEO mentions + CTA labels alignment | `validateLandingAudience` ≥ threshold | **HARD** |
| **P8** | LLM (host-agent) | Illustration Allocation (M4 MVP): generate SVG для секций без mock'а | `IllustrationSpecSchema` parse | **HARD** (для AST) / **SOFT** (для palette match) |
| **Cross-landing** | deterministic | Diversity audit между лендингами | По умолчанию SOFT, `--strict-diversity` HARD | **SOFT / HARD** |

## Использование

```bash
# End-to-end orchestrator
pnpm -w run harness agent run landing --slug X --brief content/briefs/X.json

# Single-phase rerun (для debugging)
pnpm -w run harness agent run-phase landing P4 --slug X --brief content/briefs/X.json

# Standalone diversity audit
pnpm -w run harness diversity audit --slug X --brief content/briefs/X.json [--strict]
```

## Artefacts

Все артефакты пишутся в `.context/pipeline/<slug>/`:

```
.context/pipeline/<slug>/
  p0-brief-normalized.json         # NormalizedBrief (deterministic)
  p1-audience-intent.json          # AudienceIntentPlan (LLM)
  p1-audience-intent.prompt.md     # host-agent prompt
  p2-layout-decision.json          # LayoutDecision (LLM)
  p2-layout-decision.prompt.md
  p3-coverage-report.json          # CoverageReport (deterministic)
  p4-section-plan.json             # SectionPlan (LLM)
  p4-section-plan.prompt.md
  p5-mock-allocation.json          # MockAllocation (LLM)
  p5-mock-allocation.prompt.md
  p6-landing-spec-draft.json       # LandingSpec draft (LLM)
  p6-landing-spec-draft.prompt.md
  p7-landing-spec-final.json       # LandingSpec final (LLM)
  p7-landing-spec-final.prompt.md
  p8-illustration-allocation.json  # IllustrationAllocations (LLM)
  p8-illustration-allocation.prompt.md
  diversity-report.md              # cross-landing audit
```

## Идемпотентность

Orchestrator пропускает фазы, у которых artefact уже есть и проходит schema.
Для force-rerun — удали соответствующий `p{N}-*.json` файл.

## MVP vs полная реализация

Текущая версия (M2 MVP) реализует skeleton:
- P0, P3 — полностью deterministic
- P1, P2, P4, P5, P6, P7 — host-agent prompts с базовым task description
- P8 — placeholder (M4 расширит)

Полная реализация (после M3) добавит:
- Per-phase repair-loops с feedback
- Section-plan validators (section-plan-intent, section-plan-mock-choice)
- Mock semantic fit validator (P5 hard gate)
- Layout awareness fit (P2 hard gate)

## См. также

- `wiki/references/domain-mock-matrix.md` — источник правды для domain → mocks
- `wiki/layouts/index.md` — каталог layouts с per-slot mock-рекомендациями
- `wiki/audiences/kaiten-scoring.md` — scoring config для audience-intent (P1)
- `packages/harness/src/registry/domain-visual.ts` — TypeScript-зеркало matrix
- `packages/harness/src/validators/illustration-domain-match.ts` — hard gate против cross-domain reuse
- `packages/harness/src/validators/cross-landing-diversity.ts` — soft/hard diversity audit
