/**
 * Filing back: запись результата успешной генерации в wiki/landings/<slug>.md.
 *
 * Триггеры (см. план M4b):
 *   - generate → status=draft, sources, sections summary, meta
 *   - approve  → обновление: status=approved, visualBaselineRef
 *   - handoff  → обновление: status=shipped, zipRef
 *
 * Файл управляется через front-matter + системные секции (отмечены `<!-- gen:* -->`).
 * Reviewer notes — human-editable секция (НЕ перетирается при последующих filings).
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Brief } from '../schemas/brief';
import type { LandingSpec } from '../schemas/landing-spec';
import { extractGenBlock, parseFrontmatter, replaceGenBlock, serializeFrontmatter } from './frontmatter';
import type { FrontMatter } from './frontmatter';

export type LandingStatus = 'draft' | 'approved' | 'shipped';

export interface FileLandingInput {
  slug: string;
  brief: Brief;
  briefPath: string;
  spec: LandingSpec;
  sources: string[];
  archetype?: string;
  tokenEstimate?: number;
  durationMs?: number;
  generator?: string;
  /**
   * Готовый markdown audience-score отчёта (включая заголовок).
   * Если передан — будет встроен в gen-блок `audience-score` в wiki/landings/<slug>.md.
   */
  audienceScoreMarkdown?: string;
}

export async function fileLandingToWiki(repoRoot: string, input: FileLandingInput, now: Date = new Date()): Promise<string> {
  const today = formatDate(now);
  const path = resolve(repoRoot, 'wiki', 'landings', `${input.slug}.md`);

  const existing = await readFile(path, 'utf-8').catch(() => null);
  let frontmatter: FrontMatter;
  let body: string;

  if (existing === null) {
    frontmatter = {
      slug: input.slug,
      type: 'landing',
      created: today,
      updated: today,
      status: 'draft',
      brief: input.briefPath,
      archetype: input.archetype || input.spec.pageType,
      goal: input.brief.primaryGoal,
      sources: input.sources,
      sections: input.spec.sections.map((s) => s.id),
      generator: input.generator ?? '',
      durationMs: input.durationMs ?? 0,
      tokenEstimate: input.tokenEstimate ?? 0,
      tags: ['landing', input.spec.pageType],
      stale: false,
    } as FrontMatter;
    body = renderInitialBody();
  } else {
    const parsed = parseFrontmatter(existing);
    frontmatter = parsed.frontmatter;
    body = parsed.body;
    frontmatter.updated = today;
    frontmatter.sources = mergeStringArrays(asArray(frontmatter.sources), input.sources);
    frontmatter.sections = input.spec.sections.map((s) => s.id);
    if (input.archetype) frontmatter.archetype = input.archetype;
    if (input.generator) frontmatter.generator = input.generator;
    if (typeof input.durationMs === 'number') frontmatter.durationMs = input.durationMs;
    if (typeof input.tokenEstimate === 'number') frontmatter.tokenEstimate = input.tokenEstimate;
  }

  body = replaceGenBlock(body, 'sections-summary', renderSectionsSummary(input.spec));
  body = replaceGenBlock(body, 'spec-meta', renderSpecMeta(input));
  if (input.audienceScoreMarkdown) {
    body = replaceGenBlock(body, 'audience-score', input.audienceScoreMarkdown);
  }

  const content = serializeFrontmatter(frontmatter, body);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf-8');
  return path;
}

export interface UpdateStatusInput {
  slug: string;
  status: LandingStatus;
  baselineRef?: string;
  zipRef?: string;
  note?: string;
}

export async function updateLandingStatus(repoRoot: string, input: UpdateStatusInput, now: Date = new Date()): Promise<string> {
  const today = formatDate(now);
  const path = resolve(repoRoot, 'wiki', 'landings', `${input.slug}.md`);
  const raw = await readFile(path, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(raw);

  frontmatter.status = input.status;
  frontmatter.updated = today;
  if (input.baselineRef) frontmatter.baselineRef = input.baselineRef;
  if (input.zipRef) frontmatter.zipRef = input.zipRef;

  let newBody = body;
  if (input.note) {
    newBody = appendStatusNote(newBody, today, input.status, input.note);
  }

  const content = serializeFrontmatter(frontmatter, newBody);
  await writeFile(path, content, 'utf-8');
  return path;
}

export interface AppendReviewerNoteInput {
  slug: string;
  note: string;
}

export async function appendReviewerNote(repoRoot: string, input: AppendReviewerNoteInput, now: Date = new Date()): Promise<string> {
  const today = formatDate(now);
  const path = resolve(repoRoot, 'wiki', 'landings', `${input.slug}.md`);
  const raw = await readFile(path, 'utf-8').catch(() => null);
  if (raw === null) {
    throw new Error(`wiki/landings/${input.slug}.md не найден — сначала сгенерируйте landing`);
  }
  const { frontmatter, body } = parseFrontmatter(raw);
  frontmatter.updated = today;

  let newBody = body;
  const reviewerHeader = '## Reviewer notes';
  if (newBody.includes(reviewerHeader)) {
    newBody = newBody.replace(
      reviewerHeader,
      `${reviewerHeader}\n\n- _${today}_: ${input.note}`,
    );
  } else {
    newBody = newBody.trimEnd() + `\n\n## Reviewer notes\n\n- _${today}_: ${input.note}\n`;
  }

  const content = serializeFrontmatter(frontmatter, newBody);
  await writeFile(path, content, 'utf-8');
  return path;
}

function renderInitialBody(): string {
  return `# Landing summary

<!-- gen:spec-meta -->
_(метаданные сгенерируются после первого filing back)_
<!-- /gen:spec-meta -->

## Sections

<!-- gen:sections-summary -->
_(автогенерируется при filing back)_
<!-- /gen:sections-summary -->

## Audience score

<!-- gen:audience-score -->
_(автогенерируется audience-score gate'ом при agent apply)_
<!-- /gen:audience-score -->

## Lessons (LLM-extract)

_(extract предлагается через \`harness ingest feedback\`; правится руками)_

## Reviewer notes

_(заполняется через \`harness ingest feedback <slug> "<note>"\`)_

## History

`;
}

function renderSpecMeta(input: FileLandingInput): string {
  const lines = [
    `- **slug:** \`${input.slug}\``,
    `- **brief:** \`${input.briefPath}\``,
    `- **archetype:** \`${input.archetype || input.spec.pageType}\``,
    `- **goal:** \`${input.brief.primaryGoal}\` (brief.cta = "${input.brief.cta}")`,
    `- **sections used:** \`${input.spec.sections.map((s) => s.id).join(', ')}\``,
    `- **token estimate:** \`${input.tokenEstimate ?? 'n/a'}\``,
    `- **generation duration:** \`${input.durationMs ?? 'n/a'}ms\``,
    `- **generator:** \`${input.generator ?? 'n/a'}\``,
    '',
    '**Sources (использованы в системном промпте):**',
    ...input.sources.map((s) => `- \`${s}\``),
  ];
  return lines.join('\n');
}

function renderSectionsSummary(spec: LandingSpec): string {
  const lines: string[] = [];
  for (const section of spec.sections) {
    lines.push('', `### ${section.id} (${section.component})`, '');
    const sectionLines = summarizeSection(section);
    lines.push(...sectionLines);
  }
  return lines.join('\n').trim();
}

function summarizeSection(section: LandingSpec['sections'][number]): string[] {
  const lines: string[] = [];
  switch (section.component) {
    case 'HeroSection':
      lines.push(`- **title:** "${section.props.title}"`);
      lines.push(`- **subtitle:** "${section.props.subtitle}" _(${section.props.subtitle.length}/200 chars)_`);
      lines.push(`- **primaryCta:** "${section.props.primaryCta.label}" → \`${section.props.primaryCta.href}\``);
      if (section.props.secondaryCta) {
        lines.push(`- **secondaryCta:** "${section.props.secondaryCta.label}"`);
      }
      if (section.props.visual) {
        lines.push(`- **visual:** \`${section.props.visual.type}\` (assetId: \`${section.props.visual.assetId}\`)`);
      }
      break;
    case 'FeatureGrid':
      lines.push(`- **title:** "${section.props.title}"`);
      lines.push(`- **columns:** ${section.props.columns} · **items:** ${section.props.items.length}`);
      for (const [i, item] of section.props.items.entries()) {
        lines.push(`  ${i + 1}. \`${item.icon}\` · "${item.title}" — ${item.description.length} chars`);
      }
      break;
    case 'PricingPlans':
      lines.push(`- **title:** "${section.props.title}"`);
      lines.push(`- **plans:** ${section.props.plans.length}`);
      for (const [i, plan] of section.props.plans.entries()) {
        const highlight = plan.highlighted ? ' ⭐' : '';
        lines.push(`  ${i + 1}. **${plan.name}**${highlight} — ${plan.price}${plan.pricePeriod ? `/${plan.pricePeriod}` : ''} (${plan.features.length} features)`);
      }
      break;
    case 'FAQAccordion':
      lines.push(`- **title:** "${section.props.title}"`);
      lines.push(`- **items:** ${section.props.items.length} Q&A`);
      for (const [i, item] of section.props.items.entries()) {
        lines.push(`  ${i + 1}. "${item.question}" — answer ${item.answer.length}/600 chars`);
      }
      break;
    case 'FinalCta':
      lines.push(`- **title:** "${section.props.title}"`);
      lines.push(`- **primaryCta:** "${section.props.primaryCta.label}" → \`${section.props.primaryCta.href}\``);
      break;
    case 'LandingFooter':
      lines.push(`- **brand:** "${section.props.brandName}"`);
      lines.push(`- **columns:** ${section.props.columns.length}`);
      break;
  }
  return lines;
}

function appendStatusNote(body: string, today: string, status: LandingStatus, note: string): string {
  const header = '## History';
  if (body.includes(header)) {
    return body.replace(header, `${header}\n\n- _${today}_: status → \`${status}\` — ${note}`);
  }
  return body.trimEnd() + `\n\n## History\n\n- _${today}_: status → \`${status}\` — ${note}\n`;
}

function mergeStringArrays(a: string[], b: string[]): string[] {
  const set = new Set(a);
  for (const item of b) set.add(item);
  return [...set];
}

function asArray(v: FrontMatter[string] | undefined): string[] {
  if (Array.isArray(v)) return v.map(String);
  return [];
}

function formatDate(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
