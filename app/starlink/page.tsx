'use client';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Banner from '../components/Banner';
import { useLanguage } from '../components/LanguageProvider';

const posts = [
  { num: '၀၁', title: 'Ruijie Starlink Old', date: 'Premium High Speed', desc: 'No Data' },
];

export default function PostsPage() {
  const { t } = useLanguage();
  const [isVerified, setIsVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCopy = (desc: string) => {
    navigator.clipboard.writeText(desc);
    toast.success(t('Key ကို Copy ယူပြီးပါပြီ!', 'Key copied!'), {
      style: { background: '#7C3AED', color: '#fff', borderRadius: '10px' },
    });
  };

  const handleVerify = async () => {
    if (!verifyInput.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('https://webbot.kpchannel.cc.cd/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: verifyInput.trim() }),
      });
      const data = (await res.json()) as { valid: boolean; message?: string };
      if (data.valid) {
        setIsVerified(true);
        toast.success(t('အတည်ပြုပြီးပါပြီ!', 'Verified!'), {
          style: { background: '#7C3AED', color: '#fff', borderRadius: '10px' },
        });
      } else {
        setMessage(data.message || t('Key မမှန်ပါ သို့မဟုတ် အသုံးပြုပြီးသား ဖြစ်နေသည်', 'Invalid or already-used key'));
      }
    } catch {
      setMessage(t('Connection Error ဖြစ်နေသည်', 'Connection error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fp-main">
      <Toaster position="top-center" />
      <div className="fp-grid-bg" />
      <div className="fp-glow" />

      <div className="fp-container">
        <div className="fp-header">
          <span className="fp-badge">
            <span className="fp-badge-dot" />
            Outline VPN Keys
          </span>
          <h1 className="fp-title">
            {t('Starlink Keys များ', 'Starlink Keys')}<br />
            <span className="fp-title-gradient">{t('Admin မှ ( ပိတ် ) ထားပါသည်', 'Closed by Admin')}</span>
          </h1>
          <p className="fp-sub">
            {t('ဝယ်ယူလိုပါက', 'To purchase, contact')} →{' '}
            <a href="https://t.me/KPBYKP" target="_blank" rel="noopener noreferrer" className="fp-contact-link">
              TG: @KPBYKP
            </a>{' '}
            / <span className="fp-contact-link">Viber: 09769043594</span>
          </p>
        </div>

        {!isVerified ? (
          <div className="fp-gate-card">
            <div className="fp-gate-icon">🔐</div>
            <h2 className="fp-gate-title">{t('Access Key လိုအပ်သည်', 'Access Key Required')}</h2>
            <p className="fp-gate-desc">{t('Starlink keys များအားလုံးကို ကြည့်ရှုရန် Telegram Bot မှ Access Key သွားယူပါ', 'Get an Access Key from the Telegram Bot to view all Starlink keys')}</p>

            <input
              className="fp-input"
              placeholder={t('Access Key ထည့်ပါ...', 'Enter Access Key...')}
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />

            <button onClick={handleVerify} disabled={loading} className="fp-btn-primary">
              {loading ? <span className="fp-spinner" /> : `✓ ${t('အတည်ပြုမည်', 'Verify')}`}
            </button>

            <div className="fp-divider"><span>{t('သို့မဟုတ်', 'or')}</span></div>

            <a href="https://t.me/KP_WEB_KEY_BOT" target="_blank" rel="noopener noreferrer" className="fp-btn-tg">
              🚀 {t('Telegram Bot မှ Key ယူရန်', 'Get Key from Telegram Bot')}
            </a>

            {message && (
              <div className="fp-error"><span>⚠️</span> {message}</div>
            )}
          </div>
        ) : (
          <div className="fp-keys-grid">
            {posts.map((post, index) => (
              <div key={index} className="fp-key-card">
                <div className="fp-key-stripe" />

                <div className="fp-key-header">
                  <div className="fp-key-title-row">
                    <span className="po-num">{post.num}</span>
                    <div>
                      <h3 className="fp-key-name">{post.title}</h3>
                      <p className="po-date">{post.date}</p>
                    </div>
                  </div>
                  <span className="fp-status fp-status-active">● {t('အသုံးပြုနိုင်သည်', 'Active')}</span>
                </div>

                <div className="fp-key-box">
                  <code className="fp-key-text">{post.desc}</code>
                </div>

                <button onClick={() => handleCopy(post.desc)} className="fp-copy-btn">
                  📋 {t('Copy Key', 'Copy Key')}
                </button>
              </div>
            ))}
            <div className="fp-banner-wrap"><Banner /></div>
          </div>
        )}
      </div>
    </main>
  );
}