import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, key, password } = await req.json();
  
  // Environment Variable ထဲက Password နဲ့ တိုက်စစ်
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Password မှန်မှသာ KV သို့ သိမ်းပါ
  const kv = (process.env as any).KV;
  await kv.put(name, key);
  
  return NextResponse.json({ success: true });
}