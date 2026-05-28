import Link from 'next/link';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export const dynamic = 'force-dynamic';

async function listLandings(): Promise<string[]> {
  const dir = resolve(process.cwd(), '..', '..', 'content', 'landings');
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
      .sort();
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const landings = await listLandings();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">Buffalo</p>
        <h1 className="text-3xl font-semibold tracking-tight">LLM harness для лендингов</h1>
        <p className="mt-2 text-base text-(--color-text-secondary)">
          Маркетинг создаёт brief → harness собирает Kaiten-стайл лендинг → команда фронта мержит TSX.
        </p>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/new"
          className="group rounded-(--radius-2xl) border border-(--color-action-primary)/30 bg-(--color-action-primary-soft) p-6 transition hover:border-(--color-action-primary)"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-(--color-text-accent)">
                Как создать лендинг
              </h2>
              <p className="mt-1 text-sm text-(--color-text-secondary)">
                Открой claude / codex в терминале → кинь ТЗ → попроси сгенерить.
                Инструкция и готовые шаблоны промптов.
              </p>
            </div>
            <span aria-hidden className="text-2xl text-(--color-text-accent)">
              →
            </span>
          </div>
        </Link>

        <Link
          href="/catalog"
          className="group rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-6 transition hover:border-(--color-action-primary)/50"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Каталог блоков</h2>
              <p className="mt-1 text-sm text-(--color-text-secondary)">
                22 секции + 39 моков с живыми примерами. Всё прямо в браузере, без запуска
                Storybook.
              </p>
            </div>
            <span aria-hidden className="text-2xl">
              →
            </span>
          </div>
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-medium">Существующие лендинги</h2>
          <span className="text-xs text-(--color-text-secondary)">{landings.length} шт.</span>
        </div>
        {landings.length === 0 ? (
          <p className="text-sm text-(--color-text-secondary)">
            Пока нет. Начните с <Link href="/new" className="underline">/new</Link>.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {landings.map((slug) => (
              <li
                key={slug}
                className="flex items-center justify-between rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) px-4 py-3"
              >
                <code className="text-sm font-medium">{slug}</code>
                <div className="flex gap-3 text-sm">
                  <Link
                    href={`/landings/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-(--color-text-accent) hover:underline"
                  >
                    preview
                  </Link>
                  <Link
                    href={`/edit/${slug}`}
                    className="text-(--color-text-secondary) hover:underline"
                  >
                    edit
                  </Link>
                  <Link
                    href={`/approve/${slug}`}
                    className="text-(--color-text-secondary) hover:underline"
                  >
                    approve
                  </Link>
                  <a
                    href={`/api/handoff/${slug}`}
                    download={`landing-${slug}.zip`}
                    className="text-emerald-700 hover:underline"
                    title="Скачать ZIP-архив для разработчика"
                  >
                    handoff ↓
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-12 border-t border-(--color-border-default) pt-6 text-xs text-(--color-text-secondary)">
        <p>
          Документация для маркетинга — <code>wiki/marketing/getting-started.md</code> · Полная
          техническая — <code>README.md</code>.
        </p>
      </footer>
    </main>
  );
}
