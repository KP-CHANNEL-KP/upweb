'use client';
import { useState } from 'react';
import { Bell } from 'lucide-react';
// Inline Notification component to avoid missing module error.
// You can move this to a separate file (Notification.tsx) if desired.
type NotificationProps = {
  isOpen: boolean;
  onClose: () => void;
  keys: any[];
};

function Notification({ isOpen, onClose, keys }: NotificationProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed top-14 right-4 z-50 w-80 bg-slate-800 text-white rounded shadow-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Notifications</span>
        <button onClick={onClose} className="text-sm text-gray-300">Close</button>
      </div>
      <div className="max-h-48 overflow-auto">
        {keys.length === 0 ? (
          <div className="text-sm text-gray-300">No notifications</div>
        ) : (
          keys.map((k, i) => (
            <div key={i} className="py-2 border-b border-slate-700 text-sm">{String(k)}</div>
          ))
        )}
      </div>
    </div>
  );
}

export default function NotificationWrapper({ children }: { children: React.ReactNode }) {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [myKeys, setMyKeys] = useState<any[]>([]);

  return (
    <>
      {/* Bell Icon */}
      <div 
        onClick={() => setIsNotiOpen(true)} 
        className="absolute top-4 right-4 md:right-8 cursor-pointer group z-[60] p-2 hover:bg-white/10 rounded-full transition-all"
      >
         <div className="relative">
            <Bell className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors" />
            {/* key ရှိမှသာ notification dot လေးပြစေချင်ရင် keys.length > 0 ဆိုပြီး condition ထည့်လို့ရပါတယ် */}
            {myKeys.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900"></span>
            )}
         </div>
      </div>

      <Notification isOpen={isNotiOpen} onClose={() => setIsNotiOpen(false)} keys={myKeys} />
      {children}
    </>
  );
}