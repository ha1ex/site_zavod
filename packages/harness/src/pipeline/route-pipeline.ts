import type { Brief } from '../schemas/brief';
import {
  type Domain,
  getDomainEntry,
  getMissingMocksForDomain,
  resolveDomainFromBrief,
} from '../registry/domain-visual';

/**
 * Pipeline router — гейт домена перед запуском конвейера сборки.
 *
 * Два возможных исхода:
 *
 *   1. `manual-creation-required` — домен НЕ покрыт mock-набором.
 *      Pipeline отказывается работать. Перед генерацией лендинга нужно
 *      создать N mock'ов и завести reference doc. Сообщение содержит
 *      конкретный todo-список.
 *
 *   2. `phased` — домен покрыт, запускается единственный конвейер сборки:
 *      phased pipeline с P0..P8 фазами, per-phase repair-loop и
 *      интегрированными post-validation hooks. Финальный пакет
 *      domain-validators отрабатывает на ingest (`agent apply`).
 *
 * Исторически здесь был ещё третий режим `legacy` (быстрый one-shot
 * `prepare → write spec → apply` для простых брифов) — удалён: один
 * конвейер вместо двух, фазированный контроль качества для всех брифов.
 *
 * Это **deterministic** logic без LLM — чтобы любой агент в любой среде
 * (Claude Code, Codex, CI bot) получал одинаковый routing для одинакового
 * brief'а.
 */

export type PipelineMode = 'phased' | 'manual-creation-required';

export interface RouteDecision {
  mode: PipelineMode;
  domain: Domain;
  /** Готовая команда для запуска. */
  command: string;
  /** Человеко-читаемое описание решения. */
  rationale: string;
  /** Если mode='manual-creation-required' — список mock'ов к созданию. */
  missingMocks?: Array<{ variant: string; description: string }>;
}

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
 * **Иначе → phased (P0..P8).**
 */
export function routePipeline(brief: Brief, slug: string): RouteDecision {
  const domain = resolveDomainFromBrief(brief);

  // HARD checks first.
  if (domain === 'unknown') {
    return {
      mode: 'manual-creation-required',
      domain,
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

  return {
    mode: 'phased',
    domain,
    command: `pnpm -w run harness agent run landing --slug ${slug} --brief content/briefs/${slug}.json`,
    rationale:
      `Domain: \`${domain}\` (покрыт mock-набором). Решение: **PHASED pipeline**. ` +
      'Будут запущены P0..P8 фазы с per-phase repair-loop. ' +
      'На каждой LLM-фазе orchestrator останавливается и просит host-agent ' +
      '(тебя — Claude Code / Codex / etc.) заполнить artifact. ' +
      'Фазированный контроль качества: audience-intent → layout-decision → ' +
      'section-plan → mock-allocation → copy → polish → illustration.',
  };
}

/**
 * Human-readable markdown отчёт о routing решении.
 */
export function formatRouteDecision(decision: RouteDecision): string {
  const lines: string[] = [];
  const icon = decision.mode === 'phased' ? '🔀' : '🛑';
  lines.push(`${icon} Pipeline routing decision: **${decision.mode.toUpperCase()}**`);
  lines.push('');
  lines.push(`- Domain: \`${decision.domain}\``);
  lines.push('');
  if (decision.missingMocks && decision.missingMocks.length > 0) {
    lines.push("## Mock'и к созданию");
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
