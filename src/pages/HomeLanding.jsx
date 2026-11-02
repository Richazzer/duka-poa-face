import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Receipt 
} from 'lucide-react';

export default function HomeLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-slate-100 overflow-x-hidden font-sans">
      
      {/* Top Apple-Minimalist Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center font-black text-base shadow-sm">
            D
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            Duka Poa <span className="text-slate-400 font-medium">POS</span>
          </span>
        </div>

        {/* Center Pill Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-black transition-colors">Vipengele</a>
          <a href="#preview" className="hover:text-black transition-colors">Muonekano</a>
          <a href="#ai" className="hover:text-black transition-colors">Meneja wa AI</a>
          <a href="#offline" className="hover:text-black transition-colors">Hali ya Nje ya Mtandao</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')} 
            className="py-2 px-5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-full border border-slate-300 transition-all active:scale-[0.99]"
          >
            Sign in
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="py-2 px-5 bg-black hover:bg-slate-900 text-white text-xs font-semibold rounded-full transition-all active:scale-[0.99] shadow-sm flex items-center gap-1.5"
          >
            Anza Bure <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-14 pb-20 space-y-24">
        
        {/* Hero Title & Actions */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          
          {/* Subtle Feature Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Mfumo wa Kisasa wa Mauzo, Stoo & AI
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[1.06]">
            Mauzo Mengi zaidi. <br />
            <span className="text-slate-400 font-extrabold">Bila kazi ngumu.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 max-w-xl font-normal leading-relaxed">
            Mfumo kamili wa kidijitali kwa maduka ya Tanzania. Rekodi mauzo ya haraka, dhibiti madeni ya wateja, fanya kazi hata intaneti ikikatika, na uongeze faida kwa msaada wa AI.
          </p>

          {/* CTA Pill Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center pt-2">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto flex-1 py-3 px-6 bg-black hover:bg-slate-900 text-white text-sm font-semibold rounded-full transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
            >
              Fungua Duka Lako Sasa <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto py-3 px-6 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-full border border-slate-300 transition-all active:scale-[0.99]"
            >
              Ingia kwenye Akaunti
            </button>
          </div>

          <div className="flex items-center gap-6 pt-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Usajili wa haraka kwa OTP
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Hakuna malipo ya kwanza
            </span>
          </div>
        </div>

        {/* Minimal Apple-Style App Preview Window */}
        <div id="preview" className="relative mx-auto max-w-5xl rounded-[32px] p-2 sm:p-3 bg-slate-50 border border-slate-200/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <div className="bg-white rounded-[26px] p-6 sm:p-8 space-y-6 border border-slate-100">
            
            {/* Window Top Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              </div>
              <span className="text-xs font-mono font-medium text-slate-400">dukapoa.co.tz/app</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-slate-600">Django Live Sync</span>
              </div>
            </div>

            {/* Dashboard Mockup Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Mauzo ya Leo</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1.5">TZS 1,248,500</h3>
                <span className="text-xs font-semibold text-emerald-600 mt-2 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% tangu jana
                </span>
              </div>

              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Miamala ya POS</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1.5">48 Risiti</h3>
                <span className="text-xs text-slate-500 font-medium mt-2 inline-block">
                  M-Pesa, Tigo, Cash & Benki
                </span>
              </div>

              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tahadhari ya AI ya Stoo</p>
                <h3 className="text-2xl font-black text-blue-600 mt-1.5">3 Bidhaa</h3>
                <span className="text-xs text-blue-700 font-medium mt-2 inline-block">
                  Sukari & Unga ziko chini ya kiwango
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Feature Grid: What Duka Poa Does */}
        <div id="features" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Kila kitu unachohitaji kuendesha duka.
            </h2>
            <p className="text-sm text-slate-500 font-normal">
              Imeandaliwa maalum kwa mazingira ya wafanyabiashara wa Kitanzania.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: POS */}
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-6">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">POS & Malipo ya Haraka</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Kamilisha mauzo kwa sekunde chache kwa Cash, M-Pesa, Tigo Pesa, Airtel Money au weka kwenye daftari la deni kwa mteja anayeaminika.
              </p>
            </div>

            {/* Feature 2: Offline First */}
            <div id="offline" className="bg-white border border-slate-200 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Inafanya Kazi Bila Intaneti</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Hakuna kusimamisha biashara. Teknolojia ya Dexie.js inahifadhi kila muamala kwenye kifaa chako na kusawazisha na seva intaneti ikirudi.
              </p>
            </div>

            {/* Feature 3: AI Manager */}
            <div id="ai" className="bg-white border border-slate-200 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Meneja wa Akili Mnemba (AI)</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Uliza maswali ya duka lako kwa Kiswahili: "Leo nimeuza kiasi gani?", "Bidhaa gani inaisha?" na upate uchanganuzi sahihi mara moja.
              </p>
            </div>

          </div>
        </div>

        {/* Detailed Secondary Capabilities */}
        <div className="bg-slate-50 rounded-[32px] p-8 sm:p-12 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Udhibiti kamili wa <br /> Madeni na Wateja wako.
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Ondoa daftari za karatasi zinazopotea. Duka Poa inatunza rekodi kamili ya madeni ya wateja, inatuma ujumbe wa kumbukumbu, na kufuatilia malipo kidogo kidogo.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/register')}
                className="py-2.5 px-5 bg-black hover:bg-slate-900 text-white text-xs font-semibold rounded-full transition-all active:scale-[0.99] shadow-sm flex items-center gap-2"
              >
                Anza sasa bure <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <Receipt className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Uchapishaji wa Risiti</p>
                <p className="text-[11px] text-slate-400">Inaunga moja kwa moja na mashine za Bluetooth & Thermal</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Ripoti za Faida Halisi</p>
                <p className="text-[11px] text-slate-400">Tenganisha mapato na gharama za manunuzi bila hesabu ngumu</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Simu au Kompyuta</p>
                <p className="text-[11px] text-slate-400">Inatumika kwenye kifaa chochote chenye kivinjari</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Bottom Call-To-Action Card */}
        <div className="text-center py-10 space-y-5 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Uko tayari kuboresha duka lako leo?
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Jiunge na wafanyabiashara wengine wanaotumia Duka Poa kurahisisha mauzo kila siku.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/register')}
              className="py-3 px-8 bg-black hover:bg-slate-900 text-white text-sm font-semibold rounded-full transition-all active:scale-[0.99] shadow-sm"
            >
              Fungua Akaunti ya Duka Bure ➔
            </button>
          </div>
        </div>

      </main>

      {/* Clean Apple-style Footer */}
      <footer className="w-full border-t border-slate-100 py-8 px-6 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Duka Poa POS Tanzania. Haki zote zimehifadhiwa.</p>
      </footer>

    </div>
  );
}