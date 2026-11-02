import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeSplash() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f5f9] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center">
        
        {/* Apple-style Blue Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
          <span className="text-3xl">🏪</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Karibu Duka Poa!
        </h1>

        {/* Description */}
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Mfumo wa kisasa wa kusimamia mauzo, stoo, madeni na faida ya duka lako kwa urahisi popote ulipo.
        </p>

        {/* Action Button */}
        <div className="w-full mt-8">
          <button
            onClick={() => navigate('/onboarding/splash')}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all shadow-sm active:scale-[0.99]"
          >
            Weka Taarifa za Biashara ➔
          </button>
        </div>

      </div>
    </div>
  );
}