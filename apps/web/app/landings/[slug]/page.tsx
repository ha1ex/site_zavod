import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { LandingSpecSchema } from '@buffalo/harness/schemas';
import { RenderLanding } from '@buffalo/harness/render/render-spec-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadSpec(slug: string) {
  const root = resolve(process.cwd(), '..', '..');
  const path = resolve(root, 'content', 'landings', `${slug}.json`);
  try {
    const raw = await readFile(path, 'utf-8');
    const json = JSON.parse(raw);
    return LandingSpecSchema.parse(json);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const spec = await loadSpec(slug);
  if (!spec) return { title: 'Landing not found' };
  return {
    title: spec.seo.title,
    description: spec.seo.description,
  };
}

export default async function LandingPreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const spec = await loadSpec(slug);
  if (!spec) notFound();
  return <RenderLanding spec={spec} />;
}
