/**
 * Smoke-tests для brief-quality.
 * Запуск: pnpm --filter @kaiten/harness exec tsx src/validators/brief-quality.test.ts
 */

import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { Brief } from '../schemas/brief';
import { validateBriefQuality } from './brief-quality';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '../../../..');

function pass(name: string): void {
  console.log(`  ✓ ${name}`);
}

const goodCrmBrief: Brief = {
  product: 'CRM-система Kaiten для управления продажами и клиентами',
  audience: ['Руководитель отдела продаж', 'Менеджер по продажам'],
  market: 'B2B SaaS — CRM для отделов продаж',
  primaryGoal: 'try_free',
  mainPain: 'Сделки и клиенты теряются между чатами, почтой и таблицами, нет единой воронки',
  mainPromise: 'Ведите сделки от первого обращения до повторной продажи в одной системе',
  proofPoints: ['Единая база клиентов', 'Воронка и автоматизация продаж'],
  tone: 'clear, practical, confident, no hype',
  cta: 'Попробовать бесплатно',
  pageArchetype: 'saas',
};

console.log('\n# brief-quality');

// 1. Хороший бриф — ok (англицизмы могут быть warning, но не error)
{
  const r = await validateBriefQuality(goodCrmBrief, { root: REPO_ROOT });
  assert.equal(r.ok, true, `хороший CRM-бриф ok (errors: ${JSON.stringify(r.errors.filter((e) => e.severity === 'error'))})`);
  pass('валидный CRM-бриф проходит (ok=true)');
}

// 2. Нерезолвимый домен → error
{
  const vague: Brief = {
    product: 'Приложение для домашних рецептов и готовки',
    audience: ['Домашний повар'],
    market: 'B2C мобильное приложение',
    primaryGoal: 'signup',
    mainPain: 'Рецепты разбросаны по сайтам и тетрадкам, сложно найти нужный под рукой',
    mainPromise: 'Соберите любимые рецепты в одном приложении и готовьте по шагам',
    proofPoints: [],
    tone: 'clear, practical, confident, no hype',
    cta: 'Скачать приложение',
    pageArchetype: 'saas',
  };
  const r = await validateBriefQuality(vague, { root: REPO_ROOT });
  assert.ok(r.errors.some((e) => e.rule === 'domain-unresolvable' && e.severity === 'error'), 'размытый бриф → domain-unresolvable');
  assert.equal(r.ok, false, 'размытый бриф не ok');
  pass('нерезолвимый домен → error, ok=false');
}

// 3. Тонкий mainPain → field-too-thin error
{
  const thin: Brief = { ...goodCrmBrief, mainPain: 'хаос' };
  const r = await validateBriefQuality(thin, { root: REPO_ROOT });
  assert.ok(r.errors.some((e) => e.rule === 'field-too-thin' && e.field === 'mainPain'), 'тонкий mainPain → field-too-thin');
  pass('тонкий mainPain → field-too-thin error');
}

// 4. Лозунг в mainPromise → slogan-in-field error
{
  const slogan: Brief = { ...goodCrmBrief, mainPromise: 'Выведите бизнес на новый уровень и забудьте о хаосе' };
  const r = await validateBriefQuality(slogan, { root: REPO_ROOT });
  assert.ok(r.errors.some((e) => e.rule === 'slogan-in-field'), 'лозунг → slogan-in-field');
  pass('лозунг в mainPromise → slogan-in-field error');
}

// 5. needs_confirmation срабатывает на «импорт из …»
{
  const importBrief: Brief = { ...goodCrmBrief, mainPromise: 'Перенесите данные импортом из Trello за один день' };
  const r = await validateBriefQuality(importBrief, { root: REPO_ROOT });
  assert.ok(r.needsConfirmation.length > 0, 'импорт → needsConfirmation');
  pass('утверждение про импорт → needs_confirmation');
}

console.log('\nbrief-quality: все проверки пройдены ✓\n');
