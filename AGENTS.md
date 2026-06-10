# AGENTS.md — контракт для любого host-агента

Единый bootstrap-документ для LLM-сессий в этом репо: **Claude Code, OpenAI Codex CLI, Gemini CLI (agy), Cursor и любой будущий агент**. Прочитай и выполни до начала работы.

«Контент-завод Кайтен» — LLM-harness для генерации SaaS-лендингов. Pipeline: `сырьё → intake (ТЗ + brief) → phased P0–P8 → LandingSpec → TSX → validators → preview → approve → handoff`. Harness **сам не вызывает LLM и не требует API-ключей** — host-агент (ты) и есть LLM.

## Ритуал сессии (ОБЯЗАТЕЛЬНО — шаг 0)

```bash
[ -d node_modules ] || pnpm install   # ТОЛЬКО если зависимостей ещё нет (заодно включает git-гейты)
pnpm -w run harness agent context     # каждый новый сеанс; + --slug <slug>, если slug известен
```

> ⚠️ Не перезапускай `pnpm install` при живом `node_modules/`: в sandbox без сети (Codex workspace-write) повторный install ломает зависимости.

Выполни и следуй выводу: там детект твоего инструмента, горячий контекст репо (брифы, лендинги, уроки), карточка Hard gates и подсказки под тебя. Автодетект не сработал — `export HARNESS_AGENT=codex` (или флаг `--agent`). Claude Code: SessionStart-хук делает это автоматически, повторный запуск безвреден. **Не начинай pipeline-работу, пока не выполнен шаг 0.**

## Как работает сборка (host-agent цикл)

1. Точка входа: `pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json` — проверяет гейты, роутит домен (непокрытый домен = STOP с todo-списком mock'ов) и ведёт фазы P0–P8.
2. Когда фазе нужен LLM, CLI пишет `.context/pipeline/<slug>/p<N>-*.prompt.md` и останавливается (`awaiting-host-agent`).
3. Ты читаешь prompt-файл и пишешь JSON-ответ в путь, указанный в нём.
4. Снова запускаешь ту же команду `agent build` — CLI валидирует JSON (schema + semantic), при ошибках пишет `<имя>.repair.md` (до 3 попыток на фазу) и идёт дальше. Pipeline идемпотентен: готовые фазы пропускаются.
5. Повторяй до зелёного P8 → `agent apply` валидирует spec (brand + business + audience-score) и рендерит TSX в `generated/landings/<slug>/`.

## Hard gates (машинно-enforced, не пожелания)

<!-- gates:start -->
- `content/briefs/**` — IMMUTABLE. Новая итерация = новый файл `content/briefs/<slug>-v2.json`. Правка существующего брифа блокируется на трёх слоях: git pre-commit (`.githooks/`) + harness CLI + Claude-hook.
- Единственная точка входа генерации — `pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json`. Legacy-команду `harness generate` (путь с API-ключами) использовать нельзя.
- Mock'и в лендинге — только из домена брифа ([wiki/references/domain-mock-matrix.md](wiki/references/domain-mock-matrix.md)). Cross-domain reuse запрещён, непокрытый домен останавливает pipeline (валидатор + routing-гейт).
- `generated/landings/**` и `packages/ui/src/tokens.css` руками не правятся — это derived-артефакты (`agent apply`, `harness wiki sync`).
- `wiki/log.md` — append только в конец.
- Обход гейтов — осознанный и только по согласованию с пользователем: `HARNESS_SKIP_GATES=1` / `--skip-gates` / `git commit --no-verify`.
<!-- gates:end -->

## Какой ты агент

| Агент | Авточтение контракта | Hooks | Skills | Что делать |
|---|---|---|---|---|
| Claude Code | `CLAUDE.md` → сюда; хуки `.claude/settings.json` | да (9) | да (4) | шаг 0 выполняет SessionStart-хук; команды те же |
| OpenAI Codex CLI | `AGENTS.md` (автоматически) | нет | нет | шаг 0 вручную; гейты работают через git + harness CLI |
| Gemini CLI / agy | `GEMINI.md` → сюда | нет | нет | как Codex; `export HARNESS_AGENT=gemini` |
| Другой / будущий | — | нет | нет | прочитай этот файл; `export HARNESS_AGENT=<name>`; шаг 0 вручную |

`.claude/skills/*/SKILL.md` — обычный markdown: агенты без скилл-системы **читают эти файлы как документацию** (см. таблицу ниже).

## Куда смотреть в первую очередь

| Если задача про… | Читать |
|---|---|
| **Маркетинг — пошагово, без CLI-магии** | [`SKILL.md`](SKILL.md) + [`wiki/marketing/getting-started.md`](wiki/marketing/getting-started.md) |
| Генерация лендинга от и до (engineer-flow) | [`.claude/skills/kaiten-generate/SKILL.md`](.claude/skills/kaiten-generate/SKILL.md) |
| Фабрика ТЗ: сырьё → ТЗ + brief | [`.claude/skills/kaiten-intake/SKILL.md`](.claude/skills/kaiten-intake/SKILL.md) |
| Ревью существующего лендинга | [`.claude/skills/kaiten-review/SKILL.md`](.claude/skills/kaiten-review/SKILL.md) |
| Дизайн-система Kaiten (цвета, типографика, сетка) | [`.claude/skills/design-system-kaiten-v01/SKILL.md`](.claude/skills/design-system-kaiten-v01/SKILL.md) |
| Фазы P0–P8 и их гейты | [`docs/pipeline.md`](docs/pipeline.md) + [`wiki/pipeline/phase-gates.md`](wiki/pipeline/phase-gates.md) |
| Доработать готовый лендинг | [`wiki/marketing/edit-recipes.md`](wiki/marketing/edit-recipes.md) |
| Что-то пошло не так | [`wiki/marketing/troubleshooting.md`](wiki/marketing/troubleshooting.md) |
| Поля brief.json расшифровка | [`wiki/marketing/brief-fields.md`](wiki/marketing/brief-fields.md) |
| Conversion-копи / правила секций | [`packages/harness/src/skills/conversion-landing.md`](packages/harness/src/skills/conversion-landing.md) |
| Конвенции wiki (где что лежит, что immutable) | [`wiki/AGENTS.md`](wiki/AGENTS.md) |
| Запуск под Codex / Gemini / другим агентом | [`wiki/marketing/run-with-codex.md`](wiki/marketing/run-with-codex.md) |
| Маркетинговый обзор всего инструмента | [`README.md`](README.md) |

## Структура репо

```
apps/web/                       Next.js preview + API routes (/new, /intake/<slug>, /approve/<slug>)
packages/harness/               Ядро: schemas, registry, prompts, pipeline P0–P8, CLI, validators, render
packages/ui/                    Landing-компоненты, mocks, illustrations, Storybook, tokens.css
content/briefs/                 Брифы (IMMUTABLE — новый brief = новый файл)
content/landings/               LandingSpec JSON (пишется pipeline'ом; ручная правка — при отладке)
generated/landings/             TSX output (derived, руками не править)
design-system/kaiten-v01/       SSoT дизайн-системы (tokens.json + артефакты дизайн-команды)
wiki/                           LLM-maintained knowledge (audiences, lessons, references, pipeline)
.claude/skills/                 Плейбуки (markdown) — читаются любым агентом, Claude подхватывает сам
.context/                       Рабочие артефакты (pipeline, intake, audience-score) — gitignored
.githooks/                      Git-слой жёстких гейтов (pre-commit)
```

## Workflow

1. **Сырьё → ТЗ + brief (intake)**: `pnpm -w run harness agent intake landing --slug <slug> --request <файл> --inputs inputs/<slug>` → заполни `intake.json` → `pnpm -w run harness agent intake-apply landing --slug <slug>` (brief-quality — жёсткий гейт). Ревью ТЗ: `/intake/<slug>`.
2. **Сборка**: `pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json` — host-agent цикл выше, до зелёного P8.
3. **Превью**: `pnpm dev` → `http://localhost:3000/landings/<slug>`. Лендинг «готов» только после Playwright-скриншота и сверки с design-system (HTTP 200 — не критерий). Audience-score gate проверяется в `agent apply` (standalone: `harness agent score landing --slug <slug> --brief <path>`, конфиг [`wiki/audiences/kaiten-scoring.md`](wiki/audiences/kaiten-scoring.md)).
4. **Approve**: web `/approve/<slug>` (или `harness approve <slug>`).
5. **Handoff**: `pnpm -w run harness handoff <slug> --require-approved` → ZIP в `out/`.
6. **Здоровье репо**: `pnpm -w run harness lint` (drift wiki/tokens/registry/agent-контракта).

## Перед завершением сессии

```bash
pnpm -w run harness agent checklist   # uncommitted / pending typecheck / Playwright / wiki-sync
```

## Связанные файлы

- [`SKILL.md`](SKILL.md) — кросс-инструментальный playbook `kaiten-build-landing` (маркетинговый, для всех ассистентов).
- [`CLAUDE.md`](CLAUDE.md) / [`GEMINI.md`](GEMINI.md) — тонкие указатели сюда для соответствующих инструментов.
- [`content/briefs/AGENTS.md`](content/briefs/AGENTS.md) — локальное правило неизменяемости брифов.
- [`scripts/hooks/README.md`](scripts/hooks/README.md) — три слоя enforcement и контракт hook-скриптов.
- [`packages/harness/src/skills/`](packages/harness/src/skills/) — встроенные методички system prompt'ов.
