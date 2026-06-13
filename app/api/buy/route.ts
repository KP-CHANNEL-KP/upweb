export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as Record<string, any> | null;
    if (!body || !('plan' in body)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
    }

    const { plan } = body as { plan: string };

    const API_KEY = "HJwkZ7wxI91jTmcr4oEDZQ";
    const vpsUrl = `http://premium.kpchannel.cc.cd:22375/${API_KEY}/access-keys`;

    // Outline API အတွက် အရေးကြီးဆုံးက Body ထဲမှာ Name ထည့်ပေးဖို့ပါ
    const response = await fetch(vpsUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        name: `User_${Date.now()}` 
      })
    });

    // Cloudflare Edge ကနေ VPS ကို ခေါ်တဲ့အခါ ဖြစ်တတ်တဲ့ 520 error ကို ရှောင်ဖို့
    // အကယ်၍ ဒီလိုနဲ့မှ မရရင် VPS Panel ထဲမှာ API ခေါ်ဆိုမှုတွေကို Log ကြည့်ရပါမယ်
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: "VPS Rejected", 
        status: response.status,
        details: errorText 
      }), { status: 502 });
    }

    const vpsData = await response.json() as Record<string, any>;

    return new Response(JSON.stringify({ 
      id: "order_" + Date.now(),
      message: "Success",
      access_url: vpsData.accessUrl || vpsData.access_url || "Failed",
      plan: plan
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ 
      error: "Connection Failed",
      details: String(e) 
    }), { status: 500 });
  }
}