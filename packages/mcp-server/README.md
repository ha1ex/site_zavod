# `@kaiten/mcp-server`

MCP-сервер обёртка вокруг Контент-завод Кайтен. Подключите его к Claude Desktop / VS Code Copilot / любому MCP-совместимому клиенту и работайте с лендингами через чат, без CLI.

## Что внутри

4 tool'а:

| Tool | Что делает |
|---|---|
| `list_landings` | Список всех slug'ов из `content/landings/` с размером и mtime. Без параметров. |
| `read_landing` | Загружает LandingSpec JSON по slug, валидирует через Zod, возвращает spec + summary (количество секций, layout, domain). |
| `validate_landing` | Прогоняет всю цепочку валидаторов (Zod + brand voice + business rules + visual diversity + layout conformance + audience score + domain-fit) на готовом лендинге. Опц. `strictDiversity`. |
| `build_landing` | Генерация: `harness agent build landing` — гейт домена + phased pipeline (P0–P8); непокрытый домен → manual-creation stop. Требует API-ключ для LLM или прохождение agent-mode flow через host-LLM. |

## Запуск из коробки (smoke-тест)

```bash
pnpm --filter @kaiten/mcp-server dev
```

Откроется stdio-сервер. Можете слать JSON-RPC вручную (для отладки) или сразу подключить к клиенту.

## Подключение к Claude Desktop

Откройте `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) или эквивалент:

```json
{
  "mcpServers": {
    "kaiten": {
      "command": "pnpm",
      "args": ["--filter", "@kaiten/mcp-server", "dev"],
      "cwd": "/absolute/path/to/calgary",
      "env": {
        "KAITEN_REPO_ROOT": "/absolute/path/to/calgary",
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

Перезапустите Claude Desktop. Должны появиться 4 kaiten-tools в шторке инструментов.

`KAITEN_REPO_ROOT` — обязателен, если cwd MCP-процесса отличается от корня репо (так бывает у Claude Desktop). `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` — нужны только для `build_landing` через LLM (не для list/read/validate).

## Подключение к VS Code Copilot

В файле `.vscode/mcp.json` (per-project):

```json
{
  "servers": {
    "kaiten": {
      "command": "pnpm",
      "args": ["--filter", "@kaiten/mcp-server", "dev"],
      "cwd": "${workspaceFolder}",
      "env": { "KAITEN_REPO_ROOT": "${workspaceFolder}" }
    }
  }
}
```

VS Code 1.96+ с Copilot Chat подхватит.

## Подключение к Codex CLI

Codex CLI поддерживает MCP через `~/.codex/config.toml`:

```toml
[mcp_servers.kaiten]
command = "pnpm"
args = ["--filter", "@kaiten/mcp-server", "dev"]
cwd = "/absolute/path/to/calgary"

[mcp_servers.kaiten.env]
KAITEN_REPO_ROOT = "/absolute/path/to/calgary"
```

## Примеры использования

После подключения:

> «Покажи все мои лендинги»
> → tool call: `list_landings` → список

> «Открой crm и опиши структуру»
> → tool call: `read_landing { slug: "crm" }` → spec + summary

> «Прогони validation на crm»
> → tool call: `validate_landing { slug: "crm" }` → результат валидаторов

> «Сгенери лендинг по brief test-product»
> → tool call: `build_landing { slug: "test-product" }` → запуск pipeline

## Build для production-использования

```bash
pnpm --filter @kaiten/mcp-server build
node packages/mcp-server/dist/index.js
```

Тогда в Claude Desktop config:

```json
{
  "mcpServers": {
    "kaiten": {
      "command": "node",
      "args": ["/absolute/path/to/calgary/packages/mcp-server/dist/index.js"],
      "env": { "KAITEN_REPO_ROOT": "/absolute/path/to/calgary" }
    }
  }
}
```

Это быстрее старта (без pnpm + tsx warm-up).

## Когда что использовать

| Сценарий | Где |
|---|---|
| Маркетолог не знает CLI, просто хочет лендинг | M2 веб-форма `/new` |
| Маркетолог хочет редактировать готовый лендинг визуально | M3 редактор `/edit/[slug]` |
| PM/инженер хочет управлять лендингами из чата (Claude Desktop) | MCP-сервер (этот пакет) |
| Bash-скрипты / CI | CLI `pnpm -w run harness ...` |

Все 4 пути работают над одной и той же базой (`content/briefs/`, `content/landings/`) — выбор только в UX.
