'use client';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
// 👇 Banner component ကို import လိုအပ်ပါသည် — path ကို သင့်ရဲ့ project structure အတိုင်း ပြောင်းပေးပါ
import Banner from '../components/Banner';

interface KeyItem { key: string; ping: number; }

// ping တန်ဖိုးအပေါ် badge info ထုတ်မယ်
// Backend ကနေ real TCP connect timing ပေးပို့တာဖြစ်တဲ့အတွက် ping=0 ဆိုလည်း
// real measurement ပါ (sub-millisecond latency) — ဒါကြောင့် number ကို
// အမြဲတမ်း ပြသပေးတယ်, generic "Active" placeholder မလိုအပ်ပါ။
function getPingBadge(ping: number): { label: string; className: string } {
  if (ping === -1) return { label: '⚫ Timeout',   className: 'fp-ping-dead' };
  if (ping < 100)  return { label: `🟢 ${ping}ms`, className: 'fp-ping-excellent' };
  if (ping < 300)  return { label: `🟡 ${ping}ms`, className: 'fp-ping-good' };
  return             { label: `🔴 ${ping}ms`,       className: 'fp-ping-slow' };
}

export default function FreePage() {
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [keysLoading, setKeysLoading] = useState(false);

  useEffect(() => {
    if (!isVerified) return;
    const loadKeys = async () => {
      setKeysLoading(true);
      try {
        const res = await fetch('https://webbot.kpchannel.cc.cd/fetch-keys-with-ping');
        const rawData = (await res.json()) as KeyItem[];
        setKeys(rawData);
      } catch {
        toast.error('VPN Keys များရယူရန် အဆင်မပြေဖြစ်နေသည်');
      } finally {
        setKeysLoading(false);
      }
    };
    loadKeys();
  }, [isVerified]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Copied!', {
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
        body: JSON.stringify({ key: verifyInput }),
      });
      const data = (await res.json()) as { valid: boolean; message?: string };
      if (data.valid) {
        setIsVerified(true);
      } else {
        setMessage(data.message || 'Key မမှန်ပါ သို့မဟုတ် အသုံးပြုပြီးသား ဖြစ်နေသည်');
      }
    } catch {
      setMessage('Connection Error ဖြစ်နေသည်');
    } finally {
      setLoading(false);
    }
  };

  const filtered = keys.filter((k) => k.key.toLowerCase().includes(searchTerm.toLowerCase()));

  // Online key အရေအတွက် ရေတွက်မယ်
  const onlineCount  = keys.filter(k => k.ping !== -1).length;
  const timeoutCount = keys.filter(k => k.ping === -1).length;

  return (
    <main className="fp-main">
      <Toaster position="top-center" />

      <div className="fp-grid-bg" />
      <div className="fp-glow" />

      <div className="fp-container">
        <div className="fp-header">
          <span className="fp-badge">
            <span className="fp-badge-dot" />
            Free VPN Keys
          </span>
          <h1 className="fp-title">
            V2ray Keys များ<br />
            <span className="fp-title-gradient">Admin မှ ဖွင့်ထားပါသည်</span>
          </h1>
          <p className="fp-sub">
            ဝယ်ယူလိုပါက →{' '}
            <a href="https://t.me/KPBYKP" target="_blank" rel="noopener noreferrer" className="fp-contact-link">
              TG: @KPBYKP
            </a>{' '}
            /{' '}
            <span className="fp-contact-link">Viber: 09769043594</span>
          </p>
        </div>

        {!isVerified ? (
          <div className="fp-gate-card">
            <div className="fp-gate-icon">🔐</div>
            <h2 className="fp-gate-title">Access Key လိုအပ်သည်</h2>
            <p className="fp-gate-desc">
              V2ray Keys များ ကြည့်ရှုရန် Telegram Bot မှ Access Key သွားယူပါ
            </p>

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

            <div className="fp-divider">
              <span>သို့မဟုတ်</span>
            </div>

            <a
              href="https://t.me/KP_WEB_KEY_BOT"
              target="_blank"
              rel="noopener noreferrer"
              className="fp-btn-tg"
            >
              🚀 Telegram Bot မှ Key ယူရန်
            </a>

            {message && (
              <div className="fp-error">
                <span>⚠️</span> {message}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            {!keysLoading && keys.length > 0 && (
              <div className="fp-stats-bar">
                <span className="fp-stat fp-stat-total">🔑 စုစုပေါင်း {keys.length} ခု</span>
                <span className="fp-stat fp-stat-online">🟢 Online {onlineCount} ခု</span>
                <span className="fp-stat fp-stat-dead">⚫ Timeout {timeoutCount} ခု</span>
              </div>
            )}

            <div className="fp-search-wrap">
              <span className="fp-search-icon">🔎</span>
              <input
                className="fp-search"
                placeholder="ရှာရန် (ဥပမာ - Server 1)..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <p className="fp-count">Keys {filtered.length} ခု ရှိသည်</p>

            {keysLoading ? (
              <div className="fp-loading">
                <div className="fp-loading-dots">
                  <span /><span /><span />
                </div>
                <p>Keys နှင့် Ping တန်ဖိုးများ စစ်နေသည်...</p>
              </div>
            ) : (
              <div className="fp-keys-grid">
                {filtered.map((item, index) => {
                  const badge = getPingBadge(item.ping);
                  const isDead = item.ping === -1;
                  return (
                    <div key={index} className={`fp-key-card ${isDead ? 'fp-key-card-dead' : ''}`}>
                      <div className="fp-key-stripe" />

                      <div className="fp-key-header">
                        <div className="fp-key-title-row">
                          <span className="fp-key-icon">🛡️</span>
                          <h3 className="fp-key-name">VPN Server {index + 1}</h3>
                        </div>
                        {/* Ping Badge */}
                        <span className={`fp-ping-badge ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="fp-key-box">
                        <code className="fp-key-text">{item.key}</code>
                      </div>

                      <button
                        onClick={() => handleCopy(item.key)}
                        disabled={isDead}
                        className={`fp-copy-btn ${isDead ? 'fp-copy-btn-dead' : ''}`}
                      >
                        {isDead ? '⚫ Timeout — မသုံးနိုင်ပါ' : '📋 Copy Key'}
                      </button>

                      <div className="fp-banner-wrap">
                        <Banner />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}