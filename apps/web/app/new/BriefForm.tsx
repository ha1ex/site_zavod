'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';

interface BriefFormState {
  slug: string;
  product: string;
  audience: string;
  market: string;
  primaryGoal: PrimaryGoal;
  mainPain: string;
  mainPromise: string;
  proofPoints: string;
  tone: string;
  cta: string;
  pageArchetype: PageArchetype;
  pageLayout: PageLayout | '';
}

type PrimaryGoal = 'book_demo' | 'signup' | 'waitlist' | 'contact_sales' | 'try_free' | 'download';
type PageArchetype = 'saas' | 'waitlist' | 'enterprise';
type PageLayout =
  | 'enterprise-modular-saas'
  | 'single-module-deep-dive'
  | 'compliance-first-enterprise'
  | 'comparison-vs-competitor'
  | 'story-led-unaware'
  | 'depersonalized-product-tour'
  | 'crm-product-tour'
  | 'migration-from-competitor'
  | 'product-launch'
  | 'case-study-deep-dive';

const GOAL_OPTIONS: Array<{ value: PrimaryGoal; label: string }> = [
  { value: 'book_demo', label: 'Демо с продавцом' },
  { value: 'signup', label: 'Регистрация (PLG)' },
  { value: 'try_free', label: 'Free trial' },
  { value: 'contact_sales', label: 'Контакт с продажами' },
  { value: 'waitlist', label: 'Waitlist' },
  { value: 'download', label: 'Скачать' },
];

const ARCHETYPE_OPTIONS: Array<{ value: PageArchetype; label: string }> = [
  { value: 'saas', label: 'SaaS' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'waitlist', label: 'Waitlist / pre-launch' },
];

const LAYOUT_OPTIONS: Array<{ value: PageLayout; label: string; hint: string }> = [
  { value: 'enterprise-modular-saas', label: 'enterprise-modular-saas', hint: 'Платформа + модули' },
  { value: 'single-module-deep-dive', label: 'single-module-deep-dive', hint: 'Один модуль с tour' },
  { value: 'compliance-first-enterprise', label: 'compliance-first-enterprise', hint: 'Реестр ПО, госсектор' },
  { value: 'comparison-vs-competitor', label: 'comparison-vs-competitor', hint: 'vs Jira / Notion / etc.' },
  { value: 'story-led-unaware', label: 'story-led-unaware', hint: 'Холодная аудитория' },
  { value: 'depersonalized-product-tour', label: 'depersonalized-product-tour', hint: 'SMB SaaS, длинный tour' },
  { value: 'crm-product-tour', label: 'crm-product-tour', hint: 'CRM с tabs/scenarios' },
  { value: 'migration-from-competitor', label: 'migration-from-competitor', hint: 'План перехода' },
  { value: 'product-launch', label: 'product-launch', hint: 'Анонс нового продукта' },
  { value: 'case-study-deep-dive', label: 'case-study-deep-dive', hint: 'Один кейс на лендинг' },
];

const INITIAL: BriefFormState = {
  slug: '',
  product: '',
  audience: '',
  market: 'B2B SaaS',
  primaryGoal: 'book_demo',
  mainPain: '',
  mainPromise: '',
  proofPoints: '',
  tone: 'clear, professional, non-hype',
  cta: 'Получить демо',
  pageArchetype: 'saas',
  pageLayout: '',
};

type GenStatus = 'idle' | 'submitting' | 'streaming' | 'success' | 'error';

export function BriefForm() {
  const [form, setForm] = useState<BriefFormState>(INITIAL);
  const [status, setStatus] = useState<GenStatus>('idle');
  const [log, setLog] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [_pending, startTransition] = useTransition();
  const logRef = useRef<HTMLPreElement>(null);

  function appendLog(line: string) {
    setLog((prev) => prev + line);
    queueMicrotask(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  }

  function update<K extends keyof BriefFormState>(key: K, value: BriefFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildBrief() {
    const audience = form.audience
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const proofPoints = form.proofPoints
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      slug: form.slug.trim(),
      brief: {
        product: form.product.trim(),
        audience,
        market: form.market.trim(),
        primaryGoal: form.primaryGoal,
        mainPain: form.mainPain.trim(),
        mainPromise: form.mainPromise.trim(),
        proofPoints,
        tone: form.tone.trim(),
        cta: form.cta.trim(),
        pageArchetype: form.pageArchetype,
        pageLayout: form.pageLayout || undefined,
      },
    };
  }

  async function submit() {
    setError(null);
    setLog('');
    setStatus('submitting');

    if (!/^[a-z0-9][a-z0-9-]*$/i.test(form.slug.trim())) {
      setError('Slug должен быть в kebab-case (буквы, цифры, дефис). Пример: kaiten-crm');
      setStatus('error');
      return;
    }
    if (form.product.trim().length < 2) {
      setError('Поле "Продукт" обязательно (минимум 2 символа).');
      setStatus('error');
      return;
    }
    if (!buildBrief().brief.audience.length) {
      setError('Заполните хотя бы одну роль в поле "Аудитория".');
      setStatus('error');
      return;
    }

    startTransition(async () => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(buildBrief()),
      });

      if (!res.ok) {
        const body = await res.text();
        setError(`Запрос упал (${res.status}): ${body}`);
        setStatus('error');
        return;
      }

      if (!res.body) {
        setError('Сервер не вернул стрим');
        setStatus('error');
        return;
      }

      setStatus('streaming');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let endStatus: 'success' | 'error' = 'error';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIndex = buffer.indexOf('\n\n');
        while (nlIndex !== -1) {
          const frame = buffer.slice(0, nlIndex);
          buffer = buffer.slice(nlIndex + 2);
          nlIndex = buffer.indexOf('\n\n');

          for (const rawLine of frame.split('\n')) {
            const line = rawLine.trimStart();
            if (line.startsWith('event:')) {
              const ev = line.slice(6).trim();
              if (ev === 'done') endStatus = 'success';
              if (ev === 'error') endStatus = 'error';
            } else if (line.startsWith('data:')) {
              appendLog(line.slice(5).replace(/^ ?/, '') + '\n');
            }
          }
        }
      }

      setStatus(endStatus);
    });
  }

  const isBusy = status === 'submitting' || status === 'streaming';

  return (
    <>
      <form
        className="space-y-5 rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-6"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Field label="Slug (URL-имя лендинга)" hint="kebab-case, латиница и цифры. Будет /landings/<slug>">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            placeholder="например: kaiten-crm"
            className={inputCls}
            required
          />
        </Field>

        <Field label="Продукт" hint="Опишите продукт одним предложением, без hype">
          <input
            type="text"
            value={form.product}
            onChange={(e) => update('product', e.target.value)}
            placeholder="CRM-система для управления продажами и клиентами"
            className={inputCls}
            required
          />
        </Field>

        <Field label="Аудитория" hint="Через запятую, конкретные роли (не «все»)">
          <input
            type="text"
            value={form.audience}
            onChange={(e) => update('audience', e.target.value)}
            placeholder="менеджеры по продажам, руководители отдела"
            className={inputCls}
            required
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Рынок" hint="">
            <input
              type="text"
              value={form.market}
              onChange={(e) => update('market', e.target.value)}
              placeholder="B2B SaaS"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Главная цель" hint="">
            <select
              value={form.primaryGoal}
              onChange={(e) => update('primaryGoal', e.target.value as PrimaryGoal)}
              className={inputCls}
            >
              {GOAL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Главная боль" hint="Что мешает клиенту сейчас, конкретно">
          <textarea
            value={form.mainPain}
            onChange={(e) => update('mainPain', e.target.value)}
            rows={2}
            placeholder="Заявки теряются между почтой, мессенджерами и CRM"
            className={inputCls}
            required
          />
        </Field>

        <Field label="Главное обещание" hint="Что вы даёте, конкретно">
          <textarea
            value={form.mainPromise}
            onChange={(e) => update('mainPromise', e.target.value)}
            rows={2}
            placeholder="Все обращения в одной системе, автоматизация и контроль работы"
            className={inputCls}
            required
          />
        </Field>

        <Field
          label="Proof points"
          hint="Каждый с новой строки — числа, сертификаты, кейсы. ≥3 рекомендуется"
        >
          <textarea
            value={form.proofPoints}
            onChange={(e) => update('proofPoints', e.target.value)}
            rows={4}
            placeholder={'8+ каналов коммуникации\nРеестр отечественного ПО\n500+ корпоративных клиентов'}
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Тон" hint="">
            <input
              type="text"
              value={form.tone}
              onChange={(e) => update('tone', e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="CTA-текст" hint="Текст основной кнопки">
            <input
              type="text"
              value={form.cta}
              onChange={(e) => update('cta', e.target.value)}
              placeholder="Получить демо"
              className={inputCls}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Archetype" hint="">
            <select
              value={form.pageArchetype}
              onChange={(e) => update('pageArchetype', e.target.value as PageArchetype)}
              className={inputCls}
            >
              {ARCHETYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Layout (рекомендуется)" hint="Без layout — pipeline уйдёт в phased (дольше)">
            <select
              value={form.pageLayout}
              onChange={(e) => update('pageLayout', e.target.value as PageLayout | '')}
              className={inputCls}
            >
              <option value="">— не выбран —</option>
              {LAYOUT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} — {o.hint}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex items-center gap-3 border-t border-(--color-border-default) pt-5">
          <button
            type="submit"
            disabled={isBusy}
            className="rounded-(--radius-lg) bg-(--color-action-primary) px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {status === 'submitting'
              ? 'Отправляю…'
              : status === 'streaming'
                ? 'Генерирую…'
                : 'Сгенерировать лендинг'}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(INITIAL);
              setLog('');
              setError(null);
              setStatus('idle');
            }}
            disabled={isBusy}
            className="rounded-(--radius-lg) border border-(--color-border-default) px-4 py-2.5 text-sm text-(--color-text-secondary) hover:bg-(--color-surface-section) disabled:opacity-60"
          >
            Сбросить
          </button>
        </div>

        {error && (
          <p className="rounded-(--radius-lg) bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}
      </form>

      {(log || status !== 'idle') && (
        <div className="mt-6 rounded-(--radius-2xl) border border-(--color-border-default) bg-(--color-surface-page) p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Лог генерации</h2>
            <StatusBadge status={status} />
          </div>
          <pre
            ref={logRef}
            className="max-h-96 overflow-auto rounded-(--radius-lg) bg-(--color-surface-section) p-3 text-xs leading-relaxed text-(--color-text-primary)"
          >
            {log || 'Ждём первое событие…'}
          </pre>

          {status === 'success' && form.slug && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={`/landings/${form.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-(--radius-lg) bg-(--color-action-primary) px-4 py-2 text-sm font-medium text-white"
              >
                Открыть preview ↗
              </Link>
              <Link
                href={`/approve/${form.slug}`}
                className="rounded-(--radius-lg) border border-(--color-border-default) px-4 py-2 text-sm text-(--color-text-primary)"
              >
                Approve →
              </Link>
              <span className="text-xs text-(--color-text-secondary)">
                Лендинг сохранён: <code>content/landings/{form.slug}.json</code>
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const inputCls =
  'w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-page) px-3 py-2 text-sm focus:border-(--color-action-primary) focus:outline-none';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-(--color-text-primary)">{label}</span>
      {children}
      {hint && <span className="text-xs text-(--color-text-secondary)">{hint}</span>}
    </label>
  );
}

function StatusBadge({ status }: { status: GenStatus }) {
  const map: Record<GenStatus, { label: string; cls: string }> = {
    idle: { label: 'idle', cls: 'bg-slate-100 text-slate-700' },
    submitting: { label: 'отправляю', cls: 'bg-amber-100 text-amber-800' },
    streaming: { label: 'генерирую', cls: 'bg-blue-100 text-blue-800' },
    success: { label: 'готово', cls: 'bg-emerald-100 text-emerald-800' },
    error: { label: 'ошибка', cls: 'bg-rose-100 text-rose-700' },
  };
  const v = map[status];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${v.cls}`}>
      {v.label}
    </span>
  );
}
