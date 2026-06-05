import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  ApprovalSchema,
  defaultApproval,
  type Approval,
  type ApprovalStatus,
  type ApprovalSurface,
} from '../schemas/approval';

/**
 * Approval storage (этап 5) — простые JSON-файлы в content/approvals/.
 * Используется и Next.js API route'ами, и CLI.
 *
 * Поверхности: landing → <slug>.json, intake → <slug>.intake.json. Все существующие
 * вызовы без surface работают как раньше (landing / <slug>.json).
 */

/**
 * Безопасный slug: буква/цифра, далее [a-z0-9_-], до 64 символов. Защита от path
 * traversal (`../`, `/`, абсолютные пути) везде, где slug идёт в имя файла.
 */
const SAFE_SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;

export function isSafeSlug(slug: string): boolean {
  return typeof slug === 'string' && SAFE_SLUG_RE.test(slug);
}

export function approvalDir(repoRoot: string): string {
  return resolve(repoRoot, 'content', 'approvals');
}

export function approvalPath(repoRoot: string, slug: string, surface: ApprovalSurface = 'landing'): string {
  if (!isSafeSlug(slug)) throw new Error(`unsafe slug: ${JSON.stringify(slug)}`);
  const suffix = surface === 'intake' ? '.intake.json' : '.json';
  return resolve(approvalDir(repoRoot), `${slug}${suffix}`);
}

export async function readApproval(
  repoRoot: string,
  slug: string,
  surface: ApprovalSurface = 'landing',
): Promise<Approval> {
  const path = approvalPath(repoRoot, slug, surface);
  try {
    const raw = await readFile(path, 'utf-8');
    return ApprovalSchema.parse(JSON.parse(raw));
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ENOENT') {
      return defaultApproval(slug, surface);
    }
    throw err;
  }
}

export async function writeApproval(
  repoRoot: string,
  slug: string,
  patch: { status: ApprovalStatus; reviewer?: string; comments?: string; surface?: ApprovalSurface },
): Promise<Approval> {
  const surface: ApprovalSurface = patch.surface ?? 'landing';
  const next: Approval = {
    slug,
    status: patch.status,
    surface,
    reviewer: patch.reviewer,
    comments: patch.comments,
    updatedAt: new Date().toISOString(),
  };
  const validated = ApprovalSchema.parse(next);
  const path = approvalPath(repoRoot, slug, surface);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(validated, null, 2) + '\n', 'utf-8');
  return validated;
}

export async function listApprovals(repoRoot: string): Promise<Approval[]> {
  const dir = approvalDir(repoRoot);
  let files: string[] = [];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  const results: Approval[] = [];
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    // landing-only список (handoff/CLI). intake-approvals лежат в <slug>.intake.json.
    if (f.endsWith('.intake.json')) continue;
    const slug = f.replace(/\.json$/, '');
    try {
      results.push(await readApproval(repoRoot, slug));
    } catch {
      // skip invalid files
    }
  }
  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}
