'use client';
import { useState } from 'react';
import { Bell } from 'lucide-react';

// Local fallback NotificationPopup to avoid missing-module errors.
function NotificationPopup({
  isOpen,
  onClose,
  keys,
}: {
  isOpen: boolean;
  onClose: () => void;
  keys: any[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4">
      <div className="bg-slate-900 text-white rounded-md shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between p-3 border-b border-slate-700">
          <span className="font-semibold">Notifications</span>
          <button onClick={onClose} className="text-sm text-gray-300">Close</button>
        </div>
        <div className="p-3">
          {keys.length === 0 ? (
            <div className="text-sm text-gray-400">No notifications</div>
          ) : (
            keys.map((k, i) => (
              <div key={i} className="text-sm text-gray-200 py-1 border-b border-slate-800">{String(k)}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationWrapper({ children }: { children: React.ReactNode }) {
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [myKeys, setMyKeys] = useState<any[]>([]);

  return (
    <>
      <div onClick={() => setIsNotiOpen(true)} className="absolute top-4 right-4 md:right-8 cursor-pointer group z-[60]">
         <div className="relative">
            <Bell className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900"></span>
         </div>
      </div>

      <NotificationPopup isOpen={isNotiOpen} onClose={() => setIsNotiOpen(false)} keys={myKeys} />
      {children}
    </>
  );
}