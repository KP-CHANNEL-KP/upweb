import Link from 'next/link';

const products = [
  { icon: '🔑', title: 'Mytel Bypass CF (၁လ)', desc: 'ကချင်ပြည်နယ်တွင်း အမြန်ဆုံး လိုင်းဖြတ်နိုင်သော Config', price: '3,000 ကျပ်' },
  { icon: '🌐', title: 'Mytel Bypass GCP (၁လ)', desc: 'မြန်မာနိုင်ငံ လိုင်းဖြတ်ဒေသတိုင်းနီးပါး အဆင်ပြေ', price: '5,000 ကျပ်' },
  { icon: '🚀', title: 'Premium VPN (Vmess/Vless/Trojan)', desc: 'ကြော်ငြာမရှိ • အမြန်ဆုံး • All Sim/All WiFi အဆင်ပြေ', price: 'စတင် 3,000 ကျပ်' },
  { icon: '🛰️', title: 'Starlink Ruijie Old (၁လ)', desc: 'Code မလိုပဲ ကျော်သုံး • လိုင်းကောင်း • အာမခံ ၁လ', price: '5,000 ကျပ်' },
  { icon: '🛰️', title: 'Starlink Ruijie New (၁လ)', desc: 'Update တင်ပြီးသား စက်များအတွက် ကျော်သုံးနိုင်သော Key', price: '5,000 ကျပ်' },
  { icon: '☁️', title: 'Cloudflare Paid Plan', desc: 'Website အမြန်ဆန်ရန် + DDoS Protection', price: '20,000 ကျပ်' },
  { icon: '💧', title: 'Digital Ocean Account', desc: '60days မှ 1year • အမြန်ဆုံး VPS • Key ထုပ်ရောင်းရန် အသုံးဝင်ဆုံး', price: '60,000 - 90,000 ကျပ်' },
  { icon: '🎇', title: 'Telegram Premium', desc: '1,3,6,12 လစာ အကုန်ရပါတယ်။ (1m - Login only)', price: '21,500 ကျပ်' },
  { icon: '💐', title: 'Capcut Pro', desc: 'ဒါကတော့ အားလုံး သိပီးသားမို့ မရှင်းပြတော့ဘူး။', price: '5,500 ကျပ်' },
  { icon: '🩹', title: 'Express VPN', desc: '၁ လစာ, 3 လစာ, ၆ လစာ, ၁၂ လစာ အကုန်ရပါတယ်။', price: '3,000 ကျပ်' },
  { icon: '🎧', title: 'Spotify Family Plan (US)', desc: '၁ လစာ, ၂ လစာ, ၃ လစာ, ၆ လစာ, ၁၂ လစာ အကုန်ရပါတယ်။', price: '6,000 ကျပ်' },
  { icon: '🔶', title: 'Telegram Stars', desc: '50, 100, 150, 200, 300, 400, 500, 1000 အကုန်ရပါတယ်။', price: '4,000 ကျပ်' },
  { icon: '🤴', title: 'Jump Jump VPN', desc: '1, 6 လစာ အကုန်ရပါတယ်။', price: '15,000 ကျပ်' },
  { icon: '🪁', title: 'Canva Pro', desc: '၁ နှစ်စာပဲ ရပါတယ်။ Mail ပဲ လိုပါတယ် ခမျ။', price: '5,000 ကျပ်' },
  { icon: '🛸', title: 'Picsart Pro', desc: '1, 6, 12 လစာ အကုန်ရပါတယ်။', price: '3,500 ကျပ်' },
];

export default function BuyPage() {
  return (
    <main className="bp-main">
      <div className="bp-grid-bg" />
      <div className="bp-glow" />

      <div className="bp-container">
        {/* Header */}
        <div className="bp-header">
          <span className="kp-badge">
            <span className="kp-badge-dot" />
            Premium Services
          </span>
          <h1 className="bp-title">
            Premium <span className="kp-title-gradient">ဝန်ဆောင်မှုများ</span>
          </h1>
          <p className="bp-sub">
            အမြန်ဆုံး • အတည်ငြိမ်ဆုံး • ၂၄နာရီ အာမခံချက်နဲ့ ဝယ်ယူလိုက်ပါ
          </p>
        </div>

        {/* Products Grid */}
        <div className="bp-grid">
          {products.map((item, index) => (
            <div key={index} className="bp-card">
              <div className="bp-card-stripe" />
              <div className="bp-icon-circle">{item.icon}</div>
              <h2 className="bp-card-title">{item.title}</h2>
              <p className="bp-card-desc">{item.desc}</p>
              <div className="bp-price">{item.price}</div>
              <div className="bp-btn-row">
                <a href="tel:09769043594" className="bp-btn bp-btn-tel">
                  📞 ဖုန်းဆက်
                </a>
                <a
                  href="https://t.me/kpbykp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bp-btn bp-btn-tg"
                >
                  ✈️ Telegram
                </a>
              </div>
            </div>
          ))}

          {/* Free Product Card */}
          <div className="bp-card bp-card-free">
            <div className="bp-card-stripe bp-card-stripe-free" />
            <div className="bp-icon-circle bp-icon-circle-free">🆓</div>
            <h2 className="bp-card-title">Starlink Ruijie Old Free (50GB)</h2>
            <p className="bp-card-desc">အခမဲ့ စမ်းသုံးကြည့်ပါ (တစ်နေ့ 50GB)</p>
            <div className="bp-price bp-price-free">အခမဲ့</div>
            <div className="bp-btn-row">
              <a
                href="http://178.128.123.203:2096/sub/kp-website-free"
                target="_blank"
                rel="noopener noreferrer"
                className="bp-btn bp-btn-free"
              >
                ⚡ အခုပဲ သုံးမယ်
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}