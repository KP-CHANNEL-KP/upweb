'use client';

import { useState, useEffect } from 'react';

export default function FreePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [mainText, setMainText] = useState('ဒေတာများကို စတင်ဆွဲယူနေပါသည်။');
  const [newInput, setNewInput] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    fetch('/api/text')
      .then(res => res.text())
      .then(data => setMainText(data))
      .catch(() => setMainText('Data load မလုပ်နိုင်ပါ။ Backend/KV ချိတ်ဆက်မှု စစ်ဆေးပါ။'));
  }, []);

  const checkPassword = () => {
    if (password === "232003") {
      setIsAdmin(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleSave = async () => {
    if (!newInput.trim()) return alert('စာအသစ်ရိုက်ထည့်ရန် လိုအပ်ပါသည်။');
    
    setSaveLoading(true);
    const timestamp = new Date().toLocaleString('my-MM');
    const newEntry = `[${timestamp}]\n\n${newInput.trim()}`;
    const updated = mainText === 'ဒေတာများကို စတင်ဆွဲယူနေပါသည်။' ? newEntry : `${newEntry}\n\n============================\n\n${mainText}`;

    try {
      const res = await fetch('/api/text', {
        method: 'POST',
        body: updated,
        headers: { 'Content-Type': 'text/plain' }
      });
      if (res.ok) {
        setMainText(updated);
        setNewInput('');
        alert('✅ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ!');
      }
    } catch {
      alert('❌ သိမ်းဆည်းမှု မအောင်မြင်ပါ။');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <main className="free-main">
      <div className="glass-card">
        <h1>KP WEBSITE • FREE PAGE</h1>

        <textarea value={mainText} readOnly className="main-textarea" />

        {!isAdmin ? (
          <div className="glass-card">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin Password" className="admin-input" />
            <button onClick={checkPassword} className="btn">စာတင်ခွင့် ရယူမည်</button>
            {error && <p className="error-msg">Password မှားနေပါသည်။</p>}
          </div>
        ) : (
          <div className="admin-panel">
            <input type="text" value={newInput} onChange={(e) => setNewInput(e.target.value)} placeholder="စာအသစ်ရိုက်ထည့်ပါ..." className="admin-input" />
            <button onClick={() => navigator.clipboard.writeText(mainText).then(() => alert('ကူးယူပြီးပါပြီ'))} className="btn">ကူးယူမည်</button>
            <button onClick={handleSave} className="btn" disabled={saveLoading}>{saveLoading ? 'သိမ်းဆည်းနေပါသည်...' : 'Save လုပ်မည်'}</button>
          </div>
        )}
      </div>

      <div className="glass-card">
        <h2>ဖိုင်တင်ရန် နေရာ</h2>
        <button className="btn" onClick={() => alert('R2 ကို Setup လုပ်ပြီးမှ အသုံးပြုနိုင်ပါမည်။')}>Upload</button>
      </div>
    </main>
  );
}