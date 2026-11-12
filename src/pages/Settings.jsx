import React, { useState } from 'react';
import { Globe, Store, CheckCircle2, Save } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export default function Settings() {
  const { lang, toggleLang } = useLanguageStore();
  const [serverUrl, setServerUrl] = useState(
    () =>
      localStorage.getItem('custom_api_url') ||
      'https://duka-poa.onrender.com/api/v1'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (event) => {
    event.preventDefault();
    localStorage.setItem('custom_api_url', serverUrl.trim());
    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 3000);
  };

  const glassCard =
    'rounded-[28px] border border-white/70 bg-white/60 shadow-[0_18px_50px_rgba(15,23,42,0.10),inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#131926]/70 dark:shadow-[0_18px_50px_rgba(0,0,0,0.32),inset_0_1px_1px_rgba(255,255,255,0.10)]';

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-32 font-sans text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <header>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Mipangilio ya Mfumo
        </h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Badili lugha na mawasiliano ya seva.
        </p>
      </header>

      {savedSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-2xl border border-emerald-300/70 bg-emerald-100/60 p-3.5 text-xs font-bold text-emerald-800 backdrop-blur-xl dark:border-emerald-700/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Mipangilio imehifadhiwa kikamilifu!
        </div>
      )}

      <section className={`flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/50 text-slate-700 shadow-inner dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">Lugha ya Mfumo</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Chagua lugha unayopendelea kutumia.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleLang}
          className="rounded-full border border-white/80 bg-white/60 px-4 py-2.5 text-xs font-black text-slate-800 shadow-sm backdrop-blur-xl transition hover:bg-white/90 active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/10"
        >
          {lang === 'sw' ? 'Kiswahili 🇹🇿' : 'English 🇬🇧'}
        </button>
      </section>

      <form onSubmit={handleSaveSettings} className={`space-y-5 p-5 sm:p-6 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/10 dark:text-emerald-400">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-black">Mawasiliano ya Seva ya Duka</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Anwani inayotumiwa kuhifadhi bidhaa, mauzo na data za duka lako.
            </p>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Anwani ya Seva
          </span>
          <input
            type="url"
            value={serverUrl}
            onChange={(event) => setServerUrl(event.target.value)}
            required
            className="w-full rounded-2xl border border-white/80 bg-white/55 px-4 py-3 font-mono text-xs text-slate-900 shadow-inner outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:focus:border-blue-400"
          />
        </label>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02] hover:bg-blue-500 active:scale-95"
        >
          <Save className="h-4 w-4" />
          Hifadhi Mipangilio
        </button>
      </form>
    </div>
  );
}
