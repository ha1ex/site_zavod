---
slug: enterprise-modular-saas
type: layout
created: 2026-05-16
updated: 2026-05-16
related:
  - wiki/layouts/index.md
  - packages/harness/src/prompts/section-mock-skill.md
tags:
  - layout
  - saas
  - enterprise
  - modular
stale: false
---

# Layout — Enterprise modular SaaS

## When to use

Платформенный лендинг, где главное обещание — «ядро + модули, расширяемая
платформа». Применим, когда:

- Продукт состоит из 2+ функциональных модулей, которые подключаются по выбору.
- Аудитория — корпоративные ИТ-руководители, PMO, Operations-директора
  средних/крупных компаний.
- Есть reference base из 5+ узнаваемых брендов и/или госсектор.
- Есть тема импортозамещения, on-premise, реестра ПО — важно показать
  «enterprise-readiness» как часть value-prop, а не пост-факт.

**Не использовать** для одиночного модуля (бери `single-module-deep-dive`),
для vs-страниц (бери `comparison-vs-competitor`), для compliance-first
предложения в госсектор (бери `compliance-first-enterprise`).

## Audience & awareness

- **Awareness:** solution-aware. Аудитория знает, что им нужен PM-инструмент
  или платформа управления работой, сравнивает варианты.
- **Persona:** ИТ-директор (300+ сотрудников), руководитель PMO, Operations.
  Покупатель не сам пользуется ежедневно — он выбирает для команд.
- **Боль:** разрозненные инструменты (Excel + Telegram + ушедшая Jira +
  отдельный Confluence), невозможно собрать единую картину.
- **Желание:** одна платформа, в которую можно мигрировать без потери глубины
  и с возможностью расширения.

## Section sequence (обязательный порядок)

| # | Section | Component | Mock-рекомендация | Опционально |
|---|---|---|---|---|
| 1 | Hero | `HeroSection` | `visual.variant: 'pm-board'` (если PM-фокус) или `modules-matrix` (если про модульность) — выбирай по главному обещанию hero | — |
| 2 | Benefits strip | `BenefitsStrip` | — (4 коротких маркера: юрисдикция, on-premise, цена, интеграции) | можно убрать, если hero уже их перечисляет |
| 3 | Social proof | `SocialProof` | — (5-6 enterprise-брендов с цитатами и сегментом) | обязателен |
| 4 | MediaCopy #1 — ядро PM | `MediaCopy` | `mediaVariant: 'pm-board'`, `mediaPosition: 'right'` | обязателен |
| 5 | MediaCopy #2 — KB / документы | `MediaCopy` | `mediaVariant: 'kb-internal'` или `kb-public`, `mediaPosition: 'left'` | обязателен |
| 6 | MediaCopy #3 — расширение / модули | `MediaCopy` | `mediaVariant: 'modules-matrix'`, `mediaPosition: 'right'` | обязателен |
| 7 | Stats | `StatStrip` | — (4 цифры: лет на рынке, цена/чел, SLA, экономия vs зарубежные) | опционально |
| 8 | Features | `FeatureGrid` | — (6-8 модулей с lucide-иконками, 4 колонки) | обязателен |
| 9 | MediaCopy #4 — интеграции | `MediaCopy` | `mediaVariant: 'integrations-console'`, `mediaPosition: 'left'` | обязателен (фишка платформы) |
| 10 | MediaCopy #5 — аналитика для руководителя | `MediaCopy` | `mediaVariant: 'analytics-kpi'`, `mediaPosition: 'right'` | опционально (если для PMO-аудитории) |
| 11 | Process | `ProcessSteps` | — (4 шага запуска платформы) | опционально |
| 12 | Promo banner — compliance / реестр ПО | `PromoBanner` | — (`tone: 'soft'`) | обязателен (это enterprise-trust трюк) |
| 13 | Pricing | `PricingPlans` | — (3 тарифа, средний highlighted) | обязателен (модульная цена — value prop) |
| 14 | FAQ | `FAQAccordion` | — (6-8 вопросов: vs Bitrix, замена Jira, on-premise, реестр, цена, миграция, интеграции, обучение) | обязателен |
| 15 | Final CTA | `FinalCta` | — | обязателен |
| 16 | Footer | `LandingFooter` | — (4-5 колонок) | обязателен |

**Альтернативы:**
- Если у hero `visualPosition: 'below'` — mock получится крупнее, тогда в
  MediaCopy #1 можно опустить и сразу перейти к MediaCopy #2 (база знаний).
- Если нет 5+ enterprise-брендов — SocialProof со списком 3 + Stats со
  ссылкой «25 министерств / 5 банков из ТОП-10».

## Voice

- **Tone:** «практично, без хайпа, доказательства > обещаний».
- Hero title — описательный (не слоган). Формула «{Глагол множ.} {объект} {место}»: «Управляйте задачами, документами и процессами в одной платформе».
- Eyebrow — позиционирующий: «Российская платформа для…», «Корпоративная система для…».
- Никаких «революционный», «единственный», «10x» — все правила voice.md.

## Anti-patterns

- ❌ MediaCopy с `mediaVariant: 'default'` для всех трёх блоков подряд (это та самая ошибка, ради которой существует эта библиотека).
- ❌ Hero без `visual.variant` — должен быть конкретный mock, не fallback `generic`.
- ❌ Pricing без highlighted plan или с 4 одинаковыми (валидатор завалит).
- ❌ FAQ из 2-3 вопросов — лендинг enterprise-уровня требует развёрнутого FAQ для службы безопасности и закупок.
- ❌ Все 3 MediaCopy с одной `mediaPosition`. Минимум одна должна чередовать сторону.

## Reference

- Внутренний эталон: `wiki/landings/kaiten-platform.md` (когда пересоберём по этому layout).
- Внешний эталон композиции: Linear (sections rhythm), Stripe (proof перед features), Vercel (modular layout).
