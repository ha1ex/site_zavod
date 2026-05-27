import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LandingSpecSchema } from '@buffalo/harness/schemas';
import { specToPuckData } from '@buffalo/harness/puck';
import { EditorClient } from './EditorClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function repoRoot(): string {
  return resolve(process.cwd(), '..', '..');
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `Edit · ${slug}` };
}

export default async function EditPage({ params }: PageProps) {
  const { slug } = await params;

  const path = resolve(repoRoot(), 'content', 'landings', `${slug}.json`);
  let raw: string;
  try {
    raw = await readFile(path, 'utf-8');
  } catch (err) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'ENOENT'
    ) {
      notFound();
    }
    throw err;
  }

  const spec = LandingSpecSchema.parse(JSON.parse(raw));
  const initialData = specToPuckData(spec);

  return (
    <main className="flex min-h-screen flex-col bg-(--color-surface-section)">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-(--color-border-default) bg-(--color-surface-page) px-6 py-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">
            Buffalo · редактор
          </p>
          <h1 className="text-base font-semibold">Editing: {slug}</h1>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href={`/landings/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-(--color-text-accent) hover:underline"
          >
            Preview ↗
          </Link>
          <Link
            href={`/approve/${slug}`}
            className="text-(--color-text-secondary) hover:underline"
          >
            Approve
          </Link>
          <Link href="/" className="text-(--color-text-secondary) hover:underline">
            ← Дашборд
          </Link>
        </nav>
      </header>

      <div className="flex-1 overflow-hidden">
        <EditorClient slug={slug} initialData={initialData} />
      </div>
    </main>
  );
}
