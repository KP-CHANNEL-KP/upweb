import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'ID missing' }, { status: 400 });

  // D1 Database ကနေ Data လှမ်းယူ
  const result = await process.env.DB.prepare(
    "SELECT status, access_url FROM orders WHERE id = ?"
  ).bind(id).first();
  
  return NextResponse.json(result);
}