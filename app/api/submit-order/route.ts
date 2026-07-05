import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '../../../lib/cf';
import { createOrder } from '../../../lib/orders';

export const runtime = 'edge';

type OrderBody = {
  user?: { id?: string; name?: string };
  service?: string;
  serviceLabel?: string;
  phone?: string;
  refCode?: string;
  pkg?: { name?: string; price?: string };
  payMethod?: string;
};

export async function POST(req: NextRequest) {
  try {
    const env = getEnv();
    const body = (await req.json()) as OrderBody;
    const { user, service, serviceLabel, phone, refCode, pkg, payMethod } = body ?? {};

    if (!user || !service || !phone || !refCode || !pkg?.name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const orderId = `ORD-${Date.now()}`;

    // --- 1. Order ကို D1 ထဲ "pending" status နဲ့ သိမ်း ------------------------
    await createOrder(env.DB, {
      orderId,
      createdAt: new Date().toISOString(),
      service,
      serviceLabel: serviceLabel ?? service,
      pkg: { name: pkg.name, price: pkg.price ?? '-' },
      phone,
      refCode,
      payMethod: payMethod ?? '-',
      userName: user.name ?? '-',
      status: 'pending',
    });

    // --- 2. Admin ကို Telegram notification ပို့ ------------------------------
    const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN_2;
    const CHAT_ID = env.TELEGRAM_CHAT_ID_2;

    if (BOT_TOKEN && CHAT_ID) {
      const text = [
        '*KP Premium Account မှာယူမှု အသစ်*',
        '',
        '*ဝယ်သူအချက်အလက်*',
        `အမည်: ${user.name ?? '-'}`,
        `User ID: ${user.id ?? '-'}`,
        `ဖုန်းနံပါတ်: ${phone}`,
        '',
        `Service: ${serviceLabel ?? service}`,
        `Package: ${pkg.name}`,
        `ဈေးနှုန်း: ${pkg.price ?? '-'}`,
        `ငွေပေးချေနည်း: ${payMethod ?? '-'}`,
        `ငွေလွှဲပြေစာ နောက်ဆုံး ၅ လုံး: ${refCode}`,
        '',
        `Order ID: ${orderId}`,
        `အချိန်: ${new Date().toLocaleString('my-MM')}`,
        '',
        `👉 Admin page (/admin) ထဲက ဒီ order ID ကို ရှာပြီး account ထည့်ပေးပါ: ${orderId}`,
      ].join('\n');

      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
        });
        if (!tgRes.ok) {
          console.error('Telegram send failed', await tgRes.text());
        }
      } catch (e) {
        console.error('Telegram send error', e);
      }
    } else {
      console.warn('Telegram env vars not configured — skipping admin notification');
    }

    return NextResponse.json({ ok: true, orderId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}