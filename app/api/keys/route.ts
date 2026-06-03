import { NextResponse } from 'next/server';

// Cloudflare KV သို့ သိမ်းဆည်းရန်
export async function POST(req: Request) {
  const { name, key } = await req.json();
  // process.env.KV.put(name, key); 
  return NextResponse.json({ success: true });
}

// Cloudflare KV မှ ပြန်ထုတ်ရန်
export async function GET() {
  // const data = await process.env.KV.list();
  return NextResponse.json([{ id: '1', name: 'VPN 01', key: '...' }]);
}