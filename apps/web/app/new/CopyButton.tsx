'use client';

import { useRef, useState } from 'react';

interface Props {
  text: string;
}

/**
 * Кнопка копирования с надёжным fallback'ом (как в InspectorOverlay).
 * Сначала sync execCommand с временной textarea, потом async clipboard.writeText.
 */
export function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function copy() {
    let ok = false;
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus({ preventScroll: true });
      ta.select();
      ta.setSelectionRange(0, text.length);
      ok = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch {
      ok = false;
    }

    if (!ok && navigator.clipboard?.writeText) {
      void navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setCopied(false), 1800);
        })
        .catch(() => {
          // ничего не получилось — оставляем как было, кнопка просто не сменит состояние
        });
      return;
    }

    if (ok) {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-(--radius-lg) px-2.5 py-1 text-[11px] font-medium transition ${
        copied
          ? 'bg-emerald-600 text-white'
          : 'border border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-surface-section) hover:text-(--color-text-primary)'
      }`}
      aria-label="Скопировать промпт"
    >
      {copied ? '✓ Скопировано' : 'Копировать'}
    </button>
  );
}
