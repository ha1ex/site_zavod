import type { Brief } from '../schemas/brief';
import type { LandingSpec, Section } from '../schemas/landing-spec';
import type {
  AudienceScoring,
  ScoringRole,
  ScoringSegment,
  ScoringStory,
} from '../schemas/audience-scoring';

/**
 * Audience-score gate validator (этап 4½).
 *
 * Считает Audience-Adjusted Score 0..100 по 4 субскорам:
 *   S1. Story coverage (×0.4)  — покрытие top-N user stories в копирайте + CTA.
 *   S2. Segment fit (×0.3)     — упоминание приоритетных сегментов в hero/features/FAQ.
 *   S3. Role addressability (×0.2) — покрытие top-2 ролей (+ IT-директор для финансов/госа).
 *   S4. CTA alignment (×0.1)   — совпадение типа CTA с preferred для резолвленного сегмента.
 *
 * Плюс жёсткие must-pass правила из kaiten-scoring.json:
 *   - IT нуждается в сравнении или Trial.
 *   - Финансы/Госсектор нуждаются в security + Demo.
 *   - SEO таргетит приоритет.
 *   - Антипрофиль не primary.
 *
 * Если score < threshold (default 70) ИЛИ хотя бы одно must-pass падает → ok=false.
 * Возвращаемые ошибки/suggestions используются host-LLM для repair-loop.
 */

export type CtaType = 'Trial' | 'Demo' | 'PDF' | 'Partner' | 'Blog' | 'Unknown';

export type AudienceErrorKind =
  | 'audience-resolve-needed'
  | 'score-below-threshold'
  | 'must-pass-failed'
  | 'anti-profile-primary';

export interface LandingAudienceError {
  kind: AudienceErrorKind;
  ruleId?: string;
  message: string;
  suggestion?: string;
  where?: string;
}

export interface SubscoreBreakdown {
  id: 'S1' | 'S2' | 'S3' | 'S4';
  label: string;
  raw: number;
  weight: number;
  weighted: number;
  detail: string;
}

export interface LandingAudienceResult {
  ok: boolean;
  score: number;
  threshold: number;
  resolvedSegments: string[];
  /** segment ids, для которых сработал hard-fail (антипрофиль / не резолвлено). */
  warnings: string[];
  breakdown: SubscoreBreakdown[];
  storyCoverage: Array<{ id: string; title: string; weight: number; covered: number; rationale: string }>;
  ctaTypes: CtaType[];
  errors: LandingAudienceError[];
  suggestions: string[];
}

export interface ValidateAudienceOptions {
  threshold?: number;
  /** Если не передан brief — валидатор возвращает audience-resolve-needed. */
  brief?: Brief;
}

/* ─── text & cta extractors ───────────────────────────────────────── */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9 \-+/.,]/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectSectionText(section: Section): string[] {
  const out: string[] = [];
  const push = (v: unknown): void => {
    if (typeof v === 'string' && v.trim()) out.push(v);
  };
  const props = section.props as Record<string, unknown>;
  for (const key of Object.keys(props)) {
    const v = props[key];
    if (typeof v === 'string') push(v);
    else if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === 'string') push(item);
        else if (item && typeof item === 'object') {
          for (const ik of Object.keys(item as object)) {
            const iv = (item as Record<string, unknown>)[ik];
            if (typeof iv === 'string') push(iv);
            else if (Array.isArray(iv)) for (const lv of iv) if (typeof lv === 'string') push(lv);
          }
        }
      }
    } else if (v && typeof v === 'object') {
      for (const ik of Object.keys(v as object)) {
        const iv = (v as Record<string, unknown>)[ik];
        if (typeof iv === 'string') push(iv);
      }
    }
  }
  return out;
}

function collectAllText(spec: LandingSpec): string {
  const parts: string[] = [];
  for (const s of spec.sections) parts.push(...collectSectionText(s));
  parts.push(spec.seo.title, spec.seo.description);
  return normalize(parts.join(' \n '));
}

function classifyCta(label: string, href: string): CtaType {
  const l = normalize(label);
  const h = normalize(href);
  if (/демо|demo|записаться|забронир|book/.test(l) || /demo/.test(h)) return 'Demo';
  if (/попроб|trial|бесплат|регистр|sign\s?up|начать|create account|try/.test(l) || /signup|register|trial|start/.test(h))
    return 'Trial';
  if (/скачать|download|pdf|презентац|для руководителя|материал/.test(l) || /\.pdf|download/.test(h)) return 'PDF';
  if (/партн|partner/.test(l) || /partner/.test(h)) return 'Partner';
  if (/блог|blog|читать|статья/.test(l) || /blog|article/.test(h)) return 'Blog';
  return 'Unknown';
}

function collectCtas(spec: LandingSpec): Array<{ type: CtaType; where: string; label: string }> {
  const out: Array<{ type: CtaType; where: string; label: string }> = [];
  for (let i = 0; i < spec.sections.length; i++) {
    const s = spec.sections[i]!;
    const props = s.props as Record<string, unknown>;
    const tryCta = (path: string, cta: unknown): void => {
      if (cta && typeof cta === 'object') {
        const c = cta as { label?: unknown; href?: unknown };
        if (typeof c.label === 'string' && typeof c.href === 'string') {
          out.push({ type: classifyCta(c.label, c.href), where: `sections[${i}].${path}`, label: c.label });
        }
      }
    };
    tryCta('primaryCta', props.primaryCta);
    tryCta('secondaryCta', props.secondaryCta);
    tryCta('cta', props.cta);
    const plans = props.plans as Array<{ cta?: unknown }> | undefined;
    if (Array.isArray(plans)) {
      for (let j = 0; j < plans.length; j++) tryCta(`plans[${j}].cta`, plans[j]?.cta);
    }
  }
  return out;
}

/* ─── segment resolution ──────────────────────────────────────────── */

function containsWord(corpus: string, term: string): boolean {
  const trimmed = term.trim();
  if (!trimmed) return false;
  const t = normalize(trimmed);
  if (!t) return false;
  // Spaces в исходном термине помечают желаемые word-boundaries (Unicode-aware).
  // JS \b работает только с ASCII, поэтому используем lookbehind/lookahead по [\p{L}\p{N}].
  const needLeft = /^\s/.test(term);
  const needRight = /\s$/.test(term);
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const left = needLeft ? '(?<![\\p{L}\\p{N}])' : '';
  const right = needRight ? '(?![\\p{L}\\p{N}])' : '';
  const pattern = new RegExp(`${left}${escaped}${right}`, 'u');
  return pattern.test(corpus);
}

function lexicalMatchSegments(brief: Brief, scoring: AudienceScoring): string[] {
  const corpus = normalize(
    [brief.product, brief.market, brief.mainPain, brief.mainPromise, ...(brief.audience ?? [])]
      .filter(Boolean)
      .join(' '),
  );
  const matched = new Set<string>();
  for (const seg of scoring.segments) {
    for (const syn of seg.synonyms) {
      if (containsWord(corpus, syn)) {
        matched.add(seg.id);
        break;
      }
    }
  }
  return [...matched];
}

function resolveSegments(brief: Brief | undefined, scoring: AudienceScoring): string[] {
  if (!brief) return [];
  if (brief.resolvedSegments && brief.resolvedSegments.length > 0) {
    const known = new Set(scoring.segments.map((s) => s.id));
    return brief.resolvedSegments.filter((id) => known.has(id));
  }
  return lexicalMatchSegments(brief, scoring);
}

function getSegment(scoring: AudienceScoring, id: string): ScoringSegment | undefined {
  return scoring.segments.find((s) => s.id === id);
}

function getRole(scoring: AudienceScoring, id: string): ScoringRole | undefined {
  return scoring.roles.find((r) => r.id === id);
}

function getStory(scoring: AudienceScoring, id: string): ScoringStory | undefined {
  return scoring.userStories.find((s) => s.id === id);
}

/* ─── subscores ───────────────────────────────────────────────────── */

function coverageForStory(story: ScoringStory, text: string, ctaTypes: CtaType[]): number {
  let hits = 0;
  for (const kw of story.keywords) {
    if (text.includes(normalize(kw))) hits++;
  }
  const kwScore = story.keywords.length > 0 ? Math.min(1, hits / Math.max(2, Math.ceil(story.keywords.length / 3))) : 0;
  const ctaScore = ctaTypes.includes(story.ctaType as CtaType) ? 1 : 0;
  // 70% keywords + 30% cta alignment
  return Math.min(1, 0.7 * kwScore + 0.3 * ctaScore);
}

function scoreS1Stories(
  scoring: AudienceScoring,
  resolved: string[],
  text: string,
  ctaTypes: CtaType[],
): { raw: number; detail: string; coverage: LandingAudienceResult['storyCoverage'] } {
  // Weight each story by its base score × max relevance across resolved segments (from crossMap).
  const segs = resolved.length > 0 ? resolved : scoring.segments.filter((s) => !s.antiProfile).map((s) => s.id);
  const weighted: Array<{ story: ScoringStory; weight: number; covered: number }> = [];
  for (const story of scoring.userStories) {
    if (story.antiProfile) continue;
    let rel = 0;
    for (const segId of segs) {
      const row = scoring.crossMap[segId];
      const v = row ? (row[story.id] ?? 0) : 0;
      if (v > rel) rel = v;
    }
    if (rel === 0) continue;
    const weight = (story.score / 100) * (rel / 5);
    const covered = coverageForStory(story, text, ctaTypes);
    weighted.push({ story, weight, covered });
  }
  weighted.sort((a, b) => b.weight - a.weight);
  const top = weighted.slice(0, 6);
  const totalWeight = top.reduce((acc, w) => acc + w.weight, 0) || 1;
  const earned = top.reduce((acc, w) => acc + w.weight * w.covered, 0);
  const raw = (earned / totalWeight) * 100;
  return {
    raw,
    detail: `top-${top.length} stories: ${top.map((t) => `${t.story.id}(w=${t.weight.toFixed(2)}, c=${t.covered.toFixed(2)})`).join(', ')}`,
    coverage: top.map((t) => ({
      id: t.story.id,
      title: t.story.title,
      weight: round2(t.weight),
      covered: round2(t.covered),
      rationale:
        t.covered >= 0.6
          ? 'covered'
          : t.covered > 0
            ? 'partial — добавь ключевые слова или CTA story в копирайт'
            : `not covered — добавь секцию/копи для "${t.story.title}" (keywords: ${t.story.keywords.slice(0, 3).join(', ')})`,
    })),
  };
}

function scoreS2Segments(
  scoring: AudienceScoring,
  resolved: string[],
  text: string,
): { raw: number; detail: string } {
  if (resolved.length === 0) return { raw: 0, detail: 'нет резолвленных сегментов' };
  let earned = 0;
  let total = 0;
  const hits: string[] = [];
  for (const segId of resolved) {
    const seg = getSegment(scoring, segId);
    if (!seg) continue;
    const w = seg.websiteScore;
    total += w;
    const found = seg.synonyms.some((syn) => text.includes(normalize(syn)));
    if (found) {
      earned += w;
      hits.push(seg.id);
    }
  }
  const raw = total > 0 ? (earned / total) * 100 : 0;
  return { raw, detail: `mentioned=${hits.length}/${resolved.length} [${hits.join(', ')}]` };
}

function scoreS3Roles(
  scoring: AudienceScoring,
  resolved: string[],
  text: string,
): { raw: number; detail: string } {
  const required = new Set(['PM', 'DM']);
  if (resolved.some((id) => id === 'Финансы' || id === 'Госсектор')) required.add('ITDir');
  let earned = 0;
  const detail: string[] = [];
  for (const roleId of required) {
    const role = getRole(scoring, roleId);
    if (!role) continue;
    let kwHits = 0;
    for (const kw of role.focusKeywords) if (text.includes(normalize(kw))) kwHits++;
    const c = Math.min(1, kwHits / Math.max(2, Math.ceil(role.focusKeywords.length / 3)));
    earned += c;
    detail.push(`${roleId}=${c.toFixed(2)}`);
  }
  const raw = (earned / required.size) * 100;
  return { raw, detail: detail.join(', ') };
}

function scoreS4Cta(
  scoring: AudienceScoring,
  resolved: string[],
  ctaTypes: CtaType[],
): { raw: number; detail: string } {
  if (resolved.length === 0 || ctaTypes.length === 0) {
    return { raw: 0, detail: ctaTypes.length === 0 ? 'нет CTA' : 'нет сегментов' };
  }
  let earned = 0;
  let total = 0;
  for (const segId of resolved) {
    const seg = getSegment(scoring, segId);
    if (!seg || seg.ctaTypes.length === 0) continue;
    total += 1;
    const overlap = seg.ctaTypes.some((t) => ctaTypes.includes(t as CtaType));
    if (overlap) earned += 1;
  }
  let raw = total > 0 ? (earned / total) * 100 : 0;
  // bonus: dual CTA Trial + PDF (executive 1-pager)
  if (ctaTypes.includes('Trial') && ctaTypes.includes('PDF')) raw = Math.min(100, raw + 10);
  return { raw, detail: `cta-types=[${[...new Set(ctaTypes)].join(',')}], match=${earned}/${total}` };
}

/* ─── must-pass rules ─────────────────────────────────────────────── */

function checkMustPass(
  scoring: AudienceScoring,
  resolved: string[],
  text: string,
  ctaTypes: CtaType[],
  spec: LandingSpec,
  storyCoverage: LandingAudienceResult['storyCoverage'],
): LandingAudienceError[] {
  const errors: LandingAudienceError[] = [];
  const coveredIds = new Set(storyCoverage.filter((c) => c.covered >= 0.6).map((c) => c.id));

  // anti-profile not primary
  if (resolved.length > 0 && resolved.every((id) => getSegment(scoring, id)?.antiProfile)) {
    errors.push({
      kind: 'anti-profile-primary',
      ruleId: 'anti-profile-not-primary',
      message: 'Все резолвленные сегменты помечены как антипрофиль (образование/медицина/HoReCa).',
      suggestion: 'Пересмотри brief.audience/market: добавь приоритетный сегмент (IT/Финансы/Агентства/Производство/Торговля/Госсектор) или объясни в resolvedSegments.',
    });
  }

  // IT
  if (resolved.includes('IT')) {
    const heroCta = (spec.sections[0]?.props as { primaryCta?: { label?: string; href?: string } })?.primaryCta;
    const heroCtaType = heroCta?.label && heroCta?.href ? classifyCta(heroCta.label, heroCta.href) : 'Unknown';
    const hasCompare = coveredIds.has('compare') || coveredIds.has('migrate-jira');
    if (!hasCompare && heroCtaType !== 'Trial') {
      errors.push({
        kind: 'must-pass-failed',
        ruleId: 'it-needs-compare-or-trial',
        message: 'IT-сегмент в брифе, но нет ни покрытия story "compare/migrate-jira", ни Trial-CTA в hero.',
        suggestion: 'Добавь либо сравнительный блок (Kaiten vs Jira/Trello/YouTrack), либо переведи hero.primaryCta на «Попробовать бесплатно».',
      });
    }
  }

  // Финансы / Госсектор
  const trustSeg = resolved.find((id) => id === 'Финансы' || id === 'Госсектор');
  if (trustSeg) {
    const hasSecurity = coveredIds.has('security');
    const hasDemo = ctaTypes.includes('Demo');
    if (!hasSecurity || !hasDemo) {
      const missing: string[] = [];
      if (!hasSecurity) missing.push('story "security" не покрыта (нет on-prem/ГОСТ/защиты данных)');
      if (!hasDemo) missing.push('нет Demo-CTA (только Trial недостаточно для compliance-сегмента)');
      errors.push({
        kind: 'must-pass-failed',
        ruleId: 'trust-segment-needs-security-and-demo',
        message: `Сегмент ${trustSeg}: ${missing.join('; ')}.`,
        suggestion: 'Добавь FeatureGrid или MediaCopy про on-prem/ГОСТ Р 57580/защиту данных и переключи (или продублируй) primary CTA на «Запросить демо».',
      });
    }
  }

  // SEO mentions priority
  const seoText = normalize(`${spec.seo.title} ${spec.seo.description}`);
  const top3Stories = scoring.userStories
    .filter((s) => !s.antiProfile)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const seoHasSegment = resolved.some((id) => {
    const seg = getSegment(scoring, id);
    return seg?.synonyms.some((syn) => seoText.includes(normalize(syn)));
  });
  const seoHasStoryKw = top3Stories.some((s) => s.keywords.some((kw) => seoText.includes(normalize(kw))));
  if (!seoHasSegment && !seoHasStoryKw) {
    errors.push({
      kind: 'must-pass-failed',
      ruleId: 'seo-mentions-priority',
      message: 'seo.title + seo.description не упоминают ни одного резолвленного сегмента, ни ключевых слов из top-3 stories.',
      suggestion: `Добавь в SEO упоминание сегмента (например, ${resolved[0] ?? 'IT'}) или ключевое слово (${top3Stories[0]?.keywords[0] ?? 'сравнение с jira'}).`,
    });
  }

  return errors;
}

/* ─── main ────────────────────────────────────────────────────────── */

export function validateLandingAudience(
  spec: LandingSpec,
  scoring: AudienceScoring,
  opts: ValidateAudienceOptions = {},
): LandingAudienceResult {
  const threshold = opts.threshold ?? scoring.scoringFormula.defaultThreshold ?? 70;
  const errors: LandingAudienceError[] = [];
  const warnings: string[] = [];

  if (!opts.brief) {
    errors.push({
      kind: 'audience-resolve-needed',
      message: 'brief не передан — audience-валидатор не может определить целевые сегменты.',
      suggestion: 'Передай --brief content/briefs/<slug>.json в agent apply.',
    });
    return {
      ok: false,
      score: 0,
      threshold,
      resolvedSegments: [],
      warnings,
      breakdown: [],
      storyCoverage: [],
      ctaTypes: [],
      errors,
      suggestions: errors.map((e) => e.suggestion ?? e.message),
    };
  }

  const resolved = resolveSegments(opts.brief, scoring);
  if (resolved.length === 0) {
    errors.push({
      kind: 'audience-resolve-needed',
      message:
        'Ни в brief.audience/market, ни в product/mainPain не найдено ни одного известного сегмента из wiki/audiences/kaiten-scoring.json.',
      suggestion:
        'Сделай короткий audience-research (РФ/СНГ → мир): кто типично использует продукт, кто принимает решение. Запиши id сегментов в brief.resolvedSegments (например, ["IT", "Агентства"]). Список id — в wiki/audiences/kaiten-scoring.md.',
    });
    return {
      ok: false,
      score: 0,
      threshold,
      resolvedSegments: [],
      warnings,
      breakdown: [],
      storyCoverage: [],
      ctaTypes: [],
      errors,
      suggestions: errors.map((e) => e.suggestion ?? e.message),
    };
  }

  const text = collectAllText(spec);
  const ctas = collectCtas(spec);
  const ctaTypes = [...new Set(ctas.map((c) => c.type))] as CtaType[];

  const s1 = scoreS1Stories(scoring, resolved, text, ctaTypes);
  const s2 = scoreS2Segments(scoring, resolved, text);
  const s3 = scoreS3Roles(scoring, resolved, text);
  const s4 = scoreS4Cta(scoring, resolved, ctaTypes);

  const breakdown: SubscoreBreakdown[] = [
    { id: 'S1', label: 'Story coverage', raw: round2(s1.raw), weight: 0.4, weighted: round2(s1.raw * 0.4), detail: s1.detail },
    { id: 'S2', label: 'Segment fit', raw: round2(s2.raw), weight: 0.3, weighted: round2(s2.raw * 0.3), detail: s2.detail },
    { id: 'S3', label: 'Role addressability', raw: round2(s3.raw), weight: 0.2, weighted: round2(s3.raw * 0.2), detail: s3.detail },
    { id: 'S4', label: 'CTA alignment', raw: round2(s4.raw), weight: 0.1, weighted: round2(s4.raw * 0.1), detail: s4.detail },
  ];
  const score = round2(breakdown.reduce((acc, b) => acc + b.weighted, 0));

  const mustPassErrors = checkMustPass(scoring, resolved, text, ctaTypes, spec, s1.coverage);
  errors.push(...mustPassErrors);

  if (score < threshold) {
    errors.push({
      kind: 'score-below-threshold',
      message: `Audience-score ${score} ниже порога ${threshold}.`,
      suggestion: buildScoreSuggestion(breakdown, s1.coverage),
    });
  }

  const ok = errors.length === 0;

  return {
    ok,
    score,
    threshold,
    resolvedSegments: resolved,
    warnings,
    breakdown,
    storyCoverage: s1.coverage,
    ctaTypes,
    errors,
    suggestions: errors.map((e) => e.suggestion ?? e.message),
  };
}

function buildScoreSuggestion(
  breakdown: SubscoreBreakdown[],
  coverage: LandingAudienceResult['storyCoverage'],
): string {
  const weakest = [...breakdown].sort((a, b) => a.raw - b.raw)[0];
  const missing = coverage.filter((c) => c.covered < 0.6).slice(0, 3);
  const parts: string[] = [];
  if (weakest) parts.push(`Слабее всего ${weakest.id} (${weakest.label}=${weakest.raw}): ${weakest.detail}.`);
  if (missing.length > 0) {
    parts.push(
      `Не покрыты stories: ${missing.map((m) => `${m.id} (${m.title})`).join('; ')}. Добавь соответствующие секции или ключевые слова.`,
    );
  }
  return parts.join(' ');
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* ─── pretty report ───────────────────────────────────────────────── */

export function formatAudienceReportMarkdown(
  slug: string,
  result: LandingAudienceResult,
  generatedAt: string,
): string {
  const lines: string[] = [];
  lines.push(`# Audience score — \`${slug}\``);
  lines.push('');
  lines.push(`- **Score:** ${result.score} / 100 (threshold ${result.threshold}) — ${result.ok ? '✅ pass' : '❌ fail'}`);
  lines.push(`- **Resolved segments:** ${result.resolvedSegments.join(', ') || '_none_'}`);
  lines.push(`- **CTA types detected:** ${result.ctaTypes.join(', ') || '_none_'}`);
  lines.push(`- **Generated:** ${generatedAt}`);
  lines.push('');
  lines.push('## Breakdown');
  lines.push('');
  lines.push('| ID | Subscore | Raw | Weight | Weighted | Detail |');
  lines.push('|---|---|---|---|---|---|');
  for (const b of result.breakdown) {
    lines.push(`| ${b.id} | ${b.label} | ${b.raw} | ${b.weight} | ${b.weighted} | ${b.detail} |`);
  }
  lines.push('');
  lines.push('## Story coverage (top-N)');
  lines.push('');
  lines.push('| Story | Weight | Covered | Status |');
  lines.push('|---|---|---|---|');
  for (const c of result.storyCoverage) {
    const status = c.covered >= 0.6 ? '✅' : c.covered > 0 ? '🟡' : '❌';
    lines.push(`| ${c.id} — ${c.title} | ${c.weight} | ${c.covered} | ${status} ${c.rationale} |`);
  }
  lines.push('');
  if (result.errors.length > 0) {
    lines.push('## Issues');
    lines.push('');
    for (const e of result.errors) {
      lines.push(`- **${e.kind}**${e.ruleId ? ` (\`${e.ruleId}\`)` : ''}: ${e.message}`);
      if (e.suggestion) lines.push(`  - _suggestion:_ ${e.suggestion}`);
    }
    lines.push('');
  } else {
    lines.push('## Issues');
    lines.push('');
    lines.push('_None — все правила пройдены._');
    lines.push('');
  }
  return lines.join('\n');
}

export function formatLandingAudienceErrors(errors: LandingAudienceError[]): string {
  return errors.map((e) => `[${e.kind}${e.ruleId ? `/${e.ruleId}` : ''}] ${e.message}`).join('\n');
}
