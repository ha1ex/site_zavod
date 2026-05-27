import Link from 'next/link';
import { BriefForm } from './BriefForm';

export const metadata = {
  title: 'New landing · Buffalo',
};

export default function NewLandingPage() {
  return (
    <main className="min-h-screen bg-(--color-surface-section)">
      <header className="border-b border-(--color-border-default) bg-(--color-surface-page) px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">
              Buffalo · новый лендинг
            </p>
            <h1 className="text-xl font-semibold">Создать лендинг по brief</h1>
          </div>
          <Link
            href="/"
            className="text-sm text-(--color-text-secondary) hover:underline"
          >
            ← На главную
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-5 text-sm text-(--color-text-secondary)">
          <p className="mb-2">
            Заполните поля брифа — harness сам выберет pipeline (legacy / phased) и сгенерирует
            лендинг. Подробное описание полей —{' '}
            <a
              href="https://github.com/ha1ex/site_zavod/blob/main/wiki/marketing/brief-fields.md"
              target="_blank"
              rel="noreferrer"
              className="underline text-(--color-text-accent)"
            >
              wiki/marketing/brief-fields.md
            </a>
            .
          </p>
          <p>
            Для автоматической генерации нужен AI-провайдер: <code>ANTHROPIC_API_KEY</code> или{' '}
            <code>OPENAI_API_KEY</code> в <code>.env.local</code>. Без ключа — форма всё равно
            сохранит brief, и любой ассистент (Claude Code / Codex / Cursor) сможет дописать spec
            через <code>harness agent build landing</code>.
          </p>
        </div>

        <BriefForm />
      </div>
    </main>
  );
}
