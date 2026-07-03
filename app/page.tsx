'use client';
import Link from 'next/link';
import { useLanguage } from './components/LanguageProvider';

const payments = [
  { name: 'Wave Pay', id: '09966955081', color: '#22D3EE', emoji: '🌊' },
  { name: 'KPay', id: '09966955081', color: '#A78BFA', emoji: '📱' },
];

const socials = [
  { name: 'Facebook', handle: 'KP Channel', url: 'https://www.facebook.com/share/1CmNvtjsp8/', emoji: '📘' },
  { name: 'YouTube', handle: '@kpchannel22', url: 'https://youtube.com/@kpchannel22', emoji: '📺' },
  { name: 'Telegram', handle: '@KP_CHANNEL_KP', url: 'https://t.me/KP_CHANNEL_KP', emoji: '✈️' },
  { name: 'TikTok', handle: '@kpbykp23', url: 'https://tiktok.com/@kpbykp23', emoji: '🎵' },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="kp-main">
      {/* ── Hero ── */}
      <section className="kp-hero">
        <div className="kp-grid-bg" />
        <div className="kp-glow" />

        <span className="kp-badge">
          <span className="kp-badge-dot" />
          {t('နည်းပညာ ဗဟိုချက် နှင့် VPN ဝန်ဆောင်မှု', 'Tech Hub & VPN Services')}
        </span>

        <h1 className="kp-title">
          {t('KP နှင့်အတူ', 'With KP')}<br />
          <span className="kp-title-gradient">
            {t('သာယာသောနေ့များဆီ', 'Towards Better Days')}
          </span>
        </h1>

        <p className="kp-sub">
          {t(
            'လွယ်ကူမြန်ဆန်သော VPN ဝန်ဆောင်မှုများ၊ Free Key များနှင့် နေ့စဉ်အပ်ဒိတ်များကို ဤနေရာမှ ရယူနိုင်သည်။',
            'Get fast, easy VPN services, free keys, and daily updates right here.'
          )}
        </p>

        <div className="kp-cta-row">
          <Link href="/free" className="kp-btn-primary">
            ⚡ {t('FREE သုံးစရာများ', 'FREE Resources')}
          </Link>
          <a
            href="https://t.me/KP_CHANNEL_KP"
            target="_blank"
            rel="noopener noreferrer"
            className="kp-btn-ghost"
          >
            ✈️ {t('Telegram ဝင်ရောက်ရန်', 'Join Telegram')}
          </a>
        </div>
      </section>

      {/* ── Payments ── */}
      <section className="kp-section">
        <p className="kp-section-label">💳 {t('ငွေပေးချေမှု', 'Payment')}</p>
        <h2 className="kp-section-title">{t('Payment နည်းလမ်းများ', 'Payment Methods')}</h2>

        <div className="kp-pay-grid">
          {payments.map((p) => (
            <div key={p.name} className="kp-pay-card">
              <div className="kp-pay-stripe" style={{ background: `linear-gradient(90deg, ${p.color}, #7C3AED)` }} />
              <span className="kp-pay-emoji">{p.emoji}</span>
              <p className="kp-pay-label">{p.name}</p>
              <p className="kp-pay-num" style={{ color: p.color }}>{p.id}</p>
              <p className="kp-pay-desc">
                {t('ငွေလွှဲရန် အထက်ပါနံပါတ်ကိုသာ အသုံးပြုပေးပါ', 'Please use the number above for transfers only')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Socials ── */}
      <section className="kp-section">
        <p className="kp-section-label">🔗 {t('လူမှုကွန်ရက် လင့်ခ်များ', 'Social Links')}</p>
        <h2 className="kp-section-title">{t('ကျွန်တော်တို့ကို Follow လုပ်ပါ', 'Follow Us')}</h2>

        <div className="kp-soc-grid">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="kp-soc-card"
            >
              <span className="kp-soc-emoji">{s.emoji}</span>
              <p className="kp-soc-name">{s.name}</p>
              <p className="kp-soc-handle">{s.handle}</p>
              <span className="kp-soc-cta">{t('Follow လုပ်ရန်', 'Follow')} →</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="kp-footer">
        © 2024 KP Tech Hub · {t('VPN နှင့် နည်းပညာ ဝန်ဆောင်မှုများ', 'VPN & Tech Services')}
      </footer>
    </main>
  );
}