'use client';
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Banner from '../components/Banner';
import { PUBLIC_SERVERS_RAW } from '../lib/publicServersRaw';
import { useLanguage } from '../components/LanguageProvider';

type Source = 'private' | 'public';

interface Post {
  num: string;
  title: string;
  date: string;
  desc: string;
  source: Source;
}

interface PostWithPing extends Post {
  ping: number;
  country: string;
  countryCode: string;
}

const privatePosts: Post[] = [
  { num: '01', title: 'Outline Key 1', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpvNTRvNXlpNjhiemE1dWp5@168.144.43.83:46416?type=tcp#KP%20Premium%20Free%20Outline-1', source: 'private' },
  { num: '02', title: 'Outline Key 2', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpkZHBlZ3N0amN2djF4ZXQ4@168.144.43.83:46416?type=tcp#KP%20Premium%20Free%20Outline-2', source: 'private' },
  { num: '03', title: 'Outline Key 3', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpmaXVtNWNja2R2c3RhMWEx@168.144.43.83:46416?type=tcp#KP%20Premium%20Free%20Outline-3', source: 'private' },
  { num: '04', title: 'Outline Key 4', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTo0d3lnbjlvMm0ycmU2eXRl@168.144.43.83:46416?type=tcp#KP%20Premium%20Free%20Outline-4', source: 'private' },
  { num: '05', title: 'Outline Key 5', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTp1d241YWFlMmJqcTZpa2Nq@168.144.43.83:46416?type=tcp#KP%20Premium%20Free%20Outline-5', source: 'private' },
];

function parsePublicServers(raw: string): Post[] {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('ss://'));

  return lines.map((line, i) => {
    let title = `Public Server ${i + 1}`;
    const hashIdx = line.indexOf('#');
    if (hashIdx !== -1) {
      try {
        title = decodeURIComponent(line.slice(hashIdx + 1).replace(/\+/g, ' ')) || title;
      } catch {
        title = line.slice(hashIdx + 1).replace(/\+/g, ' ') || title;
      }
    }
    return {
      num: String(i + 1).padStart(2, '0'),
      title,
      date: 'Public Server',
      desc: line,
      source: 'public' as Source,
    };
  });
}

const publicPosts: Post[] = parsePublicServers(PUBLIC_SERVERS_RAW);
const allPosts: Post[] = [...privatePosts, ...publicPosts];

function extractHostPort(ssKey: string): { host: string; port: number } | null {
  try {
    const match = ssKey.match(/ss:\/\/[^@]+@([^:/?#]+):(\d+)/);
    if (!match) return null;
    return { host: match[1], port: parseInt(match[2]) };
  } catch {
    return null;
  }
}

function countryCodeToFlagUrl(countryCode: string): string | null {
  if (!countryCode || countryCode.length !== 2) return null;
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}

function getPingBadge(ping: number, t: (my: string, en: string) => string): { label: string; className: string } {
  if (ping === -2) return { label: `⏳ ${t('စစ်နေသည်', 'Checking')}`, className: 'fp-ping-checking' };
  if (ping === -1) return { label: '⚫ Timeout', className: 'fp-ping-dead' };
  if (ping < 150) return { label: `🟢 ${ping}ms`, className: 'fp-ping-excellent' };
  if (ping < 400) return { label: `🟡 ${ping}ms`, className: 'fp-ping-good' };
  return { label: `🔴 ${ping}ms`, className: 'fp-ping-slow' };
}

function sortByPing(a: PostWithPing, b: PostWithPing): number {
  const rank = (p: number) => (p >= 0 ? 0 : p === -2 ? 1 : 2);
  const ra = rank(a.ping);
  const rb = rank(b.ping);
  if (ra !== rb) return ra - rb;
  if (ra === 0) return a.ping - b.ping;
  return 0;
}

export default function PostsPage() {
  const { t } = useLanguage();
  const [isVerified, setIsVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [keys, setKeys] = useState<PostWithPing[]>(
    allPosts.map((p) => ({ ...p, ping: -2, country: '', countryCode: '' }))
  );
  const [pingDone, setPingDone] = useState(false);

  const runServerPing = useCallback(async () => {
    setPingDone(false);
    const seen = new Set<string>();
    const targets: { host: string; port: number }[] = [];

    for (const p of allPosts) {
      const parsed = extractHostPort(p.desc);
      if (!parsed) continue;
      const key = `${parsed.host}:${parsed.port}`;
      if (!seen.has(key)) {
        seen.add(key);
        targets.push(parsed);
      }
    }

    if (targets.length === 0) {
      setPingDone(true);
      return;
    }

    try {
      const PING_API_URL = 'https://web-p-nu.vercel.app/api/ping';
      const res = await fetch(PING_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets }),
      });
      const data = (await res.json()) as {
        results: { host: string; port: number; ping: number; country?: string; countryCode?: string }[];
      };

      const infoMap = new Map<string, { ping: number; country: string; countryCode: string }>();
      for (const r of data.results) {
        infoMap.set(`${r.host}:${r.port}`, {
          ping: r.ping,
          country: r.country || '',
          countryCode: r.countryCode || '',
        });
      }

      setKeys((prev) =>
        prev.map((item) => {
          const parsed = extractHostPort(item.desc);
          if (!parsed) return item;
          const ipKey = `${parsed.host}:${parsed.port}`;
          const info = infoMap.get(ipKey);
          return info !== undefined
            ? { ...item, ping: info.ping, country: info.country, countryCode: info.countryCode }
            : item;
        })
      );
    } catch {
      toast.error(t('Ping စစ်ရန် မအောင်မြင်ပါ', 'Failed to check ping'));
      setKeys((prev) => prev.map((item) => ({ ...item, ping: -1 })));
    } finally {
      setPingDone(true);
    }
  }, [t]);

  useEffect(() => {
    if (!isVerified) return;
    runServerPing();
  }, [isVerified, runServerPing]);

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

  const onlineCount = keys.filter((k) => k.ping >= 0).length;
  const timeoutCount = keys.filter((k) => k.ping === -1).length;
  const checkingCount = keys.filter((k) => k.ping === -2).length;

  const privateKeys = keys.filter((k) => k.source === 'private').sort(sortByPing);
  const publicKeys = keys.filter((k) => k.source === 'public').sort(sortByPing);

  const renderKeyCard = (post: PostWithPing, index: number) => {
    const badge = getPingBadge(post.ping, t);
    const isDead = post.ping === -1;
    const isChecking = post.ping === -2;
    return (
      <div
        key={`${post.source}-${index}-${post.desc}`}
        className={`fp-key-card ${isDead ? 'fp-key-card-dead' : ''} ${isChecking ? 'fp-key-card-checking' : ''}`}
      >
        <div className="fp-key-stripe" />

        <div className="fp-key-header">
          <div className="fp-key-title-row">
            <span className="po-num">{post.num}</span>
            <div>
              <h3 className="fp-key-name">
                {post.title}
                {post.countryCode && (
                  <img
                    src={countryCodeToFlagUrl(post.countryCode) || undefined}
                    alt={post.country}
                    title={post.country}
                    className="fp-key-flag"
                    width={18}
                    height={13}
                    loading="lazy"
                    style={{
                      display: 'inline-block',
                      marginLeft: '6px',
                      verticalAlign: 'middle',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </h3>
              <p className="po-date">{post.date}</p>
            </div>
          </div>
          <span className={`fp-ping-badge ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        <div className="fp-key-box">
          <code className="fp-key-text">{post.desc}</code>
        </div>

        <button
          onClick={() => handleCopy(post.desc)}
          disabled={isDead || isChecking}
          className={`fp-copy-btn ${isDead ? 'fp-copy-btn-dead' : ''}`}
        >
          {isDead
            ? `⚫ Timeout — ${t('မသုံးနိုင်ပါ', 'unusable')}`
            : isChecking
            ? `⏳ ${t('Ping စစ်နေသည်...', 'Checking ping...')}`
            : `📋 ${t('Copy Key', 'Copy Key')}`}
        </button>
      </div>
    );
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
            {t('Outline Keys များ', 'Outline Keys')}<br />
            <span className="fp-title-gradient">{t('Admin မှ ( ဖွင့် ) ထားပါသည်', 'Opened by Admin')}</span>
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
            <p className="fp-gate-desc">{t('Outline keys များအားလုံးကို ကြည့်ရှုရန် Telegram Bot မှ Access Key သွားယူပါ', 'Get an Access Key from the Telegram Bot to view all Outline keys')}</p>

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
          <>
            <div className="fp-stats-bar">
              <span className="fp-stat fp-stat-total">🔑 {t('စုစုပေါင်း', 'Total')} {keys.length} {t('ခု', '')}</span>
              <span className="fp-stat fp-stat-online">🟢 Online {onlineCount} {t('ခု', '')}</span>
              <span className="fp-stat fp-stat-dead">⚫ Timeout {timeoutCount} {t('ခု', '')}</span>
              {checkingCount > 0 && (
                <span className="fp-stat fp-stat-checking">⏳ {t('စစ်နေသည်', 'Checking')} {checkingCount} {t('ခု', '')}</span>
              )}
              {pingDone && <span className="fp-stat fp-stat-done">✅ {t('Ping စစ်ပြီး', 'Ping check done')}</span>}
            </div>

            <div className="fp-section">
              <h2 className="fp-section-title">🔒 {t('ကိုယ်ပိုင် Servers', 'Private Servers')} ({privateKeys.length})</h2>
              <div className="fp-keys-grid">
                {privateKeys.map((post, index) => renderKeyCard(post, index))}
              </div>
            </div>

            <div className="fp-section">
              <h2 className="fp-section-title">🌐 Public Servers ({publicKeys.length})</h2>
              <div className="fp-keys-grid">
                {publicKeys.map((post, index) => renderKeyCard(post, index))}
                <div className="fp-banner-wrap"><Banner /></div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}