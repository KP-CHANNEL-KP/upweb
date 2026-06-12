export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function POST() {
  const OUTLINE_API_URL = process.env.OUTLINE_API_URL;

  if (!OUTLINE_API_URL) {
    return NextResponse.json({ error: 'Config missing' }, { status: 500 });
  }

  try {
    // SSL certificate error မတက်အောင် rejectUnauthorized: false လုပ်ချင်ရင် 
    // Cloudflare Edge မှာတော့ ဒီအတိုင်း တိုက်ရိုက်ခေါ်ရပါမယ်
    const response = await fetch(`${OUTLINE_API_URL}/access-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('API connection failed');
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}