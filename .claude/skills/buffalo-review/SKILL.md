---
name: buffalo-review
description: Review a generated Buffalo landing before handoff — run all validators, check visual regression, walk the /approve page, and prepare a structured comment list for the team. Use when the user wants to QA a landing, check what's wrong, or block/approve a draft.
---

# Buffalo — Review a generated landing

Use this skill any time the user wants to QA, audit, accept, or block a generated landing before it goes to frontend. Trigger phrases:

- "проверь лендинг [slug]"
- "review landing [slug]"
- "что не так с [slug]"
- "approve [slug]?" / "ready to ship [slug]?"
- "buffalo review [slug]"
- "audit [slug]"

## What this skill does (in order)

### 1. Quick state snapshot

Read these in parallel:

- `content/briefs/<slug>.json` — brief the page was generated from (may not exist if generated ad-hoc).
- `content/landings/<slug>.json` — the LandingSpec.
- `content/approvals/<slug>.json` — current approval (if any).
- `generated/landings/<slug>/page.tsx` — the derived TSX.

Report what's present vs missing.

### 2. Structural validation

```bash
pnpm -w run harness validate <slug>
```

This re-parses the spec through `LandingSpecSchema`. If it fails, the spec is corrupted — regenerate before reviewing copy.

### 3. Brand + business validators

Programmatically run the same checks the repair-loop uses. The fastest way is to re-run generation with `--max-repair-attempts 1` — the first attempt's validator output is what we want. But to avoid burning tokens, instead read the spec and check rules manually:

- `validateLandingBrand` rules: `hype-word`, `absolutist`, `empty-marketing` — scan every `props.title`, `props.subtitle`, `props.description`, `items[].title`, `items[].description`, `items[].question`, `items[].answer`, `plans[].description`, `plans[].features`, `seo.title`, `seo.description` for words from the denylist in `packages/harness/src/validators/landing-brand.ts`.
- `validateLandingBusiness` rules: hero first, footer last, single hero, ≤1 highlighted plan, `href` shape, hero `primaryCta.label` aligned with `brief.cta`.

Report any failures with `path → message → evidence`.

### 4. Illustration AST check (if applicable)

For each id in `spec.illustrationSpecs`:

```bash
pnpm -w run harness generate illustration \
  --spec content/illustrations/<id>.json --no-llm --strict
```

Wait — `--no-llm` overwrites the file with the stub. Don't do that on a real artifact. Instead, read `packages/ui/src/illustrations/<Name>.tsx` and confirm it passes the 6-rule AST checklist (see `validators/illustration-ast.ts`). If you can't determine by reading, regenerate to a temp slug.

### 5. Visual regression

```bash
pnpm --filter @buffalo/web test:visual
```

If it fails, decide whether the diff is intentional (regen will need `--update-snapshots`) or a regression (block the approval).

### 6. Manual preview

Confirm dev server is running (`pnpm dev`) and direct the user to:

- `http://localhost:3000/landings/<slug>` — preview
- `http://localhost:3000/approve/<slug>` — approval form

If they ask you to set the approval, use the API directly:

```bash
curl -X POST http://localhost:3000/api/approve/<slug> \
  -H 'content-type: application/json' \
  -d '{"status":"approved","reviewer":"<email or name>","comments":"..."}'
```

…or set them up to do it in the UI.

### 7. Summary report

Present the user with:

- **Decision recommendation**: ship / changes_requested / block, with one-line rationale.
- **Hard blockers** (if any): list them, each linked to the rule that catches them.
- **Soft suggestions** (if any): brand-voice or business-rule items that aren't blockers but worth a fix.
- **Visual diff status**: clean / drift / new baseline needed.
- **Next action**: exactly what to do (e.g. "regenerate with brief patch", "update visual baseline", "ping PM in /approve").

## Anti-patterns

- Never set an approval status programmatically without explicit user permission.
- Don't fix problems silently — surface them so the team can decide; let regeneration do the fixing.
- Don't blame the model for structural failures that originate in the brief — read the brief first.
- Don't approve if `--require-approved` handoff would fail; align the approval status with the actual ship state.
