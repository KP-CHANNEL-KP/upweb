'use client';
import { useState } from 'react';

export default function VPNItem({ name, speed, url, keyText }: { name: string, speed: string, url: string, keyText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(keyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '10px', border: '1px solid #333', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ display: 'block', color: 'white' }}>{name}</strong>
          <small style={{ color: '#888' }}>{speed}</small>
        </div>
        <button 
          onClick={handleCopy}
          style={{ background: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {copied ? 'Copied!' : 'Copy Key'}
        </button>
      </div>
      
      {/* ဒီနေရာမှာ Download ခလုတ်နဲ့ အဲ့ဒီအောက်မှာ ကြော်ငြာထားရင် ကောင်းပါတယ် */}
      <a href={url} download style={{ display: 'block', background: '#00ff9d', color: 'black', textAlign: 'center', padding: '10px', marginTop: '10px', borderRadius: '5px', fontWeight: 'bold', textDecoration: 'none' }}>
        Download File
      </a>
    </div>
  );
}