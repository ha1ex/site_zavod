'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * InspectorOverlay — «hover → copy context» для preview лендинга.
 *
 * Адаптация публичной фичи (см. .context/attachments/oOwAQU/) под Buffalo:
 * - hover на элемент с `data-comp` подсвечивает его зелёной обводкой;
 * - клик копирует в буфер обмена готовый prompt-сниппет для claude/codex
 *   (путь до секции в LandingSpec + текущее значение если есть + команда apply);
 * - Esc выключает inspector;
 * - toggle в правом нижнем углу включает/выключает (default off).
 *
 * Рассчитан на `/landings/[slug]` (read-only preview). В `/edit/[slug]` Puck
 * сам перехватывает клики — там Inspector конфликтует, использовать не нужно.
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

function readDataPath(el: Element): { comp: string; key?: string } | null {
  const tagged = el.closest<HTMLElement>('[data-comp]');
  if (!tagged) return null;
  if (tagged.closest('[data-inspector]')) return null;
  const comp = tagged.dataset.comp;
  if (!comp) return null;
  const key = tagged.dataset.compKey;
  return { comp, key };
}

function buildPath(el: Element): string | null {
  const chain: string[] = [];
  let current: Element | null = el;
  while (current) {
    if (current instanceof HTMLElement && current.dataset.comp) {
      const comp = current.dataset.comp;
      const key = current.dataset.compKey;
      chain.unshift(key ? `${comp}[${key}]` : comp);
    }
    current = current.parentElement;
  }
  return chain.length ? chain.join(' > ') : null;
}

function buildCopyPayload(slug: string, path: string, text: string | null): string {
  const lines = [
    `Лендинг: ${slug}`,
    `Путь: ${path}`,
    `Файл: content/landings/${slug}.json`,
  ];
  if (text) lines.push('', `Текущий текст: """${text.trim().slice(0, 240)}"""`);
  lines.push(
    '',
    'Что сделать:',
    `1. Открой content/landings/${slug}.json`,
    `2. Найди секцию по пути выше (sections[N] по component из пути)`,
    `3. Поправь нужное поле`,
    `4. Запусти: pnpm -w run harness agent apply landing --slug ${slug} --brief content/briefs/${slug}.json`,
    `5. Открой http://localhost:3000/landings/${slug} проверить результат`,
  );
  return lines.join('\n');
}

export function InspectorOverlay({ slug, children }: Props) {
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

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
        const path = buildPath(tagged);
        if (!path) {
          setHover(null);
          return;
        }
        const rect = tagged.getBoundingClientRect();
        const text = tagged.innerText?.trim().slice(0, 200) || null;
        setHover({ rect, path, text });
      });
    }

    function onClick(e: MouseEvent) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const tagged = el.closest<HTMLElement>('[data-comp]');
      if (!tagged || tagged.closest('[data-inspector]')) return;
      const path = buildPath(tagged);
      if (!path) return;
      e.preventDefault();
      e.stopPropagation();
      const text = tagged.innerText?.trim() || null;
      const payload = buildCopyPayload(slug, path, text);
      navigator.clipboard
        .writeText(payload)
        .then(() => {
          setToast(`✓ Скопировано: ${path}`);
          setTimeout(() => setToast(null), 2400);
        })
        .catch(() => {
          setToast('✗ Не удалось скопировать (нет доступа к clipboard)');
          setTimeout(() => setToast(null), 2400);
        });
    }

    function onScroll() {
      setHover(null);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(false);
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
  }, [active, slug]);

  return (
    <>
      {children}

      {active && hover && (
        <>
          <div
            data-inspector="outline"
            style={{
              position: 'fixed',
              left: hover.rect.left - 2,
              top: hover.rect.top - 2,
              width: hover.rect.width + 4,
              height: hover.rect.height + 4,
              border: '2px solid #10b981',
              borderRadius: 6,
              pointerEvents: 'none',
              zIndex: 110,
            }}
          />
          <div
            data-inspector="label"
            style={{
              position: 'fixed',
              left: hover.rect.left,
              top: Math.max(8, hover.rect.top - 28),
              background: '#10b981',
              color: 'white',
              fontSize: 11,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              padding: '3px 8px',
              borderRadius: 4,
              pointerEvents: 'none',
              maxWidth: '70vw',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              zIndex: 111,
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
            background: '#0f172a',
            color: 'white',
            fontSize: 13,
            padding: '10px 16px',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 130,
          }}
        >
          {toast}
        </div>
      )}

      <button
        data-inspector="toggle"
        type="button"
        onClick={() => setActive((v) => !v)}
        title={active ? 'Inspector ON — клик по блоку копирует промпт для claude/codex. Esc — выкл.' : 'Включить Inspector: hover на блок → подсветка → клик копирует контекст для чата'}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: active ? '#10b981' : '#1e293b',
          color: 'white',
          fontSize: 13,
          fontWeight: 500,
          padding: '10px 14px',
          borderRadius: 999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          zIndex: 120,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: active ? '#a7f3d0' : '#94a3b8',
          }}
        />
        Inspector {active ? 'ON' : 'OFF'}
      </button>

      {active && (
        <div
          data-inspector="hint"
          style={{
            position: 'fixed',
            bottom: 64,
            right: 16,
            background: '#0f172a',
            color: 'white',
            fontSize: 11,
            padding: '8px 12px',
            borderRadius: 8,
            maxWidth: 280,
            lineHeight: 1.4,
            zIndex: 120,
          }}
        >
          Hover на блок → подсветка зелёным. Клик копирует контекст: путь, текущий текст и команду
          apply — вставь в claude/codex и попроси поправить. Esc — выкл.
        </div>
      )}
    </>
  );
}
