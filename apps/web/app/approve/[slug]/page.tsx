import { resolve } from 'node:path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import { LandingSpecSchema } from '@kaiten/harness/schemas';
import { isSafeSlug, readApproval } from '@kaiten/harness/approvals';
import { ApprovalForm } from './ApprovalForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function repoRoot(): string {
  return resolve(process.cwd(), '..', '..');
}

async function loadSpec(slug: string) {
  const path = resolve(repoRoot(), 'content', 'landings', `${slug}.json`);
  try {
    const raw = await readFile(path, 'utf-8');
    return LandingSpecSchema.parse(JSON.parse(raw));
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `Approve · ${slug}` };
}

export default async function ApprovePage({ params }: PageProps) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) notFound();
  const spec = await loadSpec(slug);
  if (!spec) notFound();
  const approval = await readApproval(repoRoot(), slug);

  return (
    <main className="min-h-screen bg-(--color-surface-section)">
      <header className="border-b border-(--color-border-default) bg-(--color-surface-page) px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">Approve · {slug}</p>
            <h1 className="text-xl font-semibold">{spec.seo.title}</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/edit/${slug}`}
              className="text-sm font-medium text-(--color-text-accent) hover:underline"
            >
              Открыть в редакторе
            </Link>
            <Link
              href={`/landings/${slug}`}
              className="text-sm underline text-(--color-text-accent)"
              target="_blank"
              rel="noreferrer"
            >
              Open preview ↗
            </Link>
            <Link href="/" className="text-sm text-(--color-text-secondary) hover:underline">
              ← Дашборд
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page)">
          <iframe
            src={`/landings/${slug}`}
            title={`Preview ${slug}`}
            className="h-[calc(100vh-220px)] w-full"
          />
        </section>

        <aside className="rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-5">
          <ApprovalForm slug={slug} initial={approval} />
        </aside>
      </div>
    </main>
  );
}
