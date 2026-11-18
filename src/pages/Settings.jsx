import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Store, 
  CheckCircle2, 
  Save, 
  Sun, 
  Moon, 
  Receipt, 
  ShieldCheck, 
  FileText, 
  Download, 
  Trash2, 
  Percent, 
  Phone, 
  Sliders, 
  X,
  Lock,
  Sparkles
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { api } from '../config';

export default function Settings() {
  const { lang, toggleLang } = useLanguageStore();

  // Theme Management
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Store Configuration
  const [storeName, setStoreName] = useState(() => localStorage.getItem('duka_store_name') || 'Duka Poa Store');
  const [storePhone, setStorePhone] = useState(() => localStorage.getItem('duka_store_phone') || '');
  const [receiptFooter, setReceiptFooter] = useState(() => localStorage.getItem('duka_receipt_footer') || 'Bidhaa zilizouzwa hazirudishwi. Ahsante na Karibu Tena!');
  const [printerType, setPrinterType] = useState(() => localStorage.getItem('duka_printer_type') || '58mm'); // '58mm', '80mm', 'whatsapp'

  // Tax & Financial Settings
  const [vatEnabled, setVatEnabled] = useState(() => localStorage.getItem('duka_vat_enabled') === 'true');
  const [maxDiscount, setMaxDiscount] = useState(() => localStorage.getItem('duka_max_discount') || '10');

  // Server Endpoint (Purged of developer jargon)
  const [serverUrl, setServerUrl] = useState(() => {
    return localStorage.getItem('custom_api_url') || 'https://duka-poa.onrender.com/api/v1';
  });

  // Modals & Feedback
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Theme Toggle Effect
  const handleThemeChange = (newTheme) => {
    setThemeState(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new Event('theme_change'));
  };

  // Save Settings
  const handleSaveSettings = (event) => {
    event.preventDefault();
    localStorage.setItem('duka_store_name', storeName.trim());
    localStorage.setItem('duka_store_phone', storePhone.trim());
    localStorage.setItem('duka_receipt_footer', receiptFooter.trim());
    localStorage.setItem('duka_printer_type', printerType);
    localStorage.setItem('duka_vat_enabled', vatEnabled ? 'true' : 'false');
    localStorage.setItem('duka_max_discount', maxDiscount);
    localStorage.setItem('custom_api_url', serverUrl.trim());

    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 3000);
  };

  // 1-Click Export to CSV
  const handleExportCSV = async () => {
    try {
      const res = await api.get('/products/');
      const products = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      
      let csvContent = "data:text/csv;charset=utf-8,ID,Jina la Bidhaa,Kategoria,Bei ya Kuuza,Stock\n";
      products.forEach(p => {
        csvContent += `"${p.id}","${p.name}","${p.category || 'Duka'}","${p.price || p.selling_price || 0}","${p.stock ?? p.stock_quantity ?? 0}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Bidhaa_Duka_Poa_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Imeshindikana kupakua data kwa sasa.');
    }
  };

  // Safe Browser Cache Clear
  const handleClearCache = () => {
    if (window.confirm('Je, una uhakika unataka kusafisha kumbukumbu ya muda ya kivinjari hiki? Data zako za seva zitabaki salama.')) {
      localStorage.removeItem('duka_cached_overview');
      localStorage.removeItem('duka_last_sync');
      window.dispatchEvent(new Event('duka_sync'));
      alert('Kumbukumbu ya muda imesafishwa kikamilifu!');
    }
  };

  const glassCard =
    'rounded-[28px] border border-white/70 bg-white/60 shadow-[0_18px_50px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#131926]/75 dark:shadow-[0_18px_50px_rgba(0,0,0,0.32),inset_0_1px_1px_rgba(255,255,255,0.08)]';

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-36 font-sans text-slate-900 transition-colors duration-300 dark:text-slate-100 select-none">
      
      {/* Header */}
      <header>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Mipangilio ya Mfumo
        </h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Dhibiti taarifa za duka, muundo wa risiti, kodi, lugha na usalama wa mfumo wako.
        </p>
      </header>

      {/* Success Banner */}
      {savedSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-2xl border border-emerald-300/70 bg-emerald-100/60 p-3.5 text-xs font-bold text-emerald-800 backdrop-blur-xl dark:border-emerald-700/50 dark:bg-emerald-950/40 dark:text-emerald-300 animate-fadeIn"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Mipangilio imehifadhiwa kikamilifu!
        </div>
      )}

      {/* 
        ========================================================================
        1. THEME SWITCHER (DARK / LIGHT CONTROLLER ACROSS ALL PAGES)
        ========================================================================
      */}
      <section className={`p-5 sm:p-6 space-y-4 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/40 bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Sliders className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-black">Mwonekano wa Rangi (Theme)</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Badili muundo wa rangi wa mfumo mzima kuanzia kaunta ya mauzo hadi dashibodi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white border-blue-600 shadow-md text-slate-900'
                : 'bg-white/40 dark:bg-[#1a2336] border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold">Mwanga (Light)</p>
                <span className="text-[10px] text-slate-400">Porcelain White</span>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#1a2336] border-blue-500 shadow-md text-white'
                : 'bg-white/40 dark:bg-[#1a2336] border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
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
            {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </section>

      {/* 
        ========================================================================
        2. LANGUAGE SWITCHER
        ========================================================================
      */}
      <section className={`flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/50 text-slate-700 shadow-inner dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">Lugha ya Mfumo</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Chagua lugha unayopendelea kutumia kwenye duka lako.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleLang}
          className="rounded-full border border-white/80 bg-white/60 px-5 py-2.5 text-xs font-black text-slate-800 shadow-sm backdrop-blur-xl transition hover:bg-white active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/10"
        >
          {lang === 'sw' ? 'Kiswahili 🇹🇿' : 'English 🇬🇧'}
        </button>
      </section>

      {/* 
        ========================================================================
        3. STORE PROFILE & RECEIPT SETTINGS
        ========================================================================
      */}
      <form onSubmit={handleSaveSettings} className={`space-y-5 p-5 sm:p-6 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/10 dark:text-emerald-400">
            <Receipt className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-black">Taarifa za Duka & Muundo wa Risiti</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Maelezo yatakayoonekana juu na chini ya risiti za wateja.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Jina la Duka (Kwenye Risiti)
            </span>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Simu ya Duka (WhatsApp)
            </span>
            <input
              type="text"
              placeholder="07xxxxxxxx"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Ujumbe wa Chini ya Risiti (Footer Note)
          </span>
          <input
            type="text"
            value={receiptFooter}
            onChange={(e) => setReceiptFooter(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* Printer format */}
        <div>
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Aina ya Uchapishaji (Printer Mode)
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '58mm', label: 'Thermal 58mm' },
              { id: '80mm', label: 'Thermal 80mm' },
              { id: 'whatsapp', label: 'WhatsApp Only' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPrinterType(item.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  printerType === item.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white/40 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 
          ========================================================================
          4. TAX (VAT) & DISCOUNT RULES
          ========================================================================
        */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Kodi ya Ongezeko la Thamani (VAT - 18%)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Tenga kodi kwenye hesabu za mauzo kiotomatiki</p>
            </div>
            <button
              type="button"
              onClick={() => setVatEnabled(!vatEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${vatEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${vatEnabled ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Ukomo wa Punguzo kwa Kaunta (Max Discount)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Kiwango cha juu cha asilimia ya punguzo muuzaji anaweza kutoa</p>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                max="50"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-16 rounded-xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-2.5 py-1 text-center font-bold text-xs"
              />
              <span className="text-xs font-bold">%</span>
            </div>
          </div>
        </div>

        {/* Server Endpoint (Clean Business Wording) */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Anwani ya Seva ya Duka (Cloud Sync)
            </span>
            <input
              type="url"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-4 py-2.5 font-mono text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02] hover:bg-blue-500 active:scale-95 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Hifadhi Mipangilio Yote
        </button>
      </form>

      {/* 
        ========================================================================
        5. DATA BACKUP & CSV EXPORT
        ========================================================================
      */}
      <section className={`p-5 sm:p-6 space-y-4 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-300/40 bg-indigo-500/10 text-indigo-700 dark:border-indigo-300/10 dark:text-indigo-400">
            <Download className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-black">Nakala na Utunzaji wa Data</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Pakua taarifa zako za biashara au safisha kumbukumbu ya muda.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 py-3 px-5 rounded-2xl bg-white dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-[#202c44] active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-500" />
            Pakua Bidhaa Zote (Excel / CSV)
          </button>

          <button
            type="button"
            onClick={handleClearCache}
            className="flex-1 py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
            Safisha Kumbukumbu ya Muda (Cache)
          </button>
        </div>
      </section>

      {/* 
        ========================================================================
        6. PRIVACY POLICY & TERMS OF SERVICE (PDPA TANZANIA COMPLIANT)
        ========================================================================
      */}
      <section className={`p-5 sm:p-6 space-y-4 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300/50 bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </span>
          <div>
            <h2 className="text-base font-black">Sheria, Masharti & Sera ya Faragha</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Ulinzi wa data za biashara yako chini ya sheria za Tanzania (PDPA Act 2022).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setIsPrivacyOpen(true)}
            className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-white/[0.04] text-xs font-bold flex items-center justify-between hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            <span>Sera ya Faragha (Privacy)</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </button>

          <button
            type="button"
            onClick={() => setIsTermsOpen(true)}
            className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-white/[0.04] text-xs font-bold flex items-center justify-between hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            <span>Sheria na Masharti (Terms)</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </section>

      {/* 
        ========================================================================
        PRIVACY POLICY MODAL
        ========================================================================
      */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-[32px] bg-white dark:bg-[#131926] border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Sera ya Faragha ya Duka Poa
              </h3>
              <button onClick={() => setIsPrivacyOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
              <p>
                <strong>1. Umiliki wa Data:</strong> Taarifa zote za duka lako (ikiwemo mauzo, idadi ya stoo, bei za bidhaa, na majina ya wateja wenye madeni) ni mali yako binafsi. Duka Poa haitawahi kuuza, kushiriki au kutoa data zako kwa wafanyabiashara wengine au washindani.
              </p>
              <p>
                <strong>2. Usalama wa Kuhifadhi:</strong> Data zako zinasimbwa kwa njia ya siri (SSL/TLS encryption) pindi zinaposafirishwa kutoka kwenye simu yako kwenda kwenye seva ya mtandao iliyolindwa.
              </p>
              <p>
                <strong>3. Sheria ya Ulinzi wa Taarifa Binafsi Tanzania (PDPA 2022):</strong> Mfumo huu unazingatia kikamilifu sheria ya ulinzi wa data za wateja na wafanyabiashara nchini Tanzania.
              </p>
            </div>

            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="w-full py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              Nimeelewa na Kukubali
            </button>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        TERMS OF SERVICE MODAL
        ========================================================================
      */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-[32px] bg-white dark:bg-[#131926] border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" /> Sheria na Masharti ya Matumizi
              </h3>
              <button onClick={() => setIsTermsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
              <p>
                <strong>1. Matumizi Halali ya Mfumo:</strong> Mfumo wa Duka Poa umetengenezwa kwa ajili ya kusaidia usimamizi wa hesabu, mauzo ya rejareja na stoo za maduka. Mtumiaji anawajibika kuhakikisha bei na nambari anazoingiza ni sahihi.
              </p>
              <p>
                <strong>2. Hali ya Nje ya Mtandao (Offline):</strong> Mfumo una uwezo wa kufanya kazi bila intaneti na utatuma data kiotomatiki pindi mtandao utakapounganishwa tena.
              </p>
              <p>
                <strong>3. Madeni ya Wateja:</strong> Mfumo hutoa daftari la kidijitali la kumbukumbu ya madeni; makubaliano ya mkopo na ulipaji yanabaki kuwa makubaliano kati ya duka na mteja husika.
              </p>
            </div>

            <button
              onClick={() => setIsTermsOpen(false)}
              className="w-full py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              Nimeelewa na Kukubali
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
