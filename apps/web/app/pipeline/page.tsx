import Link from 'next/link';
import type { PipelineDoc } from './_content';
import { KNOWLEDGE, STAGES } from './_content';

function FlowCard({ doc }: { doc: PipelineDoc }) {
  return (
    <Link
      href={`/pipeline/${doc.slug}`}
      className="group block rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-5 transition hover:border-(--color-action-primary)/50"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-action-primary) text-base font-semibold text-(--color-text-inverse)"
        >
          {doc.num}
        </span>
        <div>
          <h3 className="text-base font-semibold group-hover:text-(--color-text-accent)">
            {doc.title}
          </h3>
          <p className="mt-1 text-sm text-(--color-text-secondary)">{doc.short}</p>
        </div>
      </div>
    </Link>
  );
}

function Connector() {
  return <div aria-hidden className="mx-auto h-6 w-px bg-(--color-border-default)" />;
}

export default function PipelineOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-(--radius-2xl) border border-(--color-action-primary)/20 bg-(--color-action-primary-soft) p-6">
        <h2 className="text-lg font-semibold">Конвейер за 7 этапов превращает сырьё в лендинг</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-(--color-text-primary)">
          От заявки и материалов — к согласованной странице в стиле Kaiten. Этот раздел read-only:
          здесь описано, как устроен каждый этап — что он принимает на входе, что отдаёт на выходе,
          какие правила соблюдает и какими командами запускается. Кликните этап на схеме или в
          навигации.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-medium">Этапы конвейера</h2>
        <div className="mx-auto max-w-2xl">
          {STAGES.map((doc, i) => (
            <div key={doc.slug}>
              {i > 0 && <Connector />}
              <FlowCard doc={doc} />
            </div>
          ))}
          <p className="mt-3 text-center text-xs text-(--color-text-secondary)">
            Гейт домена (этап 2) может остановить конвейер: неизвестный или непокрытый домен →
            стоп и задача на создание mock-ов.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-medium">Правила и база знаний</h2>
        <p className="mb-4 text-sm text-(--color-text-secondary)">
          Действуют на всех этапах конвейера.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {KNOWLEDGE.map((doc) => (
            <Link
              key={doc.slug}
              href={`/pipeline/${doc.slug}`}
              className="group rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-5 transition hover:border-(--color-action-primary)/50"
            >
              <h3 className="text-base font-semibold group-hover:text-(--color-text-accent)">
                {doc.title}
              </h3>
              <p className="mt-1 text-sm text-(--color-text-secondary)">{doc.short}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
