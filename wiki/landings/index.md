---
slug: landings-index
type: index
created: 2026-05-16
updated: 2026-05-16
sources:
  - wiki/references/domain-mock-matrix.md
related:
  - wiki/index.md
  - wiki/references/domain-mock-matrix.md
  - wiki/layouts/index.md
tags:
  - landings
  - reference
  - index
stale: false
---

# Landings — каталог

> Все собранные лендинги и domain-reference документы.
>
> **Сборка лендинга:** `pnpm -w run harness agent run landing --slug X --brief Y`
> (phased pipeline) либо legacy `agent prepare → write spec → agent apply`.
>
> **Перед сборкой:** обязательно сверься с
> [`wiki/references/domain-mock-matrix.md`](../references/domain-mock-matrix.md)
> — для какого домена этот лендинг и какие mock-варианты разрешены.

## Domain reference documents

Один reference на каждый покрытый домен — эталонный набор mock'ов и
чек-лист domain-fit. Используется как образец и как контрольная точка перед
сдачей лендинга.

| Domain | Reference | Mocks в наборе | Когда применять |
|---|---|---|---|
| **PM** | [`kaiten-platform.md`](./kaiten-platform.md) | 5 (pm-board, kb-internal, analytics-kpi, integrations-console, modules-matrix) | Jira-like, спринты, эпики, story points, команды разработки |
| **Support** | [`kaiten-techsupport-reference.md`](./kaiten-techsupport-reference.md) | 4 (support-board, request-card, kb-public, kb-internal) | Service Desk, обращения, SLA, чат с клиентом, FAQ |
| **CRM** | [`crm-reference.md`](./crm-reference.md) | 8 (sales-funnel, crm-client-card, omnichannel-inbox, call-overlay, crm-analytics, doc-template, mobile-crm, booking-calendar) | Воронка сделок, карточка клиента, омниканальность, выручка |
| **HR** | [`hr-reference.md`](./hr-reference.md) | 5 (hiring-pipeline, candidate-card, onboarding-checklist, org-chart, performance-review) | Найм, онбординг, performance, оргструктура, people-ops |
| **Marketing** | [`marketing-reference.md`](./marketing-reference.md) | 4 (campaign-dashboard, email-sequence, ab-test-results, audience-segments) | Marketing automation, growth, email-platform, кампании |
| **BPM** | [`bpm-reference.md`](./bpm-reference.md) | 3 (process-flowchart, approval-chain, sla-tracker) | Workflow automation, процессы, согласования, SLA |
| **Finance** | [`finance-reference.md`](./finance-reference.md) | 3 (ledger-view, invoice-status, reconciliation-matrix) | Бухгалтерия, ERP, дебиторка, сверка, P&L |
| **E-commerce** | [`ecommerce-reference.md`](./ecommerce-reference.md) | 3 (order-queue, inventory-grid, marketplace-connector) | Retail operations, маркетплейсы (Wildberries/Ozon), остатки |

**Total:** 8 покрытых доменов / 27 mocks (если считать
[`MockVariantSchema`](../../packages/harness/src/schemas/landing-spec.ts) — там
ещё есть 6 общих, итого 33).

## Готовые лендинги (production)

| Slug | Domain | Layout | Описание |
|---|---|---|---|
| [`kaiten-platform.md`](./kaiten-platform.md) | PM | `enterprise-modular-saas` | Главная страница платформы Кайтен (PM + KB + Поддержка + BPM + BI + AI) |
| [`kaiten-techsupport-reference.md`](./kaiten-techsupport-reference.md) | Support | `single-module-deep-dive` | Модуль техподдержки Кайтен — внутренний reference визуального качества |
| [`crm.md`](./crm.md) | CRM | `crm-product-tour` | Обезличенный CRM для SMB с tabs/scenario/picker |

## Тестовые и черновики

| Slug | Назначение |
|---|---|
| [`test-buffalo.md`](./test-buffalo.md) | Канонический smoke-тест pipeline (BuffaloHeroDashboard) |

## Воркфлоу для нового лендинга

1. **Domain audit** (см. [`.claude/skills/buffalo-generate/SKILL.md`](../../.claude/skills/buffalo-generate/SKILL.md)
   шаг 0):
   - Определи домен по `brief.product` + `brief.market`.
   - Сверь с [`domain-mock-matrix.md`](../references/domain-mock-matrix.md).
   - Если домен покрыт — продолжай к шагу 2.
   - Если нет (Finance/Ecommerce были такими — сейчас покрыты; следующий может
     быть Education / Healthcare) — STOP, создай 3-5 новых mocks по
     [`section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md),
     заведи новый reference doc по образцу [`crm-reference.md`](./crm-reference.md).
2. **Layout selection** — выбери layout из
   [`wiki/layouts/index.md`](../layouts/index.md) под awareness и сегмент.
3. **Запуск pipeline** — либо phased orchestrator
   (`harness agent run landing`), либо legacy
   (`harness agent prepare landing` → write spec → `agent apply`).
4. **Filing back** — успешные лендинги автоматически файлятся в
   `wiki/landings/<slug>.md` через `fileLandingToWiki`.
5. **Обновление каталога** — добавь строку в раздел «Готовые лендинги» этого
   файла.

## Связанные документы

- [`wiki/references/domain-mock-matrix.md`](../references/domain-mock-matrix.md)
  — главный rule-document по domain-fit.
- [`wiki/layouts/index.md`](../layouts/index.md) — каталог 10 layouts.
- [`wiki/pipeline/phase-gates.md`](../pipeline/phase-gates.md) — таблица
  hard/soft gates phased pipeline.
- [`packages/harness/src/prompts/section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md)
  — правила создания mock-компонентов (DS-tokens, lucide, realistic copy).
- [`packages/harness/src/prompts/svg-illustration-skill.md`](../../packages/harness/src/prompts/svg-illustration-skill.md)
  — правила SVG-иллюстраций (для P8 unique illustrations).
