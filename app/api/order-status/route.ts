import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '../../../lib/cf';
import { getOrder } from '../../../lib/orders';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId');
  if (!orderId) {
    return NextResponse.json({ error: 'orderId လိုအပ်ပါသည်' }, { status: 400 });
  }

  try {
    const env = getEnv();
    const order = await getOrder(env.DB, orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order မတွေ့ပါ' }, { status: 404 });
    }

    // Sensitive field (refCode) ကို public endpoint ကနေ ပြန်မပေးပါ
    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      account: order.status === 'delivered' ? order.account : undefined,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
