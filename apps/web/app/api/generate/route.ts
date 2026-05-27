import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { BriefSchema } from '@buffalo/harness/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 800;

function findRepoRoot(): string {
  return resolve(process.cwd(), '..', '..');
}

const SlugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9-]*$/i, 'kebab-case, латиница и цифры');

const BodySchema = z.object({
  slug: SlugSchema,
  brief: BriefSchema,
});

function sseEncode(data: string, event?: string): string {
  const lines: string[] = [];
  if (event) lines.push(`event: ${event}`);
  for (const line of data.split('\n')) lines.push(`data: ${line}`);
  lines.push('');
  return lines.join('\n') + '\n';
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json body' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: 'invalid brief',
        issues: parsed.error.flatten(),
      }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  const { slug, brief } = parsed.data;
  const root = findRepoRoot();
  const briefPath = resolve(root, 'content', 'briefs', `${slug}.json`);

  await mkdir(resolve(root, 'content', 'briefs'), { recursive: true });
  await writeFile(briefPath, JSON.stringify(brief, null, 2) + '\n', 'utf-8');

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      function send(data: string, event?: string) {
        controller.enqueue(encoder.encode(sseEncode(data, event)));
      }

      send(`brief сохранён: content/briefs/${slug}.json`, 'progress');
      send(`запускаю: harness agent build landing --slug ${slug}`, 'progress');

      const child = spawn(
        'pnpm',
        [
          '-w',
          'run',
          'harness',
          'agent',
          'build',
          'landing',
          '--slug',
          slug,
          '--brief',
          `content/briefs/${slug}.json`,
        ],
        {
          cwd: root,
          env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
        },
      );

      const flush = (chunk: Buffer) => {
        const text = chunk.toString('utf-8');
        for (const line of text.split(/\r?\n/)) {
          if (line.length === 0) continue;
          send(line);
        }
      };

      child.stdout.on('data', flush);
      child.stderr.on('data', flush);

      child.on('error', (err) => {
        send(`spawn error: ${err.message}`, 'error');
        controller.close();
      });

      child.on('exit', (code) => {
        if (code === 0) {
          send(
            `готово. preview: /landings/${slug} · approve: /approve/${slug}`,
            'done',
          );
        } else {
          send(
            `pipeline exited with code ${code}. Если ошибка про API-ключ — установите ANTHROPIC_API_KEY/OPENAI_API_KEY в .env.local либо завершите agent-mode через assistant (harness agent prepare).`,
            'error',
          );
        }
        controller.close();
      });

      req.signal.addEventListener('abort', () => {
        try {
          child.kill('SIGTERM');
        } catch {
          // child already exited
        }
        controller.close();
      });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store, no-transform',
      'x-accel-buffering': 'no',
    },
  });
}
