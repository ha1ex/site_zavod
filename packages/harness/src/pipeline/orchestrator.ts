import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { BriefSchema } from '../schemas/brief';
import { runP0BriefNormalize } from './phases/p0-brief-normalize';
import { runP3CoverageAudit } from './phases/p3-coverage-audit';
import {
  runP1AudienceIntent,
  runP2LayoutSelection,
  runP4SectionArchitect,
  runP5MockAllocation,
  runP6CopyGeneration,
  runP7SeoCtaPolish,
  runP8IllustrationAllocation,
} from './phases/llm-phases';
import type { PhaseContext, PhaseId, PhaseResult } from './phases/types';

/**
 * Phased pipeline orchestrator.
 *
 * Проходит P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 последовательно.
 * Каждая фаза идемпотентна: если её output уже есть и проходит schema —
 * фаза пропускается (используется существующий artefact).
 *
 * Останавливается на первой фазе со status='awaiting-host-agent' или 'error'.
 * После того как host-agent заполняет prompt — повторный вызов продолжит с
 * пропущенной фазы.
 */

const PHASE_ORDER: Array<{
  id: PhaseId;
  run: (ctx: PhaseContext) => Promise<PhaseResult>;
}> = [
  { id: 'P0', run: runP0BriefNormalize },
  { id: 'P1', run: runP1AudienceIntent },
  { id: 'P2', run: runP2LayoutSelection },
  { id: 'P3', run: runP3CoverageAudit },
  { id: 'P4', run: runP4SectionArchitect },
  { id: 'P5', run: runP5MockAllocation },
  { id: 'P6', run: runP6CopyGeneration },
  { id: 'P7', run: runP7SeoCtaPolish },
  { id: 'P8', run: runP8IllustrationAllocation },
];

export interface RunPhasedOptions {
  root: string;
  slug: string;
  briefPath: string;
  /** Если указан — запускается только эта фаза + предыдущие deterministic, если ещё не сделаны. */
  onlyPhase?: PhaseId;
  /** Принудительно перезапустить фазу, даже если artefact есть. */
  forcePhase?: PhaseId;
}

export interface PhasedRunReport {
  ok: boolean;
  ranPhases: PhaseResult[];
  stoppedAt?: PhaseId;
  reason?: string;
}

export async function runPhasedPipeline(opts: RunPhasedOptions): Promise<PhasedRunReport> {
  const briefAbs = resolve(opts.root, opts.briefPath);
  const briefRaw = await readFile(briefAbs, 'utf-8');
  const brief = BriefSchema.parse(JSON.parse(briefRaw));

  const ctx: PhaseContext = {
    root: opts.root,
    slug: opts.slug,
    brief,
  };

  const ranPhases: PhaseResult[] = [];

  for (const phase of PHASE_ORDER) {
    if (opts.onlyPhase && phase.id !== opts.onlyPhase) {
      // Если onlyPhase задан — пропускаем все кроме целевой
      // (но deterministic prerequisites должны быть уже сделаны другим вызовом).
      continue;
    }

    if (opts.forcePhase === phase.id) {
      // TODO: добавить delete-existing-artefact для force-rerun. MVP не делает.
    }

    const result = await phase.run(ctx);
    ranPhases.push(result);

    if (result.status === 'error') {
      return {
        ok: false,
        ranPhases,
        stoppedAt: phase.id,
        reason: result.errors.join(' | '),
      };
    }

    if (result.status === 'awaiting-host-agent') {
      return {
        ok: false,
        ranPhases,
        stoppedAt: phase.id,
        reason:
          `Phase ${phase.id} ждёт ввода от host-agent. Открой ${relative(opts.root, result.promptPath!)}, ` +
          `выполни задачу, запиши output в ${relative(opts.root, result.expectedOutputPath!)}, ` +
          'и повторно запусти orchestrator.',
      };
    }
  }

  return { ok: true, ranPhases };
}

export function formatPhasedRunReport(report: PhasedRunReport): string {
  const lines: string[] = [];
  for (const phase of report.ranPhases) {
    const icon =
      phase.status === 'ok' ? '✓' : phase.status === 'awaiting-host-agent' ? '…' : '✗';
    lines.push(`[${phase.phase}] ${icon} ${phase.status}`);
    for (const m of phase.messages) lines.push(`         ${m}`);
    for (const e of phase.errors) lines.push(`         ERROR: ${e}`);
    if (phase.promptPath) lines.push(`         prompt: ${phase.promptPath}`);
    if (phase.artifactPath) lines.push(`         artifact: ${phase.artifactPath}`);
  }
  if (report.stoppedAt) {
    lines.push('');
    lines.push(`Stopped at ${report.stoppedAt}: ${report.reason}`);
  } else if (report.ok) {
    lines.push('');
    lines.push('All phases completed.');
  }
  return lines.join('\n');
}
