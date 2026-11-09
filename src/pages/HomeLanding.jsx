import React, { useEffect, useState } from 'react';
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
  Receipt,
  Zap,
  Globe,
  Lock,
  Star
} from 'lucide-react';

// Subtle Web Audio API sound generator for premium tactile feedback
const playClickSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore if audio context is blocked by browser policies
  }
};

export default function HomeLanding() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse for dynamic liquid glass lighting effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNavClick = (path) => {
    playClickSound();
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white overflow-x-hidden font-sans relative">
      
      {/* Background Moving Liquid Smoky Aura (Gemini AI Inspired) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-600/25 to-purple-600/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-900/30 blur-[140px] animate-ping" style={{ animationDuration: '8s' }}></div>
        <div 
          className="absolute w-[30vw] h-[30vw] rounded-full bg-blue-500/10 blur-[100px] transition-all duration-300 ease-out pointer-events-none"
          style={{ top: `${mousePos.y - 150}px`, left: `${mousePos.x - 150}px` }}
        ></div>
      </div>

      {/* Top Glassmorphism Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between sticky top-4 z-50 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.37)] mx-4 my-2">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => handleNavClick('/')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            D
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Duka Poa <span className="text-blue-400 font-medium">POS</span>
          </span>
        </div>

        {/* Center Pill Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Vipengele</a>
          <a href="#preview" className="hover:text-white transition-colors">Muonekano</a>
          <a href="#ai" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} /> Meneja wa AI
          </a>
          <a href="#offline" className="hover:text-white transition-colors">Bila Intaneti</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNavClick('/login')} 
            className="py-2 px-5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-full border border-white/10 transition-all active:scale-95 backdrop-blur-md cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={() => handleNavClick('/register')}
            className="py-2 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-full transition-all active:scale-95 shadow-lg shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
          >
            Anza Bure <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-16 pb-24 space-y-28 relative z-10">
        
        {/* Hero Title & Actions */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold shadow-inner backdrop-blur-md animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            🚀 Mfumo Namba Moja wa Kisasa kwa Biashara Tanzania
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05]">
            Badili Duka Lako <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Kuwa la Kisasa Zaidi.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Acha kupoteza pesa kwenye daftari na hesabu za kubahatisha. Duka Poa inakupa uwezo wa kusimamia mauzo, stoo, madeni na kupata ushauri wa papo hapo kutoka kwa AI kwa lugha ya Kiswahili.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pt-2">
            <button
              onClick={() => handleNavClick('/register')}
              className="w-full sm:w-auto flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white text-sm font-bold rounded-full transition-all active:scale-95 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
            >
              Fungua Duka Lako Sasa <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNavClick('/login')}
              className="w-full sm:w-auto py-4 px-8 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold rounded-full border border-slate-700 transition-all active:scale-95 backdrop-blur-md cursor-pointer"
            >
              Ingia Kwenye Akaunti
            </button>
          </div>

          {/* Social Proof / Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 bg-slate-900/60 py-1.5 px-3 rounded-full border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Usajili wa OTP wa Haraka
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/60 py-1.5 px-3 rounded-full border border-white/5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Inafanya kazi Offline & Online
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/60 py-1.5 px-3 rounded-full border border-white/5">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Salama 100%
            </span>
          </div>
        </div>

        {/* Liquid Glassy Interactive App Preview Window */}
        <div id="preview" className="relative mx-auto max-w-5xl rounded-[36px] p-3 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="bg-slate-900/90 rounded-[30px] p-6 sm:p-8 space-y-6 border border-white/5">
            
            {/* Window Top Controls */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-xs font-mono font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                dukapoa.co.tz/app/dashboard
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-400">Live Render & Vercel Sync</span>
              </div>
            </div>

            {/* Dashboard Mockup Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-2xl border border-slate-700/60 shadow-lg hover:border-blue-500/50 transition-colors">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Mauzo ya Leo</p>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">TZS 1,248,500</h3>
                <span className="text-xs font-semibold text-emerald-400 mt-3 inline-flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% tangu jana
                </span>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-2xl border border-slate-700/60 shadow-lg hover:border-blue-500/50 transition-colors">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Miamala ya POS</p>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">48 Risiti</h3>
                <span className="text-xs text-blue-300 font-medium mt-3 inline-block bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  M-Pesa, Tigo, Cash & Benki
                </span>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-2xl border border-slate-700/60 shadow-lg hover:border-blue-500/50 transition-colors">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Tahadhari ya AI ya Stoo</p>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">3 Bidhaa</h3>
                <span className="text-xs text-amber-300 font-medium mt-3 inline-block bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Sukari & Unga ziko chini ya kiwango
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Feature Grid: What Duka Poa Does */}
        <div id="features" className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Imeandaliwa Kuleta <span className="text-blue-400">Tija Kubwa.</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Vipengele mahsusi vilivyoundwa kwa ajili ya maduka ya reja reja na jumla Tanzania.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: POS */}
            <div className="group bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-8 rounded-3xl shadow-xl hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">POS & Malipo ya Haraka</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Kamilisha mauzo kwa sekunde chache. Pokea malipo kupitia Cash, mitandao ya simu au andika kwenye daftari la deni la dijitali salama kabisa.
              </p>
            </div>

            {/* Feature 2: Offline First */}
            <div id="offline" className="group bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-8 rounded-3xl shadow-xl hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Inafanya Kazi Bila Intaneti</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Umeme au intaneti zikikatika duka halisimami! Teknolojia yetu ya kisasa inahifadhi taarifa zako kwenye kifaa chako na kusawazisha moja kwa moja zikirudi.
              </p>
            </div>

            {/* Feature 3: AI Manager */}
            <div id="ai" className="group bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-8 rounded-3xl shadow-xl hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Meneja wa Akili Mnemba (AI)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Uliza maswali kwa Kiswahili kama vile: "Leo nimeuza kiasi gani?" au "Bidhaa gani inauzwa zaidi?" na upate majibu sahihi pamoja na uchanganuzi wa faida papo hapo.
              </p>
            </div>

          </div>
        </div>

        {/* Detailed Secondary Capabilities Glass Section */}
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-blue-950/30 rounded-[36px] p-8 sm:p-12 border border-white/10 backdrop-blur-2xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-2xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
              <Zap className="w-3.5 h-3.5" /> Udhibiti Kamili
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Sema Kweli Kwa Daftari za Karatasi.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Ondokana na hasara na malalamiko ya wateja kuhusu madeni. Duka Poa inatunza kumbukumbu zote kwa usahihi wa hali ya juu, inatuma taarifa za malipo, na kulinda biashara yako.
            </p>
            <div>
              <button
                onClick={() => handleNavClick('/register')}
                className="py-3 px-8 bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold rounded-full transition-all active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer"
              >
                Anza Sasa Bure <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Uchapishaji wa Risiti za Haraka</p>
                <p className="text-xs text-slate-400">Inaunganishwa moja kwa moja na mashine za Bluetooth & Thermal</p>
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Ripoti za Faida Halisi</p>
                <p className="text-xs text-slate-400">Tenganisha mapato na gharama za manunuzi bila hesabu ngumu</p>
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Simu, Kompyuta au Kompyuta Kibao</p>
                <p className="text-xs text-slate-400">Inatumika kwenye kifaa chochote ulichonacho bila shida</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Bottom Call-To-Action Glass Card */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 p-10 sm:p-16 text-center space-y-6 border border-blue-500/30 backdrop-blur-2xl shadow-2xl">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight relative z-10">
            Uko tayari kuboresha duka lako leo?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto relative z-10">
            Jiunge na wimbi la wafanyabiashara wa Kisasa wanaotumia Duka Poa kuongeza mauzo na kuokoa muda kila siku.
          </p>
          <div className="pt-2 relative z-10">
            <button
              onClick={() => handleNavClick('/register')}
              className="py-4 px-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-full transition-all active:scale-95 shadow-xl shadow-blue-600/40 cursor-pointer border border-blue-400/40"
            >
              Fungua Akaunti ya Duka Bure ➔
            </button>
          </div>
        </div>

      </main>

      {/* Clean Glassmorphism Footer */}
      <footer className="w-full border-t border-white/10 py-8 px-6 text-center text-xs text-slate-500 bg-slate-950/80 backdrop-blur-md">
        <p>&copy; {new Date().getFullYear()} Duka Poa POS Tanzania. Haki zote zimehifadhiwa.</p>
      </footer>

    </div>
  );
}
