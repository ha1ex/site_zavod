/**
 * Smoke-tests для validateLandingAudience.
 * Запуск: pnpm --filter @buffalo/harness exec tsx src/validators/landing-audience.test.ts
 * (без отдельного test runner — используем node:assert/strict).
 */

import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { loadAudienceScoring, clearAudienceScoringCache } from '../schemas/audience-scoring';
import type { Brief } from '../schemas/brief';
import type { LandingSpec } from '../schemas/landing-spec';
import { validateLandingAudience } from './landing-audience';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '../../../..');

function pass(name: string): void {
  console.log(`  ✓ ${name}`);
}

function section(name: string): void {
  console.log(`\n# ${name}`);
}

/* ─── fixtures ────────────────────────────────────────────────────── */

const itBrief: Brief = {
  product: 'Kaiten — таск-трекер для IT-команд',
  audience: ['Тимлид разработки', 'CTO'],
  market: 'B2B SaaS — российская альтернатива Jira для IT-команд',
  primaryGoal: 'try_free',
  mainPain: 'Команды разработки сидели на Jira, теперь ищут отечественную альтернативу с импортом',
  mainPromise: 'Перенесите проекты из Jira за один день и работайте без зарубежных вендоров',
  proofPoints: ['Импорт из Jira', 'Российский сервис', 'On-premise опционально'],
  tone: 'clear, practical, confident, no hype',
  cta: 'Попробовать бесплатно',
  pageArchetype: 'saas',
};

const financeBrief: Brief = {
  product: 'Kaiten — корпоративный таск-трекер для банков',
  audience: ['IT-директор банка', 'Compliance', 'Тимлид'],
  market: 'Финансы: банки, страховые, МФО, лизинг',
  primaryGoal: 'book_demo',
  mainPain: 'ГОСТ Р 57580 требует перехода на отечественное ПО до 2026 года',
  mainPromise: 'On-prem развёртывание, реестр Минцифры, ГОСТ-совместимая защита данных',
  proofPoints: ['On-prem', 'ГОСТ Р 57580', 'Реестр Минцифры'],
  tone: 'clear, practical, confident, no hype',
  cta: 'Запросить демо',
  pageArchetype: 'enterprise',
};

const unknownBrief: Brief = {
  product: 'Yoga schedule planner',
  audience: ['Wellness coaches'],
  market: 'Wellness scheduling',
  primaryGoal: 'signup',
  mainPain: 'Coaches lose appointments to email chains',
  mainPromise: 'One calendar for all your clients',
  proofPoints: ['Used by hundreds of coaches'],
  tone: 'friendly',
  cta: 'Start free',
  pageArchetype: 'saas',
};

function makeSpec(opts: { withCompare?: boolean; withSecurity?: boolean; ctaLabel?: string; ctaHref?: string; seoTitle?: string; seoDesc?: string }): LandingSpec {
  const ctaLabel = opts.ctaLabel ?? 'Попробовать бесплатно';
  const ctaHref = opts.ctaHref ?? '/signup';
  const sections: LandingSpec['sections'] = [
    {
      id: 'hero',
      component: 'HeroSection',
      props: {
        title: opts.withCompare ? 'Kaiten vs Jira: переезд за день' : 'Kaiten для вашей команды',
        subtitle: opts.withCompare
          ? 'Сравните Kaiten с Jira/Trello, перенесите проекты в один клик. Шаблоны для PM и Scrum-мастеров.'
          : 'Управляйте задачами всей команды на одной доске.',
        primaryCta: { label: ctaLabel, href: ctaHref },
        secondaryCta: { label: 'Запросить демо', href: '/demo' },
      },
    },
    {
      id: 'features',
      component: 'FeatureGrid',
      props: {
        title: opts.withCompare ? 'Что вы получите при переезде' : 'Ключевые возможности',
        columns: 3,
        items: [
          { icon: 'rocket', title: opts.withCompare ? 'Импорт из Jira' : 'Шаблоны команд', description: 'За 5 минут перенесите все задачи и проекты, попробовать на trial бесплатно.' },
          { icon: 'shield', title: opts.withSecurity ? 'On-prem и ГОСТ Р 57580' : 'Аналитика', description: opts.withSecurity ? 'On-prem развёртывание, SSO, права доступа, защита данных по ГОСТ.' : 'Показатели прозрачно для руководителя, ROI и кейсы доступны.' },
          { icon: 'users', title: 'Шаблоны и кейсы', description: 'Готовые kanban-доски для PM, scrum-мастера, COO. Сравните за минуту.' },
        ],
      },
    },
    {
      id: 'footer',
      component: 'LandingFooter',
      props: {
        brandName: 'Kaiten',
        columns: [{ title: 'Продукт', links: [{ label: 'О нас', href: '/about' }] }],
      },
    },
  ];
  return {
    pageType: 'saas_landing',
    goal: 'try_free',
    sections,
    seo: {
      title: opts.seoTitle ?? (opts.withCompare ? 'Kaiten vs Jira — российский таск-трекер для IT' : 'Kaiten — таск-трекер'),
      description: opts.seoDesc ?? 'Альтернатива Jira для IT-команд. Сравните и попробуйте бесплатно. Шаблоны для PM и Scrum-мастеров. ROI кейсы.',
    },
    illustrationSpecs: [],
  } as LandingSpec;
}

/* ─── tests ───────────────────────────────────────────────────────── */

async function main(): Promise<void> {
  clearAudienceScoringCache();
  const scoring = await loadAudienceScoring(REPO_ROOT);

  section('case 1: happy path (IT brief + good spec → pass)');
  {
    const spec = makeSpec({ withCompare: true });
    const r = validateLandingAudience(spec, scoring, { brief: itBrief });
    assert.equal(r.resolvedSegments[0], 'IT', `expected IT, got ${r.resolvedSegments.join(',')}`);
    assert.equal(r.ok, true, `expected ok=true, got false. errors: ${JSON.stringify(r.errors, null, 2)}`);
    assert.ok(r.score >= 70, `expected score≥70, got ${r.score}`);
    pass(`score=${r.score}, segments=${r.resolvedSegments.join(',')}`);
  }

  section('case 2: missing story (IT brief + generic spec → fail on must-pass)');
  {
    const spec = makeSpec({ withCompare: false, ctaLabel: 'Узнать больше', ctaHref: '/about' });
    const r = validateLandingAudience(spec, scoring, { brief: itBrief });
    assert.equal(r.ok, false, `expected ok=false, got true`);
    const codes = r.errors.map((e) => e.ruleId ?? e.kind);
    assert.ok(
      codes.includes('it-needs-compare-or-trial') || codes.includes('score-below-threshold'),
      `expected it-needs-compare-or-trial or score-below-threshold, got ${codes.join(',')}`,
    );
    pass(`fail detected: ${codes.join(', ')}`);
  }

  section('case 3: finance must-pass (no security block + no Demo CTA → fail)');
  {
    const spec = makeSpec({ withCompare: true, withSecurity: false, ctaLabel: 'Попробовать', ctaHref: '/signup' });
    // override secondary cta to remove Demo
    (spec.sections[0]!.props as { secondaryCta?: unknown }).secondaryCta = null;
    const r = validateLandingAudience(spec, scoring, { brief: financeBrief });
    assert.ok(r.resolvedSegments.includes('Финансы'), `expected Финансы in segments, got ${r.resolvedSegments.join(',')}`);
    assert.equal(r.ok, false);
    const codes = r.errors.map((e) => e.ruleId ?? e.kind);
    assert.ok(
      codes.includes('trust-segment-needs-security-and-demo'),
      `expected trust-segment-needs-security-and-demo, got ${codes.join(',')}`,
    );
    pass(`fail: ${codes.join(', ')}`);
  }

  section('case 4: unknown segment → audience-resolve-needed');
  {
    const spec = makeSpec({ withCompare: true });
    const r = validateLandingAudience(spec, scoring, { brief: unknownBrief });
    assert.equal(r.ok, false);
    const kinds = r.errors.map((e) => e.kind);
    assert.ok(kinds.includes('audience-resolve-needed'), `expected audience-resolve-needed, got ${kinds.join(',')}`);
    pass(`fail: ${kinds.join(', ')}`);
  }

  section('case 5: unknown segment + manual resolvedSegments → falls back to scoring');
  {
    const spec = makeSpec({ withCompare: true });
    const brief: Brief = { ...unknownBrief, resolvedSegments: ['Агентства'] };
    const r = validateLandingAudience(spec, scoring, { brief });
    assert.equal(r.resolvedSegments[0], 'Агентства');
    assert.equal(
      r.errors.find((e) => e.kind === 'audience-resolve-needed'),
      undefined,
      'resolvedSegments should bypass lexical-match, no audience-resolve-needed expected',
    );
    pass(`resolved manually: ${r.resolvedSegments.join(',')} (score=${r.score})`);
  }

  console.log('\n✅ all audience-validator tests passed');
}

main().catch((err) => {
  console.error('❌ test failure:', err);
  process.exit(1);
});
