export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function POST() {
  const OUTLINE_API_URL = process.env.OUTLINE_API_URL;

  if (!OUTLINE_API_URL) {
    return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
  }

  try {
    // Cloudflare Edge မှာ https.Agent သုံးလို့မရပါ
    // ဒါကြောင့် fetch ကိုပဲ တိုက်ရိုက်သုံးရပါမယ်
    const response = await fetch(`${OUTLINE_API_URL}/access-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Edge runtime မှာတော့ SSL certificate ကို bypass လုပ်ဖို့ မလိုပါ (သို့မဟုတ် လိုအပ်ပါက Cloudflare စနစ်ကို သုံးရပါမယ်)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Outline API Response Error:', errorText);
      throw new Error(`Failed to connect to Outline server: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Outline API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
//