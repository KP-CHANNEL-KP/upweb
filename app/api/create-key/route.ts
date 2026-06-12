// app/api/create-key/route.ts
import { NextResponse } from 'next/server';
import https from 'https';

// Outline VPS က Self-signed certificate သုံးထားတဲ့အတွက် 
// ဒါကို အသုံးပြုမှ SSL error မတက်မှာပါ
const httpsAgent = new https.Agent({ 
  rejectUnauthorized: false 
});

export async function POST() {
  const OUTLINE_API_URL = process.env.OUTLINE_API_URL;

  if (!OUTLINE_API_URL) {
    return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
  }

  try {
    // VPS ဆီသို့ Key အသစ်ထုတ်ပေးဖို့ Request ပို့ခြင်း
    const response = await fetch(`${OUTLINE_API_URL}/access-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      agent: httpsAgent,
    } as RequestInit & { agent?: https.Agent });

    if (!response.ok) {
      throw new Error('Failed to connect to Outline server');
    }

    const data = await response.json();
    
    // ထွက်လာတဲ့ Key အချက်အလက်ကို ပြန်ပို့ပေးခြင်း
    return NextResponse.json(data);
  } catch (error) {
    console.error('Outline API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}