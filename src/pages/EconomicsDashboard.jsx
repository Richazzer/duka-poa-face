import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Flame, ShieldAlert, RefreshCw } from 'lucide-react';

export default function EconomicsDashboard() {
  const [metrics, setMetrics] = useState({
    mrr: 0,
    arr: 0,
    growth_rate: 0,
    churn_rate: 0,
    unpaid_debts: 0,
    estimated_expenses: 0,
    net_burn_rate: 0,
    currency: 'TZS'
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/analytics/economics/');
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch financial metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Economics & SaaS Metrics</h1>
          <p className="text-xs text-indigo-200">MRR, ARR, Burn Rate, and Debt liabilities overview</p>
        </div>
        <button
          onClick={fetchMetrics}
          className="glass-pill p-3 rounded-2xl hover:text-emerald-400 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Glass Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* MRR */}
        <div className="glass-card-dark p-5 rounded-3xl space-y-2 border border-white/10">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">MRR (Monthly Revenue)</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xl font-black text-white">
            {metrics.currency} {metrics.mrr.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{metrics.growth_rate}% from last month</span>
          </div>
        </div>

        {/* ARR */}
        <div className="glass-card-dark p-5 rounded-3xl space-y-2 border border-white/10">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">ARR (Annual Projected)</span>
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-xl font-black text-white">
            {metrics.currency} {metrics.arr.toLocaleString()}
          </p>
          <p className="text-[11px] text-indigo-200/70">Projected 12-month run rate</p>
        </div>

        {/* Burn Rate */}
        <div className="glass-card-dark p-5 rounded-3xl space-y-2 border border-white/10">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Net Burn Rate</span>
            <Flame className="w-5 h-5" />
          </div>
          <p className="text-xl font-black text-white">
            {metrics.currency} {metrics.net_burn_rate.toLocaleString()} /mo
          </p>
          <p className="text-[11px] text-amber-300/80">
            Est. Monthly Expenses: TZS {metrics.estimated_expenses.toLocaleString()}
          </p>
        </div>

        {/* Churn Rate & Liabilities */}
        <div className="glass-card-dark p-5 rounded-3xl space-y-2 border border-white/10">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold uppercase tracking-wider">Churn Rate</span>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-xl font-black text-white">{metrics.churn_rate}%</p>
          <div className="flex items-center gap-1 text-[11px] text-rose-300">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Unpaid Debt: TZS {metrics.unpaid_debts.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}