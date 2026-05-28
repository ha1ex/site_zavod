import Link from 'next/link';

export const metadata = {
  title: 'Как создать лендинг · Buffalo',
};

const CLAUDE_PROMPT = `Сгенери лендинг через Buffalo harness. Slug = my-landing-slug.
ТЗ:

<вставь сюда текст ТЗ или путь к файлу>

Используй pnpm -w run harness agent build landing --slug my-landing-slug.
Если упадёт — поправь spec, прогон harness agent apply landing --slug my-landing-slug --brief content/briefs/my-landing-slug.json до зелёного.`;

const CODEX_PROMPT = `Сгенери лендинг slug=my-landing-slug по ТЗ (см. ниже).
Pipeline: harness agent build landing --slug my-landing-slug --brief content/briefs/my-landing-slug.json
Допускается ручная правка content/landings/my-landing-slug.json + harness agent apply.

ТЗ:

<вставь сюда текст ТЗ>`;

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex gap-5">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-action-primary-soft) text-base font-semibold text-(--color-text-accent)"
        aria-hidden
      >
        {num}
      </div>
      <div className="flex-1 space-y-2 pt-1">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <div className="space-y-2 text-sm text-(--color-text-secondary)">{children}</div>
      </div>
    </section>
  );
}

function PromptBlock({ id, title, body }: { id: string; title: string; body: string }) {
  return (
    <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-4">
      <header className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-sm font-medium">{title}</h4>
        <code className="text-[10px] uppercase tracking-wide text-(--color-text-secondary)">
          {id}
        </code>
      </header>
      <pre className="overflow-x-auto rounded-(--radius-lg) bg-(--color-surface-section) p-3 text-xs leading-relaxed">
        {body}
      </pre>
    </div>
  );
}

export default function NewLandingPage() {
  return (
    <main className="min-h-screen bg-(--color-surface-section)">
      <header className="border-b border-(--color-border-default) bg-(--color-surface-page) px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">
              Buffalo · как создать лендинг
            </p>
            <h1 className="text-xl font-semibold">Через чат claude / codex в терминале</h1>
          </div>
          <Link href="/" className="text-sm text-(--color-text-secondary) hover:underline">
            ← Дашборд
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-10 px-6 py-10">
        <div className="rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-5 text-sm text-(--color-text-secondary)">
          <p>
            Buffalo генерирует лендинги через локальные LLM-CLI (claude code, codex) — без API
            ключей. Чат в терминале — это <strong>командная панель</strong>, браузер — визуализатор
            с Inspector для точечных правок.
          </p>
        </div>

        <div className="space-y-7 rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-7">
          <Section num="1" title="Открой terminal с claude или codex">
            <p>
              В Conductor рядом с этим окном или в отдельном терминале. Любой ассистент: claude,
              codex, cursor.
            </p>
          </Section>

          <Section num="2" title="Кинь в чат ТЗ или путь к файлу">
            <p>Drag-drop файла или paste текста. Поддерживаются: .docx, .md, .txt, plain text.</p>
          </Section>

          <Section num="3" title="Попроси сгенерить — используй готовый промпт">
            <PromptBlock id="claude code" title="Шаблон для claude" body={CLAUDE_PROMPT} />
            <PromptBlock id="codex / openai" title="Шаблон для codex" body={CODEX_PROMPT} />
            <p className="text-xs">
              Замени <code>my-landing-slug</code> на свой kebab-case slug (например{' '}
              <code>kaiten-crm-q4</code>).
            </p>
          </Section>

          <Section num="4" title="Дождись — pipeline идёт 1-3 минуты">
            <p>
              Чат пишет brief в <code>content/briefs/&lt;slug&gt;.json</code>, генерит spec в{' '}
              <code>content/landings/&lt;slug&gt;.json</code>, рендерит TSX. Если упало на
              валидации — claude сам прочитает ошибку и попробует исправить.
            </p>
          </Section>

          <Section num="5" title="Открой preview и доработай через Inspector">
            <p>
              Лендинг появится в списке на{' '}
              <Link href="/" className="underline text-(--color-text-accent)">
                дашборде
              </Link>
              . Открой <code>preview</code> → справа внизу нажми <strong>Inspector ON</strong>.
              Hover на любой микроэлемент (заголовок, кнопку, отдельный пункт списка) → клик копирует
              готовый промпт для чата. Вставь в свой claude / codex → попроси поправить → F5.
            </p>
            <p>
              Когда всё нравится — на дашборде жмёшь <code>handoff ↓</code> → скачивается ZIP для
              разработчика.
            </p>
          </Section>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/catalog"
            className="group rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-4 transition hover:border-(--color-action-primary)/50"
          >
            <p className="text-sm font-medium">Каталог блоков →</p>
            <p className="mt-1 text-xs text-(--color-text-secondary)">
              Посмотреть все 22 секции и 39 моков. Inspector работает тут тоже.
            </p>
          </Link>
          <Link
            href="/landings/crm"
            target="_blank"
            rel="noreferrer"
            className="group rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-4 transition hover:border-(--color-action-primary)/50"
          >
            <p className="text-sm font-medium">Пример готового лендинга ↗</p>
            <p className="mt-1 text-xs text-(--color-text-secondary)">
              crm — сгенерирован через harness, можно крутить Inspector.
            </p>
          </Link>
        </div>

        <footer className="border-t border-(--color-border-default) pt-5 text-xs text-(--color-text-secondary)">
          <p>
            Если CLI ассистента не установлен, есть fallback через API ключ
            (<code>ANTHROPIC_API_KEY</code> или <code>OPENAI_API_KEY</code> в{' '}
            <code>.env.local</code>) — обычная веб-форма генерации доступна через прямой POST на{' '}
            <code>/api/generate</code>. Для регулярной работы — оставайся в чат-flow.
          </p>
        </footer>
      </div>
    </main>
  );
}
