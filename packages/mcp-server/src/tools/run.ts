import { spawn } from 'node:child_process';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { resolveRepoRoot } from '../repo.js';

interface RunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

async function runHarness(root: string, args: string[]): Promise<RunResult> {
  return new Promise((resolveRun) => {
    const child = spawn('pnpm', ['-w', 'run', 'harness', ...args], {
      cwd: root,
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf-8');
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf-8');
    });
    child.on('close', (code) => {
      resolveRun({ exitCode: code ?? 0, stdout, stderr });
    });
    child.on('error', (err) => {
      resolveRun({ exitCode: 1, stdout, stderr: stderr + '\n' + err.message });
    });
  });
}

function truncate(text: string, max = 8000): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + `\n…[обрезано ${text.length - max} символов]`;
}

export function registerValidateTool(server: McpServer) {
  server.registerTool(
    'validate_landing',
    {
      description:
        'Прогнать всю цепочку валидаторов (Zod schema + brand voice + business rules + visual diversity + layout conformance + audience score + domain-fit) на готовом лендинге.',
      inputSchema: {
        slug: z.string().min(1).max(64).describe('slug лендинга'),
        strictDiversity: z
          .boolean()
          .optional()
          .describe('Включить strict cross-landing diversity (warnings → errors)'),
      },
    },
    async ({ slug, strictDiversity }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
        return { isError: true, content: [{ type: 'text', text: `Недопустимый slug: ${slug}` }] };
      }
      const root = await resolveRepoRoot();
      const args = [
        'agent',
        'apply',
        'landing',
        '--slug',
        slug,
        '--brief',
        `content/briefs/${slug}.json`,
      ];
      if (strictDiversity) args.push('--strict-diversity');
      const result = await runHarness(root, args);
      return {
        isError: result.exitCode !== 0,
        content: [
          {
            type: 'text',
            text: `harness agent apply (exit ${result.exitCode})\n\nstdout:\n${truncate(result.stdout)}\n\nstderr:\n${truncate(result.stderr)}`,
          },
        ],
        structuredContent: { exitCode: result.exitCode },
      };
    },
  );
}

export function registerBuildTool(server: McpServer) {
  server.registerTool(
    'build_landing',
    {
      description:
        'Запустить генерацию лендинга: harness agent build landing — гейт домена + phased pipeline (P0–P8); непокрытый домен → manual-creation stop. ВАЖНО: требует либо API-ключ (ANTHROPIC_API_KEY/OPENAI_API_KEY) в env при запуске MCP-сервера, либо host-LLM путь (тогда вернёт промпты фаз для host-агента).',
      inputSchema: {
        slug: z.string().min(1).max(64),
        routeOnly: z.boolean().optional().describe('Только показать routing decision, не запускать pipeline'),
      },
    },
    async ({ slug, routeOnly }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
        return { isError: true, content: [{ type: 'text', text: `Недопустимый slug: ${slug}` }] };
      }
      const root = await resolveRepoRoot();
      const args = [
        'agent',
        'build',
        'landing',
        '--slug',
        slug,
        '--brief',
        `content/briefs/${slug}.json`,
      ];
      if (routeOnly) args.push('--route-only');
      const result = await runHarness(root, args);
      return {
        isError: result.exitCode !== 0,
        content: [
          {
            type: 'text',
            text: `harness agent build (exit ${result.exitCode})\n\nstdout:\n${truncate(result.stdout)}\n\nstderr:\n${truncate(result.stderr)}`,
          },
        ],
        structuredContent: { exitCode: result.exitCode },
      };
    },
  );
}
