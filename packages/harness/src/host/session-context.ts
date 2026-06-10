/**
 * Провайдер-нейтральный session bootstrap для `harness agent context`.
 *
 * Единственный источник правды о «горячем» контексте — существующие bash-хуки
 * (scripts/hooks/*.sh): они уже работают вне Claude Code (PROJECT_DIR fallback
 * на pwd). Мы НЕ дублируем их логику в TS, а шеллимся к ним и парсим их
 * JSON-протокол (hookSpecificOutput.additionalContext / systemMessage).
 *
 * Деградация: нет bash/jq или скрипт упал → null, CLI печатает статичный
 * минимальный bootstrap (staticBootstrapText) вместо падения.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const HOOK_TIMEOUT_MS = 15_000;

const GATES_START = '<!-- gates:start -->';
const GATES_END = '<!-- gates:end -->';

function runHookScript(root: string, scriptName: string, stdinJson: string): string | null {
  const abs = resolve(root, 'scripts', 'hooks', scriptName);
  if (!existsSync(abs)) return null;
  try {
    const res = spawnSync('bash', [abs], {
      input: stdinJson,
      cwd: root,
      encoding: 'utf-8',
      timeout: HOOK_TIMEOUT_MS,
      // Хуки берут корень из CLAUDE_PROJECT_DIR (fallback pwd) — фиксируем явно.
      env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    });
    if (res.error || res.status !== 0) return null;
    const out = (res.stdout ?? '').trim();
    if (!out) return null;
    try {
      const parsed = JSON.parse(out) as {
        hookSpecificOutput?: { additionalContext?: string };
        systemMessage?: string;
      };
      return parsed.hookSpecificOutput?.additionalContext ?? parsed.systemMessage ?? null;
    } catch {
      return out; // скрипт напечатал plain text — отдаём как есть
    }
  } catch {
    return null;
  }
}

/** Горячий контекст репо (коммиты, briefs, landings, lessons, домены). */
export function buildSessionContextText(root: string): string | null {
  return runHookScript(root, 'session-start-context.sh', '{}');
}

/** Сводка по slug: brief + spec + approval + pipeline-артефакты. */
export function buildSlugContextText(root: string, slug: string): string | null {
  return runHookScript(root, 'user-prompt-slug-loader.sh', JSON.stringify({ prompt: slug }));
}

/** Финальный чек-лист релиза (аналог Stop-хука Claude). null = всё чисто. */
export function buildChecklistText(root: string): string | null {
  return runHookScript(root, 'stop-release-checklist.sh', '{}');
}

const FALLBACK_GATES_CARD = [
  '- content/briefs/** IMMUTABLE: новая итерация = новый файл (`<slug>-v2.json`).',
  '- Единственный вход генерации: `pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json`.',
  '- Обход гейтов (осознанный): HARNESS_SKIP_GATES=1 / --skip-gates / git commit --no-verify.',
].join('\n');

/**
 * Карточка Hard gates — парсится из AGENTS.md между маркерами gates:start/end.
 * Одна копия текста на весь репо; agent context печатает её дословно.
 */
export function extractGatesCard(root: string): string {
  try {
    const agents = readFileSync(resolve(root, 'AGENTS.md'), 'utf-8');
    const start = agents.indexOf(GATES_START);
    const end = agents.indexOf(GATES_END);
    if (start !== -1 && end !== -1 && end > start) {
      const card = agents.slice(start + GATES_START.length, end).trim();
      if (card) return card;
    }
  } catch {
    // AGENTS.md недоступен — fallback ниже
  }
  return FALLBACK_GATES_CARD;
}

/** Минимальный bootstrap, если bash-хуки недоступны (нет bash/jq). */
export function staticBootstrapText(): string {
  return [
    '# Контент-завод Кайтен — минимальный bootstrap (bash-хуки недоступны)',
    '',
    '- Точка входа сборки: `pnpm -w run harness agent build landing --slug <slug> --brief content/briefs/<slug>.json`',
    '- Контракт сессии: AGENTS.md (корень репо). Плейбук: .claude/skills/kaiten-generate/SKILL.md.',
    '- Активные брифы: `ls content/briefs/`. Пайплайн-артефакты: `.context/pipeline/<slug>/`.',
  ].join('\n');
}
