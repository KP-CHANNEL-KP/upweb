'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageProvider';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

function formatDate(iso: string, lang: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'my' ? 'en-GB' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function NewsPage() {
  const { t, lang } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json() as Promise<NewsItem[]>)
      .then((data) => setNews(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="fp-main">
      <div className="fp-grid-bg" />
      <div className="fp-glow" />

      <div className="fp-container">
        <div className="fp-header">
          <span className="fp-badge">
            <span className="fp-badge-dot" />
            {t('သတင်းများ', 'News')}
          </span>
          <h1 className="fp-title">
            {t('KP VPN WEB', 'KP VPN WEB')}<br />
            <span className="fp-title-gradient">{t('သတင်းနှင့် အပ်ဒိတ်များ', 'News & Updates')}</span>
          </h1>
        </div>

        {loading ? (
          <div className="fp-loading">
            <div className="fp-loading-dots">
              <span /><span /><span />
            </div>
            <p>{t('သတင်းများ ရယူနေသည်...', 'Loading news...')}</p>
          </div>
        ) : error ? (
          <div className="fp-error">
            <span>⚠️</span> {t('သတင်းများ ရယူ၍ မရပါ', 'Failed to load news')}
          </div>
        ) : news.length === 0 ? (
          <p className="fp-count">{t('သတင်း မရှိသေးပါ', 'No news yet')}</p>
        ) : (
          <div className="kp-news-list">
            {news.map((item) => (
              <article key={item.id} className="kp-news-card">
                <p className="kp-news-date">{formatDate(item.date, lang)}</p>
                <h2 className="kp-news-title">{item.title}</h2>
                <p className="kp-news-content">{item.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}