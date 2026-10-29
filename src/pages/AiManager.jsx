import React from 'react';
import ChatInterface from '../features/ai-manager/components/ChatInterface';
import { useLanguageStore } from '../store/useLanguageStore';

export default function AiManager() {
  const { t } = useLanguageStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('ai_manager')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Mshauri wa biashara anayesoma data za Django</p>
      </div>
      <ChatInterface />
    </div>
  );
}
