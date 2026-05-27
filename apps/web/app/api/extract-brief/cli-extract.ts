import { spawn } from 'node:child_process';

/**
 * Извлечение Brief через локально установленные LLM CLI (без API ключа).
 * Использует OAuth-сессии CLI которые уже авторизованы на машине:
 *   - claude (Claude Code) — supports --json-schema structured output
 *   - codex (Codex CLI)    — non-interactive exec, JSON через prompt
 *   - agy (Gemini)         — non-interactive --print, JSON через prompt
 *
 * Приоритет: claude > codex > agy (по качеству structured output).
 */

export type CliProvider = 'claude' | 'codex' | 'agy';

export interface CliExtractResult {
  brief: unknown;
  provider: `${CliProvider}-cli`;
  costUsd?: number;
  durationMs: number;
}

const PROMPT_TEMPLATE = `Из текста ниже извлеки JSON Brief по схеме.

Поля:
- product (string): краткое описание продукта одним предложением, без hype-слов
- audience (string[]): целевые роли/сегменты (не "все"), конкретно
- market (string): тип рынка (обычно "B2B SaaS", "B2C", "Enterprise")
- primaryGoal (enum): book_demo | signup | waitlist | contact_sales | try_free | download
- mainPain (string): главная боль клиента
- mainPromise (string): что обещает продукт
- proofPoints (string[]): 3+ конкретных фактов (цифры, сертификаты, кейсы)
- tone (string): обычно "clear, professional, non-hype"
- cta (string): текст основной кнопки, согласованный с primaryGoal
- pageArchetype (enum): saas | waitlist | enterprise (по умолчанию saas)
- pageLayout (string|null): один из layouts если ясно из контекста:
    enterprise-modular-saas, single-module-deep-dive, compliance-first-enterprise,
    comparison-vs-competitor, story-led-unaware, depersonalized-product-tour,
    crm-product-tour, migration-from-competitor, product-launch, case-study-deep-dive

Верни ТОЛЬКО валидный JSON объект, без markdown-обёртки, без объяснений, без вызовов tools.

Текст для извлечения:
{TEXT}`;

interface ProcResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
}

async function runProcess(
  cmd: string,
  args: string[],
  stdin: string | null,
  timeoutMs: number,
): Promise<ProcResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(cmd, args, {
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (c: Buffer) => {
      stdout += c.toString('utf-8');
    });
    child.stderr.on('data', (c: Buffer) => {
      stderr += c.toString('utf-8');
    });
    const timer = setTimeout(() => {
      try {
        child.kill('SIGTERM');
      } catch {
        // ignore
      }
      resolve({
        ok: false,
        stdout,
        stderr: stderr + `\n[timeout after ${timeoutMs}ms]`,
        durationMs: Date.now() - start,
      });
    }, timeoutMs);
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, stdout, stderr, durationMs: Date.now() - start });
    });
    child.on('error', (e) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        stdout,
        stderr: stderr + '\n' + e.message,
        durationMs: Date.now() - start,
      });
    });
    if (stdin !== null) {
      child.stdin.write(stdin);
      child.stdin.end();
    } else {
      child.stdin.end();
    }
  });
}

function findJsonObject(text: string): unknown | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced && fenced[1]) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {
      // continue
    }
  }
  try {
    return JSON.parse(text.trim());
  } catch {
    // continue
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      // continue
    }
  }
  return null;
}

async function which(cmd: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const child = spawn('which', [cmd], {
      env: process.env,
    });
    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

export async function detectAvailableCli(): Promise<Record<CliProvider, boolean>> {
  const [claude, codex, agy] = await Promise.all([which('claude'), which('codex'), which('agy')]);
  return { claude, codex, agy };
}

const PER_CLI_TIMEOUT_MS = 45_000;
const FAIL_TTL_MS = 3 * 60_000;

async function extractViaClaude(text: string): Promise<CliExtractResult | null> {
  // Просто prompt + JSON-парсинг ответа. --json-schema flag иногда уходит в долгий reasoning.
  const prompt = PROMPT_TEMPLATE.replace('{TEXT}', text);
  const result = await runProcess(
    'claude',
    ['-p', '--output-format', 'json', prompt],
    null,
    PER_CLI_TIMEOUT_MS,
  );
  if (!result.ok || !result.stdout) return null;
  try {
    const meta = JSON.parse(result.stdout) as {
      is_error?: boolean;
      result?: string;
      total_cost_usd?: number;
    };
    if (meta.is_error || !meta.result) return null;
    const brief = findJsonObject(meta.result);
    if (!brief) return null;
    return {
      brief,
      provider: 'claude-cli',
      costUsd: meta.total_cost_usd,
      durationMs: result.durationMs,
    };
  } catch {
    return null;
  }
}

async function extractViaCodex(text: string): Promise<CliExtractResult | null> {
  const prompt = PROMPT_TEMPLATE.replace('{TEXT}', text);
  const result = await runProcess('codex', ['exec', prompt], null, PER_CLI_TIMEOUT_MS);
  if (!result.ok || !result.stdout) return null;
  const json = findJsonObject(result.stdout);
  if (!json) return null;
  return { brief: json, provider: 'codex-cli', durationMs: result.durationMs };
}

async function extractViaAgy(text: string): Promise<CliExtractResult | null> {
  const prompt = PROMPT_TEMPLATE.replace('{TEXT}', text);
  const result = await runProcess(
    'agy',
    ['-p', '--dangerously-skip-permissions', prompt],
    null,
    PER_CLI_TIMEOUT_MS,
  );
  if (!result.ok || !result.stdout) return null;
  const json = findJsonObject(result.stdout);
  if (!json) return null;
  return { brief: json, provider: 'agy-cli', durationMs: result.durationMs };
}

const EXTRACTORS: Record<CliProvider, (text: string) => Promise<CliExtractResult | null>> = {
  claude: extractViaClaude,
  codex: extractViaCodex,
  agy: extractViaAgy,
};

/**
 * Adaptive failure cache. Если CLI fail на extract — помечаем как «временно
 * недоступен» на 3 минуты и пропускаем в chain. Снимает заметную часть
 * медленности когда, например, `agy` не авторизован OAuth'ом.
 */
const FAIL_CACHE = new Map<CliProvider, number>();

function isCurrentlyFailing(provider: CliProvider): boolean {
  const failedAt = FAIL_CACHE.get(provider);
  if (!failedAt) return false;
  if (Date.now() - failedAt > FAIL_TTL_MS) {
    FAIL_CACHE.delete(provider);
    return false;
  }
  return true;
}

function markFailing(provider: CliProvider) {
  FAIL_CACHE.set(provider, Date.now());
}

function markSucceeded(provider: CliProvider) {
  FAIL_CACHE.delete(provider);
}

export function getFailureSnapshot(): Record<CliProvider, boolean> {
  return {
    claude: isCurrentlyFailing('claude'),
    codex: isCurrentlyFailing('codex'),
    agy: isCurrentlyFailing('agy'),
  };
}

export async function extractBriefViaCli(
  text: string,
  preferred?: CliProvider,
): Promise<CliExtractResult | null> {
  const installed = await detectAvailableCli();
  const order: CliProvider[] = [];
  if (preferred && installed[preferred] && !isCurrentlyFailing(preferred)) {
    order.push(preferred);
  }
  for (const p of ['claude', 'codex', 'agy'] as const) {
    if (p === preferred) continue;
    if (installed[p] && !isCurrentlyFailing(p)) order.push(p);
  }
  for (const provider of order) {
    const result = await EXTRACTORS[provider](text);
    if (result) {
      markSucceeded(provider);
      return result;
    }
    markFailing(provider);
  }
  return null;
}
