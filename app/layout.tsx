import { Metadata } from 'next';
// @ts-ignore
import './globals.css';
import Popup from './Popup';
import HeaderAnimation from './HeaderAnimation';
import ClientWrapper from './components/ClientWrapper';
import UserCount from './components/UserCount'; // UserCount component ကို import လုပ်ပါ

export const metadata: Metadata = {
  title: 'KP Channel - Premium VPN Servers & Free Internet',
  description: 'အရည်အသွေးမြင့်မားပြီး မြန်ဆန်သော VPN ဖိုင်များကို ဤနေရာတွင် အခမဲ့ ရယူနိုင်ပါသည်။',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>
        <ClientWrapper>
          <header className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-3">
              <HeaderAnimation />
              <div className="flex items-center justify-between mt-4">
                <nav className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
                  {[
                    { name: 'Home', href: '/' },
                    { name: 'Posts', href: '/posts' },
                    { name: 'Free', href: '/free' },
                    { name: 'VPN', href: '/vpn' },
                    { name: 'Buy', href: '/buy' },
                    { name: 'Top Up', href: '/topup' },
                  ].map((item) => (
                    <a key={item.name} href={item.href} className="hover:text-emerald-400 transition-colors">
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </header>
          
          <Popup />
          <main className="max-w-5xl mx-auto px-4 py-6 min-h-screen">{children}</main>
          
          <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-200 dark:border-white/5">
            {/* ဒီနေရာမှာ User Count ပေါ်လာပါမယ် */}
            <div className="mb-2">
               <UserCount />
            </div>
            © 2026 KP SHOP • အားလုံးကို ချစ်ခင်စွာဖြင့်
          </footer>
        </ClientWrapper>
      </body>
    </html>
  );
}