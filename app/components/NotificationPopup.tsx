export default function NotificationPopup({ isOpen, onClose, keys }: { 
  isOpen: boolean; 
  onClose: () => void; 
  keys: any[]; 
}) {
  if (!isOpen) return null;

  return (
    // အပြင်ဘက်ကို နှိပ်ရင် ပိတ်သွားအောင် onClick={onClose} ထည့်ပေးလိုက်တယ်
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      {/* အတွင်းဘက်ကို နှိပ်ရင် မပိတ်သွားအောင် e.stopPropagation() ထည့်မယ် */}
      <div 
        className="bg-[#0f172a] p-6 rounded-2xl w-full max-w-sm border border-emerald-500/50 shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-emerald-400">🔔 ဝယ်ယူထားသော Key များ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {keys.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">Key အသစ်မရှိသေးပါ</p>
          ) : (
            keys.map((k, i) => (
              <div key={i} className="bg-black/40 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 mb-1">{k.plan || 'Premium Plan'}</p>
                <code className="text-emerald-300 font-mono text-sm break-all">{k.key}</code>
              </div>
            ))
          )}
        </div>
        
        <button 
          onClick={onClose} 
          className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all"
        >
          ပိတ်မည်
        </button>
      </div>
    </div>
  );
}