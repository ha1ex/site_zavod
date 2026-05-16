---
slug: story-led-unaware
type: layout
created: 2026-05-16
updated: 2026-05-16
related:
  - wiki/layouts/index.md
tags:
  - layout
  - story
  - unaware
  - cold-traffic
stale: false
---

# Layout — Story-led for unaware audience

## When to use

Лендинг для холодной аудитории, которая ещё не идентифицирует свою боль как
«нужна система управления работой». Применим, когда:

- Источник трафика — content marketing, top-funnel (статьи, видео, рассылки).
- Целевая аудитория — топ-менеджеры, собственники малого/среднего бизнеса,
  непрофильные специалисты («демократизация PM»).
- Главный барьер — инерция: «у нас Excel + Telegram + Google Docs и нормально
  всё работает».
- Цель — `book_demo` или `signup` для PLG-trial, но через эмоциональный путь,
  а не через спецификации.

**Не использовать** для product-aware и most-aware трафика (там быстрее
работает feature-first), для compliance / enterprise (там нужна
доказательность, не история).

## Audience & awareness

- **Awareness:** unaware → problem-aware. По ходу лендинга читатель должен
  осознать: «вообще-то у меня есть проблема».
- **Persona:** руководитель бизнес-юнита, собственник, тимлид без CTO-фона.
- **Боль:** не понимает, что разрозненный хаос — это решаемая проблема.
- **Желание:** проще, быстрее, без бесконечной переписки в чатиках.

## Section sequence (обязательный порядок — отличается от других layouts)

| # | Section | Component | Mock-рекомендация | Опционально |
|---|---|---|---|---|
| 1 | Hero | `HeroSection` | `visualPosition: 'below'`, `visual.variant: 'generic'` или mock, который иллюстрирует «как это выглядит» — но второстепенен. Главное — заголовок-вопрос или метафора | — |
| 2 | MediaCopy #1 — Problem Agitation (история) | `MediaCopy` | `mediaVariant: 'default'` (НЕ продуктовый UI, а нарративный визуал), `mediaPosition: 'right'` | обязателен — это «здесь живёт ваша боль» |
| 3 | MediaCopy #2 — Consequence (последствия инерции) | `MediaCopy` | без mock (`mediaVariant: 'default'` OR опустить mock-колонку) | обязателен |
| 4 | MediaCopy #3 — Solution intro (наш подход) | `MediaCopy` | `mediaVariant: 'pm-board'` или доменный mock, `mediaPosition: 'left'` | обязателен — здесь впервые показывается продукт |
| 5 | Social proof | `SocialProof` | — (3 кейса «таких же, как ты»: малый бизнес, средний, отрасль читателя) | обязателен |
| 6 | Features | `FeatureGrid` | — (3-4 ключевых outcomes, не feature-list, 3 колонки) | обязателен |
| 7 | Process | `ProcessSteps` | — (3 шага «как начать», максимум простые) | обязателен |
| 8 | FAQ | `FAQAccordion` | — (5-6 простых вопросов, отвечающих на унавернс-страхи: сложно ли, надо ли учиться, что если не получится) | обязателен |
| 9 | Final CTA | `FinalCta` | — | обязателен |
| 10 | Footer | `LandingFooter` | — | обязателен |

**Особенности:**
- Длина проще, чем у других layouts (10 секций vs 14-16).
- Mock-density ниже: 1 хороший продуктовый mock в MediaCopy #3, остальное —
  нарративные секции с тонкой визуальной поддержкой.
- `default` mediaVariant ДОПУСКАЕТСЯ в Problem Agitation и Consequence
  секциях (исключение из общего запрета — здесь продуктовый UI нерелевантен).

## Voice

- **Tone:** «человеческий, эмпатичный, без жаргона».
- Hero title — curiosity gap или метафора: «Каждый понедельник вы заново
  собираете, что было в пятницу», «Когда последний раз письмо не отвечало —
  ровно полтора дня назад».
- Subtitle — обещание простоты: «Соберите работу команды без таблиц,
  чатиков и Excel-кладбищ».
- Метафоры, истории, конкретные сцены работы — да. Технические термины
  («Kanban», «BPM», «SLA») — НЕТ или после первого упоминания с пояснением.

## Anti-patterns

- ❌ Feature-first hero («Kanban, Scrum, Gantt в одной системе») — для
  unaware-аудитории это китайская грамота.
- ❌ Pricing на лендинге. Для unaware цена убивает мотивацию до того, как
  возникнет интерес.
- ❌ Featured logos enterprise-уровня. Для small/mid аудитории «Газпромбанк»
  — это «не про меня». Нужны кейсы «таких же».
- ❌ Длинный FAQ с техническими вопросами. Только эмоциональные/practical
  («сложно?», «не сломается?»).
- ❌ 4+ MediaCopy с продуктовыми mocks. Перегружает, ломает нарратив.

## Reference

- Внутренний эталон: пока не реализован (planned: лендинг для блог-кампаний
  «как навести порядок в работе команды»).
- Внешний эталон: Basecamp (story-driven copy), Notion main (gentle
  introduction), Pitch (visual storytelling в hero).
