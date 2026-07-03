'use client';

import { useLanguage } from './LanguageProvider';

export default function FooterText() {
  const { t } = useLanguage();
  return <>{t('အားလုံးကို ချစ်ခင်စွာဖြင့်', 'Made with love for everyone')}</>;
}