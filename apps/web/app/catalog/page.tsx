import Link from 'next/link';
import { SECTION_EXAMPLES } from './sectionExamples';
import { MockCatalog } from './MockCatalog';
import { InspectorOverlay } from '../../components/InspectorOverlay';

export const metadata = {
  title: 'Каталог блоков · Buffalo',
};

export default function CatalogPage() {
  return (
    <InspectorOverlay slug="__catalog__">
      <CatalogContent />
    </InspectorOverlay>
  );
}

function CatalogContent() {
  return (
    <main className="min-h-screen bg-(--color-surface-section)">
      <header className="sticky top-0 z-10 border-b border-(--color-border-default) bg-(--color-surface-page)/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-(--color-text-secondary)">
              Buffalo · каталог
            </p>
            <h1 className="text-xl font-semibold">22 секции + 39 моков</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#sections" className="text-(--color-text-secondary) hover:underline">
              Секции
            </a>
            <a href="#mocks" className="text-(--color-text-secondary) hover:underline">
              Mocks
            </a>
            <Link
              href="/new"
              className="rounded-(--radius-lg) bg-(--color-action-primary) px-3 py-1.5 text-xs font-medium text-white"
            >
              Создать лендинг →
            </Link>
            <Link href="/" className="text-(--color-text-secondary) hover:underline">
              ← Дашборд
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-6 py-8">
        <section className="rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-5 text-sm text-(--color-text-secondary)">
          <p>
            Все блоки harness'а с живыми примерами. Используется LLM при генерации
            (видит этот же набор через registry) и маркетингом при доработке через{' '}
            <Link href="/edit/crm" className="underline text-(--color-text-accent)">
              Puck-редактор
            </Link>
            . Cross-domain reuse моков блокируется валидаторами (мок из домена «Поддержка»
            нельзя поставить в CRM-лендинг и т.д.).
          </p>
        </section>

        <section id="sections" className="space-y-8">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold">Секции лендинга ({SECTION_EXAMPLES.length})</h2>
            <p className="text-sm text-(--color-text-secondary)">
              Базовые компоненты, из которых harness собирает страницу. Каждый имеет жёсткую
              Zod-схему (см. <code>packages/harness/src/schemas/landing-spec.ts</code>).
            </p>
          </header>

          <div className="space-y-12">
            {SECTION_EXAMPLES.map((ex) => (
              <article
                key={ex.name}
                className="rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page)"
              >
                <header className="flex items-baseline justify-between gap-3 border-b border-(--color-border-default) bg-(--color-surface-section) px-5 py-3">
                  <div>
                    <code className="text-base font-semibold text-(--color-text-accent)">
                      {ex.name}
                    </code>
                    <span className="ml-3 text-xs uppercase tracking-wide text-(--color-text-secondary)">
                      {ex.category}
                    </span>
                  </div>
                  <p className="hidden text-sm text-(--color-text-secondary) md:block">
                    {ex.description}
                  </p>
                </header>
                <div className="p-2 md:p-4">
                  <div className="overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-page)">
                    {ex.element}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="mocks" className="space-y-6">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold">Mock-варианты (39)</h2>
            <p className="text-sm text-(--color-text-secondary)">
              Доменно-специфичные mock-компоненты для слотов{' '}
              <code>visual.variant</code> (HeroSection), <code>mediaVariant</code>{' '}
              (MediaCopy), <code>tabs[].mockVariant</code>, <code>steps[].mockVariant</code>.
              Сгруппированы по 9 доменам.
            </p>
          </header>
          <MockCatalog />
        </section>
      </div>
    </main>
  );
}
