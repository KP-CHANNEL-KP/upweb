import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="my">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>
        <header>
          <div className="header-content">
            <div className="logo-and-title">
              <img src="/images/logo.png" alt="KP Logo" style={{ height: '55px', borderRadius: '15px', border: '2px solid #00ff9d' }} />
              <h1 className="site-title">KP Blog</h1>
            </div>
            <nav>
              <a href="/">Home</a>
              <a href="/posts">Posts</a>
              <a href="/free">Free</a>
              <a href="/buy">Buy</a>
              <a href="/all">All</a>
              <a href="/chat">Chat Group</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer>© 2025 KP Blog • အားလုံးကို ချစ်ခင်စွာဖြင့်</footer>
      </body>
    </html>
  );
}