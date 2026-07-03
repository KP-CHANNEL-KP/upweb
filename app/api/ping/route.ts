import { connect } from 'cloudflare:sockets';

export const runtime = 'edge';

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

// Cloudflare TCP Sockets API နဲ့ connect လုပ်ကြည့်မယ်
async function checkTcp(host: string, port: number): Promise<number> {
  const start = Date.now();
  let socket: ReturnType<typeof connect> | null = null;

  try {
    socket = connect({ hostname: host, port });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS);
    });

    // socket.opened resolves ရင် connect success
    await Promise.race([socket.opened, timeoutPromise]);

    const ping = Date.now() - start;
    socket.close().catch(() => {});
    return ping;
  } catch {
    if (socket) {
      socket.close().catch(() => {});
    }
    return -1;
  }
}

// Chunk helper — concurrency ကန့်သတ်ဖို့
function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { targets: PingTarget[] };
    const targets = body.targets;

    if (!Array.isArray(targets) || targets.length === 0) {
      return Response.json({ error: 'targets array required' }, { status: 400 });
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

    return Response.json({ results });
  } catch (err) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}