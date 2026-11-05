import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SalesProfitCurve({ data = [], timeframe = '1H' }) {
  const [hoveredCandle, setHoveredCandle] = useState(null);

  // 1. Process Real Data
  const candles = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
      const sales = Math.round(Number(item.sales || 0));
      const profit = Math.round(Number(item.profit || sales * 0.22));
      
      // Proportional candlestick levels for periods with sales
      const open = sales > 0 ? Math.round(sales * 0.92) : 0;
      const close = sales;
      const high = sales > 0 ? Math.round(sales * 1.05) : 0;
      const low = sales > 0 ? Math.round(sales * 0.88) : 0;
      const isGreen = close >= open;

      return {
        time: item.time,
        open,
        high,
        low,
        close,
        sales,
        profit,
        isGreen,
        hasData: sales > 0
      };
    });
  }, [data]);

  const width = 680;
  const height = 280;
  const paddingLeft = 25;
  const paddingRight = 75; // Space for right Y-axis
  const paddingTop = 35;
  const paddingBottom = 40;

  // 2. Dynamic Scale Calculation (Guaranteed to contain ALL sales and profit points)
  const allValues = candles.flatMap((c) => [c.sales, c.high, c.close, c.profit]);
  const maxPrice = Math.max(...allValues, 50000);
  const minPrice = 0;
  const priceRange = maxPrice - minPrice || 1;

  // 3. Clamped Coordinate Mapper (NEVER produces negative or out-of-bounds Y coordinates!)
  const getY = (val) => {
    const num = Number(val) || 0;
    const clamped = Math.max(minPrice, Math.min(num, maxPrice));
    return height - paddingBottom - ((clamped - minPrice) / priceRange) * (height - paddingTop - paddingBottom);
  };

  const getX = (idx) =>
    paddingLeft + (idx / Math.max(1, candles.length - 1)) * (width - paddingLeft - paddingRight);

  // 4. Smooth Profit Growth Line (Glides naturally through the chart)
  const profitPoints = candles.map((c, i) => ({
    x: getX(i),
    y: getY(c.profit),
    profit: c.profit,
    sales: c.sales,
    time: c.time,
    hasData: c.hasData
  }));

  const profitLinePath = profitPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
  }, '');

  // Current real price
  const activeCandles = candles.filter(c => c.hasData);
  const lastActive = activeCandles.length > 0 ? activeCandles[activeCandles.length - 1] : candles[candles.length - 1];
  const currentPrice = lastActive?.close || 0;
  const currentY = getY(currentPrice);
  const isMarketBullish = currentPrice > 0;
  const activeCandle = hoveredCandle || lastActive;

  return (
    <div className="relative w-full select-none font-sans bg-[#0c1017] p-4 sm:p-6 rounded-[28px] border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* 
        ========================================================================
        FOREX TICKER HEADER: e.g. DUKA/TZS • 1M
        ========================================================================
      */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-black text-slate-200">
            <span className={`w-2 h-2 rounded-full ${isMarketBullish ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
            DUKA / TZS • {timeframe}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono font-bold text-slate-400">
            <span>O: <strong className="text-white">TZS {activeCandle?.open?.toLocaleString() || 0}</strong></span>
            <span>H: <strong className="text-emerald-400">TZS {activeCandle?.high?.toLocaleString() || 0}</strong></span>
            <span>L: <strong className="text-rose-400">TZS {activeCandle?.low?.toLocaleString() || 0}</strong></span>
            <span>C: <strong className="text-white">TZS {activeCandle?.close?.toLocaleString() || 0}</strong></span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Mauzo Juu
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Mauzo Chini
          </span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-3 h-0.5 bg-blue-500"></span> Ukuaji wa Faida
          </span>
        </div>
      </div>

      {/* Tooltip on Hover */}
      {hoveredCandle && (
        <div 
          className="absolute z-20 pointer-events-none -top-2 transition-all duration-75 transform -translate-x-1/2 bg-[#151c28]/95 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 shadow-2xl text-[11px]"
          style={{ left: `${(getX(candles.indexOf(hoveredCandle)) / width) * 100}%` }}
        >
          <p className="text-slate-400 font-bold">{hoveredCandle.time}</p>
          <p className="font-black text-sm text-white">Mauzo: TZS {hoveredCandle.close.toLocaleString()}</p>
          <p className="font-bold text-blue-400">Faida: TZS {hoveredCandle.profit.toLocaleString()}</p>
        </div>
      )}

      {/* 
        ========================================================================
        SVG CANVAS (Strictly clipped with overflow-hidden)
        ========================================================================
      */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-hidden"
        onMouseLeave={() => setHoveredCandle(null)}
      >
        <defs>
          <filter id="profitGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Horizontal Support/Resistance Grid Lines */}
        {[0.15, 0.4, 0.65, 0.9].map((ratio, i) => {
          const val = Math.round(maxPrice - ratio * priceRange);
          const y = paddingTop + ratio * (height - paddingTop - paddingBottom);

          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={width - paddingRight + 8}
                y={y + 3}
                className="text-[9px] font-mono fill-slate-500 font-bold"
              >
                {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
              </text>
            </g>
          );
        })}

        {/* 2. Candlesticks */}
        {candles.map((candle, idx) => {
          const cx = getX(idx);
          const yOpen = getY(candle.open);
          const yClose = getY(candle.close);
          const yHigh = getY(candle.high);
          const yLow = getY(candle.low);
          const candleTop = Math.min(yOpen, yClose);
          const candleHeight = Math.max(3, Math.abs(yClose - yOpen));
          const candleColor = candle.isGreen ? '#10b981' : '#f43f5e';
          const candleWidth = 12;

          return (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredCandle(candle)}
              onTouchStart={() => setHoveredCandle(candle)}
            >
              {/* Touch Trigger */}
              <rect
                x={cx - 16}
                y={paddingTop}
                width={32}
                height={height - paddingTop - paddingBottom}
                fill="transparent"
              />

              {candle.hasData ? (
                <>
                  {/* Wicks */}
                  <line
                    x1={cx}
                    y1={yHigh}
                    x2={cx}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Candle Body */}
                  <rect
                    x={cx - candleWidth / 2}
                    y={candleTop}
                    width={candleWidth}
                    height={candleHeight}
                    fill={candleColor}
                    rx="1.5"
                    className="transition-all duration-150 hover:brightness-125"
                  />
                </>
              ) : (
                /* Zero Baseline Dot */
                <circle cx={cx} cy={height - paddingBottom} r="2" fill="#334155" />
              )}
            </g>
          );
        })}

        {/* 3. Smooth Blue Profit Growth Line (Now cleanly overlayed without spikes!) */}
        {currentPrice > 0 && (
          <path
            d={profitLinePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#profitGlow)"
          />
        )}

        {/* 4. Dashed Price Line & Right Green Ticker Tag */}
        <line
          x1={paddingLeft}
          y1={currentY}
          x2={width - paddingRight}
          y2={currentY}
          stroke={isMarketBullish ? '#10b981' : '#64748b'}
          strokeDasharray="3 3"
          strokeWidth="1.5"
          className="opacity-80"
        />

        <g transform={`translate(${width - paddingRight + 4}, ${currentY - 10})`}>
          <rect
            width="65"
            height="20"
            rx="4"
            fill={isMarketBullish ? '#10b981' : '#475569'}
            className="shadow-md"
          />
          <text
            x="32"
            y="13"
            textAnchor="middle"
            className="text-[10px] font-mono font-black fill-white"
          >
            TZS {currentPrice >= 1000 ? `${(currentPrice / 1000).toFixed(0)}k` : currentPrice}
          </text>
        </g>

        {/* 5. Clean X-Axis Months (Fixed: Overlapping 'Time' label removed) */}
        {candles.map((candle, idx) => (
          <text
            key={idx}
            x={getX(idx)}
            y={height - 12}
            textAnchor="middle"
            className="text-[10px] font-mono fill-slate-400 font-semibold"
          >
            {candle.time}
          </text>
        ))}

        {/* Right Y-Axis Header Label */}
        <text
          x={width - paddingRight + 8}
          y={paddingTop - 12}
          className="text-[9px] font-bold uppercase tracking-wider fill-slate-400"
        >
          PRICE (TZS)
        </text>
      </svg>

    </div>
  );
}