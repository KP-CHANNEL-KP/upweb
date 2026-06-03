export default function Home() {
  return (
    <>
      <section className="hero-section">
        <i className="fas fa-microchip hero-icon"></i>
        <h2>KP WEBSITE တွင် Vpn နှင့်ပတ်သက်သော ပစ္စည်းများနှင့် တခြား အရာများ ရောင်းသည်။</h2>
        <h1>KP နှင့်အတူ သာယာသော နေ့များဆီ သို့</h1>
        <p style={{fontSize:'1.3em', maxWidth:'800px', margin:'20px auto'}}>
            KP ၏ Website သည် သုံးဆွဲသူများ လွယ်ကူစေရန် နှင့်<br />
            Free ရနိုင်သော အရာများကို ADMIN များ နေ့စဉ် တင်ဆက်နေပါသည်။
        </p>
        <a href="/free" className="cta-button">
            FREE သုံးစရာများ ကြည့်ရန် <i className="fas fa-arrow-right"></i>
        </a>
      </section>

      <h2 className="section-title">ငွေလွှဲရန် Payment များ</h2>
      <div className="featured-grid">
        <div className="post-card">
            <div className="card-tag">Wave Pay</div>
            <h3>Wave Pay - 09966955081</h3>
            <p>ငွေလွှဲရန် Wave Pay နံပါတ်ကို ယခုနံပါတ်သာ သုံးပါသည်။</p>
        </div>
        <div className="post-card">
            <div className="card-tag">KPay</div>
            <h3>KPay - 09966955081</h3>
            <p>ငွေလွှဲရန် KPay နံပါတ်ကို ယခုနံပါတ်သာ သုံးပါသည်။</p>
        </div>
      </div>

      <h2 className="section-title">အမြန်သွားရန်</h2>
      <div className="latest-grid">
        <div className="post-summary-pro"><h3>Facebook</h3><a href="https://www.facebook.com/share/1CmNvtjsp8/" className="read-more">သွားရန်</a></div>
        <div className="post-summary-pro"><h3>YouTube</h3><a href="https://youtube.com/@kpchannel22" className="read-more">သွားရန်</a></div>
        <div className="post-summary-pro"><h3>Telegram</h3><a href="https://t.me/KP_CHANNEL_KP" className="read-more">သွားရန်</a></div>
        <div className="post-summary-pro"><h3>TikTok</h3><a href="https://tiktok.com/@kpbykp23" className="read-more">သွားရန်</a></div>
      </div>

      <section className="cta-section">
        <h3>ကျွန်ုပ်တို့၏ Community ထဲသို့ ပါဝင်ဆွေးနွေးလိုပါသလား?</h3>
        <p>နေ့စဉ် အကြောင်းအရာများ၊ အခက်အခဲများနှင့် စိတ်ကူးများကို မျှဝေလိုက်ပါ။</p>
        <a href="/chat" className="cta-chat-button">Chat Group ထဲ ဝင်မယ်</a>
      </section>
    </>
  );
}
