import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Invalidate stale Supabase session after version bump
try {
  const storedVersion = localStorage.getItem('app_version');
  const currentVersion = (globalThis as any).__APP_VERSION__ || '0.0.0';
  if (storedVersion && storedVersion !== currentVersion) {
    // Clear only auth/session related keys to avoid full cache clear
    Object.keys(localStorage)
      .filter(k => k.startsWith('sb-') || k.includes('supabase'))
      .forEach(k => localStorage.removeItem(k));
  }
  localStorage.setItem('app_version', currentVersion);
} catch {}

createRoot(document.getElementById("root")!).render(<App />);
