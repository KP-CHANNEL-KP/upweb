'use client';

import { useLanguage } from './LanguageProvider';

const navItems = [
  { my: 'ပင်မ', en: 'Home', href: '/' },
  { my: 'Outline Keys', en: 'Outline Keys', href: '/outline' },
  { my: 'Starlink', en: 'Starlink', href: '/starlink' },
  { my: 'V2ray Keys', en: 'V2ray Keys', href: '/v2ray' },
  { my: 'Thai Servers', en: 'Thai Servers', href: '/thai' },
  { my: 'VPN Files', en: 'VPN Files', href: '/vpn' },
  { my: 'ဝယ်ယူရန်', en: 'Buy', href: '/buy' },
  { my: 'ကျွန်ုပ်၏အကောင့်', en: 'My Account', href: '/topup' },
];

export default function NavLinks() {
  const { lang } = useLanguage();

  return (
    <>
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className="kp-nav-link">
          {lang === 'my' ? item.my : item.en}
        </a>
      ))}
    </>
  );
}