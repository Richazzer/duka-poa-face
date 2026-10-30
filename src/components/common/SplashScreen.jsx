import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function SplashScreen({ message = 'Inapakia Duka Pooa...' }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center z-50 text-slate-100 p-4">
      <div className="glass-card-dark p-8 rounded-3xl border border-white/10 flex flex-col items-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse"></div>
          <div className="glass-pill p-4 rounded-2xl relative z-10 text-emerald-400">
            <Sparkles className="w-8 h-8 animate-bounce" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-white tracking-tight">Duka Pooa POS</h2>
          <p className="text-xs text-indigo-200">{message}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Tafadhali subiri kidogo...</span>
        </div>
      </div>
    </div>
  );
}