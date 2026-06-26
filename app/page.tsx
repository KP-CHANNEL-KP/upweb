import Link from 'next/link';

export default function Home() {
  return (
    <main className="text-gray-100">
      {/* Hero Section - glass-card သုံးပြီး ဒီဇိုင်းဆွဲထားသည် */}
      <section className="hero-section glass-card mx-auto max-w-4xl mt-10">
        <div className="text-6xl mb-6 animate-pulse">🚀</div>
        <h2 className="text-[var(--primary)] font-semibold uppercase tracking-widest mb-2">
          Tech Hub & VPN Services
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          KP နှင့်အတူ သာယာသော နေ့များဆီသို့
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          လွယ်ကူမြန်ဆန်သော VPN ဝန်ဆောင်မှုများ၊ Free အသုံးပြုနိုင်မည့် Key များနှင့် နေ့စဉ် အပ်ဒိတ်များကို ဤနေရာတွင် ရယူလိုက်ပါ။
        </p>
        <Link href="/free" className="cta-button">
          FREE သုံးစရာများ ကြည့်ရန်
        </Link>
      </section>

      {/* Payment Grid */}
      <div className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-center text-3xl font-bold mb-12 text-[var(--primary)]">ငွေလွှဲရန် Payment များ</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[ { name: 'Wave Pay', id: '09966955081' }, { name: 'KPay', id: '09966955081' } ].map((p) => (
            <div key={p.name} className="glass-card hover:-translate-y-2">
              <div className="text-[var(--primary)] font-bold mb-2">{p.name}</div>
              <h3 className="text-3xl font-bold mb-2">{p.id}</h3>
              <p className="text-gray-400">ငွေလွှဲရန် အထက်ပါနံပါတ်ကိုသာ အသုံးပြုပေးပါခင်ဗျာ။</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="py-16 bg-[rgba(20,25,50,0.3)]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6 text-center">
          {[
            { name: 'Facebook', url: 'https://www.facebook.com/share/1CmNvtjsp8/' },
            { name: 'YouTube', url: 'https://youtube.com/@kpchannel22' },
            { name: 'Telegram', url: 'https://t.me/KP_CHANNEL_KP' },
            { name: 'TikTok', url: 'https://tiktok.com/@kpbykp23' }
          ].map((s) => (
            <div key={s.name} className="glass-card p-6 hover:bg-[var(--primary)] hover:text-black transition-all">
              <h3 className="font-bold mb-3">{s.name}</h3>
              <a 
                href={s.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-semibold border-b border-dashed border-[var(--primary)] hover:border-black"
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