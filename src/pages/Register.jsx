import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Register() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Google Direct Sign-Up (Zero OTP)
  const handleGoogleSignup = () => {
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
            credential: response.credential
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
          setError('Imeshindikana kuunganisha akaunti ya Google. Tafadhali jaribu tena.');
        } finally {
          setLoading(false);
        }
      }
    });

    window.google.accounts.id.prompt();
  };

  // 2. Direct Account Creation (Zero OTP)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = formData.email.trim();

    if (formData.password !== formData.confirmPassword) {
      setError('Nenosiri halifanani. Tafadhali thibitisha nenosiri lako tena.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Nenosiri linapaswa kuwa na herufi au tarakimu zisizopungua 6.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/register/`, {
        email: cleanEmail,
        password: formData.password,
      });

      const { access_token, refresh_token, user } = res.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      // Direct entry to Welcome Splash!
      navigate('/welcome');

    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      setError(serverMsg || 'Imeshindikana kusajili akaunti. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12 selection:bg-slate-100 font-sans">
      <div className="w-full max-w-[340px] sm:max-w-[360px] flex flex-col">
        
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-10">
          Happening now
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-7">
          Join today.
        </h2>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl text-center font-bold">
            {error}
          </div>
        )}

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-full border border-slate-300 flex items-center justify-center gap-3 transition-all active:scale-[0.99] shadow-sm mb-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-3">
          <div className="flex-1 h-[1px] bg-slate-200"></div>
          <span className="px-3 text-xs text-slate-500 font-medium">or</span>
          <div className="flex-1 h-[1px] bg-slate-200"></div>
        </div>

        {/* Email Registration Form */}
        {!showEmailForm ? (
          <button
            type="button"
            onClick={() => setShowEmailForm(true)}
            className="w-full py-2.5 px-4 bg-black hover:bg-slate-900 text-white text-sm font-semibold rounded-full transition-all active:scale-[0.99] shadow-sm cursor-pointer"
          >
            Create account
          </button>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3 mt-1">
            <div>
              <input
                type="email"
                required
                placeholder="Barua pepe (Email)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-full focus:border-black outline-none transition-all placeholder:text-slate-400 caret-black"
              />
            </div>

            <div>
              <input
                type="password"
                required
                placeholder="Weka Nenosiri (Password)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-full focus:border-black outline-none transition-all placeholder:text-slate-400 caret-black"
              />
            </div>

            <div>
              <input
                type="password"
                required
                placeholder="Thibitisha Nenosiri (Confirm Password)"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-full focus:border-black outline-none transition-all placeholder:text-slate-400 caret-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-black hover:bg-slate-900 text-white text-sm font-semibold rounded-full transition-all active:scale-[0.99] disabled:opacity-60 shadow-sm cursor-pointer"
            >
              {loading ? 'Inasajili...' : 'Sajili Akaunti ➔'}
            </button>
          </form>
        )}

        <p className="text-[11px] text-slate-500 leading-tight mt-3">
          By signing up, you agree to the{' '}
          <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and{' '}
          <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>.
        </p>

        <div className="mt-12">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Tayari unayo akaunti?
          </h3>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-blue-600 text-sm font-semibold rounded-full border border-slate-300 transition-all active:scale-[0.99] cursor-pointer"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}
