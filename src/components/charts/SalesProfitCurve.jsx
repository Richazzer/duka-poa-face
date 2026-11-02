import React, { useState } from 'react';

export default function SalesProfitCurve({ data = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 220;
  const padding = 25;

  const maxSales = Math.max(...data.map((d) => d.sales), 100000);

  // Map data to SVG coordinate space
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const ySales = height - padding - (d.sales / maxSales) * (height - padding * 2);
    const yProfit = height - padding - (d.profit / maxSales) * (height - padding * 2);
    return { ...d, x, ySales, yProfit };
  });

  // Calculate smooth cubic Bezier path
  const createSmoothPath = (pts, key) => {
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt[key]}`;
      const prev = arr[i - 1];
      const cp1x = prev.x + (pt.x - prev.x) / 2;
      const cp1y = prev[key];
      const cp2x = prev.x + (pt.x - prev.x) / 2;
      const cp2y = pt[key];
      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt[key]}`;
    }, '');
  };

  const salesLine = createSmoothPath(points, 'ySales');
  const profitLine = createSmoothPath(points, 'yProfit');

  // Closed area paths for gradient shading
  const salesArea = `${salesLine} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;
  const profitArea = `${profitLine} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div className="relative w-full select-none">
      {/* Interactive Tooltip Badge */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none -top-10 transition-all duration-150 transform -translate-x-1/2 bg-slate-900/90 dark:bg-slate-800/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg text-[11px]"
          style={{ left: `${(hoveredPoint.x / width) * 100}%` }}
        >
          <div className="font-bold flex items-center gap-2">
            <span>{hoveredPoint.time}</span>
            <span className="text-blue-400">Mauzo: TZS {hoveredPoint.sales.toLocaleString()}</span>
            <span className="text-emerald-400">Faida: TZS {hoveredPoint.profit.toLocaleString()}</span>
          </div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <defs>
          {/* Sales Blue Gradient */}
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>

          {/* Profit Green Gradient */}
          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Faint Horizontal Guide Lines */}
        {[0.25, 0.5, 0.75].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + ratio * (height - padding * 2)}
            x2={width - padding}
            y2={padding + ratio * (height - padding * 2)}
            stroke="currentColor"
            className="text-slate-200/50 dark:text-slate-800/60"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        ))}

        {/* Shaded Area Paths */}
        <path d={salesArea} fill="url(#salesGrad)" />
        <path d={profitArea} fill="url(#profitGrad)" />

        {/* Smooth Curves */}
        <path d={salesLine} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        <path d={profitLine} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

        {/* Interactive Data Nodes */}
        {points.map((pt, i) => (
          <g
            key={i}
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredPoint(pt)}
            onTouchStart={() => setHoveredPoint(pt)}
          >
            {/* Invisible large hit area for easy finger-tapping on mobile */}
            <rect x={pt.x - 15} y={0} width={30} height={height} fill="transparent" />

            {/* Sales Point */}
            <circle
              cx={pt.x}
              cy={pt.ySales}
              r={hoveredPoint?.time === pt.time ? 5 : 3}
              fill="#3b82f6"
              className="transition-all duration-150"
            />
            {/* Profit Point */}
            <circle
              cx={pt.x}
              cy={pt.yProfit}
              r={hoveredPoint?.time === pt.time ? 4.5 : 2.5}
              fill="#10b981"
              className="transition-all duration-150"
            />
          </g>
        ))}

        {/* X-Axis Time Labels */}
        {points.map((pt, i) => (
          <text
            key={i}
            x={pt.x}
            y={height - 5}
            textAnchor="middle"
            className="text-[10px] fill-slate-400 font-semibold"
          >
            {pt.time}
          </text>
        ))}
      </svg>
    </div>
  );
}