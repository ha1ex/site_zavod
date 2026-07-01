---
slug: kaiten-finance
type: landing
created: 2026-07-01
updated: 2026-07-01
status: draft
brief: content/briefs/kaiten-finance.json
archetype: enterprise_landing
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
  - wiki/archetypes/enterprise_landing.md
  - packages/harness/src/skills/conversion-landing.md
  - packages/harness/src/prompts/section-mock-skill.md
  - wiki/layouts/enterprise-modular-saas.md
  - wiki/layouts/index.md
sections:
  - site_header
  - hero
  - benefits_strip
  - reviews
  - accordion_feature
  - media_copy
  - features
  - final_cta
  - features
  - features
  - process
  - kaiten_footer
generator: host-agent
durationMs: 0
tokenEstimate: 46193
tags:
  - landing
  - saas_landing
stale: false
---
# Landing summary

<!-- gen:spec-meta -->
- **slug:** `kaiten-finance`
- **brief:** `content/briefs/kaiten-finance.json`
- **archetype:** `enterprise_landing`
- **goal:** `try_free` (brief.cta = "Попробовать Кайтен")
- **sections used:** `site_header, hero, benefits_strip, reviews, accordion_feature, media_copy, features, final_cta, features, features, process, kaiten_footer`
- **token estimate:** `46193`
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
- `wiki/archetypes/enterprise_landing.md`
- `packages/harness/src/skills/conversion-landing.md`
- `packages/harness/src/prompts/section-mock-skill.md`
- `wiki/layouts/index.md`
<!-- /gen:spec-meta -->

## Sections

<!-- gen:sections-summary -->
### site_header (SiteHeader)


### hero (HeroSection)

- **title:** "Российский сервис для управления задачами в финансовом отделе"
- **subtitle:** "Отслеживайте статусы задач, контролируйте загрузку сотрудников и держите под контролем согласования. Данные хранятся в России — без риска блокировок и утечек." _(158/200 chars)_
- **primaryCta:** "Попробовать Кайтен" → `/signup`
- **secondaryCta:** "Запросить демонстрацию"
- **visual:** `product_screenshot` (assetId: `kaiten-finance-portfolio`)

### benefits_strip (BenefitsStrip)


### reviews (ReviewSlider)


### accordion_feature (AccordionFeatureSection)


### media_copy (MediaCopy)


### features (FeatureGrid)

- **title:** "Кайтен соответствует требованиям финансового сектора"
- **columns:** 4 · **items:** 4
  1. `Server` · "Установка на вашем сервере" — 144 chars
  2. `ShieldCheck` · "Реестр отечественного ПО" — 147 chars
  3. `KeyRound` · "Управление доступом" — 117 chars
  4. `History` · "История всех действий" — 137 chars

### final_cta (FinalCta)

- **title:** "Покажем, как Кайтен работает именно для вашей команды"
- **primaryCta:** "Попробовать Кайтен" → `/signup`

### features (FeatureGrid)

- **title:** "Кайтен работает для всей финансовой организации"
- **columns:** 3 · **items:** 5
  1. `Headphones` · "Отдел по работе с клиентами" — 178 chars
  2. `Code` · "ИТ-подразделение" — 164 chars
  3. `Scale` · "Юридический блок" — 103 chars
  4. `ClipboardCheck` · "Операционный блок" — 119 chars
  5. `Building2` · "Руководство" — 159 chars

### features (FeatureGrid)

- **title:** "Один инструмент вместо десятка сервисов"
- **columns:** 3 · **items:** 6
  1. `GanttChart` · "Гант и ресурсное планирование" — 131 chars
  2. `BarChart3` · "Автоматические отчёты и аналитика" — 130 chars
  3. `Zap` · "Автоматизации без программирования" — 121 chars
  4. `Sparkles` · "ИИ-ассистент" — 91 chars
  5. `MessageSquare` · "Чат и видеосвязь" — 100 chars
  6. `Smartphone` · "Мобильное приложение" — 116 chars

### process (ProcessSteps)


### kaiten_footer (LandingFooterMock)
<!-- /gen:sections-summary -->

## Audience score

<!-- gen:audience-score -->
# Audience score — `kaiten-finance`

- **Score:** 85.34 / 100 (threshold 70) — ✅ pass
- **Resolved segments:** Финансы, IT
- **CTA types detected:** Trial, Demo
- **Generated:** 2026-07-01T11:21:45.877Z

## Breakdown

| ID | Subscore | Raw | Weight | Weighted | Detail |
|---|---|---|---|---|---|
| S1 | Story coverage | 68.91 | 0.4 | 27.56 | top-6 stories: compare(w=0.98, c=0.30), migrate-jira(w=0.95, c=0.53), fast-check(w=0.94, c=1.00), security(w=0.88, c=0.65), ux-check(w=0.71, c=0.77), demo(w=0.70, c=1.00) |
| S2 | Segment fit | 100 | 0.3 | 30 | mentioned=2/2 [Финансы, IT] |
| S3 | Role addressability | 88.89 | 0.2 | 17.78 | PM=1.00, DM=1.00, ITDir=0.67 |
| S4 | CTA alignment | 100 | 0.1 | 10 | cta-types=[Trial,Demo], match=2/2 |

## Story coverage (top-N)

| Story | Weight | Covered | Status |
|---|---|---|---|
| compare — Хочу сравнить с тем, что уже есть | 0.98 | 0.3 | 🟡 partial — добавь ключевые слова или CTA story в копирайт |
| migrate-jira — Хочу понять, стоит ли переезжать с Jira | 0.95 | 0.53 | 🟡 partial — добавь ключевые слова или CTA story в копирайт |
| fast-check — Хочу быстро проверить, подойдёт ли нам | 0.94 | 1 | ✅ covered |
| security — Хочу понять ограничения и безопасность | 0.88 | 0.65 | ✅ covered |
| ux-check — Хочу проверить UX до решения | 0.71 | 0.77 | ✅ covered |
| demo — Хочу увидеть, как это работает на практике | 0.7 | 1 | ✅ covered |

## Issues

_None — все правила пройдены._

<!-- /gen:audience-score -->

## Lessons (LLM-extract)

_(extract предлагается через `harness ingest feedback`; правится руками)_

## Reviewer notes

_(заполняется через `harness ingest feedback <slug> "<note>"`)_

## History

