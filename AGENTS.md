# AGENTS.md

Schema-документ для любой LLM-сессии в этом репо (Claude Code, OpenAI Codex, и т.д.). Read this first when working with the repo.

athens — LLM-harness для генерации SaaS-лендингов. Pipeline: `brief → context → registry → LandingSpec → TSX → validators → repair → preview → handoff`.

## Куда смотреть в первую очередь

| Если задача про… | Читать |
|---|---|
| Генерация лендинга от и до | `.claude/skills/buffalo-generate/SKILL.md` _(после merge stage-7)_ |
| Ревью существующего лендинга | `.claude/skills/buffalo-review/SKILL.md` _(после merge stage-7)_ |
| Дизайн-система Kaiten (цвета, типографика, сетка) | `design-system/kaiten-v01/README.md` _(после merge ha1ex/design-system-source)_ |
| Conversion-копи / правила секций лендинга | `packages/harness/src/skills/conversion-landing.md` _(после merge ha1ex/landing-skill)_ |
| Конвенции wiki (где что лежит, что immutable) | [`wiki/AGENTS.md`](wiki/AGENTS.md) |
| Маркетинговый обзор: что такое buffalo, как работает | [`README.md`](README.md) |
| План миграции к Karpathy-Wiki паттерну | [`.context/plans/karpathy-llm-wiki-athens-harness.md`](.context/plans/karpathy-llm-wiki-athens-harness.md) |

## Структура репо

```
apps/web/                       Next.js 16 preview + API routes (generate, validate, handoff)
packages/harness/               Ядро: schemas, registry, prompts, skills, pipeline, CLI, validators, render
packages/ui/                    Landing-компоненты, primitives, illustrations, Storybook, tokens.css
content/briefs/                 Raw briefs (IMMUTABLE — новый brief = новый файл)
content/landings/               Generated specs (regeneratable; пишется harness generate)
generated/landings/             TSX output (regeneratable; пишется harness generate)
design-system/kaiten-v01/       SSoT дизайн-системы (HTML/PDF/PNG от дизайн-команды) [после merge]
wiki/                           LLM-maintained knowledge: audiences, patterns, lessons, landings, design-system derived
.claude/skills/                 Project-level Claude Code skills (design-system, buffalo-generate, buffalo-review)
.context/                       Workspace context (gitignored для большинства файлов; .context/plans/ — exception)
out/                            Handoff ZIP packages (gitignored)
```

## Что immutable

- `content/briefs/**` — никогда не редактировать. Новый brief = новый файл.
- `packages/harness/src/schemas/**.ts` — Zod-схемы — это контракт. Меняются осознанно, не реактивно.
- `packages/ui/src/landing/*.tsx` — registry-компоненты. Новый компонент **сначала** добавляется в `packages/harness/src/registry/index.ts`, потом используется в spec.
- `design-system/kaiten-v01/*.html|pdf|png` — артефакты дизайн-команды. Source of truth. _(после merge)_

## Что LLM может редактировать

- `wiki/**` — по правилам [`wiki/AGENTS.md`](wiki/AGENTS.md).
- `content/landings/<slug>.json` — только через `harness generate` (или ручно при отладке).
- `design-system/kaiten-v01/tokens.json` — только при явной правке DS (синхронно с HTML/PDF).
- `packages/harness/src/skills/*.md` — встроенные методички; правятся осознанно при изменении правил конверсии/контент-маркетинга.

## Workflow

1. **Новый brief** → `harness ingest brief <path> --slug <slug>` _(M3)_ — обновит `wiki/audiences/`, добавит entry в `wiki/log.md`.
2. **Генерация** → `harness generate landing --brief content/briefs/<slug>.json --slug <slug>` — пишет `content/landings/<slug>.json` + `generated/landings/<slug>/page.tsx` + `wiki/landings/<slug>.md` (status=draft) + log.
3. **Превью** → `pnpm dev` → http://localhost:3000/landings/<slug>. Превью становится «готовым к показу» только после прохождения audience-score gate (`agent apply` его проверяет автоматически; standalone — `harness agent score landing --slug <slug> --brief <path>`). Конфиг: [`wiki/audiences/kaiten-scoring.md`](wiki/audiences/kaiten-scoring.md).
4. **Approve** _(после merge stage-5)_ → через web UI `/approve/<slug>` или CLI — обновит landing-страницу + log.
5. **Handoff** _(после merge stage-6)_ → `harness handoff <slug>` → ZIP в `out/` + log entry.
6. **Feedback** → `harness ingest feedback <slug> "<note>"` _(M3-M4b)_ → добавит в `## Reviewer notes`, опц. в `wiki/lessons.md`.
7. **Health check** → `harness lint` _(M3)_ — проверки drift'а; в CI через `.github/workflows/wiki-freshness.yml` _(M6)_.

## Banned

- Hardcoded цвета в `packages/ui/**` вне `tokens.css` — используйте CSS-переменные.
- Ручная правка `packages/ui/src/tokens.css` — он автогенерируется из `design-system/kaiten-v01/tokens.json` через `harness wiki sync` _(M2)_. До M2 — можно править руками.
- Ручная правка `wiki/index.md` (после M3) — автогенерируется.
- Append `wiki/log.md` в середину/начало — только в конец.
- Удаление страниц wiki без `harness lint` после — могут остаться orphan refs.

## Связанные файлы

- [`CLAUDE.md`](CLAUDE.md) _(если есть)_ — Claude Code-specific инструкции.
- [`README.md`](README.md) — маркетинговый обзор harness'а.
- [`packages/harness/src/skills/README.md`](packages/harness/src/skills/README.md) — конвенции встроенных скиллов _(после merge)_.
- [`wiki/AGENTS.md`](wiki/AGENTS.md) — конвенции wiki.
