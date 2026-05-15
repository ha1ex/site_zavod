import { generateText } from 'ai';
import type { IllustrationSpec } from '../schemas/illustration-spec.js';
import { getModel, hasLLMCredentials, resolveProvider } from '../providers/index.js';
import {
  buildIllustrationSystemPrompt,
  buildIllustrationUserPrompt,
} from '../prompts/system.js';

/**
 * Этап 3: LLM-генерация TSX SVG-иллюстрации по IllustrationSpec.
 *
 * В отличие от LandingSpec (structured JSON через generateObject), здесь модель
 * пишет TSX-код. Контракт — пройти AST-валидатор; repair-loop этапа 4 будет
 * скармливать ошибки валидатора обратно в модель.
 */
export interface IllustrationLLMOptions {
  timeoutMs?: number;
  maxRetries?: number;
}

const FENCE_RE = /^```(?:tsx|typescript|ts|jsx|javascript|js)?\n?|\n?```\s*$/gi;

/** Срезает markdown-обёртку ```tsx … ``` если модель её всё-таки добавила. */
export function stripCodeFences(raw: string): string {
  let text = raw.trim();
  if (text.startsWith('```')) {
    text = text.replace(FENCE_RE, '').trim();
  }
  return text;
}

export async function generateIllustrationTSXWithLLM(
  spec: IllustrationSpec,
  options: IllustrationLLMOptions = {},
): Promise<string> {
  if (!hasLLMCredentials()) {
    throw new Error(
      `No LLM credentials for provider "${resolveProvider()}". ` +
        `Запусти \`vercel env pull\` для OIDC-токена (Gateway), ` +
        `либо заполни .env.local по .env.example. Или используй --no-llm.`,
    );
  }

  const system = await buildIllustrationSystemPrompt();
  const prompt = buildIllustrationUserPrompt(spec);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 120_000);

  try {
    const result = await generateText({
      model: getModel(),
      system,
      prompt,
      maxRetries: options.maxRetries ?? 2,
      abortSignal: controller.signal,
    });
    return stripCodeFences(result.text);
  } finally {
    clearTimeout(timeout);
  }
}
