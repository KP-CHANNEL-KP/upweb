'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function TopUpPage() {
  const [user, setUser] = useState<any>(null);
  const [packages, setPackages] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState('pubg');
  const [orderData, setOrderData] = useState({ userId: '', playerName: '', phone: '', ref: '' });

  // Load Google SDK Logic
  const handleCredentialResponse = (r: any) => {
    const p = JSON.parse(atob(r.credential.split('.')[1]));
    setUser({ name: p.name, email: p.email, id: p.sub, photo: p.picture });
  };

  useEffect(() => {
    // Initial Setup Data
    setPackages({
      pubg: [{ name: "💸60 UC", price: "3800 ကျပ်" }, { name: "💸325 UC", price: "18000 ကျပ်" }],
      ml: [{ name: "💎86 Diamonds", price: "4900 ကျပ်" }]
    });
  }, []);

  if (!user) {
    return (
      <div className="login-box">
        <h1>KP Top Up</h1>
        <p>Google ဖြင့် Login ဝင်ပေးပါ ခမျ။</p>
        <div id="googleSignIn"></div>
        <Script src="https://accounts.google.com/gsi/client" onLoad={() => {
            (window as any).google.accounts.id.initialize({
              client_id: "745888739692-gq8h4f6tjcr35d7ttmce4vg6d03of5tp.apps.googleusercontent.com",
              callback: handleCredentialResponse
            });
            (window as any).google.accounts.id.renderButton(document.getElementById("googleSignIn"), { theme: "outline", size: "large" });
        }} />
      </div>
    );
  }

  return (
    <main className="topup-container">
      <header className="topup-header">
        <img src={user.photo} alt="Profile" className="profile-img" />
        <div>
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </header>

      <div className="glass-card">
        <label>ဂိမ်း / Service ရွေးပါ</label>
        <div className="game-list">
          {['pubg', 'ml', 'fb'].map(game => (
            <div key={game} className={`game-card ${selectedGame === game ? 'active' : ''}`} onClick={() => setSelectedGame(game)}>
              <span className="game-card-title">{game.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <input placeholder="User ID" className="input-field" onChange={e => setOrderData({...orderData, userId: e.target.value})} />
        <input placeholder="Link" className="input-field" onChange={e => setOrderData({...orderData, playerName: e.target.value})} />
        
        <button className="submit-btn" onClick={() => alert('မှာယူမှု ပေးပို့လိုက်ပါပြီ!')}>မှာယူမည်</button>
      </div>
    </main>
  );
}