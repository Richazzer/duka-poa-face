import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/useAuthStore';
import { ShoppingBag, Mail, Phone, ArrowLeft } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });

  const handleRegister = (provider = 'email') => {
    setToken('fifa_glass_token');
    setUser({ 
      name: form.fullName || 'Richard Joseph', 
      email: form.email || 'richard@dukapooa.co.tz', 
      role: 'Store Owner' 
    });
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Background FIFA Glass Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-slate-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer fifa-card px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Rudi Nyumbani
      </button>

      <div className="w-full max-w-md fifa-card p-8 rounded-3xl space-y-6 relative z-10 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-500 text-white flex items-center justify-center font-black text-2xl shadow-xl border border-slate-600">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Fungua Akaunti ya Duka Pooa</h2>
          <p className="text-xs text-slate-400">Chagua njia ya kujiunga na mfumo</p>
        </div>

        {/* Multi-Auth Buttons */}
        <div className="space-y-3 pt-2">
          <button 
            onClick={() => handleRegister('email')}
            className="w-full py-3 px-4 rounded-2xl fifa-glass-input flex items-center justify-center gap-3 text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-slate-300" /> Continue with email
          </button>

          <button 
            onClick={() => handleRegister('google')}
            className="w-full py-3 px-4 rounded-2xl fifa-glass-input flex items-center justify-center gap-3 text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span className="font-black text-amber-400">G</span> Continue with Google
          </button>

          <button 
            onClick={() => handleRegister('apple')}
            className="w-full py-3 px-4 rounded-2xl fifa-glass-input flex items-center justify-center gap-3 text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span></span> Continue with Apple
          </button>

          <button 
            onClick={() => handleRegister('microsoft')}
            className="w-full py-3 px-4 rounded-2xl fifa-glass-input flex items-center justify-center gap-3 text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <span className="bg-rose-500"></span><span className="bg-emerald-500"></span>
              <span className="bg-amber-500"></span><span className="bg-blue-500"></span>
            </span> Continue with Microsoft
          </button>

          <button 
            onClick={() => handleRegister('phone')}
            className="w-full py-3 px-4 rounded-2xl fifa-glass-input flex items-center justify-center gap-3 text-sm font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-slate-300" /> Continue with phone
          </button>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2">
          Una akaunti tayari? <span onClick={() => navigate('/login')} className="text-slate-200 font-bold hover:underline cursor-pointer">Ingia hapa</span>
        </div>
      </div>
    </div>
  );
}