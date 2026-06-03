import { FaPhone, FaTelegram, FaGift } from 'react-icons/fa';

const products = [
  { id: 1, icon: "🔑", title: "Mytel Bypass CF (၁လ)", desc: "ကချင်ပြည်နယ်တွင်း အမြန်ဆုံး လိုင်းဖြတ်နိုင်သော Config", price: "3,000 ကျပ်" },
  { id: 2, icon: "🌐", title: "Mytel Bypass GCP (၁လ)", desc: "မြန်မာနိုင်ငံ လိုင်းဖြတ်ဒေသတိုင်းနီးပါး အဆင်ပြေ", price: "5,000 ကျပ်" },
  // ကျန်တဲ့ ပစ္စည်းတွေကို ဒီနေရာမှာ ဆက်ထည့်သွားနိုင်ပါတယ်
];

export default function BuyPage() {
  return (
    <main>
      <h1>Premium ဝန်ဆောင်မှုများ</h1>
      <p className="subtitle">အမြန်ဆုံး • အတည်ငြိမ်ဆုံး • ၂၄နာရီ အာမခံချက်နဲ့ ဝယ်ယူလိုက်ပါ</p>

      <div className="products-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <div className="icon-circle">{item.icon}</div>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <div className="price">{item.price}</div>
            <div className="buy-buttons">
              <a href="tel:09769043594" className="btn btn-tel"><FaPhone /> ဖုန်းဆက်</a>
              <a href="https://t.me/kpbykp" className="btn btn-tg"><FaTelegram /> Telegram</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}