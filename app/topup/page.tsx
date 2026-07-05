'use client';
import { useMemo, useState } from 'react';
import {
  Wallet,
  CreditCard,
  History,
  ChevronRight,
  Gamepad2,
  Swords,
  ThumbsUp,
  Send,
  Music2,
  Video,
  Link2,
  Phone,
  Hash,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
// globals.css ကို layout.tsx ထဲမှာပဲ တစ်ခါတည်း import လုပ်ထားပါ — Next.js က
// global CSS ကို root layout ကလွဲပြီး တခြားနေရာက import လုပ်ရင် build error တက်ပါတယ်

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type PackageItem = { name: string; price: string };

type GameKey = 'pubg' | 'ml' | 'fb' | 'tg' | 'tt' | 'yt';

type GameDef = {
  key: GameKey;
  label: string;
  tag: string;
  icon: React.ReactNode;
  needsUserId: boolean;
  idPlaceholder: string;
};

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const GAMES: GameDef[] = [
  { key: 'pubg', label: 'PUBG Mobile', tag: 'UC Top Up', icon: <Gamepad2 size={16} />, needsUserId: true, idPlaceholder: 'Player ID (ဥပမာ 512xxxxxxx)' },
  { key: 'ml', label: 'Mobile Legends', tag: 'Diamonds / DM', icon: <Swords size={16} />, needsUserId: true, idPlaceholder: 'User ID (Zone ID) ဥပမာ 123456789(1234)' },
  { key: 'fb', label: 'Facebook Service', tag: 'Page / Profile Boost', icon: <ThumbsUp size={16} />, needsUserId: false, idPlaceholder: 'Profile / Page လင့်ခ်' },
  { key: 'tg', label: 'Telegram Service', tag: 'Member / View Boost', icon: <Send size={16} />, needsUserId: false, idPlaceholder: 'Channel / Group လင့်ခ်' },
  { key: 'tt', label: 'Tiktok Service', tag: 'Followers / Views', icon: <Music2 size={16} />, needsUserId: false, idPlaceholder: 'Tiktok Profile လင့်ခ်' },
  { key: 'yt', label: 'Youtube Service', tag: 'Sub / View Boost', icon: <Video size={16} />, needsUserId: false, idPlaceholder: 'Youtube Channel / Video လင့်ခ်' },
];

const PACKAGES: Record<GameKey, PackageItem[]> = {
  pubg: [
    { name: '60 UC', price: '3,800 ကျပ်' },
    { name: '325 UC', price: '18,000 ကျပ်' },
    { name: '660 UC', price: '35,800 ကျပ်' },
    { name: '1800 UC', price: '89,300 ကျပ်' },
    { name: '3850 UC', price: '177,800 ကျပ်' },
    { name: '8100 UC', price: '360,300 ကျပ်' },
  ],
  ml: [
    { name: '86 Diamonds', price: '4,900 ကျပ်' },
    { name: '172 Diamonds', price: '9,600 ကျပ်' },
    { name: '257 Diamonds', price: '14,100 ကျပ်' },
    { name: '344 Diamonds', price: '18,700 ကျပ်' },
    { name: '429 Diamonds', price: '23,700 ကျပ်' },
    { name: 'Weekly Pass', price: '6,000 ကျပ်' },
  ],
  fb: [
    { name: 'Follower ~1k', price: '16,500 ကျပ်' },
    { name: 'Comment ~1ခု', price: '100 ကျပ်' },
    { name: 'Custom Comment ~1ခု', price: '500 ကျပ်' },
    { name: 'Love ~1k', price: '1,000 ကျပ်' },
    { name: 'Like ~1k', price: '1,000 ကျပ်' },
    { name: 'Video/Reels view ~1k', price: '1,000 ကျပ်' },
  ],
  tg: [
    { name: 'Channel/Group Member ~1k', price: '10,000 ကျပ်' },
    { name: 'Post View (Fast) ~1k', price: '500 ကျပ်' },
    { name: 'Reaction အစုံ ~1k', price: '500 ကျပ်' },
  ],
  tt: [
    { name: 'Follower (Lifetime) ~1k', price: '9,000 ကျပ်' },
    { name: 'View ~1k', price: '1,000 ကျပ်' },
    { name: 'Like (Lifetime) ~1k', price: '1,000 ကျပ်' },
  ],
  yt: [
    { name: 'Subscribers (Lifetime) ~1k', price: '65,000 ကျပ်' },
    { name: 'Like ~1k', price: '3,000 ကျပ်' },
    { name: 'View (Lifetime) ~1k', price: '10,000 ကျပ်' },
  ],
};

const PAY_METHODS = [
  { key: 'wave', label: 'Wave Pay' },
  { key: 'kpay', label: 'Kbz Pay' },
] as const;

type PayKey = (typeof PAY_METHODS)[number]['key'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TopUpPage() {
  // Google Sign-In ကို ခဏဖြုတ်ထားပြီး Testing အတွက် user ကို default တန်ဖိုးပေးထားပါတယ်
  const [user] = useState({
    name: 'KP User',
    photo: 'https://ui-avatars.com/api/?name=KP+User',
    id: 'kp1234567890',
  });

  const [selectedGame, setSelectedGame] = useState<GameKey>('pubg');
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(0);
  const [selectedPay, setSelectedPay] = useState<PayKey>('wave');

  const [idOrLink, setIdOrLink] = useState('');
  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState('');

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const game = useMemo(() => GAMES.find((g) => g.key === selectedGame)!, [selectedGame]);
  const packages = PACKAGES[selectedGame];
  const selectedPkg = packages[selectedPkgIndex];

  function handleSelectGame(key: GameKey) {
    setSelectedGame(key);
    setSelectedPkgIndex(0);
  }

  function validate(): string | null {
    if (!idOrLink.trim()) return game.needsUserId ? 'User ID ဖြည့်ပေးပါ' : 'လင့်ခ် ဖြည့်ပေးပါ';
    if (!phone.trim()) return 'ဖုန်းနံပါတ် ဖြည့်ပေးပါ';
    if (refCode.replace(/\D/g, '').length !== 5) return 'ငွေလွှဲပြေစာ နောက်ဆုံး ၅ လုံး မှန်ကန်စွာ ဖြည့်ပေးပါ';
    return null;
  }

  async function submitOrder() {
    const err = validate();
    if (err) {
      setStatus('error');
      setErrorMsg(err);
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          game: game.label,
          idOrLink,
          phone,
          refCode,
          pkg: selectedPkg,
          payMethod: PAY_METHODS.find((p) => p.key === selectedPay)?.label,
        }),
      });

      if (!res.ok) throw new Error('server error');

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('အင်တာနက် ပြဿနာ ရှိနေပါသည်။ ထပ်စမ်းကြည့်ပါ။');
    }
  }

  return (
    <main className="tp-main">
      <div className="tp-grid-bg" />
      <div className="tp-glow" />

      <div className="tp-container">
        {/* Profile Header */}
        <div className="tp-profile-card">
          <div className="tp-profile-left">
            <img src={user.photo} className="tp-avatar" alt={user.name} />
            <div>
              <div className="tp-profile-name">{user.name}</div>
              <div className="tp-profile-id">ID: {user.id.slice(0, 8)}...</div>
            </div>
          </div>
          <div>
            <div className="tp-balance-label">လက်ကျန်ငွေ</div>
            <div className="tp-balance-value">5,000 Coin</div>
          </div>
        </div>

        {/* Service selection */}
        <div className="tp-card">
          <div className="tp-card-stripe" />
          <h3 className="tp-card-title">
            <Wallet size={17} /> ဂိမ်း / Service ရွေးပါ
          </h3>

          <div className="tp-service-grid">
            {GAMES.map((g) => (
              <button
                key={g.key}
                onClick={() => handleSelectGame(g.key)}
                className={`tp-service-card${g.key === selectedGame ? ' active' : ''}`}
              >
                <div className="tp-service-title">
                  {g.icon}
                  {g.label}
                </div>
                <div className="tp-service-tag">{g.tag}</div>
              </button>
            ))}
          </div>

          <div className="tp-field">
            <label className="tp-label">
              {game.needsUserId ? <Hash size={13} /> : <Link2 size={13} />}
              {game.needsUserId ? 'User ID' : 'Profile / Post လင့်ခ်'}
            </label>
            <input
              value={idOrLink}
              onChange={(e) => setIdOrLink(e.target.value)}
              placeholder={game.idPlaceholder}
              className="tp-input"
            />
          </div>

          <div className="tp-field">
            <label className="tp-label">
              <Phone size={13} /> ဆက်သွယ်ရန် ဖုန်းနံပါတ်
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
              maxLength={11}
              placeholder="09xxxxxxxxx"
              className="tp-input"
            />
          </div>
        </div>

        {/* Packages */}
        <div className="tp-card">
          <div className="tp-card-stripe" />
          <h3 className="tp-card-title">
            <CreditCard size={17} /> {game.label} — ပမာဏ ရွေးပါ
          </h3>

          <div className="tp-pkg-grid">
            {packages.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setSelectedPkgIndex(i)}
                className={`tp-pkg-card${i === selectedPkgIndex ? ' active' : ''}`}
              >
                <div className="tp-pkg-name">{p.name}</div>
                <div className="tp-pkg-price">{p.price}</div>
              </button>
            ))}
          </div>

          <div className="tp-field">
            <label className="tp-label">ငွေပေးချေနည်း</label>
            <div className="tp-pay-grid">
              {PAY_METHODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPay(p.key)}
                  className={`tp-pay-btn${selectedPay === p.key ? ' active' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tp-transfer-note">
            ငွေလွှဲပြီးမှ အောက်က မှာယူမည် နှိပ်ပါ
            <span className="tp-transfer-number">Wave/KPay: 09966955081</span>
          </div>

          <div className="tp-field">
            <label className="tp-label">ငွေလွှဲပြေစာ နောက်ဆုံး ၅ လုံး</label>
            <input
              value={refCode}
              onChange={(e) => setRefCode(e.target.value.replace(/[^\d]/g, ''))}
              maxLength={5}
              placeholder="12345"
              className="tp-input tp-input-ref"
            />
          </div>

          {status === 'error' && <p className="tp-error-text">{errorMsg}</p>}

          {status === 'success' ? (
            <div className="tp-success-box">
              <CheckCircle2 size={18} /> ပေးပို့ပြီးပါပြီ — ၁၀ မိနစ်အတွင်း ဖြည့်ပေးပါမည်
            </div>
          ) : (
            <button onClick={submitOrder} disabled={status === 'sending'} className="tp-submit-btn">
              {status === 'sending' ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'tp-spin 0.7s linear infinite' }} /> ပို့နေပါသည်...
                </>
              ) : (
                'Confirm Top Up'
              )}
            </button>
          )}
        </div>

        {/* History */}
        <button className="tp-history-btn">
          <span className="tp-history-left">
            <History size={17} /> ငွေဖြည့်မှတ်တမ်း
          </span>
          <ChevronRight size={17} />
        </button>
      </div>
    </main>
  );
}