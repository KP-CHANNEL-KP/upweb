import { D1Database } from '@cloudflare/workers-types';

declare module 'cloudflare:test' {
  interface ProvidedEnv extends Record<string, unknown> {
    DB: D1Database;
  }
}

// Next.js မှာ သုံးဖို့အတွက် ဒီလိုထည့်ပါ
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
    }
  }
}