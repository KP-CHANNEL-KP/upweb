'use client';
import { useState, useEffect } from 'react';

export default function Popup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Page ဝင်ဝင်ချင်း Popup ပေါ်စေရန်
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-red-500 rounded-3xl p-8 max-w-sm w-full text-center relative">
        <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold">✕</button>
        <h2 className="text-2xl font-bold text-red-500 mb-4">Premium Vpn Key ဝယ်ယူရန်</h2>
        <div className="text-gray-300 space-y-2 mb-6">
          <p>❄ 1 Month - 5000 Ks - Umlimit Data</p>
          <p>❄ 3 Months - 10000 Ks - Umlimit Data</p>
          <p>❄ 6 Months - 20000 Ks - Umlimit Data</p>
          <p>❄ 200 GB - 5000 Ks - Umlimit Date</p>
          <p>❄ 400 GB - 9000 Ks - Umlimit Date</p>
          <p>❄ 1000 GB - 15000 Ks - Umlimit Date</p>
        </div>
        <div className="space-y-3">
          <a href="https://t.me/KP_CHANNEL_KP" className="block bg-blue-600 py-2 rounded-xl font-bold text-white">Telegram Channel</a>
          <a href="https://www.facebook.com/share/1CmNvtjsp8" className="block bg-blue-800 py-2 rounded-xl font-bold text-white">Facebook Page</a>
          <a href="viber://add?number=959769043594" className="block bg-blue-600 py-2 rounded-xl font-bold text-white">Viber</a>
        </div>
      </div>
    </div>
  );
}