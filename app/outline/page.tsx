'use client';
import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Banner from '../components/Banner';

interface Post {
  num: string;
  title: string;
  date: string;
  desc: string;
}

interface PostWithPing extends Post {
  // Server (Vercel /api/ping) ကနေ real TCP connect လုပ်ပြီး ရလာတဲ့ authoritative value
  // -2 = checking, -1 = timeout/dead, >=0 = ms
  ping: number;
  country: string;     // ဥပမာ - "Singapore" — backend ကနေ auto-detect လုပ်ပေးတာ
  countryCode: string; // ဥပမာ - "SG" — flag emoji ဆောက်ဖို့ သုံးမယ်
}

const posts: Post[] = [
  { num: '01', title: 'Outline Key 1', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpqbnYwN3VvOWkwdW1lajc4@129.212.238.130:12647?type=tcp#Premium%20Free%20Outline-1' },
  { num: '02', title: 'Outline Key 2', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpmZHR5OTloY2NuZzMydW5l@129.212.238.130:12647?type=tcp#Premium%20Free%20Outline-2' },
  { num: '03', title: 'Outline Key 3', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTozYmJhcXlrNmkxbjl5bWF2@129.212.238.130:12647?type=tcp#Premium%20Free%20Outline-3' },
  { num: '04', title: 'Outline Key 4', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTo4Y3NtYmtxaXk4eWdmNzMy@129.212.238.130:12647?type=tcp#Premium%20Free%20Outline-4' },
  { num: '05', title: 'Outline Key 5', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpqbWN4aWhlOXI0aDVhaG1t@129.212.238.130:12647?type=tcp#Premium%20Free%20Outline-5' },
];

// ss:// key ထဲကနေ Host:Port ဆွဲထုတ်မယ်
// Format: ss://BASE64(method:password)@host:port?type=tcp#name
function extractHostPort(ssKey: string): { host: string; port: number } | null {
  try {
    const match = ssKey.match(/ss:\/\/[^@]+@([^:/?#]+):(\d+)/);
    if (!match) return null;
    return { host: match[1], port: parseInt(match[2]) };
  } catch {
    return null;
  }
}

// ISO country code (ဥပမာ "SG") ကို flag emoji ("🇸🇬") အဖြစ် ပြောင်းမယ်
// Unicode regional indicator symbol logic — country code မရှိရင် placeholder ပြန်ပေး
function countryCodeToFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🏳️';
  const codePoints = [...countryCode.toUpperCase()].map(
    (c) => 127397 + c.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

// Ping badge — server (Vercel) ကနေ real TCP connect တိုင်းထားတဲ့ ms ကို တိုက်ရိုက်ပြမယ်
// ဒါက protocol (ss / trojan / vmess) ဘာဖြစ်ဖြစ် တိကျပါတယ် — TCP layer ကိုပဲ တိုင်းလို့ပါ
function getPingBadge(ping: number): { label: string; className: string } {
  if (ping === -2) return { label: '⏳ စစ်နေသည်', className: 'fp-ping-checking' };
  if (ping === -1) return { label: '⚫ Timeout', className: 'fp-ping-dead' };
  if (ping < 150) return { label: `🟢 ${ping}ms`, className: 'fp-ping-excellent' };
  if (ping < 400) return { label: `🟡 ${ping}ms`, className: 'fp-ping-good' };
  return { label: `🔴 ${ping}ms`, className: 'fp-ping-slow' };
}

export default function PostsPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [keys, setKeys] = useState<PostWithPing[]>(
    posts.map((p) => ({ ...p, ping: -2, country: '', countryCode: '' }))
  );
  const [pingDone, setPingDone] = useState(false);

  // Server-side /api/ping endpoint (Vercel, Node runtime) ကို ခေါ်ပြီး
  // real TCP ping စစ်မယ် — Cloudflare Pages Functions မှာ raw TCP socket
  // ဖွင့်လို့ မရလို့ ဒီ ping logic ကို Vercel host ခွဲထားတာ ဖြစ်ပါတယ်
  const runServerPing = useCallback(async () => {
    setPingDone(false);

    // Unique host:port — dedupe ပြီး api ကို တစ်ခါတည်း ပို့မယ်
    const seen = new Set<string>();
    const targets: { host: string; port: number }[] = [];

    for (const p of posts) {
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
      // Vercel ပေါ်မှာ သီးသန့် host ထားတဲ့ ping API
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
      toast.error('Ping စစ်ရန် မအောင်မြင်ပါ');
      // Fetch fail ရင် အားလုံးကို dead (-1) အနေနဲ့ သတ်မှတ်မယ်
      setKeys((prev) => prev.map((item) => ({ ...item, ping: -1 })));
    } finally {
      setPingDone(true);
    }
  }, []);

  // Verify ပြီးတာနဲ့ ping စစ်မယ်
  useEffect(() => {
    if (!isVerified) return;
    runServerPing();
  }, [isVerified, runServerPing]);

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

  const onlineCount = keys.filter((k) => k.ping >= 0).length;
  const timeoutCount = keys.filter((k) => k.ping === -1).length;
  const checkingCount = keys.filter((k) => k.ping === -2).length;

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
            <span className="fp-title-gradient">Admin မှ ( ဖွင့် ) ထားပါသည်</span>
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
          <>
            {/* Stats Bar */}
            <div className="fp-stats-bar">
              <span className="fp-stat fp-stat-total">🔑 စုစုပေါင်း {keys.length} ခု</span>
              <span className="fp-stat fp-stat-online">🟢 Online {onlineCount} ခု</span>
              <span className="fp-stat fp-stat-dead">⚫ Timeout {timeoutCount} ခု</span>
              {checkingCount > 0 && (
                <span className="fp-stat fp-stat-checking">⏳ စစ်နေသည် {checkingCount} ခု</span>
              )}
              {pingDone && <span className="fp-stat fp-stat-done">✅ Ping စစ်ပြီး</span>}
            </div>

            <div className="fp-keys-grid">
              {keys.map((post, index) => {
                const badge = getPingBadge(post.ping);
                const isDead = post.ping === -1;
                const isChecking = post.ping === -2;
                return (
                  <div
                    key={index}
                    className={`fp-key-card ${isDead ? 'fp-key-card-dead' : ''} ${isChecking ? 'fp-key-card-checking' : ''}`}
                  >
                    <div className="fp-key-stripe" />

                    <div className="fp-key-header">
                      <div className="fp-key-title-row">
                        <span className="po-num">{post.num}</span>
                        <div>
                          <h3 className="fp-key-name">{post.title}</h3>
                          <p className="po-date">
                            {post.date}
                            {post.country && (
                              <span className="fp-key-country">
                                {' '}· {countryCodeToFlag(post.countryCode)} {post.country}
                              </span>
                            )}
                          </p>
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
                        ? '⚫ Timeout — မသုံးနိုင်ပါ'
                        : isChecking
                        ? '⏳ Ping စစ်နေသည်...'
                        : '📋 Copy Key'}
                    </button>
                  </div>
                );
              })}
              <div className="fp-banner-wrap"><Banner /></div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}