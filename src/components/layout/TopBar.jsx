import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  Bot,
  User 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function FloatingBottomBar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const navItems = [
    { path: '/app', icon: Home, label: 'Muhtasari' },
    { path: '/app/pos', icon: ShoppingCart, label: 'POS' },
    { path: '/app/products', icon: Package, label: 'Stock' },
    { path: '/app/customers', icon: Users, label: 'Wateja' },
    { path: '/app/ai-manager', icon: Bot, label: 'AI Manager' },
  ];

  return (
    <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none select-none">
      {/* 
        Apple Liquid Glass Bottom Dock
        - Sits at the bottom on both desktop and mobile
        - Active bubble glow matching your VisionOS reference image
      */}
      <nav className="pointer-events-auto h-14 px-3 bg-white/80 dark:bg-[#151c28]/85 backdrop-blur-3xl border border-white/80 dark:border-slate-700/60 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center gap-1.5 transition-all">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => `
                relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300
                ${isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.25)] scale-[1.04]'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 active:scale-95'
                }
              `}
              title={item.label}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
            </NavLink>
          );
        })}

        {/* Titanium Grey Divider */}
        <div className="h-6 w-[1.5px] bg-slate-200/80 dark:bg-slate-700/60 mx-1"></div>

        {/* Profile Avatar Pill */}
        <button
          onClick={() => navigate('/app/profile')}
          className="w-10 h-10 rounded-full ring-2 ring-slate-200/80 dark:ring-slate-700 overflow-hidden flex items-center justify-center bg-slate-900 text-white font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Profaili Yako"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-white stroke-[2.2]" />
          )}
        </button>

      </nav>
    </div>
  );
}