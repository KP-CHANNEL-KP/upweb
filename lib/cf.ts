// lib/cf.ts
//
// Cloudflare Pages ပေါ်မှာ deploy လုပ်ထားရင် D1/KV binding တွေနဲ့ dashboard ထဲ
// ထည့်ထားတဲ့ environment variable/secret တွေကို ဒီ helper ကနေတစ်ဆင့် ရယူပါမယ်.
// (process.env.XXX နဲ့ တိုက်ရိုက် ဖတ်မရတဲ့ variable တွေ ပါနိုင်လို့ getRequestContext()
// ကနေ ရယူတာ ပိုစိတ်ချရပါတယ်)
//
// Setup လိုအပ်ချက်:
// 1. `npm install @cloudflare/next-on-pages` (Cloudflare Pages Next.js preset ထဲမှာ
//    အများအားဖြင့် ပါပြီးသားဖြစ်ပါလိမ့်မယ်)
// 2. Cloudflare dashboard → Workers & Pages → D1 → Create database (e.g. "kp-orders")
// 3. migrations/0001_create_orders.sql ကို D1 Console tab ထဲမှာ run ပါ
// 4. Pages project → Settings → Functions → D1 database bindings
//    → Variable name: DB , Database: kp-orders ကို ချိတ်ပါ
// 5. Pages project → Settings → Environment variables ထဲ ထည့်ပါ:
//    TELEGRAM_BOT_TOKEN_2, TELEGRAM_CHAT_ID_2, ADMIN_SECRET

import { getRequestContext } from '@cloudflare/next-on-pages';

export type CloudflareEnv = {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN_2?: string;
  TELEGRAM_CHAT_ID_2?: string;
  ADMIN_SECRET?: string;
};

export function getEnv(): CloudflareEnv {
  return getRequestContext().env as unknown as CloudflareEnv;
}