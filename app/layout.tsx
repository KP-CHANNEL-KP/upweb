import { Metadata } from 'next';
import Script from 'next/script';
// @ts-ignore
import './globals.css';
import Popup from './Popup';
import HeaderAnimation from './HeaderAnimation';
import ClientWrapper from './components/ClientWrapper';
import UserCount from './components/UserCount';
import NotificationWrapper from './components/NotificationWrapper';
import InstallButton from './components/InstallButton';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';
import { LanguageProvider } from './components/LanguageProvider';
import LanguageToggle from './components/LanguageToggle';
import NavLinks from './components/NavLinks';
import FooterText from './components/FooterText';

export const metadata: Metadata = {
  title: 'KP Channel - Premium VPN Servers & Free Internet',
  manifest: '/manifest.json',
  description: 'အရည်အသွေးမြင့်မားပြီး မြန်ဆန်သော VPN ဖိုင်များကို ဤနေရာတွင် အခမဲ့ ရယူနိုင်ပါသည်။',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <LanguageProvider>
          <ThemeProvider>
            <ClientWrapper>
              <NotificationWrapper>
                <header className="kp-header">
                  <div className="kp-header-inner">
                    <HeaderAnimation />
                    <nav className="kp-nav">
                      <NavLinks />
                      {/* ── Language Toggle ── */}
                      <LanguageToggle />
                      {/* ── Theme Toggle ── */}
                      <ThemeToggle />
                    </nav>
                  </div>
                </header>
              </NotificationWrapper>

              <Popup />
              <main className="kp-page-main">{children}</main>
              <InstallButton />

              <footer className="kp-footer">
                <div className="kp-footer-usercount">
                  <UserCount />
                </div>
                © 2026 KP VPN WEB • <FooterText />
              </footer>
            </ClientWrapper>
          </ThemeProvider>
        </LanguageProvider>

        <Script id="tawk-script" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6a39c17c37084e1d491cf318/1jropnl8t';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}