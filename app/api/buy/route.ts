import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json() as { plan: string };

    // D1 Database ကို ချိတ်ဆက်ခြင်း (env variable ကို wrangler.toml ထဲမှာ ထည့်ထားရပါမယ်)
    // process.env.DB ဆိုသည်မှာ သင့် D1 database binding name ဖြစ်ပါသည်
    const db = process.env.USER_DB as any;

    // Database ထဲသို့ အော်ဒါအသစ်ထည့်ခြင်း
    const { results } = await db.prepare(
      "INSERT INTO orders (plan, status) VALUES (?, ?) RETURNING id"
    ).bind(plan, 'pending').run();

    const orderId = results[0].id; // ရလာတဲ့ order id

    // Telegram Bot ဆီသို့ Command ပို့ခြင်း
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const planCommand = plan === '1 GB Plan' ? '/getkey 1' : '/getkey 10';

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text: `${planCommand} | order_id:${orderId}` // Bot က ဒီ ID ကို ပြန်ပို့ပေးရမယ်
      })
    });

    return NextResponse.json({ id: orderId, status: 'pending' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}