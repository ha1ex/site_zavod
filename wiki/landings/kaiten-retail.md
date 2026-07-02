---
slug: kaiten-retail
type: landing
created: 2026-07-02
updated: 2026-07-02
status: draft
brief: content/briefs/kaiten-retail.json
archetype: saas_landing
goal: try_free
sources:
  - wiki/brand/redpolitika.md
  - wiki/references/kaiten-product-facts.md
  - wiki/references/anglicism-dictionary.md
  - wiki/design-system/voice.md
  - wiki/design-system/colors.md
  - wiki/design-system/typography.md
  - wiki/design-system/spacing.md
  - wiki/design-system/radius.md
  - wiki/design-system/motion.md
  - wiki/design-system/grid.md
  - wiki/design-system/components/hero.md
  - wiki/design-system/components/feature-grid.md
  - wiki/design-system/components/pricing.md
  - wiki/design-system/components/faq.md
  - wiki/design-system/components/accordion.md
  - wiki/design-system/components/final-cta.md
  - wiki/design-system/components/footer.md
  - wiki/design-system/components/button.md
  - wiki/archetypes/saas_landing.md
  - packages/harness/src/skills/conversion-landing.md
  - packages/harness/src/prompts/section-mock-skill.md
  - wiki/layouts/index.md
sections:
  - site_header
  - hero
  - benefits_strip
  - reviews
  - accordion_feature
  - features
  - media_copy
  - media_copy
  - accordion_feature
  - features
  - features
  - media_copy
  - process
  - faq
  - final_cta
  - kaiten_footer
generator: host-agent
durationMs: 0
tokenEstimate: 46129
tags:
  - landing
  - saas_landing
stale: false
---
# Landing summary

<!-- gen:spec-meta -->
- **slug:** `kaiten-retail`
- **brief:** `content/briefs/kaiten-retail.json`
- **archetype:** `saas_landing`
- **goal:** `try_free` (brief.cta = "Попробовать бесплатно")
- **sections used:** `site_header, hero, benefits_strip, reviews, accordion_feature, features, media_copy, media_copy, accordion_feature, features, features, media_copy, process, faq, final_cta, kaiten_footer`
- **token estimate:** `46129`
- **generation duration:** `0ms`
- **generator:** `host-agent`

**Sources (использованы в системном промпте):**
- `wiki/brand/redpolitika.md`
- `wiki/references/kaiten-product-facts.md`
- `wiki/references/anglicism-dictionary.md`
- `wiki/design-system/voice.md`
- `wiki/design-system/colors.md`
- `wiki/design-system/typography.md`
- `wiki/design-system/spacing.md`
- `wiki/design-system/radius.md`
- `wiki/design-system/motion.md`
- `wiki/design-system/grid.md`
- `wiki/design-system/components/hero.md`
- `wiki/design-system/components/feature-grid.md`
- `wiki/design-system/components/pricing.md`
- `wiki/design-system/components/faq.md`
- `wiki/design-system/components/accordion.md`
- `wiki/design-system/components/final-cta.md`
- `wiki/design-system/components/footer.md`
- `wiki/design-system/components/button.md`
- `wiki/archetypes/saas_landing.md`
- `packages/harness/src/skills/conversion-landing.md`
- `packages/harness/src/prompts/section-mock-skill.md`
- `wiki/layouts/index.md`
<!-- /gen:spec-meta -->

## Sections

<!-- gen:sections-summary -->
### site_header (SiteHeader)


### hero (HeroSection)

- **title:** "Один инструмент для всей розничной сети: от магазина до головного офиса"
- **subtitle:** "Кайтен объединяет закупки, ИТ, маркетинг, склады и магазины в едином рабочем пространстве. Руководитель видит, что происходит в каждом магазине и направлении — без лишних переписок, звонков и ручных отчётов." _(207/200 chars)_
- **primaryCta:** "Попробовать бесплатно" → `/signup`
- **secondaryCta:** "Запросить демонстрацию"
- **visual:** `product_screenshot` (assetId: `kaiten-retail-portfolio`)

### benefits_strip (BenefitsStrip)


### reviews (ReviewSlider)


### accordion_feature (AccordionFeatureSection)


### features (FeatureGrid)

- **title:** "Закупки, ИТ, маркетинг и склады — в одном сервисе"
- **columns:** 3 · **items:** 6
  1. `Code` · "IT и разработка" — 121 chars
  2. `ShoppingCart` · "Закупки" — 167 chars
  3. `Megaphone` · "Маркетинг и PR" — 145 chars
  4. `Truck` · "Логистика и склады" — 114 chars
  5. `Scale` · "Юристы и бухгалтерия" — 126 chars
  6. `Store` · "Магазины и кураторы точек" — 122 chars

### media_copy (MediaCopy)


### media_copy (MediaCopy)


### accordion_feature (AccordionFeatureSection)


### features (FeatureGrid)

- **title:** "Регламенты и инструкции доступны из любого магазина"
- **columns:** 3 · **items:** 3
  1. `BookOpen` · "Регламенты и инструкции" — 65 chars
  2. `GraduationCap` · "Адаптация новичков" — 65 chars
  3. `FileText` · "Договоры и акты" — 76 chars

### features (FeatureGrid)

- **title:** "Отчёты собираются автоматически — без сведения вручную"
- **columns:** 3 · **items:** 3
  1. `Store` · "Что происходит по каждой точке?" — 70 chars
  2. `AlertTriangle` · "Где узкие места?" — 74 chars
  3. `Sparkles` · "Когда будет готово?" — 71 chars

### media_copy (MediaCopy)


### process (ProcessSteps)


### faq (FAQAccordion)

- **title:** "Ответы на частые вопросы"
- **items:** 8 Q&A
  1. "У нас 100+ магазинов и разные отделы — Кайтен справится с таким масштабом?" — answer 162/600 chars
  2. "Сколько времени занимает полное внедрение?" — answer 233/600 chars
  3. "Есть ли мобильное приложение для сотрудников в магазинах?" — answer 136/600 chars
  4. "Кайтен — российское ПО? Не потеряем доступ, как с зарубежными сервисами?" — answer 185/600 chars
  5. "Можно ли пользоваться Кайтеном бесплатно?" — answer 191/600 chars
  6. "Как перенести данные из Excel, Trello, Jira или Битрикс24?" — answer 157/600 chars
  7. "Можно ли дать подрядчикам и поставщикам доступ только к их задачам?" — answer 166/600 chars
  8. "Можно установить на серверы?" — answer 113/600 chars

### final_cta (FinalCta)

- **title:** "Управляйте ритейлом без хаоса в чатах, потерянных задач и ручных отчётов"
- **primaryCta:** "Попробовать бесплатно" → `/signup`

### kaiten_footer (LandingFooterMock)
<!-- /gen:sections-summary -->

## Audience score

<!-- gen:audience-score -->
# Audience score — `kaiten-retail`

- **Score:** 94.87 / 100 (threshold 70) — ✅ pass
- **Resolved segments:** Торговля, IT
- **CTA types detected:** Trial, Demo
- **Generated:** 2026-07-02T08:16:27.665Z

## Breakdown

| ID | Subscore | Raw | Weight | Weighted | Detail |
|---|---|---|---|---|---|
| S1 | Story coverage | 87.18 | 0.4 | 34.87 | top-6 stories: compare(w=0.98, c=0.82), migrate-jira(w=0.95, c=1.00), fast-check(w=0.94, c=1.00), ux-check(w=0.71, c=0.77), demo(w=0.70, c=1.00), sandbox(w=0.62, c=0.53) |
| S2 | Segment fit | 100 | 0.3 | 30 | mentioned=2/2 [Торговля, IT] |
| S3 | Role addressability | 100 | 0.2 | 20 | PM=1.00, DM=1.00 |
| S4 | CTA alignment | 100 | 0.1 | 10 | cta-types=[Trial,Demo], match=2/2 |

## Story coverage (top-N)

| Story | Weight | Covered | Status |
|---|---|---|---|
| compare — Хочу сравнить с тем, что уже есть | 0.98 | 0.83 | ✅ covered |
| migrate-jira — Хочу понять, стоит ли переезжать с Jira | 0.95 | 1 | ✅ covered |
| fast-check — Хочу быстро проверить, подойдёт ли нам | 0.94 | 1 | ✅ covered |
| ux-check — Хочу проверить UX до решения | 0.71 | 0.77 | ✅ covered |
| demo — Хочу увидеть, как это работает на практике | 0.7 | 1 | ✅ covered |
| sandbox — Хочу проверить, не сломаем ли мы всё | 0.62 | 0.53 | 🟡 partial — добавь ключевые слова или CTA story в копирайт |

## Issues

_None — все правила пройдены._

<!-- /gen:audience-score -->

## Lessons (LLM-extract)

_(extract предлагается через `harness ingest feedback`; правится руками)_

## Reviewer notes

_(заполняется через `harness ingest feedback <slug> "<note>"`)_

## History

