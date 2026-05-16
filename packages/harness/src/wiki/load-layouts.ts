import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Загружает layout-плейбук из wiki/layouts/<slug>.md и оборачивает его
 * как блок для system prompt. Возвращает body + sources.
 *
 * Если slug не указан — возвращает только index.md как обзор всех layouts
 * (LLM должен сам выбрать).
 */

export interface LoadedLayout {
  body: string;
  sources: string[];
  slug?: string;
}

export async function loadLayoutPlaybook(
  repoRoot: string,
  slug?: string,
): Promise<LoadedLayout> {
  const layoutsDir = resolve(repoRoot, 'wiki', 'layouts');
  const sources: string[] = [];

  if (!slug) {
    // Только index — пусть LLM (или человек) выберет.
    try {
      const indexBody = await readFile(resolve(layoutsDir, 'index.md'), 'utf-8');
      sources.push('wiki/layouts/index.md');
      return {
        body: `### Layout library (index)\n\n${indexBody}`,
        sources,
      };
    } catch {
      return { body: '', sources: [] };
    }
  }

  const layoutPath = resolve(layoutsDir, `${slug}.md`);
  try {
    const body = await readFile(layoutPath, 'utf-8');
    sources.push(`wiki/layouts/${slug}.md`);
    // Также включаем index для контекста выбора альтернатив.
    let indexBody = '';
    try {
      indexBody = await readFile(resolve(layoutsDir, 'index.md'), 'utf-8');
      sources.push('wiki/layouts/index.md');
    } catch {
      /* ignore */
    }
    return {
      body: indexBody
        ? `### Layout library (index — для контекста)\n\n${indexBody}\n\n---\n\n### Layout chosen: ${slug}\n\n${body}`
        : `### Layout chosen: ${slug}\n\n${body}`,
      sources,
      slug,
    };
  } catch {
    // Slug указан, но файла нет — это ошибка, но prepare не должен крашиться.
    // Возвращаем сам index с предупреждением.
    try {
      const indexBody = await readFile(resolve(layoutsDir, 'index.md'), 'utf-8');
      sources.push('wiki/layouts/index.md');
      return {
        body:
          `### Layout library (warning: указанный slug "${slug}" не найден, ` +
          `выбран fallback — пользуйся index'ом)\n\n${indexBody}`,
        sources,
      };
    } catch {
      return { body: '', sources: [] };
    }
  }
}

export async function listAvailableLayouts(repoRoot: string): Promise<string[]> {
  const layoutsDir = resolve(repoRoot, 'wiki', 'layouts');
  try {
    const files = await readdir(layoutsDir);
    return files
      .filter((f) => f.endsWith('.md') && f !== 'index.md')
      .map((f) => f.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}
