import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // TypeScript အတွက် data type ကို အတိအလင်း သတ်မှတ်ပေးခြင်း
    const body = await req.json() as { plan: string };
    const { plan } = body;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Plan အလိုက် command mapping (လိုအပ်ပါက အခြား plan များ ထပ်ထည့်နိုင်ပါတယ်)
    const planCommand = plan === '1 GB Plan' ? '/getkey 1' : '/getkey 10';

    // Telegram Bot ထံသို့ message ပို့ခြင်း
    const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: planCommand })
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Telegram');
    }

    return NextResponse.json({ id: Date.now().toString(), status: 'pending' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to request key' }, { status: 500 });
  }
}