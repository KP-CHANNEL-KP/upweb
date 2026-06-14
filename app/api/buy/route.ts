import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { plan } = await req.json();
  
  // သင့် Telegram Bot details များ
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Plan အလိုက် command ကို mapping လုပ်ပါ
  // ဥပမာ - Telegram မှာ /getkey 1 ဆိုတာမျိုး ပို့ချင်ရင်
  const planCommand = plan === '1 GB Plan' ? '/getkey 1' : '/getkey 10'; // လိုအပ်သလို ထပ်ဖြည့်ပါ

  try {
    // Telegram Bot ထံသို့ message ပို့ခြင်း
    const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: planCommand })
    });

    // အောင်မြင်ကြောင်း return ပြန်ပါ
    return NextResponse.json({ id: Date.now().toString(), status: 'pending' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to request key' }, { status: 500 });
  }
}