---
slug: depersonalized-product-tour
type: layout
created: 2026-05-16
updated: 2026-05-16
related:
  - wiki/layouts/index.md
  - packages/harness/src/prompts/section-mock-skill.md
tags:
  - layout
  - saas
  - smb
  - product-tour
  - depersonalized
stale: false
---

# Layout — Depersonalized product tour (обезличенный CRM/SMB-SaaS)

## When to use

Обезличенный B2B SaaS-лендинг для малого и среднего бизнеса с длинным
функциональным туром. Применим, когда:

- Продукт нельзя брендировать конкретным именем компании (white-label, обзорный
  лендинг по ТЗ, материнский landing для агентств).
- ТЗ явно запрещает называть бренды, логотипы, узнаваемые формулировки —
  поэтому `SocialProof` с цитатами от компаний и `Pricing` с конкретными
  тарифами не подходят.
- Аудитория — владельцы SMB, РОПы, маркетологи, операционные директора;
  PLG-сценарий (try-free + demo), не enterprise sales-cycle.
- В продукте 8+ функциональных тем (база, каналы, телефония, бронирование,
  история, маркетинг, задачи, автоматизация, AI, документы, склад, мобайл,
  аналитика, интеграции, индустрии, внедрение), которые нужно показать
  компактным product tour'ом.

**Не использовать** для именованного продукта с reference base — бери
`enterprise-modular-saas`. Для глубокого нырка в один модуль — `single-module-deep-dive`.
Для compliance-first госсектора — `compliance-first-enterprise`.

## Audience & awareness

- **Awareness:** problem-aware → solution-aware. Аудитория знает, что у неё
  «теряются заявки» и «нет единой базы клиентов», но ещё не выбрала
  конкретный CRM.
- **Persona:** владелец SMB (10–200 сотрудников), руководитель отдела продаж
  / коммерческий директор, маркетолог, операционный директор, руководитель
  клиентского сервиса.
- **Боль:** заявки теряются между мессенджерами и таблицами; нет единой базы;
  менеджеры забывают перезвонить; руководитель не видит картину продаж.
- **Желание:** одна система, в которой собраны клиенты, сделки, задачи,
  коммуникации, документы и аналитика — без долгого внедрения.

## Section sequence (обязательный порядок)

| # | Section | Component | Mock-рекомендация | Опционально |
|---|---|---|---|---|
| 1 | Hero | `HeroSection` | `visual.variant: 'pm-board'` (воронка продаж как kanban) | — |
| 2 | Benefits strip | `BenefitsStrip` | — (3–4 коротких маркера: единая база, автоматизация, аналитика) | обязателен |
| 3 | Quick start | `MediaCopy` | `mediaVariant: 'modules-matrix'`, `mediaPosition: 'right'` (мастер настройки как grid модулей) | обязателен |
| 4 | Client base | `MediaCopy` | `mediaVariant: 'request-card'`, `mediaPosition: 'left'` (карточка клиента с вкладками) | обязателен |
| 5 | Channels + телефония | `MediaCopy` | `mediaVariant: 'integrations-console'`, `mediaPosition: 'right'` (лента событий из всех каналов) | обязателен |
| 6 | CTA banner | `CtaBanner` | — (после каналов — обязательное место CTA по ТЗ) | обязателен |
| 7 | History | `MediaCopy` | `mediaVariant: 'kb-internal'`, `mediaPosition: 'left'` (лента событий клиента как KB-статья) | обязателен |
| 8 | Automation + AI | `MediaCopy` | `mediaVariant: 'pm-board'` или `analytics-kpi`, `mediaPosition: 'right'` (роботы воронки / AI-подсказки) | обязателен |
| 9 | CTA banner | `CtaBanner` | — (после AI — обязательное место CTA по ТЗ) | опционально |
| 10 | Documents | `MediaCopy` | `mediaVariant: 'kb-public'`, `mediaPosition: 'left'` (документ как статья KB) | опционально |
| 11 | Analytics | `MediaCopy` | `mediaVariant: 'analytics-kpi'`, `mediaPosition: 'right'` (дашборд KPI) | обязателен |
| 12 | Features grid | `FeatureGrid` | — (8 карточек, lucide-иконки, 4 колонки) | обязателен |
| 13 | Industries | `FeatureGrid` | — (до 8 индустрий, 4 колонки) | обязателен |
| 14 | Process | `ProcessSteps` | — (6 шагов внедрения) | обязателен |
| 15 | Stats / promo | `StatStrip` или `PromoBanner` | — (обезличенный trust — «5 минут на старт», «8 каналов», «без разработчиков») | опционально |
| 16 | FAQ | `FAQAccordion` | — (8–10 вопросов с развёрнутыми ответами) | обязателен |
| 17 | Final CTA | `FinalCta` | — | обязателен |
| 18 | Footer | `LandingFooter` | — (4 колонки, обезличенный brandName) | обязателен |

**Альтернативы:**

- Если в продукте нет AI — Automation MediaCopy без упоминания AI, второй
  `CtaBanner` опускаем.
- Если нет документов — пропускаем слот Documents.
- Между MediaCopy и FeatureGrid можно вставить `StatStrip` с обезличенными
  trust-сигналами (число каналов, время запуска), но **никаких имён компаний**.

## Voice

- **Tone:** «практично, по делу, без хайпа». Никаких «революционный»,
  «единственный», «10x», «№1», «лучший» — все правила voice.md плюс ТЗ §8
  явно запрещает эти формулировки.
- Hero title — описательный (не слоган). Формула «{Глагол множ.} {объекты},
  {объекты} и {объекты}»: «CRM-система для управления продажами, клиентами и
  бизнес-процессами».
- Никаких брендов сторонних сервисов в копи (Bitrix, AmoCRM, Salesforce,
  Hubspot, Pipedrive, RetailCRM, Kaiten и т.д.) и никаких упоминаний реальных
  клиентов.

## Anti-patterns

- ❌ `SocialProof` с цитатами от брендов — обезличенный лендинг этого не
  допускает (ТЗ §1, §8). Если нужен trust — `StatStrip` или `PromoBanner` с
  обезличенными цифрами.
- ❌ `PricingPlans` с конкретными тарифами — ТЗ их не описывает; цена
  определяется бизнес-моделью продукта.
- ❌ Hero с `visual.variant: 'generic'` или `null` — нужен конкретный mock,
  иначе лендинг выглядит «голым».
- ❌ Одинаковый `mediaVariant` в двух соседних `MediaCopy` (validator
  `landing-visual-diversity` блокирует).
- ❌ Больше одного `MediaCopy` с `mediaVariant: 'default'` (validator
  блокирует).
- ❌ FeatureGrid из 2–3 карточек — для product tour нужно минимум 6–8.
- ❌ Длинные простыни текста в MediaCopy — описание ≤400 символов,
  чек-лист — 3–5 пунктов.

## Reference

- Внешние эталоны композиции: HubSpot CRM (product tour), Pipedrive (SMB
  focus), Monday CRM (длинный feature-tour без агрессивного pricing на главной).
- Внутренний эталон визуального качества mock'ов: `wiki/landings/kaiten-techsupport-reference.md`.
- Правила mock-компонентов: `packages/harness/src/prompts/section-mock-skill.md`.
