import { z } from 'zod';

/**
 * MockAllocation — output фазы P5 «Mock Allocation Refinement».
 *
 * Финальный per-slot выбор mock-варианта с rationale. После этого этапа
 * LLM в P6 уже не может менять mockVariant — только заполняет копи.
 */

export const MockSlotDecisionSchema = z.object({
  slot: z.number().int().nonnegative(),
  component: z.string(),
  mockVariant: z.string().describe('Финальный выбор. Если default — rationale обязателен'),
  rationaleText: z
    .string()
    .min(20)
    .describe('2-3 предложения: почему именно этот variant, что он показывает'),
});
export type MockSlotDecision = z.infer<typeof MockSlotDecisionSchema>;

export const MockAllocationSchema = z.object({
  decisions: z.array(MockSlotDecisionSchema).min(1),
  warningsFromP5: z
    .array(z.string())
    .default([])
    .describe('Soft-warnings из P5 (alternating mediaPosition, etc.)'),
});

export type MockAllocation = z.infer<typeof MockAllocationSchema>;
