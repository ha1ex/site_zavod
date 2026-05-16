import { z } from 'zod';

/**
 * CoverageReport — output фазы P3 «Library Coverage Audit» (deterministic).
 *
 * Проверяет: есть ли в библиотеке mock'и для всех слотов выбранного layout
 * в резолвленном домене. Если нет — блокирует pipeline до создания
 * недостающих компонентов.
 */

export const CoverageStatusSchema = z.enum([
  'ok',
  'enrich-recommended',
  'enrich-required',
  'domain-missing',
]);
export type CoverageStatus = z.infer<typeof CoverageStatusSchema>;

export const SlotCoverageSchema = z.object({
  slot: z.number().int().nonnegative(),
  component: z.string(),
  recommendedMockVariant: z.string().optional(),
  mockExists: z.boolean(),
  mockInDomain: z.boolean().describe('true если mock принадлежит резолвленному домену'),
  note: z.string().optional(),
});
export type SlotCoverage = z.infer<typeof SlotCoverageSchema>;

export const CoverageReportSchema = z.object({
  status: CoverageStatusSchema,
  domain: z.string(),
  layout: z.string(),
  slotCoverage: z.array(SlotCoverageSchema),
  missingMocks: z
    .array(
      z.object({
        variant: z.string(),
        description: z.string(),
        forSlot: z.number().int().nonnegative().optional(),
      }),
    )
    .default([]),
  coverageScore: z
    .number()
    .min(0)
    .max(100)
    .describe('% слотов с domain-relevant mock\'ами'),
  blockedReason: z.string().optional(),
});

export type CoverageReport = z.infer<typeof CoverageReportSchema>;
