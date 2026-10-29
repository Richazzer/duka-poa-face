import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Globe, User } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';
import logo from '../../assets/logo copy.jpeg';

export default function TopBar() {
  const { lang, toggleLang } = useLanguageStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-slate-200 bg-slate-100/90 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-black text-slate-900 text-sm tracking-tight hidden sm:inline">Duka Pooa</span>
      </div>

      <div className="flex-1 max-w-xs mx-3 hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tafuta..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-slate-400 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={toggleLang}
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-extrabold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-xs"
        >
          {lang === 'sw' ? 'SW 🇹🇿' : 'EN 🇬🇧'}
        </button>

        <button className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl relative cursor-pointer">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-500"></span>
        </button>
        
        <div className="h-6 w-px bg-slate-200 mx-0.5"></div>

        {/* Profile Circle Button */}
        <button 
          onClick={() => navigate('/app/profile')}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-500 flex items-center justify-center bg-slate-900 text-white font-black text-xs shadow-md cursor-pointer active:scale-95"
          title="Profaili"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </header>
  );
}