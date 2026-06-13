export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // ၁။ Body ရှိမရှိ စစ်ဆေးခြင်း
    const body = await req.json().catch(() => null) as Record<string, any> | null;
    if (!body || !('plan' in body)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
    }

    const { plan } = body as { plan: string };

    // ၂။ Mock Key ဖန်တီးခြင်း
    const mockKey = "TEST-" + Math.random().toString(36).substring(7).toUpperCase();

    // ၃။ အောင်မြင်ကြောင်း ပြန်ပေးခြင်း
    return new Response(JSON.stringify({ 
      id: "order_" + Date.now(), // ID ကို အချိန်နဲ့အမျှ ပြောင်းသွားအောင် လုပ်ပေးလိုက်တယ်
      message: "Success",
      key: mockKey,
      plan: plan
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    // ၄။ Error ဖြစ်ခဲ့ရင် ဘာကြောင့်လဲဆိုတာကို သိသာအောင် ထုတ်ပေးခြင်း
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 500 });
  }
}