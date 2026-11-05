import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SalesProfitCurve from '../components/charts/SalesProfitCurve';
import { 
  Plus, 
  RefreshCw, 
  Receipt,
  Sparkles
} from 'lucide-react';

export default function Overview() {
  const navigate = useNavigate();

  // 1. Remember user's selected period across tab switches (never resets unexpectedly!)
  const [period, setPeriod] = useState(() => {
    return localStorage.getItem('duka_overview_period') || 'yearly';
  });

  // 2. Load cached live data immediately on mount (ZERO flicker, ZERO reset to 0!)
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem('duka_cached_overview');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      period: 'Mwaka Huu (1Y)',
      ticker_timeframe: '1M',
      net_worth: 0,
      today_sales: 0,
      today_profit: 0,
      today_tx_count: 0,
      today_debt: 0,
      low_stock_count: 0,
      hourly_trend: []
    };
  });

  const [refreshing, setRefreshing] = useState(false);

  // 3. Fetch fresh live data from Django
  const fetchLiveMetrics = async (selectedPeriod = period) => {
    setRefreshing(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/analytics/economics/?period=${selectedPeriod}`);
      if (res.data) {
        setData(res.data);
        // Persist to cache so next time you open the tab, it opens instantly!
        localStorage.setItem('duka_cached_overview', JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn('Live metrics fetch note:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveMetrics(period);
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    localStorage.setItem('duka_overview_period', newPeriod);
    fetchLiveMetrics(newPeriod);
  };

  const timeOptions = [
    { id: 'daily', label: 'Leo (1D)' },
    { id: 'weekly', label: 'Wiki (7D)' },
    { id: 'monthly', label: 'Mwezi (30D)' },
    { id: 'yearly', label: 'Mwaka (1Y)' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none font-sans pb-36">
      
      {/* 
        ========================================================================
        TOP EXECUTIVE NET WORTH HERO CARD (PERSISTENT & LIVE)
        ========================================================================
      */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-white/95 via-white/85 to-blue-50/40 dark:from-[#151c28]/95 dark:via-[#111722]/90 dark:to-blue-950/20 backdrop-blur-3xl border border-white/80 dark:border-slate-800 shadow-[0_12px_36px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 text-[11px] font-black tracking-wider uppercase text-blue-700 dark:text-blue-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            Thamani Halisi ya Biashara (Net Worth)
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Thamani halisi ya duka lako kwa sasa ni:
          </p>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            TZS {data.net_worth?.toLocaleString() || 0}
          </h2>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1">
            Inajumuisha thamani ya bidhaa zote stoo, mauzo yaliyokusanywa na madeni ya wateja unayodai.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 relative z-10">
          <button
            onClick={() => fetchLiveMetrics(period)}
            disabled={refreshing}
            className="p-3.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Sasisha Takwimu"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/app/pos')}
            className="py-3 px-6 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Fungua POS
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Mauzo ({data.period || 'Muda Huu'})
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            TZS {data.today_sales?.toLocaleString() || 0}
          </h3>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 inline-flex items-center gap-1">
            <Receipt className="w-3 h-3" /> {data.today_tx_count || 0} Risiti Zilizotoka
          </span>
        </div>

        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Makadirio ya Faida
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            TZS {data.today_profit?.toLocaleString() || 0}
          </h3>
          <span className="text-[10px] font-bold text-slate-400 mt-2 block">
            ~22% Faida Halisi
          </span>
        </div>

        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Madeni ya Wateja
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-amber-500 mt-1">
            TZS {data.today_debt?.toLocaleString() || 0}
          </h3>
          <button 
            onClick={() => navigate('/app/customers')}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mt-2 block underline cursor-pointer"
          >
            Fungua Daftari ➔
          </button>
        </div>

        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tahadhari ya Stoo
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {data.low_stock_count || 0} Bidhaa
          </h3>
          <button 
            onClick={() => navigate('/app/products')}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 mt-2 block underline cursor-pointer"
          >
            Angalia Stock ➔
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        FOREX CHART CARD WITH TIMEFRAME PILL SWITCHER
        ========================================================================
      */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-5 sm:p-7 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Mwelekeo wa Mauzo na Faida ({data.period})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ulinganisho halisi wa kiasi kilichorekodiwa kulingana na muda uliouchagua
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 self-start sm:self-auto">
            {timeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePeriodChange(opt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  period === opt.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm scale-102'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Forex Candlestick + Profit Growth Component */}
        <div className="pt-2">
          <SalesProfitCurve 
            data={data.hourly_trend} 
            timeframe={data.ticker_timeframe} 
          />
        </div>

      </div>

    </div>
  );
}