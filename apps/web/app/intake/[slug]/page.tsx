import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isSafeSlug, readApproval } from '@kaiten/harness/approvals';
import { ApprovalForm } from '../../approve/[slug]/ApprovalForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function repoRoot(): string {
  return resolve(process.cwd(), '..', '..');
}

async function loadTz(slug: string): Promise<string | null> {
  const path = resolve(repoRoot(), 'content', 'briefs', `${slug}.tz.md`);
  try {
    return await readFile(path, 'utf-8');
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `ТЗ · ${slug}` };
}

/* ─── минимальный markdown → JSX (без зависимостей; React сам экранирует текст) ─── */

function renderInline(text: string, kp: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((tok, i) => {
    if (/^\*\*[^*]+\*\*$/.test(tok)) return <strong key={`${kp}-${i}`}>{tok.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(tok)) {
      return (
        <code key={`${kp}-${i}`} className="rounded bg-(--color-surface-section) px-1 py-0.5 text-[0.85em]">
          {tok.slice(1, -1)}
        </code>
      );
    }
    return tok ? <span key={`${kp}-${i}`}>{tok}</span> : null;
  });
}

function MarkdownView({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const isListLine = (l: string) => /^\s*[-*] /.test(l) || /^\s*\d+\. /.test(l);

  while (i < lines.length) {
    const line = lines[i] ?? '';

    if (line.startsWith('```')) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i]!.startsWith('```')) code.push(lines[i++]!);
      i++;
      blocks.push(
        <pre key={key++} className="overflow-x-auto rounded-(--radius-lg) bg-(--color-surface-section) p-3 text-xs">
          <code>{code.join('\n')}</code>
        </pre>,
      );
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push(<h3 key={key++} className="mt-4 text-sm font-semibold">{renderInline(line.slice(4), `h3${key}`)}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(<h2 key={key++} className="mt-6 border-b border-(--color-border-default) pb-1 text-base font-semibold">{renderInline(line.slice(3), `h2${key}`)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push(<h1 key={key++} className="text-xl font-semibold">{renderInline(line.slice(2), `h1${key}`)}</h1>);
      i++;
      continue;
    }
    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i]!.startsWith('> ')) quote.push(lines[i++]!.slice(2));
      blocks.push(
        <blockquote key={key++} className="border-l-2 border-(--color-action-primary) pl-3 text-sm text-(--color-text-secondary)">
          {renderInline(quote.join(' '), `bq${key}`)}
        </blockquote>,
      );
      continue;
    }
    if (isListLine(line)) {
      const ordered = /^\s*\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && isListLine(lines[i]!)) items.push(lines[i++]!.replace(/^\s*([-*]|\d+\.)\s+/, ''));
      const lis = items.map((it, idx) => <li key={idx}>{renderInline(it, `li${key}-${idx}`)}</li>);
      blocks.push(
        ordered ? (
          <ol key={key++} className="list-decimal space-y-1 pl-5 text-sm">{lis}</ol>
        ) : (
          <ul key={key++} className="list-disc space-y-1 pl-5 text-sm">{lis}</ul>
        ),
      );
      continue;
    }
    if (line.trim() === '') {
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i]!.trim() !== '' && !lines[i]!.startsWith('#') && !lines[i]!.startsWith('```') && !lines[i]!.startsWith('> ') && !isListLine(lines[i]!)) {
      para.push(lines[i++]!);
    }
    blocks.push(<p key={key++} className="text-sm leading-relaxed">{renderInline(para.join(' '), `p${key}`)}</p>);
  }

  return <div className="flex flex-col gap-2">{blocks}</div>;
}

export default async function IntakePage({ params }: PageProps) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) notFound();
  const tz = await loadTz(slug);
  if (tz === null) notFound();
  const approval = await readApproval(repoRoot(), slug, 'intake');

  return (
    <main className="min-h-screen bg-(--color-surface-section)">
      <header className="border-b border-(--color-border-default) bg-(--color-surface-page) px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">ТЗ (фабрика ТЗ) · {slug}</p>
            <h1 className="text-xl font-semibold">Ревью технического задания</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="text-sm text-(--color-text-secondary) hover:underline">
              ← Дашборд
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_360px]">
        <section className="max-h-[calc(100vh-160px)] overflow-y-auto rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-6">
          <MarkdownView source={tz} />
        </section>

        <aside className="rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-5">
          <p className="mb-3 text-sm text-(--color-text-secondary)">
            Согласуй ТЗ до сборки лендинга. После approve запусти{' '}
            <code className="text-xs">agent build</code>.
          </p>
          <ApprovalForm slug={slug} initial={approval} surface="intake" />
        </aside>
      </div>
    </main>
  );
}
