export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const kv = (process.env as any).KV;
  
  // KV Namespace မချိတ်ထားမိရင် Error တက်နိုင်လို့ Check လုပ်ပါ
  if (!kv) {
    return NextResponse.json({ error: 'KV Namespace not bound' }, { status: 500 });
  }

  const list = await kv.list();
  
  const keys = await Promise.all(list.keys.map(async (k: any) => {
    const value = await kv.get(k.name);
    return {
      id: k.name,
      name: k.name,
      key: value
    };
  }));
  
  return NextResponse.json(keys);
}

export async function POST(req: Request) {
  try {
    const { name, key, password } = await req.json();
    
    // Password ကို Environment Variable ကနေ ခေါ်သုံးပါ (ပိုလုံခြုံတယ်)
    // Cloudflare Dashboard > Settings > Environment Variables မှာ ထည့်ထားပါ
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const kv = (process.env as any).KV;
    await kv.put(name, key);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}