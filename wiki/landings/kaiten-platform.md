---
slug: kaiten-platform
type: landing
created: 2026-05-16
updated: 2026-05-16
status: draft
brief: content/briefs/kaiten-platform.json
archetype: saas_landing
goal: try_free
sources:
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
  - wiki/layouts/enterprise-modular-saas.md
sections:
  - hero
  - benefits_strip
  - social_proof
  - media_copy
  - media_copy
  - media_copy
  - stats
  - features
  - media_copy
  - media_copy
  - process
  - promo_banner
  - pricing
  - faq
  - final_cta
  - footer
generator: host-agent
durationMs: 0
tokenEstimate: 15165
tags:
  - landing
  - saas_landing
stale: false
---
# Landing summary

<!-- gen:spec-meta -->
- **slug:** `kaiten-platform`
- **brief:** `content/briefs/kaiten-platform.json`
- **archetype:** `saas_landing`
- **goal:** `try_free` (brief.cta = "Попробовать бесплатно")
- **sections used:** `hero, benefits_strip, social_proof, media_copy, media_copy, media_copy, stats, features, media_copy, media_copy, process, promo_banner, pricing, faq, final_cta, footer`
- **token estimate:** `15165`
- **generation duration:** `0ms`
- **generator:** `host-agent`

**Sources (использованы в системном промпте):**
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
- `wiki/layouts/enterprise-modular-saas.md`
- `wiki/layouts/index.md`
<!-- /gen:spec-meta -->

## Sections

<!-- gen:sections-summary -->
### hero (HeroSection)

- **title:** "Задачи, документы и процессы в одной системе"
- **subtitle:** "Глубокий project management, база знаний и сервисные модули по выбору. Российская юрисдикция, реестр отечественного ПО, on-premise по запросу — платите только за то, что нужно команде." _(184/200 chars)_
- **primaryCta:** "Попробовать бесплатно" → `/signup`
- **secondaryCta:** "Записаться на демо"
- **visual:** `product_screenshot` (assetId: `kaiten-pm-board`)

### benefits_strip (BenefitsStrip)


### social_proof (SocialProof)


### media_copy (MediaCopy)


### media_copy (MediaCopy)


### media_copy (MediaCopy)


### stats (StatStrip)


### features (FeatureGrid)

- **title:** "Всё, что нужно команде для системной работы"
- **columns:** 4 · **items:** 8
  1. `ListTodo` · "Задачи и проекты" — 79 chars
  2. `BookOpen` · "База знаний" — 70 chars
  3. `Headphones` · "Служба поддержки" — 79 chars
  4. `Workflow` · "Бизнес-процессы" — 77 chars
  5. `BarChart3` · "Аналитика и отчёты" — 71 chars
  6. `ShieldCheck` · "Безопасность и контур" — 64 chars
  7. `Plug` · "Интеграции" — 71 chars
  8. `Sparkles` · "AI-помощник" — 63 chars

### media_copy (MediaCopy)


### media_copy (MediaCopy)


### process (ProcessSteps)


### promo_banner (PromoBanner)


### pricing (PricingPlans)

- **title:** "Платите только за то, что нужно команде"
- **plans:** 3
  1. **Базовый** — 0 ₽ (4 features)
  2. **Стандарт** ⭐ — от 430 ₽/чел/мес (5 features)
  3. **Корпоративный** — По запросу (5 features)

### faq (FAQAccordion)

- **title:** "Что обычно спрашивают"
- **items:** 8 Q&A
  1. "Чем Кайтен отличается от Bitrix24?" — answer 294/600 chars
  2. "Кайтен подходит для замены Jira?" — answer 233/600 chars
  3. "Можно поставить Кайтен на свой сервер?" — answer 199/600 chars
  4. "Кайтен внесён в реестр отечественного ПО?" — answer 202/600 chars
  5. "Сколько стоит Кайтен и как работает модульная цена?" — answer 249/600 chars
  6. "Какие интеграции есть из коробки?" — answer 224/600 chars
  7. "Как быстро команда сможет начать работу?" — answer 215/600 chars
  8. "Что с поддержкой и обучением?" — answer 216/600 chars

### final_cta (FinalCta)

- **title:** "Соберите работу команды в одной системе"
- **primaryCta:** "Попробовать бесплатно" → `/signup`

### footer (LandingFooter)

- **brand:** "Кайтен"
- **columns:** 4
<!-- /gen:sections-summary -->

## Lessons (LLM-extract)

_(extract предлагается через `harness ingest feedback`; правится руками)_

## Reviewer notes

_(заполняется через `harness ingest feedback <slug> "<note>"`)_

## History



<!-- gen:audience-score -->
# Audience score — `kaiten-platform`

- **Score:** 87.06 / 100 (threshold 70) — ✅ pass
- **Resolved segments:** IT
- **CTA types detected:** Trial, Demo, Unknown, PDF
- **Generated:** 2026-05-16T05:33:14.581Z

## Breakdown

| ID | Subscore | Raw | Weight | Weighted | Detail |
|---|---|---|---|---|---|
| S1 | Story coverage | 80.14 | 0.4 | 32.06 | top-6 stories: compare(w=0.98, c=0.82), migrate-jira(w=0.95, c=1.00), fast-check(w=0.94, c=1.00), ux-check(w=0.71, c=0.53), sandbox(w=0.62, c=0.30), security(w=0.53, c=1.00) |
| S2 | Segment fit | 100 | 0.3 | 30 | mentioned=1/1 [IT] |
| S3 | Role addressability | 75 | 0.2 | 15 | PM=1.00, DM=0.50 |
| S4 | CTA alignment | 100 | 0.1 | 10 | cta-types=[Trial,Demo,Unknown,PDF], match=1/1 |

## Story coverage (top-N)

| Story | Weight | Covered | Status |
|---|---|---|---|
| compare — Хочу сравнить с тем, что уже есть | 0.98 | 0.83 | ✅ covered |
| migrate-jira — Хочу понять, стоит ли переезжать с Jira | 0.95 | 1 | ✅ covered |
| fast-check — Хочу быстро проверить, подойдёт ли нам | 0.94 | 1 | ✅ covered |
| ux-check — Хочу проверить UX до решения | 0.71 | 0.53 | 🟡 partial — добавь ключевые слова или CTA story в копирайт |
| sandbox — Хочу проверить, не сломаем ли мы всё | 0.62 | 0.3 | 🟡 partial — добавь ключевые слова или CTA story в копирайт |
| security — Хочу понять ограничения и безопасность | 0.53 | 1 | ✅ covered |

## Issues

_None — все правила пройдены._

<!-- /gen:audience-score -->
