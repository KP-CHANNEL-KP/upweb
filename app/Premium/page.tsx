// app/Premium/page.tsx
'use client';
import { useState } from 'react';
import { Crown, Check, Key } from 'lucide-react';

export default function PremiumPage() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const keys = [
    { name: 'Basic Key', price: '5,000 MMK', days: '30 Days' },
    { name: 'Pro Key', price: '12,000 MMK', days: '90 Days' },
    { name: 'Elite Key', price: '20,000 MMK', days: '180 Days' },
  ];

  return (
    <main className="min-h-screen bg-[#020617] text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <Crown size={48} className="text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Premium Keys ဝယ်ယူရန်</h1>
          <p className="text-gray-400">သင်၏ Outline Key ကို ရွေးချယ်ပြီး အဆင့်မြှင့်တင်ပါ</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {keys.map((key, index) => (
            <div 
              key={index}
              onClick={() => setSelectedKey(key.name)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedKey === key.name 
                  ? 'bg-[#1e293b] border-yellow-500' 
                  : 'bg-[#0f172a] border-white/10 hover:border-white/30'
              }`}
            >
              <h2 className="text-xl font-bold mb-2">{key.name}</h2>
              <p className="text-2xl font-bold text-yellow-400 mb-4">{key.price}</p>
              <ul className="space-y-2 mb-6 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Check size={16}/> {key.days}</li>
                <li className="flex items-center gap-2"><Check size={16}/> High Speed</li>
                <li className="flex items-center gap-2"><Check size={16}/> No Ads</li>
              </ul>
              <button className="w-full bg-yellow-500/10 text-yellow-500 py-2 rounded-lg font-bold border border-yellow-500/20">
                ရွေးချယ်မည်
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#0f172a] p-8 rounded-2xl border border-white/5 text-center">
          <Key size={32} className="text-emerald-400 mx-auto mb-4" />
          <h3 className="font-bold mb-2">ငွေပေးချေမှုအချက်အလက်</h3>
          <p className="text-gray-400 mb-6">ရွေးချယ်ထားသော Key အတွက် ငွေပေးချေရန် အောက်ပါ Button ကိုနှိပ်ပါ</p>
          <button className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold transition">
            ငွေပေးချေမည် (Confirm)
          </button>
        </div>
      </div>
    </main>
  );
}