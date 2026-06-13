export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as Record<string, any> | null;
    if (!body || !('plan' in body)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
    }

    const { plan } = body as { plan: string };

    // မင်းရရှိထားတဲ့ API URL အသစ်ကို ဒီမှာ အတိအကျ ထည့်ပါ
    // ဥပမာ: https://104.207.76.252:56847/qHEeZdkH2_qrnRZkdRjwgQ/access-keys
    const vpsUrl = "https://104.207.76.252:56847/qHEeZdkH2_qrnRZkdRjwgQ/access-keys";

    const response = await fetch(vpsUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: `User_${Date.now()}` }),
      // @ts-ignore
      cf: {
        // Outline ရဲ့ Self-signed certificate ကို လက်ခံပေးခြင်း
        rejectUnauthorized: false
      }
    });

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
      // တရားဝင် Outline API က accessUrl ကို ပေးပါတယ်
      access_url: vpsData.accessUrl || "Key generation failed",
      plan: plan
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ 
      error: "Connection Failed",
      details: e instanceof Error ? e.message : String(e)
    }), { status: 500 });
  }
}