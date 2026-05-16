import type { Brief } from '../../schemas/brief';

/**
 * Общий контракт фаз phased pipeline.
 *
 * Каждая фаза получает PhaseContext (root, slug, ранее посчитанные артефакты)
 * и возвращает PhaseResult — что сделано, нужно ли остановиться для host-agent
 * input, путь к артефакту.
 */

export type PhaseId =
  | 'P0'
  | 'P1'
  | 'P2'
  | 'P3'
  | 'P4'
  | 'P5'
  | 'P6'
  | 'P7'
  | 'P8';

export interface PhaseContext {
  root: string;
  slug: string;
  brief: Brief;
}

export type PhaseStatus =
  | 'ok'
  | 'awaiting-host-agent'
  | 'error';

export interface PhaseResult {
  phase: PhaseId;
  status: PhaseStatus;
  /** Artifact, который произвела фаза (если выполнилась). */
  artifactPath?: string;
  /** Если awaiting-host-agent — путь к prompt'у. */
  promptPath?: string;
  /** Путь, куда host-agent должен записать output. */
  expectedOutputPath?: string;
  /** Human-readable сообщения. */
  messages: string[];
  /** Если status=error — список ошибок. */
  errors: string[];
}

export function phaseArtifactDir(root: string, slug: string): string {
  // Возвращаем относительный или абсолютный — решает caller.
  return `${root}/.context/pipeline/${slug}`;
}
