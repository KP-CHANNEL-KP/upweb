import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const db = process.env.DB as any;

  const order = await db.prepare("SELECT * FROM orders WHERE id = ?")
                        .bind(id).first();

  return NextResponse.json(order);
}