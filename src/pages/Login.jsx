import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Sun, 
  Moon, 
  ArrowRight, 
  Lock, 
  Mail, 
  Store,
  Sparkles 
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { getTheme, setTheme } from '../utils/theme';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTheme, setCurrentTheme] = useState('dark');
  const navigate = useNavigate();

  // Sync theme
  useEffect(() => {
    setCurrentTheme(getTheme());
    const handleThemeChange = () => setCurrentTheme(getTheme());
    window.addEventListener('theme_change', handleThemeChange);
    return () => window.removeEventListener('theme_change', handleThemeChange);
  }, []);

  const toggleThemeMode = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setCurrentTheme(next);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Google Direct Login
  const handleGoogleLogin = () => {
    if (!window.google) {
      alert('Tafadhali subiri sekunde chache Google ipakie kisha jaribu tena.');
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '825907989396-placeholder.apps.googleusercontent.com';

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        setLoading(true);
        setError('');
        try {
          const res = await axios.post(`${API_BASE_URL}/api/v1/auth/google/`, {
            credential: response.credential,
            mode: 'login'
          });

          const { access_token, refresh_token, is_onboarded, user } = res.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          if (user) localStorage.setItem('user', JSON.stringify(user));

          if (!is_onboarded) {
            navigate('/welcome');
          } else {
            navigate('/app');
          }
        } catch (err) {
          setError('Imeshindikana kuingia kupitia Google. Tafadhali jaribu tena.');
        } finally {
          setLoading(false);
        }
      }
    });

    window.google.accounts.id.prompt();
  };

  // Email / Password Direct Login (Zero OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/login/`, {
        email: formData.email.trim(),
        password: formData.password
      });

      const { access_token, refresh_token, is_onboarded, user } = res.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      if (!is_onboarded) {
        navigate('/welcome');
      } else {
        navigate('/app');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Barua pepe au nenosiri si sahihi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f9] dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans transition-colors duration-300 select-none">
      
      {/* Ambient Specular Glow Orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Floating Top-Right Theme Toggle Circle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleThemeMode}
          className="w-11 h-11 rounded-full bg-white/80 dark:bg-[#131926]/85 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Badili Mwonekano (Light/Dark)"
        >
          {currentTheme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600" />
          )}
        </button>
      </div>

      {/* Main Liquid Glass Login Card */}
      <div className="relative z-10 w-full max-w-[420px] p-8 sm:p-10 rounded-[32px] bg-white/85 dark:bg-[#121724]/85 backdrop-blur-3xl border border-white/90 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)] space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            <Store className="w-3.5 h-3.5" /> Duka Poa POS
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Ingia Dukani
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Weka barua pepe na nenosiri lako kuendelea na mauzo
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* 1. Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-full bg-white dark:bg-[#1a2336] hover:bg-slate-50 dark:hover:bg-[#202c44] border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.99] shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Ingia kupitia Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-3">
          <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
          <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">au</span>
          <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* 2. Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 pl-1">
              Barua Pepe au Jina
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                name="email"
                required
                placeholder="mfano@dukapoa.co.tz"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-100/90 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700/80 rounded-full focus:bg-white dark:focus:bg-[#1f2b42] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 pl-1">
              Nenosiri (Password)
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="password"
                name="password"
                required
                placeholder="Weka nenosiri lako"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-100/90 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700/80 rounded-full focus:bg-white dark:focus:bg-[#1f2b42] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Inaingia...' : 'Ingia Kwenye Akaunti ➔'}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Huna akaunti bado?{' '}
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Sajili duka bure
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
