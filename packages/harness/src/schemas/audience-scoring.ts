import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';

/**
 * AudienceScoringSchema — конфиг audience-score gate.
 * SSoT — wiki/audiences/kaiten-scoring.json.
 */

export const ScoringSegmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  rank: z.number().int().min(1),
  compositeScore: z.number().min(0).max(100),
  websiteScore: z.number().min(0).max(100),
  wim: z.number().min(0).max(1),
  websiteZone: z.enum(['PLG', 'Sales-Enable', 'Partner-Led', 'Low', 'Антипрофиль']),
  ctaTypes: z.array(z.enum(['Trial', 'Demo', 'PDF', 'Partner', 'Blog'])),
  synonyms: z.array(z.string()).default([]),
  mustHaveStories: z.array(z.string()).default([]),
  antiProfile: z.boolean().optional(),
});

export const ScoringRoleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  rank: z.number().int().min(1),
  compositeScore: z.number().min(0).max(100),
  synonyms: z.array(z.string()).default([]),
  focusKeywords: z.array(z.string()).default([]),
  preferredCta: z.enum(['Trial', 'Demo', 'PDF', 'Partner', 'Blog']),
});

export const ScoringStorySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  rank: z.number().int().min(1),
  score: z.number().min(0).max(100),
  ctaType: z.enum(['Trial', 'Demo', 'PDF', 'Partner', 'Blog']),
  lifeSituation: z.string(),
  primarySegments: z.array(z.string()).default([]),
  primaryRoles: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  antiProfile: z.boolean().optional(),
});

export const MustPassRuleSchema = z.object({
  id: z.string().min(1),
  when: z.object({ segmentAnyOf: z.array(z.string()).optional() }).default({}),
  expect: z.string().min(1),
  rationale: z.string().min(1),
});

export const AudienceScoringSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  source: z.string(),
  note: z.string().optional(),
  scoringFormula: z.object({
    subscores: z.array(z.object({ id: z.string(), label: z.string(), weight: z.number() })),
    defaultThreshold: z.number().min(0).max(100),
    defaultMaxAttempts: z.number().int().min(1),
  }),
  segments: z.array(ScoringSegmentSchema).min(1),
  roles: z.array(ScoringRoleSchema).min(1),
  userStories: z.array(ScoringStorySchema).min(1),
  crossMap: z.record(z.string(), z.record(z.string(), z.number().min(0).max(5))),
  mustPassRules: z.array(MustPassRuleSchema).default([]),
  priorities: z.record(z.string(), z.array(z.string())).optional(),
});

export type AudienceScoring = z.infer<typeof AudienceScoringSchema>;
export type ScoringSegment = z.infer<typeof ScoringSegmentSchema>;
export type ScoringRole = z.infer<typeof ScoringRoleSchema>;
export type ScoringStory = z.infer<typeof ScoringStorySchema>;
export type MustPassRule = z.infer<typeof MustPassRuleSchema>;

const cache = new Map<string, AudienceScoring>();

export const DEFAULT_SCORING_PATH = 'wiki/audiences/kaiten-scoring.json';

export async function loadAudienceScoring(
  root: string,
  relPath: string = DEFAULT_SCORING_PATH,
): Promise<AudienceScoring> {
  const abs = resolve(root, relPath);
  const cached = cache.get(abs);
  if (cached) return cached;
  const raw = await readFile(abs, 'utf-8');
  const parsed = AudienceScoringSchema.parse(JSON.parse(raw));
  cache.set(abs, parsed);
  return parsed;
}

export function clearAudienceScoringCache(): void {
  cache.clear();
}
