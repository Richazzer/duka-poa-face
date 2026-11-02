import React from 'react';
import ChatInterface from '../features/ai-manager/components/ChatInterface';
import { useLanguageStore } from '../store/useLanguageStore';

export default function AiManager() {
  const { t } = useLanguageStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      
      {/* Apple-style Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              ✨
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('ai_manager') || 'Meneja wa AI'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-10">
            Mshauri mwerevu anayechanganua mauzo na data za stoo kutoka Django
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Muunganisho uko tayari
        </div>
      </div>

      {/* Main Clean Chat Interface Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] overflow-hidden">
        <ChatInterface />
      </div>

    </div>
  );
}