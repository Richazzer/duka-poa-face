import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import { formatTZS } from '../utils/currency';
import { getAllSales } from '../db/repositories/saleRepo';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export default function Overview() {
  const { t } = useLanguageStore();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getAllSales().then(setSales).catch(() => setSales([]));
  }, []);

  const totalSalesAmount = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('overview')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Muhtasari wa data halisi kutoka Django backend</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title={t('total_sales')} 
          value={formatTZS(totalSalesAmount)} 
          subtitle={`${sales.length} Miamala kutoka Django`}
          icon={DollarSign}
        />
        <StatCard 
          title={t('estimated_profit')} 
          value={formatTZS(0)} 
          subtitle="Inasubiri API ya Faida"
          icon={TrendingUp}
        />
        <StatCard 
          title={t('customer_debts')} 
          value={formatTZS(0)} 
          subtitle="Inasubiri API ya Madeni"
          icon={Users}
        />
      </div>
    </div>
  );
}
