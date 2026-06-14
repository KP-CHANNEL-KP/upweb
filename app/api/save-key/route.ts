import { NextResponse } from 'next/server';

export const runtime = 'edge';

// API request body အတွက် Data type သတ်မှတ်ခြင်း
interface SaveKeyRequest {
  orderId: number | string;
  key: string;
}

export async function POST(req: Request) {
  try {
    // Request ကလာတဲ့ data ကို type သတ်မှတ်ပြီး ဖတ်ယူခြင်း
    const body: SaveKeyRequest = await req.json();
    const { orderId, key } = body;
    
    // Cloudflare D1 binding ကို ခေါ်ယူခြင်း
    const db = process.env.DB as any;

    // Database ထဲမှာ order_id ကို ရှာပြီး Key ထည့် + Status ပြောင်း
    // bind(key, orderId) သည် အစဉ်လိုက်အတိုင်းဖြစ်ရပါမည်
    // app/api/save-key/route.ts တွင် ပြင်ရန်
await db.prepare(
  "UPDATE orders SET access_url = ?, status = 'completed' WHERE id = ?"
)
.bind(key, orderId) // orderId သည် Database ရှိ id နှင့် data type တူရပါမည်
.run();

    return NextResponse.json({ success: true, message: "Key updated successfully" });
  } catch (error) {
    console.error("SaveKey Error:", error);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}