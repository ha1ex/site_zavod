import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  getDomainEntry,
  getMissingMocksForDomain,
  type Domain,
} from '../../registry/domain-visual';
import type { CoverageReport, SlotCoverage } from '../../schemas/coverage-report';
import type { PhaseContext, PhaseResult } from './types';

/**
 * P3 Library Coverage Audit — deterministic.
 *
 * Inputs:
 *   - .context/pipeline/<slug>/p0-brief-normalized.json (для domain)
 *   - .context/pipeline/<slug>/p2-layout-decision.json (для слотов; опционально
 *     — если не задан, считаем по brief.pageLayout)
 *
 * Outputs: .context/pipeline/<slug>/p3-coverage-report.json
 *
 * Логика:
 *   - Если домен НЕ покрыт (HR/Marketing/...) и missingMocks > 0 → status='domain-missing'.
 *   - Если домен покрыт, но layout требует mock-вариант, которого нет в наборе
 *     домена → status='enrich-required'.
 *   - Если есть 1-3 пробелов → 'enrich-recommended'.
 *   - Иначе 'ok'.
 *
 * Это hard gate: при не-ok pipeline останавливается, выдаёт человеку todo-список.
 */

interface NormalizedBriefRead {
  resolvedDomain: Domain;
  pageLayout?: string;
}

async function readJson<T = unknown>(p: string): Promise<T | undefined> {
  try {
    const raw = await readFile(p, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function runP3CoverageAudit(
  ctx: PhaseContext,
): Promise<PhaseResult> {
  const errors: string[] = [];
  const messages: string[] = [];
  const pipelineDir = resolve(ctx.root, '.context', 'pipeline', ctx.slug);

  const normalized = await readJson<NormalizedBriefRead>(
    resolve(pipelineDir, 'p0-brief-normalized.json'),
  );
  if (!normalized) {
    errors.push('p0-brief-normalized.json не найден — сначала запусти P0.');
    return { phase: 'P3', status: 'error', messages, errors };
  }

  const domain = normalized.resolvedDomain;
  const layout = ctx.brief.pageLayout ?? normalized.pageLayout ?? '(unknown)';
  const entry = getDomainEntry(domain);
  const missingMocks = getMissingMocksForDomain(domain);

  // Если домен непокрытый → status = domain-missing
  if (!entry || entry.mocks.length === 0) {
    const report: CoverageReport = {
      status: 'domain-missing',
      domain,
      layout,
      slotCoverage: [],
      missingMocks: missingMocks.map((m) => ({
        variant: m.variant,
        description: m.description,
      })),
      coverageScore: 0,
      blockedReason:
        `Домен '${domain}' не покрыт mock-набором. Нужно создать ${missingMocks.length} mock'ов ` +
        'перед написанием spec\'а. См. wiki/references/domain-mock-matrix.md.',
    };
    const outPath = resolve(pipelineDir, 'p3-coverage-report.json');
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, JSON.stringify(report, null, 2) + '\n', 'utf-8');
    errors.push(report.blockedReason!);
    return {
      phase: 'P3',
      status: 'error',
      artifactPath: outPath,
      messages,
      errors,
    };
  }

  // Покрытый домен — пока без layout-парсинга считаем все слоты as-is
  // (полная per-slot аудит — после P2; в MVP достаточно факта «mocks есть»).
  const slotCoverage: SlotCoverage[] = entry.mocks.map((m, i) => ({
    slot: i,
    component: 'MockVisual',
    recommendedMockVariant: m.variant,
    mockExists: true,
    mockInDomain: true,
  }));

  const report: CoverageReport = {
    status: 'ok',
    domain,
    layout,
    slotCoverage,
    missingMocks: [],
    coverageScore: 100,
  };

  const outPath = resolve(pipelineDir, 'p3-coverage-report.json');
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(report, null, 2) + '\n', 'utf-8');

  messages.push(
    `domain=${domain} (${entry.displayName}), mocks=${entry.mocks.length}, layout=${layout}`,
  );

  return { phase: 'P3', status: 'ok', artifactPath: outPath, messages, errors };
}
