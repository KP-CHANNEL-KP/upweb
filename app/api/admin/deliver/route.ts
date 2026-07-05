import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '../../../../lib/cf';
import { deliverOrder } from '../../../../lib/orders';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const env = getEnv();
  if (!env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'ADMIN_SECRET မထားရသေးပါ' }, { status: 500 });
  }

  const secret = req.headers.get('x-admin-secret');
  if (secret !== env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, email, password } = (await req.json()) as {
      orderId?: string;
      email?: string;
      password?: string;
    };

    if (!orderId || !email || !password) {
      return NextResponse.json({ error: 'orderId, email, password လိုအပ်ပါသည်' }, { status: 400 });
    }

    const order = await deliverOrder(env.DB, orderId, { email, password });
    return NextResponse.json({ ok: true, order });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
