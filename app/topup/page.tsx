'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function TopUpPage() {
  const [user, setUser] = useState<any>(null);
  const [isBanned, setIsBanned] = useState(false);
  const [selectedGame, setSelectedGame] = useState('pubg');
  const [loading, setLoading] = useState(false);

  const GOOGLE_CLIENT_ID = "745888739692-gq8h4f6tjcr35d7ttmce4vg6d03of5tp.apps.googleusercontent.com";

  const handleCredentialResponse = async (response: any) => {
    const base64Url = response.credential.split('.')[1];
    const payload = JSON.parse(atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
    
    const userData = { name: payload.name, email: payload.email, id: payload.sub, photo: payload.picture };
    
    // Ban Check
    try {
      const res = await fetch(`https://salebotban.kponly.ggff.net/check-ban/${userData.id}`);
      const data = await res.json();
      if (data.banned) {
        setIsBanned(true);
        return;
      }
    } catch (e) { console.error(e); }

    setUser(userData);
  };

  if (isBanned) return <div className="text-center mt-20 text-red-500"><h1>အကောင့် Ban လိုက်ပါပီ ဂေါင်းရီး😂</h1></div>;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-5">
      <Script src="https://accounts.google.com/gsi/client" async defer />
      
      {!user ? (
        <div className="max-w-md mx-auto mt-20 p-8 bg-gray-900 rounded-2xl border border-green-500/30 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-5">KP Top Up</h1>
          <div id="googleSignIn" className="flex justify-center my-8">
            <Script id="google-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
              __html: `
                setTimeout(() => {
                  google.accounts.id.initialize({ client_id: "${GOOGLE_CLIENT_ID}", callback: handleCredentialResponse });
                  google.accounts.id.renderButton(document.getElementById("googleSignIn"), { theme: "outline", size: "large" });
                }, 500);
              `
            }} />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-3xl border border-green-500/20">
          {/* Header & Content */}
          <header className="flex items-center gap-4 mb-8 p-4 bg-gray-800 rounded-xl">
             <img src={user.photo} className="w-16 h-16 rounded-full border-2 border-green-400" />
             <div>
               <h2 className="text-xl font-bold text-green-400">{user.name}</h2>
               <p className="text-gray-400">{user.email}</p>
             </div>
          </header>
          {/* Add your form inputs and game selection here */}
        </div>
      )}
    </main>
  );
}