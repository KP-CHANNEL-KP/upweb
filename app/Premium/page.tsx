'use client';
import { useState, useEffect } from 'react'; // useEffect ထည့်ထားတယ်
import { Crown, Key, Loader2 } from 'lucide-react';

export default function PremiumPage() {
  const [selectedKey, setSelectedKey] = useState<any>(null); // Plan အပြည့်အစုံသိမ်းဖို့
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null); // Order ID သိမ်းဖို့
  const [result, setResult] = useState<any>(null); // Key ရလာရင် သိမ်းဖို့

  const keys = [
    { name: '1 GB Plan', gb: 1, price: '50 MMK' },
    { name: '10 GB Plan', gb: 10, price: '500 MMK' },
    { name: '100 GB Plan', gb: 100, price: '5,000 MMK' },
    { name: '500 GB Plan', gb: 500, price: '25,000 MMK' },
    { name: '1000 GB Plan', gb: 1000, price: '50,000 MMK' },
  ];

  // 1. Order တင်ခြင်း (API Route: /api/buy ကိုသုံးပါ)
  const handleCreateKey = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/buy', { 
        method: 'POST', 
        body: JSON.stringify({ plan: selectedKey.name }) 
      });
      const data = (await response.json()) as { id: string };
      setOrderId(data.id); // Database ID ရလာရင် စောင့်ကြည့်ဖို့ စတင်မယ်
    } catch (error) {
      alert("Order တင်ရာတွင် အမှားဖြစ်ပွားနေပါသည်။");
    } finally {
      setLoading(false);
    }
  };

  // 2. Key ထွက်လာမလား ၃ စက္ကန့်တစ်ခါ စစ်ခြင်း (Polling)
  useEffect(() => {
    if (!orderId || result) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/check-status?id=${orderId}`);
      const data: any = await res.json();
      
      if (data?.status === 'completed') {
        setResult(data);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, result]);

  return (
    <main className="min-h-screen bg-[#020617] text-gray-100 p-4 md:p-8">
      {/* Plan Selection UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {keys.map((key, index) => (
          <div 
            key={index}
            onClick={() => setSelectedKey(key)}
            className={`p-6 rounded-2xl border cursor-pointer ${selectedKey?.name === key.name ? 'bg-[#1e293b] border-yellow-500' : 'bg-[#0f172a] border-white/10'}`}
          >
            <h2 className="text-xl font-bold">{key.name}</h2>
            <p className="text-2xl font-bold text-yellow-400 my-4">{key.price}</p>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="mt-12 text-center">
        <button 
          disabled={!selectedKey || loading || orderId !== null}
          onClick={handleCreateKey}
          className="bg-emerald-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto"
        >
          {loading ? <Loader2 className="animate-spin" /> : orderId ? "Key ထုတ်ပေးနေသည်..." : "ငွေပေးချေမည်"}
        </button>
        
        {/* Result Box */}
        {result && (
          <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500 rounded-xl">
            <p className="text-emerald-400 font-bold">သင်၏ Key ရရှိပါပြီ:</p>
            <code className="block bg-black p-2 mt-2 break-all">{result.access_url}</code>
          </div>
        )}
      </div>
    </main>
  );
}