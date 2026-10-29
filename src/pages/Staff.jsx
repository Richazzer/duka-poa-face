import React from 'react';
import Card from '../components/common/Card';
import { useLanguageStore } from '../store/useLanguageStore';

export default function Staff() {
  const { t } = useLanguageStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('staff')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Usimamizi wa wafanyakazi wa Django</p>
      </div>
      <Card>
        <p className="text-sm text-slate-500">Wafanyakazi na ruhusa kutoka Django backend.</p>
      </Card>
    </div>
  );
}
