import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  HeartPulse,
  Package,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { api } from '../config';

const money = (value) => Number(value || 0).toLocaleString();

const getList = (data) =>
  Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];

const getSaleAmount = (sale) =>
  Number(sale.total_amount ?? sale.amount ?? sale.total ?? 0);

const getSaleDate = (sale) => {
  const value = sale.created_at || sale.date || sale.timestamp;
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (date, options = { month: 'short', day: 'numeric' }) =>
  date.toLocaleDateString(undefined, options);

const cardClass =
  'relative overflow-hidden rounded-[28px] border border-white/70 bg-white/60 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/[0.09] dark:bg-slate-900/55 dark:shadow-[0_18px_60px_rgba(0,0,0,0.3)]';

const panelClass =
  'rounded-2xl border border-white/65 bg-white/45 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.035]';

export default function Overview() {
  const [timeframe, setTimeframe] = useState('monthly');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  const [data, setData] = useState({
    analytics: {},
    sales: [],
    products: [],
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setError('');

      const [analyticsResult, salesResult, productsResult] =
        await Promise.allSettled([
          api.get(`/analytics/economics/?period=${timeframe}`),
          api.get('/sales/'),
          api.get('/products/'),
        ]);

      const analytics =
        analyticsResult.status === 'fulfilled'
          ? analyticsResult.value?.data || {}
          : {};

      const sales =
        salesResult.status === 'fulfilled'
          ? getList(salesResult.value?.data)
          : [];

      const products =
        productsResult.status === 'fulfilled'
          ? getList(productsResult.value?.data)
          : [];

      if (
        analyticsResult.status === 'rejected' &&
        salesResult.status === 'rejected' &&
        productsResult.status === 'rejected'
      ) {
        setError('Taarifa hazikupatikana. Jaribu kusawazisha tena.');
      }

      setData({ analytics, sales, products });
      setLastUpdated(new Date());
    } catch (fetchError) {
      console.error('Dashboard data fetch failed:', fetchError);
      setError('Taarifa hazikupatikana. Jaribu kusawazisha tena.');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchDashboardData();

    const handleSync = () => fetchDashboardData();
    const handleFocus = () => fetchDashboardData();

    window.addEventListener('duka_sync', handleSync);
    window.addEventListener('duka_data_updated', handleSync);
    window.addEventListener('focus', handleFocus);

    const interval = window.setInterval(fetchDashboardData, 5000);

    return () => {
      window.removeEventListener('duka_sync', handleSync);
      window.removeEventListener('duka_data_updated', handleSync);
      window.removeEventListener('focus', handleFocus);
      window.clearInterval(interval);
    };
  }, [fetchDashboardData]);

  const salesForPeriod = useMemo(() => {
    const now = new Date();
    const start = new Date(now);

    if (timeframe === 'daily') {
      start.setHours(0, 0, 0, 0);
    } else if (timeframe === 'weekly') {
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }

    return data.sales.filter((sale) => {
      const date = getSaleDate(sale);
      return date && date >= start && date <= now;
    });
  }, [data.sales, timeframe]);

  const calculatedSales = useMemo(
    () =>
      salesForPeriod.reduce((total, sale) => total + getSaleAmount(sale), 0),
    [salesForPeriod]
  );

  const calculatedNetWorth = useMemo(
    () =>
      data.products.reduce((total, product) => {
        const price = Number(product.price ?? product.selling_price ?? 0);
        const quantity = Number(
          product.stock ?? product.stock_quantity ?? product.quantity ?? 0
        );
        return total + price * quantity;
      }, 0),
    [data.products]
  );

  const metricValues = useMemo(() => {
    const analytics = data.analytics || {};

    return {
      customers: Number(analytics.total_customers ?? 0),
      sales: Number(analytics.today_sales ?? calculatedSales),
      salesGrowth: Number(analytics.sales_growth ?? 0),
      customerGrowth: Number(analytics.customer_growth ?? 0),
      netWorth: Number(analytics.net_worth ?? calculatedNetWorth),
      healthScore: Number(analytics.health_score ?? 78),
    };
  }, [data.analytics, calculatedNetWorth, calculatedSales]);

  const chartData = useMemo(() => {
    const now = new Date();
    const days = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - offset);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const value = data.sales
        .filter((sale) => {
          const saleDate = getSaleDate(sale);
          return saleDate && saleDate >= date && saleDate < nextDay;
        })
        .reduce((sum, sale) => sum + getSaleAmount(sale), 0);

      days.push({
        date,
        label: formatDate(date),
        value,
      });
    }

    return days;
  }, [data.sales]);

  const categoriesList = useMemo(() => {
  if (Array.isArray(data.category_breakdown) && data.category_breakdown.length) {
    return data.category_breakdown;
  }

  const products = Array.isArray(data.products) ? data.products : [];
  if (products.length === 0) return [];

  const counts = new Map();

  products.forEach((product) => {
    const name =
      typeof product.category === 'string'
        ? product.category
        : product.category?.name || product.category_name || 'Nyingine';

    counts.set(name, (counts.get(name) || 0) + 1);
  });

  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  const colors = ['#8b7cff', '#55b6ff', '#35d6aa', '#ffbc66', '#f28bb8'];

  return [...counts.entries()].map(([name, count], index) => ({
    name,
    percent: Math.round((count / total) * 100),
    color: colors[index % colors.length],
  }));
}, [data.category_breakdown, data.products]);

  const chartWidth = 720;
  const chartHeight = 250;
  const chartPadding = { top: 24, right: 14, bottom: 38, left: 14 };

  const chartPoints = useMemo(() => {
    const maxValue = Math.max(...chartData.map((item) => item.value), 1);
    const usableWidth =
      chartWidth - chartPadding.left - chartPadding.right;
    const usableHeight =
      chartHeight - chartPadding.top - chartPadding.bottom;

    return chartData.map((item, index) => ({
      ...item,
      x:
        chartPadding.left +
        (index / Math.max(1, chartData.length - 1)) * usableWidth,
      y:
        chartPadding.top +
        usableHeight -
        (item.value / maxValue) * usableHeight,
    }));
  }, [chartData]);

  const curvePath = useMemo(
    () =>
      chartPoints.reduce((path, point, index, points) => {
        if (index === 0) return `M ${point.x} ${point.y}`;

        const previous = points[index - 1];
        const controlX = (previous.x + point.x) / 2;

        return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
      }, ''),
    [chartPoints]
  );

  const areaPath = useMemo(() => {
    if (!chartPoints.length) return '';

    const bottom = chartHeight - chartPadding.bottom;
    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];

    return `${curvePath} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
  }, [chartPoints, curvePath]);

  const maxDailySales = Math.max(...chartData.map((item) => item.value), 1);
  const activePoint =
    hoveredPoint !== null ? chartPoints[hoveredPoint] : chartPoints.at(-1);

  const metrics = [
    {
      label: 'Wateja',
      value: metricValues.customers.toLocaleString(),
      detail: `${metricValues.customerGrowth >= 0 ? '+' : ''}${metricValues.customerGrowth}%`,
      icon: Users,
      color: 'violet',
      positive: true,
    },
    {
      label: 'Mauzo',
      value: `TZS ${metricValues.sales.toLocaleString()}`,
      detail: `${metricValues.salesGrowth >= 0 ? '+' : ''}${metricValues.salesGrowth}%`,
      icon: TrendingUp,
      color: 'blue',
      positive: metricValues.salesGrowth >= 0,
    },
    {
      label: 'Thamani ya Stoo',
      value: `TZS ${metricValues.netWorth.toLocaleString()}`,
      detail: `${data.products.length.toLocaleString()} bidhaa`,
      icon: Wallet,
      color: 'green',
      positive: true,
    },
  ];

  const iconTone = {
    violet:
      'border-violet-200/70 bg-violet-100/75 text-violet-600 dark:border-violet-300/15 dark:bg-violet-400/10 dark:text-violet-300',
    blue:
      'border-blue-200/70 bg-blue-100/75 text-blue-600 dark:border-blue-300/15 dark:bg-blue-400/10 dark:text-blue-300',
    green:
      'border-emerald-200/70 bg-emerald-100/75 text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300',
  };

  return (
    <main className="relative isolate space-y-5 overflow-hidden px-3 pb-28 font-sans text-slate-900 dark:text-slate-100 sm:px-5">
      {/* Soft smoky color behind the dashboard */}
      <div className="pointer-events-none absolute -left-28 top-8 -z-10 h-72 w-72 rounded-full bg-violet-400/15 blur-[100px] dark:bg-violet-500/15" />
      <div className="pointer-events-none absolute -right-28 top-72 -z-10 h-80 w-80 rounded-full bg-cyan-300/15 blur-[110px] dark:bg-blue-500/10" />

      <header className={`${cardClass} p-5 sm:p-7`}>
        <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full bg-violet-400/15 blur-[80px] dark:bg-violet-400/10" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50/75 px-3 py-1 text-[11px] font-bold text-violet-700 dark:border-violet-300/15 dark:bg-violet-400/10 dark:text-violet-200">
              <Activity className="h-3.5 w-3.5" />
              Muhtasari wa biashara
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Karibu kwenye dashibodi
            </h1>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Mauzo na bidhaa zako zikisasishwa moja kwa moja.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/70 bg-white/65 px-4 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10"
            aria-label="Sasisha dashibodi"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Sasisha
          </button>
        </div>
      </header>

      {error && (
        <div
          role="status"
          className="rounded-2xl border border-amber-300/50 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 backdrop-blur-xl dark:border-amber-300/15 dark:bg-amber-400/10 dark:text-amber-100"
        >
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className={`${cardClass} group p-5 transition duration-300 hover:-translate-y-1`}
            >
              <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/60 blur-3xl dark:bg-white/[0.04]" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                    {metric.value}
                  </p>
                  <p
                    className={`mt-2 flex items-center gap-1 text-xs font-bold ${
                      metric.positive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {metric.positive ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {metric.detail}
                  </p>
                </div>

                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-inner transition-transform group-hover:scale-105 ${iconTone[metric.color]}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className={`${cardClass} p-4 sm:p-6`}>
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-400/10 blur-[90px] dark:bg-violet-400/10" />

        <div className="relative flex flex-col justify-between gap-4 border-b border-slate-200/70 pb-4 dark:border-white/10 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white sm:text-xl">
              Mwelekeo wa mauzo
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Mauzo ya siku saba zilizopita
              {lastUpdated && (
                <span className="ml-2">
                  · Imesasishwa {lastUpdated.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </p>
          </div>

          <label className="flex items-center gap-2 self-start rounded-xl border border-white/70 bg-white/55 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 sm:self-auto">
            Kipindi
            <select
              value={timeframe}
              onChange={(event) => setTimeframe(event.target.value)}
              className="cursor-pointer bg-transparent font-bold text-slate-900 outline-none dark:text-white"
            >
              <option value="daily">Leo</option>
              <option value="weekly">Wiki hii</option>
              <option value="monthly">Mwezi huu</option>
            </select>
          </label>
        </div>

        <div className="relative mt-5 rounded-2xl border border-white/60 bg-white/25 px-2 pb-2 pt-8 dark:border-white/[0.06] dark:bg-black/10 sm:px-4">
          {activePoint && (
            <div
              className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-xl border border-violet-300/30 bg-slate-900/85 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-xl dark:bg-white/15"
              style={{
                left: `${(activePoint.x / chartWidth) * 100}%`,
              }}
            >
              {activePoint.label}: TZS {money(activePoint.value)}
            </div>
          )}

          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto max-h-[300px] w-full overflow-visible"
            role="img"
            aria-label="Chati ya mauzo ya siku saba zilizopita"
          >
            <defs>
              <linearGradient
                id="salesSmokeFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#8b7cff" stopOpacity="0.4" />
                <stop offset="55%" stopColor="#5aaeff" stopOpacity="0.13" />
                <stop offset="100%" stopColor="#5aaeff" stopOpacity="0" />
              </linearGradient>

              <filter
                id="salesLineGlow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[0.25, 0.5, 0.75].map((ratio) => {
              const y =
                chartPadding.top +
                ratio *
                  (chartHeight -
                    chartPadding.top -
                    chartPadding.bottom);

              return (
                <line
                  key={ratio}
                  x1={chartPadding.left}
                  y1={y}
                  x2={chartWidth - chartPadding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 7"
                  className="text-slate-300/70 dark:text-white/10"
                />
              );
            })}

            <path d={areaPath} fill="url(#salesSmokeFill)" />

            <path
              d={curvePath}
              fill="none"
              stroke="#8b7cff"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#salesLineGlow)"
            />

            {chartPoints.map((point, index) => {
              const selected =
                hoveredPoint === index ||
                (hoveredPoint === null && index === chartPoints.length - 1);

              return (
                <g
                  key={`${point.label}-${index}`}
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onTouchStart={() => setHoveredPoint(index)}
                  onFocus={() => setHoveredPoint(index)}
                  onBlur={() => setHoveredPoint(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${point.label}: TZS ${money(point.value)}`}
                  className="cursor-pointer outline-none"
                >
                  <rect
                    x={point.x - 35}
                    y={0}
                    width="70"
                    height={chartHeight}
                    fill="transparent"
                  />

                  {selected && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="11"
                      fill="#8b7cff"
                      opacity="0.18"
                    />
                  )}

                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={selected ? 5 : 3.5}
                    fill="#a99cff"
                    stroke="white"
                    strokeWidth="2"
                  />

                  <text
                    x={point.x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="fill-slate-500 font-mono text-[11px] font-semibold dark:fill-slate-400"
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {chartData.every((item) => item.value === 0) && (
            <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs text-slate-500 dark:text-slate-400">
              Mauzo yataonekana hapa baada ya miamala kurekodiwa.
            </p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <article className={`${cardClass} p-5 sm:p-6 xl:col-span-3`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/10">
            <div>
              <h2 className="font-black text-slate-950 dark:text-white">
                Bidhaa kwa kundi
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Mgao wa bidhaa zilizosajiliwa kwenye stoo
              </p>
            </div>
            <Package className="h-5 w-5 text-violet-500 dark:text-violet-300" />
          </div>

          {categoryData.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
              Hakuna bidhaa za kuonyesha bado.
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 items-center gap-6 sm:grid-cols-[170px_1fr]">
              <div className="relative mx-auto h-40 w-40">
                <svg viewBox="0 0 100 100" className="-rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="13"
                    className="text-slate-200/80 dark:text-white/10"
                  />

                  {(() => {
                    const circumference = 2 * Math.PI * 38;
                    let offset = 0;

                    return categoryData.map((category, index) => {
                      const percent = Math.max(
                        0,
                        Math.min(100, Number(category.value || 0))
                      );
                      const length = (percent / 100) * circumference;
                      const dashOffset = -offset;
                      offset += length;

                      return (
                        <circle
                          key={`${category.name}-${index}`}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke={category.color}
                          strokeWidth="13"
                          strokeDasharray={`${length} ${circumference - length}`}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                        />
                      );
                    });
                  })()}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Bidhaa
                  </span>
                  <span className="text-xl font-black text-slate-950 dark:text-white">
                    {data.products.length}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {categoryData.map((category, index) => (
                  <div
                    key={`${category.name}-${index}`}
                    className={`${panelClass} flex items-center justify-between gap-3 px-3 py-2.5`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {category.name}
                      </span>
                    </div>

                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {category.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className={`${cardClass} p-5 sm:p-6 xl:col-span-2`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/10">
            <div>
              <h2 className="font-black text-slate-950 dark:text-white">
                Mauzo ya wiki
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Jumla kwa kila siku
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-blue-500 dark:text-blue-300" />
          </div>

          <div className="mt-6 flex h-48 items-end justify-between gap-2 sm:gap-3">
            {chartData.map((day, index) => {
              const heightPercent =
                day.value > 0
                  ? Math.max(8, (day.value / maxDailySales) * 100)
                  : 3;
              const isHovered = hoveredBar === index;

              return (
                <div
                  key={`${day.label}-${index}`}
                  className="group relative flex h-full min-w-0 flex-1 cursor-pointer flex-col items-center justify-end gap-2"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onFocus={() => setHoveredBar(index)}
                  onBlur={() => setHoveredBar(null)}
                  tabIndex={0}
                  aria-label={`${day.label}: TZS ${money(day.value)}`}
                >
                  {isHovered && (
                    <div className="absolute -top-7 z-10 whitespace-nowrap rounded-lg border border-white/15 bg-slate-900/90 px-2 py-1 text-[9px] font-bold text-white shadow-lg backdrop-blur-xl">
                      TZS {money(day.value)}
                    </div>
                  )}

                  <div
                    className="w-full max-w-8 rounded-t-xl bg-gradient-to-t from-violet-600 via-indigo-500 to-sky-300 shadow-[0_0_20px_rgba(99,102,241,0.22)] transition-all duration-300 group-hover:brightness-110 dark:from-violet-500 dark:via-indigo-400 dark:to-sky-200"
                    style={{ height: `${heightPercent}%` }}
                  />

                  <span className="max-w-full truncate text-[9px] font-semibold text-slate-500 dark:text-slate-400 sm:text-[10px]">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className={`${cardClass} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200/70 bg-emerald-50 text-emerald-600 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-950 dark:text-white">
                Afya ya biashara
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Muhtasari wa hali ya biashara yako
              </p>
            </div>
          </div>

          <span className="rounded-full border border-emerald-200/70 bg-emerald-50/75 px-3 py-1.5 text-sm font-black text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300">
            {metricValues.healthScore}/100
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className={`${panelClass} p-4`}>
            <p className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
              <TrendingDown className="h-4 w-4" />
              Fuatilia mwenendo wa mauzo
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Linganisha mauzo ya kipindi hiki na kipindi kilichopita ili
              kuelewa mabadiliko.
            </p>
          </div>

          <div className={`${panelClass} p-4`}>
            <p className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Package className="h-4 w-4" />
              Kagua bidhaa za stoo
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Angalia kiasi cha bidhaa na panga ununuzi wa bidhaa
              zinazohitajika.
            </p>
          </div>

          <div className={`${panelClass} p-4`}>
            <p className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Hatua inayopendekezwa
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Kagua bidhaa zinazouzwa zaidi pamoja na faida kabla ya
              kuongeza stoo.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
