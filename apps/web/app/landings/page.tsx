import Link from 'next/link';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

async function listLandings(): Promise<string[]> {
  const root = resolve(process.cwd(), '..', '..');
  const dir = resolve(root, 'content', 'landings');
  try {
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}

export default async function LandingsIndexPage() {
  const slugs = await listLandings();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Черновики лендингов</h1>
      <p className="mt-3 text-(--color-text-secondary)">
        Спеки из <code>content/landings/</code>. На этапе 2 сюда же придут LLM-генерации.
      </p>

      {slugs.length === 0 ? (
        <div className="mt-10 rounded-(--radius-2xl) border border-(--color-border-default) p-6 text-(--color-text-secondary)">
          Нет черновиков. Положите spec в <code>content/landings/&lt;slug&gt;.json</code>.
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {slugs.map((slug) => (
            <li key={slug}>
              <Link
                href={`/landings/${slug}`}
                className="block rounded-(--radius-xl) border border-(--color-border-default) px-4 py-3 hover:bg-(--color-surface-section)"
              >
                <span className="font-medium">{slug}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
