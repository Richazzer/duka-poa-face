import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  HeartPulse, 
  Boxes,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { api } from '../config';

export default function Overview() {
  const [timeRange, setTimeRange] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'yearly'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [data, setData] = useState({
    today_sales: 0,
    yesterday_sales: 0,
    sales_growth: 0,
    gross_profit: 0,
    total_customers: 0,
    customer_growth: 0,
    health_score: 85,
    net_worth: 0,
    category_breakdown: [],
    weekly_bars: [],
    sales_curve: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch real analytics data safely with timeRange query support
  const fetchRealData = async () => {
    try {
      const [analyticsRes, productsRes] = await Promise.allSettled([
        api.get(`/analytics/economics/?range=${timeRange}`),
        api.get('/products/')
      ]);

      let analyticsData = {};
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data) {
        analyticsData = analyticsRes.value.data;
      }

      let productsData = [];
      if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
        productsData = Array.isArray(productsRes.value.data) ? productsRes.value.data : (productsRes.value.data.results || []);
      }

      const calculatedNetWorth = productsData.reduce((sum, p) => {
        const price = Number(p.price || p.selling_price || 0);
        const qty = Number(p.stock ?? p.stock_quantity ?? 0);
        return sum + price * qty;
      }, 0);

      const catMap = {};
      productsData.forEach(p => {
        const cat = p.category || 'Duka';
        catMap[cat] = (catMap[cat] || 0) + 1;
      });

      const totalProds = productsData.length || 1;
      const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
      const category_breakdown = Object.entries(catMap).map(([name, count], index) => ({
        name,
        percent: Math.round((count / totalProds) * 100),
        color: colors[index % colors.length]
      }));

      setData(prev => ({
        ...prev,
        ...analyticsData,
        net_worth: analyticsData.net_worth || calculatedNetWorth,
        category_breakdown: analyticsData.category_breakdown?.length ? analyticsData.category_breakdown : category_breakdown
      }));
    } catch (e) {
      console.warn('Overview sync error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const handleSync = () => fetchRealData();
    window.addEventListener('duka_sync', handleSync);
    window.addEventListener('duka_data_updated', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);

    const interval = setInterval(fetchRealData, 8000);
    return () => {
      window.removeEventListener('duka_sync', handleSync);
      window.removeEventListener('duka_data_updated', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
      clearInterval(interval);
    };
  }, [timeRange]);

  const rangeLabels = {
    daily: 'Kila Siku',
    weekly: 'Kila Wiki',
    monthly: 'Kila Mwezi',
    yearly: 'Kila Mwaka'
  };

  const curvePoints = useMemo(() => {
    const curve = data.sales_curve?.length ? data.sales_curve : [
      { date: '08:00', value: data.today_sales ? data.today_sales * 0.1 : 0 },
      { date: '11:00', value: data.today_sales ? data.today_sales * 0.3 : 0 },
      { date: '14:00', value: data.today_sales ? data.today_sales * 0.6 : 0 },
      { date: '17:00', value: data.today_sales ? data.today_sales * 0.8 : 0 },
      { date: '20:00', value: data.today_sales || 0 },
    ];

    const maxVal = Math.max(...curve.map(c => c.value), 10000);
    return curve.map((c, i) => {
      const x = 20 + i * (300 / Math.max(1, curve.length - 1));
      const y = 95 - (c.value / maxVal) * 70;
      return { label: c.date, x, y, val: c.value };
    });
  }, [data.sales_curve, data.today_sales]);

  const curvePath = useMemo(() => {
    return curvePoints.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cx = prev.x + (pt.x - prev.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, '');
  }, [curvePoints]);

  const maxBarValue = useMemo(() => {
    const vals = (data.weekly_bars || []).map(b => b.value);
    return Math.max(...vals, 1);
  }, [data.weekly_bars]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 select-none font-sans text-slate-100 pb-36 relative">
      
      {/* HEADER WITH TIME RANGE DROPDOWN */}
      <div className="flex items-center justify-between bg-[#131926]/90 backdrop-blur-3xl p-4 rounded-[24px] border border-white/10 shadow-sm">
        <div>
          <h2 className="text-sm sm:text-base font-black text-white">Muhtasari wa Biashara</h2>
          <p className="text-[11px] text-slate-400">Takwimu na mienendo halisi ya duka lako</p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1a2336] hover:bg-[#222d44] border border-slate-700/80 text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{rangeLabels[timeRange]}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#182030] border border-slate-700 shadow-2xl py-1.5 z-50 animate-fadeIn">
              {Object.entries(rangeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTimeRange(key);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                    timeRange === key ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="p-4 sm:p-5 rounded-[24px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Wateja Wote ({rangeLabels[timeRange]})</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              {data.total_customers.toLocaleString()}
            </h3>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> {data.customer_growth > 0 ? `+${data.customer_growth}%` : 'Haijabadilika'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[24px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mauzo ({rangeLabels[timeRange]})</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              TZS {data.today_sales.toLocaleString()}
            </h3>
            <span className={`text-[11px] font-bold flex items-center gap-1 mt-1 ${data.sales_growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {data.sales_growth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {data.sales_growth >= 0 ? `+${data.sales_growth}%` : `${data.sales_growth}%`}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 2. DESKTOP 2-COLUMN GRID FOR CHARTS & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Sales Curve Overview */}
        <div className="p-5 rounded-[28px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-white">Mwenendo wa Mauzo</h2>
              <p className="text-[11px] text-slate-400">Grafu ya mauzo ya {rangeLabels[timeRange].toLowerCase()}</p>
            </div>
            <div className="bg-[#1a2336] text-blue-400 font-mono text-xs font-black px-3 py-1.5 rounded-xl border border-slate-700">
              TZS {data.today_sales.toLocaleString()}
            </div>
          </div>

          <div className="relative pt-2 pb-1">
            <svg viewBox="0 0 340 115" className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="realGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {[25, 55, 85].map((y, i) => (
                <line key={i} x1="10" y1={y} x2="330" y2={y} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
              ))}

              <path
                d={`${curvePath} L ${curvePoints[curvePoints.length - 1].x},100 L ${curvePoints[0].x},100 Z`}
                fill="url(#realGlow)"
              />
              <path
                d={curvePath}
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {curvePoints.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="3" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={p.x} y="110" textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">{p.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="p-5 rounded-[28px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-white">Kategoria Zilizopo</h2>
            <span className="text-[11px] font-bold text-slate-400">Thamani ya Bidhaa</span>
          </div>

          {data.category_breakdown.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-1">
              <Boxes className="w-8 h-8 mx-auto text-slate-600" />
              <p>Bado hujaweka bidhaa zenye kategoria stoo.</p>
            </div>
          ) : (
            <div className="flex items-center justify-around gap-4 py-1">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {(() => {
                    let accumulatedOffset = 0;
                    const circumference = 238.7;
                    return data.category_breakdown.map((cat, i) => {
                      const strokeLen = (cat.percent / 100) * circumference;
                      const strokeDasharray = `${strokeLen} ${circumference - strokeLen}`;
                      const strokeDashoffset = -accumulatedOffset;
                      accumulatedOffset += strokeLen;

                      return (
                        <circle
                          key={i}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke={cat.color}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Stoo</span>
                  <span className="text-xs font-black text-white">100%</span>
                </div>
              </div>

              <div className="flex-1 space-y-2 max-h-24 overflow-y-auto scrollbar-none">
                {data.category_breakdown.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      <span className="text-slate-300 font-medium text-xs truncate max-w-[120px]">{cat.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white text-xs">{cat.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3. WEEKLY ACTIVITY & HEALTH SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="p-5 rounded-[28px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white">Mzunguko wa Mauzo ({rangeLabels[timeRange]})</h2>
            <span className="text-[11px] font-bold text-slate-400">Vipimo vya Mwenendo</span>
          </div>

          <div className="flex items-end justify-between h-24 pt-2 px-2 gap-2">
            {(data.weekly_bars && data.weekly_bars.length > 0 ? data.weekly_bars : [
              { day: '1', value: 10 }, { day: '2', value: 25 }, { day: '3', value: 40 },
              { day: '4', value: 30 }, { day: '5', value: 60 }, { day: '6', value: 80 }, { day: '7', value: 50 }
            ]).map((bar, i) => {
              const heightPct = bar.value > 0 ? Math.max(12, Math.round((bar.value / maxBarValue) * 100)) : 6;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className={`w-full max-w-[16px] rounded-t-lg transition-all ${
                      bar.value > 0 
                        ? 'bg-gradient-to-t from-indigo-700 to-purple-500 shadow-md shadow-indigo-600/30' 
                        : 'bg-slate-800/80'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span className="text-[9px] font-mono text-slate-400">{bar.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-[28px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Afya ya Biashara</h3>
            </div>
            <span className="text-xs font-black text-emerald-400 font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {data.health_score}/100
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-[#192233] border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
              <span>Thamani Yote ya Biashara (Net Worth):</span>
              <strong className="text-white font-mono text-sm">TZS {Number(data.net_worth).toLocaleString()}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-[#192233] border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
              <span>Makadirio ya Faida ({rangeLabels[timeRange]}):</span>
              <strong className="text-emerald-400 font-mono text-sm">TZS {Number(data.gross_profit).toLocaleString()}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
