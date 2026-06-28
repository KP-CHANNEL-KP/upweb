'use client';

import Link from 'next/link';
import { useState } from 'react';

// ─── Plan definitions ───────────────────────────────────────────────
const plans = [
  {
    id: 'trial',
    emoji: '⚡',
    name: 'Trial Pack',
    badge: null,
    price: '3,000',
    currency: 'MMK',
    duration: '7 ရက်',
    dataLimit: '30 GB',
    devices: 1,
    speed: 'Standard',
    features: [
      '30 GB Data',
      '1 Device သာ',
      'VLESS / VMess',
      'Standard Speed',
    ],
    color: '#22D3EE',
    colorB: '#7C3AED',
    isFeatured: false,
  },
  {
    id: 'monthly',
    emoji: '🛡️',
    name: 'Monthly Pack',
    badge: '🔥 အရောင်းရဆုံး',
    price: '9,000',
    currency: 'MMK',
    duration: '30 ရက်',
    dataLimit: 'Unlimited',
    devices: 3,
    speed: 'High Speed',
    features: [
      'Unlimited Data',
      '3 Devices',
      'VLESS / VMess / XTLS',
      'High Speed',
      'Priority Support',
    ],
    color: '#A78BFA',
    colorB: '#22D3EE',
    isFeatured: true,
  },
  {
    id: 'quarterly',
    emoji: '💎',
    name: '3-Month Pack',
    badge: '19% သက်သာ',
    price: '22,000',
    currency: 'MMK',
    duration: '90 ရက်',
    dataLimit: 'Unlimited',
    devices: 5,
    speed: 'Ultra Speed',
    features: [
      'Unlimited Data',
      '5 Devices',
      'VLESS / VMess / XTLS',
      'Ultra Speed',
      'Priority Support',
      'Dedicated Config',
    ],
    color: '#34D399',
    colorB: '#A78BFA',
    isFeatured: false,
  },
];

// ─── How it works steps ─────────────────────────────────────────────
const steps = [
  { num: '01', title: 'Plan ရွေးပါ', desc: 'သင့်အတွက် သင့်တော်သော plan ကို ရွေးချယ်ပါ' },
  { num: '02', title: 'ငွေပေးပါ', desc: 'Wave Pay / KPay ဖြင့် လွှဲပါ' },
  { num: '03', title: 'Screenshot ပို့ပါ', desc: 'Telegram မှတစ်ဆင့် ငွေလွှဲ screenshot ပို့ပါ' },
  { num: '04', title: 'Key ရယူပါ', desc: 'Admin မှ VPN key ကို Telegram ဖြင့် ပေးပို့မည်' },
];

// ─── FAQ ────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'VPN key ကို ဘယ်လောက်ကြာမှ ရမလဲ?',
    a: 'ငွေလွှဲ screenshot ပို့သည့်နေ့ Admin online ဆိုလျင် မိနစ်အနည်းငယ်အတွင်း ရပါမည်။ Offline ဆိုလျင် အများဆုံး ၃ နာရီအတွင်း ရမည်။',
  },
  {
    q: 'ဘယ် App တွေမှာ သုံးလို့ရမလဲ?',
    a: 'V2RayNG (Android), NekoBox (Android/PC), V2Box (iOS), Hiddify (All platforms) တို့တွင် သုံးနိုင်သည်။',
  },
  {
    q: 'Key ကုန်သွားရင် သို့မဟုတ် အလုပ်မလုပ်ရင် ဘယ်လိုလုပ်မလဲ?',
    a: 'Telegram မှတစ်ဆင့် Admin ကို ဆက်သွယ်ပါ။ Key ရောင်းချပေးသည့်ကာလအတွင်း Support ပေးမည်။',
  },
  {
    q: 'Myanmar မှ သုံးလို့ရပါသလား?',
    a: 'ဟုတ်ကဲ့၊ Myanmar ရှိ ISP အားလုံးနှင့် အဆင်ပြေနိုင်ရန် ရည်ရွယ်ပြုလုပ်ထားသည်။ မည်သည့် ISP မှသုံးသည်ဆိုသည်ကို Admin ကို ကြိုပြောပါ။',
  },
];

// ─── Checkout Modal ─────────────────────────────────────────────────
interface SelectedPlan {
  name: string;
  price: string;
  duration: string;
  devices: number;
}

function CheckoutModal({
  plan,
  onClose,
}: {
  plan: SelectedPlan;
  onClose: () => void;
}) {
  return (
    <div className="kp-popup-overlay" onClick={onClose}>
      <div
        className="kp-popup-card"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="kp-popup-close" onClick={onClose} aria-label="ပိတ်ရန်">
          ✕
        </button>

        <span className="kp-popup-badge">
          <span className="kp-badge-dot" />
          Order Summary
        </span>

        <h2 className="kp-popup-title">🛡️ {plan.name}</h2>

        <div className="kp-popup-plans">
          <div className="kp-popup-plan-row">
            <span className="kp-popup-plan-label">Package</span>
            <span className="kp-popup-plan-price">{plan.name}</span>
          </div>
          <div className="kp-popup-plan-row">
            <span className="kp-popup-plan-label">Duration</span>
            <span style={{ fontWeight: 700, color: 'var(--kp-text)' }}>{plan.duration}</span>
          </div>
          <div className="kp-popup-plan-row">
            <span className="kp-popup-plan-label">Devices</span>
            <span style={{ fontWeight: 700, color: 'var(--kp-text)' }}>{plan.devices} ခု</span>
          </div>
          <div className="kp-popup-plan-row" style={{ borderColor: 'rgba(124,58,237,0.35)' }}>
            <span className="kp-popup-plan-label" style={{ fontWeight: 700 }}>စုစုပေါင်း</span>
            <span className="kp-popup-plan-price" style={{ fontSize: 18 }}>
              {plan.price} MMK
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: 'var(--kp-text-muted)',
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          ငွေလွှဲပြီးနောက် Screenshot ကို Telegram Admin ထံ ပေးပို့ပါ။
          Key ကို Telegram မှတစ်ဆင့် ပြန်ပေးပို့မည်။
        </p>

        <div className="kp-popup-links">
          <a
            href="tel:09966955081"
            className="kp-popup-btn kp-popup-btn-secondary"
          >
            📞 Wave Pay &amp; KPay — 09966955081
          </a>
          <a
            href="https://t.me/KP_CHANNEL_KP"
            target="_blank"
            rel="noopener noreferrer"
            className="kp-popup-btn kp-popup-btn-primary"
          >
            ✈️ Telegram မှ Admin ကို ဆက်သွယ်ပါ
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion Item ─────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: 'var(--kp-card)',
        border: '1px solid var(--kp-border)',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
        borderColor: open ? 'rgba(124,58,237,0.4)' : undefined,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--kp-text)',
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 600,
          textAlign: 'left',
          gap: 12,
        }}
      >
        {q}
        <span
          style={{
            flexShrink: 0,
            fontSize: 18,
            color: 'var(--kp-purple)',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(45deg)' : 'none',
          }}
        >
          +
        </span>
      </button>
      {open && (
        <p
          style={{
            margin: 0,
            padding: '0 20px 18px',
            fontSize: 13,
            color: 'var(--kp-text-muted)',
            lineHeight: 1.7,
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);

  return (
    <div className="bp-main">
      {/* Decorative bg */}
      <div className="bp-grid-bg" />
      <div className="bp-glow" />

      <div className="bp-container">

        {/* ── Header ── */}
        <header className="bp-header">
          <span className="kp-badge">
            <span className="kp-badge-dot" />
            Premium VPN Keys
          </span>
          <h1 className="bp-title">
            <span
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Premium VPN
            </span>{' '}
            ဝယ်ယူပါ
          </h1>
          <p className="bp-sub">
            3x-ui Panel မှ Auto Generate ဖြစ်သော VPN Keys များ။
            VLESS / VMess / XTLS Protocol Support ပါဝင်သည်။
          </p>
        </header>

        {/* ── Plan Cards ── */}
        <div className="bp-grid" style={{ marginBottom: 72 }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bp-card"
              style={
                plan.isFeatured
                  ? { borderColor: 'rgba(124,58,237,0.55)', borderWidth: 2 }
                  : {}
              }
            >
              {/* Top stripe */}
              <div
                className="bp-card-stripe"
                style={{
                  background: `linear-gradient(90deg, ${plan.color}, ${plan.colorB})`,
                }}
              />

              {/* Featured badge */}
              {plan.badge && (
                <div
                  style={{
                    display: 'inline-block',
                    background: plan.isFeatured
                      ? 'rgba(124,58,237,0.15)'
                      : 'rgba(52,211,153,0.12)',
                    border: plan.isFeatured
                      ? '1px solid rgba(124,58,237,0.4)'
                      : '1px solid rgba(52,211,153,0.3)',
                    borderRadius: 999,
                    padding: '4px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: plan.isFeatured ? 'var(--kp-purple-light)' : 'var(--kp-green)',
                    marginBottom: 14,
                  }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Icon */}
              <div
                className="bp-icon-circle"
                style={{
                  background: `${plan.color}1a`,
                  borderColor: `${plan.color}55`,
                  fontSize: 26,
                }}
              >
                {plan.emoji}
              </div>

              <h2 className="bp-card-title">{plan.name}</h2>

              {/* Price */}
              <div style={{ marginBottom: 18 }}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: plan.color,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--kp-text-muted)',
                    marginLeft: 4,
                  }}
                >
                  MMK / {plan.duration}
                </span>
              </div>

              {/* Specs */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 18,
                }}
              >
                {[
                  { label: plan.dataLimit, icon: '📊' },
                  { label: `${plan.devices} Device`, icon: '📱' },
                  { label: plan.speed, icon: '⚡' },
                ].map((spec) => (
                  <span
                    key={spec.label}
                    style={{
                      background: 'var(--kp-input-bg)',
                      border: '1px solid var(--kp-border)',
                      borderRadius: 8,
                      padding: '4px 10px',
                      fontSize: 12,
                      color: 'var(--kp-text-muted)',
                    }}
                  >
                    {spec.icon} {spec.label}
                  </span>
                ))}
              </div>

              {/* Features */}
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  flexGrow: 1,
                }}
              >
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: 13,
                      color: 'var(--kp-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ color: plan.color, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() =>
                  setSelectedPlan({
                    name: plan.name,
                    price: plan.price,
                    duration: plan.duration,
                    devices: plan.devices,
                  })
                }
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: 12,
                  background: plan.isFeatured
                    ? 'var(--kp-purple)'
                    : `${plan.color}22`,
                  color: plan.isFeatured ? '#fff' : plan.color,
                  fontFamily: 'inherit',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.15s',
                  border: plan.isFeatured ? 'none' : `1px solid ${plan.color}55`,
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                }}
              >
                🛒 ယခုဝယ်ယူပါ
              </button>
            </div>
          ))}
        </div>

        {/* ── How it works ── */}
        <section style={{ marginBottom: 72 }}>
          <p className="kp-section-label">📋 လုပ်ငန်းစဉ်</p>
          <h2 className="kp-section-title">ဘယ်လိုဝယ်မလဲ?</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
            }}
          >
            {steps.map((s) => (
              <div
                key={s.num}
                style={{
                  background: 'var(--kp-card)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: 18,
                  padding: '24px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--kp-shadow)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, var(--kp-purple), var(--kp-cyan))',
                  }}
                />
                <p
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: 'rgba(124,58,237,0.15)',
                    lineHeight: 1,
                    marginBottom: 12,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.num}
                </p>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--kp-text)',
                    marginBottom: 8,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--kp-text-muted)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Payment info ── */}
        <section style={{ marginBottom: 72 }}>
          <p className="kp-section-label">💳 ငွေပေးချေမှု</p>
          <h2 className="kp-section-title">Payment နည်းလမ်းများ</h2>

          <div className="kp-pay-grid">
            {[
              { name: 'Wave Pay', id: '09966955081', color: '#22D3EE', emoji: '🌊' },
              { name: 'KBZ Pay', id: '09966955081', color: '#A78BFA', emoji: '📱' },
            ].map((p) => (
              <div key={p.name} className="kp-pay-card">
                <div
                  className="kp-pay-stripe"
                  style={{
                    background: `linear-gradient(90deg, ${p.color}, #7C3AED)`,
                  }}
                />
                <span className="kp-pay-emoji">{p.emoji}</span>
                <p className="kp-pay-label">{p.name}</p>
                <p className="kp-pay-num" style={{ color: p.color }}>
                  {p.id}
                </p>
                <p className="kp-pay-desc">
                  ငွေလွှဲပြီးနောက် Screenshot ကို Telegram ပေးပို့ပါ
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ marginBottom: 72 }}>
          <p className="kp-section-label">❓ မေးလေ့ရှိသောမေးခွန်းများ</p>
          <h2 className="kp-section-title">FAQ</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section
          style={{
            background: 'var(--kp-card)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 24,
            padding: '48px 32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 2,
              background: 'linear-gradient(90deg, var(--kp-purple), var(--kp-cyan))',
            }}
          />
          <p style={{ fontSize: 32, marginBottom: 12 }}>🚀</p>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              marginBottom: 12,
              color: 'var(--kp-text)',
            }}
          >
            မစမ်းသပ်ရသေးဘူးလား?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'var(--kp-text-muted)',
              marginBottom: 28,
              lineHeight: 1.7,
            }}
          >
            Free Key များကို အရင်စမ်းသပ်နိုင်သည်။ ကျေနပ်မှသာ Premium ဝယ်ပါ။
          </p>
          <div className="kp-cta-row">
            <Link href="/free" className="kp-btn-primary">
              ⚡ Free Key ယူပါ
            </Link>
            <a
              href="https://t.me/KP_CHANNEL_KP"
              target="_blank"
              rel="noopener noreferrer"
              className="kp-btn-ghost"
            >
              ✈️ Telegram ဆက်သွယ်ပါ
            </a>
          </div>
        </section>
      </div>

      {/* ── Checkout Modal ── */}
      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}