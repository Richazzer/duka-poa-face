import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Grab the email stored during signup
    const savedEmail = sessionStorage.getItem('pending_email');
    if (!savedEmail) {
      // If no registration was started, go back to register
      navigate('/register');
      return;
    }
    setEmail(savedEmail);

    // Auto-focus first box
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [navigate]);

  const handleChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (!cleanValue) {
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);

    if (index < 5 && cleanValue) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      setError('Tafadhali ingiza namba zote 6 za OTP.');
      return;
    }

    setLoading(true);
    setError('');

    // Retrieve the user's password set during registration
    const password = sessionStorage.getItem('pending_password') || '';

    try {
      let response;
      try {
        response = await axios.post('http://127.0.0.1:8000/api/v1/auth/verify-otp/', {
          email,
          otp: fullOtp,
          password,
        });
      } catch (firstErr) {
        if (firstErr.response?.status === 404) {
          response = await axios.post('http://127.0.0.1:8000/api/auth/verify-otp/', {
            email,
            otp: fullOtp,
            password,
          });
        } else {
          throw firstErr;
        }
      }

      const { access_token, refresh_token, is_onboarded } = response.data;

      // 1. SAVE ALL TOKEN FORMATS SO PROTECTED ROUTE NEVER KICKS YOU OUT
      localStorage.setItem('token', access_token);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // 2. Clean temporary session credentials
      sessionStorage.removeItem('pending_email');
      sessionStorage.removeItem('pending_password');

      // 3. HARD REDIRECT TO PREVENT BOUNCING BACK TO LOGIN
      if (!is_onboarded) {
        window.location.href = '/welcome';
      } else {
        window.location.href = '/app';
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Namba ya OTP siyo sahihi au imekwisha muda wake.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f9] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
        
        {/* Apple-style Blue Shield Badge */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-tight">
          Ingiza namba ya uhakiki (OTP)
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2">
          Imetumwa kupitia terminal kwenda{' '}
          <span className="font-semibold text-slate-800">{email || 'Barua pepe yako'}</span>
        </p>

        {error && (
          <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full mt-8">
          <div className="flex justify-between gap-2 sm:gap-2.5 mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-semibold text-slate-900 bg-white border border-slate-300 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Inathibitisha...' : 'Endelea'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full py-3.5 mt-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-2xl border border-slate-200 transition-all active:scale-[0.99]"
          >
            Rudi Nyuma
          </button>
        </form>
      </div>
    </div>
  );
}