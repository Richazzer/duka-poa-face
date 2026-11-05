import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bot, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AiManager() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-10rem)] max-w-4xl mx-auto flex items-center justify-center font-sans select-none pb-28">
      
      {/* 
        ========================================================================
        1. BACKGROUND BLURRED SKELETON PREVIEW (Faded & Frosted)
        ========================================================================
      */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-25 dark:opacity-20 blur-md pointer-events-none overflow-hidden select-none">
        <div className="space-y-4 pt-4">
          <div className="h-10 w-64 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="h-6 w-96 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          </div>
        </div>

        <div className="space-y-3 pb-8">
          <div className="h-14 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          <div className="h-14 w-1/2 bg-blue-400 rounded-3xl ml-auto"></div>
          <div className="h-12 w-full bg-slate-300 dark:bg-slate-700 rounded-full mt-4"></div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. FLOATING LIQUID GLASS "COMING SOON" CARD
        ========================================================================
      */}
      <div className="relative z-20 w-full max-w-md mx-4 p-8 sm:p-10 rounded-[32px] bg-white/80 dark:bg-[#151c28]/90 backdrop-blur-3xl border border-white/80 dark:border-slate-700/70 shadow-[0_25px_60px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.7)] flex flex-col items-center text-center space-y-5 animate-fadeIn">
        
        {/* Glowing Specular Badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600"></span>
          </span>
        </div>

        {/* Pulse Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          Inakuja Hivi Karibuni • Coming Soon
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Duka Poa AI Agent
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Tunaboresha injini ya akili mnemba ya kisasa zaidi ili iweze kuchambua mauzo yako na kutoa ushauri wa biashara kwa uhakika wa 100%.
          </p>
        </div>

        {/* Feature Teasers */}
        <div className="w-full pt-2 space-y-2 text-left">
          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Uchambuzi wa moja kwa moja wa faida na stoo</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Kurekebisha bei na stoo kwa sauti au maagizo</span>
          </div>
        </div>

        {/* Action Button: Takes user back to Overview */}
        <div className="w-full pt-2">
          <button
            onClick={() => navigate('/app')}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            Rudi kwenye Muhtasari wa Duka <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}