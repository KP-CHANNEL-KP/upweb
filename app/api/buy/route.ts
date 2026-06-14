import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json() as { plan: string };
    const db = process.env.DB as any;

    // ပြင်ဆင်ချက် - run() အစား first() ကို သုံးပြီး insert လုပ်ပါ
    // D1 မှာ RETURNING ကို တိုက်ရိုက်သုံးမယ့်အစား last_insert_rowid() နဲ့ ယူတာ ပိုမှန်ပါတယ်
    await db.prepare("INSERT INTO orders (plan, status) VALUES (?, ?)")
      .bind(plan, 'pending')
      .run();

    const orderRow = await db.prepare("SELECT last_insert_rowid() as id").first();
    const orderId = orderRow.id; 

    // Telegram Bot ဆီသို့ Command ပို့ခြင်း
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    // Plan ပေါ်မူတည်ပြီး command အပြည့်အစုံပို့ပါ
    const planValue = plan.split(' ')[0]; // ဥပမာ - "1 GB Plan" ဆိုရင် "1" ထွက်လာမယ်
    const textToSend = `/getkey ${planValue} | order_id:${orderId}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text: textToSend
      })
    });

    return NextResponse.json({ id: orderId, status: 'pending' });
  } catch (error) {
    console.error("Buy API Error:", error);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}