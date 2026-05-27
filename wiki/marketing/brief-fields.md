# Brief — поля в `content/briefs/<slug>.json`

> Brief = «бриф маркетинга», структурированный JSON. Это вход для harness'а — чем точнее заполнен, тем меньше итераций исправления.

## Полный пример

```json
{
  "product": "CRM-система для управления продажами и клиентами",
  "audience": ["менеджеры по продажам", "руководители отдела продаж", "маркетологи"],
  "market": "B2B SaaS",
  "primaryGoal": "try_free",
  "mainPain": "Заявки теряются между почтой, мессенджерами и CRM, менеджеры забывают перезвонить",
  "mainPromise": "Все обращения в одной системе, автоматизация и контроль работы команды",
  "proofPoints": [
    "Сделки от первого контакта до повторной продажи",
    "8+ каналов коммуникации в одном интерфейсе",
    "AI-помощник анализирует звонки и подсказывает следующий шаг"
  ],
  "tone": "clear, professional, non-hype",
  "cta": "Попробовать бесплатно",
  "pageArchetype": "saas",
  "pageLayout": "crm-product-tour",
  "resolvedSegments": ["IT", "Агентства"]
}
```

---

## Поля по порядку

### `product` (string, required)

Короткое описание продукта одним предложением. Что это вообще.

✅ «CRM-система для управления продажами и клиентами»
✅ «Российская платформа управления работой команды»
❌ «Революционная AI-платформа нового поколения» (hype)
❌ «Это наша новая штука» (расплывчато)

### `audience` (string[], required, min 1)

Целевые роли/сегменты. Кто будет пользоваться. Не «все» — конкретные роли.

✅ `["менеджеры по продажам", "руководители отдела продаж"]`
✅ `["тимлиды разработки", "PM-команды", "руководители IT"]`
❌ `["все"]`
❌ `["компании"]` (не роль)

### `market` (string, required)

Рынок / сегмент. Используется для domain-резолва.

✅ `"B2B SaaS"`, `"B2C"`, `"Enterprise"`, `"Government"`

### `primaryGoal` (enum, required)

Главная конверсионная цель. Один из:

| Значение | Когда |
|---|---|
| `book_demo` | Демо с продавцом для enterprise |
| `signup` | Регистрация (PLG) |
| `waitlist` | Waitlist для нового продукта |
| `contact_sales` | Контакт с продавцами (сложные сделки) |
| `try_free` | Free trial |
| `download` | Скачать (mobile app, white paper) |

### `mainPain` (string, required)

Главная боль аудитории. Что мешает им сейчас. Конкретно, без AbStRaCt.

✅ «Заявки теряются между почтой, мессенджерами и CRM»
❌ «Низкая эффективность процессов»

### `mainPromise` (string, required)

Главное обещание продукта. Что вы дадите. Тоже конкретно.

✅ «Все обращения в одной системе, автоматизация и контроль работы команды»
❌ «Революционная трансформация бизнеса»

### `proofPoints` (string[], optional, default [])

Факты-доказательства для trust-секций. Цифры, сертификаты, кейсы. Чем конкретнее — тем сильнее.

✅ `["8+ каналов коммуникации", "Реестр отечественного ПО №14347", "500+ корпоративных клиентов"]`
❌ `["Лучший в мире", "Уникальный подход"]` (hype)

**Чем больше proofPoints (≥3) — тем меньше шанс уйти в phased pipeline** (расценивается как «brief детальный»).

### `tone` (string, default "clear, professional, non-hype")

Tone of voice. Описание словами. По умолчанию подойдёт большинству.

Примеры:
- `"clear, professional, non-hype"` (default)
- `"warm, conversational, customer-first"`
- `"technical, precise, no marketing fluff"`

### `cta` (string, required)

Основной CTA-текст (label кнопки). Согласован с `primaryGoal`.

✅ Для `try_free` → `"Попробовать бесплатно"`
✅ Для `book_demo` → `"Получить демо"`
✅ Для `waitlist` → `"Записаться в waitlist"`

### `pageArchetype` (enum, default `"saas"`)

Тип лендинга. Один из: `saas` / `waitlist` / `enterprise`.

### `pageLayout` (enum, **highly recommended**)

Готовый layout-плейбук. Если не указан — pipeline уйдёт в phased (дольше). Если указан — legacy (быстрее).

| Slug | Когда |
|---|---|
| `enterprise-modular-saas` | Платформа + модули (Kaiten-like) |
| `single-module-deep-dive` | Один модуль с прозрачным сценарием |
| `compliance-first-enterprise` | Реестр ПО, on-premise, госсектор |
| `comparison-vs-competitor` | vs-страница (vs Jira / Notion / etc.) |
| `story-led-unaware` | Холодная аудитория, нарратив |
| `depersonalized-product-tour` | SMB SaaS, длинный tour |
| `crm-product-tour` | CRM с tabs/scenario/picker |
| `migration-from-competitor` | План перехода с конкретного конкурента |
| `product-launch` | Анонс нового продукта (awareness=0) |
| `case-study-deep-dive` | Один кейс на всю страницу |

Полное описание каждого — в `wiki/layouts/<slug>.md`.

### `resolvedSegments` (string[], optional)

ID сегментов аудитории для **audience-score gate**. Заполняется, когда `audience` + `market` не дают lexical-match по [`wiki/audiences/kaiten-scoring.md`](../audiences/kaiten-scoring.md).

Если оставить пустым — pipeline сам попробует резолвить. Если не сможет — упадёт с маркером `audience-resolve-needed`, тогда нужно вернуться и заполнить вручную.

---

## Что НЕ нужно класть в brief

- ❌ Готовый текст лендинга (это не задача brief'а — это задача harness'а сгенерить).
- ❌ Список секций (это решает layout).
- ❌ Конкретные mock-варианты (выбирает harness P5 по mock-allocation).
- ❌ Цветовая палитра, шрифты (это дизайн-система, общая).
- ❌ Списки фич типа `features: ["fast", "secure"]` (это вывод, не вход).

---

## Где взять примеры

Готовые brief'ы лежат в [`content/briefs/`](../../content/briefs/):

- `buffalo.json` — минимальный пример самого harness'а
- `crm.json` — насыщенный B2B CRM
- `kaiten-platform.json` — enterprise platform с модулями

Можно скопировать любой и адаптировать.

---

## Подсказка: какие поля влияют на скорость

Pipeline считает «phased score» — если он ≥0.5, идёт phased flow (медленнее, но качественнее на сложных кейсах).

Что добавляет очки сложности (= идёт в phased):

| Сигнал | Очков |
|---|---|
| `resolvedSegments` пустой | 0.30 |
| `pageLayout` не задан | 0.25 |
| `product+pain+promise < 200 chars` | 0.20 |
| `primaryGoal` ∈ {`waitlist`, `contact_sales`, `download`} | 0.15 |
| `audience.length ≥ 3` | 0.10 |
| `proofPoints` пустой | 0.10 |

Хочешь быстро — задавай `pageLayout`, `resolvedSegments`, ≥3 proof points, и держи brief детальным.
