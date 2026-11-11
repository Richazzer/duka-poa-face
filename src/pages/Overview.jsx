import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Crown, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  X,
  Plus
} from 'lucide-react';
import { api } from '../config';

export default function Overview() {
  const navigate = useNavigate();

  // Top Floating Modal States
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Timeframe Filter: 'daily', 'weekly', 'monthly'
  const [timeframe, setTimeframe] = useState('monthly');

  // Live Data State
  const [data, setData] = useState({
    today_sales: 234300,
    yesterday_sales: 208000,
    sales_growth: 12.6,
    gross_profit: 51500,
    total_customers: 1420,
    customer_growth: 3.4,
    health_score: 78,
    category_breakdown: [
      { name: 'Vinywaji', percent: 35, color: '#6366f1' },
      { name: 'Vyakula', percent: 25, color: '#38bdf8' },
      { name: 'Nafaka & Unga', percent: 20, color: '#10b981' },
      { name: 'Sabuni & Usafi', percent: 20, color: '#f59e0b' },
    ],
    weekly_bars: [
      { day: 'Mon', value: 38 },
      { day: 'Tue', value: 65 },
      { day: 'Wed', value: 52 },
      { day: 'Thu', value: 85 },
      { day: 'Fri', value: 95 },
      { day: 'Sat', value: 110 },
      { day: 'Sun', value: 72 },
    ],
    sales_curve: [
      { date: '1 Apr', value: 12000 },
      { date: '8 Apr', value: 24000 },
      { date: '15 Apr', value: 19000 },
      { date: '22 Apr', value: 38000 },
      { date: '30 Apr', value: 32430 },
    ]
  });

  // Fetch real data safely with zero crashes
  const fetchOverviewData = async () => {
    try {
      const res = await api.get(`/analytics/economics/?period=${timeframe}`);
      if (res.data) {
        setData((prev) => ({
          ...prev,
          today_sales: res.data.today_sales || prev.today_sales,
          gross_profit: res.data.today_profit || prev.gross_profit,
          health_score: res.data.economics?.health_score || 78,
        }));
      }
    } catch (e) {
      console.warn('Live overview fetch note:', e);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, [timeframe]);

  // Notifications List
  const notifications = [
    { id: 1, title: 'Mauzo Yamerekodiwa', desc: 'Risiti mpya ya TZS 14,500 imehifadhiwa.', time: 'Dakika 5 zilizopita', unread: true },
    { id: 2, title: 'Tahadhari ya Stoo', desc: 'Unga wa Ngano 2kg umebaki pakiti 3 tu stoo.', time: 'Saa 1 lililopita', unread: true },
    { id: 3, title: 'Deni Limelipwa', desc: 'Mama Asha amelipa deni la TZS 25,000 kikamilifu.', time: 'Saa 3 zilizopita', unread: false },
  ];

  return (
    <div className="max-w-md mx-auto space-y-5 select-none font-sans pb-32 text-slate-100">
      
      {/* 
        ========================================================================
        TOP BAR WITH FLOATING LIQUID GLASS CIRCLES: PLAN (LEFT) & NOTIFICATION (RIGHT)
        ========================================================================
      */}
      <div className="flex items-center justify-between pt-2 px-1">
        
        {/* Left Floating Liquid Glass Circle: PLAN / KIFURUSHI */}
        <button
          onClick={() => setIsPlanOpen(true)}
          className="w-11 h-11 rounded-full bg-[#131926]/85 backdrop-blur-2xl border border-white/15 flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)] cursor-pointer group"
          title="Mpango wa Mfumo (Plan)"
        >
          <Crown className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Center Title */}
        <h1 className="text-xl font-black text-white tracking-tight">
          Dashboard
        </h1>

        {/* Right Floating Liquid Glass Circle: NOTIFICATIONS */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative w-11 h-11 rounded-full bg-[#131926]/85 backdrop-blur-2xl border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)] cursor-pointer"
          title="Taarifa za Duka"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#131926]"></span>
        </button>
      </div>

      {/* 
        ========================================================================
        1. TOP METRIC CARDS (Exact match to reference image)
        ========================================================================
      */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Card 1: Total Users / Customers */}
        <div className="p-4 rounded-[26px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Total Users</p>
            <h3 className="text-xl font-black text-white mt-0.5">
              {data.total_customers.toLocaleString()}
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> +{data.customer_growth}%
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Sales */}
        <div className="p-4 rounded-[26px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400">Sales</p>
            <h3 className="text-xl font-black text-white mt-0.5">
              TZS {data.today_sales.toLocaleString()}
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> +{data.sales_growth}%
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 
        ========================================================================
        2. SALES OVERVIEW GRAPH (Interactive Smooth SVG Wave Line with Glowing Dots)
        ========================================================================
      */}
      <div className="p-5 rounded-[28px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.3)] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white">Sales Overview</h2>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="text-[11px] font-bold bg-[#1a2336] text-slate-300 border border-slate-700/80 rounded-xl px-2.5 py-1 outline-none cursor-pointer"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        {/* SVG Curve Canvas */}
        <div className="relative pt-4 pb-1">
          {/* Glowing Tooltip Badge from image */}
          <div className="absolute top-0 left-[62%] -translate-x-1/2 bg-indigo-600 text-white font-mono text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-indigo-600/40">
            TZS {data.today_sales.toLocaleString()}
          </div>

          <svg viewBox="0 0 340 140" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="waveGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Dotted Lines */}
            {[25, 60, 95].map((y, i) => (
              <line key={i} x1="0" y1={y} x2="340" y2={y} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
            ))}

            {/* Shaded Area */}
            <path
              d="M 15,110 C 60,95 90,60 130,55 C 170,50 200,80 230,35 C 270,30 300,45 325,40 L 325,120 L 15,120 Z"
              fill="url(#waveGlow)"
            />

            {/* Smooth Glowing Wave Path */}
            <path
              d="M 15,110 C 60,95 90,60 130,55 C 170,50 200,80 230,35 C 270,30 300,45 325,40"
              fill="none"
              stroke="#818cf8"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Points / Nodes */}
            {[
              { cx: 15, cy: 110 },
              { cx: 70, cy: 92 },
              { cx: 130, cy: 55 },
              { cx: 180, cy: 68 },
              { cx: 230, cy: 35 },
              { cx: 280, cy: 45 },
              { cx: 325, cy: 40 },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.cx} cy={p.cy} r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              </g>
            ))}

            {/* Dates along X axis */}
            <text x="15" y="135" className="text-[9px] fill-slate-500 font-mono">1 Apr</text>
            <text x="90" y="135" className="text-[9px] fill-slate-500 font-mono">8 Apr</text>
            <text x="175" y="135" className="text-[9px] fill-slate-500 font-mono">15 Apr</text>
            <text x="255" y="135" className="text-[9px] fill-slate-500 font-mono">22 Apr</text>
            <text x="315" y="135" className="text-[9px] fill-slate-500 font-mono">30 Apr</text>
          </svg>
        </div>
      </div>

      {/* 
        ========================================================================
        3. TOP CATEGORIES (Matching the Donut Ring Chart from Image)
        ========================================================================
      */}
      <div className="p-5 rounded-[28px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.3)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-sm font-black text-white">Top Categories</h2>
          <span className="text-[11px] font-bold text-slate-400">This Month ▾</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          
          {/* Custom SVG Donut Ring */}
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Segment 1: 35% Indigo */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#6366f1" strokeWidth="15" strokeDasharray="83.5 238.7" strokeDashoffset="0" />
              {/* Segment 2: 25% Sky Blue */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#38bdf8" strokeWidth="15" strokeDasharray="59.7 238.7" strokeDashoffset="-83.5" />
              {/* Segment 3: 20% Emerald Green */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="15" strokeDasharray="47.7 238.7" strokeDashoffset="-143.2" />
              {/* Segment 4: 20% Amber Orange */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="15" strokeDasharray="47.7 238.7" strokeDashoffset="-190.9" />
            </svg>
            <div className="absolute text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total</span>
              <span className="text-xs font-black text-white">100%</span>
            </div>
          </div>

          {/* Categories Legend */}
          <div className="flex-1 space-y-2">
            {data.category_breakdown.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-300 font-medium text-[11px] truncate max-w-[110px]">{cat.name}</span>
                </div>
                <span className="font-mono font-bold text-white text-[11px]">{cat.percent}%</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 
        ========================================================================
        4. WEEKLY ACTIVITY / USERS OVERVIEW (Purple Bar Chart from Image)
        ========================================================================
      */}
      <div className="p-5 rounded-[28px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.3)] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white">Weekly Activity</h2>
          <span className="text-[11px] font-bold text-slate-400">This Week ▾</span>
        </div>

        {/* Vertical Bars */}
        <div className="flex items-end justify-between h-28 pt-4 px-2 gap-2">
          {data.weekly_bars.map((bar, i) => {
            const heightPercent = Math.min(100, Math.round((bar.value / 120) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                <div 
                  className="w-full max-w-[20px] rounded-t-lg bg-gradient-to-t from-indigo-700 to-purple-500 group-hover:brightness-125 transition-all shadow-md shadow-indigo-600/20"
                  style={{ height: `${heightPercent}%` }}
                ></div>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">{bar.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        ========================================================================
        5. BUSINESS HEALTH SCORECARD (Section from specification)
        ========================================================================
      */}
      <div className="p-5 rounded-[28px] bg-[#131926]/90 backdrop-blur-3xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.3)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Business Health</h3>
          </div>
          <span className="text-xs font-black text-emerald-400 font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {data.health_score}/100
          </span>
        </div>

        <p className="text-[10px] text-slate-400 italic">
          Calculated from real daily sales volume, debt risk ratio, and inventory velocity.
        </p>

        {/* 3 Advisory Insights */}
        <div className="space-y-2.5">
          
          <div className="p-3.5 rounded-2xl bg-[#192132]/80 border border-slate-800 space-y-1">
            <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> Sales are steady
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Compare actual sales with the previous equivalent period to identify the change.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#192132]/80 border border-slate-800 space-y-1">
            <p className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Stock needs attention
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Identify products below their configured reorder levels and estimate replenishment needs.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#192132]/80 border border-slate-800 space-y-1">
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Recommended action
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Review your best-selling products and available margins before your next stock purchase.
            </p>
          </div>

        </div>
      </div>

      {/* 
        ========================================================================
        MODAL 1: PLAN / KIFURUSHI MODAL (Opened by Left Glass Circle)
        ========================================================================
      */}
      {isPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-[28px] bg-[#131926] border border-white/15 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Crown className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-black text-white">Mpango wa Duka Poa</h3>
              <p className="text-xs text-slate-400 mt-1">
                Kifurushi chako cha sasa: <strong className="text-emerald-400">Starter Plan (Bure)</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1a2336] text-left text-xs space-y-2 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mauzo na Risiti zisizo na kikomo
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Usimamizi wa Stoo & Madeni
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Takwimu na Chati za Forex
              </div>
            </div>

            <button
              onClick={() => setIsPlanOpen(false)}
              className="w-full py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
            >
              Funga
            </button>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        MODAL 2: NOTIFICATIONS MODAL (Opened by Right Glass Circle)
        ========================================================================
      */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-[28px] bg-[#131926] border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-black text-white">Taarifa za Duka</h3>
              </div>
              <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-2xl bg-[#1a2336] text-xs space-y-1 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{n.title}</span>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{n.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
            >
              Funga
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
