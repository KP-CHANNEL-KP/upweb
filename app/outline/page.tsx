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
  ping: number;   // server-side status: -2 = checking, -1 = timeout/dead, >=0 = ms (authoritative)
  myPing: number; // browser-side personalized latency: -2 = checking, -1 = not measured, >=0 = ms
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

// Browser ကနေ တိုင်းရတဲ့ raw ms ဟာ TLS-handshake overhead ပါဝင်နေလို့
// actual VPN experience ထက် များစွာ ကြီးနေတတ်ပါတယ် (ဥပမာ 3000ms+ အထိ)။
// ဒါကြောင့် "ms နည်းလေ လိုင်းကောင်းလေ" ဆိုတဲ့ relative feel ကို ထိန်းထားပြီး
// ပြသမယ့် ဂဏန်းကိုပဲ 10ပုံ 1ပုံ လျှော့ပြပါမယ် (comparison logic အတွက်တော့
// raw value ကိုပဲ သုံးမယ် — ဂဏန်းအတိအကျ scale ချကြည့်ချင်ရင် ဒီ constant ကို ပြင်ပါ)
const DISPLAY_SCALE = 0.01;

function scaleForDisplay(rawMs: number): number {
  return Math.max(1, Math.round(rawMs * DISPLAY_SCALE));
}

// Ping badge — server status (authoritative) ကို base အနေနဲ့ သုံးပြီး
// myPing (browser-side, user location) ရရင် အဲ့ဒါကို ms scale-down ပြီး ပြမယ်
function getPingBadge(ping: number, myPing: number): { label: string; className: string } {
  if (ping === -2) return { label: '⏳ စစ်နေသည်', className: 'fp-ping-checking' };
  if (ping === -1) return { label: '⚫ Timeout', className: 'fp-ping-dead' };

  // Server က alive လို့ အတည်ပြုပြီးသား — browser ကနေ user ရဲ့ ကိုယ်ပိုင် ms ရရင် ဒါကိုပဲပြမယ်
  if (myPing >= 0) {
    const shown = scaleForDisplay(myPing);
    // သတ်မှတ်ချက် (color grading) ကို ပြသနေတဲ့ scaled ဂဏန်းအပေါ်ကိုပဲ ယှဉ်မယ်
    // (raw value အတိုင်း ယှဉ်ရင် scale လျှော့ပြီးတဲ့နောက် threshold ကနေ ကျော်နေတတ်လို့
    // key အားလုံး တစ်ဆင့်တည်း (နီရောင်) ပဲ ပြနေတတ်ပါတယ်)
    if (shown < 30) return { label: `🟢 ≈${shown}ms`, className: 'fp-ping-excellent' };
    if (shown < 60) return { label: `🟡 ≈${shown}ms`, className: 'fp-ping-good' };
    return { label: `🔴 ≈${shown}ms`, className: 'fp-ping-slow' };
  }
  // myPing မရသေးရင် (checking or not measured) fallback
  if (myPing === -2) return { label: '🟢 Online (Ping...)', className: 'fp-ping-excellent' };
  return { label: '🟢 Online', className: 'fp-ping-excellent' };
}

// Browser ကနေ တိုက်ရိုက် latency တိုင်းမယ် — user ရဲ့ တကယ့် location ကနေ
// (no-cors fetch — CORS error = server response ရလာတယ် = alive/latency ရ)
// Network jitter ကြောင့် တစ်ကြိမ်တည်း တိုင်းရင် မတိကျနိုင်လို့ ၃ ကြိမ်တိုင်းပြီး
// အနှေးဆုံး hiccup တွေဖယ်ကာ အသေးဆုံး (အမြန်ဆုံး/ တည်ငြိမ်ဆုံး) ကို ယူမယ်
async function measureOnce(host: string, port: number): Promise<number> {
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

async function checkPingBrowser(host: string, port: number): Promise<number> {
  const ATTEMPTS = 3;
  const results: number[] = [];

  for (let i = 0; i < ATTEMPTS; i++) {
    const r = await measureOnce(host, port);
    if (r >= 0) results.push(r);
    // attempt ချင်းကြား slight delay — TLS/connection reuse effect လျှော့ဖို့
    if (i < ATTEMPTS - 1) await new Promise((res) => setTimeout(res, 80));
  }

  if (results.length === 0) return -1; // အကြိမ်ကုန် timeout ဖြစ်ခဲ့ရင်ပဲ dead လို့သတ်မှတ်မယ်
  results.sort((a, b) => a - b);
  return results[Math.floor(results.length / 2)]; // median ယူ — outlier တွေ ရှောင်ဖို့
}

export default function PostsPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [keys, setKeys] = useState<PostWithPing[]>(
    posts.map((p) => ({ ...p, ping: -2, myPing: -1 }))
  );
  const [pingDone, setPingDone] = useState(false);

  // Browser ကနေ user ရဲ့ ကိုယ်ပိုင် latency ကို chunk 5 စီ တိုင်းမယ်
  const runBrowserPing = useCallback(async (targets: { host: string; port: number }[]) => {
    // Checking state ကို online key တွေအတွက် ပြင်ထားမယ်
    setKeys((prev) =>
      prev.map((item) => {
        const parsed = extractHostPort(item.desc);
        if (!parsed) return item;
        const isTarget = targets.some((t) => t.host === parsed.host && t.port === parsed.port);
        return isTarget ? { ...item, myPing: -2 } : item;
      })
    );

    const myPingMap = new Map<string, number>();
    const chunks: { host: string; port: number }[][] = [];
    for (let i = 0; i < targets.length; i += 5) chunks.push(targets.slice(i, i + 5));

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async ({ host, port }) => {
          const ping = await checkPingBrowser(host, port);
          myPingMap.set(`${host}:${port}`, ping);
        })
      );
      setKeys((prev) =>
        prev.map((item) => {
          const parsed = extractHostPort(item.desc);
          if (!parsed) return item;
          const key = `${parsed.host}:${parsed.port}`;
          const myPing = myPingMap.get(key);
          return myPing !== undefined ? { ...item, myPing } : item;
        })
      );
    }
  }, []);

  // Server-side /api/ping endpoint ကို ခေါ်ပြီး real TCP ping စစ်မယ်
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
        results: { host: string; port: number; ping: number }[];
      };

      const ipPingMap = new Map<string, number>();
      for (const r of data.results) {
        ipPingMap.set(`${r.host}:${r.port}`, r.ping);
      }

      setKeys((prev) =>
        prev.map((item) => {
          const parsed = extractHostPort(item.desc);
          if (!parsed) return item;
          const ipKey = `${parsed.host}:${parsed.port}`;
          const ping = ipPingMap.get(ipKey);
          return ping !== undefined ? { ...item, ping } : item;
        })
      );

      // Server status "Online" ပြတဲ့ key တွေအတွက်ပဲ — browser ကနေ
      // user ရဲ့ တကယ့် location ကနေ personalized ping ထပ်တိုင်းမယ်
      const onlineTargets = targets.filter((t) => {
        const p = ipPingMap.get(`${t.host}:${t.port}`);
        return p !== undefined && p >= 0;
      });
      if (onlineTargets.length > 0) {
        runBrowserPing(onlineTargets);
      }
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
                const badge = getPingBadge(post.ping, post.myPing);
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