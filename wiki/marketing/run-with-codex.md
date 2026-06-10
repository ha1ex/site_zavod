# Запуск Контент-завода под Codex / Gemini / любым агентом

> Пайплайн P0–P8 не привязан к Claude Code. Ядро — обычный Node CLI без API-ключей: host-агент (та нейронка, что ведёт сессию) сам пишет JSON-артефакты фаз. Этот гайд — как запускать сборку под OpenAI Codex CLI (GPT), Gemini CLI (agy) и любым будущим инструментом.

## Откуда агент узнаёт правила

| Инструмент | Что читает автоматически | Что делает на старте |
|---|---|---|
| Claude Code | `CLAUDE.md` + хуки `.claude/settings.json` + скиллы | всё само (SessionStart-хук) |
| Codex CLI | `AGENTS.md` (корень репо + вложенные) | шаг 0 вручную (см. ниже) |
| Gemini CLI / agy | `GEMINI.md` → `AGENTS.md` | шаг 0 вручную |
| Любой другой | попроси прочитать `AGENTS.md` | шаг 0 вручную + `HARNESS_AGENT` |

Контракт один — [`AGENTS.md`](../../AGENTS.md). Плейбуки в `.claude/skills/*/SKILL.md` — обычный markdown, любой агент читает их как документацию.

## Один раз на машину

```bash
pnpm install   # запускай в обычном терминале, НЕ внутри sandbox-сессии агента
```

Заодно включаются git-гейты: `prepare` → `scripts/setup-githooks.mjs` → `git config core.hooksPath .githooks`.

> ⚠️ В sandbox Codex сеть отключена (`CODEX_SANDBOX_NETWORK_DISABLED=1`): повторный `pnpm install` при живом `node_modules/` там ломает зависимости. Ритуал в AGENTS.md поэтому условный: `[ -d node_modules ] || pnpm install`. Если агент всё же сломал node_modules — просто запусти `pnpm install` в обычном терминале ещё раз.

## Codex CLI (GPT)

**Интерактивно** — из корня репо:

```bash
cd <repo>
codex
# первым сообщением: «Выполни шаг 0 из AGENTS.md, потом собери лендинг по content/briefs/<slug>.json (slug <slug>)»
```

**Non-interactive (`codex exec`)** — флаги сверены с codex-cli 0.130.0:

```bash
codex exec -C <repo> -s workspace-write \
  "Выполни шаг 0 из AGENTS.md (pnpm -w run harness agent context), затем собери лендинг по брифу content/briefs/<slug>.json (slug <slug>) до зелёного P8"
```

- `-s workspace-write` — обязателен для сборки: в `read-only` pnpm падает на записи кэша.
- `--ephemeral` — для разовых проверок без сохранения сессии.
- `codex exec resume --last` — продолжить прошлую сессию (фазы идемпотентны, pipeline подхватится с места остановки).

**Опционально — MCP-сервер Кайтена** в `~/.codex/config.toml` (инструменты `list_landings`, `build_landing` и т.д.): блок конфига — в [`packages/mcp-server/README.md`](../../packages/mcp-server/README.md).

## Gemini CLI / agy

```bash
cd <repo>
export HARNESS_AGENT=gemini       # автодетект Gemini надёжен не во всех версиях
agy                                # или gemini
# первым сообщением: «Прочитай GEMINI.md и выполни шаг 0»
```

## Любой будущий агент

```bash
export HARNESS_AGENT=<имя>        # любая строка; профили: codex | gemini | claude-code
pnpm -w run harness agent context # печатает контекст + правила + подсказки
```

Детект — best-effort и ни на что не влияет, кроме подсказок: жёсткие гейты работают одинаково при любом результате детекта.

## Как ведёт себя сборка (host-agent цикл)

1. `pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json`
2. CLI пишет `.context/pipeline/<slug>/p<N>-*.prompt.md` и останавливается (`awaiting-host-agent`).
3. Агент читает prompt-файл, пишет JSON-ответ в указанный путь.
4. Снова `agent build` — валидация, при ошибках `<имя>.repair.md` (до 3 попыток), дальше следующая фаза.
5. До зелёного P8 → `agent apply` → превью `http://localhost:3000/landings/<slug>`.

## Гейты без Claude-хуков

Жёсткие правила работают на трёх слоях — под любой нейронкой одинаково:

1. **git pre-commit** (`.githooks/pre-commit`): коммит с правкой существующего `content/briefs/*.json` блокируется (новые файлы `<slug>-v2.json` проходят).
2. **harness CLI**: `agent build/apply/run/run-phase/intake-apply` отказываются работать, пока изменённый бриф не откачен (`git checkout -- content/briefs/`).
3. **Claude-хуки** — третий слой, только под Claude Code.

Как выглядит блок: сообщение `🛑 BLOCKED: content/briefs/ — IMMUTABLE …` со списком файлов и инструкцией. Осознанный обход (по согласованию с владельцем): `HARNESS_SKIP_GATES=1` (CLI: `--skip-gates`; git: `--no-verify`).

## Чек-лист перед завершением сессии

```bash
pnpm -w run harness agent checklist   # uncommitted / pending typecheck / Playwright / wiki-sync
```

## Если что-то не так

- Агент «не знает» про пайплайн → он не выполнил шаг 0: попроси выполнить `pnpm -w run harness agent context` и следовать выводу.
- `agent context` печатает «bash-хуки недоступны» → проверь, что установлен `jq` (`brew install jq`).
- Гейт сработал неожиданно → смотри `git status content/briefs/`; откат: `git checkout -- content/briefs/`.
- Остальное — [`troubleshooting.md`](troubleshooting.md).
