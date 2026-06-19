'use client';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Banner from '../components/Banner';

interface KeyItem { key: string; ping: number; }

export default function FreePage() {
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');

 useEffect(() => {
  const loadKeys = async () => {
    try {
      const res = await fetch('https://webbot.kpchannel.cc.cd/fetch-keys-with-ping');
      const rawData = (await res.json()) as KeyItem[];
      
      // Ping စစ်စရာမလိုတော့လို့ Data ကို ချက်ချင်းပြမယ်
      // UI မှာ 0ms လို့မပေါ်အောင် status အနေနဲ့ သုံးမယ်
      setKeys(rawData); 
    } catch (error) {
      console.error("Failed to load keys:", error);
      toast.error("VPN Keys များရယူရန် အဆင်မပြေဖြစ်နေသည်");
    }
  };
  loadKeys();
}, []);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Copied to clipboard!', { style: { background: '#10b981', color: '#fff' } });
  };

  const handleVerify = async () => {
    try {
      const res = await fetch('https://webbot.kpchannel.cc.cd/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: verifyInput })
      });
      const data = await res.json() as { valid: boolean; message?: string };
      if (data.valid) {
        setIsVerified(true);
      } else {
        setMessage(data.message || "Key မမှန်ပါ သို့မဟုတ် အသုံးပြုပြီးသား ဖြစ်နေသည်");
      }
    } catch {
      setMessage("Connection Error ဖြစ်နေသည်");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 p-6 flex justify-center text-gray-100">
      <Toaster />
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-10 text-emerald-400">V2ray free Keys များ Admin မှ ပြန်ပိတ်ထားပါသည်။ဝယ်ယူလိုပါက Viber - 09769043594 သို့ ဆက်သွယ်ပါ။</h1>
        
        {!isVerified ? (
          <div className="bg-slate-800 p-8 rounded-2xl border border-emerald-500/30 text-center">
            <h2 className="mb-4 text-xl">Vpn Key များအား အသုံးပြုလိုပါက Bot မှ Key သွားယူထည့်ပါ။</h2>
            <input 
              className="w-full p-4 mb-4 bg-black/30 rounded-xl border border-white/10 outline-none focus:border-emerald-500"
              placeholder="Enter Access Key..."
              onChange={(e) => setVerifyInput(e.target.value)}
            />
            <button onClick={handleVerify} className="w-full bg-emerald-600 hover:bg-emerald-500 p-3 rounded-lg font-bold transition">အတည်ပြုမည်</button>
            <div className="mt-6 pt-6 border-t border-white/10">
              <a href="https://t.me/KP_WEB_KEY_BOT" target="_blank" className="block w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-bold transition">🚀 Telegram Bot သို့သွားရန်</a>
            </div>
            {message && <p className="text-red-400 mt-4">{message}</p>}
          </div>
        ) : (
          <>
            <input 
              className="w-full p-4 mb-8 bg-slate-800 rounded-xl border border-emerald-500/30 outline-none focus:border-emerald-500"
              placeholder="🔎 ရှာရန် (ဥပမာ - Server 1)..." 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <div className="grid grid-cols-1 gap-6">
              {keys.filter(k => k.key.includes(searchTerm)).map((item, index) => (
                <div key={index} className="bg-slate-800/50 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/50 transition duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-emerald-400">VPN Server {index + 1}</h3>
                    
<span className={`text-xs px-2 py-1 rounded ${item.ping === 0 ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
  {item.ping === 0 ? 'Active' : `${item.ping}ms`}
</span>
                  </div>
                  <div className="w-full bg-black/30 p-4 rounded-lg text-xs font-mono text-gray-300 break-all mb-4 border border-white/5 h-20 overflow-y-auto">
                    {item.key}
                  </div>
                  <button onClick={() => handleCopy(item.key)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-2 rounded-lg transition">COPY</button>
                  <div className="mt-6 border-t border-white/5 pt-4"><Banner /></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}