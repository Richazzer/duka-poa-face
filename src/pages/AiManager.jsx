import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock } from 'lucide-react';

export default function AiManager() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-10rem)] max-w-4xl mx-auto flex items-center justify-center font-sans pb-28">
      {/* Background blurred skeleton */}
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

      {/* Glass card container */}
      <div className="relative z-20 w-full max-w-xl mx-4 h-[calc(100vh-13rem)] min-h-[420px] rounded-[32px] bg-white/80 dark:bg-[#151c28]/90 backdrop-blur-3xl border border-white/80 dark:border-slate-700/70 shadow-[0_25px_60px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.7)] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200/70 dark:border-slate-800">
          <button
            onClick={() => navigate('/app')}
            aria-label="Rudi kwenye Muhtasari wa Duka"
            className="w-9 h-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Duka Poa AI Agent
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Mauzo, faida na stoo yako
            </p>
          </div>
        </div>

        {/* Coming Soon Content Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Inakuja Hivi Karibuni! 🚀
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Msaidizi wetu wa AI atakuwezesha kuchambua mauzo, faida, na kubadilisha bei au stoo yako kupitia mazungumzo. Subiri maboresho haya mazuri!
            </p>
          </div>
          <button
            onClick={() => navigate('/app')}
            className="mt-4 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            Rudi Kwenye Dashibodi
          </button>
        </div>

      </div>
    </div>
  );
}
