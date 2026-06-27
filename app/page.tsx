import Link from 'next/link';

export default function Home() {
  return (
    <main className="text-gray-100">
      {/* Hero Section */}
      <section className="hero-section">
        <i className="fas fa-microchip hero-icon animate-pulse"></i>
        <h2 className="text-cyan-400 font-semibold uppercase tracking-widest mb-2">Tech Hub & VPN Services</h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">KP နှင့်အတူ သာယာသော နေ့များဆီသို့</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          လွယ်ကူမြန်ဆန်သော VPN ဝန်ဆောင်မှုများ၊ Free အသုံးပြုနိုင်မည့် Key များနှင့် နေ့စဉ် အပ်ဒိတ်များကို ဤနေရာတွင် ရယူလိုက်ပါ။
        </p>
        <Link href="/free" className="cta-button">
          FREE သုံးစရာများ ကြည့်ရန် <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </section>

      {/* Payment Grid */}
      <div className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-center text-3xl font-bold mb-12">ငွေလွှဲရန် Payment များ</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[ { name: 'Wave Pay', id: '09966955081' }, { name: 'KPay', id: '09966955081' } ].map((p) => (
            <div key={p.name} className="post-card">
              <div className="text-cyan-400 font-bold mb-2">{p.name}</div>
              <h3 className="text-2xl font-bold mb-2">{p.id}</h3>
              <p className="text-gray-400">ငွေလွှဲရန် အထက်ပါနံပါတ်ကိုသာ အသုံးပြုပေးပါခင်ဗျာ။</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6 text-center">
          {/* ဒီနေရာမှာ Link တွေကို အောက်ပါအတိုင်း ထည့်ပေးလိုက်ပါ */}
          {[
            { name: 'Facebook', url: 'https://www.facebook.com/share/1CmNvtjsp8/' },
            { name: 'YouTube', url: 'https://youtube.com/@kpchannel22' },
            { name: 'Telegram', url: 'https://t.me/KP_CHANNEL_KP' },
            { name: 'TikTok', url: 'https://tiktok.com/@kpbykp23' }
          ].map((s) => (
            <div key={s.name} className="p-6 bg-slate-800 rounded-2xl hover:bg-slate-700 transition">
              <h3 className="font-bold mb-2">{s.name}</h3>
              <a 
                href={s.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-400 text-sm hover:underline"
              >
                ဝင်ရောက်ကြည့်ရှုရန်
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
