'use client';

import { useLanguage } from './LanguageProvider';

const navItems = [
  { my: 'ပင်မ', en: 'Home', href: '/' },
  { my: 'Outline Keys', en: 'Outline Keys', href: '/outline' },
  { my: 'Starlink', en: 'Starlink', href: '/starlink' },
  { my: 'V2ray ဆာဗာများ', en: 'V2ray Keys', href: '/v2ray' },
  { my: 'ထိုင်း ဆာဗာများ', en: 'Thai Servers', href: '/thai' },
  { my: 'အခမဲ့ ဆာဗာများ', en: 'Free Servers', href: '/free_servers' },
  { my: 'VPN Files', en: 'VPN Files', href: '/vpn' },
  { my: 'ဝယ်ယူရန်', en: 'Buy', href: '/buy' },
  { my: 'News', en: 'News', href: '/news' },
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