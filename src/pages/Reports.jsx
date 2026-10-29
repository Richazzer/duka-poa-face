import React from 'react';
import Card from '../components/common/Card';
import { useLanguageStore } from '../store/useLanguageStore';

export default function Reports() {
  const { t } = useLanguageStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('reports')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Uchambuzi wa maendeleo kutoka Django API</p>
      </div>
      <Card>
        <p className="text-sm text-slate-500">Ripoti zitapatikana mara tu Django backend itakapotoa taarifa za miamala.</p>
      </Card>
    </div>
  );
}
