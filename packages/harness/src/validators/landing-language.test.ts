/**
 * Smoke-tests для landing-language (англицизмы §10).
 * Запуск: pnpm --filter @kaiten/harness exec tsx src/validators/landing-language.test.ts
 */

import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  loadAnglicismDictionary,
  scanTextFieldsForLanguage,
  type TextField,
} from './landing-language';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '../../../..');

function pass(name: string): void {
  console.log(`  ✓ ${name}`);
}

function scan(texts: TextField[], dict: Awaited<ReturnType<typeof loadAnglicismDictionary>>) {
  return scanTextFieldsForLanguage(texts, dict);
}

const dict = await loadAnglicismDictionary(REPO_ROOT);

console.log('\n# landing-language');

// 1. Явный англицизм-error
{
  const errs = scan([{ field: 'hero.subtitle', value: 'Не пропускайте дедлайн по задачам' }], dict);
  assert.ok(errs.some((e) => e.rule === 'anglicism' && e.severity === 'error'), 'дедлайн → anglicism error');
  pass('«дедлайн» → anglicism error');
}

// 2. CTA как слово-англицизм
{
  const errs = scan([{ field: 'hero.cta', value: 'Главный CTA на странице' }], dict);
  assert.ok(errs.some((e) => e.rule === 'anglicism'), 'CTA → anglicism');
  pass('«CTA» → anglicism');
}

// 3. Латинский Kanban без квалификатора → error; кириллица и «Kanban метод» → ok
{
  const bad = scan([{ field: 'f', value: 'Команды Kanban работают быстрее' }], dict);
  assert.ok(bad.some((e) => e.rule === 'kanban-cyrillic'), 'латинский Kanban → kanban-cyrillic');
  const okCyr = scan([{ field: 'f', value: 'Канбан-команды видят поток' }], dict);
  assert.ok(!okCyr.some((e) => e.rule === 'kanban-cyrillic'), 'канбан кириллицей → ok');
  const okQual = scan([{ field: 'f', value: 'Используем Kanban метод' }], dict);
  assert.ok(!okQual.some((e) => e.rule === 'kanban-cyrillic'), 'Kanban метод → ok (квалификатор)');
  pass('Kanban латиницей ловится, кириллица/квалификатор — нет');
}

// 4. Имена сервисов не флагаются
{
  const errs = scan([{ field: 'f', value: 'Импортируйте задачи из Jira, Trello и Notion' }], dict);
  assert.equal(errs.length, 0, 'service names не флагаются');
  pass('Jira/Trello/Notion → no errors');
}

// 5. Чистый русский текст — ноль ошибок
{
  const errs = scan([{ field: 'f', value: 'Соберите задачи и сроки команды на одной доске' }], dict);
  assert.equal(errs.length, 0, 'чистый текст ok');
  pass('чистый русский текст → 0 ошибок');
}

// 6. Граница слова: «колл» ловится, «коллега» — нет
{
  const noFp = scan([{ field: 'f', value: 'Ваш коллега видит задачи коллектива' }], dict);
  assert.ok(!noFp.some((e) => e.rule === 'anglicism' && /колл/.test(e.suggestion ?? '')), 'коллега не флагается');
  pass('«коллега/коллектив» не дают ложного срабатывания на «колл»');
}

// 7. Аббревиатура без расшифровки → warning; с расшифровкой → ok
{
  const warn = scan([{ field: 'f', value: 'Контролируйте SLA по заявкам' }], dict);
  assert.ok(warn.some((e) => e.rule === 'abbreviation-unexpanded' && e.severity === 'warning'), 'SLA без расшифровки → warning');
  const okExp = scan([{ field: 'f', value: 'Соглашение об уровне обслуживания (SLA) под контролем' }], dict);
  assert.ok(!okExp.some((e) => e.rule === 'abbreviation-unexpanded'), 'SLA с расшифровкой → ok');
  pass('SLA: без расшифровки warning, с расшифровкой — ok');
}

console.log('\nlanding-language: все проверки пройдены ✓\n');
