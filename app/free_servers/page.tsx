'use client';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Banner from '../components/Banner';
// Fallback for missing module '../lib/publicServersRaw'
// If you have a real publicServersRaw file, remove this fallback and restore the import.
const PUBLIC_SERVERS_RAW = '';
import { useLanguage } from '../components/LanguageProvider';

type Source = 'private' | 'public';

interface Post {
  num: string;
  title: string;
  date: string;
  desc: string;
  source: Source;
}

const privatePosts: Post[] = [
  { num: '01', title: 'Outline Key', date: 'Premium High Speed', desc: 'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpma24yeXNoMTBncXRtMWp5@178.128.106.179:11711?type=tcp#KP%20FREE%20OUTLINE-KP_FREE_OUTLINE', source: 'private' },
  { num: '02', title: 'Vless Key', date: 'Premium High Speed', desc: 'vless://b780252c-44af-458c-987a-a6d1e4ba8f05@178.128.106.179:46291?encryption=none&security=none&type=tcp#KP%20FREE%20VLESS-KP_FREE_VLESS', source: 'private' },
  { num: '03', title: 'Vmess Key', date: 'Premium High Speed', desc: 'vmess://ewogICJhZGQiOiAiMTc4LjEyOC4xMDYuMTc5IiwKICAiaWQiOiAiZWI1MDI3YWQtZmExOC00OTNiLTgwN2MtZGM4N2E5ODkyOWE0IiwKICAibmV0IjogInRjcCIsCiAgInBvcnQiOiAxNjU2NSwKICAicHMiOiAiS1AgRlJFRSBWTUVTUy1LUF9GUkVFX1ZNRVNTIiwKICAic2N5IjogImF1dG8iLAogICJ0bHMiOiAibm9uZSIsCiAgInR5cGUiOiAibm9uZSIsCiAgInYiOiAiMiIKfQ==', source: 'private' },
  { num: '04', title: 'Trojan Key', date: 'Premium High Speed', desc: 'trojan://iz66rtwyjh1ngjgk@178.128.106.179:23071?security=none&type=tcp#KP%20FREE%20TROJAN-KP_FREE_TROJAN', source: 'private' },
  { num: '05', title: 'Up All Keys', date: 'Premium High Speed', desc: 'https://178.128.106.179:2096/sub/0oxwip0htlt1msy2', source: 'private' },
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

export default function PostsPage() {
  const { t } = useLanguage();
  const [isVerified, setIsVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const privateKeys = allPosts.filter((k) => k.source === 'private');
  const publicKeys = allPosts.filter((k) => k.source === 'public');

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

  const renderKeyCard = (post: Post, index: number) => {
    return (
      <div
        key={`${post.source}-${index}-${post.desc}`}
        className="fp-key-card"
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
        </div>

        <div className="fp-key-box">
          <code className="fp-key-text">{post.desc}</code>
        </div>

        <button onClick={() => handleCopy(post.desc)} className="fp-copy-btn">
          📋 {t('Copy Key', 'Copy Key')}
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
            {t('အခမဲ့ ဆာဗာ များ', 'Free Servers')}<br />
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
              <span className="fp-stat fp-stat-total">🔑 {t('စုစုပေါင်း', 'Total')} {allPosts.length} {t('ခု', '')}</span>
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