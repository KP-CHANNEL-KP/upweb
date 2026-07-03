'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { NOTIFICATION } from '../lib/notification';

export default function NotiPopup() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!NOTIFICATION.enabled) return;
    try {
      const seenKey = `kp_noti_seen_${NOTIFICATION.id}`;
      const seen = localStorage.getItem(seenKey);
      if (!seen) setVisible(true);
    } catch {
      // localStorage unavailable (private mode etc.) — just skip silently
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(`kp_noti_seen_${NOTIFICATION.id}`, '1');
    } catch {}
    setVisible(false);
  };

  if (!visible || !NOTIFICATION.enabled) return null;

  const title = lang === 'my' ? NOTIFICATION.title.my : NOTIFICATION.title.en;
  const message = lang === 'my' ? NOTIFICATION.message.my : NOTIFICATION.message.en;

  return (
    <div className="kp-noti-overlay" onClick={dismiss}>
      <div className="kp-noti-popup" onClick={(e) => e.stopPropagation()}>
        <button className="kp-noti-close" onClick={dismiss} aria-label="Close">
          ✕
        </button>
        <h3 className="kp-noti-title">{title}</h3>
        <p className="kp-noti-message">{message}</p>
        <button className="kp-noti-ok" onClick={dismiss}>
          OK
        </button>
      </div>
    </div>
  );
}