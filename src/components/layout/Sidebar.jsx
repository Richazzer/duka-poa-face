import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, DollarSign, 
  Users, Bot, BarChart3, Shield, Settings, Truck 
} from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import logo from '../../assets/logo copy.jpeg';

export default function Sidebar() {
  const { t } = useLanguageStore();

  const navItems = [
    { path: '/app', label: t('overview'), icon: LayoutDashboard },
    { path: '/app/pos', label: 'POS', icon: ShoppingCart },
    { path: '/app/products', label: 'Stock', icon: Package },
    { path: '/app/purchasing', label: 'Ununuzi', icon: Truck },
    { path: '/app/money', label: 'Pesa', icon: DollarSign },
    { path: '/app/customers', label: 'Wateja', icon: Users },
    { path: '/app/ai-manager', label: 'AI', icon: Bot, highlight: true },
    { path: '/app/reports', label: 'Ripoti', icon: BarChart3 },
    { path: '/app/staff', label: 'Wafanyakazi', icon: Shield },
    { path: '/app/settings', label: 'Mipangilio', icon: Settings }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-700 border-r border-slate-200">
      <div className="p-4 md:p-6 border-b border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-xs p-1 shrink-0">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="hidden lg:block">
          <h1 className="font-black text-slate-900 tracking-tight text-base leading-none">Duka Pooa</h1>
          <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mt-1 block">Smart POS</span>
        </div>
      </div>

      <nav className="flex-1 p-2 md:p-3.5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-white text-slate-950 font-bold shadow-sm border border-slate-200' 
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'}
              `}
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-500" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 hidden lg:block">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 shadow-xs">
          <p className="font-bold text-slate-800">Django API</p>
          <p className="mt-0.5 text-[10px]">Offline Mode Ready</p>
        </div>
      </div>
    </div>
  );
}