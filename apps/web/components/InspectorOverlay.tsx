'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * InspectorOverlay — «hover → copy context» для preview лендинга.
 *
 * - hover на элемент с `data-comp` подсвечивает зелёной обводкой;
 * - клик копирует в буфер обмена prompt-сниппет для chat claude/codex;
 * - Esc выключает inspector;
 * - toggle в правом нижнем углу включает/выключает (default OFF).
 *
 * Поддерживает fallback copy через document.execCommand если clipboard API заблокирован.
 */

interface Props {
  slug: string;
  children: ReactNode;
}

interface HoverState {
  rect: DOMRect;
  path: string;
  text: string | null;
}

/**
 * Маппинг sectionId (literal из LandingSpecSchema) → имя компонента
 * в @buffalo/ui/landing. Нужно для catalog-mode копирования (путь до .tsx-файла).
 */
const SECTION_TO_COMPONENT: Record<string, string> = {
  hero: 'HeroSection',
  features: 'FeatureGrid',
  pricing: 'PricingPlans',
  faq: 'FAQAccordion',
  final_cta: 'FinalCta',
  footer: 'LandingFooter',
  social_proof: 'SocialProof',
  process: 'ProcessSteps',
  cta_banner: 'CtaBanner',
  media_copy: 'MediaCopy',
  stats: 'StatStrip',
  promo_banner: 'PromoBanner',
  benefits_strip: 'BenefitsStrip',
  metrics_split: 'MetricsSplit',
  tabbed_feature: 'TabbedFeatureSection',
  scenario_walkthrough: 'ScenarioWalkthroughSection',
  industry_picker: 'IndustryPickerSection',
  comparison_table: 'ComparisonTable',
  timeline_roadmap: 'TimelineRoadmap',
  bento_grid: 'BentoGrid',
  logo_cloud: 'LogoCloud',
  testimonial_quote: 'TestimonialQuote',
};

function getSectionIdFromPath(path: string): string {
  // 'hero.title' → 'hero'; 'media_copy.checklist[2].text' → 'media_copy'
  const dotIdx = path.indexOf('.');
  const bracketIdx = path.indexOf('[');
  if (dotIdx === -1 && bracketIdx === -1) return path;
  if (dotIdx === -1) return path.slice(0, bracketIdx);
  if (bracketIdx === -1) return path.slice(0, dotIdx);
  return path.slice(0, Math.min(dotIdx, bracketIdx));
}

interface BuildPathResult {
  path: string;
  sectionIndex: number | null;
}

function buildPath(el: Element): BuildPathResult | null {
  // 1) Если есть data-comp с точкой — это самодостаточный микро-path
  //    (например `hero.title`, `features.items[2].title`).
  //    Идём вверх до wrapper'а чтобы получить sectionIndex для disambiguation.
  let current: Element | null = el;
  let microPath: string | null = null;
  let sectionIndex: number | null = null;

  while (current) {
    if (current instanceof HTMLElement) {
      const comp = current.dataset.comp;
      if (comp) {
        if (!microPath && comp.includes('.')) {
          microPath = comp;
        }
        // Wrapper-level (RenderLanding) кладёт data-comp-index
        if (current.dataset.compIndex !== undefined) {
          const parsed = parseInt(current.dataset.compIndex, 10);
          if (!Number.isNaN(parsed)) sectionIndex = parsed;
        }
      }
    }
    current = current.parentElement;
  }

  if (microPath) return { path: microPath, sectionIndex };

  // 2) Fallback на wrapper-level (legacy compatibility c M11).
  const wrapper = el.closest<HTMLElement>('[data-comp]');
  if (!wrapper) return null;
  return { path: wrapper.dataset.comp ?? '', sectionIndex };
}

function buildCopyPayload(
  slug: string,
  path: string,
  text: string | null,
  sectionIndex: number | null,
): string {
  const sectionId = getSectionIdFromPath(path);
  const componentName = SECTION_TO_COMPONENT[sectionId] ?? sectionId;

  // Каталог: путь до .tsx-файла, а не до JSON
  if (slug === '__catalog__') {
    const lines = [
      'КАТАЛОГ БЛОКОВ — это вёрстка компонента',
      `Путь: ${path}`,
      `Файл: packages/ui/src/landing/${componentName}.tsx`,
    ];
    if (text) lines.push('', `Текущий текст: """${text.trim().slice(0, 400)}"""`);
    lines.push(
      '',
      'ВАЖНО: изменения в этом файле затронут ВСЕ лендинги, где используется компонент.',
      'Если правка для одного лендинга — открой /landings/<slug>, наведи на тот же путь и копируй оттуда.',
      '',
      'Что сделать:',
      `1. Открой packages/ui/src/landing/${componentName}.tsx`,
      `2. Найди поле по пути выше (после точки/индексов)`,
      `3. Поправь вёрстку`,
      `4. F5 на любом лендинге проверь — изменение применится автоматически (HMR)`,
    );
    return lines.join('\n');
  }

  // Обычный лендинг: путь в JSON spec
  const sectionRef =
    sectionIndex !== null
      ? `sections[${sectionIndex}] (id: "${sectionId}")`
      : `секцию с id: "${sectionId}"`;

  const lines = [
    `Лендинг: ${slug}`,
    `Путь: ${path}`,
    `Файл: content/landings/${slug}.json`,
    `Секция: ${sectionRef}`,
  ];
  if (text) lines.push('', `Текущий текст: """${text.trim().slice(0, 400)}"""`);
  lines.push(
    '',
    'Что сделать:',
    `1. Открой content/landings/${slug}.json`,
    `2. Найди ${sectionRef} → props.<поле из пути>`,
    `3. Поправь значение`,
    `4. F5 на http://localhost:3000/landings/${slug} (опционально pnpm -w run harness agent apply landing --slug ${slug} --brief content/briefs/${slug}.json для полной валидации)`,
  );
  return lines.join('\n');
}

async function copyToClipboard(text: string): Promise<{ ok: boolean; via: string }> {
  // 1. Modern API (требует HTTPS или localhost + focus)
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true, via: 'clipboard-api' };
    } catch {
      // fall through to fallback
    }
  }
  // 2. Legacy execCommand fallback
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return { ok, via: 'execCommand' };
  } catch {
    return { ok: false, via: 'none' };
  }
}

export function InspectorOverlay({ slug, children }: Props) {
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fallbackText, setFallbackText] = useState<string | null>(null);
  const [taggedCount, setTaggedCount] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

  // Подсчёт data-comp при включении (для пользователя — видеть «работает ли вообще»)
  useEffect(() => {
    if (!active) return;
    const count = document.querySelectorAll('[data-comp]').length;
    setTaggedCount(count);
    // eslint-disable-next-line no-console
    console.info(
      `[Inspector] активен. Найдено элементов с data-comp: ${count}. Hover на блок → подсветка. Клик → copy.`,
    );
  }, [active]);

  useEffect(() => {
    if (!active) {
      setHover(null);
      return;
    }

    function onMouseMove(e: MouseEvent) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el) {
          setHover(null);
          return;
        }
        const tagged = el.closest<HTMLElement>('[data-comp]');
        if (!tagged || tagged.closest('[data-inspector]')) {
          setHover(null);
          return;
        }
        const built = buildPath(tagged);
        if (!built) {
          setHover(null);
          return;
        }
        const rect = tagged.getBoundingClientRect();
        const text = tagged.innerText?.trim().slice(0, 400) || null;
        setHover({ rect, path: built.path, text });
      });
    }

    function onClick(e: MouseEvent) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const tagged = el.closest<HTMLElement>('[data-comp]');
      if (!tagged || tagged.closest('[data-inspector]')) return;
      const built = buildPath(tagged);
      if (!built) return;
      e.preventDefault();
      e.stopPropagation();
      const text = tagged.innerText?.trim() || null;
      const payload = buildCopyPayload(slug, built.path, text, built.sectionIndex);
      // eslint-disable-next-line no-console
      console.info('[Inspector] click → копирую путь:', built.path);

      void copyToClipboard(payload).then((res) => {
        if (res.ok) {
          setToast(`✓ Скопировано через ${res.via}: ${built.path}`);
          setTimeout(() => setToast(null), 3000);
        } else {
          // eslint-disable-next-line no-console
          console.warn('[Inspector] clipboard заблокирован, открываю модал для ручного копирования');
          setFallbackText(payload);
        }
      });
    }

    function onScroll() {
      setHover(null);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (fallbackText) {
          setFallbackText(null);
        } else {
          setActive(false);
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('keydown', onKey);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, slug, fallbackText]);

  return (
    <>
      {children}

      {active && hover && (
        <>
          <div
            data-inspector="outline"
            style={{
              position: 'fixed',
              left: hover.rect.left - 3,
              top: hover.rect.top - 3,
              width: hover.rect.width + 6,
              height: hover.rect.height + 6,
              border: '3px solid #10b981',
              borderRadius: 8,
              boxShadow: '0 0 0 4px rgba(16,185,129,0.15)',
              pointerEvents: 'none',
              zIndex: 9990,
            }}
          />
          <div
            data-inspector="label"
            style={{
              position: 'fixed',
              left: hover.rect.left,
              top: Math.max(8, hover.rect.top - 32),
              background: '#10b981',
              color: 'white',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              padding: '4px 10px',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              pointerEvents: 'none',
              maxWidth: '70vw',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              zIndex: 9991,
            }}
          >
            {hover.path}
          </div>
        </>
      )}

      {toast && (
        <div
          data-inspector="toast"
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#10b981',
            color: 'white',
            fontSize: 14,
            fontWeight: 500,
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 9999,
          }}
        >
          {toast}
        </div>
      )}

      <button
        data-inspector="toggle"
        type="button"
        onClick={() => setActive((v) => !v)}
        title={
          active
            ? 'Inspector ON — клик по блоку копирует промпт. Esc — выкл.'
            : 'Включить Inspector: hover на блок → подсветка → клик копирует контекст для CLI'
        }
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: active ? '#10b981' : '#1e293b',
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
          padding: '12px 18px',
          borderRadius: 999,
          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
          zIndex: 9998,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: active ? '#a7f3d0' : '#94a3b8',
            boxShadow: active ? '0 0 8px #a7f3d0' : 'none',
          }}
        />
        Inspector {active ? `ON · ${taggedCount} блоков` : 'OFF'}
      </button>

      {active && (
        <div
          data-inspector="hint"
          style={{
            position: 'fixed',
            bottom: 72,
            right: 16,
            background: '#0f172a',
            color: 'white',
            fontSize: 12,
            padding: '10px 14px',
            borderRadius: 8,
            maxWidth: 320,
            lineHeight: 1.4,
            zIndex: 9998,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          Hover на любой из {taggedCount} блоков → зелёная подсветка. Клик копирует
          контекст в буфер для chat claude/codex. Esc — выкл.
        </div>
      )}

      {fallbackText && (
        <div
          data-inspector="fallback-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 20,
              maxWidth: 720,
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <strong style={{ fontSize: 15 }}>Скопируй текст вручную</strong>
              <button
                type="button"
                onClick={() => setFallbackText(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: 18,
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              Браузер заблокировал автоматическое копирование. Выдели Cmd+A → скопируй Cmd+C →
              вставь в чат claude/codex.
            </p>
            <textarea
              readOnly
              value={fallbackText}
              autoFocus
              onFocus={(e) => e.currentTarget.select()}
              style={{
                width: '100%',
                minHeight: 240,
                fontSize: 12,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                padding: 12,
                border: '1px solid #cbd5e1',
                borderRadius: 6,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
