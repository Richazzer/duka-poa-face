import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, DollarSign, 
  Users, Bot, BarChart3, Shield, Settings, Truck, Sparkles 
} from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import logo from '../../assets/logo copy.jpeg';

export default function Sidebar() {
  const { t } = useLanguageStore();

  const navItems = [
    { path: '/app', label: t('overview') || 'Muhtasari', icon: LayoutDashboard },
    { path: '/app/pos', label: 'POS', icon: ShoppingCart },
    { path: '/app/products', label: 'Stock', icon: Package },
    { path: '/app/purchasing', label: 'Ununuzi', icon: Truck },
    { path: '/app/money', label: 'Pesa', icon: DollarSign },
    { path: '/app/customers', label: 'Wateja', icon: Users },
    { path: '/app/ai-manager', label: 'AI Manager', icon: Bot, highlight: true },
    { path: '/app/reports', label: 'Ripoti', icon: BarChart3 },
    { path: '/app/staff', label: 'Wafanyakazi', icon: Shield },
    { path: '/app/settings', label: 'Mipangilio', icon: Settings }
  ];

  return (
    <aside className="h-screen p-3 md:p-3.5 flex flex-col shrink-0 select-none pointer-events-none sticky top-0 z-40">
      
      {/* 
        Apple Floating Liquid Glass Island
        - Translucent frosted glass (bg-white/75 + backdrop-blur-2xl)
        - Specular top highlight & soft 3D ambient shadow
      */}
      <div className="pointer-events-auto flex flex-col h-full w-[70px] lg:w-[245px] rounded-[30px] bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_18px_45px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] overflow-hidden transition-all duration-300">
        
        {/* Brand Header */}
        <div className="p-4 lg:p-5 flex items-center gap-3 border-b border-slate-100/60">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 p-1.5 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.04)] shrink-0 transition-transform hover:scale-105">
            <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          
          <div className="hidden lg:block overflow-hidden">
            <h1 className="font-black text-slate-900 tracking-tight text-base leading-none truncate">
              Duka Pooa
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                Smart POS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 lg:p-3 space-y-1.5 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                title={item.label}
                className={({ isActive }) => `
                  relative group flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-slate-900 text-white font-bold shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_1px_rgba(255,255,255,0.25)] scale-[1.01]' 
                    : item.highlight
                      ? 'bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 text-blue-700 hover:from-blue-500/15 hover:to-purple-500/15 border border-blue-200/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 active:scale-[0.98]'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="shrink-0 flex items-center justify-center">
                      <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive 
                          ? 'text-white stroke-[2.2]' 
                          : item.highlight 
                            ? 'text-blue-600' 
                            : 'text-slate-500 group-hover:text-slate-900'
                      }`} />
                    </div>

                    <span className="hidden lg:block truncate tracking-tight flex-1">
                      {item.label}
                    </span>

                    {/* AI Sparkle Badge */}
                    {item.highlight && !isActive && (
                      <span className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100/70 text-[9px] font-extrabold text-blue-600 tracking-wide">
                        <Sparkles className="w-2.5 h-2.5" /> NEW
                      </span>
                    )}

                    {/* Liquid Active Dot for Collapsed View */}
                    {isActive && (
                      <span className="lg:hidden absolute right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Floating Glass Card (Django Sync & Offline Status) */}
        <div className="p-3 border-t border-slate-100/60 hidden lg:block">
          <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-between">
            <div>
              <p className="font-extrabold text-slate-900 text-xs tracking-tight">
                Django API
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                Offline Mode Ready
              </p>
            </div>
            
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"></div>
          </div>
        </div>

      </div>
    </aside>
  );
}