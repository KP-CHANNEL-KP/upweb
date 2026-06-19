'use client';
import { useState } from 'react';
import Banner from '../components/Banner';

export default function VPNFilesPage() {
  const [key, setKey] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');

  const vpnFiles = [
    { name: "KP ATOM + COMBO (HTTP INJECTOR)", url: "/vpnfiles/KP_ATOM_+_COMBO.ehi", speed: "High Speed" },
    { name: "KP MPT GAME PLAN (HTTP INJECTOR)", url: "/vpnfiles/KP_MPT_GAME_PLAN.ehi", speed: "High Speed" },
    { name: "KP STARLINK RUIJIE OLD (HTTP INJECTOR)", url: "/vpnfiles/KP_RUIJIE_OLD.ehi", speed: "High Speed" },
  ];

  const handleVerify = async () => {
    const res = await fetch('/api/verify-key', {
      method: 'POST',
      body: JSON.stringify({ key }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = (await res.json()) as any;

    if (data.valid) {
      setIsVerified(true);
    } else {
      setMessage(data.message || "Key မမှန်ပါ။");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 p-6 flex justify-center text-gray-100">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-10 text-emerald-400">File များ Admin မှ ပြန်ပိတ်ထားပါသည်။ဝယ်ယူလိုပါက Viber - 09769043594 သို့ ဆက်သွယ်ပါ။</h1>

        {!isVerified ? (
          <div className="bg-slate-800 p-8 rounded-2xl border border-emerald-500/30 text-center">
            <h2 className="mb-4 text-xl">Vpn ဖိုင်များ Download ရယူရန် Key ထည့်ပေးပါ</h2>
            <input 
              type="text" 
              placeholder="Enter Access Key..." 
              value={key} 
              onChange={(e) => setKey(e.target.value)}
              className="w-full p-4 mb-4 bg-black/30 rounded-xl border border-white/10 outline-none focus:border-emerald-500 transition"
            />
            <button 
              onClick={handleVerify} 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-black p-3 rounded-lg font-bold transition"
            >
              အတည်ပြုမည်
            </button>

            {/* Telegram Bot Link Section */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-gray-400 mb-3 text-sm">Key မရှိသေးပါက အောက်ပါ Bot တွင်ရယူပါ</p>
              <a 
                href="https://t.me/KP_WEB_KEY_BOT" 
                target="_blank" 
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition"
              >
                🚀 Telegram Bot သို့သွားရန်
              </a>
            </div>

            {message && <p className="text-red-400 mt-4">{message}</p>}
          </div>
        ) : (
          <div className="space-y-6">
            {vpnFiles.map((file, index) => (
              <div key={index} className="bg-slate-800/50 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/50 transition duration-300">
                <a 
                  href={file.url} 
                  download 
                  className="flex justify-between items-center"
                >
                  <div className="text-left">
                    <strong className="block text-lg text-emerald-400">{file.name}</strong>
                    <small className="text-gray-400">{file.speed}</small>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/50 font-bold">
                    Download
                  </span>
                </a>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <Banner />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}