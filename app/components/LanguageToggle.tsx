'use client';
import { useLanguage } from './LanguageProvider';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  const isMyanmar = lang === 'my';

  return (
    <button
      onClick={toggleLang}
      className="kp-lang-toggle"
      aria-label="Switch language"
      title={isMyanmar ? 'Switch to English' : 'မြန်မာဘာသာသို့ ပြောင်းရန်'}
    >
      <img
        src={isMyanmar ? 'https://flagcdn.com/gb.svg' : 'https://flagcdn.com/mm.svg'}
        alt={isMyanmar ? 'UK flag' : 'Myanmar flag'}
        className="kp-lang-flag"
        width={20}
        height={14}
        loading="lazy"
      />
      <span className="kp-lang-code">{isMyanmar ? 'EN' : 'MY'}</span>
    </button>
  );
}