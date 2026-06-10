/**
 * Smoke-tests для host-детекта и гейтов.
 * Запуск: pnpm --filter @kaiten/harness exec tsx src/gates/gates.test.ts
 */

import assert from 'node:assert/strict';
import { detectHostAgent, resolveHostAgent } from '../host/detect';
import { checkBriefsUnmodified, type GitRunner } from './brief-immutable';
import { extractRelativeLinks } from './contract-wiring';

function pass(name: string): void {
  console.log(`  ✓ ${name}`);
}

console.log('\n# host-detect');

// 1. Claude Code по CLAUDECODE
{
  const d = detectHostAgent({ env: { CLAUDECODE: '1' } });
  assert.equal(d.profile.name, 'claude-code');
  assert.equal(d.via, 'CLAUDECODE');
  assert.equal(d.profile.hasHooks, true);
  pass('CLAUDECODE=1 → claude-code (hasHooks)');
}

// 2. Codex по sandbox-переменным
{
  const d = detectHostAgent({ env: { CODEX_SANDBOX_NETWORK_DISABLED: '1' } });
  assert.equal(d.profile.name, 'codex');
  assert.equal(d.profile.needsExplicitContext, true);
  pass('CODEX_SANDBOX_NETWORK_DISABLED → codex (needsExplicitContext)');
}

// 3. Gemini
{
  const d = detectHostAgent({ env: { GEMINI_CLI: '1' } });
  assert.equal(d.profile.name, 'gemini');
  pass('GEMINI_CLI → gemini');
}

// 4. HARNESS_AGENT бьёт env-детект
{
  const d = detectHostAgent({ env: { CLAUDECODE: '1', HARNESS_AGENT: 'codex' } });
  assert.equal(d.profile.name, 'codex');
  assert.equal(d.via, 'HARNESS_AGENT');
  pass('HARNESS_AGENT override приоритетнее env-детекта');
}

// 4b. Вложенный запуск: codex exec из Claude-сессии несёт оба набора env →
// sandbox-маркеры codex приоритетнее унаследованных CLAUDE_CODE_* (проверено эмпирически).
{
  const d = detectHostAgent({
    env: { CLAUDE_CODE_SESSION_ID: 'abc', CODEX_SANDBOX: 'seatbelt', CODEX_CI: '1' },
  });
  assert.equal(d.profile.name, 'codex');
  pass('CODEX_SANDBOX + унаследованный CLAUDE_CODE_* → codex (не claude)');
}

// 5. --agent бьёт HARNESS_AGENT
{
  const d = detectHostAgent({ env: { HARNESS_AGENT: 'codex' }, override: 'gemini' });
  assert.equal(d.profile.name, 'gemini');
  assert.equal(d.via, '--agent');
  pass('--agent приоритетнее HARNESS_AGENT');
}

// 6. Пустой env → unknown (консервативный дефолт: полный bootstrap)
{
  const d = detectHostAgent({ env: {} });
  assert.equal(d.profile.name, 'unknown');
  assert.equal(d.profile.needsExplicitContext, true);
  assert.equal(d.profile.hasHooks, false);
  pass('пустой env → unknown (needsExplicitContext, без hooks)');
}

// 7. Алиасы: gpt → codex, agy → gemini, claude → claude-code; мусор → unknown-профиль
{
  assert.equal(resolveHostAgent('gpt').name, 'codex');
  assert.equal(resolveHostAgent('agy').name, 'gemini');
  assert.equal(resolveHostAgent('Claude').name, 'claude-code');
  assert.equal(resolveHostAgent('my-future-agent').name, 'unknown');
  pass('алиасы резолвятся, неизвестный алиас → unknown-профиль');
}

console.log('\n# brief-immutable gate');

const ROOT = '/fake/root';

function fakeGit(diffOut: string): GitRunner {
  return (args) => {
    if (args[0] === 'rev-parse') return { status: 0, stdout: '.git\n' };
    if (args[0] === 'diff') return { status: 0, stdout: diffOut };
    return { status: 1, stdout: '' };
  };
}

// 8. Чистое дерево → ok
{
  const r = checkBriefsUnmodified(ROOT, { env: {}, git: fakeGit('') });
  assert.equal(r.ok, true);
  assert.equal(r.violations.length, 0);
  pass('чистое дерево → ok');
}

// 9. Изменённый бриф → violation
{
  const r = checkBriefsUnmodified(ROOT, { env: {}, git: fakeGit('M\tcontent/briefs/crm.json\n') });
  assert.equal(r.ok, false);
  assert.deepEqual(r.violations, [{ status: 'M', file: 'content/briefs/crm.json' }]);
  pass('M content/briefs/crm.json → блок');
}

// 10. Удаление и rename тоже ловятся
{
  const out = 'D\tcontent/briefs/old.json\nR100\tcontent/briefs/a.json\tcontent/briefs/b.json\n';
  const r = checkBriefsUnmodified(ROOT, { env: {}, git: fakeGit(out) });
  assert.equal(r.ok, false);
  assert.equal(r.violations.length, 2);
  assert.deepEqual(r.violations.map((v) => v.status), ['D', 'R']);
  pass('D и R → блок');
}

// 11. Новый бриф (A) и файлы вне content/briefs — проходят
{
  const out = 'A\tcontent/briefs/new-v2.json\nM\tcontent/landings/crm.json\nM\tcontent/briefs/readme.md\n';
  const r = checkBriefsUnmodified(ROOT, { env: {}, git: fakeGit(out) });
  assert.equal(r.ok, true, `ожидали ok, нарушения: ${JSON.stringify(r.violations)}`);
  pass('новый бриф (A) и чужие пути не блокируют');
}

// 12. HARNESS_SKIP_GATES=1 → осознанный обход
{
  const r = checkBriefsUnmodified(ROOT, {
    env: { HARNESS_SKIP_GATES: '1' },
    git: fakeGit('M\tcontent/briefs/crm.json\n'),
  });
  assert.equal(r.ok, true);
  assert.equal(r.skipped, 'env-bypass');
  pass('HARNESS_SKIP_GATES=1 → skipped env-bypass');
}

// 13. Не git-репо → гейт не мешает
{
  const noGit: GitRunner = () => ({ status: 128, stdout: '' });
  const r = checkBriefsUnmodified(ROOT, { env: {}, git: noGit });
  assert.equal(r.ok, true);
  assert.equal(r.skipped, 'no-git');
  pass('не git-репо → skipped no-git');
}

console.log('\n# contract-wiring: extractRelativeLinks');

// 14. Ссылки: relative собираются, http/якоря пропускаются, фрагменты и ведущий / чистятся
{
  const md = [
    '[a](wiki/AGENTS.md) [b](https://example.com) [c](#anchor)',
    '[d](/.claude/skills/kaiten-generate/SKILL.md) [e](docs/pipeline.md#p4)',
  ].join('\n');
  const links = extractRelativeLinks(md);
  assert.deepEqual(links, ['wiki/AGENTS.md', '.claude/skills/kaiten-generate/SKILL.md', 'docs/pipeline.md']);
  pass('relative links парсятся, http/#/фрагменты обрабатываются');
}

console.log('\n✓ gates.test.ts: все проверки прошли\n');
