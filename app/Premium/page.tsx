'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function PremiumPage() {
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const keys = [
    { name: '1 GB Plan', gb: 1, price: '50 MMK' },
    { name: '10 GB Plan', gb: 10, price: '500 MMK' },
    { name: '100 GB Plan', gb: 100, price: '5,000 MMK' },
    { name: '500 GB Plan', gb: 500, price: '25,000 MMK' },
    { name: '1000 GB Plan', gb: 1000, price: '50,000 MMK' },
  ];

  const handleCreateKey = async () => {
    if (!selectedKey) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/buy', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedKey.name }) 
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Order တင်ရာတွင် အမှားဖြစ်ပွားသည်");
      
      setOrderId(data.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId || result) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-status?id=${orderId}`);
        const data = await res.json();

        if (data?.status === 'completed') {
          setResult(data);
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Status စစ်ဆေးရာတွင် အမှားဖြစ်ပွားသည်");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, result]);

  return (
    <main className="min-h-screen bg-[#020617] text-gray-100 p-4 md:p-8">
      {error && <div className="text-red-500 text-center mb-4 p-2 bg-red-900/20 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {keys.map((key, index) => (
          <div 
            key={index}
            onClick={() => !orderId && setSelectedKey(key)} // order တင်နေရင် မနှိပ်နိုင်အောင်
            className={`p-6 rounded-2xl border cursor-pointer transition-all ${selectedKey?.name === key.name ? 'bg-[#1e293b] border-yellow-500' : 'bg-[#0f172a] border-white/10 hover:border-white/30'}`}
          >
            <h2 className="text-xl font-bold">{key.name}</h2>
            <p className="text-2xl font-bold text-yellow-400 my-4">{key.price}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button 
          disabled={!selectedKey || loading || !!orderId}
          onClick={handleCreateKey}
          className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto disabled:bg-gray-600 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" /> : orderId ? "Key စောင့်ဆိုင်းနေသည်..." : "ငွေပေးချေမည်"}
        </button>
        
        {result?.access_url && ( // access_url ရှိမှသာ ပြမည်
          <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500 rounded-xl max-w-lg mx-auto">
            <p className="text-emerald-400 font-bold">သင်၏ Key ရရှိပါပြီ:</p>
            <code className="block bg-black p-3 mt-2 break-all text-sm rounded">{result.access_url}</code>
          </div>
        )}
      </div>
    </main>
  );
}