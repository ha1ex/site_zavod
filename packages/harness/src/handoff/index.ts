import archiver from 'archiver';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { LandingSpec } from '../schemas/landing-spec';
import { LandingSpecSchema } from '../schemas/landing-spec';
import { readApproval } from '../approvals/index';
import { pascalCase } from '../pipeline/illustration-stub';

/**
 * Handoff packer (этап 6).
 *
 * Собирает ZIP-пакет, который разработчик может уронить в свой Next.js + Tailwind v4 проект:
 *   landing-<slug>/
 *     ├── README.md            что внутри, как подключать
 *     ├── package.json         минимальный snippet deps
 *     ├── page.tsx             generated landing (imports переписаны на ./components)
 *     ├── spec.json            исходный LandingSpec
 *     ├── approval.json        статус approval (если есть)
 *     ├── tokens.css           Kaiten DS токены
 *     ├── styles.css           bridge: импортит tailwindcss + tokens
 *     ├── components/          использованные landing-компоненты + barrel
 *     ├── primitives/          Button, ButtonLink, cn
 *     └── illustrations/       SVG-иллюстрации (если есть)
 */

export interface HandoffManifest {
  slug: string;
  zipPath: string;
  files: string[];
  bytes: number;
  components: string[];
  illustrations: string[];
}

interface BuildOptions {
  /** Папка repo root (где pnpm-workspace.yaml). */
  root: string;
  /** Куда сложить ZIP. По умолчанию <root>/out/landing-<slug>.zip. */
  outPath?: string;
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readUtf8(p: string): Promise<string> {
  return readFile(p, 'utf-8');
}

function rewritePageImports(tsx: string): string {
  // import { A, B } from '@buffalo/ui/landing'; → './components/index.js'
  return tsx.replace(
    /from\s+['"]@buffalo\/ui\/landing['"]/g,
    `from './components/index'`,
  );
}

function makeReadme(spec: LandingSpec, slug: string, components: string[], illustrations: string[]): string {
  return `# Landing handoff — ${slug}

Сгенерировано Buffalo harness'ом. Готово к интеграции в Next.js + Tailwind v4 проект.

## Что внутри

- \`page.tsx\` — собранная страница (Server Component).
- \`spec.json\` — исходный LandingSpec (для трассировки).
- \`tokens.css\` — Kaiten V01 design tokens (CSS vars + Tailwind v4 \`@theme\`).
- \`styles.css\` — глобальные стили (импортит tailwindcss + tokens).
- \`components/\` — использованные landing-компоненты (${components.length}): ${components.join(', ')}.
- \`primitives/\` — Button, ButtonLink, cn (зависимости компонентов).
- \`illustrations/\` — SVG-иллюстрации${illustrations.length ? ` (${illustrations.length}): ${illustrations.join(', ')}` : ' (нет)'}.

## Как подключить

1. Установи зависимости из \`package.json\` (или допиши их в свой):

   \`\`\`bash
   pnpm add react react-dom clsx tailwind-merge lucide-react
   pnpm add -D tailwindcss @tailwindcss/postcss
   \`\`\`

2. Положи папку в свой проект, например \`app/landings/${slug}/\`.

3. Импортируй \`styles.css\` из глобального CSS:

   \`\`\`css
   @import "./landings/${slug}/styles.css";
   \`\`\`

4. Подключи маршрут в Next.js (App Router) — \`page.tsx\` уже валидный route.

## SEO

- title: ${spec.seo.title}
- description: ${spec.seo.description}

## Источник истины

LLM-генерация через @buffalo/harness; rebuild — \`pnpm -w run harness generate landing --brief ... --slug ${slug}\`.
`;
}

function makePackageJsonSnippet(slug: string): string {
  return JSON.stringify(
    {
      name: `landing-${slug}`,
      private: true,
      version: '0.1.0',
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        next: '^16.0.0',
        clsx: '^2.1.1',
        'tailwind-merge': '^2.5.4',
        'lucide-react': '^0.460.0',
      },
      devDependencies: {
        tailwindcss: '^4.3.0',
        '@tailwindcss/postcss': '^4.3.0',
      },
    },
    null,
    2,
  ) + '\n';
}

function makeComponentsBarrel(componentFiles: string[]): string {
  return componentFiles
    .map((name) => `export { ${name} } from './${name}';`)
    .join('\n') + '\n';
}

function makeIllustrationsBarrel(names: string[]): string {
  return names.map((n) => `export { default as ${n} } from './${n}';`).join('\n') + '\n';
}

export async function buildHandoff(slug: string, opts: BuildOptions): Promise<HandoffManifest> {
  const { root } = opts;
  const specPath = resolve(root, 'content', 'landings', `${slug}.json`);
  if (!(await fileExists(specPath))) {
    throw new Error(`Spec not found: ${specPath}`);
  }
  const spec = LandingSpecSchema.parse(JSON.parse(await readUtf8(specPath)));

  const pagePath = resolve(root, 'generated', 'landings', slug, 'page.tsx');
  if (!(await fileExists(pagePath))) {
    throw new Error(`Generated page not found: ${pagePath}. Запусти \`harness generate landing\` сначала.`);
  }
  const pageTSXRaw = await readUtf8(pagePath);
  const pageTSX = rewritePageImports(pageTSXRaw);

  const componentNames = Array.from(new Set(spec.sections.map((s) => s.component))).sort();
  const uiSrc = resolve(root, 'packages', 'ui', 'src');

  const files: { archivePath: string; content: string | Buffer }[] = [];

  // Landing components
  for (const name of componentNames) {
    const src = resolve(uiSrc, 'landing', `${name}.tsx`);
    if (!(await fileExists(src))) continue;
    files.push({ archivePath: `landing-${slug}/components/${name}.tsx`, content: await readUtf8(src) });
  }
  files.push({
    archivePath: `landing-${slug}/components/index.ts`,
    content: makeComponentsBarrel(componentNames),
  });

  // Primitives (Button, ButtonLink, cn) — копируем всю папку, перерайт не нужен
  const primitivesDir = resolve(uiSrc, 'primitives');
  for (const f of await readdir(primitivesDir)) {
    if (!/\.(tsx?|ts)$/.test(f)) continue;
    files.push({
      archivePath: `landing-${slug}/primitives/${f}`,
      content: await readUtf8(resolve(primitivesDir, f)),
    });
  }

  // Mocks (детализированные mock-визуалы, используются HeroSection и MediaCopy).
  // Копируем всю папку — она маленькая, проще чем парсить импорты компонентов.
  const mocksDir = resolve(uiSrc, 'landing', 'mocks');
  if (await fileExists(mocksDir)) {
    for (const f of await readdir(mocksDir)) {
      if (!/\.(tsx?|ts)$/.test(f)) continue;
      files.push({
        archivePath: `landing-${slug}/components/mocks/${f}`,
        content: await readUtf8(resolve(mocksDir, f)),
      });
    }
  }

  // Illustrations — берём по spec.illustrationSpecs (PascalCase из id)
  const illustrationNames: string[] = [];
  const illustrationsDir = resolve(uiSrc, 'illustrations');
  for (const illSpecId of spec.illustrationSpecs) {
    const Name = pascalCase(illSpecId);
    const src = resolve(illustrationsDir, `${Name}.tsx`);
    if (!(await fileExists(src))) continue;
    illustrationNames.push(Name);
    files.push({
      archivePath: `landing-${slug}/illustrations/${Name}.tsx`,
      content: await readUtf8(src),
    });
  }
  if (illustrationNames.length > 0) {
    files.push({
      archivePath: `landing-${slug}/illustrations/index.ts`,
      content: makeIllustrationsBarrel(illustrationNames),
    });
  }

  // Tokens + styles
  files.push({
    archivePath: `landing-${slug}/tokens.css`,
    content: await readUtf8(resolve(uiSrc, 'tokens.css')),
  });
  files.push({
    archivePath: `landing-${slug}/styles.css`,
    content: await readUtf8(resolve(uiSrc, 'styles.css')),
  });

  // Page + spec
  files.push({ archivePath: `landing-${slug}/page.tsx`, content: pageTSX });
  files.push({
    archivePath: `landing-${slug}/spec.json`,
    content: JSON.stringify(spec, null, 2) + '\n',
  });

  // Approval (optional, если файл существует)
  const approval = await readApproval(root, slug);
  // pending default — не добавляем, только если был явный update
  const approvalFile = resolve(root, 'content', 'approvals', `${slug}.json`);
  if (await fileExists(approvalFile)) {
    files.push({
      archivePath: `landing-${slug}/approval.json`,
      content: JSON.stringify(approval, null, 2) + '\n',
    });
  }

  // README + package.json snippet
  files.push({
    archivePath: `landing-${slug}/README.md`,
    content: makeReadme(spec, slug, componentNames, illustrationNames),
  });
  files.push({
    archivePath: `landing-${slug}/package.json`,
    content: makePackageJsonSnippet(slug),
  });

  // Запись ZIP
  const zipPath = opts.outPath ?? resolve(root, 'out', `landing-${slug}.zip`);
  await mkdir(dirname(zipPath), { recursive: true });

  const archive = archiver('zip', { zlib: { level: 9 } });
  const output = createWriteStream(zipPath);

  const finished = new Promise<number>((resolveBytes, rejectErr) => {
    output.on('close', () => resolveBytes(archive.pointer()));
    output.on('error', rejectErr);
    archive.on('error', rejectErr);
  });
  archive.pipe(output);
  for (const f of files) {
    archive.append(f.content, { name: f.archivePath });
  }
  await archive.finalize();
  const bytes = await finished;

  return {
    slug,
    zipPath,
    files: files.map((f) => f.archivePath),
    bytes,
    components: componentNames,
    illustrations: illustrationNames,
  };
}

// Helper для CLI/тестов: использовать также можно через index.ts re-export.
export const _internal = { rewritePageImports, makeReadme, makePackageJsonSnippet };
void createReadStream; // подавить unused если в будущем понадобится
