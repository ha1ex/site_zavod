/**
 * Anti-drift линт agent-контракта (`harness lint --scope agents`).
 *
 * Защищает от повторения инцидента «AGENTS.md протух → Codex пошёл по
 * legacy-пути»: проверяет, что bootstrap-файлы существуют, ссылки живые,
 * хуки/скиллы/гейты подключены. Ошибки здесь — строгий fail в CI.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { LintIssue } from '../wiki/lint';

const GATES_START = '<!-- gates:start -->';
const GATES_END = '<!-- gates:end -->';

export async function lintAgentContract(repoRoot: string): Promise<LintIssue[]> {
  const issues: LintIssue[] = [];

  // 1. AGENTS.md — универсальный bootstrap.
  const agents = await readFile(resolve(repoRoot, 'AGENTS.md'), 'utf-8').catch(() => null);
  if (agents === null) {
    issues.push({
      code: 'agents-md-missing',
      severity: 'error',
      message: 'AGENTS.md отсутствует — потерян bootstrap-контракт для host-агентов (Codex и др. слепнут)',
      path: 'AGENTS.md',
    });
  } else {
    if (!agents.includes(GATES_START) || !agents.includes(GATES_END)) {
      issues.push({
        code: 'agents-gates-markers',
        severity: 'error',
        message: 'AGENTS.md: нет маркеров <!-- gates:start/end --> — `agent context` не сможет печатать карточку гейтов',
        path: 'AGENTS.md',
      });
    }
    if (!agents.includes('harness agent context')) {
      issues.push({
        code: 'agents-ritual-missing',
        severity: 'error',
        message: 'AGENTS.md: нет ритуала сессии (обязательная строка `harness agent context`)',
        path: 'AGENTS.md',
      });
    }
    if (agents.includes('harness generate landing')) {
      issues.push({
        code: 'agents-legacy-entry',
        severity: 'error',
        message: 'AGENTS.md: упоминается `harness generate landing` (API-key legacy) — точка входа только `agent build`',
        path: 'AGENTS.md',
      });
    }
  }

  // 2. Тонкие указатели для конкретных агентов.
  for (const f of ['CLAUDE.md', 'GEMINI.md']) {
    const body = await readFile(resolve(repoRoot, f), 'utf-8').catch(() => null);
    if (body === null) {
      issues.push({
        code: 'agents-pointer-missing',
        severity: 'error',
        message: `${f} отсутствует — указатель на AGENTS.md для соответствующего агента`,
        path: f,
      });
    } else if (!body.includes('AGENTS.md')) {
      issues.push({
        code: 'agents-pointer-broken',
        severity: 'error',
        message: `${f} не ссылается на AGENTS.md`,
        path: f,
      });
    }
  }

  // 3. Все repo-relative markdown-ссылки bootstrap-файлов резолвятся.
  for (const f of ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'SKILL.md']) {
    const body = await readFile(resolve(repoRoot, f), 'utf-8').catch(() => null);
    if (body === null) continue; // отсутствие уже зарепорчено выше (или файл опционален)
    for (const target of extractRelativeLinks(body)) {
      const ok = await stat(resolve(repoRoot, target)).then(
        () => true,
        () => false,
      );
      if (!ok) {
        issues.push({
          code: 'agents-dead-link',
          severity: 'error',
          message: `${f}: ссылка на несуществующий путь ${target}`,
          path: f,
        });
      }
    }
  }

  // 4. Каждый hook-command из .claude/settings.json указывает на существующий скрипт.
  const settingsRaw = await readFile(resolve(repoRoot, '.claude', 'settings.json'), 'utf-8').catch(() => null);
  if (settingsRaw !== null) {
    const refs = new Set(settingsRaw.match(/scripts\/hooks\/[a-z0-9_-]+\.sh/g) ?? []);
    for (const rel of refs) {
      const ok = await stat(resolve(repoRoot, rel)).then(
        () => true,
        () => false,
      );
      if (!ok) {
        issues.push({
          code: 'agents-hook-script-missing',
          severity: 'error',
          message: `.claude/settings.json ссылается на отсутствующий ${rel}`,
          path: '.claude/settings.json',
        });
      }
    }
  }

  // 5. Каждый скилл в .claude/skills/* имеет SKILL.md.
  const skillsDir = resolve(repoRoot, '.claude', 'skills');
  const skillDirs = await readdir(skillsDir, { withFileTypes: true }).catch(() => []);
  for (const e of skillDirs) {
    if (!e.isDirectory()) continue;
    const ok = await stat(resolve(skillsDir, e.name, 'SKILL.md')).then(
      () => true,
      () => false,
    );
    if (!ok) {
      issues.push({
        code: 'agents-skill-missing',
        severity: 'error',
        message: `.claude/skills/${e.name}/ без SKILL.md`,
        path: `.claude/skills/${e.name}`,
      });
    }
  }

  // 6. Git-слой гейта подключён: .githooks/pre-commit существует и исполняемый.
  const preCommit = await stat(resolve(repoRoot, '.githooks', 'pre-commit')).catch(() => null);
  if (preCommit === null) {
    issues.push({
      code: 'agents-githook-missing',
      severity: 'error',
      message: '.githooks/pre-commit отсутствует — git-слой гейта briefs-immutable не работает',
      path: '.githooks/pre-commit',
    });
  } else if ((preCommit.mode & 0o111) === 0) {
    issues.push({
      code: 'agents-githook-not-executable',
      severity: 'error',
      message: '.githooks/pre-commit не исполняемый (chmod +x .githooks/pre-commit)',
      path: '.githooks/pre-commit',
    });
  }

  // 7. prepare-скрипт активирует core.hooksPath при pnpm install.
  const pkgRaw = await readFile(resolve(repoRoot, 'package.json'), 'utf-8').catch(() => null);
  if (pkgRaw !== null) {
    try {
      const pkg = JSON.parse(pkgRaw) as { scripts?: Record<string, string> };
      if (!pkg.scripts?.prepare?.includes('setup-githooks')) {
        issues.push({
          code: 'agents-prepare-missing',
          severity: 'error',
          message: 'package.json: scripts.prepare не вызывает scripts/setup-githooks.mjs — гейт не активируется при pnpm install',
          path: 'package.json',
        });
      }
    } catch {
      issues.push({
        code: 'agents-package-json-invalid',
        severity: 'error',
        message: 'package.json не парсится',
        path: 'package.json',
      });
    }
  }

  return issues;
}

/** Markdown-ссылки вида [..](path) без http(s)/mailto/якорей; ведущий «/» = от корня репо. */
export function extractRelativeLinks(markdown: string): string[] {
  const out: string[] = [];
  for (const m of markdown.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    let target = m[1] ?? '';
    if (!target) continue;
    if (/^(https?:|mailto:|#)/i.test(target)) continue;
    const hash = target.indexOf('#');
    if (hash !== -1) target = target.slice(0, hash);
    if (!target) continue;
    if (target.startsWith('/')) target = target.slice(1);
    out.push(target);
  }
  return out;
}
