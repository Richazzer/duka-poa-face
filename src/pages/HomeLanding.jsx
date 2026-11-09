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
  Star
} from 'lucide-react';

// Web Audio API for tactile Apple-style feedback
const playAppleClick = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Graceful fallback
  }
};

export default function HomeLanding() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Dynamic light mesh tracking cursor movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAction = (path) => {
    playAppleClick();
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white overflow-x-hidden font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro_Text','Segoe_UI',Roboto,sans-serif] relative">
      
      {/* ========================================== */}
      {/* ANIMATED BACKGROUND: Upward Floating Glass Orbs */}
      {/* ========================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating Bubble / Orb 1 */}
        <div className="absolute bottom-[-10%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-tr from-blue-300/30 to-sky-200/40 blur-2xl animate-[floatUp_12s_ease-in-out_infinite]"></div>
        
        {/* Floating Bubble / Orb 2 */}
        <div className="absolute bottom-[-15%] left-[45%] w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-200/30 to-purple-200/30 blur-3xl animate-[floatUp_16s_ease-in-out_infinite] [animation-delay:3s]"></div>
        
        {/* Floating Bubble / Orb 3 */}
        <div className="absolute bottom-[-10%] right-[15%] w-80 h-80 rounded-full bg-gradient-to-tr from-sky-200/45 to-blue-100/30 blur-2xl animate-[floatUp_10s_ease-in-out_infinite] [animation-delay:6s]"></div>

        {/* Floating Bubble / Orb 4 */}
        <div className="absolute bottom-[-20%] left-[70%] w-64 h-64 rounded-full bg-gradient-to-tr from-purple-200/30 to-blue-200/40 blur-2xl animate-[floatUp_14s_ease-in-out_infinite] [animation-delay:2s]"></div>

        {/* Cursor interactive glow mesh */}
        <div 
          className="absolute w-[35vw] h-[35vw] rounded-full bg-blue-300/20 blur-[110px] transition-all duration-300 ease-out pointer-events-none"
          style={{ top: `${mousePos.y - 180}px`, left: `${mousePos.x - 180}px` }}
        ></div>
      </div>

      {/* Tailwind Custom Keyframes Injection for Upward Floating Animation */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-110vh) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>

      {/* Top Glassmorphism Navigation Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between sticky top-4 z-50 bg-white/70 backdrop-blur-3xl border border-white/90 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.03)] mx-4 my-2">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => handleAction('/')}
        >
          <div className="w-9 h-9 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
            D
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-950">
            Duka Poa <span className="text-blue-600 font-medium">POS</span>
          </span>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 tracking-tight">
          <a href="#features" className="hover:text-slate-950 transition-colors">Vipengele</a>
          <a href="#preview" className="hover:text-slate-950 transition-colors">Muonekano</a>
          <a href="#ai" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '5s' }} /> AI Assistant
          </a>
          <a href="#offline" className="hover:text-slate-950 transition-colors">Bila Intaneti</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleAction('/login')} 
            className="py-2 px-5 bg-white/80 hover:bg-white text-slate-800 text-xs font-semibold rounded-full border border-slate-200/70 transition-all active:scale-95 backdrop-blur-md cursor-pointer shadow-xs"
          >
            Ingia
          </button>
          <button 
            onClick={() => handleAction('/register')}
            className="py-2 px-5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition-all active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            Anza Bure <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 pt-16 pb-24 space-y-28 relative z-10">
        
        {/* Keynote Title & CTA */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Mfumo wa Kisasa wa Mauzo, Stoo & AI Tanzania
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tight leading-[1.04]">
            Mauzo Mengi Zaidi. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bila Kazi Ngumu.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed tracking-tight">
            Ondokana na daftari za karatasi na hesabu zinazopotea. Rekodi mauzo ya haraka, dhibiti madeni ya wateja, fanya kazi bila intaneti, na uongeze faida kwa msaada wa AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pt-2">
            <button
              onClick={() => handleAction('/register')}
              className="w-full sm:w-auto flex-1 py-4 px-8 bg-slate-950 hover:bg-slate-800 text-white text-sm font-bold rounded-full transition-all active:scale-95 shadow-xl shadow-slate-950/20 flex items-center justify-center gap-2 cursor-pointer border border-slate-800"
            >
              Fungua Duka Lako Sasa <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAction('/login')}
              className="w-full sm:w-auto py-4 px-8 bg-white/80 hover:bg-white text-slate-900 text-sm font-semibold rounded-full border border-slate-200 transition-all active:scale-95 backdrop-blur-md cursor-pointer shadow-sm"
            >
              Ingia Kwenye Akaunti
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 bg-white/80 py-1.5 px-3.5 rounded-full border border-slate-200/80 backdrop-blur-md shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Usajili wa OTP wa Haraka
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 py-1.5 px-3.5 rounded-full border border-slate-200/80 backdrop-blur-md shadow-xs">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Inafanya kazi Offline & Online
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 py-1.5 px-3.5 rounded-full border border-slate-200/80 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Salama 100%
            </span>
          </div>
        </div>

        {/* Translucent Glass App Mockup */}
        <div id="preview" className="relative mx-auto max-w-5xl rounded-[36px] p-3 bg-white/40 border border-white/80 shadow-[0_30px_90px_rgba(0,0,0,0.06)] backdrop-blur-3xl">
          <div className="bg-white/80 rounded-[30px] p-6 sm:p-8 space-y-6 border border-white/90 shadow-inner">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
              </div>
              <span className="text-xs font-mono font-medium text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
                dukapoa.co.tz/app/dashboard
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-700">Django Live Sync</span>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="bg-white/70 p-6 rounded-2xl border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.02)] backdrop-blur-2xl hover:border-blue-300 transition-colors">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Mauzo ya Leo</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">TZS 1,248,500</h3>
                <span className="text-xs font-semibold text-emerald-700 mt-3 inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% tangu jana
                </span>
              </div>

              <div className="bg-white/70 p-6 rounded-2xl border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.02)] backdrop-blur-2xl hover:border-blue-300 transition-colors">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Miamala ya POS</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">48 Risiti</h3>
                <span className="text-xs text-blue-700 font-medium mt-3 inline-block bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  M-Pesa, Tigo, Cash & Benki
                </span>
              </div>

              <div className="bg-white/70 p-6 rounded-2xl border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.02)] backdrop-blur-2xl hover:border-blue-300 transition-colors">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Tahadhari ya AI ya Stoo</p>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">3 Bidhaa</h3>
                <span className="text-xs text-amber-700 font-medium mt-3 inline-block bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Sukari & Unga ziko chini ya kiwango
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Core Capabilities */}
        <div id="features" className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Kila Kitu Unachohitaji <br />
              <span className="text-blue-600">Kuendesha Duka Lako.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Imeandaliwa maalum kwa mazingira ya wafanyabiashara wa Tanzania.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="group bg-white/70 backdrop-blur-3xl border border-white/90 p-8 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:border-blue-300 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">POS & Malipo ya Haraka</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kamilisha mauzo kwa sekunde chache kwa Cash, M-Pesa, Tigo Pesa, Airtel Money au weka kwenye daftari la deni kwa mteja anayeaminika.
              </p>
            </div>

            {/* Card 2 */}
            <div id="offline" className="group bg-white/70 backdrop-blur-3xl border border-white/90 p-8 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:border-blue-300 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Inafanya Kazi Bila Intaneti</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hakuna kusimamisha biashara. Teknolojia ya Dexie.js inahifadhi kila muamala kwenye kifaa chako na kusawazisha na seva intaneti ikirudi.
              </p>
            </div>

            {/* Card 3 */}
            <div id="ai" className="group bg-white/70 backdrop-blur-3xl border border-white/90 p-8 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:border-blue-300 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Meneja wa AI (Kiswahili)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Uliza maswali ya duka yako kwa Kiswahili: "Leo nimeuza kiasi gani?", "Bidhaa gani inaisha?" na upate uchanganuzi sahihi mara moja.
              </p>
            </div>

          </div>
        </div>

        {/* Feature Focus Section */}
        <div className="bg-white/60 backdrop-blur-3xl rounded-[36px] p-8 sm:p-12 border border-white/90 grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
              <Zap className="w-3.5 h-3.5" /> Udhibiti wa Madeni
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Udhibiti Kamili wa Madeni na Wateja Wako.
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Ondoa daftari za karatasi zinazopotea. Duka Poa inatunza rekodi kamili ya madeni ya wateja, inatuma ujumbe wa kumbukumbu, na kufuatilia malipo kidogo kidogo.
            </p>
            <div>
              <button
                onClick={() => handleAction('/register')}
                className="py-3.5 px-8 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
              >
                Anza Sasa Bure <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/80 p-5 rounded-2xl border border-white shadow-xs flex items-center gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">Uchapishaji wa Risiti</p>
                <p className="text-xs text-slate-500">Inaunga moja kwa moja na mashine za Bluetooth & Thermal</p>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-white shadow-xs flex items-center gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">Ripoti za Faida Halisi</p>
                <p className="text-xs text-slate-500">Tenganisha mapato na gharama za manunuzi bila hesabu ngumu</p>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-white shadow-xs flex items-center gap-4 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">Simu au Kompyuta</p>
                <p className="text-xs text-slate-500">Inatumika kwenye kifaa chochote chenye kivinjari</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Keynote Closing Card */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-sky-50/90 p-10 sm:p-16 text-center space-y-6 border border-white shadow-[0_25px_60px_rgba(0,0,0,0.04)] backdrop-blur-3xl">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight relative z-10">
            Uko Tayari Kuboresha Duka Lako Leo?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto relative z-10">
            Jiunge na wafanyabiashara wengine wanaotumia Duka Poa kurahisisha mauzo kila siku.
          </p>
          <div className="pt-2 relative z-10">
            <button
              onClick={() => handleAction('/register')}
              className="py-4 px-10 bg-slate-950 hover:bg-slate-800 text-white text-sm font-bold rounded-full transition-all active:scale-95 shadow-xl shadow-slate-950/20 cursor-pointer border border-slate-800"
            >
              Fungua Akaunti ya Duka Bure ➔
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 py-8 px-6 text-center text-xs text-slate-500 bg-white/70 backdrop-blur-md">
        <p>&copy; {new Date().getFullYear()} Duka Poa POS Tanzania. Haki zote zimehifadhiwa.</p>
      </footer>

    </div>
  );
}
