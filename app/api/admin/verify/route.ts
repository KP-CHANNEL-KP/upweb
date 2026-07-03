import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { env } = getRequestContext<CloudflareEnv>();
  const body = (await request.json()) as { password?: string };

  if (body.password && body.password === env.ADMIN_PASSWORD) {
    return Response.json({ ok: true });
  }
  return new Response(JSON.stringify({ ok: false }), { status: 401 });
}