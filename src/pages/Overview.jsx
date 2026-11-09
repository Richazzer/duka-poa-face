import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { api, getErrorMessage } from '../services/api';
import { useNavigate } from 'react-router-dom';
import SalesProfitCurve from '../components/charts/SalesProfitCurve';
import {
  Plus,
  RefreshCw,
  Receipt,
  Sparkles,
  AlertTriangle
} from 'lucide-react';


// =====================================================================
// CONSTANTS
// =====================================================================
const PERIOD_KEY = 'duka_overview_period';
const CACHE_KEY = 'duka_overview_cache_v2'; // { [period]: { data, ts } }
const LEGACY_CACHE_KEY = 'duka_cached_overview'; // old single-period cache (removed on load)
const DEFAULT_PERIOD = 'yearly';
const STALE_AFTER_MS = 60 * 1000; // refresh on tab focus if data is older than this

const TIME_OPTIONS = [
  { id: 'daily', label: 'Leo (1D)' },
  { id: 'weekly', label: 'Wiki (7D)' },
  { id: 'monthly', label: 'Mwezi (30D)' },
  { id: 'yearly', label: 'Mwaka (1Y)' }
];

const PERIOD_LABELS = {
  daily: 'Leo (Today)',
  weekly: 'Wiki Hii (7D)',
  monthly: 'Mwezi Huu (30D)',
  yearly: 'Mwaka Huu (1Y)'
};

const PERIOD_TIMEFRAMES = {
  daily: '1H',
  weekly: '1D',
  monthly: '1W',
  yearly: '1M'
};

// =====================================================================
// SAFE LOCAL STORAGE HELPERS (storage can throw in private mode / when full)
// =====================================================================
const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore: cache is only an optimisation */
  }
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

const readStoredPeriod = () => {
  const saved = safeGet(PERIOD_KEY);
  return TIME_OPTIONS.some((o) => o.id === saved) ? saved : DEFAULT_PERIOD;
};

const readCacheMap = () => {
  try {
    const parsed = JSON.parse(safeGet(CACHE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const readCache = (period) => {
  const entry = readCacheMap()[period];
  return entry && entry.data && typeof entry.data === 'object' ? entry : null;
};

const writeCache = (period, data) => {
  const map = readCacheMap();
  map[period] = { data, ts: Date.now() };
  safeSet(CACHE_KEY, JSON.stringify(map));
};

// Lets the server group sales by the shop's own local day (any country / timezone)
const getTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};

const money = (v) => (Number(v) || 0).toLocaleString();

const formatTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Overview() {
  const navigate = useNavigate();

  // 1. Remember user's selected period across tab switches
  const [period, setPeriod] = useState(readStoredPeriod);

  // 2. Show the cached data for THIS period instantly (stale-while-revalidate).
  //    `null` means "nothing yet", so we show a placeholder instead of fake zeros.
  const [cacheEntry, setCacheEntry] = useState(() => {
    safeRemove(LEGACY_CACHE_KEY);
    return readCache(readStoredPeriod());
  });
  const data = cacheEntry?.data ?? null;
  const updatedAt = cacheEntry?.ts ?? null;

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Refs: protect against out-of-order responses and updates after unmount
  const requestIdRef = useRef(0);
  const controllerRef = useRef(null);
  const lastFetchRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  // 3. Fetch fresh live data from Django.
  //    Only the newest request can update the screen, so quickly switching
  //    periods can never show Monthly numbers under the Weekly button.
  const fetchLiveMetrics = useCallback(async (selectedPeriod) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const requestId = ++requestIdRef.current;

    setRefreshing(true);
    setError('');

    try {
      const res = await api.get('/analytics/economics/', {
        params: { period: selectedPeriod, tz: getTimeZone() },
        signal: controller.signal
      });

      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      if (!res.data || typeof res.data !== 'object' || Array.isArray(res.data)) {
        throw new Error('Invalid analytics response');
      }

      lastFetchRef.current = Date.now();
      writeCache(selectedPeriod, res.data);
      setCacheEntry({ data: res.data, ts: lastFetchRef.current });
    } catch (err) {
      if (axios.isCancel(err)) return;
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      console.warn('Live metrics fetch error:', err);
      setError(getErrorMessage(err, 'Imeshindikana kusasisha takwimu.'));
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setRefreshing(false);
      }
    }
  }, []);

  // Single place that triggers loading: on mount and whenever the period changes
  useEffect(() => {
    fetchLiveMetrics(period);
  }, [period, fetchLiveMetrics]);

  // Refresh when the user comes back to the tab and the data is getting old
  useEffect(() => {
    const onVisible = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastFetchRef.current > STALE_AFTER_MS
      ) {
        fetchLiveMetrics(period);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [period, fetchLiveMetrics]);

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === period) return;
    safeSet(PERIOD_KEY, newPeriod);
    setCacheEntry(readCache(newPeriod)); // show this period's cache (or placeholder) right away
    setError('');
    setPeriod(newPeriod); // the effect above fetches fresh data
  };

  const loaded = data !== null;
  const show = (value) => (loaded ? money(value) : '—');
  const periodLabel = data?.period || PERIOD_LABELS[period];
  const trend = Array.isArray(data?.hourly_trend) ? data.hourly_trend : [];
  const timeframe = data?.ticker_timeframe || PERIOD_TIMEFRAMES[period];

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
            TZS {show(data?.net_worth)}
          </h2>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1">
            Inajumuisha thamani ya bidhaa zote stoo, mauzo yaliyokusanywa na madeni ya wateja unayodai.
            {updatedAt ? ` Imesasishwa ${formatTime(updatedAt)}.` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 relative z-10">
          <button
            onClick={() => fetchLiveMetrics(period)}
            disabled={refreshing}
            className="p-3.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
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

      {/* Error Banner: tells the owner when numbers may be out of date */}
      {error && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-[20px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
              {error}{' '}
              {loaded
                ? `Takwimu unazoona zinaweza kuwa za zamani${updatedAt ? ` (${formatTime(updatedAt)})` : ''}.`
                : 'Hakuna takwimu zilizohifadhiwa bado.'}
            </p>
          </div>
          <button
            onClick={() => fetchLiveMetrics(period)}
            disabled={refreshing}
            className="shrink-0 py-1.5 px-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          >
            Jaribu Tena
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Mauzo ({periodLabel})
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            TZS {show(data?.today_sales)}
          </h3>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 inline-flex items-center gap-1">
            <Receipt className="w-3 h-3" /> {loaded ? Number(data.today_tx_count) || 0 : '—'} Risiti Zilizotoka
          </span>
        </div>

        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Makadirio ya Faida
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            TZS {show(data?.today_profit)}
          </h3>
          <span className="text-[10px] font-bold text-slate-400 mt-2 block">
            Makadirio ya ~22% ya mauzo
          </span>
        </div>

        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Madeni ya Wateja
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-amber-500 mt-1">
            TZS {show(data?.today_debt)}
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
            {loaded ? Number(data.low_stock_count) || 0 : '—'} Bidhaa
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
              Mwelekeo wa Mauzo na Faida ({periodLabel})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ulinganisho halisi wa kiasi kilichorekodiwa kulingana na muda uliouchagua
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 self-start sm:self-auto">
            {TIME_OPTIONS.map((opt) => (
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
          <SalesProfitCurve data={trend} timeframe={timeframe} />
        </div>

      </div>

    </div>
  );
}
