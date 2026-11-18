import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Store, 
  CheckCircle2, 
  Save, 
  Receipt, 
  ShieldCheck, 
  FileText, 
  Download, 
  Trash2, 
  Sliders, 
  X,
  Lock,
  Phone,
  SlidersHorizontal,
  Cloud
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { api } from '../config';

export default function Settings() {
  const { lang, toggleLang, t } = useLanguageStore();

  // Automatic Phone System Theme Sync (Light/Dark automatically follows user's device)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemTheme = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    syncSystemTheme(mq);
    mq.addEventListener('change', syncSystemTheme);
    return () => mq.removeEventListener('change', syncSystemTheme);
  }, []);

  // Store Configuration
  const [storeName, setStoreName] = useState(() => localStorage.getItem('duka_store_name') || 'Duka Poa Store');
  const [storePhone, setStorePhone] = useState(() => localStorage.getItem('duka_store_phone') || '');
  const [storeLocation, setStoreLocation] = useState(() => localStorage.getItem('duka_store_location') || 'Dar es Salaam, Tanzania');
  const [tinNumber, setTinNumber] = useState(() => localStorage.getItem('duka_tin_number') || '');

  // Receipt Settings
  const [receiptFooter, setReceiptFooter] = useState(() => localStorage.getItem('duka_receipt_footer') || 'Bidhaa zilizouzwa hazirudishwi baada ya siku 2. Karibu tena!');
  const [printerMode, setPrinterMode] = useState(() => localStorage.getItem('duka_printer_mode') || '58mm');

  // Financial Policy
  const [vatEnabled, setVatEnabled] = useState(() => localStorage.getItem('duka_vat_enabled') === 'true');
  const [maxDiscount, setMaxDiscount] = useState(() => localStorage.getItem('duka_max_discount') || '10');

  // Security Master PIN
  const [ownerPin, setOwnerPin] = useState(() => localStorage.getItem('duka_owner_pin') || '');

  // Server Endpoint
  const [serverUrl, setServerUrl] = useState(
    () => localStorage.getItem('custom_api_url') || 'https://duka-poa.onrender.com/api/v1'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const handleSaveSettings = (event) => {
    event.preventDefault();
    localStorage.setItem('duka_store_name', storeName.trim());
    localStorage.setItem('duka_store_phone', storePhone.trim());
    localStorage.setItem('duka_store_location', storeLocation.trim());
    localStorage.setItem('duka_tin_number', tinNumber.trim());
    localStorage.setItem('duka_receipt_footer', receiptFooter.trim());
    localStorage.setItem('duka_printer_mode', printerMode);
    localStorage.setItem('duka_vat_enabled', vatEnabled ? 'true' : 'false');
    localStorage.setItem('duka_max_discount', maxDiscount);
    localStorage.setItem('duka_owner_pin', ownerPin.trim());
    localStorage.setItem('custom_api_url', serverUrl.trim());

    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/products/');
      const products = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      
      let csv = "data:text/csv;charset=utf-8,ID,Jina la Bidhaa,Kategoria,Bei ya Kuuza,Stock\n";
      products.forEach(p => {
        csv += `"${p.id}","${p.name}","${p.category || 'Duka'}","${p.price || p.selling_price || 0}","${p.stock ?? p.stock_quantity ?? 0}"\n`;
      });

      const encodedUri = encodeURI(csv);
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

  const handleClearCache = () => {
    if (window.confirm('Je, una uhakika unataka kusafisha kumbukumbu ya muda ya kivinjari? Data zako za seva zitabaki salama.')) {
      localStorage.removeItem('duka_overview_cache');
      localStorage.removeItem('duka_cached_overview');
      window.dispatchEvent(new Event('duka_sync'));
      alert('Kumbukumbu ya muda imesafishwa kikamilifu!');
    }
  };

  const glassCard =
    'rounded-[28px] border border-white/70 bg-white/60 shadow-[0_18px_50px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#131926]/75 dark:shadow-[0_18px_50px_rgba(0,0,0,0.32),inset_0_1px_1px_rgba(255,255,255,0.08)]';

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-36 font-sans text-slate-900 transition-colors duration-300 dark:text-slate-100 select-none">
      
      <header>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          {t('settings_title')}
        </h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {t('settings_sub')}
        </p>
      </header>

      {savedSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-2xl border border-emerald-300/70 bg-emerald-100/60 p-3.5 text-xs font-bold text-emerald-800 backdrop-blur-xl dark:border-emerald-700/50 dark:bg-emerald-950/40 dark:text-emerald-300 animate-fadeIn"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          {t('settings_saved')}
        </div>
      )}

      {/* 
        ========================================================================
        1. REAL LANGUAGE SWITCHER (SW / EN)
        ========================================================================
      */}
      <section className={`flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/50 text-slate-700 shadow-inner dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold">{t('language_title')}</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {t('language_sub')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleLang}
          className="rounded-full border border-white/80 bg-white/60 px-5 py-2.5 text-xs font-black text-slate-800 shadow-sm backdrop-blur-xl transition hover:bg-white active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/10 cursor-pointer"
        >
          {lang === 'sw' ? 'Kiswahili 🇹🇿' : 'English 🇬🇧'}
        </button>
      </section>

      {/* 
        ========================================================================
        2. STORE PROFILE & RECEIPT CONFIGURATION FORM
        ========================================================================
      */}
      <form onSubmit={handleSaveSettings} className={`space-y-5 p-5 sm:p-6 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-300/10 dark:text-emerald-400">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-black">{t('store_info_title')}</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t('store_info_sub')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('store_name')}
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
              {t('store_phone')}
            </span>
            <input
              type="text"
              placeholder="07xxxxxxxx"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('store_location')}
            </span>
            <input
              type="text"
              value={storeLocation}
              onChange={(e) => setStoreLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('tin_number')}
            </span>
            <input
              type="text"
              placeholder="123-456-789"
              value={tinNumber}
              onChange={(e) => setTinNumber(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t('receipt_footer')}
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
            {t('printer_mode')}
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
                onClick={() => setPrinterMode(item.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  printerMode === item.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white/40 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Financial & Tax Policies */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('vat_title')}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('vat_sub')}</p>
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
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t('max_discount_title')}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('max_discount_sub')}</p>
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

        {/* Security / Owner Master PIN */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('pin_title')}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              {t('pin_sub')}
            </p>
            <input
              type="password"
              maxLength="4"
              placeholder="••••"
              value={ownerPin}
              onChange={(e) => setOwnerPin(e.target.value)}
              className="w-36 rounded-xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-white/[0.05] px-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono tracking-widest text-sm"
            />
          </label>
        </div>

        {/* Server Endpoint */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('server_title')}
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
          {t('save')}
        </button>
      </form>

      {/* 
        ========================================================================
        3. DATA BACKUP & CSV EXPORT
        ========================================================================
      */}
      <section className={`p-5 sm:p-6 space-y-4 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-300/40 bg-indigo-500/10 text-indigo-700 dark:border-indigo-300/10 dark:text-indigo-400">
            <Download className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-black">{t('backup_title')}</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t('backup_sub')}
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
            {t('export_csv')}
          </button>

          <button
            type="button"
            onClick={handleClearCache}
            className="flex-1 py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
            {t('clear_cache')}
          </button>
        </div>
      </section>

      {/* 
        ========================================================================
        4. LEGAL PRIVACY & TERMS
        ========================================================================
      */}
      <section className={`p-5 sm:p-6 space-y-4 ${glassCard}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300/50 bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </span>
          <div>
            <h2 className="text-base font-black">{t('privacy_title')}</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t('privacy_sub')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setIsPrivacyOpen(true)}
            className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-white/[0.04] text-xs font-bold flex items-center justify-between hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            <span>{t('privacy_btn')}</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </button>

          <button
            type="button"
            onClick={() => setIsTermsOpen(true)}
            className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-white/[0.04] text-xs font-bold flex items-center justify-between hover:bg-white active:scale-95 transition-all cursor-pointer"
          >
            <span>{t('terms_btn')}</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </section>

      {/* PRIVACY POLICY MODAL */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-[32px] bg-white dark:bg-[#131926] border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> {t('privacy_btn')}
              </h3>
              <button onClick={() => setIsPrivacyOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
              <p><strong>1. Umiliki wa Data:</strong> Taarifa zote za duka lako (ikiwemo mauzo, idadi ya stoo, bei za bidhaa, na majina ya wateja wenye madeni) ni mali yako binafsi. Mfumo hautawahi kuuza, kushiriki au kutoa data zako kwa washindani au mtu wa tatu.</p>
              <p><strong>2. Usalama wa Kuhifadhi:</strong> Data zote zinasimbwa kwa njia ya siri (SSL/TLS encryption) pindi zinaposafirishwa kutoka kwenye simu yako kwenda kwenye seva ya mtandao iliyolindwa.</p>
              <p><strong>3. Sheria ya Ulinzi wa Taarifa Binafsi Tanzania (PDPA 2022):</strong> Mfumo huu unazingatia kikamilifu sheria ya ulinzi wa data za wateja na wafanyabiashara nchini Tanzania.</p>
            </div>

            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="w-full py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              Nimeelewa / Accept
            </button>
          </div>
        </div>
      )}

      {/* TERMS OF SERVICE MODAL */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-[32px] bg-white dark:bg-[#131926] border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" /> {t('terms_btn')}
              </h3>
              <button onClick={() => setIsTermsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
              <p><strong>1. Matumizi Halali ya Mfumo:</strong> Mfumo wa Duka Poa umetengenezwa kwa ajili ya usimamizi wa hesabu, mauzo ya rejareja na stoo za maduka. Mtumiaji anawajibika kuhakikisha bei na nambari anazoingiza ni sahihi.</p>
              <p><strong>2. Hali ya Nje ya Mtandao (Offline):</strong> Mfumo una uwezo wa kufanya kazi hata intaneti ikikatika na utatuma data kiotomatiki pindi mtandao utakapounganishwa tena.</p>
              <p><strong>3. Madeni ya Wateja:</strong> Mfumo hutoa daftari la kidijitali la kumbukumbu ya madeni; makubaliano ya mkopo na ulipaji yanabaki kuwa makubaliano kati ya duka na mteja husika.</p>
            </div>

            <button
              onClick={() => setIsTermsOpen(false)}
              className="w-full py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              Nimeelewa / Accept
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
