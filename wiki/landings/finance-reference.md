---
slug: finance-reference
type: landing
created: 2026-05-16
updated: 2026-05-16
status: reference
sources:
  - packages/ui/src/landing/mocks/LedgerViewMock.tsx
  - packages/ui/src/landing/mocks/InvoiceStatusMock.tsx
  - packages/ui/src/landing/mocks/ReconciliationMatrixMock.tsx
related:
  - wiki/references/domain-mock-matrix.md
tags:
  - reference
  - landing
  - mock-ui
  - finance
  - accounting
stale: false
---

# Finance — internal reference

> Набор mock'ов для Finance/Accounting/ERP лендингов.
> 3 компонента покрывают Hero + 2-3 секции (главная книга, дебиторка, сверка).
>
> **Layout:** рекомендуется `enterprise-modular-saas` или
> `compliance-first-enterprise` (Finance — обычно enterprise).

## Что отличает Finance-домен

| Аспект | CRM | BPM | Finance |
|---|---|---|---|
| Главный артефакт | Сделка | Процесс | Проводка / счёт / сверка |
| Метрика | Выручка / CPL | SLA / просрочка | Сальдо / расхождение / просрочка ДЗ |
| Лексика | «Сделка 1,2 млн ₽» | «Шаг 3 · SLA 3 дня» | «62.1 → 51 · 1 240 000 ₽», «Дебиторка просрочена 5 дн.» |
| Цвет-код | Воронка | SLA-зоны | Дебет/кредит, расхождения |

## Состав mock'ов

| # | Mock | Variant slug | Используется в секциях |
|---|---|---|---|
| 1 | `LedgerViewMock` | `ledger-view` | Hero, MediaCopy «Главная книга», Tab «Учёт» |
| 2 | `InvoiceStatusMock` | `invoice-status` | MediaCopy «Дебиторка», Scenario «Контроль просрочки» |
| 3 | `ReconciliationMatrixMock` | `reconciliation-matrix` | MediaCopy «Сверка с банком», Tab «Контроль» |

## Чек-лист domain-fit для Finance-лендинга

- [ ] Hero — `ledger-view` (главная книга), не `crm-analytics` (там выручка) и
      не `sla-tracker` (это BPM).
- [ ] Дебиторка — `invoice-status` с просрочкой, не `sales-funnel` (там
      воронка лидов, не оплат).
- [ ] Сверка — `reconciliation-matrix` с расхождениями, не `analytics-kpi`.
- [ ] Лексика: «проводка», «дебет/кредит», «сверка», «ДЗ/КЗ», «РСБУ/МСФО»,
      номера счетов «62.1 → 51».
- [ ] Нет «лид/сделка/CPL» — это CRM. Нет «спринт/эпик» — это PM.
- [ ] Суммы в рублях с разделителями («1 240 000 ₽»), не «$1.2M».

## Связанные документы

- [`wiki/references/domain-mock-matrix.md`](../references/domain-mock-matrix.md)
- [`wiki/landings/crm-reference.md`](./crm-reference.md) — образец структуры
- [`packages/harness/src/prompts/section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md)
