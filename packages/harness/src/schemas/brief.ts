import { z } from 'zod';

/**
 * BriefSchema — нормализованный вход от пользователя.
 * Цель: превратить размытую просьбу «сделай нам лендинг» в управляемые данные.
 * Этап 0: skeleton. На этапе 1 расширим примерами и few-shot контекстом.
 */
export const BriefSchema = z.object({
  product: z.string().min(2).describe('Короткое описание продукта'),
  audience: z.array(z.string()).min(1).describe('Целевая аудитория (роли/сегменты)'),
  market: z.string().describe('Рынок / сегмент (B2B SaaS, B2C, Enterprise...)'),
  primaryGoal: z
    .enum(['book_demo', 'signup', 'waitlist', 'contact_sales', 'try_free', 'download'])
    .describe('Главная конверсионная цель'),
  mainPain: z.string().describe('Главная боль аудитории, которую решает продукт'),
  mainPromise: z.string().describe('Главное обещание продукта'),
  proofPoints: z.array(z.string()).default([]).describe('Доказательства/факты для trust'),
  tone: z.string().default('clear, professional, non-hype').describe('Tone of voice'),
  cta: z.string().describe('Основной CTA-текст (label кнопки)'),
  pageArchetype: z
    .enum(['saas', 'waitlist', 'enterprise'])
    .default('saas')
    .describe('Тип лендинга — выбирается из доступных archetype'),
  resolvedSegments: z
    .array(z.string())
    .optional()
    .describe(
      'Резолвленные id сегментов из wiki/audiences/kaiten-scoring.json (опционально). ' +
        'Заполняется host-LLM после audience-research, когда lexical-match по audience/market не сработал.',
    ),
});

export type Brief = z.infer<typeof BriefSchema>;
