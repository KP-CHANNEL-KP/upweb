'use client';
import { useState } from 'react';
import { Crown, Check, Key, Loader2 } from 'lucide-react';

export default function PremiumPage() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateKeys = () => {
    const basePricePerGb = 50;
    const tiers = [1, 10, 100, 500, 1000, 2000];
    return tiers.map(gb => ({
      name: `${gb} GB Plan`,
      price: `${(gb * basePricePerGb).toLocaleString()} MMK`,
      gb: gb
    }));
  };

  const keys = generateKeys();

  const handleCreateKey = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-key', { method: 'POST' });
      const data = await response.json();
      
      if (data.accessUrl) {
        setResult(data);
        alert("အောင်မြင်စွာ Key ထုတ်ပြီးပါပြီ!");
      } else {
        alert("Key ထုတ်ယူရာတွင် အမှားဖြစ်ပွားနေပါသည်။");
      }
    } catch (error) {
      console.error(error);
      alert("Server ချိတ်ဆက်မှု အမှား။");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <Crown size={48} className="text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Premium Keys ဝယ်ယူရန်</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {keys.map((key, index) => (
            <div 
              key={index}
              onClick={() => setSelectedKey(key.name)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedKey === key.name ? 'bg-[#1e293b] border-yellow-500 scale-105' : 'bg-[#0f172a] border-white/10'
              }`}
            >
              <h2 className="text-xl font-bold">{key.name}</h2>
              <p className="text-2xl font-bold text-yellow-400 my-4">{key.price}</p>
              <button className="w-full bg-yellow-500/10 text-yellow-500 py-2 rounded-lg font-bold border border-yellow-500/20">
                {selectedKey === key.name ? 'ရွေးချယ်ထားပြီး' : 'ရွေးချယ်မည်'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#0f172a] p-8 rounded-2xl border border-white/5 text-center">
          <Key size={32} className="text-emerald-400 mx-auto mb-4" />
          <button 
            disabled={!selectedKey || loading}
            onClick={handleCreateKey}
            className={`px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 mx-auto ${
              selectedKey ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "ငွေပေးချေမည်"}
          </button>
          
          {result && (
            <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-left">
              <p className="text-emerald-400 font-bold">သင်၏ Key ရရှိပါပြီ:</p>
              <code className="text-xs break-all bg-black p-2 mt-2 block">{result.accessUrl}</code>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}