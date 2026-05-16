import type { LandingSpec, Section } from '../schemas/landing-spec';

/**
 * landing-visual-diversity — валидатор, который блокирует «однотипный лендинг».
 *
 * Проблема, которую он закрывает: раньше LLM мог взять и заполнить ВСЕ MediaCopy
 * секции через `mediaVariant: 'default'` (generic three-bar placeholder),
 * получая «лендинг, в котором все блоки выглядят одинаково». Теперь это
 * проваливает ingest.
 *
 * Правила:
 *   - max-default-media: на лендинге не более 1 MediaCopy с
 *     mediaVariant='default' (исключение для нарративных layouts вроде
 *     story-led-unaware — там этот валидатор не запускается).
 *   - hero-generic-only-when-no-fit: HeroSection с visual.variant='generic'
 *     допустим, только если в брифе явно отмечено (TBD: через
 *     brief.allowGenericHero). Пока — warning, не error.
 *   - no-variant-collision: одна и та же mediaVariant не должна повторяться
 *     более чем в 2 MediaCopy подряд (для board-board-board лучше иметь
 *     pm-board + analytics-kpi + modules-matrix, чем три одинаковых).
 */

export interface LandingVisualDiversityError {
  rule:
    | 'max-default-media'
    | 'no-variant-collision'
    | 'hero-generic-without-justification'
    | 'media-must-have-variant';
  message: string;
  where?: string;
}

export interface LandingVisualDiversityResult {
  ok: boolean;
  errors: LandingVisualDiversityError[];
  warnings: LandingVisualDiversityError[];
}

export interface LandingVisualDiversityOptions {
  /** Layout slug (если выбран). Для нарративных layouts генерик допустим. */
  layout?: string;
}

const NARRATIVE_LAYOUTS = new Set(['story-led-unaware']);

export function validateLandingVisualDiversity(
  spec: LandingSpec,
  options: LandingVisualDiversityOptions = {},
): LandingVisualDiversityResult {
  const errors: LandingVisualDiversityError[] = [];
  const warnings: LandingVisualDiversityError[] = [];

  const isNarrative = options.layout ? NARRATIVE_LAYOUTS.has(options.layout) : false;

  // 1. max-default-media: не более 1 MediaCopy с default variant (для не-нарративных layouts).
  if (!isNarrative) {
    let defaultMediaCount = 0;
    const defaultMediaPositions: number[] = [];
    spec.sections.forEach((s, i) => {
      if (s.component !== 'MediaCopy') return;
      const variant = s.props.mediaVariant ?? 'default';
      if (variant === 'default') {
        defaultMediaCount++;
        defaultMediaPositions.push(i);
      }
    });
    if (defaultMediaCount > 1) {
      errors.push({
        rule: 'max-default-media',
        message:
          `На лендинге ${defaultMediaCount} MediaCopy с mediaVariant='default' — ` +
          'это generic three-bar placeholder, он одинаковый везде и делает лендинг однотипным. ' +
          'Замени на доменно-релевантные варианты (pm-board, kb-internal, analytics-kpi, ' +
          'modules-matrix, integrations-console, support-board, request-card, kb-public). ' +
          `Допустим максимум 1 default. Секции: [${defaultMediaPositions.join(', ')}].`,
        where: `sections[${defaultMediaPositions.join(',')}]`,
      });
    }
  }

  // 2. media-must-have-variant: MediaCopy без mediaVariant вообще (зашлёт default).
  //    Технически это легально, но в новых layouts variant должен быть осознанным.
  //    Делаем warning, а не error, чтобы не ломать legacy.
  spec.sections.forEach((s, i) => {
    if (s.component !== 'MediaCopy') return;
    if (!s.props.mediaVariant) {
      warnings.push({
        rule: 'media-must-have-variant',
        message:
          `MediaCopy[${i}] не указывает mediaVariant — ` +
          'отрендерится как generic. Выбери явно из реестра.',
        where: `sections[${i}].mediaVariant`,
      });
    }
  });

  // 3. no-variant-collision: одна mediaVariant >2 раз подряд = плохая ритмика.
  const mediaVariants: { variant: string; idx: number }[] = [];
  spec.sections.forEach((s, i) => {
    if (s.component !== 'MediaCopy') return;
    mediaVariants.push({ variant: s.props.mediaVariant ?? 'default', idx: i });
  });
  if (mediaVariants.length >= 2) {
    let run = 1;
    for (let i = 1; i < mediaVariants.length; i++) {
      if (mediaVariants[i]!.variant === mediaVariants[i - 1]!.variant) {
        run++;
        if (run >= 2) {
          errors.push({
            rule: 'no-variant-collision',
            message:
              `MediaCopy с mediaVariant='${mediaVariants[i]!.variant}' идут подряд ` +
              `${run + 1} раз — сломан ритм. Чередуй разные mock-варианты или ` +
              'поставь не-MediaCopy секцию (stats / process / banner) между ними.',
            where: `sections[${mediaVariants[i]!.idx}]`,
          });
        }
      } else {
        run = 1;
      }
    }
  }

  // 4. hero-generic-without-justification: warning, не error.
  const hero = spec.sections[0];
  if (hero && hero.component === 'HeroSection') {
    const v = hero.props.visual?.variant;
    if (v === 'generic' && !isNarrative) {
      warnings.push({
        rule: 'hero-generic-without-justification',
        message:
          'HeroSection.visual.variant=generic для не-нарративного лендинга — ' +
          'обычно это запасной вариант. Подбери один из специализированных mock\'ов ' +
          '(pm-board, support-board, analytics-kpi, integrations-console, modules-matrix) ' +
          'под главное обещание hero.',
        where: 'sections[0].visual.variant',
      });
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function formatLandingVisualDiversityErrors(
  result: LandingVisualDiversityResult,
): string {
  if (result.ok && result.warnings.length === 0) return 'OK';
  const lines: string[] = [];
  for (const e of result.errors) {
    lines.push(`  [visual:${e.rule}] ${e.where ?? '*'} — ${e.message}`);
  }
  for (const w of result.warnings) {
    lines.push(`  [visual:warn:${w.rule}] ${w.where ?? '*'} — ${w.message}`);
  }
  return lines.join('\n');
}

export function _getMediaVariantUsage(sections: Section[]): Map<string, number[]> {
  const usage = new Map<string, number[]>();
  sections.forEach((s, i) => {
    if (s.component !== 'MediaCopy') return;
    const v = s.props.mediaVariant ?? 'default';
    const arr = usage.get(v) ?? [];
    arr.push(i);
    usage.set(v, arr);
  });
  return usage;
}
