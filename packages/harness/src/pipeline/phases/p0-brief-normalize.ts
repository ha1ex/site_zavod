import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { BriefSchema, type Brief } from '../../schemas/brief';
import { resolveDomainFromBrief, type Domain } from '../../registry/domain-visual';
import type { PhaseContext, PhaseResult } from './types';

/**
 * P0 Brief Normalize — deterministic.
 *
 * Inputs: ctx.brief (уже parsed Brief)
 * Outputs: .context/pipeline/<slug>/p0-brief-normalized.json
 *
 * Что делает:
 *   - валидирует через BriefSchema (zod)
 *   - резолвит домен через domain-visual lexical match
 *   - копирует brief.resolvedSegments как есть (P1 audience-intent доуточнит)
 *   - пишет нормализованную версию + meta
 */

export interface NormalizedBrief extends Brief {
  resolvedDomain: Domain;
  resolvedSegments: string[];
  normalizedAt: string;
}

export async function runP0BriefNormalize(
  ctx: PhaseContext,
): Promise<PhaseResult> {
  const errors: string[] = [];
  const messages: string[] = [];

  let brief: Brief;
  try {
    brief = BriefSchema.parse(ctx.brief);
  } catch (err) {
    errors.push(`Brief invalid: ${(err as Error).message}`);
    return { phase: 'P0', status: 'error', messages, errors };
  }

  const resolvedDomain = resolveDomainFromBrief(brief);
  const resolvedSegments = brief.resolvedSegments ?? [];

  const normalized: NormalizedBrief = {
    ...brief,
    resolvedSegments,
    resolvedDomain,
    normalizedAt: new Date().toISOString(),
  };

  const outPath = resolve(
    ctx.root,
    '.context',
    'pipeline',
    ctx.slug,
    'p0-brief-normalized.json',
  );
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(normalized, null, 2) + '\n', 'utf-8');

  messages.push(
    `domain=${resolvedDomain}, segments=[${resolvedSegments.join(',')}], layout=${brief.pageLayout ?? '(не задан)'}`,
  );

  return {
    phase: 'P0',
    status: 'ok',
    artifactPath: outPath,
    messages,
    errors,
  };
}
