import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // body ကို any အဖြစ် cast လုပ်လိုက်ပါ (ဒါမှမဟုတ် interface တစ်ခုဆောက်ပါ)
  const body = await req.json();
  const plan = body.plan; 
  
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Plan အလိုက် command mapping
  const planCommand = plan === '1 GB Plan' ? '/getkey 1' : '/getkey 10'; 

  try {
    const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: planCommand })
    });

    return NextResponse.json({ id: Date.now().toString(), status: 'pending' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to request key' }, { status: 500 });
  }
}