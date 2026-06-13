export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json() as { plan: string };
    const { plan } = body;

    // Database ကို လုံးဝမသုံးဘဲ Mock Data ပြန်ပေးမယ်
    const mockKey = "TEST-" + Math.random().toString(36).substring(7).toUpperCase();

    return new Response(JSON.stringify({ 
      id: "order_12345", 
      message: "Success",
      key: mockKey,
      plan: plan
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}