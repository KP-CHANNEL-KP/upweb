'use client';
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Banner from '../components/Banner';
import { useLanguage } from '../components/LanguageProvider';

interface KeyItem { key: string; ping: number; }

function extractHostPort(trojanKey: string): { host: string; port: number } | null {
  try {
    const match = trojanKey.match(/trojan:\/\/[^@]+@([^:/?#]+):(\d+)/);
    if (!match) return null;
    return { host: match[1], port: parseInt(match[2]) };
  } catch {
    return null;
  }
}

async function checkPingBrowser(host: string, port: number): Promise<number> {
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    await fetch(`https://${host}:${port}`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors',
      cache: 'no-store',
    });
    clearTimeout(timer);
    return Math.round(performance.now() - start);
  } catch (e: any) {
    clearTimeout(timer);
    if (e?.name === 'AbortError') return -1;
    return Math.round(performance.now() - start);
  }
}

function getPingBadge(ping: number, t: (my: string, en: string) => string): { label: string; className: string } {
  if (ping === -2)  return { label: `⏳ ${t('စစ်နေသည်', 'Checking')}`, className: 'fp-ping-checking' };
  if (ping === -1)  return { label: '⚫ Timeout',    className: 'fp-ping-dead' };
  if (ping < 100)   return { label: `🟢 ${ping}ms`,  className: 'fp-ping-excellent' };
  if (ping < 300)   return { label: `🟡 ${ping}ms`,  className: 'fp-ping-good' };
  return              { label: `🔴 ${ping}ms`,        className: 'fp-ping-slow' };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function FreePage() {
  const { t } = useLanguage();
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [searchTerm, setSearchTerm]   = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [isVerified, setIsVerified]   = useState(false);
  const [message, setMessage]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [keysLoading, setKeysLoading] = useState(false);
  const [pingDone, setPingDone]       = useState(false);

  const loadKeys = useCallback(async () => {
    setKeysLoading(true);
    setPingDone(false);
    try {
      const res = await fetch('https://webbot.kpchannel.cc.cd/fetch-keys');
      const rawKeys = (await res.json()) as string[];
      setKeys(rawKeys.map((k) => ({ key: k, ping: -2 })));
    } catch {
      toast.error(t('VPN Keys များ ရယူ၍ မရပါ', 'Failed to fetch VPN keys'));
    } finally {
      setKeysLoading(false);
    }
  }, [t]);

  const runBrowserPing = useCallback(async (rawKeys: string[]) => {
    const ipPingMap = new Map<string, number>();
    const seen      = new Set<string>();
    const toCheck: Array<{ host: string; port: number; ipKey: string }> = [];

    for (const k of rawKeys) {
      const parsed = extractHostPort(k);
      if (!parsed) continue;
      const ipKey = `${parsed.host}:${parsed.port}`;
      if (!seen.has(ipKey)) {
        seen.add(ipKey);
        toCheck.push({ ...parsed, ipKey });
      }
    }

    const chunks = chunkArray(toCheck, 5);
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async ({ host, port, ipKey }) => {
          const ping = await checkPingBrowser(host, port);
          ipPingMap.set(ipKey, ping);
        })
      );
      setKeys((prev) =>
        prev.map((item) => {
          const parsed = extractHostPort(item.key);
          if (!parsed) return item;
          const ipKey = `${parsed.host}:${parsed.port}`;
          const ping  = ipPingMap.get(ipKey);
          return ping !== undefined ? { ...item, ping } : item;
        })
      );
    }

    setKeys((prev) =>
      [...prev].sort((a, b) => {
        if (a.ping === -1 && b.ping === -1) return 0;
        if (a.ping === -1) return 1;
        if (b.ping === -1) return -1;
        if (a.ping === -2 && b.ping === -2) return 0;
        if (a.ping === -2) return 1;
        if (b.ping === -2) return -1;
        return a.ping - b.ping;
      })
    );
    setPingDone(true);
  }, []);

  useEffect(() => {
    if (!isVerified) return;
    loadKeys();
  }, [isVerified, loadKeys]);

  useEffect(() => {
    if (keys.length === 0 || keysLoading) return;
    if (keys.some((k) => k.ping === -2)) {
      runBrowserPing(keys.map((k) => k.key));
    }
  }, [keysLoading, keys.length]); // eslint-disable-line

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
        setMessage(data.message || t('Key မမှန်ပါ သို့မဟုတ် အသုံးပြုပြီးသား ဖြစ်နေသည်', 'Invalid or already-used key'));
      }
    } catch {
      setMessage(t('Connection Error ဖြစ်နေသည်', 'Connection error'));
    } finally {
      setLoading(false);
    }
  };

  const filtered    = keys.filter((k) => k.key.toLowerCase().includes(searchTerm.toLowerCase()));
  const onlineCount = keys.filter((k) => k.ping >= 0).length;
  const timeoutCount= keys.filter((k) => k.ping === -1).length;
  const checkingCount = keys.filter((k) => k.ping === -2).length;

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
            {t('V2ray Keys များ', 'V2ray Keys')}<br />
            <span className="fp-title-gradient">{t('Admin မှ ( ဖွင့် ) ထားပါသည်', 'Opened by Admin')}</span>
          </h1>
          <p className="fp-sub">
            {t('ဝယ်ယူလိုပါက', 'To purchase, contact')} →{' '}
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
            <h2 className="fp-gate-title">{t('Access Key လိုအပ်သည်', 'Access Key Required')}</h2>
            <p className="fp-gate-desc">
              {t('V2ray Keys များ ကြည့်ရှုရန် Telegram Bot မှ Access Key သွားယူပါ', 'Get an Access Key from the Telegram Bot to view V2ray Keys')}
            </p>
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
            <a
              href="https://t.me/KP_WEB_KEY_BOT"
              target="_blank"
              rel="noopener noreferrer"
              className="fp-btn-tg"
            >
              🚀 {t('Telegram Bot မှ Key ယူရန်', 'Get Key from Telegram Bot')}
            </a>
            {message && (
              <div className="fp-error"><span>⚠️</span> {message}</div>
            )}
          </div>
        ) : (
          <>
            {!keysLoading && keys.length > 0 && (
              <div className="fp-stats-bar">
                <span className="fp-stat fp-stat-total">🔑 {t('စုစုပေါင်း', 'Total')} {keys.length} {t('ခု', '')}</span>
                <span className="fp-stat fp-stat-online">🟢 Online {onlineCount} {t('ခု', '')}</span>
                <span className="fp-stat fp-stat-dead">⚫ Timeout {timeoutCount} {t('ခု', '')}</span>
                {checkingCount > 0 && (
                  <span className="fp-stat fp-stat-checking">⏳ {t('စစ်နေသည်', 'Checking')} {checkingCount} {t('ခု', '')}</span>
                )}
                {pingDone && (
                  <span className="fp-stat fp-stat-done">✅ {t('Ping စစ်ပြီး', 'Ping check done')}</span>
                )}
              </div>
            )}

            <div className="fp-search-wrap">
              <span className="fp-search-icon">🔎</span>
              <input
                className="fp-search"
                placeholder={t('ရှာရန် (ဥပမာ - Server 1)...', 'Search (e.g. Server 1)...')}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <p className="fp-count">Keys {filtered.length} {t('ခု ရှိသည်', 'found')}</p>

            {keysLoading ? (
              <div className="fp-loading">
                <div className="fp-loading-dots">
                  <span /><span /><span />
                </div>
                <p>{t('Keys များ ရယူနေသည်...', 'Fetching keys...')}</p>
              </div>
            ) : (
              <div className="fp-keys-grid">
                {filtered.map((item, index) => {
                  const badge  = getPingBadge(item.ping, t);
                  const isDead = item.ping === -1;
                  const isChecking = item.ping === -2;
                  return (
                    <div
                      key={index}
                      className={`fp-key-card ${isDead ? 'fp-key-card-dead' : ''} ${isChecking ? 'fp-key-card-checking' : ''}`}
                    >
                      <div className="fp-key-stripe" />
                      <div className="fp-key-header">
                        <div className="fp-key-title-row">
                          <span className="fp-key-icon">🛡️</span>
                          <h3 className="fp-key-name">VPN Server {index + 1}</h3>
                        </div>
                        <span className={`fp-ping-badge ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="fp-key-box">
                        <code className="fp-key-text">{item.key}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(item.key)}
                        disabled={isDead || isChecking}
                        className={`fp-copy-btn ${isDead ? 'fp-copy-btn-dead' : ''}`}
                      >
                        {isDead     ? `⚫ Timeout — ${t('မသုံးနိုင်ပါ', 'unusable')}`
                         : isChecking ? `⏳ ${t('Ping စစ်နေသည်...', 'Checking ping...')}`
                         : `📋 ${t('Copy Key', 'Copy Key')}`}
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