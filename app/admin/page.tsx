'use client';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

const SESSION_KEY = 'kp_admin_pw';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  // Try to restore a session from this browser tab only
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setPassword(saved);
      verifyPassword(saved, true);
    }
  }, []);

  const verifyPassword = async (pw: string, silent = false) => {
    setChecking(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, pw);
        setAuthed(true);
        loadNews(pw);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        if (!silent) setLoginError('Password မှားနေပါသည် (Incorrect password)');
      }
    } catch {
      if (!silent) setLoginError('Connection error');
    } finally {
      setChecking(false);
    }
  };

  const loadNews = async (pw: string) => {
    setNewsLoading(true);
    try {
      const res = await fetch('/api/news');
      setNews(await res.json());
    } finally {
      setNewsLoading(false);
    }
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title နှင့် Content ဖြည့်ပေးပါ');
      return;
    }
    setPosting(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error();
      toast.success('News တင်ပြီးပါပြီ!', {
        style: { background: '#7C3AED', color: '#fff', borderRadius: '10px' },
      });
      setTitle('');
      setContent('');
      loadNews(password);
    } catch {
      toast.error('Post လုပ်၍ မရပါ');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success('ဖျက်ပြီးပါပြီ');
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error('ဖျက်၍ မရပါ');
    }
  };

  if (!authed) {
    return (
      <main className="fp-main">
        <Toaster position="top-center" />
        <div className="fp-grid-bg" />
        <div className="fp-glow" />
        <div className="fp-container">
          <div className="fp-gate-card">
            <div className="fp-gate-icon">🔐</div>
            <h2 className="fp-gate-title">Admin Login</h2>
            <p className="fp-gate-desc">News စီမံရန် Admin Password ထည့်ပါ</p>
            <input
              type="password"
              className="fp-input"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyPassword(password)}
            />
            <button
              onClick={() => verifyPassword(password)}
              disabled={checking || !password}
              className="fp-btn-primary"
            >
              {checking ? <span className="fp-spinner" /> : '✓ Login'}
            </button>
            {loginError && (
              <div className="fp-error"><span>⚠️</span> {loginError}</div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fp-main">
      <Toaster position="top-center" />
      <div className="fp-grid-bg" />
      <div className="fp-glow" />
      <div className="fp-container">
        <div className="fp-header">
          <span className="fp-badge">
            <span className="fp-badge-dot" />
            Admin Panel
          </span>
          <h1 className="fp-title">News စီမံရန်</h1>
        </div>

        <div className="kp-admin-form">
          <input
            className="fp-input"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="fp-input kp-admin-textarea"
            placeholder="Content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <button onClick={handlePost} disabled={posting} className="fp-btn-primary">
            {posting ? <span className="fp-spinner" /> : '📝 Post News'}
          </button>
        </div>

        <h2 className="fp-section-title" style={{ marginTop: '32px' }}>
          Existing News ({news.length})
        </h2>

        {newsLoading ? (
          <div className="fp-loading">
            <div className="fp-loading-dots"><span /><span /><span /></div>
          </div>
        ) : (
          <div className="kp-news-list">
            {news.map((item) => (
              <article key={item.id} className="kp-news-card">
                <p className="kp-news-date">{new Date(item.date).toLocaleString()}</p>
                <h2 className="kp-news-title">{item.title}</h2>
                <p className="kp-news-content">{item.content}</p>
                <button className="fp-copy-btn-dead" onClick={() => handleDelete(item.id)}>
                  🗑️ Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}