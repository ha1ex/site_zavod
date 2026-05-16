import { z } from 'zod';

/**
 * LayoutDecision — output фазы P2 «Layout Selection».
 *
 * Связывает audience-plan с конкретным layout-плейбуком. Дальнейшие фазы
 * (P3 coverage audit, P4 section architect) используют это как фундамент.
 */

export const SectionSlotSchema = z.object({
  slot: z.number().int().nonnegative(),
  component: z.string().describe('Имя компонента — HeroSection, MediaCopy, ProcessSteps, ...'),
  required: z.boolean(),
  mockHint: z.string().optional().describe('Рекомендованный mock-variant из layout playbook'),
});
export type SectionSlot = z.infer<typeof SectionSlotSchema>;

export const LayoutAlternativeSchema = z.object({
  layoutSlug: z.string(),
  rejectedBecause: z.string().min(20),
});

export const LayoutDecisionSchema = z.object({
  layoutSlug: z
    .string()
    .describe('Slug одного из layouts (wiki/layouts/<slug>.md)'),
  whyThisLayout: z
    .string()
    .min(50)
    .describe('Обоснование: чем layout подходит под audience+awareness'),
  alternativesConsidered: z
    .array(LayoutAlternativeSchema)
    .max(2)
    .default([])
    .describe('Top-2 альтернативы + почему отвергнуты'),
  requiredSectionOrder: z
    .array(SectionSlotSchema)
    .describe('Извлечённая структура из layout doc'),
});

export type LayoutDecision = z.infer<typeof LayoutDecisionSchema>;
