import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NextResponse } from 'next/server';
import { LandingSpecSchema } from '@buffalo/harness/schemas';
import { puckDataToSections, puckRootToSeo, type PuckData } from '@buffalo/harness/puck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function repoRoot(): string {
  return resolve(process.cwd(), '..', '..');
}

interface Ctx {
  params: Promise<{ slug: string }>;
}

function validSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!validSlug(slug)) {
    return NextResponse.json({ error: 'invalid slug' }, { status: 400 });
  }
  const path = resolve(repoRoot(), 'content', 'landings', `${slug}.json`);
  try {
    const raw = await readFile(path, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'ENOENT'
    ) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    throw err;
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!validSlug(slug)) {
    return NextResponse.json({ error: 'invalid slug' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json body' }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !Array.isArray((body as PuckData).content)
  ) {
    return NextResponse.json({ error: 'invalid puck data (missing content[])' }, { status: 400 });
  }

  const puckData = body as PuckData;

  const path = resolve(repoRoot(), 'content', 'landings', `${slug}.json`);
  let existing: Record<string, unknown> = {};
  try {
    existing = JSON.parse(await readFile(path, 'utf-8'));
  } catch {
    // создаём с нуля, если файла нет
  }

  const sections = puckDataToSections(puckData.content);
  const seo = puckRootToSeo(puckData.root);

  const nextSpec = {
    ...existing,
    pageType: (existing.pageType as string) ?? 'saas_landing',
    goal: (existing.goal as string) ?? 'try_free',
    sections,
    seo: {
      ...((existing.seo as Record<string, unknown>) ?? {}),
      ...(seo.title !== undefined ? { title: seo.title } : {}),
      ...(seo.description !== undefined ? { description: seo.description } : {}),
    },
    meta: {
      ...((existing.meta as Record<string, unknown>) ?? {}),
      updatedAt: new Date().toISOString(),
      lastEditor: 'puck',
    },
  };

  const parsed = LandingSpecSchema.safeParse(nextSpec);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'validation failed',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  await writeFile(path, JSON.stringify(parsed.data, null, 2) + '\n', 'utf-8');

  return NextResponse.json({
    ok: true,
    savedAt: new Date().toISOString(),
    sections: sections.length,
  });
}
