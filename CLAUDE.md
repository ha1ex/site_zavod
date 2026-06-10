# CLAUDE.md

Единый контракт для всех host-агентов — **[AGENTS.md](AGENTS.md)**. Прочитай его первым.

Claude Code-специфика: SessionStart-хук сам выполняет шаг 0 (горячий контекст), скиллы из `.claude/skills/` подхватываются автоматически. Правила и Hard gates из AGENTS.md обязательны и здесь — те же гейты работают на трёх слоях: git pre-commit + harness CLI + Claude-хуки.
