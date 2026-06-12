'use client';
import { useState } from 'react';
import { Wallet, CreditCard, History, ChevronRight } from 'lucide-react';

export default function TopUpPage() {
  // Google Sign-In ကို ခဏဖြုတ်ထားပြီး Testing အတွက် user ကို default တန်ဖိုးပေးထားပါတယ်
  const [user, setUser] = useState<any>({
    name: "KP User",
    photo: "https://ui-avatars.com/api/?name=KP+User",
    id: "kp1234567890"
  });

  return (
    <main className="min-h-screen bg-[#020617] text-gray-100 p-4 md:p-8 flex items-center justify-center">
      {/* အကယ်၍ နောက်ပိုင်းမှာ Google Login ကို ပြန်သုံးချင်ရင် 
         {!user ? ( ... ) : ( ... )} ဆိုတဲ့ logic အတိုင်း ပြန်သုံးလို့ရပါတယ်
      */}
      
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
            type="number"
            placeholder="ငွေပမာဏ ရိုက်ထည့်ပါ..." 
            className="w-full bg-[#020617] p-4 rounded-xl border border-white/10 outline-none focus:border-emerald-500 transition"
          />
          <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition">
            Confirm Top Up
          </button>
        </div>

        {/* History */}
        <button className="w-full flex items-center justify-between bg-[#0f172a] p-4 rounded-xl border border-white/5 hover:border-emerald-500/50 transition">
          <span className="flex items-center gap-2"><History size={18}/> ငွေဖြည့်မှတ်တမ်း</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </main>
  );
}