'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Wallet,
  CreditCard,
  History,
  ChevronRight,
  Clapperboard,
  Music2,
  Palette,
  Sparkles,
  MonitorPlay,
  Scissors,
  Phone,
  Loader2,
  CheckCircle2,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
// globals.css ကို layout.tsx ထဲမှာပဲ တစ်ခါတည်း import လုပ်ထားပါ

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type PackageItem = { name: string; price: string };

type ServiceKey = 'netflix' | 'spotify' | 'canva' | 'chatgpt' | 'youtube' | 'capcut';

type ServiceDef = {
  key: ServiceKey;
  label: string;
  tag: string;
  icon: React.ReactNode;
};

type DeliveredAccount = { email: string; password: string };

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const SERVICES: ServiceDef[] = [
  { key: 'netflix', label: 'Netflix Premium', tag: 'Private / Shared Slot', icon: <Clapperboard size={16} /> },
  { key: 'spotify', label: 'Spotify Premium', tag: 'Family / Individual', icon: <Music2 size={16} /> },
  { key: 'canva', label: 'Canva Pro', tag: 'Design Tools', icon: <Palette size={16} /> },
  { key: 'chatgpt', label: 'ChatGPT Plus', tag: 'AI Assistant', icon: <Sparkles size={16} /> },
  { key: 'youtube', label: 'Youtube Premium', tag: 'Ad-free + Music', icon: <MonitorPlay size={16} /> },
  { key: 'capcut', label: 'CapCut Pro', tag: 'Video Editing', icon: <Scissors size={16} /> },
];

const PACKAGES: Record<ServiceKey, PackageItem[]> = {
  netflix: [
    { name: '1 Month Private', price: '12,000 ကျပ်' },
    { name: '3 Month Private', price: '32,000 ကျပ်' },
    { name: '1 Month Shared Slot', price: '4,500 ကျပ်' },
  ],
  spotify: [
    { name: '1 Month Family Slot', price: '3,000 ကျပ်' },
    { name: '3 Month Family Slot', price: '8,000 ကျပ်' },
    { name: '1 Year Individual', price: '25,000 ကျပ်' },
  ],
  canva: [
    { name: '1 Month Pro', price: '3,500 ကျပ်' },
    { name: '1 Year Pro', price: '9,900 ကျပ်' },
  ],
  chatgpt: [
    { name: '1 Month Plus (Shared)', price: '15,000 ကျပ်' },
    { name: '1 Month Plus (Private)', price: '32,000 ကျပ်' },
  ],
  youtube: [
    { name: '1 Month Premium', price: '5,000 ကျပ်' },
    { name: '1 Year Premium', price: '48,000 ကျပ်' },
  ],
  capcut: [
    { name: '1 Month Pro', price: '4,000 ကျပ်' },
    { name: '1 Year Pro', price: '35,000 ကျပ်' },
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
export default function SocialPremiumPage() {
  const [user] = useState({
    name: 'KP User',
    photo: 'https://ui-avatars.com/api/?name=KP+User',
    id: 'kp1234567890',
  });

  const [selectedService, setSelectedService] = useState<ServiceKey>('netflix');
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(0);
  const [selectedPay, setSelectedPay] = useState<PayKey>('wave');

  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState('');

  const [status, setStatus] = useState<'idle' | 'sending' | 'waiting' | 'delivered' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  const [account, setAccount] = useState<DeliveredAccount | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [copied, setCopied] = useState<'email' | 'password' | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const service = useMemo(() => SERVICES.find((s) => s.key === selectedService)!, [selectedService]);
  const packages = PACKAGES[selectedService];
  const selectedPkg = packages[selectedPkgIndex];

  function handleSelectService(key: ServiceKey) {
    setSelectedService(key);
    setSelectedPkgIndex(0);
  }

  function validate(): string | null {
    if (!phone.trim()) return 'ဆက်သွယ်ရန် ဖုန်းနံပါတ် ဖြည့်ပေးပါ';
    if (refCode.replace(/\D/g, '').length !== 5) return 'ငွေလွှဲပြေစာ နောက်ဆုံး ၅ လုံး မှန်ကန်စွာ ဖြည့်ပေးပါ';
    return null;
  }

  // Order status ကို ၄ စက္ကန့်တစ်ခါ poll လုပ်ပြီး admin က deliver လုပ်လိုက်တာနဲ့
  // account email/password ကို auto ပြပေးမယ်
  function startPolling(id: string) {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/order-status?orderId=${encodeURIComponent(id)}`);
        const data: any = await res.json();
        if (data && data.status === 'delivered' && data.account) {
          setAccount(data.account);
          setStatus('delivered');
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // network hiccup ဖြစ်ရင် ဆက် poll လုပ်နေမယ်, error state မဆွဲပါ
      }
    }, 4000);
  }

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

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
          service: service.key,
          serviceLabel: service.label,
          pkg: selectedPkg,
          phone,
          refCode,
          payMethod: PAY_METHODS.find((p) => p.key === selectedPay)?.label,
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        orderId?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? 'တစ်ခုခု မှားနေပါသည်။ ထပ်စမ်းကြည့်ပါ။');
        return;
      }

      setOrderId(data.orderId ?? null);
      setStatus('waiting');
      if (data.orderId) startPolling(data.orderId);
    } catch {
      setStatus('error');
      setErrorMsg('အင်တာနက် ပြဿနာ ရှိနေပါသည်။ ထပ်စမ်းကြည့်ပါ။');
    }
  }

  async function copyToClipboard(value: string, field: 'email' | 'password') {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard API မရရင် ဘာမှမဖြစ်ပါ
    }
  }

  function resetForm() {
    if (pollRef.current) clearInterval(pollRef.current);
    setStatus('idle');
    setAccount(null);
    setOrderId(null);
    setPhone('');
    setRefCode('');
    setShowPw(false);
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
            <Wallet size={17} /> Premium Service ရွေးပါ
          </h3>

          <div className="tp-service-grid">
            {SERVICES.map((s) => (
              <button
                key={s.key}
                onClick={() => handleSelectService(s.key)}
                className={`tp-service-card${s.key === selectedService ? ' active' : ''}`}
              >
                <div className="tp-service-title">
                  {s.icon}
                  {s.label}
                </div>
                <div className="tp-service-tag">{s.tag}</div>
              </button>
            ))}
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
            <CreditCard size={17} /> {service.label} — Package ရွေးပါ
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

          {status === 'waiting' && (
            <div className="tp-success-box">
              <Loader2 size={18} className="animate-spin" style={{ animation: 'tp-spin 0.7s linear infinite' }} />
              ငွေလွှဲမှု လက်ခံရရှိပါပြီ — Admin စစ်ဆေးနေဆဲပါ (Order: {orderId})
            </div>
          )}

          {status === 'delivered' && account ? (
            <div className="tp-success-box" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} /> ဝယ်ယူမှု အောင်မြင်ပါသည် — Account အချက်အလက်များ
              </div>

              <div className="tp-field" style={{ marginBottom: 0 }}>
                <label className="tp-label">
                  <Mail size={13} /> Email
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input readOnly value={account.email} className="tp-input" />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(account.email, 'email')}
                    className="tp-pay-btn"
                    style={{ flex: '0 0 auto', padding: '0 12px' }}
                  >
                    {copied === 'email' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="tp-field" style={{ marginBottom: 0 }}>
                <label className="tp-label">
                  <KeyRound size={13} /> Password
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input readOnly type={showPw ? 'text' : 'password'} value={account.password} className="tp-input" />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="tp-pay-btn"
                    style={{ flex: '0 0 auto', padding: '0 12px' }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(account.password, 'password')}
                    className="tp-pay-btn"
                    style={{ flex: '0 0 auto', padding: '0 12px' }}
                  >
                    {copied === 'password' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <button type="button" onClick={resetForm} className="tp-submit-btn" style={{ marginTop: 4 }}>
                နောက်ထပ် တစ်ခု ဝယ်မည်
              </button>
            </div>
          ) : (
            status !== 'waiting' && (
              <button onClick={submitOrder} disabled={status === 'sending'} className="tp-submit-btn">
                {status === 'sending' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ animation: 'tp-spin 0.7s linear infinite' }} />{' '}
                    ပို့နေပါသည်...
                  </>
                ) : (
                  'Confirm Top Up'
                )}
              </button>
            )
          )}
        </div>

        {/* History */}
        <button className="tp-history-btn">
          <span className="tp-history-left">
            <History size={17} /> ဝယ်ယူမှတ်တမ်း
          </span>
          <ChevronRight size={17} />
        </button>
      </div>
    </main>
  );
}