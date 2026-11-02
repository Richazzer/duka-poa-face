import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SalesProfitCurve from '../components/charts/SalesProfitCurve';
import { 
  ArrowUpRight, 
  Plus, 
  RefreshCw, 
  Package, 
  Users, 
  Receipt 
} from 'lucide-react';

export default function Overview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveMetrics = async () => {
    setRefreshing(true);
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/v1/analytics/economics/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.warn('Real Django metrics fetch note:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveMetrics();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none font-sans">
      
      {/* Clean Glass Action Header */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Rekodi za Leo (Today)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Muhtasari wa Mauzo
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mwenendo wa mauzo na bidhaa za duka moja kwa moja kutoka database
          </p>
        </div>

        {/* Clean Positioned Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchLiveMetrics}
            disabled={refreshing}
            className="p-3 rounded-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            title="Sasisha Takwimu"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/app/pos')}
            className="py-3 px-6 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Fungua POS
          </button>
        </div>
      </div>

      {/* Titanium Grey KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Mauzo ya Leo */}
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Mauzo Yaliyorekodiwa
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            TZS {data?.today_sales?.toLocaleString() || 0}
          </h3>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 inline-flex items-center gap-1">
            <Receipt className="w-3 h-3" /> {data?.today_tx_count || 0} Risiti Zilizotoka
          </span>
        </div>

        {/* Faida ya Mauzo */}
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Makadirio ya Faida
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            TZS {data?.today_profit?.toLocaleString() || 0}
          </h3>
          <span className="text-[10px] font-bold text-slate-400 mt-2 block">
            ~22% ya mauzo
          </span>
        </div>

        {/* Madeni ya Wateja */}
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Madeni ya Wateja
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            TZS {data?.today_debt?.toLocaleString() || 0}
          </h3>
          <button 
            onClick={() => navigate('/app/customers')}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mt-2 block underline cursor-pointer"
          >
            Fungua Daftari ➔
          </button>
        </div>

        {/* Stock Alert */}
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tahadhari ya Stoo
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {data?.low_stock_count || 0} Bidhaa
          </h3>
          <button 
            onClick={() => navigate('/app/products')}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 mt-2 block underline cursor-pointer"
          >
            Angalia Stock ➔
          </button>
        </div>

      </div>

      {/* Real SVG Curve Container */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-6 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Mwelekeo wa Mauzo na Faida (Leo)
            </h2>
            <p className="text-xs text-slate-400">
              Ulinganisho halisi wa kiasi kilichorekodiwa kwa masaa ya leo
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Mauzo
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Faida
            </span>
          </div>
        </div>

        <div className="pt-2">
          {data?.hourly_trend ? (
            <SalesProfitCurve data={data.hourly_trend} />
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">
              Inasawazisha na seva ya Django...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}