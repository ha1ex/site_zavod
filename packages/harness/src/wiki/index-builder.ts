/**
 * Регенерация wiki/index.md — каталог всех страниц wiki/ с категориями.
 *
 * Сборка: glob по wiki/**.md, парсинг front-matter, группировка по `type`,
 * сортировка внутри группы по `slug`.
 *
 * Корневые файлы (`AGENTS.md`, `index.md`, `log.md`, `lessons.md`) — отдельная секция.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { parseFrontmatter } from './frontmatter';

interface WikiPage {
  relPath: string;
  slug: string;
  type: string;
  description: string;
  updated: string;
}

const ROOT_FILES = new Set(['AGENTS.md', 'index.md', 'log.md', 'lessons.md']);

const TYPE_ORDER: Record<string, number> = {
  'design-system': 1,
  archetype: 2,
  audience: 3,
  pattern: 4,
  landing: 5,
  meta: 6,
};

export interface IndexBuildResult {
  pageCount: number;
  changed: boolean;
}

export async function rebuildIndex(repoRoot: string, now: Date = new Date()): Promise<IndexBuildResult> {
  const wikiRoot = resolve(repoRoot, 'wiki');
  const files = await collectMarkdown(wikiRoot, wikiRoot);

  const pages: WikiPage[] = [];
  for (const abs of files) {
    const rel = relative(wikiRoot, abs).replace(/\\/g, '/');
    if (ROOT_FILES.has(rel)) continue;
    if (rel === 'AGENTS.md') continue;

    const raw = await readFile(abs, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(raw);
    const slug = (frontmatter.slug as string) || rel.replace(/\.md$/, '');
    const type = (frontmatter.type as string) || 'meta';
    const description = extractFirstHeading(body) || '(no description)';
    const updated = (frontmatter.updated as string) || (frontmatter.created as string) || '—';
    pages.push({ relPath: rel, slug, type, description, updated });
  }

  pages.sort((a, b) => {
    const tA = TYPE_ORDER[a.type] ?? 99;
    const tB = TYPE_ORDER[b.type] ?? 99;
    if (tA !== tB) return tA - tB;
    return a.slug.localeCompare(b.slug);
  });

  const grouped = groupBy(pages, (p) => p.type);
  const newContent = renderIndex(grouped, now);
  const indexPath = resolve(wikiRoot, 'index.md');
  const prev = await readFile(indexPath, 'utf-8').catch(() => '');
  const changed = prev !== newContent;
  if (changed) {
    await writeFile(indexPath, newContent, 'utf-8');
  }
  return { pageCount: pages.length, changed };
}

async function collectMarkdown(root: string, dir: string): Promise<string[]> {
  const result: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('.')) continue;
      result.push(...(await collectMarkdown(root, p)));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      result.push(p);
    }
  }
  return result;
}

function extractFirstHeading(body: string): string | null {
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^#\s+(.+)$/);
    if (m && m[1]) return m[1].trim();
  }
  return null;
}

function groupBy<T, K extends string>(items: T[], key: (t: T) => K): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const k = key(item);
      (acc[k] ||= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

function renderIndex(grouped: Record<string, WikiPage[]>, now: Date): string {
  const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const lines: string[] = [
    '# wiki — каталог',
    '',
    `> AUTO-GENERATED командой \`pnpm harness -- wiki index\`. Last rebuild: ${ts}.`,
    '> Не редактируйте руками — изменения будут перетёрты.',
    '',
    '## Корневые файлы',
    '',
    '- [AGENTS.md](AGENTS.md) — конвенции wiki: front-matter, naming, immutable/editable, lint-правила.',
    '- [log.md](log.md) — append-only хроника операций harness.',
    '- [lessons.md](lessons.md) — cumulative правила, извлечённые из прошлых генераций и фидбэка.',
  ];

  const labels: Record<string, string> = {
    'design-system': 'Design system',
    archetype: 'Archetypes',
    audience: 'Audiences',
    pattern: 'Patterns',
    landing: 'Landings (filed back)',
    meta: 'Meta',
  };

  for (const type of Object.keys(TYPE_ORDER).sort((a, b) => (TYPE_ORDER[a] ?? 0) - (TYPE_ORDER[b] ?? 0))) {
    const pages = grouped[type];
    if (!pages || pages.length === 0) continue;
    lines.push('', `## ${labels[type] ?? type}`, '');
    for (const p of pages) {
      lines.push(`- [\`${p.relPath}\`](${p.relPath}) — ${p.description} _(updated: ${p.updated})_`);
    }
  }

  // Other types not in TYPE_ORDER
  for (const type of Object.keys(grouped)) {
    if (type in TYPE_ORDER) continue;
    const pages = grouped[type];
    if (!pages) continue;
    lines.push('', `## ${type}`, '');
    for (const p of pages) {
      lines.push(`- [\`${p.relPath}\`](${p.relPath}) — ${p.description}`);
    }
  }

  lines.push(
    '',
    '## External knowledge (вне wiki/)',
    '',
    '- [`design-system/kaiten-v01/`](../design-system/kaiten-v01/) — SSoT дизайн-системы (HTML/PDF/PNG + tokens.json).',
    '- [`packages/harness/src/skills/`](../packages/harness/src/skills/) — встроенные методички системного промпта _(после merge ha1ex/landing-skill)_.',
    '- [`.claude/skills/`](../.claude/skills/) — Claude Code project-level skills.',
    '',
    'Детальный план миграции — [`.context/plans/karpathy-llm-wiki-athens-harness.md`](../.context/plans/karpathy-llm-wiki-athens-harness.md).',
    '',
  );

  return lines.join('\n');
}
