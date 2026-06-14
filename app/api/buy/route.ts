import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json() as { plan: string };
    const db = process.env.DB as any;

    // 1. Data ထည့်သွင်းခြင်း (id သည် table ဆောက်စဉ်က PRIMARY KEY AUTOINCREMENT ဖြစ်ရမည်)
    await db.prepare("INSERT INTO orders (plan, status) VALUES (?, ?)")
      .bind(plan, 'pending')
      .run();

    // 2. နောက်ဆုံးထည့်လိုက်တဲ့ ID ကို ချက်ချင်းပြန်ထုတ်ယူခြင်း
    const orderRow = await db.prepare("SELECT last_insert_rowid() as id").first();
    const orderId = orderRow?.id;

    if (!orderId) {
      throw new Error("Could not retrieve new order ID");
    }

    // 3. Telegram Bot ဆီသို့ Command ပို့ခြင်း
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    // Plan ပေါ်မူတည်ပြီး command အပြည့်အစုံပို့ပါ
    const planValue = plan.split(' ')[0]; 
    // Bot ဘက်က split လုပ်ရလွယ်ကူအောင် order_id:4 ဆိုတဲ့ ပုံစံအတိုင်းပို့ပါ
    const textToSend = `/getkey ${planValue} order_id:${orderId}`;

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