/**
 * harness lint — проверки drift'а между tokens.json, derived CSS, wiki и кодом.
 *
 * Scopes:
 *   - all (default): все проверки
 *   - wiki: только проверки внутри wiki/ (front-matter, cross-refs)
 *   - registry: schema-vs-registry соответствие
 *   - prompts: presence of design-system files
 *   - agents: agent-контракт (AGENTS.md/CLAUDE.md/GEMINI.md, хуки, скиллы, гейты) — strict в CI
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { loadTokens } from './load-tokens';
import { tokensToCss } from './tokens-to-css';
import { buildGenBlocks } from './tokens-to-md';
import { extractGenBlock, parseFrontmatter } from './frontmatter';
import { lintAgentContract } from '../gates/contract-wiring';

export type LintScope = 'all' | 'wiki' | 'registry' | 'prompts' | 'agents';

export type LintSeverity = 'error' | 'warning';

export interface LintIssue {
  code: string;
  severity: LintSeverity;
  message: string;
  path?: string;
}

export interface LintResult {
  issues: LintIssue[];
  filesChecked: number;
}

export async function runLint(
  repoRoot: string,
  scope: LintScope = 'all',
  registryNames: string[] = [],
): Promise<LintResult> {
  const issues: LintIssue[] = [];
  let filesChecked = 0;

  if (scope === 'all' || scope === 'prompts') {
    issues.push(...(await lintDesignSystemPresence(repoRoot)));
  }

  if (scope === 'all' || scope === 'wiki') {
    const tokensRes = await lintTokensDrift(repoRoot);
    issues.push(...tokensRes.issues);
    filesChecked += tokensRes.filesChecked;

    const wikiRes = await lintWikiPages(repoRoot);
    issues.push(...wikiRes.issues);
    filesChecked += wikiRes.filesChecked;
  }

  if (scope === 'all' || scope === 'registry') {
    issues.push(...(await lintSchemaVsRegistry(repoRoot, registryNames)));
  }

  if (scope === 'all' || scope === 'agents') {
    issues.push(...(await lintAgentContract(repoRoot)));
  }

  return { issues, filesChecked };
}

async function lintDesignSystemPresence(repoRoot: string): Promise<LintIssue[]> {
  const required = [
    'wiki/design-system/colors.md',
    'wiki/design-system/typography.md',
    'wiki/design-system/spacing.md',
    'wiki/design-system/radius.md',
    'wiki/design-system/grid.md',
    'wiki/design-system/motion.md',
    'wiki/design-system/voice.md',
  ];
  const issues: LintIssue[] = [];
  for (const rel of required) {
    const abs = resolve(repoRoot, rel);
    const exists = await readFile(abs, 'utf-8').then(
      () => true,
      () => false,
    );
    if (!exists) {
      issues.push({
        code: 'ds-presence',
        severity: 'error',
        message: `${rel} отсутствует — design system неполна`,
        path: rel,
      });
    }
  }
  return issues;
}

async function lintTokensDrift(
  repoRoot: string,
): Promise<{ issues: LintIssue[]; filesChecked: number }> {
  const issues: LintIssue[] = [];
  let filesChecked = 0;

  let tokens;
  try {
    tokens = await loadTokens(repoRoot);
  } catch (e) {
    issues.push({
      code: 'tokens-missing',
      severity: 'error',
      message: `design-system/kaiten-v01/tokens.json не найден или невалиден: ${(e as Error).message}`,
    });
    return { issues, filesChecked };
  }

  // tokens.css drift
  const cssPath = resolve(repoRoot, 'packages', 'ui', 'src', 'tokens.css');
  const cssActual = await readFile(cssPath, 'utf-8').catch(() => null);
  filesChecked++;
  if (cssActual === null) {
    issues.push({ code: 'tokens-css-missing', severity: 'error', message: `${cssPath} не найден`, path: cssPath });
  } else {
    const cssExpected = tokensToCss(tokens);
    if (cssActual !== cssExpected) {
      issues.push({
        code: 'tokens-drift',
        severity: 'error',
        message: `packages/ui/src/tokens.css не синхронизирован с tokens.json — запустите \`pnpm harness -- wiki sync\``,
        path: 'packages/ui/src/tokens.css',
      });
    }
  }

  // wiki/design-system/*.md gen-blocks drift
  for (const block of buildGenBlocks(tokens)) {
    const pagePath = resolve(repoRoot, 'wiki', 'design-system', block.page);
    const content = await readFile(pagePath, 'utf-8').catch(() => null);
    filesChecked++;
    if (content === null) {
      issues.push({
        code: 'wiki-page-missing',
        severity: 'error',
        message: `wiki/design-system/${block.page} не найдена`,
        path: `wiki/design-system/${block.page}`,
      });
      continue;
    }
    const range = extractGenBlock(content, block.tag);
    if (!range) {
      issues.push({
        code: 'wiki-gen-block-missing',
        severity: 'error',
        message: `wiki/design-system/${block.page}: блок <!-- gen:${block.tag} --> не найден — запустите \`pnpm harness -- wiki sync\``,
        path: `wiki/design-system/${block.page}`,
      });
      continue;
    }
    const actual = content.slice(range.start, range.end).trim();
    const expected = block.content.trim();
    if (actual !== expected) {
      issues.push({
        code: 'wiki-tokens-drift',
        severity: 'error',
        message: `wiki/design-system/${block.page}: gen-блок не синхронизирован с tokens.json`,
        path: `wiki/design-system/${block.page}`,
      });
    }
  }

  return { issues, filesChecked };
}

async function lintWikiPages(repoRoot: string): Promise<{ issues: LintIssue[]; filesChecked: number }> {
  const issues: LintIssue[] = [];
  const wikiRoot = resolve(repoRoot, 'wiki');
  const files = await collectMarkdown(wikiRoot);
  const allPaths = new Set<string>();
  const pages: Array<{ relPath: string; frontmatter: ReturnType<typeof parseFrontmatter>['frontmatter'] }> = [];

  for (const abs of files) {
    const rel = abs.substring(repoRoot.length + 1).replace(/\\/g, '/');
    allPaths.add(rel);
    if (rel === 'wiki/index.md' || rel === 'wiki/log.md' || rel === 'wiki/lessons.md' || rel === 'wiki/AGENTS.md') {
      continue;
    }
    const raw = await readFile(abs, 'utf-8');
    const { frontmatter } = parseFrontmatter(raw);
    pages.push({ relPath: rel, frontmatter });

    if (!frontmatter.slug) {
      issues.push({
        code: 'frontmatter-missing-slug',
        severity: 'warning',
        message: `${rel}: front-matter без slug`,
        path: rel,
      });
    }
    if (!frontmatter.type) {
      issues.push({
        code: 'frontmatter-missing-type',
        severity: 'warning',
        message: `${rel}: front-matter без type`,
        path: rel,
      });
    }

    const updated = frontmatter.updated as string | undefined;
    if (updated && isStaleDate(updated, 180)) {
      issues.push({
        code: 'stale-claim',
        severity: 'warning',
        message: `${rel}: updated=${updated} старше 180 дней — пересмотрите страницу`,
        path: rel,
      });
    }
  }

  // cross-ref validity
  for (const page of pages) {
    const sources = (page.frontmatter.sources as string[] | undefined) || [];
    const related = (page.frontmatter.related as string[] | undefined) || [];
    for (const ref of [...sources, ...related]) {
      const fullPath = ref.startsWith('wiki/') || ref.startsWith('packages/') || ref.startsWith('design-system/') || ref.startsWith('.claude/')
        ? ref
        : `wiki/${ref}`;
      if (fullPath.startsWith('wiki/') && !allPaths.has(fullPath)) {
        issues.push({
          code: 'broken-ref',
          severity: 'warning',
          message: `${page.relPath}: cross-ref на несуществующий ${fullPath}`,
          path: page.relPath,
        });
      }
    }
  }

  return { issues, filesChecked: pages.length };
}

async function lintSchemaVsRegistry(repoRoot: string, registryNames: string[]): Promise<LintIssue[]> {
  const issues: LintIssue[] = [];
  if (!registryNames.length) return issues;

  // Каждое registry-component должно иметь wiki/design-system/components/<kebab>.md
  for (const name of registryNames) {
    const kebab = pascalToKebab(name);
    const candidate = resolve(repoRoot, 'wiki', 'design-system', 'components', `${kebab}.md`);
    const ok = await readFile(candidate, 'utf-8').then(
      () => true,
      () => false,
    );
    if (!ok) {
      issues.push({
        code: 'component-doc-missing',
        severity: 'warning',
        message: `Registry-компонент ${name} не имеет wiki/design-system/components/${kebab}.md`,
        path: `wiki/design-system/components/${kebab}.md`,
      });
    }
  }
  return issues;
}

async function collectMarkdown(root: string): Promise<string[]> {
  const result: string[] = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const e of entries) {
    const p = join(root, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('.')) continue;
      result.push(...(await collectMarkdown(p)));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      result.push(p);
    }
  }
  return result;
}

function isStaleDate(dateStr: string, days: number): boolean {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const diff = Date.now() - d.getTime();
  return diff > days * 86400_000;
}

function pascalToKebab(s: string): string {
  return s
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/section$/, '');
}
