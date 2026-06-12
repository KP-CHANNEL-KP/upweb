import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, plan } = await req.json() as { userId: string; plan: string };
  const id = crypto.randomUUID();
  
  // D1 Database ထဲသို့ ထည့်ခြင်း
  await process.env.DB.prepare(
    "INSERT INTO orders (id, user_id, plan, status) VALUES (?, ?, ?, ?)"
  ).bind(id, userId, plan, 'pending').run();

  return NextResponse.json({ id }); // ဒီ ID ကို Frontend က Noti Box မှာ သုံးမယ်
}