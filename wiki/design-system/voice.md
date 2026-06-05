---
slug: ds-voice
type: design-system
created: 2026-05-15
updated: 2026-05-15
sources:
  - design-system/kaiten-v01/tokens.json
related:
  - wiki/design-system/typography.md
  - wiki/lessons.md
tags:
  - voice
  - brand
  - copywriting
stale: false
---

# Voice & Tone

Kaiten — **calm B2B/SaaS**. Tone: `clear, practical, confident, no hype`.

## Принципы

1. **Конкретика вместо superlatives.** Вместо «революционное решение» → «сократит cycle time с 2 месяцев до 2 недель».
2. **Outcomes, не features.** «AI-валидаторы» → «отлавливает 80% брендовых ошибок до review».
3. **Уважение к читателю.** Без CTA-крика, без false urgency.
4. **Русский язык без англицизмов.** Маркетинговая поверхность на русском (если brief не указывает иначе). Англицизмы с понятным русским аналогом — заменять (`landing`→страница, `CTA`→кнопка действия, `deadline`→срок). Полный словарь и исключения: `wiki/references/anglicism-dictionary.md` (§10). Технические термины (`pipeline` и пр.) — только в коде/служебных полях, не в копи. Источник истины по тону — `wiki/brand/redpolitika.md`.

## Denylist (запрещённые слова и обороты)

Эти слова блокируются валидатором `landing-brand` (см. `packages/harness/src/validators/landing-brand.ts` — _появится после merge ветки со stage-4_):

| Слово / оборот | Почему банится |
|---|---|
| `revolutionary` / `революционн*` | Hype без подтверждения. |
| `10x` / `10×` | Numeric exaggeration. |
| `AI magic` / `волшебство ИИ` | Magical thinking; обещаем результат, не магию. |
| `cutting-edge` / `прорывн*` / `передов*` | Marketing filler. |
| `magical` / `волшебн*` | См. выше. |
| `идеальн*` (как абсолют) | Абсолютизм; всегда есть trade-off. |
| `всег* решит*` / `everyone* needs` | Generalisation. |
| `unique` / `уникальн*` (без доказательства) | Требует proof. |
| `world-class` / `мирового уровня` | Хвастливо, без верификации. |
| `seamless` / `бесшовн*` | Hollow marketing word. |

## Allowed exceptions

- Цитата клиента — может содержать gushing language (это его слова, не наши).
- Tagline бренда (`brand.tagline` в LandingSpec) — снижение строгости (но не disable полностью).

## Forbidden patterns

- Все формы вопросов на CTA («Готовы попробовать?»). CTA — императив, единственная вещь: `Получить демо`, `Начать бесплатно`.
- Восклицательные знаки в копи (кроме error-states и emergency notifications).
- Каждая буква заглавная в заголовках (Title Case в EN — допустимо для CTA; в RU — нет).

## How to use

При генерации `LandingSpec` модель ОБЯЗАНА уважать этот файл. Валидатор `landing-brand` post-generate сканирует **все** строковые поля spec и flag'ит совпадения. При совпадении — repair loop предлагает пересформулировать конкретное поле.
