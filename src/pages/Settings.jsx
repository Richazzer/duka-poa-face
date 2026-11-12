import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Globe, 
  ShieldCheck, 
  Store, 
  CheckCircle2, 
  Sliders, 
  Save 
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { setTheme, getTheme } from '../utils/theme';

export default function Settings() {
  const { lang, toggleLang } = useLanguageStore();
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  const [serverUrl, setServerUrl] = useState(() => {
    return localStorage.getItem('custom_api_url') || 'https://duka-poa.onrender.com/api/v1';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const handleThemeUpdate = () => setCurrentTheme(getTheme());
    window.addEventListener('theme_change', handleThemeUpdate);
    return () => window.removeEventListener('theme_change', handleThemeUpdate);
  }, []);

  const handleThemeToggle = (mode) => {
    setTheme(mode);
    setCurrentTheme(mode);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('custom_api_url', serverUrl.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none font-sans pb-32 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Mipangilio ya Mfumo
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Badili mwonekano wa mfumo, lugha, na mawasiliano ya seva
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Mipangilio imehifadhiwa kikamilifu!
        </div>
      )}

      {/* 
        ========================================================================
        1. THEME CHANGER (CONTROLS ENTIRE APP: LOGIN, REGISTER, OVERVIEW, POS)
        ========================================================================
      */}
      <div className="p-6 rounded-[28px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-black text-slate-900 dark:text-white">Mwonekano wa Rangi (Theme)</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Chagua muundo unaopendelea. Mfumo mzima (kuanzia ukurasa wa kuingia hadi kaunta ya mauzo) utabadilika mara moja.
        </p>

        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {/* Light Theme Pill */}
          <button
            type="button"
            onClick={() => handleThemeToggle('light')}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
              currentTheme === 'light'
                ? 'bg-slate-100 border-blue-600 shadow-sm text-slate-900'
                : 'bg-slate-50/50 dark:bg-[#1a2336] border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold">Mwanga (Light)</p>
                <span className="text-[10px] text-slate-400">Mweupe safi</span>
              </div>
            </div>
            {currentTheme === 'light' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Dark Theme Pill */}
          <button
            type="button"
            onClick={() => handleThemeToggle('dark')}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
              currentTheme === 'dark'
                ? 'bg-[#1a2336] border-blue-500 shadow-sm text-white'
                : 'bg-slate-50/50 dark:bg-[#1a2336] border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold">Giza (Dark)</p>
                <span className="text-[10px] text-slate-400">Titanium Obsidian</span>
              </div>
            </div>
            {currentTheme === 'dark' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        2. LANGUAGE SELECTION
        ========================================================================
      */}
      <div className="p-6 rounded-[28px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#1a2336] text-slate-700 dark:text-slate-300 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lugha ya Mfumo</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Chagua lugha unayopendelea kutumia</p>
          </div>
        </div>

        <button
          onClick={toggleLang}
          className="px-4 py-2 rounded-full bg-slate-100 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          {lang === 'sw' ? 'Kiswahili 🇹🇿' : 'English 🇬🇧'}
        </button>
      </div>

      {/* 
        ========================================================================
        3. LIVE SERVER CONNECTION (PURGED DEVELOPER JARGON)
        ========================================================================
      */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-[28px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-2.5">
          <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-black text-slate-900 dark:text-white">Mawasiliano ya Seva ya Duka</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Anwani ya mtandao inayotumiwa kuhifadhi mauzo, bidhaa na data za duka lako kwa usalama.
        </p>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Anwani ya Seva (Endpoint)
          </label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            className="w-full px-4 py-2.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="py-3 px-6 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" /> Hifadhi Mipangilio
        </button>
      </form>

    </div>
  );
}
