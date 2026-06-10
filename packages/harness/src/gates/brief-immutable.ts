/**
 * Гейт «briefs immutable» — runtime-слой (слой 2 из 3).
 *
 * Три слоя одной защиты (одинаковое поведение под любым host-агентом):
 *   1. git pre-commit (.githooks/pre-commit) — блокирует коммит правки брифа;
 *   2. этот модуль — harness CLI отказывается вести pipeline при изменённом брифе
 *      (agent build / apply / run / run-phase / intake-apply);
 *   3. Claude-hook scripts/hooks/pre-brief-immutable.sh — блокирует Edit/Write до записи
 *      (работает только под Claude Code; слои 1–2 дают паритет остальным).
 *
 * Обход (осознанный, обсуди с пользователем): HARNESS_SKIP_GATES=1 или --skip-gates.
 */

import { spawnSync } from 'node:child_process';
import chalk from 'chalk';

export type GitRunner = (args: string[], cwd: string) => { status: number | null; stdout: string };

const defaultGitRunner: GitRunner = (args, cwd) => {
  const res = spawnSync('git', args, { cwd, encoding: 'utf-8' });
  return { status: res.status, stdout: res.stdout ?? '' };
};

export interface BriefGateViolation {
  /** M (modified) | D (deleted) | R (renamed). */
  status: string;
  file: string;
}

export interface BriefGateResult {
  ok: boolean;
  /** Почему проверка не выполнялась (а не «нарушений нет»). */
  skipped?: 'env-bypass' | 'no-git';
  violations: BriefGateViolation[];
}

/**
 * Сравнивает worktree с HEAD (ловит и staged, и unstaged правки).
 * Новые (untracked / added) брифы — разрешены: новая итерация = новый файл.
 */
export function checkBriefsUnmodified(
  root: string,
  opts: { env?: NodeJS.ProcessEnv; git?: GitRunner } = {},
): BriefGateResult {
  const env = opts.env ?? process.env;
  const git = opts.git ?? defaultGitRunner;

  if (env.HARNESS_SKIP_GATES === '1') {
    return { ok: true, skipped: 'env-bypass', violations: [] };
  }

  const probe = git(['rev-parse', '--git-dir'], root);
  if (probe.status !== 0) {
    // Не git-репо (tarball, CI-артефакт) — гейту не на что опираться.
    return { ok: true, skipped: 'no-git', violations: [] };
  }

  const diff = git(['diff', '--name-status', '--diff-filter=MDR', 'HEAD', '--', 'content/briefs'], root);
  if (diff.status !== 0) {
    // Например, unborn HEAD (репо без коммитов) — нечего сравнивать.
    return { ok: true, skipped: 'no-git', violations: [] };
  }

  const violations: BriefGateViolation[] = [];
  for (const line of diff.stdout.split('\n')) {
    const parts = line.split('\t');
    const status = parts[0];
    const file = parts[1]; // для rename parts[1] = старый путь (он и нарушает)
    if (!status || !file) continue;
    if (!/^[MDR]/.test(status)) continue;
    if (!file.startsWith('content/briefs/') || !file.endsWith('.json')) continue;
    violations.push({ status: status.charAt(0), file });
  }

  return { ok: violations.length === 0, violations };
}

/** Текст зеркалит scripts/hooks/pre-brief-immutable.sh — одна формулировка на все слои. */
export function formatBriefGateError(violations: BriefGateViolation[]): string {
  const lines = [
    chalk.red('🛑 BLOCKED: content/briefs/ — IMMUTABLE (см. AGENTS.md, docs/pipeline.md).'),
    '',
    'Изменены существующие брифы (рабочая копия отличается от HEAD):',
    ...violations.map((v) => chalk.red(`  ${v.status}  ${v.file}`)),
    '',
    'Бриф нельзя перезаписывать — это исходник, на который ссылаются',
    'LandingSpec, approvals и diversity-audit.',
    '',
    'Что делать:',
    '  • Новая итерация — создай content/briefs/<slug>-v2.json (новый файл проходит свободно).',
    '  • Поменять копию/SEO — правь LandingSpec (content/landings/<slug>.json), а не brief.',
    '  • Откатить случайную правку: git checkout -- content/briefs/',
    '  • Осознанный обход (обсуди с пользователем): HARNESS_SKIP_GATES=1 или --skip-gates.',
  ];
  return lines.join('\n');
}

/** Вызов первой строкой в pipeline-командах CLI. Нарушение → exit 2. */
export function assertBriefsUnmodifiedOrExit(root: string, opts: { skip?: boolean } = {}): void {
  const result = checkBriefsUnmodified(root);
  if (opts.skip) {
    if (!result.ok) {
      console.error(
        chalk.yellow(
          `[harness] ⚠ --skip-gates: гейт briefs-immutable пропущен ОСОЗНАННО (нарушений: ${result.violations.length}).`,
        ),
      );
    }
    return;
  }
  if (result.skipped === 'env-bypass') {
    console.error(chalk.yellow('[harness] ⚠ HARNESS_SKIP_GATES=1 — гейт briefs-immutable пропущен.'));
    return;
  }
  if (result.ok) return;
  console.error(formatBriefGateError(result.violations));
  process.exit(2);
}
