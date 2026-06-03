import Link from 'next/link';

export default function PostsPage() {
  const posts = [
    { num: "၀၁", title: "Mytel လိုင်းဖြတ်အကြောင်း (Mytel Bypass CF)", desc: "Mytel လိုင်းဖြတ် Cloudflare (CF) ဟာ လောလောဆယ် ကချင်ပြည်နယ် မှာပဲ သုံးလို့အဆင်ပြေနေပါသေးတယ်။ အခြား ဒေသတွေမှာလည်း စမ်းသပ်နေဆဲ ဖြစ်ပါတယ်။", date: "October 26, 2025" },
    { num: "၀၂", title: "Mytel လိုင်းဖြတ်အကြောင်း (Mytel Bypass GCP)", desc: "Mytel လိုင်းဖြတ် GCP ကတော့ မြန်မာနိုင်ငံရဲ့ လိုင်းဖြတ်ဒေသတိုင်းနီးပါး အဆင်ပြေပါတယ်။ အမြန်ဆုံး နဲ့ တည်ငြိမ်ဆုံး ရွေးချယ်မှုတစ်ခု ဖြစ်ပါတယ်။", date: "October 25, 2025" },
    { num: "၀၃", title: "All Sim All Wifi (Premium Vpn High Speed)", desc: "မိမိသုံးနေတဲ့ Internet လိုင်းနှေးနေတာမျိုးတွေ/Free Vpn တွေသုံးပြီး ကြော်ငြာတွေ ခနခန တက်နေလို့ စိတ်ညစ်နေရင် All Sim All Wifi က အကောင်းဆုံးပါ။", date: "October 20, 2025" },
    { num: "၀၄", title: "Starlink Ruijie အကြောင်း (Old Version)", desc: "Starlink Ruijie Update မတင်ရသေးတဲ့ စက်တွေကို ဆိုလိုပါတယ်။ ဆိုင်မှာ သွားဝယ်စရာမလို၊ ကျော်သုံးလို့ရ၊ လိုင်းကောင်းပါတယ်။", date: "October 15, 2025" },
    { num: "၀၅", title: "Starlink Ruijie အကြောင်း (New Version)", desc: "Update တင်ပြီးသား စက်တွေအတွက် ကျော်သုံးလို့ရပေမဲ့ Old လောက် လိုင်းမကောင်းနိုင်ပါ။ ဒါပေမဲ့ အခြား နည်းလမ်းတွေ ရှိနေပါသေးတယ်။", date: "October 15, 2025" },
    { num: "၀၆", title: "Digital Ocean ကို All Sim All Wifi ထုပ်သုံးနေတုံးပဲလား?", desc: "နောက်ထက် Digital Ocean ကို Starlink (Old/New) အတွက်ပါ သုံးလို့ရပါပြီ။ အမြန်ဆုံး နဲ့ အတည်တကျ အသုံးပြုနိုင်ပါတယ်။", date: "November 14, 2025" },
  ];

  return (
    <main className="posts-main">
      <h1>နောက်ဆုံး ပို့စ်များ</h1>

      <div className="posts-list">
        {posts.map((post, index) => (
          <div key={index} className="post-item">
            <span className="post-number">{post.num}</span>
            <h3><Link href="#">{post.title}</Link></h3>
            <p>{post.desc}</p>
            <span className="post-date">{post.date}</span>
          </div>
        ))}
      </div>
    </main>
  );
}