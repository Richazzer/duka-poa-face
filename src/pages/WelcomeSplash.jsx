import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTO_CONTINUE_MS = 4000;

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

const hasSession = () => {
  try {
    return Boolean(localStorage.getItem('access_token') || localStorage.getItem('token'));
  } catch {
    return false;
  }
};

export default function WelcomeSplash() {
  const navigate = useNavigate();

  // Clean extraction without broken regex ranges
  const firstName = useMemo(() => {
    try {
      const email = readUser()?.email || '';
      const rawName = email.split('@')[0] || '';
      const clean = rawName.replace(/[^a-zA-Z]/g, ' ').trim().split(' ')[0];
      return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : '';
    } catch {
      return '';
    }
  }, []);

  useEffect(() => {
    if (!hasSession()) {
      navigate('/register', { replace: true });
      return undefined;
    }
    const timer = setTimeout(() => navigate('/onboarding/splash', { replace: true }), AUTO_CONTINUE_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f3f5f9] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center">

        {/* Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
          <span className="text-3xl">🏪</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Karibu Duka Poa{firstName ? `, ${firstName}` : ''}!
        </h1>

        {/* Description */}
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Mfumo wa kisasa wa kusimamia mauzo, stoo, madeni na faida ya duka lako kwa urahisi popote ulipo.
        </p>

        <p className="text-xs text-slate-400 mt-3 font-medium">
          Tunakupeleka kuweka taarifa za biashara yako...
        </p>

        {/* Action Button */}
        <div className="w-full mt-8">
          <button
            onClick={() => navigate('/onboarding/splash', { replace: true })}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all shadow-sm active:scale-[0.99] cursor-pointer"
          >
            Weka Taarifa za Biashara ➔
          </button>
        </div>

      </div>
    </div>
  );
}
