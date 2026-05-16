import { z } from 'zod';

/**
 * AudienceIntentPlan — output фазы P1 «Audience Intent Analysis».
 *
 * До этой фазы pipeline принимает решения о структуре, копи и mock'ах без
 * чёткого понимания «кому продаём». P1 фиксирует целевую аудиторию из brief
 * и scoring-config в структурированной форме — все последующие фазы
 * строятся вокруг этого решения.
 */

export const AwarenessLevelSchema = z.enum([
  'unaware',
  'problem-aware',
  'solution-aware',
  'product-aware',
  'most-aware',
]);
export type AwarenessLevel = z.infer<typeof AwarenessLevelSchema>;

export const DecisionMakerSchema = z.enum(['dm', 'itdir', 'exec', 'end-user']);
export type DecisionMaker = z.infer<typeof DecisionMakerSchema>;

export const CtaTypeSchema = z.enum(['Trial', 'Demo', 'PDF', 'Partner', 'Blog']);
export type CtaType = z.infer<typeof CtaTypeSchema>;

export const AudienceIntentPlanSchema = z.object({
  resolvedSegments: z
    .array(z.string())
    .min(1)
    .describe('id сегментов из wiki/audiences/kaiten-scoring.json'),
  awareness: AwarenessLevelSchema,
  decisionMaker: DecisionMakerSchema,
  topUserStories: z
    .array(z.string())
    .min(3)
    .max(7)
    .describe('id user stories из scoring config, отсортированных по релевантности'),
  mustCoverIntents: z
    .array(z.string())
    .min(1)
    .describe('Список intent-тэгов, которые spec ОБЯЗАН покрыть (compare, security, fast-check, ...)'),
  forbiddenIntents: z
    .array(z.string())
    .default([])
    .describe('Intent-тэги, которых быть НЕ должно (антипрофиль / другой сегмент)'),
  preferredCtaTypes: z
    .array(CtaTypeSchema)
    .min(1)
    .describe('Предпочтительные типы CTA для этого сегмента'),
  rationale: z
    .string()
    .min(100)
    .describe('2-3 абзаца обоснования: почему этот сегмент, awareness, DM'),
});

export type AudienceIntentPlan = z.infer<typeof AudienceIntentPlanSchema>;
