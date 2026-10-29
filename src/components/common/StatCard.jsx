import React from 'react';
import Card from './Card';
import { useThemeStore } from '../../store/useThemeStore';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendLabel }) {
  const { theme } = useThemeStore();

  return (
    <Card className="hover:border-slate-300 transition-all transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className={`text-2xl font-black mt-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${
            theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-600 font-bold">{trend}</span>
          <span className="text-slate-400 font-normal">{trendLabel}</span>
        </div>
      )}
    </Card>
  );
}