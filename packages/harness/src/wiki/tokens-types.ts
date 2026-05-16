/**
 * Типы DS-токенов (соответствуют design-system/kaiten-v01/tokens.json).
 */

export interface TypographyScale {
  size: number;
  lineHeight: number;
}

export interface DesignTokens {
  version: string;
  source?: string;
  notes?: string;
  colors: {
    neutral: Record<string, string>;
    accent: Record<string, string>;
    semantic: Record<string, string>;
  };
  typography: {
    fontFamilies: Record<string, string>;
    scales: Record<string, TypographyScale>;
    weights: string[];
  };
  spacing: Record<string, number>;
  radius: Record<string, number>;
  grid: {
    container: Record<string, number>;
    desktop: Record<string, number>;
    tablet: Record<string, number>;
    mobile: Record<string, number>;
  };
  motion: {
    duration: Record<string, string>;
    ease: Record<string, string>;
  };
  button: {
    radius: number;
    letterSpacing: string;
    fontFamilyOverride?: string;
    fontWeight?: string;
    fill: Record<string, string>;
    outline: Record<string, string>;
    focus: Record<string, string>;
    sizes: Record<string, Record<string, number | string>>;
  };
}

/**
 * Распаковывает `{neutral.900}` → `#2d2d2d`, рекурсивно если нужно.
 * Bare-цвета (#xxx, rgb(...)) возвращает как есть.
 */
export function resolveColorRef(ref: string, tokens: DesignTokens): string {
  const match = ref.match(/^\{([\w-]+)\.([\w-]+)\}$/);
  if (!match) return ref;
  const [, group, key] = match;
  if (!group || !key) return ref;
  const colorGroup = (tokens.colors as Record<string, Record<string, string>>)[group];
  if (!colorGroup) return ref;
  const value = colorGroup[key];
  if (!value) return ref;
  return resolveColorRef(value, tokens);
}
