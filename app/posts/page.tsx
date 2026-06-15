'use client';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ClipboardCopy } from 'lucide-react';
import Banner from '../components/Banner';

export default function PostsPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [message, setMessage] = useState('');

  const posts = [
    { num: "၀၁", title: "Outline Key", date: "Premium High Speed", desc: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTo3NXg4YTUxNnNoOTNrM2Vz@104.207.77.150:55265?type=tcp#KP PREMIUM OUTLINE FREE 1" },
    { num: "၀၂", title: "Outline Key", date: "Premium High Speed", desc: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTp3cnVsNmFteGVncHpxcGUy@104.207.77.150:55265?type=tcp#KP PREMIUM OUTLINE FREE 2" },
    { num: "၀၃", title: "Outline Key", date: "Premium High Speed", desc: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTp1N2p3dW15OHVsZTVwbTVr@104.207.77.150:55265?type=tcp#KP PREMIUM OUTLINE FREE 3" },
    { num: "၀၄", title: "Outline Key", date: "Premium High Speed", desc: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNToxZGhoeXR1bGo4ZW5vdGpl@104.207.77.150:55265?type=tcp#KP PREMIUM OUTLINE FREE 4" },
    { num: "၀၅", title: "Outline Key", date: "Premium High Speed", desc: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpyYWp0eTZydTkzcXh4azhk@104.207.77.150:55265?type=tcp#KP PREMIUM OUTLINE FREE 5" },
    { num: "၀၆", title: "Starlink OLd Free", date: "Http Injector Vpn ထဲမှာ ထည့်သွင်းအသုံးပြုပါ။", desc: "hb2wpXSr" },
  ];

  const handleCopy = (desc: string) => {
    navigator.clipboard.writeText(desc);
    toast.success('Key ကို Copy ယူပြီးပါပြီ!', { 
      style: { background: '#0f172a', color: '#10b981', border: '1px solid #10b981' } 
    });
  };

  const handleVerify = async () => {
    try {
      const res = await fetch('https://webbot.kpchannel.cc.cd/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: verifyInput.trim() })
      });
      const data = await res.json() as { valid: boolean; message?: string };
      
      if (data.valid) {
        setIsVerified(true);
        toast.success("အတည်ပြုပြီးပါပြီ!");
      } else {
        setMessage(data.message || "Key မမှန်ပါ သို့မဟုတ် အသုံးပြုပြီးသား ဖြစ်နေသည်");
      }
    } catch {
      setMessage("Connection Error ဖြစ်နေသည်");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 p-6 flex justify-center text-gray-100">
      <Toaster position="top-center" />
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-10 text-emerald-400">Outline free Keys များသည် free ဖြစ်သောကြောင့် အချိတ်မရွေး Admin မှ ပြန်ပိတ်နိုင်သည်။</h1>

        {!isVerified ? (
          <div className="bg-slate-800 p-8 rounded-2xl border border-emerald-500/30 text-center">
            <h2 className="mb-4 text-xl">ပို့စ်များအားလုံးကို ကြည့်ရှုရန် Key ထည့်ပေးပါ</h2>
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
          <div className="posts-list grid gap-6">
            {posts.map((post, index) => (
              <div key={index} className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-emerald-500/50 transition duration-300">
                
                {/* ပို့စ်အချက်အလက် */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-slate-700">{post.num}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-400">{post.title}</h3>
                    <p className="text-xs text-slate-400">{post.date}</p>
                  </div>
                </div>

                {/* Key ပြသသည့်နေရာ (Copy လုပ်ရမည့်စာသား) */}
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 font-mono text-xs text-gray-300 break-all">
                  {post.desc}
                </div>

                {/* Copy ခလုတ် */}
                <button 
                  onClick={() => handleCopy(post.desc)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 p-3 rounded-xl transition-all active:scale-95 border border-emerald-500/20"
                >
                  <ClipboardCopy size={20} />
                  <span className="font-bold">COPY KEY</span>
                </button>
              </div>
            ))}
            <div className="mt-6"><Banner /></div>
          </div>
        )}
      </div>
    </main>
  );
}