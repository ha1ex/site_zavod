# Контент-завод Кайтен Claude Code hooks

Детерминированные шаги, которые Claude Code дёргает автоматически. Источник
правды: [`.claude/settings.json`](../../.claude/settings.json), официальный
[hooks reference](https://code.claude.com/docs/en/hooks-guide).

> **Хуки — только один из трёх слоёв.** Под Codex/Gemini/другими агентами хуков
> нет, паритет обеспечивают provider-нейтральные слои (см. таблицу ниже).

## Три слоя enforcement (briefs immutable)

| Слой | Где | Под каким агентом работает |
|---|---|---|
| 1. git pre-commit | [`.githooks/pre-commit`](../../.githooks/pre-commit) (активация: `pnpm install` → `scripts/setup-githooks.mjs`) | любой (и человек) |
| 2. harness CLI | `packages/harness/src/gates/brief-immutable.ts` — первая строка `agent build/apply/run/run-phase/intake-apply` | любой |
| 3. Claude PreToolUse | `pre-brief-immutable.sh` — блок Edit/Write ДО записи (лучший UX) | только Claude Code |

Обход всех слоёв один: `HARNESS_SKIP_GATES=1` (CLI: `--skip-gates`; git также `--no-verify`) — осознанно, по согласованию с пользователем.

## Переиспользование скриптов командами CLI

`harness agent context` / `agent checklist` (bootstrap для не-Claude агентов) шеллятся
к `session-start-context.sh`, `user-prompt-slug-loader.sh`, `stop-release-checklist.sh`
и парсят их JSON-протокол. **Сохраняйте формат `emit_additional_context` /
`emit_system_message`** — это контракт не только Claude-хуков, но и CLI.

## Карта хуков

| Событие | Скрипт | Что делает | Блокирует? |
|---|---|---|---|
| `SessionStart` | `session-start-context.sh` | Грузит горячий контекст: коммиты, briefs, lessons, домены, reminders | нет |
| `UserPromptSubmit` | `user-prompt-slug-loader.sh` | Если в промпте есть slug brief'а — подгружает brief + spec + approval | нет |
| `PreToolUse` Edit/Write | `pre-brief-immutable.sh` | Запрещает перезапись существующих `content/briefs/*.json` | **да (exit 2)** |
| `PreToolUse` Write/Edit | `pre-mock-domain-fit.sh` | При создании нового `*Mock.tsx` — чек-лист domain-fit (matrix + registry + reference) | нет (warning) |
| `PostToolUse` Edit/Write | `post-landing-typecheck.sh` | Помечает изменённые `.ts(x)` пакеты в `.context/typecheck-pending.txt` | нет |
| `PostToolUse` Bash | `post-harness-build-log.sh` | После `harness agent build` — структурирует output в `.context/pipeline/<slug>/runs/` + index | нет |
| `Stop` | `stop-release-checklist.sh` | Финальный чек-лист: uncommitted, pending typecheck, нужен ли Playwright-снимок, sync wiki | нет (systemMessage) |
| `PreCompact` | `pre-compact-state-save.sh` | Снимок состояния pipeline в `.context/resume/` для постcompact-восстановления | нет |
| `SubagentStop` | `subagent-stop-lessons.sh` | После Plan/Explore — подмешивает top-3 lessons как доп.контекст | нет |

## Контракт скриптов

- **Вход:** JSON через stdin (схема: см. hooks-reference).
- **Выход:** JSON в stdout — либо `{hookSpecificOutput:{additionalContext}}`, либо `{systemMessage}`. Пустой stdout = тихо.
- **Exit code:** `0` = ok, `2` = блок (только `PreToolUse` и `UserPromptSubmit`).
- **Общие helpers:** [`_lib.sh`](_lib.sh) — `read_input`, `jq_get`, `emit_additional_context`, `emit_system_message`.
- **CWD/env:** `$CLAUDE_PROJECT_DIR` указывает на корень проекта.

## Отключить хуки локально

Создай `.claude/settings.local.json` с `"disableAllHooks": true` или временно
запусти `claude --no-hooks ...`.

## Добавить новый хук

1. Скрипт в `scripts/hooks/<event>-<purpose>.sh`, `chmod +x`.
2. Source `_lib.sh`, читать stdin через `read_input`.
3. Зарегистрировать в `.claude/settings.json` под нужным событием.
4. Протестировать локально: `echo '{...}' | bash scripts/hooks/your.sh`.
5. Добавить строку в таблицу выше.

## Что мы НЕ делаем хуками (намеренно)

- **Тяжёлый typecheck/lint на каждый Edit** — медленно (5-30s), блокировало бы
  итеративную правку. Вместо этого ведём очередь в `.context/typecheck-pending.txt`,
  агент прогоняет `pnpm -r typecheck` перед коммитом (Stop-хук напомнит).
- **Auto-push в main** — `git push` имеет blast radius за пределами локалки,
  policy-rule «после задачи push в main» оставляем агенту (он спросит/решит
  сам по контексту), хук только сигналит про uncommitted.
- **Жёсткий блок mock'а по пути** — папка mocks плоская, имя ≠ домен. Hook
  даёт чек-лист, физическую защиту обеспечивает `illustration-domain-match` валидатор.
