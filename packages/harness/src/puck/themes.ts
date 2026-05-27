/**
 * Пресеты CSS-переменных для темизации лендинга в Puck-редакторе.
 * Применяются обёрткой <div style={{...}}> вокруг preview зоны — без
 * влияния на глобальный tokens.css.
 *
 * При publish тема НЕ сохраняется в spec — это только preview-overlay.
 * В будущем (M3+) можно добавить spec.meta.theme и применять при render'е.
 */

export interface ThemePreset {
  id: string;
  label: string;
  description?: string;
  vars: Record<string, string>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'kaiten',
    label: 'Kaiten (default)',
    description: 'Базовая фиолетовая палитра',
    vars: {},
  },
  {
    id: 'calgary',
    label: 'Calgary (тёплый бордо)',
    description: 'Тёплый акцент, для consumer-продуктов',
    vars: {
      '--color-action-primary': '#a8324f',
      '--color-action-primary-hover': '#8e2842',
      '--color-action-primary-soft': '#fbe9ee',
      '--color-text-accent': '#a8324f',
    },
  },
  {
    id: 'forest',
    label: 'Forest (изумрудный)',
    description: 'Для finance / health / sustainability',
    vars: {
      '--color-action-primary': '#1f8a5c',
      '--color-action-primary-hover': '#176f4a',
      '--color-action-primary-soft': '#e6f5ec',
      '--color-text-accent': '#1f8a5c',
    },
  },
];

export function getThemeById(id: string): ThemePreset {
  const found = THEME_PRESETS.find((t) => t.id === id);
  if (found) return found;
  const fallback = THEME_PRESETS[0];
  if (!fallback) throw new Error('THEME_PRESETS is empty');
  return fallback;
}
