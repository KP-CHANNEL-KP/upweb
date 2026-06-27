'use client';
import { useState } from 'react';
import Banner from '../components/Banner';

interface VerifyResponse { valid: boolean; message?: string; }

export default function VPNFilesPage() {
  const [key, setKey] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const vpnFiles = [
    { name: 'KP Atom Tiktok + ထောပီ (Npv Tunnel)', url: '/vpnfiles/KP_ATOM_TIKTOK_+_THAWB.npvt', speed: 'High Speed' },
  ];

  const handleVerify = async () => {
    if (!key.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        body: JSON.stringify({ key }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = (await res.json()) as VerifyResponse;

      if (data.valid) {
        setIsVerified(true);
      } else {
        setMessage(data.message || 'Key မမှန်ပါ။');
      }
    } catch {
      setMessage('Connection Error ဖြစ်နေသည်');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="vp-main">
      <div className="vp-grid-bg" />
      <div className="vp-glow" />

      <div className="vp-container">
        <div className="vp-header">
          <span className="kp-badge">
            <span className="kp-badge-dot" />
            VPN Files
          </span>
          <h1 className="vp-title">
            Vpn Files များ Admin မှ <span className="kp-title-gradient">ပြန် (ပိတ်)</span> ထားပါသည်
          </h1>
          <p className="vp-sub">
            ဝယ်ယူလိုပါက →{' '}
            <a href="https://t.me/KPBYKP" target="_blank" rel="noopener noreferrer" className="vp-contact-link">
              TG: @KPBYKP
            </a>{' '}
            / <span className="vp-contact-link">Viber: 09769043594</span>
          </p>
        </div>

        {!isVerified ? (
          <div className="vp-gate-card">
            <div className="vp-gate-icon">🔐</div>
            <h2 className="vp-gate-title">Vpn ဖိုင်များ Download ရယူရန် Key ထည့်ပေးပါ</h2>

            <input
              type="text"
              placeholder="Enter Access Key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              className="vp-input"
            />

            <button onClick={handleVerify} disabled={loading} className="vp-btn-primary">
              {loading ? <span className="vp-spinner" /> : 'အတည်ပြုမည်'}
            </button>

            <div className="vp-divider">
              <span>သို့မဟုတ်</span>
            </div>

            <a
              href="https://t.me/KP_WEB_KEY_BOT"
              target="_blank"
              rel="noopener noreferrer"
              className="vp-btn-tg"
            >
              🚀 Telegram Bot သို့သွားရန်
            </a>

            {message && (
              <div className="vp-error">
                <span>⚠️</span> {message}
              </div>
            )}
          </div>
        ) : (
          <div className="vp-files-list">
            {vpnFiles.map((file, index) => (
              <div key={index} className="vp-file-card">
                <div className="vp-file-stripe" />
                <a href={file.url} download className="vp-file-row">
                  <div className="vp-file-info">
                    <strong className="vp-file-name">{file.name}</strong>
                    <small className="vp-file-speed">{file.speed}</small>
                  </div>
                  <span className="vp-download-badge">⬇ Download</span>
                </a>
                <div className="vp-banner-wrap">
                  <Banner />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}