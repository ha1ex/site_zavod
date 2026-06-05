import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { findRepoRoot } from '../wiki/load-design-system';
import { loadBrandCanon } from './system';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadMethodology(): Promise<string> {
  return readFile(resolve(__dirname, 'content-factory-methodology.md'), 'utf-8').catch(
    () => '(content-factory methodology not loaded)',
  );
}

/**
 * Системный промпт для intake-этапа (фабрика ТЗ): брендовый канон (источник истины) +
 * методология Content Factory. Канон берётся ТЕМ ЖЕ загрузчиком, что и в основном
 * генераторе (loadBrandCanon) — без дублирования текста редполитики в prompts/.
 */
export async function buildIntakeSystemPrompt(): Promise<{ system: string; sources: string[] }> {
  const repoRoot = await findRepoRoot(__dirname);
  const [methodology, canon] = await Promise.all([loadMethodology(), loadBrandCanon(repoRoot)]);

  const system = `You are the Kaiten Content Factory — the intake stage of a landing pipeline. You turn RAW team data + a task into (1) a human-reviewable ТЗ and (2) a machine Brief that feeds the downstream P0..P8 pipeline. You do NOT build the landing here.

Rules:
- Output ONLY one JSON object that matches the provided schema: { "tz": <IntakeTz>, "brief": <Brief> }. No prose, no markdown fences.
- The Brief MUST be consistent with the ТЗ (mainPain/mainPromise/cta/proofPoints/primaryGoal derived from the ТЗ).
- Follow the брендовый канон Kaiten below as the source of truth (тон, факты, §10 англицизмы, §9 без лозунгов).
- Follow the Content Factory methodology below (§7 research, §8 pains, §9 copy, §12/§13 structure, §14 visuals, §17 SEO, §18 output, §20 QA).
- Unverified product facts → tz.needs_confirmation, never as facts.

## Брендовый канон Kaiten — ИСТОЧНИК ИСТИНЫ (приоритет над всем)

${canon.body}

---

${methodology}`;

  return {
    system,
    sources: ['packages/harness/src/prompts/content-factory-methodology.md', ...canon.sources],
  };
}

export function buildIntakeUserPrompt(opts: { request: string; inputsManifest: string }): string {
  const request = opts.request.trim() || '_(пустой запрос — опирайся на материалы и веб-ресёрч)_';
  return `## Задача команды (сырой запрос)

${request}

## Материалы (inputs/)

${opts.inputsManifest}

## Что сделать

1. Изучи запрос и материалы. Проведи веб-ресёрч по Kaiten: kaiten.ru, faq-ru.kaiten.site, kaiten.ru/blog/tag/case/, командные лендинги /teams/*.
2. Подготовь ТЗ (tz) по методологии и схеме §18 и согласованный с ним Brief (brief) для пайплайна.
3. Всё спорное/неподтверждённое — в tz.needs_confirmation.
4. Верни ОДИН JSON-объект { "tz": ..., "brief": ... } строго по schema. Запиши его в указанный outputPath и запусти nextCommand.`;
}
