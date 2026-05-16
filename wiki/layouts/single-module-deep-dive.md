---
slug: single-module-deep-dive
type: layout
created: 2026-05-16
updated: 2026-05-16
related:
  - wiki/layouts/index.md
  - wiki/landings/kaiten-techsupport-reference.md
tags:
  - layout
  - saas
  - module
  - deep-dive
stale: false
---

# Layout — Single module deep dive

## When to use

Лендинг ОДНОГО продуктового модуля с прозрачным сценарием использования.
Применим, когда:

- Сегментный лендинг под конкретную функцию: служба поддержки, HR-служба,
  юр.отдел, разработка, маркетинг.
- Аудитория — руководитель этой функции (тимлид поддержки, HR-директор),
  который пришёл по продуктовому запросу.
- Можно показать конкретные сценарии: «заявка приходит → попадает на доску →
  команда отвечает → закрывается с оценкой».
- Эталон в репо: текущий `kaiten-support` лендинг.

**Не использовать** для общей платформы (`enterprise-modular-saas`), для
vs-страниц (`comparison-vs-competitor`).

## Audience & awareness

- **Awareness:** problem-aware → solution-aware. Знает, что задачи теряются в
  чатах, ищет «инструмент для X».
- **Persona:** тимлид/руководитель функции, который сам будет пользоваться
  системой каждый день. Решение принимает он же (mid-market) или после
  внутренней демки команде (enterprise).
- **Боль:** разрозненные каналы (почта + мессенджер + Excel), нет общей
  картины, не видно SLA, нет шаблонов ответов.
- **Желание:** один инструмент, в котором видно очередь, нагрузку,
  застрявшие задачи, и который запускается без интегратора.

## Section sequence (обязательный порядок)

| # | Section | Component | Mock-рекомендация | Опционально |
|---|---|---|---|---|
| 1 | Hero | `HeroSection` | `visual.variant: 'support-board'` (или соответствующий доменный mock для другого модуля); `visualPosition: 'below'` (крупный mock — главный аргумент) | — |
| 2 | Benefits strip | `BenefitsStrip` | — (4 ключевых фичи модуля одной строкой) | обязателен |
| 3 | Social proof | `SocialProof` | — (3 кейса с конкретным метрик-числом по этому модулю) | обязателен |
| 4 | MediaCopy #1 — главный workflow | `MediaCopy` | `mediaVariant: 'support-board'` (или доменный board), `mediaPosition: 'right'` | обязателен |
| 5 | MediaCopy #2 — деталь карточки/процесса | `MediaCopy` | `mediaVariant: 'request-card'`, `mediaPosition: 'left'` | обязателен |
| 6 | MediaCopy #3 — публичная сторона / база знаний | `MediaCopy` | `mediaVariant: 'kb-public'`, `mediaPosition: 'right'` | обязателен |
| 7 | MediaCopy #4 — внутренние документы / регламенты | `MediaCopy` | `mediaVariant: 'kb-internal'`, `mediaPosition: 'left'` | опционально |
| 8 | Promo banner — бонус «документы бесплатно» | `PromoBanner` | — (`tone: 'soft'`) | опционально (если есть оффер) |
| 9 | Metrics split — аналитика для руководителя | `MetricsSplit` | — (4 метрики + 4 буллета: где заявки, растёт ли нагрузка, кто перегружен, в SLA ли) | обязателен (это «зачем руководителю инструмент») |
| 10 | Process | `ProcessSteps` | — (4 шага запуска за день/30 минут) | обязателен |
| 11 | Features | `FeatureGrid` | — (8 возможностей, 4 колонки) | обязателен |
| 12 | FAQ | `FAQAccordion` | — (5-7 вопросов: бесплатно ли, миграция с Zendesk/Jira, on-premise, скорость запуска, шаблоны) | обязателен |
| 13 | Promo banner — финальный | `PromoBanner` | — (`tone: 'violet'`) | опционально, заменяет FinalCta для сильного акцента |
| 14 | Final CTA | `FinalCta` | — | обязателен (если нет promo banner финального) |
| 15 | Footer | `LandingFooter` | — | обязателен |

## Voice

- **Tone:** «практично, прикладно, без обещаний — описание того, как это
  работает».
- Hero title — формула «{сценарий} {без боли}»: «Служба поддержки без
  потерянных заявок и разбросанных чатов».
- Subtitle — конкретные источники/каналы/механика: «Принимайте обращения из
  почты, мессенджера и с портала на одной доске».
- Feature → benefit transformation обязательна: не «Telegram-бот», а
  «Клиенты пишут в Telegram → попадает на доску».

## Anti-patterns

- ❌ Hero без `visualPosition: 'below'` — для модульного лендинга крупный mock
  выше fold'а критичен.
- ❌ 5+ MediaCopy подряд (читатель устаёт): максимум 4, остальное — features /
  process / metrics-split.
- ❌ Pricing с несколькими тарифами на лендинге одного модуля. Если про цену —
  один promo banner / final cta «бесплатно начать», без таблицы тарифов.
- ❌ Универсальные кейсы вместо доменных. На лендинге службы поддержки кейсы
  должны быть про поддержку (235+ обращений / сотрудник), не «вообще про PM».

## Reference

- Внутренний эталон: `wiki/landings/kaiten-techsupport-reference.md` +
  `content/landings/kaiten-support.json`.
- Внешний эталон: Intercom (помощь + chat), Help Scout (KB intro).
