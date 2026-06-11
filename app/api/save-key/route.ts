import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Cloudflare Environment Variables အတွက် Interface
interface Env {
  KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

export async function POST(req: Request) {
  try {
    // 1. Request body ကို Type သတ်မှတ်ပြီး ဖတ်ခြင်း
    const body = await req.json() as { name: string; key: string; password: string };
    const { name, key, password } = body;

    // 2. Environment Variables ကို access လုပ်ခြင်း
    const env = process.env as unknown as Env;
    const kv = env.KV;

    // 3. Password စစ်ဆေးခြင်း
    if (password !== env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 4. Input Valid ဖြစ်မဖြစ် စစ်ဆေးခြင်း
    if (!name || !key) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 5. KV Namespace ရှိမရှိ စစ်ဆေးပြီး သိမ်းဆည်းခြင်း
    if (!kv) {
      return NextResponse.json({ error: 'KV Namespace not bound' }, { status: 500 });
    }

    await kv.put(name, key);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}