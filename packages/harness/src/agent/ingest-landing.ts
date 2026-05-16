import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { z } from 'zod';
import { BriefSchema, type Brief } from '../schemas/brief';
import { LandingSpecSchema, type LandingSpec } from '../schemas/landing-spec';
import { loadAudienceScoring } from '../schemas/audience-scoring';
import {
  validateLandingBrand,
  validateLandingBusiness,
  validateLandingAudience,
  validateLandingVisualDiversity,
  validateLandingLayoutConformance,
  formatAudienceReportMarkdown,
  type LandingBrandError,
  type LandingBusinessError,
  type LandingAudienceError,
  type LandingAudienceResult,
  type LandingVisualDiversityError,
  type LandingLayoutConformanceError,
} from '../validators/index';
import { renderLandingToTSX } from '../render/index';
import { buildLandingSystemPromptWithMeta } from '../prompts/system';
import { appendLog, fileLandingToWiki } from '../wiki/index';

export type IngestStage = 'read' | 'parse' | 'validate' | 'render' | 'file-back' | 'done';

export interface IngestLandingError {
  kind: 'parse' | 'brand' | 'business' | 'audience' | 'visual' | 'layout';
  message: string;
  path?: string;
  code?: string;
}

export interface IngestLandingOptions {
  root: string;
  slug: string;
  briefPath?: string;
  /** Don't write TSX even if spec is valid. */
  noRender?: boolean;
  /** When validator returns issues, don't write spec/TSX. */
  strict?: boolean;
  /** Skip wiki filing back + log entry. */
  noFileBack?: boolean;
  /** Generator label (for spec.meta) — defaults to "host-agent". */
  generator?: string;
  /** Минимальный Audience Score для прохождения гейта (default — из scoring config, обычно 70). */
  audienceThreshold?: number;
  /** Полностью отключить audience-score gate (не запускать валидатор). */
  noAudienceGate?: boolean;
}

export interface IngestLandingResult {
  ok: boolean;
  slug: string;
  specPath: string;
  specPathRel: string;
  tsxPath?: string;
  tsxPathRel?: string;
  wikiPath?: string;
  wikiPathRel?: string;
  errors: IngestLandingError[];
  warnings: string[];
  sectionsCount: number;
  archetype?: string;
  sources: string[];
  previewUrl: string;
  /** Audience-score gate result (undefined если гейт выключен или scoring config недоступен). */
  audienceScore?: LandingAudienceResult;
  /** Пути отчётов audience-score (если гейт отработал). */
  audienceReportJsonRel?: string;
  audienceReportMdRel?: string;
}

export async function ingestLanding(opts: IngestLandingOptions): Promise<IngestLandingResult> {
  const specAbs = resolve(opts.root, 'content', 'landings', `${opts.slug}.json`);
  const specRel = relative(opts.root, specAbs);
  const errors: IngestLandingError[] = [];
  const warnings: string[] = [];

  let raw: string;
  try {
    raw = await readFile(specAbs, 'utf-8');
  } catch (err) {
    errors.push({
      kind: 'parse',
      message: `spec file not found at ${specRel}. Запиши сгенерированный JSON туда и снова запусти ingest.`,
      path: specRel,
    });
    return {
      ok: false,
      slug: opts.slug,
      specPath: specAbs,
      specPathRel: specRel,
      errors,
      warnings,
      sectionsCount: 0,
      sources: [],
      previewUrl: previewUrlFor(opts.slug),
    };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch (err) {
    errors.push({
      kind: 'parse',
      message: `spec не валидный JSON: ${(err as Error).message}`,
      path: specRel,
    });
    return {
      ok: false,
      slug: opts.slug,
      specPath: specAbs,
      specPathRel: specRel,
      errors,
      warnings,
      sectionsCount: 0,
      sources: [],
      previewUrl: previewUrlFor(opts.slug),
    };
  }

  const parseResult = LandingSpecSchema.safeParse(parsedJson);
  if (!parseResult.success) {
    for (const issue of parseResult.error.issues) {
      errors.push({
        kind: 'parse',
        message: issue.message,
        path: issue.path.length ? issue.path.join('.') : undefined,
        code: issue.code,
      });
    }
    return {
      ok: false,
      slug: opts.slug,
      specPath: specAbs,
      specPathRel: specRel,
      errors,
      warnings,
      sectionsCount: 0,
      sources: [],
      previewUrl: previewUrlFor(opts.slug),
    };
  }

  const spec: LandingSpec = parseResult.data;

  let brief: Brief | undefined;
  if (opts.briefPath) {
    const briefAbs = resolve(opts.root, opts.briefPath);
    try {
      const briefRaw = await readFile(briefAbs, 'utf-8');
      brief = BriefSchema.parse(JSON.parse(briefRaw));
    } catch (err) {
      warnings.push(
        `не удалось прочитать brief по пути ${opts.briefPath}: ${(err as Error).message}. ` +
          'business-валидатор будет пропущен (нужен brief для проверки CTA alignment).',
      );
    }
  } else {
    warnings.push(
      'brief не передан — business-validator проверит только структурные правила без cta-alignment.',
    );
  }

  const brand = validateLandingBrand(spec);
  if (!brand.ok) {
    for (const e of brand.errors) errors.push(landingBrandToIngestError(e));
  }

  if (brief) {
    const biz = validateLandingBusiness(spec, brief);
    if (!biz.ok) {
      for (const e of biz.errors) errors.push(landingBusinessToIngestError(e));
    }
  }

  // Visual diversity gate — блокирует MediaCopy default >1 и collision подряд.
  const layoutSlug = brief?.pageLayout ?? spec.meta?.layout;
  const visual = validateLandingVisualDiversity(spec, { layout: layoutSlug });
  if (!visual.ok) {
    for (const e of visual.errors) errors.push(landingVisualToIngestError(e));
  }
  for (const w of visual.warnings) {
    warnings.push(`visual:warn ${w.where ?? '*'} — ${w.message}`);
  }

  // Layout conformance — проверяем порядок секций vs выбранный layout.
  if (layoutSlug) {
    const conformance = await validateLandingLayoutConformance(spec, {
      root: opts.root,
      layout: layoutSlug,
    });
    if (!conformance.ok) {
      for (const e of conformance.errors) errors.push(landingLayoutToIngestError(e));
    }
    for (const w of conformance.warnings) {
      warnings.push(`layout:warn ${w.where ?? '*'} — ${w.message}`);
    }
  } else {
    warnings.push(
      'layout не указан ни в brief.pageLayout, ни в spec.meta.layout — layout-conformance пропущен. ' +
        'Лучшая практика: выбрать осознанно из wiki/layouts/index.md.',
    );
  }

  // Audience-score gate (этап 4½). Запускается даже при ошибках brand/business,
  // чтобы host-LLM видел весь список того, что нужно поправить, за одну итерацию.
  let audienceScore: LandingAudienceResult | undefined;
  let audienceReportJsonRel: string | undefined;
  let audienceReportMdRel: string | undefined;
  let audienceScoreMarkdown: string | undefined;
  if (!opts.noAudienceGate) {
    try {
      const scoring = await loadAudienceScoring(opts.root);
      audienceScore = validateLandingAudience(spec, scoring, {
        brief,
        threshold: opts.audienceThreshold,
      });
      const reportAt = new Date().toISOString();
      audienceScoreMarkdown = formatAudienceReportMarkdown(opts.slug, audienceScore, reportAt);

      const reportJsonAbs = resolve(opts.root, '.context', 'audience-score', `${opts.slug}.json`);
      const reportMdAbs = resolve(opts.root, '.context', 'audience-score', `${opts.slug}.md`);
      await mkdir(dirname(reportJsonAbs), { recursive: true });
      await writeFile(reportJsonAbs, JSON.stringify({ generatedAt: reportAt, ...audienceScore }, null, 2) + '\n', 'utf-8');
      await writeFile(reportMdAbs, audienceScoreMarkdown + '\n', 'utf-8');
      audienceReportJsonRel = relative(opts.root, reportJsonAbs);
      audienceReportMdRel = relative(opts.root, reportMdAbs);

      if (!audienceScore.ok) {
        for (const e of audienceScore.errors) errors.push(landingAudienceToIngestError(e));
      }
    } catch (err) {
      warnings.push(
        `audience-score gate пропущен: ${(err as Error).message}. Проверь wiki/audiences/kaiten-scoring.json.`,
      );
    }
  }

  const hasErrors = errors.length > 0;

  if (hasErrors && opts.strict) {
    return {
      ok: false,
      slug: opts.slug,
      specPath: specAbs,
      specPathRel: specRel,
      errors,
      warnings,
      sectionsCount: spec.sections.length,
      sources: [],
      previewUrl: previewUrlFor(opts.slug),
      audienceScore,
      audienceReportJsonRel,
      audienceReportMdRel,
    };
  }

  // Meta enrichment via buildLandingSystemPromptWithMeta (selective context).
  let sources: string[] = [];
  let archetype: string = spec.pageType;
  let tokenEstimate: number | undefined;
  if (brief) {
    try {
      const meta = await buildLandingSystemPromptWithMeta({ brief });
      sources = meta.sources;
      if (meta.archetype) archetype = meta.archetype;
      tokenEstimate = meta.tokenEstimate;
    } catch (err) {
      warnings.push(`meta enrichment failed: ${(err as Error).message}`);
    }
  }

  spec.meta = {
    sources,
    generatedAt: new Date().toISOString(),
    generator: opts.generator ?? 'host-agent',
    archetype,
    layout: layoutSlug,
    tokenEstimate,
  };

  // Persist spec (possibly с пересохранёнными meta).
  await writeFile(specAbs, JSON.stringify(spec, null, 2) + '\n', 'utf-8');

  let tsxPath: string | undefined;
  let tsxPathRel: string | undefined;
  if (!opts.noRender) {
    const tsx = renderLandingToTSX(spec, opts.slug);
    tsxPath = resolve(opts.root, 'generated', 'landings', opts.slug, 'page.tsx');
    tsxPathRel = relative(opts.root, tsxPath);
    await mkdir(dirname(tsxPath), { recursive: true });
    await writeFile(tsxPath, tsx, 'utf-8');
  }

  let wikiPath: string | undefined;
  let wikiPathRel: string | undefined;
  if (!opts.noFileBack && brief && opts.briefPath) {
    try {
      wikiPath = await fileLandingToWiki(opts.root, {
        slug: opts.slug,
        brief,
        briefPath: opts.briefPath,
        spec,
        sources,
        archetype,
        durationMs: 0,
        generator: spec.meta?.generator ?? 'host-agent',
        tokenEstimate,
        audienceScoreMarkdown,
      });
      wikiPathRel = relative(opts.root, wikiPath);
    } catch (err) {
      warnings.push(`filing back failed: ${(err as Error).message}`);
    }
  }

  const scoreNote = audienceScore ? ` audienceScore=${audienceScore.score}/${audienceScore.threshold}` : '';
  await appendLog(opts.root, {
    op: 'generate',
    slug: opts.slug,
    status: hasErrors ? 'fail' : 'ok',
    note: `agent-ingest archetype=${archetype} sections=${spec.sections.length} errors=${errors.length}${scoreNote}`,
  }).catch(() => {});

  return {
    ok: !hasErrors,
    slug: opts.slug,
    specPath: specAbs,
    specPathRel: specRel,
    tsxPath,
    tsxPathRel,
    wikiPath,
    wikiPathRel,
    errors,
    warnings,
    sectionsCount: spec.sections.length,
    archetype,
    sources,
    previewUrl: previewUrlFor(opts.slug),
    audienceScore,
    audienceReportJsonRel,
    audienceReportMdRel,
  };
}

function previewUrlFor(slug: string): string {
  return `http://localhost:3000/landings/${slug}`;
}

function landingBrandToIngestError(e: LandingBrandError): IngestLandingError {
  return {
    kind: 'brand',
    message: `${e.message} (evidence: "${e.evidence}")`,
    path: e.field,
    code: e.rule,
  };
}

function landingBusinessToIngestError(e: LandingBusinessError): IngestLandingError {
  return {
    kind: 'business',
    message: e.message,
    path: e.where,
    code: e.rule,
  };
}

function landingAudienceToIngestError(e: LandingAudienceError): IngestLandingError {
  const suggestionSuffix = e.suggestion ? ` — ${e.suggestion}` : '';
  return {
    kind: 'audience',
    message: `${e.message}${suggestionSuffix}`,
    path: e.where,
    code: e.ruleId ?? e.kind,
  };
}

function landingVisualToIngestError(e: LandingVisualDiversityError): IngestLandingError {
  return {
    kind: 'visual',
    message: e.message,
    path: e.where,
    code: e.rule,
  };
}

function landingLayoutToIngestError(e: LandingLayoutConformanceError): IngestLandingError {
  return {
    kind: 'layout',
    message: e.message,
    path: e.where,
    code: e.rule,
  };
}
