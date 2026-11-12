import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Store, 
  BarChart3,
  Layers,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function HomeLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070a12] text-white selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden relative">
      
      {/* 
        ========================================================================
        AMBIENT GLOWING ORBS (Apple VisionOS Liquid Lights)
        ========================================================================
      */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-100px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[75%] left-[-150px] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* 
        ========================================================================
        1. FLOATING LIQUID GLASS NAVIGATION BAR
        ========================================================================
      */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 max-w-6xl mx-auto pointer-events-none">
        <nav className="pointer-events-auto h-16 px-5 sm:px-6 rounded-full bg-[#121724]/75 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-between transition-all">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              D
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight text-white block leading-none">
                Duka Poa <span className="text-blue-400 font-bold">POS</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">
                Smart Retail Platform
              </span>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Vipengele</a>
            <a href="#forex" className="hover:text-blue-400 transition-colors">Takwimu za Forex</a>
            <a href="#security" className="hover:text-blue-400 transition-colors">Usalama wa Duka</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/login')}
              className="py-2.5 px-5 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="py-2.5 px-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Anza Bure <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </nav>
      </header>

      {/* 
        ========================================================================
        2. HERO SECTION: Sans-Serif Powerhouse with Glowing Typography
        ========================================================================
      */}
      <main className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20 space-y-24 relative z-10">
        
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          
          {/* Glowing Beacon Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-[11px] font-black tracking-wider uppercase shadow-inner backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Mfumo wa Kisasa wa POS & Usimamizi wa Maduka
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Mauzo Mengi Zaidi. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Bila Kazi Ngumu.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
            Imeundwa maalum kwa ajili ya maduka ya Tanzania. Rekodi mauzo ya haraka, dhibiti madeni ya wateja bila daftari la karatasi, na uone mwenendo wa faida yako kama masoko ya hisa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-md justify-center pt-3">
            <button
              onClick={() => navigate('/register')}
              className="py-4 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Fungua Duka Lako Sasa <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="py-4 px-8 rounded-full bg-[#141b29]/90 hover:bg-[#1a2336] text-slate-200 border border-slate-700/80 font-bold text-sm hover:border-slate-500 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              Ingia kwenye Akaunti
            </button>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Usajili wa papo hapo (Bila OTP)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cloud Database kwenye Render
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Salama kwa simu na kompyuta
            </span>
          </div>

        </div>

        {/* 
          ========================================================================
          3. GLOWING GLASS DASHBOARD PREVIEW MOCKUP
          ========================================================================
        */}
        <div id="forex" className="relative mx-auto max-w-5xl rounded-[36px] p-2 sm:p-3.5 bg-gradient-to-b from-white/10 via-slate-800/40 to-transparent border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl group hover:border-blue-500/30 transition-all duration-500">
          <div className="bg-[#0e131d]/90 rounded-[28px] p-5 sm:p-8 space-y-6 border border-slate-800">
            
            {/* Top Mock Window Controls */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/70"></div>
                <span className="text-xs font-mono font-bold text-slate-500 ml-2">dukapoa.co.tz/app</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Seva Iko Hewani (Live 24/7)
              </div>
            </div>

            {/* Mockup KPI Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-5 rounded-2xl bg-[#141a26] border border-slate-800/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thamani ya Duka (Net Worth)</p>
                <h3 className="text-2xl font-black text-white mt-1">TZS 18,450,000</h3>
                <span className="text-[10px] font-bold text-emerald-400 mt-2 block">Stoo + Mauzo + Madeni</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141a26] border border-slate-800/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mauzo ya Leo</p>
                <h3 className="text-2xl font-black text-blue-400 mt-1">TZS 485,000</h3>
                <span className="text-[10px] font-bold text-slate-400 mt-2 block">32 Miamala ya Haraka</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141a26] border border-slate-800/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kipimo cha Madeni</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">TZS 45,000</h3>
                <span className="text-[10px] font-bold text-emerald-400 mt-2 block">Salama (Chini ya 15%)</span>
              </div>
            </div>

            {/* Glowing Forex Candlestick Strip Mock */}
            <div className="p-5 rounded-2xl bg-[#121722] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Mwelekeo wa Soko la Mauzo (Forex Ticker)</p>
                  <p className="text-[11px] text-slate-400">Inaonyesha vipande vya kijani mauzo yakipanda na nyekundu yakishuka</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-400 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                BULLISH ↗ +18.4%
              </span>
            </div>

          </div>
        </div>

        {/* 
          ========================================================================
          4. FEATURE CARDS: Deep Liquid Glass + Glowing Border Hover
          ========================================================================
        */}
        <div id="features" className="space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Kila kitu unachohitaji <br /> kuendesha duka la kisasa.
            </h2>
            <p className="text-sm text-slate-400 font-normal">
              Ondoa madaftari ya zamani na uendeshe biashara kwa uhakika wa kidijitali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-[30px] bg-[#121722]/80 backdrop-blur-2xl border border-slate-800 shadow-sm hover:border-blue-500/50 hover:shadow-[0_0_35px_rgba(59,130,246,0.15)] hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Kaunta ya Mauzo (POS)</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Kamilisha mauzo kwa sekunde chache kwa Cash, Simu (M-Pesa/Tigo) au Deni. Mfumo unapunguza stoo kiotomatiki na kutoa risiti.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-[30px] bg-[#121722]/80 backdrop-blur-2xl border border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Takwimu za Mtindo wa Forex</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Tazama mauzo ya kila saa yakichorwa kwa mfumo wa candlestick wa kijani na nyekundu, ukiongozwa na mstari wa ukuaji wa faida.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-[30px] bg-[#121722]/80 backdrop-blur-2xl border border-slate-800 shadow-sm hover:border-indigo-500/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Daftari la Madeni & WhatsApp</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Tuma ujumbe wa kumbukumbu ya deni kwa mbofyo mmoja moja kwa moja kwenye WhatsApp ya mteja. Hakuna madeni sugu yanayosahaulika.
              </p>
            </div>

          </div>
        </div>

        {/* 
          ========================================================================
          5. CALL TO ACTION CARD
          ========================================================================
        */}
        <div className="relative overflow-hidden p-8 sm:p-14 rounded-[36px] bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#121722] border border-blue-500/30 text-center space-y-6 backdrop-blur-3xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Anza kutumia Duka Poa leo.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Hakuna mkataba, hakuna ada ya kuanza. Fungua akaunti yako sasa hivi na uanze kuingiza bidhaa.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/register')}
              className="py-4 px-10 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Fungua Akaunti ya Duka ➔
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Duka Poa POS Tanzania. Haki zote zimehifadhiwa.
      </footer>

    </div>
  );
}
