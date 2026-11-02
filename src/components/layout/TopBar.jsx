import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';
import logo from '../../assets/logo copy.jpeg';

export default function TopBar() {
  const { lang, toggleLang } = useLanguageStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 p-2.5 md:p-3.5 pb-1 w-full pointer-events-none">
      {/* 
        Apple Floating Liquid Glass Island with Subtle Grey Palette
        - Translucent frosted glass (bg-white/75 + backdrop-blur-2xl)
        - Soft grey contour border (border-slate-200/60)
        - Specular top reflection (inset_0_1px_2px_rgba(255,255,255,0.95))
      */}
      <div className="pointer-events-auto h-14 md:h-16 rounded-[24px] bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_12px_32px_rgba(15,23,42,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] px-3.5 md:px-5 flex items-center justify-between gap-3 transition-all">
        
        {/* Brand / Logo Capsule (Visible especially when sidebar collapses) */}
        <div 
          onClick={() => navigate('/app')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100/90 border border-slate-200/70 p-1 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
            <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm tracking-tight hidden sm:inline">
            Duka Pooa
          </span>
        </div>

        {/* Apple Spotlight Search Capsule (Grey Palette Fill) */}
        <div className="flex-1 max-w-xs md:max-w-sm mx-2 hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Tafuta bidhaa, mteja, muamala..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/50 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
            />
          </div>
        </div>

        {/* Right Action Icons & Grey Palette Pills */}
        <div className="flex items-center gap-2 md:gap-2.5">
          
          {/* Language Switcher Pill */}
          <button 
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-full border border-slate-200/80 text-[11px] font-black text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Badili Lugha"
          >
            {lang === 'sw' ? 'SW 🇹🇿' : 'EN 🇬🇧'}
          </button>

          {/* Notifications Button (Grey Frosted Squircle) */}
          <button 
            className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/70 text-slate-600 hover:text-slate-900 flex items-center justify-center relative transition-all active:scale-95 shadow-xs cursor-pointer"
            title="Taarifa"
          >
            <Bell className="w-4 h-4 stroke-[2]" />
            {/* Live Indicator Dot */}
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </button>
          
          {/* Subtle Grey Divider */}
          <div className="h-5 w-[1px] bg-slate-200/80 mx-0.5"></div>

          {/* User Profile Ring */}
          <button 
            onClick={() => navigate('/app/profile')}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-200 hover:ring-slate-400/80 flex items-center justify-center bg-slate-900 text-white font-black text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Profaili Yako"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-white stroke-[2.2]" />
            )}
          </button>

        </div>

      </div>
    </header>
  );
}