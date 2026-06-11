'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Wallet, CreditCard, History, ChevronRight } from 'lucide-react';

// ... (Interface များမှာ အတူတူပင်ဖြစ်သည်)

export default function TopUpPage() {
  const [user, setUser] = useState<any>(null); // စမ်းသပ်ရန်အတွက် user ကို object ပုံစံထားပါ
  const [banned, setBanned] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  // ... (handleCredentialResponse အပိုင်းများ)

  return (
    <main className="min-h-screen bg-[#020617] text-gray-100 p-4 md:p-8 flex items-center justify-center">
      {!user ? (
        // Login State
        <div className="w-full max-w-md bg-[#0f172a]/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wallet size={40} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to KP TopUp</h1>
          <p className="text-gray-400 mb-8">သင်၏အကောင့်ဖြင့် ဆက်လက်ဆောင်ရွက်ပါ</p>
          <div id="googleSignIn" className="flex justify-center"></div>
        </div>
      ) : (
        // Dashboard State
        <div className="w-full max-w-lg space-y-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between bg-[#0f172a] p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <img src={user.photo} className="w-12 h-12 rounded-full border-2 border-emerald-500" />
              <div>
                <h2 className="font-bold">{user.name}</h2>
                <p className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">လက်ကျန်ငွေ</p>
              <p className="text-xl font-bold text-emerald-400">5,000 Coin</p>
            </div>
          </div>

          {/* Top Up Actions */}
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><CreditCard size={18}/> ငွေဖြည့်မည်</h3>
            <input 
              placeholder="ငွေပမာဏ ရိုက်ထည့်ပါ..." 
              className="w-full bg-[#020617] p-4 rounded-xl border border-white/10 outline-none focus:border-emerald-500 transition"
            />
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition">Confirm Top Up</button>
          </div>

          {/* History */}
          <button className="w-full flex items-center justify-between bg-[#0f172a] p-4 rounded-xl border border-white/5 hover:border-emerald-500/50 transition">
            <span className="flex items-center gap-2"><History size={18}/> ငွေဖြည့်မှတ်တမ်း</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </main>
  );
}