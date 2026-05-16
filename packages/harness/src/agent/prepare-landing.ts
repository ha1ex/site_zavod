import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { z } from 'zod';
import { BriefSchema, type Brief } from '../schemas/brief';
import { LandingSpecSchema } from '../schemas/landing-spec';
import {
  buildBriefPrompt,
  buildLandingSystemPromptWithMeta,
} from '../prompts/system';
import {
  type Domain,
  type MissingMockHint,
  getAllowedVariants,
  getDomainEntry,
  getMissingMocksForDomain,
  resolveDomainFromBrief,
} from '../registry/domain-visual';

export interface DomainContext {
  domain: Domain;
  displayName: string;
  /** Список разрешённых mock-variants для этого домена. Пустой для непокрытых. */
  allowedVariants: string[];
  /** Для непокрытых доменов — ожидаемые к созданию mock'и. */
  missingMocks: MissingMockHint[];
  /** Путь к reference-документу с примером готового набора (для покрытых). */
  referenceDoc?: string;
  /** Краткое объяснение, почему этот домен выбран (хвост резолва). */
  rationale: string;
}

export interface PrepareLandingArtifact {
  kind: 'landing';
  slug: string;
  brief: Brief;
  system: string;
  user: string;
  schema: unknown;
  outputPath: string;
  outputPathRel: string;
  nextCommand: string;
  sources: string[];
  archetype?: string;
  tokenEstimate?: number;
  instructions: string;
  domainContext: DomainContext;
}

const INSTRUCTIONS = [
  'You are the host LLM. Read `system` and `user` below.',
  'Produce ONE JSON object that satisfies `schema` (LandingSpec).',
  'Write that JSON (no markdown fences, no commentary) to the file at `outputPath`.',
  'Then run `nextCommand` — it validates the spec and renders TSX. If it returns errors,',
  'patch the JSON in place and re-run `nextCommand` until it passes (repair loop).',
].join(' ');

export async function prepareLanding(opts: {
  root: string;
  briefPath: string;
  slug: string;
}): Promise<PrepareLandingArtifact> {
  const briefAbs = resolve(opts.root, opts.briefPath);
  const briefRaw = await readFile(briefAbs, 'utf-8');
  const brief = BriefSchema.parse(JSON.parse(briefRaw));

  const meta = await buildLandingSystemPromptWithMeta({ brief });

  const schema = z.toJSONSchema(LandingSpecSchema, { reused: 'inline' });

  const user = buildBriefPrompt(JSON.stringify(brief, null, 2));

  const outputPathAbs = resolve(opts.root, 'content', 'landings', `${opts.slug}.json`);
  const outputPathRel = relative(opts.root, outputPathAbs);

  const domainContext = buildDomainContext(brief);

  return {
    kind: 'landing',
    slug: opts.slug,
    brief,
    system: meta.system,
    user,
    schema,
    outputPath: outputPathAbs,
    outputPathRel,
    nextCommand: `pnpm -w run harness agent apply landing --slug ${opts.slug} --brief ${opts.briefPath}`,
    sources: meta.sources,
    archetype: meta.archetype,
    tokenEstimate: meta.tokenEstimate,
    instructions: INSTRUCTIONS,
    domainContext,
  };
}

function buildDomainContext(brief: Brief): DomainContext {
  const domain = resolveDomainFromBrief(brief);
  const entry = getDomainEntry(domain);
  const allowedVariants = getAllowedVariants(domain);
  const missingMocks = getMissingMocksForDomain(domain);

  let rationale: string;
  if (domain === 'unknown') {
    rationale =
      'Домен НЕ резолвлен из brief (нет ключевых слов из aliases). ' +
      'ОСТАНОВИСЬ. Уточни brief.product / brief.market / brief.audience с конкретикой ' +
      'или вручную выбери домен из: pm, support, crm, hr, marketing, bpm, finance, ecommerce. ' +
      'Иначе ingest упадёт с domain-unresolved.';
  } else if (allowedVariants.length === 0) {
    rationale =
      `Домен '${domain}' (${entry?.displayName}) резолвлен, но ещё НЕ покрыт mock-набором. ` +
      `Перед написанием spec — создай ${missingMocks.length} mock'ов (см. ниже), ` +
      'обнови DOMAIN_REGISTRY и wiki/references/domain-mock-matrix.md, заведи ' +
      `wiki/landings/${domain}-reference.md по образцу crm-reference.md. ` +
      'Иначе ingest упадёт с domain-missing-mocks.';
  } else {
    rationale =
      `Домен '${domain}' (${entry?.displayName}) резолвлен, в наборе ${allowedVariants.length} mock-вариантов. ` +
      'Все Hero.visual.variant / MediaCopy.mediaVariant / Tabs[].mockVariant / Steps[].mockVariant ' +
      `должны быть из этого списка. Использование чужих (например, pm-board в CRM) — блокер ` +
      '(ingest упадёт с cross-domain-reuse).';
  }

  return {
    domain,
    displayName: entry?.displayName ?? domain,
    allowedVariants,
    missingMocks,
    referenceDoc: entry?.referenceDoc,
    rationale,
  };
}

export function renderPrepareAsMarkdown(a: PrepareLandingArtifact): string {
  const fence = '```';
  return `# Buffalo agent prompt — landing/${a.slug}

> **Host-agent mode** — нет API-ключей, всё генерирует LLM хоста (Claude Code, Codex, ChatGPT-with-files, …).

## How to use

1. Прочитай разделы **System prompt** и **User prompt** ниже.
2. Сгенерируй ОДИН JSON-объект, который удовлетворяет **Schema (LandingSpec)**.
3. Запиши JSON (без markdown-обрамлений) в файл:
   \`${a.outputPathRel}\`
4. Запусти: \`${a.nextCommand}\`
5. Если ingest вернёт ошибки — поправь JSON на месте и снова запусти команду из шага 4 (repair-loop).

**Output schema id:** \`LandingSpec\`
**Archetype:** \`${a.archetype ?? '(unknown)'}\`
**Token estimate (system):** ${a.tokenEstimate ?? '?'}

---

## Domain context (обязательно к прочтению ДО написания spec)

${renderDomainContext(a.domainContext)}

---

## System prompt

${fence}
${a.system}
${fence}

## User prompt

${fence}
${a.user}
${fence}

## Brief (source, ${relativeOrAbsolute(a)})

${fence}json
${JSON.stringify(a.brief, null, 2)}
${fence}

## Schema (LandingSpec — JSON Schema)

${fence}json
${JSON.stringify(a.schema, null, 2)}
${fence}

## Sources (wiki pages that shaped this prompt)

${a.sources.map((s) => `- \`${s}\``).join('\n') || '_(none)_'}
`;
}

function relativeOrAbsolute(a: PrepareLandingArtifact): string {
  return a.outputPathRel || a.outputPath;
}

function renderDomainContext(ctx: DomainContext): string {
  const lines: string[] = [];
  lines.push(`- **Domain:** \`${ctx.domain}\` (${ctx.displayName})`);
  if (ctx.referenceDoc) {
    lines.push(`- **Reference doc:** \`${ctx.referenceDoc}\``);
  }
  lines.push('');
  lines.push(ctx.rationale);
  lines.push('');
  if (ctx.allowedVariants.length > 0) {
    lines.push('**Разрешённые variants для этого домена:**');
    lines.push('');
    lines.push(ctx.allowedVariants.map((v) => `- \`${v}\``).join('\n'));
    lines.push('');
    lines.push(
      'Использование любого другого variant (из чужого домена) — блокер ' +
        '`cross-domain-reuse`. Если ни один из перечисленных не подходит по смыслу — ' +
        'создай новый mock в этом домене по `packages/harness/src/prompts/section-mock-skill.md`, ' +
        'добавь в `MockVariantSchema` + `DOMAIN_REGISTRY` + matrix, и только потом используй.',
    );
  } else if (ctx.missingMocks.length > 0) {
    lines.push('**Ожидаемые mock\'и для этого домена (создай ДО spec\'а):**');
    lines.push('');
    for (const m of ctx.missingMocks) {
      lines.push(`- \`${m.variant}\` — ${m.description}`);
    }
    lines.push('');
    lines.push(
      'Алгоритм: `packages/harness/src/prompts/section-mock-skill.md`. ' +
        'Образец готового набора (CRM): `wiki/landings/crm-reference.md`. ' +
        'После создания обнови `wiki/references/domain-mock-matrix.md` ' +
        'и `packages/harness/src/registry/domain-visual.ts`.',
    );
  } else {
    lines.push(
      'Домен не резолвлен — нужна явная классификация перед продолжением. ' +
        'Уточни brief или прерви и спроси пользователя.',
    );
  }
  return lines.join('\n');
}
