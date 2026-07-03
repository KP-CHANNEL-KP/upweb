import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

const NEWS_KEY = 'news_list';

async function readNews(kv: KVNamespace): Promise<NewsItem[]> {
  const raw = await kv.get(NEWS_KEY);
  return raw ? (JSON.parse(raw) as NewsItem[]) : [];
}

// Public: anyone can read the news list
export async function GET() {
  const { env } = getRequestContext<{ Bindings: CloudflareEnv }>();
  const news = await readNews(env.NEWS_KV);
  // newest first
  news.sort((a, b) => (a.date < b.date ? 1 : -1));
  return Response.json(news);
}

// Admin only: add a news item
export async function POST(request: Request) {
  const { env } = getRequestContext<{ Bindings: CloudflareEnv }>();
  const password = request.headers.get('x-admin-password');

  if (!password || password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = (await request.json()) as { title?: string; content?: string };
  if (!body.title?.trim() || !body.content?.trim()) {
    return new Response(JSON.stringify({ error: 'title and content are required' }), { status: 400 });
  }

  const news = await readNews(env.NEWS_KV);
  const newItem: NewsItem = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    content: body.content.trim(),
    date: new Date().toISOString(),
  };
  news.unshift(newItem);
  await env.NEWS_KV.put(NEWS_KEY, JSON.stringify(news));

  return Response.json(newItem);
}

// Admin only: delete a news item by id
export async function DELETE(request: Request) {
  const { env } = getRequestContext<{ Bindings: CloudflareEnv }>();
  const password = request.headers.get('x-admin-password');

  if (!password || password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return new Response(JSON.stringify({ error: 'id is required' }), { status: 400 });
  }

  const news = await readNews(env.NEWS_KV);
  const filtered = news.filter((n) => n.id !== body.id);
  await env.NEWS_KV.put(NEWS_KEY, JSON.stringify(filtered));

  return Response.json({ success: true });
}