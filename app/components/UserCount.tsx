'use client';

import { useEffect, useState } from 'react';

export default function UserCount() {
  const [count, setCount] = useState<number | null>(null);
  const [keys, setKeys] = useState<Array<{ id: string; name: string; key: string }>>([]);

  useEffect(() => {
    // ၁။ User Count ကို fetch လုပ်ခြင်း
    fetch('https://webbot.kpchannel.cc.cd/user-count')
      .then((res) => res.json() as Promise<{ count: number }>)
      .then((data) => setCount(data.count))
      .catch((err) => console.error("Error fetching user count:", err));

    // ၂။ Ping ပါတဲ့ Key တွေကို fetch လုပ်ခြင်း (အသစ်ပြင်ထားတဲ့ API)
    fetch('https://webbot.kpchannel.cc.cd/fetch-keys-with-ping')
      .then((res) => res.json() as Promise<Array<{ key: string; ping: number }>>)
      .then((data) => {
        const formattedKeys = data.map((item, index) => ({
          id: index.toString(),
          name: `VPN Server ${index + 1} (${item.ping === 999 ? 'Timeout' : item.ping + 'ms'})`,
          key: item.key,
        }));
        setKeys(formattedKeys);
      })
      .catch((err) => console.error("Error fetching keys with ping:", err));
  }, []); // [] ထည့်ထားတဲ့အတွက် Page ပွင့်လာချိန်မှာ တစ်ခါပဲ အလုပ်လုပ်ပါမယ်

  // Data မရောက်သေးရင် ဘာမှမပြဘဲနေဖို့ (Layout မှာ အဆင်ပြေအောင်)
  if (count === null) return <div className="text-xs text-gray-500">Loading...</div>;

  return (
    <div className="text-center text-xs md:text-sm">
      <span className="text-gray-400">စုစုပေါင်းအသုံးပြုသူ - </span>
      <span className="text-emerald-400 font-bold">{count} ယောက်</span>
    </div>
  );
}