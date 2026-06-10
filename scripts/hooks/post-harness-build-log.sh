#!/usr/bin/env bash
# PostToolUse (Bash): после запуска `harness agent build` — структурируем
# выход в .context/pipeline/<slug>/runs/<timestamp>.log + index.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_lib.sh
source "$SCRIPT_DIR/_lib.sh"

INPUT="$(read_input)"
TOOL="$(jq_get "$INPUT" '.tool_name')"
CMD="$(jq_get "$INPUT" '.tool_input.command')"
RESULT="$(jq_get "$INPUT" '.tool_result')"

[[ "$TOOL" == "Bash" ]] || exit 0

# Триггер: команда содержит harness agent build (или ручные phased entry-points).
if ! echo "$CMD" | grep -qE 'harness agent (build|run|run-phase)'; then
  exit 0
fi

# Извлекаем slug: --slug <X>
SLUG="$(echo "$CMD" | grep -oE -- '--slug [a-z][a-z0-9-]+' | awk '{print $2}' | head -1 || true)"
[[ -n "$SLUG" ]] || SLUG="unknown"

TS="$(date +%Y%m%d-%H%M%S)"
RUN_DIR="$PROJECT_DIR/.context/pipeline/$SLUG/runs"
mkdir -p "$RUN_DIR"
LOG_FILE="$RUN_DIR/$TS.log"

{
  echo "## Run $TS"
  echo "**Command:** \`$CMD\`"
  echo ""
  echo "### Output"
  echo '```'
  echo "$RESULT" | head -300
  echo '```'
} > "$LOG_FILE"

# Парсим summary-сигналы из output для index.
ROUTE="$(echo "$RESULT" | grep -oE 'route[:=][ ]*(phased|manual-creation-required)' | head -1 || true)"
PASS="$(echo "$RESULT" | grep -ciE '(✓|pass(ed)?|ok)' || true)"
FAIL="$(echo "$RESULT" | grep -ciE '(✗|fail(ed)?|error)' || true)"

INDEX="$PROJECT_DIR/.context/pipeline/$SLUG/index.md"
mkdir -p "$(dirname "$INDEX")"
[[ -f "$INDEX" ]] || echo "# Pipeline runs: $SLUG" > "$INDEX"
echo "- [$TS](runs/$TS.log) — ${ROUTE:-route?} | ✓$PASS ✗$FAIL" >> "$INDEX"

CTX="📊 Pipeline run logged: .context/pipeline/$SLUG/runs/$TS.log\n"
CTX+="Index: .context/pipeline/$SLUG/index.md\n"
[[ -n "$ROUTE" ]] && CTX+="Detected: $ROUTE"

emit_additional_context "PostToolUse" "$(printf '%b' "$CTX")"
