import { NextResponse } from 'next/server';
import { hasLLMCredentials } from '@buffalo/harness/providers';
import { detectAvailableCli, getFailureSnapshot } from '../extract-brief/cli-extract';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const installed = await detectAvailableCli();
  const failing = getFailureSnapshot();
  return NextResponse.json({
    cli: installed,
    failing,
    apiKey: hasLLMCredentials(),
    preferredOrder: ['claude', 'codex', 'agy', 'api-key', 'heuristic'],
  });
}
