import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Hold the splash screen for 3.5 seconds then navigate to dashboard
    const timer = setTimeout(() => {
      navigate('/app');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
        
        {/* LOGO CONTAINER */}
        <div className="relative pt-2">
          <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full animate-pulse"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 mx-auto flex items-center justify-center relative z-10 shadow-md animate-bounce">
            <span className="text-2xl font-black text-blue-600 tracking-tighter">DP</span>
            {/* If using an image file, uncomment below: */}
            {/* <img src="/logo.png" alt="Duka Pooa Logo" className="w-12 h-12 object-contain" /> */}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Karibu Duka Pooa! 🎉</h2>
          <p className="text-xs text-slate-500 font-medium">Uhakiki umekamilika. Tunapakia mfumo wako...</p>
        </div>

        {/* 3.5-second Progress Bar & Spinner */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-[3500ms] ease-out" 
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}