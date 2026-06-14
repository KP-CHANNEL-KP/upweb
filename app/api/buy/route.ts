import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json() as { plan: string };
    const db = process.env.DB as any;

    // 1. Database ထဲတွင် Order အသစ်ထည့်ခြင်း (Status 'pending')
    await db.prepare("INSERT INTO orders (plan, status) VALUES (?, ?)")
      .bind(plan, 'pending')
      .run();

    const orderRow = await db.prepare("SELECT last_insert_rowid() as id").first();
    const orderId = orderRow?.id;

    // 2. VPS Outline API ကို တိုက်ရိုက်ခေါ်ခြင်း
    // သင့် API URL: https://premium.kpchannel.cc.cd:56847/qHEeZdkH2_qrnRZkdRjwgQ/access-keys
    const VPS_API_URL = "https://premium.kpchannel.cc.cd:56847/qHEeZdkH2_qrnRZkdRjwgQ/access-keys";
    
    const response = await fetch(VPS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error("Failed to create key on VPS");

    const keyData = await response.json(); // Outline က ပေးတဲ့ data (ဥပမာ accessUrl)

    // 3. Database ထဲတွင် Key အောင်မြင်ကြောင်း Update လုပ်ခြင်း
    await db.prepare("UPDATE orders SET status = 'completed', access_url = ? WHERE id = ?")
      .bind(keyData.accessUrl, orderId)
      .run();

    // 4. Frontend သို့ အောင်မြင်ကြောင်း ပြန်ပို့ပေးခြင်း
    return NextResponse.json({ 
      id: orderId, 
      status: 'completed', 
      access_url: keyData.accessUrl 
    });

  } catch (error) {
    console.error("Buy API Error:", error);
    return NextResponse.json({ error: 'Failed to process key creation' }, { status: 500 });
  }
}