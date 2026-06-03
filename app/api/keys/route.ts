export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

// Key များထုတ်ယူရန်
export async function GET() {
  const kv = (process.env as any).KV;
  const list = await kv.list(); // KV ထဲက key အားလုံးထုတ်မယ်
  const keys = await Promise.all(list.keys.map(async (k: any) => ({
    id: k.name,
    name: k.name,
    key: await kv.get(k.name)
  })));
  return NextResponse.json(keys);
}

// Key အသစ်ထည့်ရန် (Password စစ်ခြင်းပါဝင်)
export async function POST(req: Request) {
  const { name, key, password } = await req.json();
  if (password !== "232003") return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const kv = (process.env as any).KV;
  await kv.put(name, key);
  return NextResponse.json({ success: true });
}