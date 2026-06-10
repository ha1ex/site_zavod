#!/usr/bin/env node
/**
 * Включает repo-локальные git-хуки (.githooks/) через core.hooksPath.
 * Запускается из package.json "prepare" при каждом pnpm install.
 *
 * Гарантия: НИКОГДА не валит install. Нет git / не git-репо (tarball, Vercel) /
 * read-only config — тихий exit 0.
 *
 * Worktree-нюанс (Conductor): git config пишется в общий config репозитория,
 * а относительный путь .githooks резолвится от корня каждого worktree при
 * запуске хука — один pnpm install включает гейт во всех workspace.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

try {
  if (!existsSync(resolve(repoRoot, '.githooks', 'pre-commit'))) process.exit(0);
  execFileSync('git', ['rev-parse', '--git-dir'], { cwd: repoRoot, stdio: 'ignore' });
  const current = execFileSync('git', ['config', '--get', 'core.hooksPath'], {
    cwd: repoRoot,
    encoding: 'utf-8',
  }).trim();
  if (current === '.githooks') process.exit(0); // уже настроено — идемпотентность
} catch {
  // --get вернул не-0 (ключа нет) — настроим ниже; либо git/репо нет — поймаем ниже.
}

try {
  execFileSync('git', ['rev-parse', '--git-dir'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: repoRoot, stdio: 'ignore' });
  console.log('[githooks] core.hooksPath → .githooks (гейт briefs-immutable активен)');
} catch {
  // Не git-репо / git недоступен / read-only — это нормально (CI-артефакт, tarball).
  process.exit(0);
}
