import { z } from 'zod';

/**
 * DiversityReport — output финального cross-landing diversity audit.
 *
 * Сравнивает текущий лендинг со всеми другими в content/landings/.
 * Soft warnings по умолчанию, hard через --strict-diversity.
 */

export const DiversityIssueSchema = z.object({
  rule: z.enum([
    'mock-overused-globally',
    'landing-structure-duplicate',
    'landing-semantic-duplicate',
    'landing-copy-similarity',
  ]),
  message: z.string(),
  where: z.string().optional(),
});
export type DiversityIssue = z.infer<typeof DiversityIssueSchema>;

export const DiversityReportSchema = z.object({
  domain: z.string(),
  structureFingerprint: z.string(),
  semanticFingerprint: z.string(),
  errors: z.array(DiversityIssueSchema).default([]),
  warnings: z.array(DiversityIssueSchema).default([]),
  /** Метрики для сводной аналитики */
  mockOveruseEntries: z
    .array(z.object({ variant: z.string(), count: z.number().int(), limit: z.number().int() }))
    .default([]),
  similarLandings: z
    .array(z.object({ slug: z.string(), similarity: z.number().min(0).max(1) }))
    .default([]),
});

export type DiversityReport = z.infer<typeof DiversityReportSchema>;
