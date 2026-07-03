import { NextRequest, NextResponse } from 'next/server';
import net from 'net';

interface PingTarget {
  host: string;
  port: number;
}

interface PingResult {
  host: string;
  port: number;
  ping: number; // -1 = timeout/dead, >=0 = ms
}

const TIMEOUT_MS = 4000;
const CONCURRENCY = 10;

// တစ်ခု ချင်း TCP socket connect လုပ်ပြီး latency တိုင်းမယ်
function checkTcp(host: string, port: number): Promise<number> {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let settled = false;

    const finish = (result: number) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(TIMEOUT_MS);

    socket.once('connect', () => {
      finish(Date.now() - start);
    });

    socket.once('timeout', () => {
      finish(-1);
    });

    socket.once('error', () => {
      // Connection refused = server up but port closed => count as dead
      finish(-1);
    });

    socket.connect(port, host);
  });
}

// Chunk helper — concurrency ကန့်သတ်ဖို့
function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { targets: PingTarget[] };
    const targets = body.targets;

    if (!Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json({ error: 'targets array required' }, { status: 400 });
    }

    // safety cap — endpoint abuse မဖြစ်အောင်
    const safeTargets = targets.slice(0, 200);

    const results: PingResult[] = [];
    const chunks = chunkArray(safeTargets, CONCURRENCY);

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(async ({ host, port }) => {
          const ping = await checkTcp(host, port);
          return { host, port, ping };
        })
      );
      results.push(...chunkResults);
    }

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}