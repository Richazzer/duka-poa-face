import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useLanguageStore } from '../store/useLanguageStore';

export default function Settings() {
  const { t } = useLanguageStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('settings')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Mipangilio ya Duka Pooa na API endpoint</p>
      </div>
      <Card className="space-y-4 rounded-3xl">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Django API Base URL</label>
          <input type="text" defaultValue="http://localhost:8000/api/v1" className="w-full max-w-md p-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 font-mono" />
        </div>
        <Button>Hifadhi Mipangilio</Button>
      </Card>
    </div>
  );
}
