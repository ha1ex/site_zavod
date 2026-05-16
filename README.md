# Buffalo — фабрика лендингов на LLM

> Превращаем маркетинговый бриф в готовый Kaiten-лендинг за минуту, а не за неделю.

Buffalo — это управляемый контур вокруг LLM (Claude / GPT / любой хост-агент), который
собирает SaaS-лендинги **строго на наших компонентах**, в фирменном стиле Kaiten, с
автоматической проверкой бренда, доступности и бизнес-правил. На выходе — обычный
TSX, который проходит ревью и мержится как любой PR.

📖 **Подробная техническая документация пайплайна:** [`docs/pipeline.md`](docs/pipeline.md)

---

## Зачем это маркетингу

**Проблема.** Каждый новый лендинг отнимает у фронтенд-команды дни. Часто получается
не в фирменном стиле и собирается «из чего попало», а не из дизайн-системы.

**Что даёт Buffalo:**

- 🟢 **Бриф → лендинг за ~1 минуту.** Заполнили JSON (или форму) — получили работающую страницу в превью.
- 🟢 **Только наши компоненты.** LLM физически не может вставить «левый» блок — registry компонентов жёстко ограничен.
- 🟢 **Авто-проверки.** Бренд-voice, бизнес-правила, accessibility и визуал проверяются на каждом шаге. Если что-то не так — пайплайн сам чинит и пробует снова (repair loop).
- 🟢 **Готово к проду.** Выход — TSX-файл, который проходит обычный PR-флоу, типизацию и визуальные тесты.
- 🟢 **Agent-mode по умолчанию.** Не нужны API-ключи: LLM = твой хост-агент (Claude Code / Codex / ChatGPT с file access).

---

## Как это работает (пайплайн)

### Высокоуровневая схема

```
┌────────┐    ┌───────────────────┐    ┌─────────────┐    ┌─────────────┐
│ Brief  │ →  │ Context           │ →  │ Allowed     │ →  │ LandingSpec │
│ (JSON) │    │ (DS + skills + KB │    │ components  │    │ (zod-схема) │
└────────┘    │  из wiki/)        │    │ (registry)  │    └──────┬──────┘
              └───────────────────┘    └─────────────┘           │
                                                                 ▼
┌──────────┐    ┌───────────┐    ┌───────────────┐    ┌──────────────────┐
│ Handoff  │ ←  │ Approve   │ ←  │ Validators    │ ←  │ TSX render       │
│ (.zip,   │    │ + Visual  │    │ + repair loop │    │ (детерминирован, │
│  PR)     │    │ Reg.      │    │ (до 3 attemp.)│    │  из компонент)   │
└──────────┘    └───────────┘    └───────────────┘    └──────────────────┘
```

### Подробная схема — что подмешивается на каждом шаге

```
┌──────────────────┐    ┌──────────────────────┐
│  Brief (JSON)    │    │  Design system V01   │
│ content/briefs/  │    │ design-system/       │
│   (immutable)    │    │   kaiten-v01/        │
└────────┬─────────┘    │ wiki/design-system/  │
         │              └──────────┬───────────┘
         │                         │
         ▼                         ▼
┌─────────────────────────────────────────────────┐
│  Selective context builder                      │
│  (packages/harness/src/wiki/select-context.ts)  │
│                                                 │
│  + skill `conversion-landing.md`                │
│     (8 page types · awareness levels · hero ·   │
│      copy · CTA · 100-балльный audit-scorecard) │
│  + component registry (6 компонентов)           │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│  System prompt + JSON Schema (LandingSpec)      │
│  buildLandingSystemPromptWithMeta()             │
└─────────────────────┬───────────────────────────┘
                      ▼
              [LLM / host-agent]
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  LandingSpec.json                               │
│  content/landings/<slug>.json                   │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│  Validators (3 контура):                        │
│   1. Zod-схема — структура и длины              │
│   2. brand-voice deny-list — hype/штампы        │
│   3. business rules — hero-first, single-hero,  │
│      footer-last, href shape, CTA aligned …     │
│                                                 │
│  Repair-loop: до 3 попыток с feedback модели    │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│  Renderer → generated/landings/<slug>/page.tsx  │
│  Filing back → wiki/landings/<slug>.md          │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│  Preview (Next.js :3000/landings/<slug>)        │
│  +  Visual regression (Playwright)              │
└─────────────────────┬───────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│  Approve (/approve/<slug>)                      │
│  +  Handoff ZIP (out/landing-<slug>.zip)        │
└─────────────────────────────────────────────────┘
```

### Что происходит на каждом шаге

| Шаг | Что делает | Где живёт |
|-----|------------|-----------|
| **Brief** | Маркетинг описывает продукт, аудиторию, цель (`book_demo` / `signup` / …), tone, CTA | `content/briefs/<slug>.json` (immutable) |
| **Context** | Селективно подмешиваем дизайн-систему Kaiten + аудиторию + архетип + **skill-плейбук** | `wiki/**`, `packages/harness/src/skills/` |
| **Registry** | LLM видит только 6 разрешённых блоков из registry | `packages/harness/src/registry/index.ts` |
| **LandingSpec** | Структурированный JSON-план лендинга (zod-схема, строго типизирован) | `packages/harness/src/schemas/` |
| **Validators** | Zod + brand-voice deny-list + business-правила; при провале — repair loop | `packages/harness/src/validators/` |
| **TSX render** | Детерминированно собирается React-страница из компонент | `packages/harness/src/render/` |
| **Preview** | Готовый лендинг открывается на `localhost:3000/landings/<slug>` | `apps/web/` |
| **Visual regression** | Playwright скриншотит `/landings/<slug>` и сравнивает с baseline | `apps/web/tests/visual/` |
| **Approve** | Форма `/approve/<slug>` пишет статус в `content/approvals/<slug>.json` | `apps/web/app/approve/` |
| **Handoff** | `.zip` с TSX + компоненты + tokens + spec + README для PR | `out/landing-<slug>.zip` |

---

## Skills — плейбуки внутри LLM

Чтобы LLM не «галлюцинировал» и собирал лендинги по нашим правилам, рядом с ним лежит
набор **skills** — markdown-документов с методологией. Skill **подмешивается в system
prompt** на шаге Context и одновременно служит **rulebook'ом для маркетинга и
агентов**, которые правят `LandingSpec` руками.

**Это первая версия — skills постоянно дорабатываются.** Маркетинг может и должен
править эти файлы: меняются правила копи, появляется новый page type, обновляется
audit-чек-лист — всё редактируется напрямую в markdown без правок кода.

### Текущие skills (harness-уровень)

| Skill | Поверхность | Статус | Что внутри |
|-------|-------------|--------|------------|
| [`conversion-landing.md`](packages/harness/src/skills/conversion-landing.md) | лендинги | ✅ active | 8 типов SaaS-страниц, awareness levels (Шварц / Шугерман), правила hero / секций / копи / CTA / social proof, визуальная сетка, **100-балльный audit-чек-лист** |
| [`content-marketing.md`](packages/harness/src/skills/content-marketing.md) | статьи | ⏳ planned | Playbook блог-поверхности: позиционирование, 5 направлений, пайплайн статьи, промпты для агентов |

### Project-level скиллы Claude Code (`.claude/skills/`)

Эти скиллы превращают всю фабрику в одну команду из чата:

| Skill | Триггеры | Что делает |
|-------|----------|------------|
| **`buffalo-generate`** | «сгенерируй лендинг», «новый лендинг для X», «buffalo generate <slug>» | Прогоняет весь E2E: prepare → ты-LLM пишешь spec → apply → repair → preview → handoff |
| **`buffalo-review`** | «проверь лендинг <slug>», «что не так с <slug>», «approve?» | QA-цикл: zod-валидация, brand+business, иллюстрации, visual regression, /approve, structured report |
| **`design-system-kaiten-v01`** | любые UI-вопросы в стиле Kaiten | Выжимка из `design-system/kaiten-v01/`: цвета, типографика, сетка, состояния |

### Как маркетингу работать со skills

| Хочу… | Что делать |
|-------|-----------|
| **Поменять правило копи** (например, запретить новое hype-слово) | Открыть `conversion-landing.md`, найти раздел про копирайтинг → дописать правило. Перегенерировать любой лендинг — правило применится |
| **Заблокировать слово в brand-voice** | Дописать в `packages/harness/src/validators/landing-brand.ts` (deny-list); правило подхватит валидатор |
| **Добавить новый page type** | Дописать раздел в `conversion-landing.md` § «Page types» + добавить примеры hero/секций |
| **Ужесточить аудит-чек-лист** | Открыть §17 (audit scorecard) → поднять веса или добавить пункты |
| **Завести skill для новой поверхности** (email-цепочки, ads-copy, blog) | Создать новый файл `packages/harness/src/skills/<name>.md` по тому же шаблону |

### Что НЕ кладём в skills

- **Контент конкретного бренда** → `content/briefs/<slug>.json`.
- **TypeScript / схемы** → `packages/harness/src/schemas/`, `pipeline/`, `validators/`.
- **Конфиги моделей / провайдеров** → `packages/harness/src/providers/`.
- **Черновики и идеи** → `.context/` (gitignored).

> Подробнее про устройство папки и связь skill ↔ schema → `packages/harness/src/skills/README.md`.

---

## Качество — где оно зашито

| Контур контроля | Где живёт | Что ловит |
|-----------------|-----------|-----------|
| **Структура** | `schemas/landing-spec.ts` (Zod) | Несуществующие компоненты, неверные props, длины строк, типы |
| **Registry** | `registry/index.ts` | Невозможно выбрать «левый» компонент — system prompt видит только разрешённые |
| **Brand voice** | `validators/landing-brand.ts` + `wiki/design-system/voice.md` | Hype-слова, абсолютизмы (10x, всё, anyone), пустые штампы |
| **Business rules** | `validators/landing-business.ts` | Hero first, footer last, single hero, href shape, CTA aligned with brief |
| **Page type / структура секций** | skill `conversion-landing.md` (§1, §4) | LLM-уровень: правильная структура под intent трафика |
| **Awareness / copy framework** | skill `conversion-landing.md` (§2, §5) | LLM-уровень: формула H1, CTA hierarchy, Feature→Benefit transformation |
| **Дизайн-токены** | `design-system/kaiten-v01/tokens.json` → `tokens.css` | Цвета, шрифты, отступы, радиусы — нельзя hardcode'нуть в UI |
| **Иллюстрации** | `validators/illustration-ast.ts` | SVG-правила (viewBox, no raster, a11y) |
| **Визуал** | `apps/web/tests/visual/landing.spec.ts` (Playwright) | Регресс в любом пикселе vs baseline |
| **Финальный score** | skill `conversion-landing.md` §17 (100-point) | Аудит уровня «всё ли в порядке» — для buffalo-review |
| **Approve gate** | `content/approvals/<slug>.json` + `--require-approved` | Handoff блокируется, пока не подписан |
| **Wiki / log** | `wiki/landings/<slug>.md`, `wiki/log.md`, `wiki/lessons.md` | Память между лендингами, traceability sources |

---

## Быстрый старт (agent-mode, без API-ключей)

> Идея: Buffalo сам не вызывает внешнюю LLM. Он готовит prompt + JSON Schema, а
> **хост-агент (Claude Code, Codex, ChatGPT с file access) сам и есть LLM**. Поэтому
> никаких `.env.local` и API-ключей не нужно.

**Один раз:**

```bash
pnpm install
```

**1. Создать бриф** — скопируй `content/briefs/buffalo.json` и поправь поля под продукт:

```json
{
  "product": "...",
  "audience": ["..."],
  "market": "B2B SaaS",
  "primaryGoal": "book_demo",
  "mainPain": "...",
  "mainPromise": "...",
  "proofPoints": ["...", "...", "..."],
  "tone": "clear, practical, confident, no hype",
  "cta": "Получить демо",
  "pageArchetype": "saas"
}
```

**2. Подготовить prompt для агента (LLM-вызова нет):**

```bash
pnpm -w run harness agent prepare landing \
  --brief content/briefs/<slug>.json \
  --slug <slug> \
  --out .context/agent/<slug>.prompt.md
```

В `.context/agent/<slug>.prompt.md` лежит system prompt, user prompt, JSON Schema
(LandingSpec), brief и точный путь, куда писать spec.

**3. Сгенерировать spec через хост-агента.** Открой Claude Code (или Codex) в
репозитории и скажи:

> «Сгенерируй лендинг по `content/briefs/<slug>.json`, slug `<slug>`».

Skill `buffalo-generate` (`.claude/skills/buffalo-generate/`) триггерится автоматически
и проводит весь пайплайн. Агент сам прочитает prompt, напишет
`content/landings/<slug>.json` и запустит apply.

Если хочешь руками — прочитай `<slug>.prompt.md`, сгенерируй JSON по схеме, положи в
`content/landings/<slug>.json`.

**4. Прогнать валидаторы + отрендерить TSX:**

```bash
pnpm -w run harness agent apply landing \
  --slug <slug> \
  --brief content/briefs/<slug>.json
```

CLI:

- парсит spec через zod;
- прогоняет brand-voice + business-правила;
- обогащает `spec.meta` (sources, archetype, generator, generatedAt);
- рендерит TSX в `generated/landings/<slug>/page.tsx`;
- пишет filing back в `wiki/landings/<slug>.md` + запись в `wiki/log.md`.

При ошибках — `--json` даёт structured output для repair-loop'a (агент правит spec в
файле и снова запускает apply).

**5. Посмотреть в превью:**

```bash
pnpm dev
# → http://localhost:3000/landings/<slug>
```

**6. Прогнать визуальный регресс:**

```bash
pnpm --filter @buffalo/web test:visual
```

**7. Approve.** Открой `http://localhost:3000/approve/<slug>` — форма с превью в
iframe и статусами (`pending` / `changes_requested` / `approved` / `rejected`).
Состояние пишется в `content/approvals/<slug>.json`.

**8. Передать фронту — собрать handoff-пакет:**

```bash
pnpm -w run harness handoff <slug> --require-approved
# → out/landing-<slug>.zip
```

В архиве: TSX-файлы, компоненты, primitives, иллюстрации, tokens, spec.json,
approval.json (если есть), README и package.json snippet с минимумом deps.

> **Старый flow `harness generate landing` с внешним API-ключом** остаётся как
> fallback (если у команды есть Vercel AI Gateway / Anthropic / OpenAI ключ).
> Раскомментируй переменные в `.env.example` и положи их в `.env.local`.

---

## Структура репозитория

```
apps/web/                       Next.js 16 preview + API (generate, validate, handoff, approve)
packages/harness/               Ядро: schemas, registry, prompts, skills, pipeline, CLI, validators
packages/ui/                    Landing-компоненты, primitives, иллюстрации, Storybook, tokens.css
content/briefs/                 Брифы маркетинга (immutable; новый brief = новый файл)
content/landings/               Сохранённые LandingSpec (regeneratable)
content/approvals/              Approval-статусы (pending/approved/…)
content/illustrations/          Specs для SVG-иллюстраций
generated/landings/             Output: TSX (regeneratable — руками не править)
design-system/kaiten-v01/       SSoT дизайн-системы (HTML/PDF/PNG + tokens.json)
wiki/                           LLM-maintained знание: audiences, archetypes, patterns,
                                landings, design-system (derived), lessons, log
.claude/skills/                 Project-level Claude Code skills
.context/                       Workspace context (gitignored для большинства файлов)
out/                            Handoff ZIP пакеты (gitignored)
docs/                           Документация для команды (включая pipeline.md)
```

---

## Стек

- **Next.js 16** (App Router) — preview лендингов
- **Storybook 9** — registry компонентов и визуальный workshop
- **TailGrids v3** — закупленный набор landing-блоков (внутри `packages/ui/`)
- **Tailwind v4** — стили + tokens.css
- **Vercel AI SDK** — провайдер-агностичный LLM-слой (legacy flow с API-ключом)
- **zod** — output contracts (LandingSpec, IllustrationSpec, BriefSchema)
- **Playwright** — visual regression
- **pnpm workspaces** — монорепо

---

## Все команды

```bash
# Установка
pnpm install
pnpm dev                                      # Next.js preview :3000
pnpm storybook                                # Storybook :6006

# Лендинги (agent-mode, без API-ключей — дефолт)
pnpm -w run harness agent prepare landing --brief content/briefs/<slug>.json --slug <slug>
# … хост-агент пишет content/landings/<slug>.json …
pnpm -w run harness agent apply   landing --slug <slug> --brief content/briefs/<slug>.json
pnpm -w run harness handoff       <slug>      # → out/landing-<slug>.zip
pnpm -w run harness handoff       <slug> --require-approved   # gate по approval

# Approve
pnpm -w run harness approvals list            # все approval'ы со статусами
pnpm -w run harness approvals status <slug>   # JSON одной записи
pnpm -w run harness approvals check <slug...> # CI: exit≠0 если хоть один не approved
pnpm -w run harness approve <slug> --baseline-ref <ref>   # CLI-approve + filing back

# Wiki / lint / ingest / log
pnpm -w run harness wiki sync                 # tokens.json → tokens.css + wiki/design-system/
pnpm -w run harness wiki index                # регенерировать wiki/index.md
pnpm -w run harness lint                      # drift checks: wiki / registry / prompts
pnpm -w run harness ingest brief content/briefs/<slug>.json   # классифицирует через LLM
pnpm -w run harness ingest feedback <slug> "<note>"           # reviewer note → wiki
pnpm -w run harness log -n 30 --filter generate               # последние записи log

# Старый flow с внешним API-ключом (опционально)
pnpm -w run harness generate landing --brief content/briefs/<slug>.json --slug <slug>
pnpm -w run harness validate <slug>

# Иллюстрации
pnpm -w run harness generate illustration --spec content/illustrations/<file>.json
pnpm -w run harness generate illustration --spec ... --no-llm   # детерминированный stub
pnpm -w run harness generate illustration --spec ... --strict   # упасть при провале AST-валидатора

# Visual regression
pnpm --filter @buffalo/web test:visual              # прогон против baseline
pnpm --filter @buffalo/web test:visual:update       # перебить baseline после намеренных правок
```

---

## Куда что класть

| Что | Куда |
|-----|------|
| API ключи (LLM) — опционально | `.env.local` (шаблон в `.env.example`) |
| Дизайн-система | `design-system/kaiten-v01/` (источник истины — см. README внутри) |
| Новый бриф | `content/briefs/<slug>.json` |
| Новый компонент | `packages/ui/src/landing/` + регистрация в `packages/harness/src/registry/index.ts` |
| Новый skill / промпт | `packages/harness/src/skills/<name>.md` |
| Документация для команды | `docs/` |

---

## Правило обновления README

**README — это лицо проекта для команды маркетинга.** Любое изменение, которое
затрагивает то, что описано выше, обязано обновить README **в том же PR**.

Когда README **обязательно** трогать:

- Поменялся CLI (флаги, имена команд, новые подкоманды).
- Поменялась структура каталогов (`apps/`, `packages/`, `content/`, `design-system/`, `generated/`).
- Поменялись схемы (`LandingSpec`, `IllustrationSpec`, `BriefSchema`) — поля брифа в примере.
- Добавились / удалились env-переменные (`.env.example`).
- Поменялись шаги пайплайна или появилась новая стадия.
- Добавился новый skill или изменилось поведение существующего.

Это закреплено технически:

- **PR-шаблон** (`.github/pull_request_template.md`) содержит чек-лист «README обновлён?».
- **CI-проверка** `.github/workflows/readme-freshness.yml` — если PR трогает
  чувствительные пути (CLI / schemas / pipeline / structure / `.env.example`), но
  README не обновлён, бот оставляет комментарий и помечает проверку warning.

Не обходить эту проверку без явного «README не нужно» в описании PR.

---

## Глубже

- 📖 **[`docs/pipeline.md`](docs/pipeline.md)** — подробный разбор пайплайна для команды
- 📖 **[`AGENTS.md`](AGENTS.md)** — конвенции для LLM-сессий
- 📖 **[`wiki/AGENTS.md`](wiki/AGENTS.md)** — правила работы с wiki
- 📖 **[`design-system/kaiten-v01/README.md`](design-system/kaiten-v01/README.md)** — дизайн-система
- 📖 **[`packages/harness/src/skills/conversion-landing.md`](packages/harness/src/skills/conversion-landing.md)** — конверсионный плейбук
