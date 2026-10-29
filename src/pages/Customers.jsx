import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import { formatTZS } from '../utils/currency';
import { getAllCustomers } from '../db/repositories/customerRepo';
import { useLanguageStore } from '../store/useLanguageStore';

export default function Customers() {
  const { t } = useLanguageStore();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getAllCustomers().then(setCustomers).catch(() => setCustomers([]));
  }, []);

  const columns = [
    { header: 'Jina la Mteja', accessor: 'name' },
    { header: 'Namba ya Simu', accessor: 'phone' },
    { header: 'Deni Analodaiwa', render: (row) => formatTZS(row.debtBalance || 0) }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('customers')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Orodha ya wateja na madeni kutoka Django backend</p>
      </div>
      <DataTable columns={columns} data={customers} emptyMessage="Hakuna wateja waliosajiliwa kwenye Django backend." />
    </div>
  );
}
