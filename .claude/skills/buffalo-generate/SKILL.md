---
name: buffalo-generate
description: Run the Buffalo LLM harness end-to-end — turn a marketing brief into a production-ready Kaiten landing page (LandingSpec → TSX → Storybook/preview → handoff ZIP). Use when the user wants to generate, regenerate, or iterate on a landing for a brief; or when they reference Buffalo harness, a slug, a brief.json, or `pnpm -w run harness generate`.
---

# Buffalo — Generate landing E2E

Use this skill any time the user wants to assemble a Kaiten-style SaaS landing from a brief — whether they say "buffalo", "harness", "сгенерируй лендинг", "generate landing", "новый лендинг для X", or just hand you a brief JSON.

## Trigger phrases

- "сгенерируй лендинг по [brief]"
- "новый лендинг для [продукт]"
- "buffalo generate [slug]"
- "regenerate landing [slug]"
- "harness landing [slug]"
- "запусти пайплайн на [bri]"

## Preconditions

- Repo is the Buffalo harness monorepo (`pnpm-workspace.yaml` at root, `packages/harness`, `packages/ui`, `apps/web`).
- `pnpm install` has been run.
- One of: `VERCEL_OIDC_TOKEN` (Gateway), `ANTHROPIC_API_KEY`, or `OPENAI_API_KEY` is set in `.env.local`. Use `pnpm -w run harness providers` to verify.

If LLM credentials are missing, **stop** and ask the user before generating. Do NOT run with `--no-llm` unless they explicitly accept the deterministic fallback.

## End-to-end flow

### 1. Lock the brief

Open `content/briefs/<slug>.json`. If it does not exist:

- Ask the user for: product name, audience, primary goal (`book_demo` / `signup` / `download` / `start_trial`), main pain, main promise, 3 proof points, tone (default: "clear, practical, confident, no hype"), CTA label, `pageArchetype` (`saas` / `waitlist` / `enterprise`).
- Write the brief to `content/briefs/<slug>.json` matching `BriefSchema` from `@buffalo/harness/schemas`.
- Confirm the file before generating.

### 2. Generate the LandingSpec + TSX

```bash
pnpm -w run harness generate landing \
  --brief content/briefs/<slug>.json \
  --slug <slug> \
  --max-repair-attempts 3
```

This will:

1. Build the system prompt (Kaiten DS + conversion-landing skill + component registry).
2. Call AI SDK 6 `generateObject` against the chosen provider (Gateway-first).
3. Run brand-voice + business-rules validators; if violations, repair-loop retries with feedback (`--max-repair-attempts` controls the budget; default 2).
4. Write `content/landings/<slug>.json` (LandingSpec) and `generated/landings/<slug>/page.tsx`.

If the run ends with unresolved errors and no `--strict`, the partial spec is written so you can inspect it.

### 3. Generate illustrations (if `spec.illustrationSpecs[]` is non-empty)

For each id in `spec.illustrationSpecs`:

1. Either author or reuse `content/illustrations/<id>.json` (`IllustrationSpec`).
2. Run:

   ```bash
   pnpm -w run harness generate illustration \
     --spec content/illustrations/<id>.json \
     --max-repair-attempts 2
   ```

3. TSX + Storybook story land in `packages/ui/src/illustrations/<PascalCaseId>.{tsx,stories.tsx}`; the barrel auto-updates.

The AST validator enforces: one root `<svg>`, all colors via `dark` prop, ids with `-d`/`-l` suffix, `tabular-nums` on digit text, no `stopColor="transparent"`, dual-render fragment with `dark:hidden` and `hidden dark:block`.

### 4. Preview

```bash
pnpm dev                  # Next.js :3000
```

Open `http://localhost:3000/landings/<slug>` and verify the page visually. Check Storybook for new illustrations:

```bash
pnpm storybook            # :6006
```

### 5. Visual regression baseline (after first preview is OK)

```bash
pnpm --filter @buffalo/web test:visual:update   # write/refresh baseline
pnpm --filter @buffalo/web test:visual          # asserts equality going forward
```

### 6. Human approval

Drive the PM to `/approve/<slug>` in Next.js. They pick a status (`approved` / `changes_requested` / `rejected`) and optional comments. State persists to `content/approvals/<slug>.json`.

Verify via CLI:

```bash
pnpm -w run harness approvals status <slug>
```

### 7. Handoff to frontend

Once approved:

```bash
pnpm -w run harness handoff <slug> --require-approved
# → out/landing-<slug>.zip
```

The ZIP contains `page.tsx` with rewritten imports, only the used components and primitives, illustrations, `tokens.css` / `styles.css`, the original `spec.json`, `approval.json`, a README, and a minimal `package.json` snippet.

## When iterating

If the user wants a tweak ("change CTA", "darker hero"):

1. Edit the brief or directly edit `content/landings/<slug>.json`.
2. Re-run `harness validate <slug>` (or full regen if structure changed).
3. Refresh visual baseline if intentional: `test:visual:update`.

## Anti-patterns

- Never hand-edit `generated/landings/<slug>/page.tsx` — it's a derived artifact, regenerate from spec.
- Do not bypass `--require-approved` for production handoff without telling the user.
- Do not invent component names — only those in the registry (see `pnpm -w run harness registry`).
- Do not regenerate illustrations on every landing run — they are stable artifacts in `packages/ui/src/illustrations/`.
