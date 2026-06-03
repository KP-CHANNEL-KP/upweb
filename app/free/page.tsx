'use client';
import { useState, useEffect } from 'react';

export default function FreePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [keys, setKeys] = useState<{ id: string, name: string, key: string }[]>([]);
  const [newInput, setNewInput] = useState({ name: '', key: '' });

  // Mock data fetching (အမှန်တကယ်တွင် API မှ ဆွဲယူပါ)
  useEffect(() => {
    // fetch('/api/keys').then(...)
    setKeys([{ id: '1', name: 'VPN Pro - 01', key: 'vless://example123...' }]);
  }, []);

  const handleAddKey = () => {
    if (!newInput.name || !newInput.key) return alert('အချက်အလက် ပြည့်စုံအောင်ဖြည့်ပါ');
    setKeys([...keys, { id: Date.now().toString(), ...newInput }]);
    setNewInput({ name: '', key: '' });
  };

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 border-b border-slate-700 pb-4">🔑 Free VPN Keys</h1>
        
        {/* Key List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3">Name</th>
                <th className="p-3">Key</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-green-400">{item.name}</td>
                  <td className="p-3 font-mono text-sm truncate max-w-[200px]">{item.key}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => navigator.clipboard.writeText(item.key)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm"
                    >Copy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Admin Section */}
        {!isAdmin ? (
          <div className="mt-8 pt-6 border-t border-slate-700 flex gap-2">
            <input type="password" placeholder="Admin Password" className="bg-slate-800 p-2 rounded-lg flex-1 border border-slate-600" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => password === "232003" && setIsAdmin(true)} className="bg-green-600 text-white px-6 py-2 rounded-lg">Login</button>
          </div>
        ) : (
          <div className="mt-8 bg-slate-800 p-6 rounded-xl border border-green-500/30">
            <h3 className="text-xl mb-4 text-white">Add New Key</h3>
            <div className="flex flex-col gap-3">
              <input placeholder="Name (e.g. VPN 01)" className="p-3 rounded-lg bg-slate-900" onChange={(e) => setNewInput({...newInput, name: e.target.value})} />
              <input placeholder="Key (vless://...)" className="p-3 rounded-lg bg-slate-900" onChange={(e) => setNewInput({...newInput, key: e.target.value})} />
              <button onClick={handleAddKey} className="bg-green-600 py-3 rounded-lg font-bold">Save Key</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}