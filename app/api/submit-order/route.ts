import { NextRequest, NextResponse } from 'next/server';

// Bot token & chat id live ONLY on the server (Vercel/host env vars),
// never shipped to the browser. Set these in .env.local:
//   TELEGRAM_BOT_TOKEN=xxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//   TELEGRAM_CHAT_ID=7070690379
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_2;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID_2;

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json({ error: 'Telegram env vars not configured' }, { status: 500 });
  }

  try {
    const body = (await req.json()) as any;
    const { user, game, idOrLink, phone, refCode, pkg, payMethod } = body ?? {};

    if (!user || !game || !idOrLink || !phone || !refCode || !pkg) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const text = [
      '*KP Top Up မှာယူမှု အသစ်*',
      '',
      '*ဝယ်သူအချက်အလက်*',
      `အမည်: ${user.name}`,
      `Google ID (Ban လုပ်ရန်): ${user.id}`,
      `In-Game ID / Link: ${idOrLink}`,
      `ဖုန်းနံပါတ်: ${phone}`,
      '',
      `ဂိမ်း / Service: ${game}`,
      `ပမာဏ: ${pkg.name}`,
      `ဈေးနှုန်း: ${pkg.price}`,
      `ငွေပေးချေနည်း: ${payMethod}`,
      `ငွေလွှဲပြေစာ နောက်ဆုံး ၅ လုံး: ${refCode}`,
      '',
      `အချိန်: ${new Date().toLocaleString('my-MM')}`,
    ].join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
    });

    if (!tgRes.ok) {
      const detail = await tgRes.text();
      return NextResponse.json({ error: 'Telegram send failed', detail }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}