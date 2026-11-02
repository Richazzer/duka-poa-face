import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Sun, Moon, Store, Mail, Phone, LogOut, 
  Settings as SettingsIcon, ShieldCheck, Target, Tag 
} from 'lucide-react';

export default function ProfileSettings() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    business_name: '',
    business_type: '',
    goals: '',
  });

  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Sync state with HTML class
  useEffect(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark') || 
                            localStorage.getItem('theme') === 'dark';
    setIsDark(isCurrentlyDark);
  }, []);

  // Theme Toggle: switches background + text + cards seamlessly
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Fetch real profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      const fallbackEmail = localUser.email || 'caesarrichazzer@gmail.com';

      try {
        let res;
        try {
          res = await axios.get('http://127.0.0.1:8000/api/v1/onboarding/', {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (e) {
          res = await axios.get('http://127.0.0.1:8000/api/onboarding/', {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        const data = res.data;
        const profile = data.profile || {};
        const user = data.user || {};

        setProfileData({
          name: profile.business_name || user.username || 'Duka Lako',
          email: user.email || fallbackEmail,
          business_name: profile.business_name || 'Duka Lako',
          business_type: profile.business_type || 'Rejareja (Retail)',
          goals: profile.goals || 'Kusimamia mauzo na stoo kwa ufanisi',
        });
      } catch (err) {
        setProfileData({
          name: 'Duka Lako',
          email: fallbackEmail,
          business_name: 'Duka Lako',
          business_type: 'Rejareja',
          goals: 'Kusimamia mauzo na stoo',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      
      {/* 
        High-Contrast Header: 
        text-slate-900 in Light Mode / text-white in Dark Mode
      */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Profaili ya Mfanyabiashara & Mipangilio
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Simamia taarifa za duka lako na mapendeleo ya mfumo
        </p>
      </div>

      {/* 1. Main Profile Badge Card */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all">
        
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm text-slate-700 dark:text-slate-300">
          <User className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.8]" />
        </div>

        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white capitalize tracking-tight">
            {loading ? 'Inapakia...' : profileData.business_name}
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Mmiliki wa Duka ({profileData.email})
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Mmiliki Aliyethibitishwa
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
              ★ 5-Star Manager
            </span>
          </div>
        </div>
      </div>

      {/* 2. Theme Switcher Card */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
          Mwonekano wa Mfumo (Theme)
        </h3>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_25px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)] flex items-center justify-between transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center text-amber-500 dark:text-blue-400">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {isDark ? 'Dark Theme (Giza)' : 'White Theme (Clean Light)'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Badili mwonekano wa rangi za mfumo
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="py-2.5 px-5 rounded-full font-bold text-xs transition-all active:scale-95 shadow-sm bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 cursor-pointer"
          >
            {isDark ? 'Badili kwenda Light ☀️' : 'Badili kwenda Dark 🌙'}
          </button>
        </div>
      </div>

      {/* 3. Detailed Business Information List */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
          Taarifa za Biashara Yako
        </h3>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_25px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)] divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden transition-all">
          
          {/* Jina la Duka */}
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Jina la Duka</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {profileData.business_name}
            </span>
          </div>

          {/* Barua Pepe */}
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Barua Pepe</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {profileData.email}
            </span>
          </div>

          {/* Aina ya Biashara */}
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Aina ya Biashara</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white capitalize">
              {profileData.business_type}
            </span>
          </div>

          {/* Malengo */}
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Malengo ya Duka</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white max-w-xs text-right truncate">
              {profileData.goals}
            </span>
          </div>

        </div>
      </div>

      {/* 4. Bottom Controls */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => navigate('/app/settings')}
          className="flex-1 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <SettingsIcon className="w-4 h-4" /> Mipangilio ya Mfumo
        </button>

        <button
          onClick={handleLogout}
          className="flex-1 py-3 px-5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60 border border-rose-200 rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Toka Kwenye Mfumo (Logout)
        </button>
      </div>

    </div>
  );
}