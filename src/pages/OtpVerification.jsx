import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export default function OtpVerification() {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const inputRefs = useRef([]);
  const { verifyOtp, sendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'caesarrichazzer@gmail.com';

  useEffect(() => {
    if (email) {
      sendOtp(email).catch(() => {});
    }
  }, [email]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    if (fullOtp.length < 6) {
      setError("Tafadhali jaza namba zote 6 za OTP.");
      return;
    }

    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, fullOtp);
      // Clean redirect straight to the dedicated splash page
      navigate('/welcome');
    } catch (err) {
      setError(err.response?.data?.error || "Namba ya OTP siyo sahihi au imekwisha muda wake.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center animate-in fade-in duration-300">
        
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Ingiza namba ya uhakiki (OTP)</h2>
          <p className="text-xs text-slate-500">
            Imetumwa kupitia terminal kwenda <span className="font-semibold text-slate-800">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otpValues.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e.key)}
                className="w-11 h-14 text-center text-xl font-bold rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white shadow-xs transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="flex items-start justify-center gap-1.5 text-xs text-rose-600 font-medium px-2 bg-rose-50 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? 'Inahakiki...' : 'Endelea'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Rudi Nyuma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}