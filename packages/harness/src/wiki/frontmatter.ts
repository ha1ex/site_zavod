/**
 * Минимальный YAML-парсер front-matter для wiki-страниц.
 * Поддерживает то, что нам нужно: строки, числа, булевы, массивы (inline или dash-list).
 * Без вложенных объектов — для них используем отдельные поля.
 */

export interface FrontMatter {
  [key: string]: string | number | boolean | string[] | null;
}

export interface ParsedFile {
  frontmatter: FrontMatter;
  body: string;
}

const FM_DELIMITER = '---';

export function parseFrontmatter(content: string): ParsedFile {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== FM_DELIMITER) {
    return { frontmatter: {}, body: content };
  }

  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === FM_DELIMITER) {
      end = i;
      break;
    }
  }
  if (end === -1) {
    return { frontmatter: {}, body: content };
  }

  const fmLines = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n');
  const fm = parseFmBlock(fmLines);
  return { frontmatter: fm, body };
}

function parseFmBlock(lines: string[]): FrontMatter {
  const result: FrontMatter = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim() || line.trim().startsWith('#')) {
      i++;
      continue;
    }
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      i++;
      continue;
    }
    const key = line.slice(0, colonIdx).trim();
    const rawValue = line.slice(colonIdx + 1).trim();

    if (rawValue === '' && i + 1 < lines.length && lines[i + 1]!.trimStart().startsWith('- ')) {
      const arr: string[] = [];
      i++;
      while (i < lines.length && lines[i]!.trimStart().startsWith('- ')) {
        const item = lines[i]!.trimStart().slice(2).trim();
        arr.push(unquote(item));
        i++;
      }
      result[key] = arr;
      continue;
    }

    result[key] = parseScalar(rawValue);
    i++;
  }
  return result;
}

function parseScalar(s: string): string | number | boolean | string[] | null {
  if (s === '' || s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((p) => unquote(p.trim()));
  }
  return unquote(s);
}

function unquote(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

export function serializeFrontmatter(fm: FrontMatter, body: string): string {
  const lines: string[] = [FM_DELIMITER];
  for (const [key, value] of Object.entries(fm)) {
    if (value === null) {
      lines.push(`${key}: ~`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        for (const item of value) lines.push(`  - ${needsQuote(item) ? quote(item) : item}`);
      }
    } else if (typeof value === 'string') {
      lines.push(`${key}: ${needsQuote(value) ? quote(value) : value}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push(FM_DELIMITER);
  return lines.join('\n') + '\n' + body;
}

function needsQuote(s: string): boolean {
  return /[:#"'\[\]]/.test(s) || s.includes('\n');
}

function quote(s: string): string {
  return `"${s.replace(/"/g, '\\"')}"`;
}

/**
 * Извлекает блок между маркерами `<!-- gen:<tag> -->` и `<!-- /gen:<tag> -->`.
 * Возвращает null, если маркеры не найдены.
 */
export function extractGenBlock(body: string, tag: string): { start: number; end: number } | null {
  const open = `<!-- gen:${tag} -->`;
  const close = `<!-- /gen:${tag} -->`;
  const start = body.indexOf(open);
  if (start === -1) return null;
  const end = body.indexOf(close, start);
  if (end === -1) return null;
  return { start: start + open.length, end };
}

export function replaceGenBlock(body: string, tag: string, replacement: string): string {
  const open = `<!-- gen:${tag} -->`;
  const close = `<!-- /gen:${tag} -->`;
  const range = extractGenBlock(body, tag);
  if (!range) {
    return body + `\n\n${open}\n${replacement}\n${close}\n`;
  }
  return (
    body.slice(0, range.start) + '\n' + replacement + '\n' + body.slice(range.end)
  );
}
