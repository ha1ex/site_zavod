# GEMINI.md

Единый контракт для всех host-агентов — **[AGENTS.md](AGENTS.md)**. Прочитай его первым.

Обязательный шаг 0 сессии: `pnpm -w run harness agent context` (автодетект молчит — `export HARNESS_AGENT=gemini`). Хуков и скиллов Claude здесь нет — вывод шага 0 и есть твой bootstrap; жёсткие гейты работают через git pre-commit + harness CLI.
