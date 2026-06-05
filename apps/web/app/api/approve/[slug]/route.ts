import { resolve } from 'node:path';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ApprovalStatusSchema } from '@kaiten/harness/schemas';
import { isSafeSlug, readApproval, writeApproval } from '@kaiten/harness/approvals';

const PatchBodySchema = z.object({
  status: ApprovalStatusSchema,
  reviewer: z.string().max(120).optional(),
  comments: z.string().max(4000).optional(),
});

function repoRoot(): string {
  return resolve(process.cwd(), '..', '..');
}

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) return NextResponse.json({ error: 'invalid slug' }, { status: 400 });
  const approval = await readApproval(repoRoot(), slug);
  return NextResponse.json(approval);
}

export async function POST(req: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) return NextResponse.json({ error: 'invalid slug' }, { status: 400 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const parsed = PatchBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const approval = await writeApproval(repoRoot(), slug, parsed.data);
  return NextResponse.json(approval);
}
