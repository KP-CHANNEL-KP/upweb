// ─────────────────────────────────────────────────────────
// Notification Popup Config
// ဒီဖိုင်ကို ပြင်ပြီး push/deploy လုပ်လိုက်ရုံနဲ့ website ပေါ်က
// notification popup ပြောင်းသွားပါလိမ့်မယ်.
//
// ⚠️ IMPORTANT: message အသစ်တင်တိုင်း `id` ကို ပြောင်းပါ
// (ဥပမာ 'noti-002', 'noti-003'...) — id မပြောင်းရင်
// အရင်က တစ်ခါပြီးသွားပြီးသား visitor တွေအတွက် ထပ်ပေါ်မှာ
// မဟုတ်ပါဘူး (localStorage က "ဒါဟာ ကြည့်ပြီးသား" လို့ မှတ်ထားလို့ပါ).
// ─────────────────────────────────────────────────────────

export const NOTIFICATION = {
  enabled: true,
  id: 'noti-001',

  title: {
    my: '📢 အသိပေးချက်',
    en: '📢 Notice',
  },

  message: {
    my: 'ဒီနေရာမှာ notification စာသားကို ရေးပါ။',
    en: 'Write your notification message here.',
  },
};