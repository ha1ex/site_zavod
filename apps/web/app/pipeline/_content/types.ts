/**
 * Типы контента справочника «Как устроен конвейер» (/pipeline).
 * Контент статичный, на русском, для сотрудников маркетинга.
 */

export type RuleSeverity = 'hard' | 'soft';

export interface StageRule {
  /** Формулировка правила/гейта простым языком. */
  text: string;
  /** hard — блокирует конвейер до исправления, soft — предупреждение. */
  severity: RuleSeverity;
  /** Путь к файлу-источнику в репозитории. */
  source?: string;
}

export interface StageStep {
  title: string;
  detail?: string;
}

export interface StageCommand {
  cmd: string;
  note?: string;
}

export interface RepoLink {
  path: string;
  note?: string;
}

/** Фаза поэтапного конвейера (P0–P8). */
export interface PhaseDoc {
  id: string;
  title: string;
  summary: string;
  gate?: string;
  /** Кто выполняет фазу: детерминированный код или ассистент (LLM). */
  executor?: 'code' | 'llm';
  /** Какие артефакты фаза читает. */
  inputs?: string[];
  /** Какие артефакты фаза пишет. */
  outputs?: string[];
  /** Что происходит внутри фазы, по шагам. */
  details?: string[];
  /** На что фаза опирается: файлы знаний, схемы, валидаторы. */
  sources?: RepoLink[];
}

export interface PipelineDoc {
  /** stage — этап конвейера, knowledge — сквозной раздел (канон, валидаторы, wiki). */
  kind: 'stage' | 'knowledge';
  /** Сегмент URL: /pipeline/<slug>. */
  slug: string;
  /** Отображаемый номер этапа: '1', '2', '3'… У knowledge-разделов отсутствует. */
  num?: string;
  title: string;
  /** Одна строка для левой навигации и карточек обзора. */
  short: string;
  /** Абзацы раздела «Назначение». */
  purpose: string[];
  inputs?: string[];
  outputs?: string[];
  /** Упорядоченные шаги «Как работает». */
  how?: StageStep[];
  rules?: StageRule[];
  commands?: StageCommand[];
  artifacts?: RepoLink[];
  links?: RepoLink[];
  /** Только для поэтапного конвейера. */
  phases?: PhaseDoc[];
}
