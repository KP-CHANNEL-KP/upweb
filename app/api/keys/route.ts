import { NextResponse } from 'next/server';
export const runtime = 'edge';

// Cloudflare Environment Variable ကို သုံးရန်
interface Env {
  KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

export async function GET() {
  const env = process.env as unknown as Env;
  try {
    const list = await env.KV.list();
    const keys = await Promise.all(
      list.keys.map(async (k) => ({
        id: k.name,
        name: k.name,
        key: (await env.KV.get(k.name)) || ""
      }))
    );
    return NextResponse.json(keys);
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // ဒီနေရာမှာ type အတိအလင်း သတ်မှတ်ပေးလိုက်တာပါ
  const body = await req.json() as { name: string; key: string; password: string };
  const { name, key, password } = body;
  
  const env = process.env as unknown as Env;
  
  if (password !== env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!name || !key) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await env.KV.put(name, key);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const password = searchParams.get('password');
  const env = process.env as unknown as Env;
  if (password !== env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (id) await env.KV.delete(id);
  return NextResponse.json({ success: true });
}