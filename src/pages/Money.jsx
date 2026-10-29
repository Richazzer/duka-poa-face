import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import { formatTZS } from '../utils/currency';
import { getAllExpenses } from '../db/repositories/expenseRepo';
import { useLanguageStore } from '../store/useLanguageStore';

export default function Money() {
  const { t } = useLanguageStore();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getAllExpenses().then(setExpenses).catch(() => setExpenses([]));
  }, []);

  const columns = [
    { header: 'Tarehe', accessor: 'date' },
    { header: 'Kipengele', accessor: 'category' },
    { header: 'Kiasi', render: (row) => formatTZS(row.amount) }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('money')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Matumizi na fedha kutoka Django backend</p>
      </div>
      <DataTable columns={columns} data={expenses} emptyMessage="Hakuna matumizi yaliyorekodiwa kutoka Django backend." />
    </div>
  );
}
