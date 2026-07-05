import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '../../../../lib/cf';
import { listPendingOrders } from '../../../../lib/orders';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const env = getEnv();
  if (!env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'ADMIN_SECRET မထားရသေးပါ' }, { status: 500 });
  }

  const secret = req.headers.get('x-admin-secret');
  if (secret !== env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await listPendingOrders(env.DB);
    return NextResponse.json({ orders });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
