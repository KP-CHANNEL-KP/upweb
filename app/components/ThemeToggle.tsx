'use client';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="kp-theme-toggle"
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    >
      <span className="kp-toggle-track">
        <span className="kp-toggle-thumb" />
      </span>
      <span className="kp-toggle-icon">
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}