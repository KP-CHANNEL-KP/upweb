'use client';
import { useState, useEffect } from 'react';

export default function FreePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [keys, setKeys] = useState<{ name: string; key: string }[]>([]);
  const [newInput, setNewInput] = useState({ name: '', key: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Key များ ဆွဲယူခြင်း
  useEffect(() => {
    fetch('/api/keys')
      .then(res => res.json())
      .then(data => setKeys(data))
      .catch(err => console.error("Error loading keys:", err));
  }, []);

  // Filter လုပ်ခြင်း
  const filteredKeys = keys.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddKey = async () => {
    if (!newInput.name || !newInput.key) return alert('အချက်အလက် ပြည့်စုံအောင်ဖြည့်ပါ');
    
    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newInput, password })
    });

    if (res.ok) {
      alert('✅ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ');
      setKeys([...keys, newInput]);
      setNewInput({ name: '', key: '' });
    } else {
      alert('❌ Password မှားနေသည် (သို့) အမှားတစ်ခုခုဖြစ်နေသည်');
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">🔑 Free VPN Keys</h1>
        
        {/* Search Bar */}
        <input 
          type="text" 
          placeholder="🔎 VPN နာမည် ရှာရန်..." 
          className="w-full p-3 bg-slate-800 rounded-lg mb-6 border border-slate-600 text-white"
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <tbody>
              {filteredKeys.map((item, index) => (
                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-green-400">{item.name}</td>
                  <td className="p-3 font-mono text-sm">{item.key.slice(0, 20)}...</td>
                  <td className="p-3">
                    <button onClick={() => navigator.clipboard.writeText(item.key)} className="bg-blue-600 px-3 py-1 rounded text-sm text-white">Copy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Admin Login */}
        {!isAdmin ? (
          <div className="mt-8 pt-6 border-t border-slate-700 flex gap-2">
            <input type="password" placeholder="Admin Password" className="bg-slate-800 p-2 rounded flex-1" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => password === "232003" && setIsAdmin(true)} className="bg-green-600 text-white px-6 py-2 rounded">Login</button>
          </div>
        ) : (
          <div className="mt-8 bg-slate-800 p-6 rounded-xl border border-green-500/30">
            <h3 className="text-white mb-4">Add New Key</h3>
            <div className="flex flex-col gap-3">
              <input placeholder="Name" className="p-2 rounded bg-slate-900" onChange={(e) => setNewInput({...newInput, name: e.target.value})} />
              <input placeholder="Key" className="p-2 rounded bg-slate-900" onChange={(e) => setNewInput({...newInput, key: e.target.value})} />
              <button onClick={handleAddKey} className="bg-green-600 py-2 rounded font-bold">Save to KV</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}