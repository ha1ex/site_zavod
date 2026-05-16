---
slug: ecommerce-reference
type: landing
created: 2026-05-16
updated: 2026-05-16
status: reference
sources:
  - packages/ui/src/landing/mocks/OrderQueueMock.tsx
  - packages/ui/src/landing/mocks/InventoryGridMock.tsx
  - packages/ui/src/landing/mocks/MarketplaceConnectorMock.tsx
related:
  - wiki/references/domain-mock-matrix.md
tags:
  - reference
  - landing
  - mock-ui
  - ecommerce
  - retail
stale: false
---

# E-commerce — internal reference

> Набор mock'ов для E-commerce / Retail operations лендингов (управление
> заказами с маркетплейсов, остатки, коннекторы Wildberries / Ozon / Я.Маркет).
>
> **Layout:** рекомендуется `crm-product-tour` (operations-heavy) или
> `enterprise-modular-saas` для крупных ритейлеров.

## Что отличает E-commerce-домен

| Аспект | CRM | E-commerce |
|---|---|---|
| Единица | Сделка B2B | Заказ B2C с SKU |
| Канал | Звонки / встречи | Wildberries / Ozon / Я.Маркет / сайт |
| Метрика | Выручка / конверсия | GMV / возвраты / остатки |
| Лексика | «Сделка · контакт-лицо» | «Заказ #48201 · ПВЗ 2841 · 3 ед.» |

## Состав mock'ов

| # | Mock | Variant slug | Используется в секциях |
|---|---|---|---|
| 1 | `OrderQueueMock` | `order-queue` | Hero, MediaCopy «Все заказы в одном окне», Tab «Заказы» |
| 2 | `InventoryGridMock` | `inventory-grid` | MediaCopy «Остатки по складам», Tab «Склад» |
| 3 | `MarketplaceConnectorMock` | `marketplace-connector` | MediaCopy «Подключение каналов», Scenario «Запуск нового маркетплейса» |

## Чек-лист domain-fit для E-commerce-лендинга

- [ ] Hero — `order-queue` со статусами доставки, не `sales-funnel` (это
      B2B-сделки) и не `support-board` (это тикеты).
- [ ] Остатки — `inventory-grid` с SKU × склады, не `analytics-kpi`.
- [ ] Каналы — `marketplace-connector` с Wildberries/Ozon, не
      `integrations-console` (там 1С/GitLab из Kaiten-домена).
- [ ] Лексика: «SKU», «остаток», «ПВЗ», «маркетплейс», «карточка товара»,
      «GMV», «возврат», «Wildberries / Ozon / Я.Маркет».
- [ ] Нет «лид/сделка/CPL» (CRM) и «спринт/эпик» (PM).
- [ ] Имена складов реалистичные: МСК/СПб/НСК или конкретные города.

## Связанные документы

- [`wiki/references/domain-mock-matrix.md`](../references/domain-mock-matrix.md)
- [`wiki/landings/crm-reference.md`](./crm-reference.md) — образец структуры
- [`packages/harness/src/prompts/section-mock-skill.md`](../../packages/harness/src/prompts/section-mock-skill.md)
