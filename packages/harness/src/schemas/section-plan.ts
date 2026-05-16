import { z } from 'zod';

/**
 * SectionPlan — output фазы P4 «Section Architect».
 *
 * Архитектура секций БЕЗ копирайта: для каждого слота — компонент, intent,
 * закрываемые user stories, выбор mock-варианта. Копирайт пишется в P6
 * уже в готовую структуру.
 */

export const SectionIntentSchema = z.object({
  slot: z.number().int().nonnegative(),
  component: z.string().describe('Имя компонента — HeroSection, MediaCopy, ProcessSteps, ...'),
  intent: z
    .string()
    .min(2)
    .max(120)
    .describe('Что эта секция доказывает: main-promise, ядро PM, fast-start, vs-jira, ...'),
  coversStoryIds: z
    .array(z.string())
    .default([])
    .describe('id user stories из scoring config, которые закрывает эта секция'),
  coversRoleIds: z
    .array(z.string())
    .default([])
    .describe('id ролей из scoring config'),
  ctaType: z.string().optional().describe('Если секция содержит CTA — его тип'),
  keyMessage: z
    .string()
    .min(4)
    .max(200)
    .describe('1 строка: что секция говорит. Не копирайт, а тезис'),
  mockVariant: z
    .string()
    .optional()
    .describe('Обязателен для визуальных слотов (Hero, MediaCopy, Tabs, Scenario)'),
  mockVariantRationale: z
    .string()
    .optional()
    .describe('Если mockVariant=default/generic — обязательное объяснение'),
});
export type SectionIntent = z.infer<typeof SectionIntentSchema>;

export const SectionPlanSchema = z.object({
  sections: z.array(SectionIntentSchema).min(1),
  storyCoverageMap: z
    .record(z.string(), z.array(z.number().int().nonnegative()))
    .describe('storyId → [slot indices] — какие секции закрывают каждую story'),
});

export type SectionPlan = z.infer<typeof SectionPlanSchema>;
