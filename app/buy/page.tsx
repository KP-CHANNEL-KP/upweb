import React from 'react';
import Link from 'next/link';

// ပစ္စည်းများစာရင်း (Data)
const products = [
  { icon: "🔑", title: "Mytel Bypass CF (၁လ)", desc: "ကချင်ပြည်နယ်တွင်း အမြန်ဆုံး လိုင်းဖြတ်နိုင်သော Config", price: "3,000 ကျပ်" },
  { icon: "🌐", title: "Mytel Bypass GCP (၁လ)", desc: "မြန်မာနိုင်ငံ လိုင်းဖြတ်ဒေသတိုင်းနီးပါး အဆင်ပြေ", price: "5,000 ကျပ်" },
  { icon: "🚀", title: "Premium VPN (Vmess/Vless/Trojan)", desc: "ကြော်ငြာမရှိ • အမြန်ဆုံး • All Sim/All WiFi အဆင်ပြေ", price: "စတင် 3,000 ကျပ်" },
  { icon: "🛰️", title: "Starlink Ruijie Old (၁လ)", desc: "Code မလိုပဲ ကျော်သုံး • လိုင်းကောင်း • အာမခံ ၁လ", price: "5,000 ကျပ်" },
  { icon: "🛰️", title: "Starlink Ruijie New (၁လ)", desc: "Update တင်ပြီးသား စက်များအတွက် ကျော်သုံးနိုင်သော Key", price: "5,000 ကျပ်" },
  { icon: "☁️", title: "Cloudflare Paid Plan", desc: "Website အမြန်ဆန်ရန် + DDoS Protection", price: "20,000 ကျပ်" },
  { icon: "💧", title: "Digital Ocean Account", desc: "60days မှ 1year • အမြန်ဆုံး VPS • Key ထုပ်ရောင်းရန် အသုံးဝင်ဆုံး", price: "60,000 - 90,000 ကျပ်" },
  { icon: "🎇", title: "Telegram Premium", desc: "1,3,6,12 လစာ အကုန်ရပါတယ်။ (1m - Login only)", price: "21,500 ကျပ်" },
  { icon: "💐", title: "Capcut Pro", desc: "ဒါကတော့ အားလုံး သိပီးသားမို့ မရှင်းပြတော့ဘူး။", price: "5,500 ကျပ်" },
  { icon: "🩹", title: "Express VPN", desc: "၁ လစာ, 3 လစာ, ၆ လစာ, ၁၂ လစာ အကုန်ရပါတယ်။", price: "3,000 ကျပ်" },
  { icon: "🎧", title: "Spotify Family Plan (US)", desc: "၁ လစာ, ၂ လစာ, ၃ လစာ, ၆ လစာ, ၁၂ လစာ အကုန်ရပါတယ်။", price: "6,000 ကျပ်" },
  { icon: "🔶", title: "Telegram Stars", desc: "50, 100, 150, 200, 300, 400, 500, 1000 အကုန်ရပါတယ်။", price: "4,000 ကျပ်" },
  { icon: "🤴", title: "Jump Jump VPN", desc: "1, 6 လစာ အကုန်ရပါတယ်။", price: "15,000 ကျပ်" },
  { icon: "🪁", title: "Canva Pro", desc: "၁ နှစ်စာပဲ ရပါတယ်။ Mail ပဲ လိုပါတယ် ခမျ။", price: "5,000 ကျပ်" },
  { icon: "🛸", title: "Picsart Pro", desc: "1, 6, 12 လစာ အကုန်ရပါတယ်။", price: "3,500 ကျပ်" },
];

export default function BuyPage() {
  return (
    <main style={{ marginTop: '100px', padding: '40px 20px', maxWidth: '1200px', marginInline: 'auto' }}>
      <h1>Premium ဝန်ဆောင်မှုများ</h1>
      <p className="subtitle" style={{ textAlign: 'center', fontSize: '1.3em', color: '#aaa', marginBottom: '50px' }}>
        အမြန်ဆုံး • အတည်ငြိမ်ဆုံး • ၂၄နာရီ အာမခံချက်နဲ့ ဝယ်ယူလိုက်ပါ
      </p>

      <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
        {products.map((item, index) => (
          <div key={index} className="product-card">
            <div className="icon-circle">{item.icon}</div>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <div className="price">{item.price}</div>
            <div className="buy-buttons">
              <a href="tel:09769043594" className="btn btn-tel">ဖုန်းဆက်</a>
              <a href="https://t.me/kpbykp" className="btn btn-tg">Telegram</a>
            </div>
          </div>
        ))}
        
        {/* Free Product Card */}
        <div className="product-card">
            <div className="icon-circle">🆓</div>
            <h2>Starlink Ruijie Old Free (50GB)</h2>
            <p>အခမဲ့ စမ်းသုံးကြည့်ပါ (တစ်နေ့ 50GB)</p>
            <div className="price">အခမဲ့</div>
            <div className="buy-buttons">
                <a href="http://178.128.123.203:2096/sub/kp-website-free" className="btn btn-free">အခုပဲ သုံးမယ်</a>
            </div>
        </div>
      </div>
    </main>
  );
}