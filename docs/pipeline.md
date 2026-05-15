# Buffalo — пайплайн генерации лендинга

> Документ для команды. Системно и последовательно описывает, **как** из маркетингового
> брифа получается готовый к разработке Kaiten-лендинг: какие шаги, что на каждом
> происходит, какие скиллы и валидаторы участвуют, на чём держится «уровень качества»
> и как лендинг проходит финальные проверки и упаковку для разработчиков.
>
> Источники: `README.md`, `AGENTS.md`, `packages/harness/src/**`, `.claude/skills/**`,
> `wiki/**`, `design-system/kaiten-v01/**`.

---

## 0. TL;DR — пайплайн одной строкой

```
brief.json → (context + skills + registry) → LandingSpec(JSON) → validators → repair-loop
           → render TSX → preview (Next.js) → visual regression → approve → handoff ZIP
```

- **Скилы** = `.md`-плейбуки, которые подмешиваются в system prompt и одновременно
  работают как rulebook для людей. Главный по качеству — `conversion-landing.md`
  (8 типов SaaS-страниц, awareness-levels, hero, секции, копи, CTA, 100-балльный
  audit-чек-лист).
- **Качество не на доверии модели**, а на трёх контурах: (1) Zod-схема `LandingSpec`,
  (2) brand-voice deny-list, (3) business-rules валидатор. При нарушении срабатывает
  repair-loop — до 3 итераций.
- **LLM физически не может вставить «левый» блок** — генерируется JSON по фиксированному
  registry из 6 компонентов; TSX рендерится детерминированно.
- **Agent-mode по умолчанию**: harness не зовёт внешний LLM, LLM = хост-агент (Claude
  Code/Codex). Старый flow с API-ключом сохранён как fallback.

---

## 1. Архитектура и где что лежит

```
apps/web/                       Next.js 16: preview /landings/<slug>, /approve/<slug>, API
packages/harness/               Ядро: schemas, registry, prompts, skills, pipeline, CLI,
                                validators, render, handoff, wiki
packages/ui/                    Landing-компоненты, primitives, иллюстрации, tokens.css
design-system/kaiten-v01/       SSoT дизайн-системы: HTML/PDF/PNG + tokens.json
wiki/                           LLM-maintained знание: audiences, archetypes, patterns,
                                landings, design-system (derived), lessons, log
content/briefs/                 Брифы маркетинга — IMMUTABLE
content/landings/               Сохранённые LandingSpec (regeneratable)
content/approvals/              Approval-статусы (pending/approved/…)
content/illustrations/          Specs SVG-иллюстраций
generated/landings/<slug>/      Output: page.tsx (regeneratable)
.claude/skills/                 Project-level Claude Code skills
                                (buffalo-generate, buffalo-review, design-system-kaiten-v01)
out/                            Handoff ZIP-пакеты (gitignored)
```

Что **immutable**: `content/briefs/**`, Zod-схемы (`packages/harness/src/schemas/*`),
landing-компоненты в `packages/ui/src/landing/*.tsx`, исходники дизайн-системы.

Что **редактируется LLM/командой**: `wiki/**` (по правилам `wiki/AGENTS.md`),
`content/landings/<slug>.json` (только через harness), `packages/harness/src/skills/*.md`
(осознанно, когда меняются правила копи/конверсии).

---

## 2. Действующие лица — что от чего зависит

```
┌──────────────────┐    ┌──────────────────────┐
│  Brief (JSON)    │    │  Design system V01   │
│ content/briefs/  │    │ design-system/       │
└────────┬─────────┘    │   kaiten-v01/        │
         │              │ wiki/design-system/  │
         │              └──────────┬───────────┘
         ▼                         │
┌──────────────────────────────────▼──────────────┐
│ Selective context builder (wiki/select-context) │
│ + skill `conversion-landing.md`                 │
│ + component registry                            │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│ System prompt + JSON Schema (LandingSpec)       │
│ buildLandingSystemPromptWithMeta()              │
└──────────────────────┬──────────────────────────┘
                       ▼
                   [LLM/host-agent]
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│ LandingSpec.json (content/landings/<slug>.json) │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│ Validators (Zod + brand + business) + repair    │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│ Renderer → generated/landings/<slug>/page.tsx   │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│ Preview (Next.js)  +  Visual regression         │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│ Approve (/approve/<slug>)  →  Handoff ZIP       │
└─────────────────────────────────────────────────┘
```

---

## 3. Шаги пайплайна — подробно

### Шаг 1. Brief — ТЗ от маркетинга

**Что это.** JSON-файл, описывающий продукт под лендинг. Валидируется через
`BriefSchema` (`packages/harness/src/schemas/brief.ts`). Это **единственный вход**
маркетинга в пайплайн.

**Где живёт.** `content/briefs/<slug>.json`. **Immutable** — новый бриф = новый файл,
старые не переписываются.

**Ключевые поля.**

| Поле | Назначение |
|------|------------|
| `product` | Что за продукт |
| `audience` | Список аудиторий (нужно для матчинга `wiki/audiences/*`) |
| `market` | Сегмент (`B2B SaaS`, и т.п.) |
| `primaryGoal` | `book_demo` / `signup` / `waitlist` / `contact_sales` / `try_free` / `download` |
| `mainPain` / `mainPromise` | Один pain — одно обещание, на этом строится hero |
| `proofPoints` | 3+ конкретики (числа/кейсы/факты), а не «лучшие в мире» |
| `tone` | Дефолт «clear, practical, confident, no hype» |
| `cta` | Точная подпись кнопки (использует business-валидатор) |
| `pageArchetype` | `saas` / `waitlist` / `enterprise` — управляет селекцией контекста |

**Ingest брифа (опционально).**
`pnpm -w run harness ingest brief content/briefs/<slug>.json` классифицирует бриф через
LLM и обновляет `wiki/audiences/*.md` + пишет запись в `wiki/log.md`.

---

### Шаг 2. Context — что подмешивается в system prompt

Контекст собирается функцией `buildLandingSystemPromptWithMeta`
(`packages/harness/src/prompts/system.ts`). Это сердце «уровня качества»: модель
получает не «общие правила», а **выжимку из дизайн-системы + плейбук конверсии +
жёсткий registry компонентов**.

**Три режима сборки (по убыванию приоритета):**

1. **Selective (по умолчанию, stage-8).** Если бриф есть — `selectContext()` подбирает
   страницы из `wiki/` по `pageArchetype` и аудиториям:
   - **Базовый DS** (всегда): `wiki/design-system/voice.md`, `colors.md`,
     `typography.md`, `spacing.md`.
   - **Доп DS по archetype**: `radius.md`, `motion.md`, `grid.md` (для `saas` и
     `enterprise`; для `waitlist` — только `radius.md`).
   - **Компоненты по archetype**: `wiki/design-system/components/{hero,feature-grid,
     pricing,faq,accordion,final-cta,footer,button}.md` (для `waitlist` — без
     `pricing`).
   - **Archetype description**: `wiki/archetypes/<archetype>.md`.
   - **Аудитории**: `wiki/audiences/*.md`, если матчится по `brief.audience`.
   Экономия: ~50–70% токенов на не-saas архетипах. Список реально подгруженных
   страниц сохраняется в `spec.meta.sources` — это traceability.
2. **Full wiki.** Если selective пуст — грузится весь `wiki/design-system/*.md` +
   `packages/harness/src/skills/conversion-landing.md`.
3. **Legacy fallback.** Если `wiki/` ещё не собран — `packages/harness/src/prompts/
   design-system-kaiten.md` + `conversion-landing.md`.

**System prompt после сборки** содержит:

- **Operator rules** — «никогда не выдумывай компоненты/props/прозу; только JSON;
  honor length-constraints; один primary CTA; hero — первая секция; следуй
  brand voice из `voice.md` и conversion-landing-скиллу».
- **Component registry** (см. шаг 3) в виде JSON.
- **DS + archetype rules + conversion-landing skill** — собранный body выше.
- **Output spec** — «верни ОДИН JSON, совпадающий с LandingSpec».

`buildLandingSystemPromptWithMeta` возвращает: `system`, `sources` (массив путей в
wiki/), `archetype`, `tokenEstimate`. Это потом ляжет в `spec.meta` и в
`wiki/landings/<slug>.md`.

---

### Шаг 3. Registry — единственный «словарь» компонентов

Файл: `packages/harness/src/registry/index.ts`.

Зафиксированный список из **6 компонентов**, и LLM не может вылезти за него:

| Компонент | Категория | Что есть в props |
|-----------|-----------|------------------|
| `HeroSection` | hero | eyebrow / title (4..80) / subtitle (10..200) / primaryCta / secondaryCta / visual |
| `FeatureGrid` | features | 2–8 items (icon+title+description), 2/3/4 колонки |
| `PricingPlans` | pricing | 2–4 плана, опц. один highlighted=true |
| `FAQAccordion` | faq | Q&A |
| `FinalCta` | cta | один на странице |
| `LandingFooter` | footer | колонки со ссылками |

Для каждого компонента registry хранит `description`, `props` (с длинами), `constraints`
и `sectionId` (literal в Zod-схеме). Это попадает в system prompt JSON-блоком, и
параллельно — это контракт для `validateLandingBusiness` (см. шаг 6).

> Расширение registry — **сначала** новая запись в `REGISTRY`, **потом** добавление
> компонента в `packages/ui/src/landing/`, **потом** обновление skill, который про этот
> компонент рассказывает.

---

### Шаг 4. Skills — плейбуки внутри LLM

«Скиллы» — это `.md`-документы с frontmatter (`name`, `description`, `metadata`),
которые работают одновременно как **(a)** контекст в system prompt и **(b)** rulebook
для людей/агентов, правящих спек руками. **Текстовые правила = код качества.**

#### 4.1. `packages/harness/src/skills/conversion-landing.md` — главный по качеству

Это **контракт-руководство для всех**, кто собирает или правит лендинги. Покрывает:

- **8 page types** SaaS-страниц (Bottom-funnel demo, Free trial, Pricing, Use-case,
  Comparison, Feature, Waitlist, Solution) — у каждого свой intent трафика, **своя
  обязательная структура секций**, своя copy-формула.
- **Awareness levels по Шугерману/Шварцу** (5 уровней) → определяет copy framework
  (AIDA / PAS / BAB / StoryBrand / Direct).
- **Hero rules**: 5-секундный тест «что/для кого/результат», один primary CTA, большой
  product visual справа, LCP ≤ 2.5s.
- **Body sections catalog**: одна секция = одна задача (USP / proof / FAQ / pricing).
- **Copy rules**: Conversion Equation, Feature → Benefit Transformation, CTA hierarchy,
  Voice-of-customer, инфостиль.
- **Visual + CTA + микрокопи**.
- **§17 — 100-балльный audit-scorecard** (Hero 20 / Value Prop 15 / Social Proof 15 /
  CTA 15 / Copy 15 / Design&UX 10 / Tech Perf 10). Score → tier: 90–100 minor tweaks,
  75–89 точечные правки, 60–74 переписать секции, <60 — редизайн.

Этот файл подмешивается в system prompt именно как «контракт», на который ссылаются
`Operator rules` («**Follow the conversion-landing skill … sections, copy and order
should match it for the chosen page type**»).

#### 4.2. `packages/harness/src/skills/content-marketing.md` — планируется

Playbook блог-поверхности (статус ⏳ planned). Будет использоваться для генерации
статей, не лендингов.

#### 4.3. Project-level скиллы в `.claude/skills/`

| Skill | Когда триггерится | Что делает |
|-------|-------------------|------------|
| `buffalo-generate/SKILL.md` | «сгенерируй лендинг», «buffalo generate <slug>», «новый лендинг для X» | Проводит весь E2E в agent-mode: prepare prompt → ты-LLM пишешь spec → apply (валидаторы + TSX) → preview → handoff |
| `buffalo-review/SKILL.md` | «проверь лендинг <slug>», «что не так с <slug>», «approve?» | QA-цикл: zod-валидация, brand+business rules, иллюстрации, visual regression, /approve, summary report |
| `design-system-kaiten-v01/SKILL.md` | Любой UI-вопрос в стиле Kaiten | Выжимка из `design-system/kaiten-v01/`: цвета, типографика, сетка, состояния компонент |

Скиллы — декларативные, они **ссылаются на CLI и валидаторы**, никакого магического
кода вне harness.

#### 4.4. SSoT дизайн-система — `design-system/kaiten-v01/`

HTML/PDF/PNG от дизайн-команды + `tokens.json`. Это **источник истины** —
`packages/ui/src/tokens.css` автогенерируется (`harness wiki sync`), руками не
правится. `wiki/design-system/*.md` — derived, тоже регенерируется из tokens.json.

---

### Шаг 5. LandingSpec — структурированный план страницы

**Zod-схема:** `packages/harness/src/schemas/landing-spec.ts`. Это **финальный
контракт** между LLM-выходом и рендером.

**Структура спека:**

```
LandingSpec = {
  slug, pageType, seo: { title, description },
  sections: Section[],          // discriminated union из 6 component-схем
  illustrationSpecs?: [...],
  meta?: { sources, generatedAt, generator, archetype, tokenEstimate }
}
```

`sections` — discriminated union по `component`. Каждый член union строго типизирован
(`HeroSection.props.title.length: 4..80`, `FeatureGrid.items.length: 2..8`, и т.д.).
Zod ловит структурные ошибки до того, как до них доберётся business-валидатор.

`spec.meta` (stage-8) — traceability:

- `sources` — список wiki-страниц, повлиявших на промпт.
- `generatedAt` — ISO дата.
- `generator` — `"host-agent"` / `"openai/<model>"` / `"deterministic-fallback (…)"`.
- `archetype`, `tokenEstimate` — оценка контекстных токенов и резолвнутый архетип.

---

### Шаг 6. Validators + repair-loop — три контура качества

Файлы: `packages/harness/src/validators/{landing-brand,landing-business,illustration-ast}.ts`,
`pipeline/repair.ts`.

#### Контур 1: Zod-парсинг
Структура, длины, типы, discriminated union. Если падает — спек считается «битый», и
никакие копи-правила дальше не проверяются.

#### Контур 2: `validateLandingBrand` — brand-voice deny-list
Сканирует **все текстовые поля** (рекурсивно, пропуская `icon`/`href`/`id`/`component`/
`assetId`) и ловит:

- **hype-word** — `revolutionary`, `world-class`, `game-changer`, `next-generation`,
  `cutting-edge`, `blazing(ly) fast`, `mind-blowing`, `волшеб`, `революционный`,
  `идеальный`, `жаркий`, `невероятный`…
- **absolutist** — `10x`, `100x`, `everything`, `anyone`, `всё`, `все`.
- **empty-marketing** — `leverage`, `synergy`, `paradigm shift`, `best practices`,
  `next level`, `world class`.

Каждый error — это `{ rule, field, message, evidence }`. Поле `evidence` показывает
конкретную строку, поэтому feedback для модели очень предметный.

#### Контур 3: `validateLandingBusiness` — кросс-секционные правила
Эти проверки не выражаются через Zod без дублирования:

- `hero-first` — `sections[0]` обязательно `HeroSection`.
- `footer-last` — если есть `LandingFooter`, он последний.
- `single-hero` — ровно один `HeroSection`.
- `single-final-cta` — максимум один `FinalCta`.
- `pricing-highlighted` — максимум один `highlighted: true` в `PricingPlans`.
- `href-shape` — все `href` начинаются с `http(s)://`, `/`, `#` или `mailto:`.
- `cta-aligned-with-brief` — нечёткое сравнение `hero.primaryCta.label` с `brief.cta`.
- `feature-icon` — каждый `FeatureGrid.items[].icon` непустой.

#### Repair-loop (`pipeline/repair.ts`)

```
attempt 1: generate(no feedback) → validate
attempt 2: generate(feedback = previous errors) → validate
attempt N: …
```

- Максимум `maxAttempts` (дефолт 2, поднимается до 3 флагом `--max-repair-attempts`).
- Каждая попытка логируется (`attempt`, `ok`, `errors`, `durationMs`).
- В feedback для модели передаётся **list-of-errors в человекочитаемом виде** — она
  чинит точечно, а не переписывает спек.
- Без `--strict`: если последняя попытка не прошла валидатор, всё равно пишется
  «последний кандидат» (видно в превью, можно дочинить руками).
- С `--strict`: при ошибках валидаторы блокируют запись → exit≠0.

#### Иллюстрации
`validateIllustrationTSX` (AST-проверка) — отдельный контур для SVG-иллюстраций (этап
3). 6-правил чек-лист (viewBox, no raster, no inline scripts, accessibility, …).
Иллюстрации генерируются отдельным шагом и считаются стабильным артефактом —
`packages/ui/src/illustrations/<Name>.tsx`.

---

### Шаг 7. Render — TSX из спека

Файл: `packages/harness/src/render/render-landing.ts`.

Чистый детерминированный рендер: для каждой секции — react-компонент из
`packages/ui/src/landing/*`, props мапятся из spec. **LLM в этом шаге не участвует.**
Никакой генерации TSX из текста — всегда сборка из spec.

Output: `generated/landings/<slug>/page.tsx`. Этот файл **руками не правится** — он
derived. Любая правка делается через спек и повторный apply.

После рендера CLI пишет:
- `content/landings/<slug>.json` — финальный spec с `meta`.
- `generated/landings/<slug>/page.tsx` — TSX.
- `wiki/landings/<slug>.md` — карточка лендинга (filing back, stage-8 M4b): brief,
  archetype, sources, status, log of changes. Это «память» — на следующих лендингах
  модель может опираться на прошлый опыт через wiki.
- запись в `wiki/log.md` (`op: generate, slug, status, note`).

---

### Шаг 8. Agent-mode CLI — как это запускается на практике

Дефолтный flow — **без API-ключей**. `harness` сам не зовёт LLM; он подготавливает
prompt для хост-агента (Claude Code / Codex / ChatGPT с file access). Хост-агент =
LLM.

```bash
# 1. Маркетинг кладёт бриф (или редактирует существующий)
$ cat content/briefs/<slug>.json

# 2. CLI готовит prompt + JSON Schema. LLM-вызова НЕТ.
$ pnpm -w run harness agent prepare landing \
    --brief content/briefs/<slug>.json \
    --slug <slug> \
    --out .context/agent/<slug>.prompt.md
```

`.context/agent/<slug>.prompt.md` содержит:
- system prompt (см. шаг 2),
- user prompt с брифом,
- JSON Schema для `LandingSpec`,
- `outputPath` — куда записать спек,
- `nextCommand` — что запустить дальше.

```bash
# 3. Хост-агент (Claude Code и т.п.) читает prompt и пишет JSON в
#    content/landings/<slug>.json. Это и есть «генерация».

# 4. CLI принимает спек: zod-парсинг, brand+business, рендер TSX, filing back.
$ pnpm -w run harness agent apply landing \
    --slug <slug> \
    --brief content/briefs/<slug>.json \
    --json    # machine-readable для repair-loop агента
```

Что делает `apply`:
1. Читает `content/landings/<slug>.json`, парсит через `LandingSpecSchema`.
2. Читает бриф (нужен для `cta-aligned-with-brief`).
3. Прогоняет `validateLandingBrand` + `validateLandingBusiness`.
4. Обогащает `spec.meta` (sources, archetype, generator=`host-agent`, generatedAt).
5. Рендерит TSX в `generated/landings/<slug>/page.tsx`.
6. Filing back в `wiki/landings/<slug>.md` + запись в `wiki/log.md`.
7. На ошибках — список со `path → message → code`, ненулевой exit, и подсказка
   «правь файл и запусти снова».

**Legacy-flow с API-ключом** (`pnpm -w run harness generate landing`) сохранён как
fallback: он сам зовёт LLM (Vercel AI Gateway → Anthropic → OpenAI), сам прогоняет
repair-loop. Используется, когда есть Gateway-ключ; иначе — agent-mode.

**Skill `buffalo-generate`** в Claude Code автоматизирует все 4 шага: триггерится на
фразу «сгенерируй лендинг по <brief>», сам зовёт `prepare` → пишет спек → `apply` →
repair → preview.

---

### Шаг 9. Preview — Next.js

```bash
pnpm dev    # → http://localhost:3000
```

- `/landings/<slug>` — рендер сгенерированного TSX из `generated/landings/<slug>/`.
  Реальный продакшен-look на токенах Kaiten DS.
- `/approve/<slug>` — форма approve (см. шаг 11).
- `/api/approve/<slug>` — POST для статуса approval.
- `/api/handoff/<slug>` — триггер сборки ZIP.

Превью — **обязательная визуальная проверка**: HTTP 200 ≠ «лендинг готов».
В memory команды зафиксировано: visual review через Playwright-скриншот + сверка с
design-system/ обязательны.

---

### Шаг 10. Visual regression — Playwright

`apps/web/tests/visual/landing.spec.ts` берёт все slug из `content/landings/*.json` и
скриншотит `/landings/<slug>` в фиксированном viewport 1440×900 (desktop-chromium).
Сравнение с baseline в `apps/web/tests/visual/__snapshots__/`.

```bash
pnpm --filter @buffalo/web test:visual          # прогон против baseline
pnpm --filter @buffalo/web test:visual:update   # перебить baseline (намеренные правки)
```

В CI этот шаг — gate перед approve. Diff означает либо регресс (блок), либо
намеренные изменения (нужен новый baseline + ревью).

---

### Шаг 11. Approve — формальное «можно отгружать»

Approval хранится в `content/approvals/<slug>.json`. Статусы: `pending`,
`changes_requested`, `approved`, `rejected`.

UI: `http://localhost:3000/approve/<slug>` — iframe с превью + форма (статус,
reviewer, комментарии).

CLI:

```bash
pnpm -w run harness approvals list                # все approval'ы
pnpm -w run harness approvals status <slug>       # JSON
pnpm -w run harness approvals check <slug...>     # CI: exit≠0 если хоть один не approved
pnpm -w run harness approve <slug> --baseline-ref <ref>   # CLI-approve + filing back
```

Skill `buffalo-review` проходит этот цикл сам: читает spec/brief/approval, прогоняет
все валидаторы, иллюстрации, visual regression, выдаёт **structured report**
(decision recommendation, hard blockers, soft suggestions, visual diff status, next
action). Approval он сам **никогда не выставляет** — только рекомендует.

---

### Шаг 12. Handoff — упаковка для разработчиков

```bash
pnpm -w run harness handoff <slug>                          # → out/landing-<slug>.zip
pnpm -w run harness handoff <slug> --require-approved       # gate по approval
pnpm -w run harness handoff <slug> -o /path/to/landing.zip  # custom output
```

`buildHandoff` (`packages/harness/src/handoff/index.ts`) собирает **self-contained**
ZIP, который кидается в любой Next.js + Tailwind v4 проект:

```
landing-<slug>/
├── README.md           инструкция для разработчика
├── package.json        минимальный snippet с deps
├── page.tsx            generated/landings/<slug>/page.tsx, импорты переписаны
│                       на ./components
├── spec.json           исходный LandingSpec
├── approval.json       статус approval (если есть)
├── tokens.css          Kaiten DS токены
├── styles.css          bridge: tailwindcss + tokens
├── components/         только использованные landing-компоненты + barrel
├── primitives/         Button, ButtonLink, cn
└── illustrations/      SVG (из spec.illustrationSpecs)
```

После сборки:
- Статус в `wiki/landings/<slug>.md` обновляется на `shipped` с `zipRef`.
- Запись в `wiki/log.md` (`op: handoff, slug, status, note: zip=… files=… bytes=…`).
- При `--require-approved` и `approval.status != approved` — handoff блокируется.

---

## 4. Где задано «качество» — карта зависимостей

| Уровень контроля | Где | Что ловит |
|------------------|-----|-----------|
| **Структура** | `schemas/landing-spec.ts` (Zod) | Несуществующие компоненты, неверные props, длины строк, типы |
| **Registry** | `registry/index.ts` | Невозможно выбрать «левый» компонент — system prompt видит только разрешённые |
| **Brand voice** | `validators/landing-brand.ts` + `wiki/design-system/voice.md` | Hype, абсолютизмы, штампы |
| **Business rules** | `validators/landing-business.ts` | Hero first, footer last, single hero, href shape, CTA aligned with brief |
| **Page type / структура секций** | skill `conversion-landing.md` (§1, §4) | LLM-уровень: подобрать правильную структуру под intent трафика |
| **Awareness / copy framework** | skill `conversion-landing.md` (§2, §5) | LLM-уровень: формула H1, CTA hierarchy, Feature→Benefit transformation |
| **Дизайн-токены** | `design-system/kaiten-v01/tokens.json` → `tokens.css` | Цвета, шрифты, отступы, радиусы — нельзя hardcode'нуть в UI |
| **Иллюстрации** | `validators/illustration-ast.ts` | SVG-правила (viewBox, no raster, a11y) |
| **Визуал** | `apps/web/tests/visual/landing.spec.ts` (Playwright) | Регресс в любом пикселе |
| **Финальный score** | skill `conversion-landing.md` §17 (100-point) | Аудит уровня «всё ли в порядке как у конверсионного лендинга» — для buffalo-review |
| **Approve gate** | `content/approvals/<slug>.json` + `--require-approved` | Не уходит handoff, пока продукт/маркетинг не подписали |
| **Wiki / log** | `wiki/landings/<slug>.md`, `wiki/log.md`, `wiki/lessons.md` | Память между лендингами, traceability sources |

---

## 5. Полный happy-path одной командой (cheatsheet)

```bash
# Pre: репо склонирован, pnpm install сделан
# 0. Maintenance (раз в спринт):
pnpm -w run harness wiki sync       # tokens.json → tokens.css + wiki/design-system/
pnpm -w run harness wiki index      # wiki/index.md
pnpm -w run harness lint            # drift wiki/registry/prompts

# 1. Маркетинг создаёт бриф
$EDITOR content/briefs/<slug>.json

# 2. (опц.) ingest брифа → wiki/audiences
pnpm -w run harness ingest brief content/briefs/<slug>.json

# 3. Готовим prompt для хост-агента
pnpm -w run harness agent prepare landing \
  --brief content/briefs/<slug>.json --slug <slug> \
  --out .context/agent/<slug>.prompt.md

# 4. Хост-агент (Claude Code) пишет content/landings/<slug>.json
#    Или: в Claude Code → «сгенерируй лендинг для <slug>» → buffalo-generate всё сам

# 5. Apply: zod + brand + business + render TSX + filing back
pnpm -w run harness agent apply landing \
  --slug <slug> --brief content/briefs/<slug>.json
# repair: правим JSON, гоняем снова до зелёного

# 6. Preview
pnpm dev
# → http://localhost:3000/landings/<slug>

# 7. Visual regression
pnpm --filter @buffalo/web test:visual

# 8. QA-цикл — Claude Code skill
#    «проверь лендинг <slug>» → buffalo-review проходит весь чек-лист

# 9. Approve
# UI: http://localhost:3000/approve/<slug>
# или: curl -X POST http://localhost:3000/api/approve/<slug> -d '{...}'

# 10. Handoff
pnpm -w run harness handoff <slug> --require-approved
# → out/landing-<slug>.zip — отдаём разработчикам
```

---

## 6. Что НЕ часть пайплайна (намеренно)

- **Маркетинг-копи руками в TSX.** Любая правка копи делается **через спек** и повторный
  apply. `generated/landings/<slug>/page.tsx` — derived.
- **Hardcoded цвета/токены в `packages/ui/**`.** Только `var(--…)` из `tokens.css`.
- **Новый компонент мимо registry.** Сначала запись в `REGISTRY` → потом TSX в
  `packages/ui/src/landing/` → потом обновление skill (`conversion-landing.md` §4.A).
- **Append `wiki/log.md` руками.** Только через CLI; только в конец.
- **API-ключи как обязательное условие.** Дефолт — agent-mode. Ключи — fallback для
  безголовых пайплайнов.

---

## 7. Точки роста (под текущий roadmap)

- **`content-marketing.md`** — playbook для блог-поверхности (⏳ planned).
- **CI workflows**: `wiki-freshness.yml` и `readme-freshness.yml` ловят drift.
- **Расширение registry** (логосоцпруфы, testimonials, comparison tables) — каждый
  новый компонент = триплет «registry → UI → skill-секция».
- **Auto-A/B mode** — отдельный режим skill'а, который генерирует 2–3 варианта hero/CTA
  с измеримой гипотезой.

---

## 8. Куда смотреть в коде

| Вопрос | Файл / директория |
|--------|-------------------|
| Как формируется system prompt | `packages/harness/src/prompts/system.ts` |
| Что грузится из wiki при selective context | `packages/harness/src/wiki/select-context.ts` |
| Registry компонентов | `packages/harness/src/registry/index.ts` |
| Zod-схемы | `packages/harness/src/schemas/{landing-spec,brief,illustration-spec,approval}.ts` |
| Brand-voice deny-list | `packages/harness/src/validators/landing-brand.ts` |
| Business-правила | `packages/harness/src/validators/landing-business.ts` |
| Repair-loop | `packages/harness/src/pipeline/repair.ts` |
| Agent-mode prepare/apply | `packages/harness/src/agent/{prepare-landing,ingest-landing}.ts` |
| Renderer TSX | `packages/harness/src/render/render-landing.ts` |
| Handoff ZIP | `packages/harness/src/handoff/index.ts` |
| Конверсионный skill | `packages/harness/src/skills/conversion-landing.md` |
| Claude-skill «генерация» | `.claude/skills/buffalo-generate/SKILL.md` |
| Claude-skill «ревью» | `.claude/skills/buffalo-review/SKILL.md` |
| Дизайн-система SSoT | `design-system/kaiten-v01/` |
| Visual regression | `apps/web/tests/visual/landing.spec.ts` |
| CLI entry | `packages/harness/src/cli.ts` |
