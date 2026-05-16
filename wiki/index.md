# wiki — каталог

> Этот файл будет автогенерироваться командой `harness wiki index` после реализации M3.
> Сейчас он содержит только статичный обзор структуры — обновляется руками.

## Корневые файлы

- [AGENTS.md](AGENTS.md) — конвенции wiki: front-matter, naming, immutable/editable, lint-правила.
- [log.md](log.md) — append-only хроника операций harness (generate, ingest, lint, approve, handoff).
- [lessons.md](lessons.md) — cumulative правила, извлечённые из прошлых генераций и фидбэка.

## Категории (директории)

- `design-system/` — derived из `design-system/kaiten-v01/tokens.json`: colors, typography, spacing, grid, radius, motion, voice; usage-rules компонентов в `components/`.
- `archetypes/` — описания типов лендингов (`saas_landing`, `waitlist_landing`, `enterprise_landing`) и их обязательных секций.
- `audiences/` — профили целевых аудиторий (создаются `harness ingest brief`).
- `patterns/` — выжимки удачных паттернов из прошлых лендингов: `headlines/`, `proof-points/`, `ctas/`.
- `landings/` — filed back результаты успешных генераций: brief-ref, использованные sources, LLM-extract lessons, reviewer notes.

## External knowledge (не в wiki/, но связано)

- [design-system/kaiten-v01/](../design-system/kaiten-v01/) — SSoT дизайн-системы (HTML/PDF/PNG). _Появится после merge ветки `ha1ex/design-system-source`._
- [packages/harness/src/skills/](../packages/harness/src/skills/) — встроенные методички системного промпта (`conversion-landing.md`, `content-marketing.md`). _Появится после merge ветки `ha1ex/landing-skill`._
- [packages/harness/src/prompts/svg-illustration-skill.md](../packages/harness/src/prompts/svg-illustration-skill.md) — skill для генерации одиночных SVG-сцен (Hero illustration) как TSX-файлов с AST-валидатором.
- [packages/harness/src/prompts/section-mock-skill.md](../packages/harness/src/prompts/section-mock-skill.md) — skill для HTML/Tailwind UI-моков внутри секций (board / chat / kpi / article / checklist / console).
- [.claude/skills/buffalo-generate/SKILL.md](../.claude/skills/buffalo-generate/SKILL.md) — workflow генерации лендинга (включает шаг 3a Mock authoring).
- [.claude/skills/buffalo-review/SKILL.md](../.claude/skills/buffalo-review/SKILL.md) — workflow review лендинга. _Появится после merge ветки со stage-7._
- [.claude/skills/design-system-kaiten-v01/SKILL.md](../.claude/skills/design-system-kaiten-v01/SKILL.md) — Claude Code skill для DS.

## Статус реализации

| Этап | Статус | Файлы |
|---|---|---|
| M1 — skeleton | ✅ | `wiki/AGENTS.md`, `wiki/index.md`, `wiki/log.md`, `wiki/lessons.md`, `AGENTS.md` |
| M2 — tokens.json + DS extraction | ⏳ блокирован merge'ем `ha1ex/design-system-source` | `design-system/kaiten-v01/tokens.json`, `wiki/design-system/*.md` |
| M3 — ingest + lint + log + wiki/index | ⏳ pending | `packages/harness/src/wiki/`, `packages/harness/src/commands/` |
| M4a — selective context | ⏳ блокирован merge'ем `ha1ex/landing-skill` | `packages/harness/src/wiki/select-context.ts` |
| M4b — filing back | ⏳ блокирован merge'ем stage-5/6 | `packages/harness/src/wiki/file-landing.ts` |
| M4c — lessons-aware repair | ⏳ блокирован merge'ем stage-4 | `packages/harness/src/wiki/lessons-loader.ts` |
| M6 — wiki-freshness CI | ⏳ pending | `.github/workflows/wiki-freshness.yml` |

Детальный план — `.context/plans/karpathy-llm-wiki-athens-harness.md`.
