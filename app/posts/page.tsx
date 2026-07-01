'use client';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Banner from '../components/Banner';

const posts = [
  { num: '၀၁', title: 'Outline Key 1', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTp5NjN2aTRzeGhmd3BpNGMy@129.212.238.130:12647?type=tcp#KP Premium Free Outline' },
  { num: '၀၂', title: 'Ruijie Starlink Old', date: 'Premium High Speed', desc: 'No Data' },
];

export default function PostsPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCopy = (desc: string) => {
    navigator.clipboard.writeText(desc);
    toast.success('Key ကို Copy ယူပြီးပါပြီ!', {
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
        toast.success('အတည်ပြုပြီးပါပြီ!', {
          style: { background: '#7C3AED', color: '#fff', borderRadius: '10px' },
        });
      } else {
        setMessage(data.message || 'Key မမှန်ပါ သို့မဟုတ် အသုံးပြုပြီးသား ဖြစ်နေသည်');
      }
    } catch {
      setMessage('Connection Error ဖြစ်နေသည်');
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
        {/* Header */}
        <div className="fp-header">
          <span className="fp-badge">
            <span className="fp-badge-dot" />
            Outline VPN Keys
          </span>
          <h1 className="fp-title">
            Outline Keys များ<br />
            <span className="fp-title-gradient">Admin မှ ( ပိတ် ) ထားပါသည်</span>
          </h1>
          <p className="fp-sub">
            ဝယ်ယူလိုပါက →{' '}
            <a href="https://t.me/KPBYKP" target="_blank" rel="noopener noreferrer" className="fp-contact-link">
              TG: @KPBYKP
            </a>{' '}
            / <span className="fp-contact-link">Viber: 09769043594</span>
          </p>
        </div>

        {!isVerified ? (
          <div className="fp-gate-card">
            <div className="fp-gate-icon">🔐</div>
            <h2 className="fp-gate-title">Access Key လိုအပ်သည်</h2>
            <p className="fp-gate-desc">Outline keys များအားလုံးကို ကြည့်ရှုရန် Telegram Bot မှ Access Key သွားယူပါ</p>

            <input
              className="fp-input"
              placeholder="Access Key ထည့်ပါ..."
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />

            <button onClick={handleVerify} disabled={loading} className="fp-btn-primary">
              {loading ? <span className="fp-spinner" /> : '✓ အတည်ပြုမည်'}
            </button>

            <div className="fp-divider"><span>သို့မဟုတ်</span></div>

            <a href="https://t.me/KP_WEB_KEY_BOT" target="_blank" rel="noopener noreferrer" className="fp-btn-tg">
              🚀 Telegram Bot မှ Key ယူရန်
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
                  <span className="fp-status fp-status-active">● Active</span>
                </div>

                <div className="fp-key-box">
                  <code className="fp-key-text">{post.desc}</code>
                </div>

                <button onClick={() => handleCopy(post.desc)} className="fp-copy-btn">
                  📋 Copy Key
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