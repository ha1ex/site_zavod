import { z } from 'zod';

/**
 * IntakeTzSchema — структура человекочитаемого ТЗ (техзадания), которое фабрика ТЗ
 * (intake-этап) готовит из сырых данных по методологии Kaiten Content Factory (§18).
 *
 * ТЗ — для ревью командой; из него же выводится машинный Brief (BriefSchema), который
 * уходит в пайплайн P0..P8. Реализация лендинга (TSX) и аналитика — НЕ здесь, их делает
 * downstream-пайплайн; тут только заметки (§18 implementation/analytics остаются опциональными).
 */

export const TzSourceKind = z.enum(['landing', 'kb', 'case', 'product', 'competitor', 'other']);

export const IntakeTzSchema = z.object({
  summary: z.string().min(10).describe('Краткое описание лендинга и выбранной логики'),

  audience_research: z
    .object({
      primary: z.string().describe('Основная аудитория'),
      decisionMaker: z.string().optional().describe('Кто принимает решение'),
      roles: z.array(z.string()).default([]).describe('Роли/сегменты'),
      pains: z.array(z.string()).default([]).describe('Боли (формулировка через управляемое улучшение, §8)'),
      selectionCriteria: z.array(z.string()).default([]).describe('Критерии выбора системы'),
      objections: z.array(z.string()).default([]).describe('Возможные возражения'),
    })
    .describe('Исследование аудитории (§7)'),

  competitor_research: z
    .array(z.object({ name: z.string(), takeaways: z.string().describe('Что учтено как best practice (без копирования)') }))
    .default([])
    .describe('Анализ конкурентов (§4.4)'),

  source_map: z
    .array(
      z.object({
        kind: TzSourceKind,
        ref: z.string().describe('URL или название источника'),
        used_for: z.string().describe('Для чего использован'),
      }),
    )
    .default([])
    .describe('Карта источников Kaiten/кейсов/конкурентов (§5)'),

  cases: z
    .array(z.object({ company: z.string(), result: z.string(), href: z.string().optional() }))
    .default([])
    .describe('Подобранные кейсы (§4.3) или пусто, если выбран альтернативный блок доверия'),

  seo: z
    .object({
      intent: z.string().describe('Основной поисковый интент'),
      keywords: z.array(z.string()).default([]).describe('5–15 ключевых запросов'),
      title: z.string().describe('SEO title (формула: Kaiten для [аудитории]: [задача])'),
      description: z.string().describe('SEO description'),
      url: z.string().describe('Человекопонятный URL'),
    })
    .describe('SEO-ядро (§17)'),

  landing_structure: z
    .array(
      z.object({
        block: z.string().describe('Название блока (Hero, мини-преимущества, кейсы, ...)'),
        purpose: z.string().describe('Какую задачу аудитории закрывает блок'),
        mockHint: z.string().optional().describe('Какой интерфейсный визуал показать (§14)'),
      }),
    )
    .min(1)
    .describe('Порядок блоков и логика каждого (§12/§13)'),

  landing_copy: z
    .array(
      z.object({
        block: z.string(),
        heading: z.string().optional(),
        body: z.string().describe('Готовый текст блока (русский, без англицизмов §10, без лозунгов §9)'),
      }),
    )
    .default([])
    .describe('Финальные тексты блоков (§9)'),

  visual_assets: z
    .array(z.object({ block: z.string(), description: z.string().describe('Готовый визуал или промпт/описание для генерации') }))
    .default([])
    .describe('Визуалы или их описания (§14)'),

  templates: z
    .array(z.object({ name: z.string(), href: z.string().optional() }))
    .default([])
    .describe('Шаблоны пространств/досок/документов (§12 блок 9)'),

  needs_confirmation: z
    .array(z.string())
    .default([])
    .describe('Спорные фичи/CTA/кейсы/факты, которые нужно подтвердить у человека (§5/§18)'),

  qa_checklist: z
    .array(z.string())
    .default([])
    .describe('Самопроверка перед публикацией (§20)'),
});

export type IntakeTz = z.infer<typeof IntakeTzSchema>;
