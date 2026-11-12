import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  HeartPulse, 
  Boxes
} from 'lucide-react';
import { api } from '../config';

export default function Overview() {
  const navigate = useNavigate();

  // 100% Real Database State (Starts at honest 0, updates live)
  const [data, setData] = useState({
    today_sales: 0,
    yesterday_sales: 0,
    sales_growth: 0,
    gross_profit: 0,
    total_customers: 0,
    customer_growth: 0,
    health_score: 75,
    net_worth: 0,
    category_breakdown: [],
    weekly_bars: [],
    sales_curve: []
  });

  const [timeframe, setTimeframe] = useState('monthly');
  const [loading, setLoading] = useState(true);

  // Fetch 100% Real Live Data
  const fetchRealData = async () => {
    try {
      const res = await api.get(`/analytics/economics/?period=${timeframe}`);
      if (res.data) {
        setData(res.data);
      }
    } catch (e) {
      console.warn('Real metrics fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  // 💥 REAL-TIME INTER-TAB COMMUNICATION: Updates the instant a sale or stock changes! 💥
  useEffect(() => {
    fetchRealData();

    const handleSync = () => fetchRealData();
    window.addEventListener('duka_sync', handleSync);
    window.addEventListener('duka_data_updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('duka_sync', handleSync);
      window.removeEventListener('duka_data_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [timeframe]);

  // SVG Wave Points strictly from real sales
  const curvePoints = useMemo(() => {
    if (!data.sales_curve || data.sales_curve.length === 0) {
      return [
        { label: '1 Apr', x: 20, y: 115, val: 0 },
        { label: '8 Apr', x: 95, y: 115, val: 0 },
        { label: '15 Apr', x: 170, y: 115, val: 0 },
        { label: '22 Apr', x: 245, y: 115, val: 0 },
        { label: '30 Apr', x: 320, y: 115, val: 0 },
      ];
    }

    const maxVal = Math.max(...data.sales_curve.map(c => c.value), 10000);
    return data.sales_curve.map((c, i) => {
      const x = 20 + i * (300 / Math.max(1, data.sales_curve.length - 1));
      const y = 115 - (c.value / maxVal) * 85;
      return { label: c.date, x, y, val: c.value };
    });
  }, [data.sales_curve]);

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
    <div className="space-y-4 select-none font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 
        ========================================================================
        1. TOP METRIC CARDS (Exact match to reference photo)
        ========================================================================
      */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Total Users / Customers */}
        <div className="p-4 rounded-[26px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Users</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {data.total_customers.toLocaleString()}
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> {data.customer_growth > 0 ? `+${data.customer_growth}%` : 'Haijabadilika'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Real Sales */}
        <div className="p-4 rounded-[26px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Sales (Mauzo)</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              TZS {data.today_sales.toLocaleString()}
            </h3>
            <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-1 ${data.sales_growth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {data.sales_growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {data.sales_growth >= 0 ? `+${data.sales_growth}%` : `${data.sales_growth}%`}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 
        ========================================================================
        2. SALES OVERVIEW GRAPH (Wave Curve from reference image)
        ========================================================================
      */}
      <div className="p-5 rounded-[28px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">Sales Overview</h2>
            <p className="text-[10px] text-slate-400">Mwelekeo halisi wa kiasi kilichokusanywa</p>
          </div>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="text-[11px] font-bold bg-slate-100 dark:bg-[#1a2336] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1 outline-none cursor-pointer"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        {/* Interactive SVG Canvas with Badge */}
        <div className="relative pt-4 pb-1">
          <div className="absolute top-0 left-[62%] -translate-x-1/2 bg-indigo-600 text-white font-mono text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-indigo-600/30">
            TZS {data.today_sales.toLocaleString()}
          </div>

          <svg viewBox="0 0 340 135" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {[30, 65, 100].map((y, i) => (
              <line key={i} x1="10" y1={y} x2="330" y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" strokeWidth="1" />
            ))}

            <path
              d={`${curvePath} L ${curvePoints[curvePoints.length - 1].x},115 L ${curvePoints[0].x},115 Z`}
              fill="url(#curveFill)"
            />

            <path
              d={curvePath}
              fill="none"
              stroke="#818cf8"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {curvePoints.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                <text x={p.x} y="130" textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">{p.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 
        ========================================================================
        3. TOP CATEGORIES (Donut Chart from reference image)
        ========================================================================
      */}
      <div className="p-5 rounded-[28px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-black text-slate-900 dark:text-white">Top Categories</h2>
          <span className="text-[10px] font-bold text-slate-400">Thamani ya Bidhaa</span>
        </div>

        {data.category_breakdown.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 space-y-1">
            <Boxes className="w-8 h-8 mx-auto text-slate-400" />
            <p>Bado hujaweka bidhaa zenye kategoria stoo.</p>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            
            {/* SVG Donut Ring */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
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
                        strokeWidth="14"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Stoo</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">100%</span>
              </div>
            </div>

            {/* Category Legend */}
            <div className="flex-1 space-y-2">
              {data.category_breakdown.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px] truncate max-w-[110px]">{cat.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">{cat.percent}%</span>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* 
        ========================================================================
        4. USERS OVERVIEW / WEEKLY ACTIVITY (Bar Chart from reference image)
        ========================================================================
      */}
      <div className="p-5 rounded-[28px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 dark:text-white">Users Overview (Mzunguko wa Siku 7)</h2>
          <span className="text-[10px] font-bold text-slate-400">This Week ▾</span>
        </div>

        <div className="flex items-end justify-between h-28 pt-4 px-2 gap-2">
          {data.weekly_bars.map((bar, i) => {
            const heightPct = bar.value > 0 ? Math.max(12, Math.round((bar.value / maxBarValue) * 100)) : 4;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div 
                  className={`w-full max-w-[18px] rounded-t-lg transition-all ${
                    bar.value > 0 
                      ? 'bg-gradient-to-t from-indigo-700 to-purple-500 shadow-md shadow-indigo-600/30' 
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                  style={{ height: `${heightPct}%` }}
                ></div>
                <span className="text-[10px] font-mono text-slate-400">{bar.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        ========================================================================
        5. BUSINESS HEALTH SCORECARD
        ========================================================================
      */}
      <div className="p-5 rounded-[28px] bg-white/80 dark:bg-[#131926]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Business Health</h3>
          </div>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            {data.health_score}/100
          </span>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#192233] border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Thamani Yote ya Biashara (Net Worth):</span>
            <strong className="text-slate-900 dark:text-white font-mono text-xs">TZS {data.net_worth.toLocaleString()}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#192233] border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Makadirio ya Faida ya Leo:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">TZS {data.gross_profit.toLocaleString()}</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
