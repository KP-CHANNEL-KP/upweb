import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json() as { key: string };
    const { key } = body;

    if (!key) {
      return NextResponse.json({ valid: false, message: "Key ထည့်ပေးပါ" }, { status: 400 });
    }

    // Cloudflare binding ကို ခေါ်ခြင်း
    const db = (process.env as any).DB;

    if (!db) {
      return NextResponse.json({ valid: false, message: "Database ချိတ်ဆက်မှု မအောင်မြင်ပါ" }, { status: 500 });
    }

    // ၁။ Key ကို အရင်ရှာမယ်
    const result: any = await db
      .prepare("SELECT * FROM keys WHERE key = ?")
      .bind(key)
      .first();

    // ၂။ Key မတွေ့ရင် အမှားပြမယ်
    if (!result) {
      return NextResponse.json({ valid: false, message: "Key မမှန်ပါ (သို့) သုံးပြီးသားဖြစ်နေပါပြီ" }, { status: 404 });
    }

    // ၃။ Key မှန်ရင် Database ထဲကနေ ချက်ချင်းဖျက်ပစ်မယ် (တစ်ခါသုံးအတွက် အကောင်းဆုံး)
    await db.prepare("DELETE FROM keys WHERE key = ?").bind(key).run();

    return NextResponse.json({ valid: true, message: "Key အောင်မြင်စွာ အတည်ပြုပြီးပါပြီ" }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ valid: false, message: "Server Error ဖြစ်နေသည်" }, { status: 500 });
  }
}