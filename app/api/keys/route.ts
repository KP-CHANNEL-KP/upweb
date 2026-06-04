export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

// Cloudflare KV Binding ကို type-safe ဖြစ်အောင် လုပ်ခြင်း
interface Env {
  KV: KVNamespace;
  ADMIN_PASSWORD: string;
}

export async function GET(request: Request) {
  // context ထဲကနေ env ကို ခေါ်သုံးခြင်း (Next.js on Cloudflare အတွက် ပိုမှန်ကန်သည်)
  const env = (process.env as unknown) as Env;
  const kv = env.KV;

  if (!kv) {
    return NextResponse.json({ error: 'KV Namespace not bound' }, { status: 500 });
  }

  try {
    const list = await kv.list();
    // Promise.all နဲ့ Data ဆွဲတာ မှန်ပါတယ်၊ Key တွေအများကြီးရှိရင်တော့ limit ထားဖို့လိုပါတယ်
    const keys = await Promise.all(
      list.keys.map(async (k: any) => ({
        name: k.name,
        key: (await kv.get(k.name)) || ""
      }))
    );
    return NextResponse.json(keys);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch keys' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, key, password } = await req.json();
    const env = (process.env as unknown) as Env;

    // Environment Variable ထဲက Password နဲ့ တိုက်စစ်
    if (password !== env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!name || !key) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const kv = env.KV;
    await kv.put(name, key);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}