'use client';
import { useEffect, useRef } from 'react';

export default function Banner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    
    // အကယ်၍ Banner က အရင်ကတည်းက ရှိနေရင် ထပ်မထည့်တော့ဘူး
    if (banner && banner.innerHTML === "") {
      
      // 1. atOptions သတ်မှတ်ချက်
      const atOptions = document.createElement('script');
      atOptions.type = 'text/javascript';
      atOptions.text = `
        atOptions = {
          'key' : 'd7a5139552ef3d6a25a55cb7a8e25979',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
      
      // 2. Invoke Script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = "https://www.highperformanceformat.com/d7a5139552ef3d6a25a55cb7a8e25979/invoke.js";
      invokeScript.async = true;

      // 3. Append to div
      banner.appendChild(atOptions);
      banner.appendChild(invokeScript);
    }
  }, []);

  return (
    <div 
      ref={bannerRef} 
      style={{ 
        margin: '20px auto', 
        display: 'flex', 
        justifyContent: 'center', 
        minHeight: '50px' // Banner အမြင့်အတွက် နေရာချန်ထားပေးပါ
      }} 
    />
  );
}