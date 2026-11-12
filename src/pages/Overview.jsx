import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Package,
  HeartPulse,
  Sparkles,
  Activity,
} from 'lucide-react';
import { api } from '../config';

const cardClass =
  'rounded-[28px] border border-white/70 bg-white/65 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/55 dark:shadow-[0_18px_55px_rgba(0,0,0,0.28)]';

const innerCardClass =
  'rounded-2xl border border-white/70 bg-white/55 dark:border-white/10 dark:bg-white/[0.04]';

export default function Overview() {
  const [timeframe, setTimeframe] = useState('monthly');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const [data, setData] = useState({
    today_sales: 0,
    yesterday_sales: 0,
    sales_growth: 0,
    gross_profit: 0,
    total_customers: 0,
    customer_growth: 0,
    health_score: 78,
    net_worth: 0,
    category_breakdown: [],
    weekly_bars: [],
    sales_curve: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchRealData = async () => {
    try {
      const [analyticsRes, salesRes, productsRes] = await Promise.allSettled([
        api.get(`/analytics/economics/?period=${timeframe}`),
        api.get('/sales/'),
        api.get('/products/'),
      ]);

      const analyticsData =
        analyticsRes.status === 'fulfilled' && analyticsRes.value?.data
          ? analyticsRes.value.data
          : {};

      const salesData =
        salesRes.status === 'fulfilled' && salesRes.value?.data
          ? Array.isArray(salesRes.value.data)
            ? salesRes.value.data
            : salesRes.value.data.results || []
          : [];

      const productsData =
        productsRes.status === 'fulfilled' && productsRes.value?.data
          ? Array.isArray(productsRes.value.data)
            ? productsRes.value.data
            : productsRes.value.data.results || []
          : [];

      const totalSales = salesData.reduce(
        (sum, sale) =>
          sum + Number(sale.total_amount || sale.amount || 0),
        0
      );

      const calculatedNetWorth = productsData.reduce((sum, product) => {
        const price = Number(product.price || product.selling_price || 0);
        const quantity = Number(
          product.stock ?? product.stock_quantity ?? 0
        );
        return sum + price * quantity;
      }, 0);

      const dynamicCurve = salesData.slice(-7).map((sale, index) => ({
        date: sale.created_at
          ? new Date(sale.created_at).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            })
          : `Day ${index + 1}`,
        value: Number(sale.total_amount || sale.amount || 0),
      }));

      setData((previous) => ({
        ...previous,
        ...analyticsData,
        today_sales: analyticsData.today_sales || totalSales,
        total_customers:
          analyticsData.total_customers || salesData.length,
        today_tx_count: salesData.length,
        net_worth: analyticsData.net_worth || calculatedNetWorth,
        sales_curve: analyticsData.sales_curve?.length
          ? analyticsData.sales_curve
          : dynamicCurve,
      }));
    } catch (error) {
      console.warn('Real metrics fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();

    window.addEventListener('duka_sync', fetchRealData);
    window.addEventListener('focus', fetchRealData);

    const interval = setInterval(fetchRealData, 5000);

    return () => {
      window.removeEventListener('duka_sync', fetchRealData);
      window.removeEventListener('focus', fetchRealData);
      clearInterval(interval);
    };
  }, [timeframe]);

  const width = 650;
  const height = 180;
  const padX = 35;
  const padY = 30;

  const curveData = useMemo(() => {
    if (!data.sales_curve?.length) {
      return [
        { date: '1 Apr', value: 0 },
        { date: '8 Apr', value: 0 },
        { date: '15 Apr', value: 0 },
        { date: '22 Apr', value: 0 },
        { date: '30 Apr', value: 0 },
      ];
    }
    return data.sales_curve;
  }, [data.sales_curve]);

  const maxVal = Math.max(...curveData.map((point) => point.value), 20000);

  const points = useMemo(
    () =>
      curveData.map((point, index) => {
        const x =
          padX +
          (index / Math.max(1, curveData.length - 1)) *
            (width - padX * 2);
        const y =
          height -
          padY -
          (point.value / maxVal) * (height - padY * 2);

        return { ...point, x, y };
      }),
    [curveData, maxVal]
  );

  const curvePath = useMemo(
    () =>
      points.reduce((path, point, index, allPoints) => {
        if (index === 0) return `M ${point.x},${point.y}`;

        const previous = allPoints[index - 1];
        const controlX = previous.x + (point.x - previous.x) / 2;

        return `${path} C ${controlX},${previous.y} ${controlX},${point.y} ${point.x},${point.y}`;
      }, ''),
    [points]
  );

  const areaPath = useMemo(() => {
    if (!points.length) return '';

    return `${curvePath} L ${points[points.length - 1].x},${
      height - padY
    } L ${points[0].x},${height - padY} Z`;
  }, [curvePath, points]);

  const categoriesList = useMemo(() => {
    if (data.category_breakdown?.length) {
      return data.category_breakdown;
    }

    return [
      { name: 'Vinywaji', percent: 35, color: '#6366f1' },
      { name: 'Vyakula', percent: 25, color: '#38bdf8' },
      { name: 'Nafaka & Unga', percent: 20, color: '#10b981' },
      { name: 'Sabuni & Usafi', percent: 20, color: '#f59e0b' },
    ];
  }, [data.category_breakdown]);

  const weeklyBars = useMemo(() => {
    if (data.weekly_bars?.length) return data.weekly_bars;

    return [
      { day: 'Mon', value: 0 },
      { day: 'Tue', value: 0 },
      { day: 'Wed', value: 0 },
      { day: 'Thu', value: 0 },
      { day: 'Fri', value: 0 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 0 },
    ];
  }, [data.weekly_bars]);

  const maxBarVal = Math.max(...weeklyBars.map((bar) => bar.value), 1);
  const activePoint =
    hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  const money = (value) => Number(value || 0).toLocaleString();

  const metricCards = [
    {
      title: 'Total Users',
      value: money(data.total_customers),
      detail: `+${data.customer_growth || 0}%`,
      icon: Users,
      color:
        'border-indigo-200/70 bg-indigo-50/80 text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300',
      detailColor: 'text-emerald-600 dark:text-emerald-400',
      trend: <TrendingUp className="h-3.5 w-3.5" />,
    },
    {
      title: 'Sales (Mauzo)',
      value: `TZS ${money(data.today_sales)}`,
      detail:
        data.sales_growth >= 0
          ? `+${data.sales_growth || 0}%`
          : `${data.sales_growth}%`,
      icon: ShoppingCart,
      color:
        'border-blue-200/70 bg-blue-50/80 text-blue-600 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300',
      detailColor:
        data.sales_growth >= 0
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-rose-600 dark:text-rose-400',
      trend:
        data.sales_growth >= 0 ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" />
        ),
    },
    {
      title: 'Orders (Risiti)',
      value: money(data.today_tx_count || data.sales_curve?.length || 0),
      detail: 'Miamala Halisi',
      icon: Package,
      color:
        'border-purple-200/70 bg-purple-50/80 text-purple-600 dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-300',
      detailColor: 'text-blue-600 dark:text-blue-400',
      trend: <Activity className="h-3.5 w-3.5" />,
    },
    {
      title: 'Thamani Halisi (Net Worth)',
      value: `TZS ${money(data.net_worth)}`,
      detail: 'Stoo + Mauzo + Madeni',
      icon: Sparkles,
      color:
        'border-emerald-200/70 bg-emerald-50/80 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
      detailColor: 'text-slate-500 dark:text-slate-400',
      trend: null,
    },
  ];

  return (
    <main className="space-y-5 pb-28 font-sans text-slate-900 dark:text-slate-100">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className={`${cardClass} group relative flex items-center justify-between gap-3 overflow-hidden p-5 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_22px_60px_rgba(0,0,0,0.36)]`}
            >
              <div className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl" />

              <div className="relative min-w-0">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {metric.title}
                </p>

                <h2 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {metric.value}
                </h2>

                <span
                  className={`mt-1.5 flex items-center gap-1 text-[11px] font-bold ${metric.detailColor}`}
                >
                  {metric.trend}
                  {metric.detail}
                </span>
              </div>

              <div
                className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-inner transition-transform group-hover:scale-105 ${metric.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </article>
          );
        })}
      </section>

      <section className={`${cardClass} space-y-4 p-5 sm:p-7`}>
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/10 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex flex-wrap items-center gap-2 text-lg font-black tracking-tight text-slate-950 dark:text-white">
              Sales Overview
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                (
                {timeframe === 'monthly'
                  ? 'This Month'
                  : timeframe === 'weekly'
                    ? 'This Week'
                    : 'Today'}
                )
              </span>
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Mwelekeo halisi wa kiasi cha mauzo kilichokusanywa
            </p>
          </div>

          <select
            value={timeframe}
            onChange={(event) => setTimeframe(event.target.value)}
            className="rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-xs font-bold text-slate-800 outline-none transition hover:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        <div className="relative px-1 pb-2 pt-7">
          {activePoint && (
            <div
              className="pointer-events-none absolute top-0 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-xl border border-indigo-300/30 bg-indigo-600 px-3 py-1 text-[10px] font-black text-white shadow-lg shadow-indigo-600/25"
              style={{ left: `${(activePoint.x / width) * 100}%` }}
            >
              <span>{activePoint.date}:</span>
              <span>TZS {money(activePoint.value)}</span>
            </div>
          )}

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label="Sales overview chart"
          >
            <defs>
              <linearGradient
                id="overviewAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.38" />
                <stop offset="65%" stopColor="#8b5cf6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>

              <filter
                id="overviewLineGlow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="4"
                  floodColor="#818cf8"
                  floodOpacity="0.55"
                />
              </filter>
            </defs>

            {[0.2, 0.5, 0.8].map((ratio, index) => {
              const y = padY + ratio * (height - padY * 2);

              return (
                <line
                  key={index}
                  x1={padX}
                  y1={y}
                  x2={width - padX}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-700"
                  strokeDasharray="4 5"
                  strokeWidth="1"
                />
              );
            })}

            {points.length > 0 && (
              <path d={areaPath} fill="url(#overviewAreaGradient)" />
            )}

            {points.length > 0 && (
              <path
                d={curvePath}
                fill="none"
                stroke="#818cf8"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#overviewLineGlow)"
              />
            )}

            {points.map((point, index) => {
              const isSelected = activePoint?.date === point.date;

              return (
                <g
                  key={`${point.date}-${index}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onTouchStart={() => setHoveredIndex(index)}
                >
                  <rect
                    x={point.x - 20}
                    y={0}
                    width={40}
                    height={height}
                    fill="transparent"
                  />

                  {isSelected && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="8"
                      fill="#6366f1"
                      className="animate-ping opacity-30"
                    />
                  )}

                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isSelected ? '5.5' : '4'}
                    fill="#6366f1"
                    stroke="white"
                    strokeWidth="2"
                  />

                  <text
                    x={point.x}
                    y={height - 8}
                    textAnchor="middle"
                    className="fill-slate-500 font-mono text-[10px] font-bold dark:fill-slate-400"
                  >
                    {point.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className={`${cardClass} space-y-4 p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-3 dark:border-white/10">
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                Top Categories
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mgao wa bidhaa zilizopo stoo
              </p>
            </div>

            <span className="rounded-xl border border-indigo-200/70 bg-indigo-50/80 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-300/15 dark:bg-indigo-400/10 dark:text-indigo-300">
              This Month
            </span>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 pt-2 sm:flex-row">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="-rotate-90">
                {(() => {
                  let offset = 0;
                  const circumference = 238.7;

                  return categoriesList.map((category, index) => {
                    const percent = Number(category.percent || 0);
                    const strokeLength = (percent / 100) * circumference;
                    const dashArray = `${strokeLength} ${
                      circumference - strokeLength
                    }`;
                    const dashOffset = -offset;

                    offset += strokeLength;

                    return (
                      <circle
                        key={`${category.name}-${index}`}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={category.color}
                        strokeWidth="15"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                      />
                    );
                  });
                })()}
              </svg>

              <div className="absolute text-center">
                <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Total
                </span>
                <span className="text-sm font-black text-slate-950 dark:text-white">
                  100%
                </span>
              </div>
            </div>

            <div className="w-full flex-1 space-y-2.5">
              {categoriesList.map((category, index) => (
                <div
                  key={`${category.name}-${index}`}
                  className={`${innerCardClass} flex items-center justify-between gap-3 p-2.5`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {category.name}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-black text-slate-950 dark:text-white">
                    {category.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={`${cardClass} space-y-4 p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-3 dark:border-white/10">
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                Users Overview
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mzunguko wa siku 7 zilizopita
              </p>
            </div>

            <span className="rounded-xl border border-purple-200/70 bg-purple-50/80 px-2.5 py-1 text-xs font-bold text-purple-700 dark:border-purple-300/15 dark:bg-purple-400/10 dark:text-purple-300">
              This Week
            </span>
          </div>

          <div className="flex h-40 items-end justify-between gap-2 px-2 pt-4 sm:gap-3">
            {weeklyBars.map((bar, index) => {
              const value = Number(bar.value || 0);
              const barHeight =
                value > 0
                  ? Math.max(15, Math.round((value / maxBarVal) * 100))
                  : 6;
              const isHovered = hoveredBarIndex === index;

              return (
                <div
                  key={`${bar.day}-${index}`}
                  className="group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end gap-2"
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  onFocus={() => setHoveredBarIndex(index)}
                  onBlur={() => setHoveredBarIndex(null)}
                  tabIndex={0}
                  aria-label={`${bar.day}: TZS ${money(value)}`}
                >
                  {isHovered && (
                    <div className="absolute -top-7 z-10 whitespace-nowrap rounded-lg border border-purple-300/20 bg-purple-600 px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-lg">
                      TZS {money(value)}
                    </div>
                  )}

                  <div
                    className={`w-full max-w-6 rounded-t-xl transition-all duration-300 ${
                      value > 0
                        ? 'bg-gradient-to-t from-indigo-700 via-purple-600 to-indigo-400 shadow-lg shadow-indigo-600/20 group-hover:brightness-110'
                        : 'bg-slate-200 group-hover:bg-slate-300 dark:bg-slate-700 dark:group-hover:bg-slate-600'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />

                  <span className="text-[10px] font-mono font-bold text-slate-500 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">
                    {bar.day}
                  </span>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className={`${cardClass} space-y-4 p-5 sm:p-7`}>
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-3 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200/70 bg-emerald-50 text-emerald-600 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300">
              <HeartPulse className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-950 dark:text-white">
                Business Health
              </h2>
              <p className="text-[10px] italic text-slate-500 dark:text-slate-400">
                Illustrative score, live assessment from real data
              </p>
            </div>
          </div>

          <span className="rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 font-mono text-sm font-black text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-300">
            {data.health_score}/100
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-1 md:grid-cols-3">
          <article
            className={`${innerCardClass} space-y-1.5 p-4 transition hover:border-amber-300/70 dark:hover:border-amber-300/30`}
          >
            <h3 className="flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-300">
              <TrendingDown className="h-4 w-4" />
              Sales are steady
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Compare actual sales with the previous equivalent period to
              identify the change.
            </p>
          </article>

          <article
            className={`${innerCardClass} space-y-1.5 p-4 transition hover:border-blue-300/70 dark:hover:border-blue-300/30`}
          >
            <h3 className="flex items-center gap-1.5 text-xs font-black text-blue-700 dark:text-blue-300">
              <Package className="h-4 w-4" />
              Stock needs attention
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Identify products below their configured reorder levels and
              estimate replenishment needs.
            </p>
          </article>

          <article
            className={`${innerCardClass} space-y-1.5 p-4 transition hover:border-emerald-300/70 dark:hover:border-emerald-300/30`}
          >
            <h3 className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Recommended action
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Review your best-selling products and available margins before
              your next stock purchase.
            </p>
          </article>
        </div>
      </section>

      {loading && (
        <p className="sr-only" aria-live="polite">
          Loading dashboard data
        </p>
      )}
    </main>
  );
}
