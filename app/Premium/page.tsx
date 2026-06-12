'use client';
import { useState } from 'react';
import { Crown, Check, Key } from 'lucide-react';

export default function PremiumPage() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // ဈေးနှုန်းသတ်မှတ်ချက် (1GB = 50ks)
  const generateKeys = () => {
    const basePricePerGb = 50;
    const tiers = [1, 10, 100, 500, 1000, 2000]; // လိုချင်တဲ့ GB ပမာဏများကို ဒီမှာ ထည့်ပါ
    
    return tiers.map(gb => ({
      name: `${gb} GB Plan`,
      price: `${(gb * basePricePerGb).toLocaleString()} MMK`,
      gb: gb
    }));
  };

  const keys = generateKeys();

  return (
    <main className="min-h-screen bg-[#020617] text-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <Crown size={48} className="text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Premium Keys ဝယ်ယူရန်</h1>
          <p className="text-gray-400">သင်နှစ်သက်ရာ Data ပမာဏကို ရွေးချယ်ပါ</p>
        </header>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {keys.map((key, index) => (
            <div 
              key={index}
              onClick={() => setSelectedKey(key.name)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedKey === key.name 
                  ? 'bg-[#1e293b] border-yellow-500 scale-105' 
                  : 'bg-[#0f172a] border-white/10 hover:border-white/30'
              }`}
            >
              <h2 className="text-xl font-bold mb-2">{key.name}</h2>
              <p className="text-2xl font-bold text-yellow-400 mb-4">{key.price}</p>
              <ul className="space-y-2 mb-6 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Check size={16}/> High Speed Access</li>
                <li className="flex items-center gap-2"><Check size={16}/> No Expiry Date</li>
              </ul>
              <button className="w-full bg-yellow-500/10 text-yellow-500 py-2 rounded-lg font-bold border border-yellow-500/20">
                {selectedKey === key.name ? 'ရွေးချယ်ထားပြီး' : 'ရွေးချယ်မည်'}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Section */}
        <div className="mt-12 bg-[#0f172a] p-8 rounded-2xl border border-white/5 text-center">
          <Key size={32} className="text-emerald-400 mx-auto mb-4" />
          <h3 className="font-bold mb-2">ငွေပေးချေမှု</h3>
          <p className="text-gray-400 mb-6">
            {selectedKey ? `သင်ရွေးချယ်ထားသည်မှာ: ${selectedKey}` : 'ကျေးဇူးပြု၍ Plan တစ်ခုကို ရွေးချယ်ပါ'}
          </p>
          <button 
            disabled={!selectedKey}
            className={`px-8 py-3 rounded-xl font-bold transition ${
              selectedKey ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            ငွေပေးချေမည်
          </button>
        </div>
      </div>
    </main>
  );
}