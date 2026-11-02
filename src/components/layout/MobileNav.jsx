import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, DollarSign, Menu } from 'lucide-react';

export default function MobileNav() {
  const items = [
    { path: '/app', label: 'Home', icon: LayoutDashboard },
    { path: '/app/pos', label: 'POS', icon: ShoppingCart },
    { path: '/app/products', label: 'Stock', icon: Package },
    { path: '/app/money', label: 'Pesa', icon: DollarSign },
    { path: '/app/menu', label: 'Menyu', icon: Menu }
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
      {/* 
        Apple Liquid Glassmorphism Floating Capsule 
        - pointer-events-auto re-enables clicks only on the bar itself
      */}
      <nav className="pointer-events-auto w-full max-w-[420px] bg-white/75 backdrop-blur-2xl border border-white/80 rounded-full p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-between gap-1 transition-all">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-full transition-all duration-300 select-none
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-[0_4px_16px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 active:scale-95'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={`w-[18px] h-[18px] transition-transform duration-200 ${isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'}`} 
                  />
                  <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}