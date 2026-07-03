'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';

const products = [
  { icon: '🔑', my: 'Mytel Bypass CF (၁လ)', en: 'Mytel Bypass CF (1 Month)', descMy: 'ကချင်ပြည်နယ်တွင်း အမြန်ဆုံး လိုင်းဖြတ်နိုင်သော Config', descEn: 'Fastest bypass config for Kachin State area', price: '3,000 ကျပ်' },
  { icon: '🌐', my: 'Mytel Bypass GCP (၁လ)', en: 'Mytel Bypass GCP (1 Month)', descMy: 'မြန်မာနိုင်ငံ လိုင်းဖြတ်ဒေသတိုင်းနီးပါး အဆင်ပြေ', descEn: 'Works in almost every region across Myanmar', price: '5,000 ကျပ်' },
  { icon: '🚀', my: 'Premium VPN (Vmess/Vless/Trojan)', en: 'Premium VPN (Vmess/Vless/Trojan)', descMy: 'ကြော်ငြာမရှိ • အမြန်ဆုံး • All Sim/All WiFi အဆင်ပြေ', descEn: 'No ads • Fastest • Works on all SIM/WiFi', price: 'စတင် 3,000 ကျပ်' },
  { icon: '🛰️', my: 'Starlink Ruijie Old (၁လ)', en: 'Starlink Ruijie Old (1 Month)', descMy: 'Code မလိုပဲ ကျော်သုံး • လိုင်းကောင်း • အာမခံ ၁လ', descEn: 'No code needed • Stable connection • 1-month guarantee', price: '5,000 ကျပ်' },
  { icon: '🛰️', my: 'Starlink Ruijie New (၁လ)', en: 'Starlink Ruijie New (1 Month)', descMy: 'Update တင်ပြီးသား စက်များအတွက် ကျော်သုံးနိုင်သော Key', descEn: 'Key for devices already updated', price: '5,000 ကျပ်' },
  { icon: '☁️', my: 'Cloudflare Paid Plan', en: 'Cloudflare Paid Plan', descMy: 'Website အမြန်ဆန်ရန် + DDoS Protection', descEn: 'Speed up your website + DDoS Protection', price: '20,000 ကျပ်' },
  { icon: '💧', my: 'Digital Ocean Account', en: 'Digital Ocean Account', descMy: '60days မှ 1year • အမြန်ဆုံး VPS • Key ထုပ်ရောင်းရန် အသုံးဝင်ဆုံး', descEn: '60 days to 1 year • Fastest VPS • Best for reselling keys', price: '60,000 - 90,000 ကျပ်' },
  { icon: '🎇', my: 'Telegram Premium', en: 'Telegram Premium', descMy: '1,3,6,12 လစာ အကုန်ရပါတယ်။ (1m - Login only)', descEn: 'Available in 1, 3, 6, 12 months (1m - login only)', price: '21,500 ကျပ်' },
  { icon: '💐', my: 'Capcut Pro', en: 'Capcut Pro', descMy: 'ဒါကတော့ အားလုံး သိပီးသားမို့ မရှင်းပြတော့ဘူး။', descEn: 'No need to explain — everyone knows this one.', price: '5,500 ကျပ်' },
  { icon: '🩹', my: 'Express VPN', en: 'Express VPN', descMy: '၁ လစာ, 3 လစာ, ၆ လစာ, ၁၂ လစာ အကုန်ရပါတယ်။', descEn: 'Available in 1, 3, 6, and 12 months', price: '3,000 ကျပ်' },
  { icon: '🎧', my: 'Spotify Family Plan (US)', en: 'Spotify Family Plan (US)', descMy: '၁ လစာ, ၂ လစာ, ၃ လစာ, ၆ လစာ, ၁၂ လစာ အကုန်ရပါတယ်။', descEn: 'Available in 1, 2, 3, 6, and 12 months', price: '6,000 ကျပ်' },
  { icon: '🔶', my: 'Telegram Stars', en: 'Telegram Stars', descMy: '50, 100, 150, 200, 300, 400, 500, 1000 အကုန်ရပါတယ်။', descEn: 'Available: 50, 100, 150, 200, 300, 400, 500, 1000', price: '4,000 ကျပ်' },
  { icon: '🤴', my: 'Jump Jump VPN', en: 'Jump Jump VPN', descMy: '1, 6 လစာ အကုန်ရပါတယ်။', descEn: 'Available in 1 and 6 months', price: '15,000 ကျပ်' },
  { icon: '🪁', my: 'Canva Pro', en: 'Canva Pro', descMy: '၁ နှစ်စာပဲ ရပါတယ်။ Mail ပဲ လိုပါတယ် ခမျ။', descEn: 'Only 1-year plan available. Just needs your email.', price: '5,000 ကျပ်' },
  { icon: '🛸', my: 'Picsart Pro', en: 'Picsart Pro', descMy: '1, 6, 12 လစာ အကုန်ရပါတယ်။', descEn: 'Available in 1, 6, and 12 months', price: '3,500 ကျပ်' },
];

export default function BuyPage() {
  const { lang, t } = useLanguage();

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
            Premium <span className="kp-title-gradient">{t('ဝန်ဆောင်မှုများ', 'Services')}</span>
          </h1>
          <p className="bp-sub">
            {t('အမြန်ဆုံး • အတည်ငြိမ်ဆုံး • ၂၄နာရီ အာမခံချက်နဲ့ ဝယ်ယူလိုက်ပါ', 'Fastest • Most stable • Buy with 24-hour guarantee')}
          </p>
        </div>

        {/* Products Grid */}
        <div className="bp-grid">
          {products.map((item, index) => (
            <div key={index} className="bp-card">
              <div className="bp-card-stripe" />
              <div className="bp-icon-circle">{item.icon}</div>
              <h2 className="bp-card-title">{lang === 'my' ? item.my : item.en}</h2>
              <p className="bp-card-desc">{lang === 'my' ? item.descMy : item.descEn}</p>
              <div className="bp-price">{item.price}</div>
              <div className="bp-btn-row">
                <a href="tel:09769043594" className="bp-btn bp-btn-tel">
                  📞 {t('ဖုန်းဆက်', 'Call')}
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
            <p className="bp-card-desc">{t('အခမဲ့ စမ်းသုံးကြည့်ပါ (တစ်နေ့ 50GB)', 'Try it free (50GB per day)')}</p>
            <div className="bp-price bp-price-free">{t('အခမဲ့', 'Free')}</div>
            <div className="bp-btn-row">
              <a
                href="http://178.128.123.203:2096/sub/kp-website-free"
                target="_blank"
                rel="noopener noreferrer"
                className="bp-btn bp-btn-free"
              >
                ⚡ {t('အခုပဲ သုံးမယ်', 'Use it now')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}