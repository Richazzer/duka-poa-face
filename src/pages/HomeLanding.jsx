import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { 
  ShoppingBag, ShieldCheck, Cpu, Smartphone, ArrowRight, 
  Sparkles 
} from 'lucide-react';

export default function HomeLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-100/60 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-200/80 backdrop-blur-xl sticky top-0 z-50 bg-white/80">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
            P
          </div>
          <span className="font-black text-lg tracking-tight text-slate-900">Duka Pooa <span className="text-emerald-600">POS</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Vipengele</a>
          <a href="#analytics" className="hover:text-emerald-600 transition-colors">AI & Analytics</a>
          <a href="#offline" className="hover:text-emerald-600 transition-colors">Offline Mode</a>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Login
          </button>
          <Button onClick={() => navigate('/register')} className="shadow-lg shadow-emerald-500/20 px-5 py-2.5 rounded-xl font-extrabold">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-16 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black tracking-wider uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" /> Smart Sales. Smarter Business. Powered by Django & AI
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight text-slate-950">
            More Sales. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600">
              Less Effort.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
            Run your Tanzanian retail shop, track inventory offline with Dexie, manage customer debts (madeni), and scale with live Django AI insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pt-2">
            <Button onClick={() => navigate('/register')} className="py-4 text-base font-black shadow-xl shadow-emerald-600/20 rounded-2xl">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} className="py-4 text-base font-black border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 rounded-2xl">
              Sign In to Dashboard
            </Button>
          </div>
        </div>

        {/* Floating Glassmorphic App Preview Mockup */}
        <div className="relative mx-auto max-w-5xl rounded-3xl p-3 bg-gradient-to-b from-emerald-100 via-slate-100 to-white border border-emerald-200/80 shadow-2xl">
          <div className="bg-white rounded-2xl p-6 md:p-8 space-y-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">dukapooa.co.tz/app</span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">Live Django Sync</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <p className="text-xs text-slate-500 uppercase font-bold">Total Sales (Leo)</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">TZS 1,248,500</h3>
                <span className="text-xs text-emerald-700 font-bold mt-2 inline-block">+18% tangu jana</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <p className="text-xs text-slate-500 uppercase font-bold">Miamala</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">48 Mauzo</h3>
                <span className="text-xs text-slate-500 font-medium mt-2 inline-block">Fast POS Checkout</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <p className="text-xs text-slate-500 uppercase font-bold">AI Stock Alert</p>
                <h3 className="text-2xl font-black text-amber-600 mt-1">3 Bidhaa</h3>
                <span className="text-xs text-amber-700 font-bold mt-2 inline-block">Inakaribia kuisha</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-emerald-500/50 p-8 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform border border-emerald-100">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">POS & Fast Checkout</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Kusanya pesa haraka kwa Cash, M-Pesa, Tigo Pesa, au weka Deni la mteja kwa urahisi kabisa.
            </p>
          </div>

          <div className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-emerald-500/50 p-8 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Offline-First Dexie.js</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Kiboko ya kukatika kwa intaneti. Miamala na stock zinakaa salama kwenye kifaa chako na kusawazisha na Django.
            </p>
          </div>

          <div className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-emerald-500/50 p-8 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform border border-emerald-100">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">AI Business Manager</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Uliza maswali kuhusu mauzo yako ya duka kwa lugha ya Kiswahili na upate majibu ya papo hapo kupitia AI.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-slate-200 text-center text-xs font-semibold text-slate-500 bg-slate-50">
        &copy; 2026 Duka Pooa POS Tanzania. All rights reserved. Built for modern businesses.
      </footer>
    </div>
  );
}