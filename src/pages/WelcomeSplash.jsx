import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Moon, Sun } from 'lucide-react';
import { getTheme, setTheme } from '../utils/theme';

const AUTO_CONTINUE_MS = 4000;

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

const hasSession = () => {
  try {
    return Boolean(
      localStorage.getItem('access_token') || localStorage.getItem('token')
    );
  } catch {
    return false;
  }
};

export default function WelcomeSplash() {
  const navigate = useNavigate();
  const [theme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    const syncTheme = () => setCurrentTheme(getTheme());

    syncTheme();
    window.addEventListener('theme_change', syncTheme);
    return () => window.removeEventListener('theme_change', syncTheme);
  }, []);

  const firstName = useMemo(() => {
    const email = readUser()?.email || '';
    const rawName = email.split('@')[0] || '';
    const cleanName = rawName.replace(/[^a-zA-Z]/g, ' ').trim().split(' ')[0];

    return cleanName
      ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
      : '';
  }, []);

  useEffect(() => {
    if (!hasSession()) {
      navigate('/register', { replace: true });
      return undefined;
    }

    const timer = window.setTimeout(() => {
      navigate('/onboarding/splash', { replace: true });
    }, AUTO_CONTINUE_MS);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setCurrentTheme(nextTheme);
  };

  const continueToOnboarding = () => {
    navigate('/onboarding/splash', { replace: true });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#070a12] dark:text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-12%] h-[430px] w-[620px] -translate-x-1/2 rounded-full bg-blue-300/35 blur-[130px] dark:bg-blue-600/20" />
      <div className="pointer-events-none absolute bottom-[-12%] right-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-300/30 blur-[120px] dark:bg-indigo-600/15" />

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/60 text-slate-700 shadow-lg backdrop-blur-2xl transition hover:scale-105 dark:border-white/10 dark:bg-white/[0.07] dark:text-slate-200"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-amber-500" />
        ) : (
          <Moon className="h-5 w-5 text-blue-700" />
        )}
      </button>

      <section className="relative w-full max-w-[460px] overflow-hidden rounded-[34px] border border-white/80 bg-white/60 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.14),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#121724]/65 dark:shadow-[0_24px_70px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.12)] sm:p-10">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/40" />

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/50 bg-blue-500/10 shadow-inner dark:border-blue-300/15">
          <span className="text-3xl" aria-hidden="true">🏪</span>
        </div>

        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/60 bg-blue-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-800 dark:border-blue-400/20 dark:text-blue-300">
          Duka Poa POS
        </p>

        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Karibu Duka Poa{firstName ? `, ${firstName}` : ''}!
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Mfumo wa kisasa wa kusimamia mauzo, stoo, madeni na faida ya duka lako
          kwa urahisi popote ulipo.
        </p>

        <div className="my-7 flex flex-col items-center gap-3" role="status" aria-live="polite">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tunakupeleka kuweka taarifa za biashara yako...
          </p>
        </div>

        <button
          type="button"
          onClick={continueToOnboarding}
          className="w-full rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.01] hover:bg-blue-500 active:scale-95"
        >
          Endelea sasa <span aria-hidden="true">➔</span>
        </button>
      </section>
    </main>
  );
}
