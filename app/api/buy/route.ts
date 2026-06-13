export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as Record<string, any> | null;
    if (!body || !('plan' in body)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
    }

    const { plan } = body as { plan: string };

    // ၁။ VPS API ကို ခေါ်ယူခြင်း (Outline/Access Key ပုံစံ)
    // မင်းရဲ့ Panel URL က https://104.207.76.252:22375/HJwkZ7wxI91jTmcr4oEDZQ ဖြစ်တဲ့အတွက်
    // access_keys endpoint ကို အသုံးပြုရပါမယ်။
    const vpsUrl = "https://104.207.76.252:22375/HJwkZ7wxI91jTmcr4oEDZQ/access-keys";

    const response = await fetch(vpsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`VPS API Error: ${response.statusText}`);
    }

    const vpsData = await response.json() as Record<string, any> | null;

    // ၂။ VPS ကနေရလာတဲ့ Key ကို အောင်မြင်စွာ ပြန်ပို့ပေးခြင်း
    return new Response(JSON.stringify({ 
      id: "order_" + Date.now(),
      message: "Success",
      access_url: (vpsData && (vpsData.accessUrl ?? vpsData.access_url)) || "Key generation failed", // VPS ကပေးတဲ့ URL
      plan: plan
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    // console.log နဲ့ အမှားကို ရိုက်ထုတ်ကြည့်ပါ
    console.error("API Error Details:", e); 
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : String(e),
      details: "VPS connection failed" 
    }), { status: 500 });
  }
}