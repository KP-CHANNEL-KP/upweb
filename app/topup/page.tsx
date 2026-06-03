'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function TopUpPage() {
  const [user, setUser] = useState<any>(null);
  const [banned, setBanned] = useState(false);

  // Google Sign-in Handler
  const handleCredentialResponse = async (response: any) => {
    const base64Url = response.credential.split('.')[1];
    const payload = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
    
    const userData = { name: payload.name, email: payload.email, id: payload.sub, photo: payload.picture };
    
    // Ban Check
    try {
      const res = await fetch(`https://salebotban.kponly.ggff.net/check-ban/${userData.id}`);
      const data = await res.json();
      if (data.banned) {
        setBanned(true);
        return;
      }
      setUser(userData);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    // Google API ကို load လုပ်ပြီးမှ render လုပ်ရန်
    const checkGoogle = setInterval(() => {
      // TypeScript error မတက်စေရန် (window as any) ကိုသုံးပါ
      const win = window as any;
      if (win.google && document.getElementById("googleSignIn")) {
        win.google.accounts.id.initialize({
          client_id: "745888739692-gq8h4f6tjcr35d7ttmce4vg6d03of5tp.apps.googleusercontent.com",
          callback: handleCredentialResponse
        });
        win.google.accounts.id.renderButton(
          document.getElementById("googleSignIn")!, 
          { theme: "outline", size: "large" }
        );
        clearInterval(checkGoogle);
      }
    }, 500);

    return () => clearInterval(checkGoogle);
  }, []);

  if (banned) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-500">
      <h1 className="text-3xl font-bold">အကောင့် Ban လိုက်ပါပီ ဂေါင်းရီး😂</h1>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-5 flex items-center justify-center">
      <Script src="https://accounts.google.com/gsi/client" async defer />

      {!user ? (
        <div className="bg-slate-900/90 p-10 rounded-3xl border border-green-500/30 text-center shadow-2xl w-full max-w-sm">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-6">KP Top Up</h1>
          <div id="googleSignIn" className="flex justify-center"></div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-slate-900 p-8 rounded-3xl border border-green-500/20">
          <header className="flex items-center gap-4 mb-8">
            <img src={user.photo} className="w-16 h-16 rounded-full border-2 border-green-400" alt="Profile" />
            <div>
              <h2 className="text-xl font-bold text-green-400">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </header>
          <p className="text-center text-green-400">အောင်မြင်စွာ Login ဝင်ထားပါသည်။</p>
        </div>
      )}
    </main>
  );
}