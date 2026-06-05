import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import type { Brief } from '../schemas/brief';
import type { IntakeTz } from '../schemas/intake-tz';
import { validateBriefQuality } from '../validators/index';
import { IntakeOutputSchema } from './prepare-intake';
import { renderTzMarkdown } from './render-tz-markdown';

export interface IngestIntakeError {
  kind: 'read' | 'parse' | 'schema' | 'brief-quality';
  message: string;
  path?: string;
  code?: string;
}

export interface IngestIntakeResult {
  ok: boolean;
  slug: string;
  briefPath?: string;
  briefPathRel?: string;
  tzPath?: string;
  tzPathRel?: string;
  repairPathRel?: string;
  errors: IngestIntakeError[];
  warnings: string[];
  needsConfirmation: string[];
  nextCommand?: string;
}

/**
 * Принимает { tz, brief } от хост-агента (intake.json), валидирует ТЗ+бриф,
 * прогоняет brief-quality как ЖЁСТКИЙ гейт (в отличие от advisory в P0), и при успехе
 * публикует content/briefs/<slug>.json + рендерит content/briefs/<slug>.tz.md.
 * При ошибках пишет .context/intake/<slug>/intake.repair.md (repair-loop).
 */
export async function ingestIntake(opts: { root: string; slug: string }): Promise<IngestIntakeResult> {
  const intakeAbs = resolve(opts.root, '.context', 'intake', opts.slug, 'intake.json');
  const intakeRel = relative(opts.root, intakeAbs);
  const errors: IngestIntakeError[] = [];
  const warnings: string[] = [];
  let needsConfirmation: string[] = [];

  let raw: string;
  try {
    raw = await readFile(intakeAbs, 'utf-8');
  } catch {
    errors.push({ kind: 'read', message: `${intakeRel} не найден. Сначала запусти agent intake и запиши JSON.`, path: intakeRel });
    return { ok: false, slug: opts.slug, errors, warnings, needsConfirmation };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch (err) {
    errors.push({ kind: 'parse', message: `intake.json невалидный JSON: ${(err as Error).message}`, path: intakeRel });
    return { ok: false, slug: opts.slug, errors, warnings, needsConfirmation };
  }

  const res = IntakeOutputSchema.safeParse(parsedJson);
  if (!res.success) {
    for (const issue of res.error.issues) {
      errors.push({ kind: 'schema', message: issue.message, path: issue.path.length ? issue.path.join('.') : undefined, code: issue.code });
    }
    const repairPathRel = await writeRepair(opts, errors, []);
    return { ok: false, slug: opts.slug, errors, warnings, needsConfirmation, repairPathRel };
  }

  const tz: IntakeTz = res.data.tz;
  const brief: Brief = res.data.brief;

  // ЖЁСТКИЙ гейт: brief-quality (домен резолвится / поля содержательны / без лозунгов).
  const quality = await validateBriefQuality(brief, { root: opts.root });
  needsConfirmation = [...new Set([...tz.needs_confirmation, ...quality.needsConfirmation])];
  let hardErrors = 0;
  for (const e of quality.errors) {
    if (e.severity === 'error') {
      hardErrors++;
      errors.push({ kind: 'brief-quality', message: e.message, path: e.field, code: e.rule });
    } else {
      warnings.push(`brief-quality:warn ${e.field} — ${e.message}`);
    }
  }
  if (hardErrors > 0) {
    const repairPathRel = await writeRepair(opts, errors, needsConfirmation);
    return { ok: false, slug: opts.slug, errors, warnings, needsConfirmation, repairPathRel };
  }

  // Публикация: brief.json (контракт пайплайна) + ТЗ.md (для ревью), оба из одного JSON.
  const briefAbs = resolve(opts.root, 'content', 'briefs', `${opts.slug}.json`);
  const tzAbs = resolve(opts.root, 'content', 'briefs', `${opts.slug}.tz.md`);
  await mkdir(dirname(briefAbs), { recursive: true });
  await writeFile(briefAbs, JSON.stringify(brief, null, 2) + '\n', 'utf-8');
  await writeFile(tzAbs, renderTzMarkdown(tz, opts.slug, brief), 'utf-8');

  return {
    ok: true,
    slug: opts.slug,
    briefPath: briefAbs,
    briefPathRel: relative(opts.root, briefAbs),
    tzPath: tzAbs,
    tzPathRel: relative(opts.root, tzAbs),
    errors,
    warnings,
    needsConfirmation,
    nextCommand: `pnpm -w run harness agent build landing --slug ${opts.slug} --brief content/briefs/${opts.slug}.json`,
  };
}

async function writeRepair(
  opts: { root: string; slug: string },
  errors: IngestIntakeError[],
  needsConfirmation: string[],
): Promise<string> {
  const repairAbs = resolve(opts.root, '.context', 'intake', opts.slug, 'intake.repair.md');
  await mkdir(dirname(repairAbs), { recursive: true });
  const lines: string[] = [
    `# Intake repair — ${opts.slug}`,
    '',
    `Исправь \`.context/intake/${opts.slug}/intake.json\` и снова запусти \`agent intake-apply landing --slug ${opts.slug}\`.`,
    '',
    '## Ошибки',
    '',
  ];
  for (const e of errors) {
    lines.push(`- [${e.kind}${e.code ? `:${e.code}` : ''}] ${e.path ? `\`${e.path}\` — ` : ''}${e.message}`);
  }
  if (needsConfirmation.length) {
    lines.push('', '## Needs confirmation', '');
    for (const n of needsConfirmation) lines.push(`- ${n}`);
  }
  await writeFile(repairAbs, lines.join('\n') + '\n', 'utf-8').catch(() => {});
  return relative(opts.root, repairAbs);
}
