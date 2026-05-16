#!/usr/bin/env node
/**
 * Собирает SSR-страницу /landings/<slug> в один автономный HTML-файл с inline
 * CSS и без JS-чанков. Открывается двойным кликом без dev-сервера.
 *
 * Интерактивные секции (TabbedFeature, IndustryPicker) останутся в default
 * state (первый таб / первая индустрия) — это OK для статичной копии.
 *
 * Usage:
 *   node scripts/build-static-html.mjs <slug> [outPath]
 *   node scripts/build-static-html.mjs crm out/crm/crm.html
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const [, , slug = 'crm', outPathArg] = process.argv;
const outPath = outPathArg ?? `out/${slug}/${slug}.html`;
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

function absolutize(href) {
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  if (href.startsWith('//')) return `http:${href}`;
  if (href.startsWith('/')) return `${baseUrl}${href}`;
  return new URL(href, baseUrl).toString();
}

async function inlineStylesheets(html) {
  const linkRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const links = html.match(linkRegex) ?? [];
  const cssBlocks = [];

  for (const tag of links) {
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const url = absolutize(hrefMatch[1]);
    try {
      const css = await fetchText(url);
      cssBlocks.push(`/* inlined from ${hrefMatch[1]} */\n${css}`);
    } catch (err) {
      console.warn(`! failed to inline ${url}: ${err.message}`);
    }
  }

  const combined = cssBlocks.length
    ? `\n<style data-inlined="true">\n${cssBlocks.join('\n\n')}\n</style>\n`
    : '';
  return html.replace(linkRegex, '') + (combined && '\n' + combined);
}

function stripScripts(html) {
  // Удаляем все <script>...</script> и <script src="…"></script> — статике
  // hydration не нужен; интерактив (табы) останется в default-state из SSR.
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/>/gi, '');
}

function stripPreloads(html) {
  // Удаляем <link rel="preload"> и <link rel="modulepreload"> — они ссылаются
  // на /_next/static chunks которые недоступны при открытии файла локально.
  return html
    .replace(/<link\s+[^>]*rel=["'](?:preload|modulepreload|prefetch)["'][^>]*\/?>/gi, '')
    .replace(/<link\s+[^>]*rel=["'](?:dns-prefetch|preconnect)["'][^>]*\/?>/gi, '');
}

function injectStaticBanner(html, slug) {
  const banner = `\n<!--\n  Static export of /landings/${slug}\n  Generated: ${new Date().toISOString()}\n  Note: интерактив (табы, picker) показывает default-state.\n        Для полной интерактивности откройте через dev-сервер.\n-->\n`;
  return html.replace(/<html[^>]*>/i, (match) => `${match}${banner}`);
}

async function main() {
  console.log(`→ fetching ${baseUrl}/landings/${slug}`);
  const rawHtml = await fetchText(`${baseUrl}/landings/${slug}`);

  console.log('→ inlining stylesheets');
  const withInlineCss = await inlineStylesheets(rawHtml);

  console.log('→ stripping <script> tags');
  const noScripts = stripScripts(withInlineCss);

  console.log('→ stripping preload/prefetch links to chunks');
  const noPreloads = stripPreloads(noScripts);

  console.log('→ injecting static banner');
  const finalHtml = injectStaticBanner(noPreloads, slug);

  const absOut = resolve(process.cwd(), outPath);
  await mkdir(dirname(absOut), { recursive: true });
  await writeFile(absOut, finalHtml, 'utf-8');

  const sizeKB = (Buffer.byteLength(finalHtml) / 1024).toFixed(1);
  console.log(`✓ saved ${absOut} (${sizeKB} KB)`);
}

main().catch((err) => {
  console.error('build-static-html failed:', err);
  process.exit(1);
});
