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
    <nav className="flex items-center justify-around h-16 px-1 bg-white/80 backdrop-blur-2xl border-t border-slate-200/80 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-bold transition-all
              ${isActive 
                ? 'bg-slate-200/80 text-slate-950 font-black border-t-2 border-slate-900 shadow-inner' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'}
            `}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}