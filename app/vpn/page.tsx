'use client';
import { useState } from 'react';
import Banner from '../components/Banner';
import { useLanguage } from '../components/LanguageProvider';

interface VerifyResponse { valid: boolean; message?: string; }

export default function VPNFilesPage() {
  const { t } = useLanguage();
  const [key, setKey] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const vpnFiles = [
    { nameMy: 'KP Atom Tiktok + ထောပီ (Npv Tunnel)', nameEn: 'KP Atom TikTok + Thawpi (Npv Tunnel)', url: '/vpnfiles/KP_ATOM_TIKTOK_+_THAWB.npvt', speed: 'High Speed' },
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
        setMessage(data.message || t('Key မမှန်ပါ။', 'Invalid key.'));
      }
    } catch {
      setMessage(t('Connection Error ဖြစ်နေသည်', 'Connection error'));
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
            {t('Vpn Files များ Admin မှ', 'VPN Files are currently')} <span className="kp-title-gradient">{t('ပြန် (ပိတ်)', '(Closed)')}</span> {t('ထားပါသည်', 'by Admin')}
          </h1>
          <p className="vp-sub">
            {t('ဝယ်ယူလိုပါက', 'To purchase, contact')} →{' '}
            <a href="https://t.me/KPBYKP" target="_blank" rel="noopener noreferrer" className="vp-contact-link">
              TG: @KPBYKP
            </a>{' '}
            / <span className="vp-contact-link">Viber: 09769043594</span>
          </p>
        </div>

        {!isVerified ? (
          <div className="vp-gate-card">
            <div className="vp-gate-icon">🔐</div>
            <h2 className="vp-gate-title">{t('Vpn ဖိုင်များ Download ရယူရန် Key ထည့်ပေးပါ', 'Enter your key to download VPN files')}</h2>

            <input
              type="text"
              placeholder={t('Access Key ထည့်ပါ...', 'Enter Access Key...')}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              className="vp-input"
            />

            <button onClick={handleVerify} disabled={loading} className="vp-btn-primary">
              {loading ? <span className="vp-spinner" /> : t('အတည်ပြုမည်', 'Verify')}
            </button>

            <div className="vp-divider">
              <span>{t('သို့မဟုတ်', 'or')}</span>
            </div>

            <a
              href="https://t.me/KP_WEB_KEY_BOT"
              target="_blank"
              rel="noopener noreferrer"
              className="vp-btn-tg"
            >
              🚀 {t('Telegram Bot သို့သွားရန်', 'Go to Telegram Bot')}
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
                    <strong className="vp-file-name">{t(file.nameMy, file.nameEn)}</strong>
                    <small className="vp-file-speed">{file.speed}</small>
                  </div>
                  <span className="vp-download-badge">⬇ {t('Download', 'Download')}</span>
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