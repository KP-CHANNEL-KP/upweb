import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { orderId, key } = await req.json();
    const db = process.env.DB as any;

    // Database ထဲမှာ order_id ကို ရှာပြီး Key ထည့် + Status ပြောင်း
    await db.prepare(
      "UPDATE orders SET key = ?, status = 'completed' WHERE id = ?"
    ).bind(key, orderId).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}