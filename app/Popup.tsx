'use client';
import { useState, useEffect } from 'react';

const plans = [
  { label: '1 Month', price: '7,000 Ks', note: 'Unlimited Data' },
  { label: '3 Months', price: '12,000 Ks', note: 'Unlimited Data' },
  { label: '6 Months', price: '25,000 Ks', note: 'Unlimited Data' },
  { label: '150 GB', price: '5,000 Ks', note: 'Unlimited Data' },
  { label: '300 GB', price: '9,000 Ks', note: 'Unlimited Data' },
  { label: '1000 GB', price: '20,000 Ks', note: 'Unlimited Data' },
];

export default function Popup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Page ဝင်ဝင်ချင်း Popup ပေါ်စေရန်
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="kp-popup-overlay">
      <div className="kp-popup-card">
        <button onClick={() => setShow(false)} className="kp-popup-close" aria-label="Close">
          ✕
        </button>

        <span className="kp-popup-badge">
          <span className="kp-badge-dot" />
          Limited Offer
        </span>

        <h2 className="kp-popup-title">Premium Vpn Key ဝယ်ယူရန်</h2>

        <div className="kp-popup-plans">
          {plans.map((p) => (
            <div key={p.label} className="kp-popup-plan-row">
              <span className="kp-popup-plan-label">❄ {p.label}</span>
              <span className="kp-popup-plan-price">{p.price}</span>
            </div>
          ))}
        </div>

        <div className="kp-popup-links">
          <a
            href="https://t.me/KP_CHANNEL_KP"
            target="_blank"
            rel="noopener noreferrer"
            className="kp-popup-btn kp-popup-btn-primary"
          >
            ✈️ Telegram Channel
          </a>
          <a
            href="https://www.facebook.com/share/1CmNvtjsp8"
            target="_blank"
            rel="noopener noreferrer"
            className="kp-popup-btn kp-popup-btn-secondary"
          >
            📘 Facebook Page
          </a>
          <a href="viber://add?number=959769043594" className="kp-popup-btn kp-popup-btn-secondary">
            📞 Viber
          </a>
        </div>
      </div>
    </div>
  );
}