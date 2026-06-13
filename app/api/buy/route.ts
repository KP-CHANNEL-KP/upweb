export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as Record<string, any> | null;
    if (!body || !('plan' in body)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
    }

    const { plan } = body as { plan: string };

    // ၁။ VPS API ကို ခေါ်ယူခြင်း (Outline/Access Key ပုံစံ)
    // မင်းရဲ့ Panel URL က https://premium.kpchannel.cc.cd:22375/HJwkZ7wxI91jTmcr4oEDZQ ဖြစ်တဲ့အတွက်
    // access_keys endpoint ကို အသုံးပြုရပါမယ်။
    const vpsUrl = "http://premium.kpchannel.cc.cd:22375/HJwkZ7wxI91jTmcr4oEDZQ/access-keys";

    const response = await fetch(vpsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    // VPS က ပေးတဲ့ raw text ကို အရင်ဖတ်မယ်
    const errorText = await response.text(); 
    
    if (!response.ok) {
      throw new Error(`Status: ${response.status} | Body: ${errorText}`);
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
  // error message ကို တိုက်ရိုက်ပြန်ပို့ပေးမယ်
  const errorMessage = e instanceof Error ? e.message : String(e);
  return new Response(JSON.stringify({ 
    error: "Connection Error",
    details: errorMessage 
  }), { status: 500 });
  }
}