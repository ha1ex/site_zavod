/**
 * Детект host-агента (какая нейронка ведёт сессию в этом репо).
 *
 * Харнесс провайдер-нейтрален: phased pipeline работает с любым host-LLM
 * (Claude Code, OpenAI Codex CLI, Gemini CLI, …). Детект нужен только чтобы
 * `harness agent context` печатал подсказки под конкретный инструмент.
 *
 * ВАЖНО: детект — best-effort и НЕ несёт enforcement-нагрузки. Жёсткие гейты
 * (см. src/gates/) работают одинаково независимо от того, кто определился.
 * unknown — консервативный дефолт: максимально подробный bootstrap.
 *
 * Новый агент = один элемент в HOST_AGENT_PROFILES (имя, алиасы, env-переменные).
 */

export type HostAgentName = 'claude-code' | 'codex' | 'gemini' | 'unknown';

export interface HostAgentProfile {
  name: HostAgentName;
  label: string;
  /** Алиасы для override через HARNESS_AGENT / --agent. */
  aliases: string[];
  /** Env-переменные, по которым агент детектится автоматически. */
  detectVars: string[];
  /** Хост сам инжектит контекст через хуки (SessionStart и т.п.). */
  hasHooks: boolean;
  /** Хост автоматически подхватывает .claude/skills. */
  hasSkills: boolean;
  /** Печатать полный bootstrap в `agent context` (нет своих механизмов). */
  needsExplicitContext: boolean;
}

export const UNKNOWN_PROFILE: HostAgentProfile = {
  name: 'unknown',
  label: 'неизвестный агент',
  aliases: [],
  detectVars: [],
  hasHooks: false,
  hasSkills: false,
  needsExplicitContext: true,
};

/**
 * Порядок профилей = приоритет детекта. Codex/Gemini идут РАНЬШЕ Claude:
 * их sandbox-маркеры (CODEX_SANDBOX и т.п.) выставляет непосредственный
 * родитель процесса, а CLAUDE_CODE_* наследуется сквозь вложенные запуски
 * (проверено эмпирически: codex exec из Claude-сессии несёт оба набора).
 */
export const HOST_AGENT_PROFILES: HostAgentProfile[] = [
  {
    name: 'codex',
    label: 'OpenAI Codex CLI',
    aliases: ['codex', 'gpt', 'openai', 'chatgpt'],
    // Codex 0.13x выставляет их в sandbox-режимах (проверено на 0.130.0:
    // CODEX_SANDBOX=seatbelt, CODEX_SANDBOX_NETWORK_DISABLED=1, CODEX_CI=1,
    // CODEX_THREAD_ID=…). В danger-full-access могут отсутствовать → unknown (это ок).
    detectVars: ['CODEX_SANDBOX', 'CODEX_SANDBOX_NETWORK_DISABLED', 'CODEX_THREAD_ID', 'CODEX_CI'],
    hasHooks: false,
    hasSkills: false,
    needsExplicitContext: true,
  },
  {
    name: 'gemini',
    label: 'Gemini CLI / Antigravity',
    aliases: ['gemini', 'agy', 'antigravity', 'google'],
    detectVars: ['GEMINI_CLI', 'GEMINI_CLI_VERSION'],
    hasHooks: false,
    hasSkills: false,
    needsExplicitContext: true,
  },
  {
    name: 'claude-code',
    label: 'Claude Code',
    aliases: ['claude', 'claude-code', 'anthropic'],
    detectVars: ['CLAUDECODE', 'CLAUDE_CODE_SESSION_ID', 'CLAUDE_CODE_ENTRYPOINT'],
    hasHooks: true,
    hasSkills: true,
    needsExplicitContext: false,
  },
];

export interface HostAgentDetection {
  profile: HostAgentProfile;
  /** Откуда взялся вердикт: '--agent' | 'HARNESS_AGENT' | имя env-переменной | 'fallback'. */
  via: string;
}

/** Резолв профиля по имени/алиасу (для HARNESS_AGENT / --agent). */
export function resolveHostAgent(nameRaw: string): HostAgentProfile {
  const name = nameRaw.trim().toLowerCase();
  for (const p of HOST_AGENT_PROFILES) {
    if (p.name === name || p.aliases.includes(name)) return p;
  }
  // Неизвестный алиас: ведём себя как unknown, но показываем как назвался.
  return { ...UNKNOWN_PROFILE, label: `${nameRaw} (профиля нет — universal bootstrap)` };
}

export function detectHostAgent(
  opts: { env?: NodeJS.ProcessEnv; override?: string } = {},
): HostAgentDetection {
  const env = opts.env ?? process.env;

  if (opts.override?.trim()) {
    return { profile: resolveHostAgent(opts.override), via: '--agent' };
  }
  if (env.HARNESS_AGENT?.trim()) {
    return { profile: resolveHostAgent(env.HARNESS_AGENT), via: 'HARNESS_AGENT' };
  }
  for (const profile of HOST_AGENT_PROFILES) {
    const hit = profile.detectVars.find((v) => env[v] !== undefined && env[v] !== '');
    if (hit) return { profile, via: hit };
  }
  return { profile: UNKNOWN_PROFILE, via: 'fallback' };
}

/** Подсказки под конкретный инструмент (печатает `agent context`). */
export function agentNotes(profile: HostAgentProfile): string[] {
  switch (profile.name) {
    case 'claude-code':
      return [
        'Hooks активны: SessionStart уже инжектировал горячий контекст (эта команда его дублирует — это нормально).',
        'Скиллы kaiten-generate / kaiten-intake / kaiten-review подхватываются автоматически.',
      ];
    case 'codex':
      return [
        'Claude-хуки и .claude/skills здесь НЕ работают — этот вывод и есть твой bootstrap.',
        'Жёсткие гейты работают и без хуков: git pre-commit (.githooks/) + проверки в harness CLI.',
        'Sandbox: для сборки нужен режим workspace-write (в read-only pnpm падает на записи кэша).',
        'Полный плейбук сборки — .claude/skills/kaiten-generate/SKILL.md (обычный markdown, просто прочитай).',
        'Перед финальным ответом: pnpm -w run harness agent checklist.',
      ];
    case 'gemini':
      return [
        'Claude-хуки и .claude/skills здесь НЕ работают — этот вывод и есть твой bootstrap.',
        'Жёсткие гейты работают и без хуков: git pre-commit (.githooks/) + проверки в harness CLI.',
        'Полный плейбук сборки — .claude/skills/kaiten-generate/SKILL.md (обычный markdown, просто прочитай).',
        'Перед финальным ответом: pnpm -w run harness agent checklist.',
      ];
    default:
      return [
        'Агент не определился — печатаю универсальный bootstrap (это безопасный дефолт).',
        'Если знаешь, кто ты: export HARNESS_AGENT=codex|gemini|claude-code (или флаг --agent) — будут точные подсказки.',
        'Жёсткие гейты работают независимо от детекта: git pre-commit (.githooks/) + проверки в harness CLI.',
        'Полный плейбук сборки — .claude/skills/kaiten-generate/SKILL.md (обычный markdown, просто прочитай).',
        'Перед финальным ответом: pnpm -w run harness agent checklist.',
      ];
  }
}
