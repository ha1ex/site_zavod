import Link from 'next/link';
import { CopyButton } from './CopyButton';

export const metadata = {
  title: 'Как создать лендинг · Buffalo',
};

const CLAUDE_PROMPT = `Сгенери лендинг через Buffalo harness. Slug = my-landing-slug.

ТЗ:
<вставь сюда текст ТЗ или путь к файлу>

Используй: pnpm -w run harness agent build landing --slug my-landing-slug
Если упадёт — поправь spec, прогон harness agent apply landing --slug my-landing-slug --brief content/briefs/my-landing-slug.json до зелёного.`;

const CODEX_PROMPT = `Сгенери лендинг slug=my-landing-slug по ТЗ ниже.

Pipeline:
harness agent build landing --slug my-landing-slug --brief content/briefs/my-landing-slug.json

Допускается ручная правка content/landings/my-landing-slug.json + harness agent apply.

ТЗ:
<вставь сюда текст ТЗ>`;

interface SectionProps {
  num: string;
  title: string;
  isLast?: boolean;
  children: React.ReactNode;
}

function Section({ num, title, isLast, children }: SectionProps) {
  return (
    <section className="relative flex gap-5 pb-7">
      {/* spine line */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-(--color-border-default)"
        />
      )}

      <div
        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-action-primary) text-base font-semibold text-(--color-text-inverse) shadow-sm"
        aria-hidden
      >
        {num}
      </div>
      <div className="flex-1 space-y-3 pt-1.5">
        <h3 className="text-lg font-semibold leading-tight text-(--color-text-primary)">
          {title}
        </h3>
        <div className="space-y-3 text-sm leading-relaxed text-(--color-text-secondary)">
          {children}
        </div>
      </div>
    </section>
  );
}

interface PromptBlockProps {
  badge: string;
  title: string;
  body: string;
}

function PromptBlock({ badge, title, body }: PromptBlockProps) {
  return (
    <div className="overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page)">
      <header className="flex items-center justify-between gap-3 border-b border-(--color-border-default) bg-(--color-surface-section) px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-(--color-action-primary-soft) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--color-text-accent)">
            {badge}
          </span>
          <h4 className="text-sm font-medium text-(--color-text-primary)">{title}</h4>
        </div>
        <CopyButton text={body} />
      </header>
      <pre
        className="overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed text-(--color-text-primary)"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
      >
        {body}
      </pre>
    </div>
  );
}

export default function NewLandingPage() {
  return (
    <main className="min-h-screen bg-(--color-surface-section)">
      <header className="border-b border-(--color-border-default) bg-(--color-surface-page) px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">
              Buffalo · как создать лендинг
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Через чат claude / codex в терминале
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-(--radius-lg) border border-(--color-border-default) px-3 py-1.5 text-sm text-(--color-text-secondary) hover:bg-(--color-surface-section)"
          >
            ← Дашборд
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        {/* Intro card with violet accent */}
        <div className="rounded-(--radius-2xl) border border-(--color-action-primary)/20 bg-(--color-action-primary-soft) p-5">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-action-primary) text-base text-(--color-text-inverse)"
            >
              💡
            </span>
            <p className="text-sm leading-relaxed text-(--color-text-primary)">
              Buffalo генерирует лендинги через локальные LLM-CLI (<strong>claude code</strong>,{' '}
              <strong>codex</strong>) — без API ключей.
              <br />
              Чат в терминале — это <strong>командная панель</strong>, браузер — визуализатор с
              Inspector для точечных правок.
            </p>
          </div>
        </div>

        {/* Steps card */}
        <div className="rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-7">
          <Section num="1" title="Открой terminal с claude или codex">
            <p>
              В Conductor рядом с этим окном или в отдельном терминале. Любой ассистент:{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                claude
              </code>
              ,{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                codex
              </code>
              ,{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                cursor
              </code>
              .
            </p>
          </Section>

          <Section num="2" title="Кинь в чат ТЗ или путь к файлу">
            <p>
              Drag-drop файла или paste текста. Поддерживаются:{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                .docx
              </code>{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                .md
              </code>{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                .txt
              </code>{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                plain text
              </code>
              .
            </p>
          </Section>

          <Section num="3" title="Попроси сгенерить — используй готовый промпт">
            <PromptBlock badge="claude" title="Шаблон для claude code" body={CLAUDE_PROMPT} />
            <PromptBlock badge="codex" title="Шаблон для codex / OpenAI" body={CODEX_PROMPT} />
            <p className="text-xs text-(--color-text-secondary)">
              Замени{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                my-landing-slug
              </code>{' '}
              на свой kebab-case slug (например{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                kaiten-crm-q4
              </code>
              ).
            </p>
          </Section>

          <Section num="4" title="Дождись — pipeline идёт 1-3 минуты">
            <p>
              Чат пишет brief в{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                content/briefs/&lt;slug&gt;.json
              </code>
              , генерит spec в{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                content/landings/&lt;slug&gt;.json
              </code>
              , рендерит TSX.
            </p>
            <p>
              Если упало на валидации — claude сам прочитает ошибку и попробует исправить.
            </p>
          </Section>

          <Section num="5" title="Открой preview и доработай через Inspector" isLast>
            <p>
              Лендинг появится в списке на{' '}
              <Link
                href="/"
                className="font-medium text-(--color-text-accent) underline decoration-(--color-action-primary)/30 underline-offset-2 hover:decoration-(--color-action-primary)"
              >
                дашборде
              </Link>
              . Открой{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                preview
              </code>{' '}
              → справа внизу нажми{' '}
              <strong className="text-(--color-text-primary)">Inspector ON</strong>. Hover на
              любой микроэлемент → клик копирует готовый промпт для чата. Вставь в claude / codex →
              попроси поправить → F5.
            </p>
            <p>
              Когда всё нравится — на дашборде жмёшь{' '}
              <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[11px]">
                handoff ↓
              </code>{' '}
              → скачивается ZIP для разработчика.
            </p>
          </Section>
        </div>

        {/* Side links */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/catalog"
            className="group rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-5 transition hover:-translate-y-0.5 hover:border-(--color-action-primary)/40 hover:shadow-sm"
          >
            <p className="text-sm font-semibold text-(--color-text-primary) group-hover:text-(--color-text-accent)">
              Каталог блоков →
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-(--color-text-secondary)">
              Посмотреть все 22 секции и 39 моков. Inspector работает тут тоже.
            </p>
          </Link>
          <Link
            href="/landings/crm"
            target="_blank"
            rel="noreferrer"
            className="group rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page) p-5 transition hover:-translate-y-0.5 hover:border-(--color-action-primary)/40 hover:shadow-sm"
          >
            <p className="text-sm font-semibold text-(--color-text-primary) group-hover:text-(--color-text-accent)">
              Пример готового лендинга ↗
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-(--color-text-secondary)">
              crm — сгенерирован через harness, можно крутить Inspector.
            </p>
          </Link>
        </div>

        {/* Footer note */}
        <div className="rounded-(--radius-xl) border border-(--color-border-default)/60 bg-(--color-surface-page)/60 p-4 text-xs leading-relaxed text-(--color-text-secondary)">
          <p>
            <strong className="text-(--color-text-primary)">Без CLI?</strong> Есть fallback через
            API ключ (
            <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[10px]">
              ANTHROPIC_API_KEY
            </code>{' '}
            или{' '}
            <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[10px]">
              OPENAI_API_KEY
            </code>{' '}
            в{' '}
            <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[10px]">
              .env.local
            </code>
            ) — POST на{' '}
            <code className="rounded bg-(--color-surface-section) px-1.5 py-0.5 font-mono text-[10px]">
              /api/generate
            </code>
            . Для регулярной работы — оставайся в чат-flow.
          </p>
        </div>
      </div>
    </main>
  );
}
