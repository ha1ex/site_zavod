import type { Brief } from '../schemas/brief';
import {
  type Domain,
  getDomainEntry,
  getMissingMocksForDomain,
  resolveDomainFromBrief,
} from '../registry/domain-visual';

/**
 * Pipeline router — определяет какой режим применить для данного brief'а.
 *
 * Три возможных режима:
 *
 *   1. `manual-creation-required` — домен НЕ покрыт mock-набором.
 *      Pipeline отказывается работать. Перед генерацией лендинга нужно
 *      создать N mock'ов и заведите reference doc. Сообщение содержит
 *      конкретный todo-список.
 *
 *   2. `phased` — сложный brief, нужна phased pipeline с P0..P8 фазами,
 *      per-phase repair-loop и интегрированными post-validation hooks.
 *      Признаки сложности: audience не резолвен из scoring config,
 *      pageLayout не выбран, brief короткий/неполный, primaryGoal
 *      специфический (waitlist / contact_sales / download).
 *
 *   3. `legacy` — простой brief в покрытом домене с явным layout/audience.
 *      Используется быстрый one-shot path `prepare → write spec → apply`.
 *      Все domain-validators всё равно отрабатывают на ingest.
 *
 * Это **deterministic** logic без LLM — чтобы любой агент в любой среде
 * (Claude Code, Codex, CI bot) получал одинаковый routing для одинакового
 * brief'а.
 */

export type PipelineMode = 'legacy' | 'phased' | 'manual-creation-required';

export interface RouteSignal {
  /** Короткий тег для логов / wiki / трассировки. */
  tag: string;
  /** Человеко-читаемое описание сигнала. */
  description: string;
  /** Вес сигнала в сторону phased (0..1, чем больше — тем сильнее phased). */
  weight: number;
}

export interface RouteDecision {
  mode: PipelineMode;
  domain: Domain;
  /** Все сработавшие сигналы (для трассировки решения). */
  signals: RouteSignal[];
  /** Score 0..1: чем выше, тем сильнее phased. >= 0.5 → phased. */
  phasedScore: number;
  /** Готовая команда для запуска. */
  command: string;
  /** Человеко-читаемое описание решения. */
  rationale: string;
  /** Если mode='manual-creation-required' — список mock'ов к созданию. */
  missingMocks?: Array<{ variant: string; description: string }>;
}

/** Threshold выше которого включается phased pipeline. */
const PHASED_THRESHOLD = 0.5;

/**
 * Главный routing entry point.
 *
 * Detection rules:
 *
 * **HARD: manual-creation-required**
 * - Домен не покрыт mocks (HR/Marketing/BPM/Finance/Ecommerce покрыты, но
 *   при новом домене типа Healthcare / Education → manual).
 * - Domain='unknown' → unable to route, требуется ручная классификация.
 *
 * **PHASED signals (weight):**
 * - `audience-not-resolved` (0.30) — brief.resolvedSegments пустой
 * - `no-page-layout` (0.25) — brief.pageLayout не задан
 * - `brief-too-short` (0.20) — длина основных полей < 100 chars total
 * - `complex-primary-goal` (0.15) — waitlist / contact_sales / download
 * - `multiple-personas` (0.10) — audience.length >= 3 (нужна классификация)
 * - `no-proof-points` (0.10) — proofPoints пустой (нужны structurated stories)
 *
 * **Phased если phasedScore >= 0.5.**
 */
export function routePipeline(brief: Brief, slug: string): RouteDecision {
  const domain = resolveDomainFromBrief(brief);
  const signals: RouteSignal[] = [];

  // HARD checks first.
  if (domain === 'unknown') {
    return {
      mode: 'manual-creation-required',
      domain,
      signals: [],
      phasedScore: 0,
      command: '',
      rationale:
        'Домен НЕ резолвится из brief. Это блокирует pipeline на корню — мы не понимаем, ' +
        'для какого домена строить лендинг. Уточни brief.product / brief.market / brief.audience ' +
        'конкретикой (например, не "B2B SaaS", а "CRM для салонов красоты"). ' +
        'Доступные домены: pm, support, crm, hr, marketing, bpm, finance, ecommerce.',
    };
  }

  const entry = getDomainEntry(domain);
  if (!entry || entry.mocks.length === 0) {
    const missing = getMissingMocksForDomain(domain);
    return {
      mode: 'manual-creation-required',
      domain,
      signals: [],
      phasedScore: 0,
      command: '',
      rationale:
        `Домен '${domain}' (${entry?.displayName ?? domain}) ещё не покрыт mock-набором. ` +
        `Pipeline ОТКАЗЫВАЕТСЯ запускаться — без mock'ов лендинг получится с cross-domain ` +
        `подменами. Создай ${missing.length} новых mock'ов по списку ниже, заведи ` +
        `wiki/landings/${domain}-reference.md по образцу crm-reference.md, обнови ` +
        `domain-mock-matrix.md + DOMAIN_REGISTRY в domain-visual.ts. Только после этого ` +
        `можно запускать pipeline.`,
      missingMocks: missing,
    };
  }

  // SOFT signals для phased vs legacy.
  if (!brief.resolvedSegments || brief.resolvedSegments.length === 0) {
    signals.push({
      tag: 'audience-not-resolved',
      description:
        'brief.resolvedSegments пустой — нужна P1 фаза для классификации аудитории ' +
        'через wiki/audiences/kaiten-scoring.json. Без неё P7 audience-score gate может ' +
        'упасть с непредсказуемым результатом.',
      weight: 0.3,
    });
  }

  if (!brief.pageLayout) {
    signals.push({
      tag: 'no-page-layout',
      description:
        'brief.pageLayout не задан — нужна P2 фаза для выбора layout с обоснованием. ' +
        'Без этого legacy flow попробует подобрать эвристикой, что может не подойти ' +
        'под awareness аудитории.',
      weight: 0.25,
    });
  }

  const briefTextLength =
    (brief.product?.length ?? 0) +
    (brief.mainPain?.length ?? 0) +
    (brief.mainPromise?.length ?? 0);
  if (briefTextLength < 200) {
    signals.push({
      tag: 'brief-too-short',
      description:
        `Brief content text короткий (${briefTextLength} chars в product+mainPain+mainPromise). ` +
        'Phased pipeline в P4 Section Architect рассчитывает структуру до копирайта — ' +
        'это компенсирует недостаток конкретики в brief.',
      weight: 0.2,
    });
  }

  if (
    brief.primaryGoal === 'waitlist' ||
    brief.primaryGoal === 'contact_sales' ||
    brief.primaryGoal === 'download'
  ) {
    signals.push({
      tag: 'complex-primary-goal',
      description:
        `primaryGoal='${brief.primaryGoal}' — нестандартный CTA-flow требует P5 Mock ` +
        'Allocation с осознанным выбором CTA-типа per slot.',
      weight: 0.15,
    });
  }

  if ((brief.audience?.length ?? 0) >= 3) {
    signals.push({
      tag: 'multiple-personas',
      description:
        `${brief.audience?.length ?? 0} персон в brief.audience — нужна P1 классификация ` +
        'чтобы определить primary decision-maker и подобрать секции под main persona.',
      weight: 0.1,
    });
  }

  if (!brief.proofPoints || brief.proofPoints.length === 0) {
    signals.push({
      tag: 'no-proof-points',
      description:
        'brief.proofPoints пустой — phased flow в P4 поможет структурно расположить ' +
        'social-proof / stats секции для компенсации.',
      weight: 0.1,
    });
  }

  const phasedScore = signals.reduce((sum, s) => sum + s.weight, 0);
  const mode: PipelineMode = phasedScore >= PHASED_THRESHOLD ? 'phased' : 'legacy';

  const command =
    mode === 'phased'
      ? `pnpm -w run harness agent run landing --slug ${slug} --brief content/briefs/${slug}.json`
      : `pnpm -w run harness agent prepare landing --slug ${slug} --brief content/briefs/${slug}.json --out .context/agent/${slug}.prompt.md`;

  const rationale = buildRationale(mode, domain, signals, phasedScore);

  return {
    mode,
    domain,
    signals,
    phasedScore: Math.round(phasedScore * 100) / 100,
    command,
    rationale,
  };
}

function buildRationale(
  mode: PipelineMode,
  domain: Domain,
  signals: RouteSignal[],
  phasedScore: number,
): string {
  const parts: string[] = [];
  parts.push(`Domain: \`${domain}\` (покрыт mock-набором).`);
  parts.push(`Phased score: ${Math.round(phasedScore * 100) / 100} (threshold ${PHASED_THRESHOLD}).`);
  if (signals.length === 0) {
    parts.push('Сигналов сложности нет — brief полный и явный.');
  } else {
    parts.push(`Сработали сигналы: ${signals.map((s) => s.tag).join(', ')}.`);
  }
  if (mode === 'phased') {
    parts.push(
      'Решение: **PHASED pipeline**. Будут запущены P0..P8 фазы с per-phase repair-loop. ' +
        'На каждой LLM-фазе orchestrator останавливается и просит host-agent ' +
        '(тебя — Claude Code / Codex / etc.) заполнить artifact. ' +
        'Это медленнее, но даёт фазированный контроль качества: audience-intent → layout-decision → ' +
        'section-plan → mock-allocation → copy → polish → illustration.',
    );
  } else {
    parts.push(
      'Решение: **LEGACY one-shot**. Быстрый flow: prepare → write spec → apply. ' +
        'Все domain-validators всё равно отрабатывают на ingest ' +
        '(illustration-domain-match, cross-landing-diversity, visual-diversity, brand, business, audience).',
    );
  }
  return parts.join(' ');
}

/**
 * Human-readable markdown отчёт о routing решении.
 */
export function formatRouteDecision(decision: RouteDecision): string {
  const lines: string[] = [];
  const icon =
    decision.mode === 'phased' ? '🔀' : decision.mode === 'legacy' ? '⚡️' : '🛑';
  lines.push(`${icon} Pipeline routing decision: **${decision.mode.toUpperCase()}**`);
  lines.push('');
  lines.push(`- Domain: \`${decision.domain}\``);
  lines.push(`- Phased score: ${decision.phasedScore} (threshold ${PHASED_THRESHOLD})`);
  lines.push('');
  if (decision.signals.length > 0) {
    lines.push('## Сработавшие сигналы');
    lines.push('');
    for (const s of decision.signals) {
      lines.push(`- **${s.tag}** (weight ${s.weight}): ${s.description}`);
    }
    lines.push('');
  }
  if (decision.missingMocks && decision.missingMocks.length > 0) {
    lines.push('## Mock\'и к созданию');
    lines.push('');
    for (const m of decision.missingMocks) {
      lines.push(`- \`${m.variant}\` — ${m.description}`);
    }
    lines.push('');
  }
  lines.push('## Rationale');
  lines.push('');
  lines.push(decision.rationale);
  lines.push('');
  if (decision.command) {
    lines.push('## Команда');
    lines.push('');
    lines.push('```bash');
    lines.push(decision.command);
    lines.push('```');
  }
  return lines.join('\n');
}
