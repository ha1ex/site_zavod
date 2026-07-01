---
name: kaiten-generate
description: Run the Контент-завод Кайтен LLM harness end-to-end in agent-mode (no API keys — the host LLM is YOU). Turn a marketing brief into a Kaiten landing: agent build (гейт домена + phased P0–P8) → заполнение артефактов фаз → apply (validate + render TSX) → preview. Use when the user wants to generate, regenerate, or iterate on a landing for a brief; or when they reference Контент-завод Кайтен, a slug, a brief.json, or `pnpm -w run harness agent`.
---

# Контент-завод Кайтен — Generate landing in agent-mode

Use this skill whenever the user wants to assemble a Kaiten-style SaaS landing from a brief — phrases like "kaiten", "harness", "сгенерируй лендинг", "новый лендинг для X", or just hand you a brief JSON.

**Key idea (agent-mode):** the harness is API-key-free. It does NOT call any external LLM. You — the host agent — are the LLM. The CLI emits a prompt + JSON schema for you, you write the spec, the CLI validates & renders TSX.

## Trigger phrases

- "сгенерируй лендинг по [brief]"
- "новый лендинг для [продукт]"
- "kaiten generate [slug]"
- "regenerate landing [slug]"
- "harness landing [slug]"

## Preconditions

- Repo is the Контент-завод Кайтен monorepo (`pnpm-workspace.yaml` at root).
- `pnpm install` has been run once (заодно активирует git-гейты через `prepare`).
- Сессия начата с ритуала шага 0: `pnpm -w run harness agent context` (Claude Code: SessionStart-хук делает это сам; Codex/Gemini/другие — вручную, см. [`AGENTS.md`](../../../AGENTS.md)).
- **No API keys required.** Agent-mode works in any host (Claude Code, Codex, ChatGPT with file access).

## End-to-end flow

### 🚀 РЕКОМЕНДУЕМЫЙ способ — `harness agent build`

**Один entry point: гейт домена + phased pipeline.** Используй это как
default flow для нового brief'а.

```bash
pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json
```

Что произойдёт:

1. **`routePipeline(brief)`** — deterministic гейт домена:
   - Резолвит домен через `resolveDomainFromBrief` (lexical match по
     domain-mock-matrix aliases) и сверяет его с реестром покрытых доменов.
2. **Routing decision** — два исхода:
   - 🛑 **`manual-creation-required`** — домен НЕ покрыт mocks ИЛИ unknown.
     Pipeline ОТКАЗЫВАЕТСЯ, выдаёт todo-список mock'ов к созданию.
     Сначала создай новые mocks по [`section-mock-skill.md`](../../../packages/harness/src/prompts/section-mock-skill.md),
     обнови [`domain-mock-matrix.md`](../../../wiki/references/domain-mock-matrix.md)
     + `DOMAIN_REGISTRY`, заведи `wiki/landings/<domain>-reference.md`, потом
     повтори `agent build`.
   - 🔀 **`phased`** — домен покрыт. Запускает phased orchestrator P0..P8
     с per-phase repair-loop: фазированный контроль качества для любого брифа.
3. **Decision сохраняется** в `.context/pipeline/<slug>/route-decision.json`
   для трассировки и аудита.

Флаг для отладки:
- `--route-only` — только показать решение гейта, не запускать pipeline.

**Что не нужно делать вручную:**
- ❌ Запускать `run` / `run-phase` напрямую (это для отладки, не для
  default flow).
- ❌ Пропускать domain audit — `agent build` сам делает его в первую очередь.

### 0. Domain audit — ОБЯЗАТЕЛЬНО (первый шаг, не пропускать)

**Зачем.** Mock-компоненты в `packages/ui/src/landing/mocks/` доменно-специфичны:
`pm-board` показывает спринты и story points, `request-card` — карточку тикета
поддержки с чек-листом, `crm-client-card` — карточку CRM-сделки с компанией и
суммой. Reuse mock'а из чужого домена («pm-board для CRM, форма-то похожа»)
делает лендинг визуально неубедительным и противоречащим продукту. Это самый
частый блокер ревью.

**Что сделать:**

1. Открой [`wiki/references/domain-mock-matrix.md`](../../../wiki/references/domain-mock-matrix.md).
2. Определи домен продукта по `brief.product` + `brief.market`. Это может быть:
   - **Project Management** (Jira-like, спринты, эпики).
   - **Service Desk / Поддержка** (обращения, SLA, чат).
   - **CRM / Продажи** (воронка, клиенты, омниканальность, выручка).
   - **HR / Recruiting** (кандидаты, оффер, онбординг).
   - **Marketing automation** (кампании, A/B, email-цепочки).
   - **BPM / Workflow** (процесс, согласования, SLA).
   - **Finance / Accounting** (проводки, счета, сверка).
   - **E-commerce / Retail** (заказы, остатки, маркетплейсы).
   - Любой другой — фикси домен явно.
3. Проверь по матрице: есть ли набор mock'ов под этот домен?
   - **Если есть** (PM, Support, CRM сейчас) — переходи к шагу 1 (layout).
     В шаге 3a будешь выбирать variants из этого набора.
   - **Если нет** (HR, Marketing, BPM, Finance, E-commerce и др.) —
     **STOP. Не пиши spec, не пытайся подобрать «похожие» mock'и из чужого
     домена.** Опиши пользователю что нужно создать 5-8 доменно-специфичных
     mock'ов перед генерацией. Получи согласие и реализуй mock'и по
     [`section-mock-skill.md`](../../../packages/harness/src/prompts/section-mock-skill.md).
     После реализации — обнови `wiki/references/domain-mock-matrix.md`,
     заведи `wiki/landings/<domain>-reference.md` по образцу
     [`crm-reference.md`](../../../wiki/landings/crm-reference.md), потом
     возвращайся к шагу 1.
4. Запиши выбранный домен (и подходящий набор mock'ов) в свою TODO/scratchpad,
   чтобы на шаге 3a не переключиться на чужие.

**Признаки cross-domain reuse, который надо ловить ДО написания spec'а:**

- Hero бренда CRM с `visual.variant: 'pm-board'` или `'support-board'`.
- MediaCopy «карточка клиента» с `mediaVariant: 'request-card'` (это тикет
  поддержки, не клиент CRM).
- MediaCopy «омниканальные обращения» с `mediaVariant: 'integrations-console'`
  (это лента 1С/GitLab из Kaiten-домена, не inbox CRM).
- HR-лендинг с `pm-board` (kanban спринтов вместо kanban найма).
- Любая «семантически близкая» подмена под предлогом «форма похожа».

Все эти выборы — блокер ревью. См. примеры и анти-паттерны в
[`section-mock-skill.md §0`](../../../packages/harness/src/prompts/section-mock-skill.md#0-domain-fit--обязательная-проверка-до-выбора-mocка)
и [`domain-mock-matrix.md`](../../../wiki/references/domain-mock-matrix.md).

### 0a. Pick a layout from the library — ОБЯЗАТЕЛЬНО (кроме custom-режима)

> **⛔ Сначала проверь `brief.landingMode`.** Если `landingMode: "custom"` («1-в-1 по ТЗ») — **пропусти весь этот шаг**: layout НЕ выбирается (в т.ч. `enterprise-modular-saas`), `pageLayout` НЕ пиши, `landing-layout-conformance` выключен автоматически. Структуру и контент бери **строго из ТЗ** (`tz.landing_structure` + `tz.landing_copy`): порядок блоков и тексты 1-в-1, лишние секции (Pricing/FAQ/Promo и пр.), которых нет в ТЗ, НЕ добавляй. Переходи к §1. Всё ниже — только для `landingMode: "brief"`.

**Это первый шаг. Не пропускать.** Раньше у нас был один `pageArchetype: saas` с фиксированным порядком секций — это привело к проблеме «все лендинги одинаковые». Library of 5 layouts в [`wiki/layouts/`](../../../wiki/layouts/) покрывает основные сценарии.

1. Открой [`wiki/layouts/index.md`](../../../wiki/layouts/index.md) и сопоставь бриф с одним из 5 layouts:
   - `enterprise-modular-saas` — платформа с ядром + модулями (PM + KB + поддержка + …), B2B mid+enterprise, импортозамещение.
   - `single-module-deep-dive` — один модуль с прозрачным сценарием (поддержка, HR, BPM).
   - `compliance-first-enterprise` — фокус на безопасность, реестр ПО, on-premise, госсектор.
   - `comparison-vs-competitor` — vs-страница (миграция с Jira / Notion / Yandex.Трекер).
   - `story-led-unaware` — холодная аудитория, эмоциональный путь.
2. Открой `wiki/layouts/<slug>.md` и прочитай: when-to-use, audience, awareness, **обязательную последовательность секций с per-slot mock-рекомендациями**, anti-patterns.
3. Запиши выбор в `content/briefs/<slug>.json` поле `pageLayout: '<slug>'`. Это включит layout-плейбук в контекст фаз P2/P6 и активирует `landing-layout-conformance` валидатор.

**Если ни один layout не подходит:** не миксуй секции на лету. Опиши новый кейс пользователю → добавь шестой layout в `wiki/layouts/` по образцу существующих → потом собирай лендинг. Лучше потратить время на инфраструктуру, чем выпустить ещё один однотипный лендинг.

### 1. Lock the brief

Open `content/briefs/<slug>.json`. If it does not exist:

- Ask the user for: product, audience, market, primary goal (`book_demo` / `signup` / `waitlist` / `contact_sales` / `try_free` / `download`), main pain, main promise, 3 proof points, tone (default: "clear, practical, confident, no hype"), CTA label, `pageArchetype` (`saas` / `waitlist` / `enterprise`), **`pageLayout`** (slug из шага 0).
- Write the brief to `content/briefs/<slug>.json` matching `BriefSchema` from `@kaiten/harness/schemas`.

**Audience pre-resolve (optional but speeds up the gate):** если знаешь явно — какие сегменты из [`wiki/audiences/kaiten-scoring.md`](../../../wiki/audiences/kaiten-scoring.md) подходят к брифу — добавь `resolvedSegments: ["IT", ...]`. Если не уверен — оставь пустым, audience-score gate сам сделает lexical-match. Если match провалится — на шаге 4½ сделаешь audience research и впишешь.

### 2. Заполняй prompt'ы фаз (CLI emits them; no LLM call)

После `agent build` orchestrator идёт по фазам P0..P8. Deterministic-фазы
(P0, P3, P8-allocation) он делает сам; на каждой LLM-фазе останавливается со
status `awaiting-host-agent` и пишет prompt в
`.context/pipeline/<slug>/p<N>-*.prompt.md`. В prompt'е:

- **task** — задача фазы (аудитория → макет → структура → mock'и → копирайт → SEO/CTA → иллюстрации)
- **context** — артефакты предыдущих фаз
- **schema** — JSON Schema ожидаемого артефакта (the contract)
- **outputPath** — куда записать артефакт

Цикл: читай prompt → пиши артефакт → перезапускай `agent build` (идемпотентен,
готовые фазы пропускает) → следующая фаза. Schema — source of truth.

### 3. Generate the LandingSpec yourself (фазы P6–P7)

You are the LLM. From the brief + system prompt + layout playbook, write ONE JSON object matching `LandingSpec`. Constraints to remember:

- **Chrome (шапка/подвал) авторить НЕ нужно.** `agent apply` сам подставит статичную шапку kaiten.ru (`SiteHeader`) первой секцией и статичный подвал kaiten.ru (`LandingFooterMock`) — последней (нормализация `factory-chrome`). Любые `SiteHeader` / `LandingFooter` / `LandingFooterMock`, написанные вручную, отбрасываются; состав ссылок в подвале не сочиняется. **Начинай spec с `HeroSection`, заканчивай последним контентным блоком** — без header/footer.
- Твоя первая секция — `HeroSection` (после инъекции она станет второй, сразу за `SiteHeader`). Правило `hero-first` = «Hero сразу за шапкой».
- Exactly one `HeroSection`. At most one `FinalCta`. At most one `highlighted: true` plan.
- All `href` values start with `http(s)://`, `/`, or `#`.
- Primary CTA copy aligns with the brief's `cta` (or `primaryGoal`).
- Brand voice: no hype words ("revolutionary", "world-class", "game-changer", "next-generation", "cutting-edge", "best-in-class", "10x", "supercharge", "AI-powered" used as filler, …). Use clear, practical language.
- Title/subtitle/description length limits per the schema (e.g. title 4..80, subtitle 10..200).
- Follow `wiki/layouts/<slug>.md` table — порядок секций обязателен. Layout-conformance валидатор провалит spec, если порядок required секций нарушен.
- **Set `spec.meta.layout`** to the chosen layout slug (так apply сохранит его в досье и в дальнейших проверках).
- Доступные components для тела страницы (актуальный список см. `pnpm -w run harness registry`): `HeroSection`, `FeatureGrid`, `PricingPlans`, `FAQAccordion`, `FinalCta`, `SocialProof`, `ProcessSteps`, `CtaBanner`, `MediaCopy`, `StatStrip`, `PromoBanner`, `BenefitsStrip`, `MetricsSplit`, `TabbedFeatureSection`, `AccordionFeatureSection`, `ScenarioWalkthroughSection`, `IndustryPickerSection`, `ComparisonTable`, `TimelineRoadmap`, `BentoGrid`, `LogoCloud`, `TestimonialQuote`. Chrome (`SiteHeader`, `LandingFooterMock`) в тело не добавляй — он инъектируется автоматически.
- `AccordionFeatureSection` — заголовок + аккордеон фич слева + синхронный mock справа (+ опц. CTA). Вертикальная альтернатива `TabbedFeatureSection`; 3-5 фич, у каждой свой интерфейсный mock; каждый `items[].mockVariant` — из реестра mock'ов домена.
  - **⛔ OPT-IN, не выбирать по умолчанию.** Используй `AccordionFeatureSection` **только если тип блока явно указан в ТЗ** (`content/briefs/<slug>.tz.md` / intake-ТЗ). При генерации из **brief** или из **свободного запроса** (без ТЗ, где этот блок прописан) — **НЕ используй** его: разворачивай фичи обычными `MediaCopy` (или `TabbedFeatureSection`, если ТЗ просит табы). Правило: `accordion-only-if-tz`.

Write the JSON to `content/landings/<slug>.json` (это требование фазы P6; копия артефакта — в `.context/pipeline/<slug>/`).

### 3a. Mock authoring stage — ОБЯЗАТЕЛЬНО для каждой визуальной секции

**Архитектура:** mock'и — отдельные TSX-компоненты в [`packages/ui/src/landing/mocks/`](../../../packages/ui/src/landing/mocks/), с захардкоженными доменными данными. Spec выбирает mock через enum-поле — например, `HeroSection.visual.variant: 'sales-funnel'` (рендерит `<SalesFunnelMock />`), `MediaCopy.mediaVariant: 'crm-analytics'` и т.д.

**Domain-fit (повторно — потому что это самый частый блокер):** mock должен быть из домена продукта, заданного на шаге 0. Не подменяй mock'и из чужого домена под предлогом «форма похожа». Если на шаге 0 ты выяснил, что домена нет в матрице — ты уже должен был остановиться и создать набор; если всё-таки начал писать spec и обнаружил недостающий mock в процессе — останавливайся и создавай. Полная матрица доменов: [`wiki/references/domain-mock-matrix.md`](../../../wiki/references/domain-mock-matrix.md). Reference-наборы по доменам: PM — [`kaiten-platform.md`](../../../wiki/landings/kaiten-platform.md), Support — [`kaiten-techsupport-reference.md`](../../../wiki/landings/kaiten-techsupport-reference.md), CRM — [`crm-reference.md`](../../../wiki/landings/crm-reference.md).

**Эталон визуального качества** — внутренние reference-документы по домену (выше). Правила реализации mock'а — [`packages/harness/src/prompts/section-mock-skill.md`](../../../packages/harness/src/prompts/section-mock-skill.md) (грузится в системный промпт). Внешние эталоны для вдохновения — [`wiki/references/external-mock-references.md`](../../../wiki/references/external-mock-references.md).

**КРИТИЧЕСКИЕ ПРАВИЛА:**

- ❌ Cross-domain reuse: `pm-board` для CRM, `request-card` для CRM-клиента, `integrations-console` для CRM-каналов и т.п. — блокер ревью. См. §0 «Domain audit».
- ❌ `mediaVariant: 'default'` и `visual.variant: 'generic'` — это generic three-bar placeholder. Если ты ставишь его «потому что не нашёл подходящий» — ты создаёшь ту самую проблему, ради которой существует эта библиотека. Валидатор `landing-visual-diversity` блокирует:
  - Больше 1 MediaCopy с `default` на лендинг (исключение — нарративный `story-led-unaware` layout).
  - Одинаковый `mediaVariant` в 2+ MediaCopy подряд (нужно чередовать).
  - Hero `generic` без обоснования — warning, но фикси.

**Существующие mock-компоненты** (`packages/ui/src/landing/mocks/`), сгруппированные по доменам. Полный реестр и правила покрытия — [`wiki/references/domain-mock-matrix.md`](../../../wiki/references/domain-mock-matrix.md).

**Project Management (PM, спринты, эпики, story points):**

| Mock | Variant slug | Что иллюстрирует |
|---|---|---|
| `PmBoardMock` | `pm-board` | Канбан PM-команды с эпиками, story points, спринтами |
| `AnalyticsKpiMock` | `analytics-kpi` | Дашборд руководителя с 2×2 KPI + загрузка команд |
| `IntegrationsConsoleMock` | `integrations-console` | Лента событий из 1С/AmoCRM/Telegram/GitLab |
| `ModulesMatrixMock` | `modules-matrix` | Bento-grid модулей платформы (PM, KB, поддержка, BPM, BI, AI) |
| `KnowledgeBaseMock` | `kb-internal` | Внутренний регламент команды |

**Service Desk / Поддержка:**

| Mock | Variant slug | Что иллюстрирует |
|---|---|---|
| `SupportBoardMock` | `support-board` | Канбан-доска заявок поддержки (Очередь / В работе / Готовлю ответ / Готово) |
| `RequestCardMock` | `request-card` | Карточка тикета поддержки с чатом клиент/агент + чек-листом действий |
| `KnowledgeBaseMock` | `kb-public` | Публичная статья базы знаний для клиентов |

**CRM / Продажи:**

| Mock | Variant slug | Что иллюстрирует |
|---|---|---|
| `SalesFunnelMock` | `sales-funnel` | Воронка сделок: Лид → Квалификация → Договор → Оплата, в карточке компания, сумма ₽, контакт, дата шага |
| `CrmClientCardMock` | `crm-client-card` | Карточка клиента CRM: табы Профиль/Сделки/История/Документы/Задачи, активная сделка, таймлайн событий |
| `OmnichannelInboxMock` | `omnichannel-inbox` | Единый inbox обращений из звонков/Telegram/чата/почты/WhatsApp с цвет-кодом канала |
| `CallOverlayMock` | `call-overlay` | Окно входящего звонка поверх карточки клиента: таймер, скрипт продаж, заметка |
| `CrmAnalyticsMock` | `crm-analytics` | Дашборд CRM: выручка, конверсия в оплату, CPL, длина сделки, воронка, источники лидов |
| `DocTemplateMock` | `doc-template` | Счёт с автоподстановкой полей клиента и статусом Сформирован → Просмотрен → Оплачен |
| `BookingCalendarMock` | `booking-calendar` | Онлайн-запись: сетка специалисты × часы, выбранный слот, подтверждение |
| `MobileCrmMock` | `mobile-crm` | Мобильное приложение CRM: KPI дня, активные сделки, нижняя таб-навигация, FAB |

**Других доменов в библиотеке пока нет** (HR, Marketing, BPM, Finance, E-commerce). Если бриф ведёт в новый домен — реализуй набор перед написанием spec'а (см. §0 «Domain audit»).

**Алгоритм (для каждой секции отдельно):**

1. Проверь домен (шаг 0): определил ли ты домен продукта? Какой набор mock'ов используем?
2. Открой layout-плейбук — там для каждой секции есть колонка «Mock-рекомендация» с конкретным slug-ом. Это default-выбор **внутри домена**.
3. Если рекомендация подходит по смыслу контента **и совпадает с доменом** — используй её.
4. Если контент брифа сильно отличается от того, что показывает mock — выбери другой existing variant **из того же домена** (см. таблицу выше). НЕ берись за чужой домен (например, `pm-board` в CRM-лендинге, `request-card` в HR-лендинге).
5. Если ни один из mock'ов **в домене** не подходит — НЕ ставь `default`, НЕ берись за чужой домен. Останови spec, опиши пользователю что нужен новый mock, создай его по [`section-mock-skill.md`](../../../packages/harness/src/prompts/section-mock-skill.md):
   - `<Name>Mock.tsx` в `packages/ui/src/landing/mocks/`
   - Хардкод доменных данных из брифа
   - Прогон через чек-лист §4
   - Расширить enum в `landing-spec.ts` (`AssetRefSchema.variant`, `MediaCopy.mediaVariant`, `MockVariantSchema`)
   - Подключить case в `HeroSection` HeroVisual / `MediaCopy` dispatcher / общий `MockVisual`
   - Обновить registry description
   - Добавить строку в `wiki/references/domain-mock-matrix.md` для своего домена
6. После создания нового mock'а — возвращайся к spec и используй его.

**Это допустимо.** Лучше потратить 30 минут на новый mock-компонент, чем оставить лендинг с тремя `default` placeholder'ами.

**Пример spec-фрагмента — Hero с PmBoardMock:**

```json
{
  "id": "hero",
  "component": "HeroSection",
  "props": {
    "eyebrow": "Российская платформа управления работой",
    "title": "Задачи, документы и процессы в одной платформе",
    "accentWord": "одной",
    "subtitle": "Глубокий PM, база знаний, сервисные модули — в едином контуре.",
    "primaryCta": { "label": "Попробовать бесплатно", "href": "/signup" },
    "secondaryCta": { "label": "Записаться на демо", "href": "/demo" },
    "visual": {
      "type": "product_screenshot",
      "assetId": "kaiten-pm-board",
      "variant": "pm-board"
    },
    "visualPosition": "below"
  }
}
```

**Пример MediaCopy с уникальными mock'ами в трёх секциях подряд (для enterprise-modular-saas):**

```json
[
  { "id": "media_copy", "component": "MediaCopy", "props": { "title": "Ядро PM", "mediaVariant": "pm-board", "mediaPosition": "right", "...": "..." }},
  { "id": "media_copy", "component": "MediaCopy", "props": { "title": "База знаний", "mediaVariant": "kb-internal", "mediaPosition": "left", "...": "..." }},
  { "id": "media_copy", "component": "MediaCopy", "props": { "title": "Модули", "mediaVariant": "modules-matrix", "mediaPosition": "right", "...": "..." }}
]
```

Если для секции mock реально не нужен (FAQ, footer, BenefitsStrip) — просто не используй секцию с mock-slot'ом. НЕ ставь `default` ради заполнения слота.

### 4. Apply (validate + render TSX) — deterministic, no LLM

```bash
pnpm -w run harness agent apply landing \
  --slug <slug> \
  --brief content/briefs/<slug>.json
```

This will:

1. Parse the spec against `LandingSpecSchema` (zod).
2. Run brand-voice deny-list + business-rules validators.
3. **Run `landing-visual-diversity` validator** — блокирует `default` >1, collision variant'ов подряд.
4. **Run `landing-layout-conformance` validator** — если задан `pageLayout`, проверяет порядок required секций.
5. Run audience-score gate (см. 4½).
6. Enrich `spec.meta` (sources, archetype, layout, generator: "host-agent", generatedAt).
7. Render TSX to `generated/landings/<slug>/page.tsx`.
8. File back to `wiki/landings/<slug>.md`.

On success, you get the preview URL.

### 4½. Audience-score gate (новое — обязательно)

После того как brand + business валидаторы прошли и TSX отрендерен, `agent apply` **автоматически** прогоняет audience-score gate из `wiki/audiences/kaiten-scoring.json`. Это последний барьер перед preview.

**Что считается:**

- `S1 Story coverage (×0.4)` — закрыты ли top-N user stories (Score ≥ 87 — must-have; см. `wiki/audiences/kaiten-scoring.md`).
- `S2 Segment fit (×0.3)` — упоминаются ли резолвленные сегменты в hero/features/FAQ.
- `S3 Role addressability (×0.2)` — Тимлид/PM и ЛПР закрыты явно; для финансов/госа — плюс IT-директор (on-prem/ГОСТ).
- `S4 CTA alignment (×0.1)` — CTA соответствуют preferred типу сегмента (Trial для PLG-сегментов, Demo для Sales-Enable).

**Гейт по умолчанию:** `score ≥ 70` И все must-pass правила green. Если нет — `agent apply` exits с error, отчёт пишется в:

- `.context/audience-score/<slug>.{json,md}` (детально, по каждой story / роли / правилу)
- секцию `## Audience score` в `wiki/landings/<slug>.md` (часть досье)

**Что делать при `audience-resolve-needed`:**

Этот маркер появляется, когда в brief.audience/market нет ни одного известного сегмента из scoring-конфига. Тогда:

1. Сделай короткий audience-research для темы брифа: «кто типично использует продукт такого типа, кто принимает решение». РФ/СНГ — в первую очередь, мир — во вторую.
2. Запиши результат в `content/briefs/<slug>.json` в поле `resolvedSegments` (массив id из `wiki/audiences/kaiten-scoring.md`, напр. `["IT", "Агентства"]`).
3. По желанию — заведи `wiki/audiences/<slug>.md` с обоснованием выбора (аудит-след).
4. Запусти apply снова — теперь scoring сразу попадёт.

**Что делать при `score < threshold` или must-pass fail:**

Прочитай `.context/audience-score/<slug>.md` — там для каждой непокрытой story есть suggestion со списком ключевых слов и типом контента, которого не хватает. Правь `content/landings/<slug>.json` точечно: добавляй секции/копи/CTA по подсказкам. Repeat apply.

**Бюджет:** до 3 итераций аудиенс-исправлений (как brand/business). Если за 3 итерации не сошлось — сообщи пользователю, не пытайся бесконечно.

**Эскейп-хатч:** `agent apply landing --no-audience-gate` отключает гейт целиком (для отладки, не для регулярного использования). `--audience-threshold 60` — мягче порог.

**Пересчитать score без апплая:** `agent score landing --slug <slug> --brief <path>`.

### 5. Repair loop (still no LLM call)

If apply returns errors (brand / business / audience), the CLI lists them per-section. Use `--json` to get machine-readable output:

```bash
pnpm -w run harness agent apply landing --slug <slug> --brief content/briefs/<slug>.json --json
```

Edit `content/landings/<slug>.json` to fix each error, then re-run apply. Repeat until ok. Budget: up to 3 iterations. If still failing, ask the user.

### 6. Preview

```bash
pnpm dev
```

Open `http://localhost:3000/landings/<slug>`. Verify visually.

### 7. Handoff (optional)

```bash
pnpm -w run harness handoff <slug>
```

Self-contained ZIP for the frontend team.

## Important

- **Never use `harness generate landing`** unless the user explicitly asks for the direct API-key path. The agent-mode path is `agent build` → заполнение артефактов фаз → `agent apply`.
- **Never invent components.** Только компоненты из registry (22 секции). Check with `pnpm -w run harness registry`.
- **Never hand-edit `generated/landings/<slug>/page.tsx`** — it's derived from the spec. Re-run apply.
- If the spec already exists, you can start from apply directly (e.g. for re-validation after manual edits).
- **Never skip mock authoring** на SaaS-лендингах. Лендинг без mock'ов в Hero и body-секциях выглядит «голым» — это блокер ревью (см. memory `visual-review-required`). Минимум: Hero с `visual.variant: '<specific>'` (НЕ `generic`) + 2-4 body-секции с уникальными mock'ами (НЕ `default`).
- **Never skip layout selection** — КРОМЕ `brief.landingMode: "custom"`. В режиме «по брифу» если в брифе нет `pageLayout` — выбери его перед написанием spec, опираясь на `wiki/layouts/index.md`, запиши в `spec.meta.layout`. В custom-режиме (1-в-1 по ТЗ) layout НЕ выбирается — структура строго из ТЗ.
- **Never skip Domain audit (§0).** Reuse mock'ов из чужого домена («pm-board для CRM», «request-card для HR») — самый частый блокер ревью. См. [`domain-mock-matrix.md`](../../../wiki/references/domain-mock-matrix.md).
- **Never use `mediaVariant: 'default'` twice на одном лендинге.** Валидатор завалит. Создай новый mock-компонент или подбери другой variant из реестра.

## Anti-patterns

- Calling external APIs or asking the user for API keys (the whole point of agent-mode is to avoid this).
- Writing markdown fences or commentary into the spec JSON — apply only accepts pure JSON.
- Regenerating illustrations on every landing run — they are stable artifacts in `packages/ui/src/illustrations/`.
- Lorem-style или abstract данные в новом mock-компоненте. Контент — domain-specific из брифа.
- Mixing two semantic color axes inside one mock (priority + type через accent-bar). One axis per mock.
- Two or more эмодзи в одном mock-компоненте. Zero or one.
- A landing where every body section has the same layout (text+mock, text+mock, …). Apply zigzag: alternating sections with mocks left/right (`MediaCopy.reverse: true` в каждой второй).
- Reuse того же mock-компонента в двух разных сценариях через `variant` без визуального обоснования. Если сценарии визуально разные — это два разных компонента.
- **Cross-domain reuse mock'а** (`pm-board` для CRM, `request-card` для HR, `analytics-kpi` команд для marketing-кампании). Самый частый блокер ревью. См. §0 и [`domain-mock-matrix.md`](../../../wiki/references/domain-mock-matrix.md).
- Props на content в mock-компоненте (`tickets: Ticket[]`, `messages: Message[]`). Контент — хардкод; для разветвления — только `variant: 'a' | 'b'`.
