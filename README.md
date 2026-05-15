# Buffalo — LLM Harness для генерации SaaS-лендингов

Управляемый контур вокруг LLM: `brief → context → allowed components → LandingSpec → TSX render → validators → repair loop → preview → handoff-пакет`.

## Стек

- **Next.js 16** (App Router) — preview лендингов
- **Storybook 9** — registry компонентов + visual workshop
- **TailGrids v3** — базовый набор landing-блоков (купленный)
- **Vercel AI SDK** — провайдер-агностичный LLM-слой (Claude + GPT)
- **zod** — output contracts (LandingSpec, IllustrationSpec, BriefSchema)
- **Playwright** — visual regression
- **pnpm workspaces** — монорепо

## Структура

```
apps/web/              Next.js preview + API routes (generate, validate, handoff)
packages/harness/      ядро: schemas, registry, prompts, skills, pipeline, CLI
packages/ui/           компоненты-обёртки + Storybook (landing, primitives, illustrations)
packages/config/       shared eslint/tsconfig/tailwind
content/landings/      сохранённые LandingSpec (input)
generated/landings/    output build step (TSX + spec + manifest)
design-system/kaiten-v01/  источник истины дизайн-системы (HTML/PDF/PNG)
.context/attachments/      рабочие материалы и черновики (gitignored)
```

## Команды

```bash
pnpm install                                                          # один раз
pnpm dev                                                              # Next.js preview на :3000
pnpm storybook                                                        # Storybook на :6006

# CLI (pnpm 10: root-скрипты вызываются через `pnpm -w run`)
pnpm -w run harness --help
pnpm -w run harness generate landing      --brief content/briefs/buffalo.json --slug buffalo
pnpm -w run harness generate illustration --spec  content/illustrations/sample-buffalo.json
pnpm -w run harness validate <slug>
pnpm -w run harness handoff  <slug>                                   # → out/landing-<slug>.zip
```

### Illustration (этап 3)

```bash
# детерминированный stub (без LLM) — пишет TSX + .stories.tsx + обновляет barrel
pnpm -w run harness generate illustration --spec content/illustrations/sample-buffalo.json --no-llm

# LLM-режим: ANTHROPIC_API_KEY / OPENAI_API_KEY / vercel env pull (OIDC для Gateway)
pnpm -w run harness generate illustration --spec content/illustrations/sample-buffalo.json

# --strict: упасть при провале AST-валидатора (по умолчанию пишет файл + лог ошибок)
pnpm -w run harness generate illustration --spec ... --strict
```

Выход кладётся в `packages/ui/src/illustrations/<PascalCaseId>.tsx`, story рядом, экспорт автоматически прописывается в `packages/ui/src/illustrations/index.ts`.

## Куда что класть

- **API ключи** → `.env.local` (из `.env.example`)
- **Дизайн-система** → `design-system/kaiten-v01/` (источник истины — см. README внутри)
- **Brief** → `content/briefs/<name>.json` или через UI

## План реализации

Подробный план — `/Users/halex/.claude/plans/system-instruction-you-are-working-memoized-neumann.md`.
Прогресс по этапам — через `TaskList` в Conductor.
