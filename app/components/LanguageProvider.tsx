'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Lang = 'my' | 'en';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (my: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('my');

  useEffect(() => {
    const saved = localStorage.getItem('kp-lang') as Lang | null;
    if (saved === 'my' || saved === 'en') setLang(saved);
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'my' ? 'en' : 'my';
      localStorage.setItem('kp-lang', next);
      return next;
    });
  };

  // helper: t('မြန်မာစာ', 'English text') → lang အလိုက် ပြန်ပေးမယ်
  const t = (my: string, en: string) => (lang === 'my' ? my : en);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}