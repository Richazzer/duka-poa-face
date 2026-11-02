import React, { useState } from 'react';
import axios from 'axios';

export default function BusinessOnboarding() {
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    goals: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPreparing, setIsPreparing] = useState(false); // Controls the 3-second white splash

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token =
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken');

    if (!token) {
      setError('Hujaingia kwenye mfumo. Tafadhali thibitisha OTP upya.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = 'http://127.0.0.1:8000/api/v1/onboarding/';

      await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // 1. Update user & token in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, is_onboarded: true }));
      localStorage.setItem('is_onboarded', 'true');
      localStorage.setItem('token', token);
      localStorage.setItem('access_token', token);

      // 2. Trigger the Apple-style White Splash Screen
      setIsPreparing(true);

      // 3. Wait exactly 3 seconds, then enter dashboard
      setTimeout(() => {
        window.location.href = '/app';
      }, 3000);

    } catch (err) {
      console.error('Onboarding submission error:', err);

      // Fallback if URL is /api/ instead of /api/v1/
      if (err.response?.status === 404) {
        try {
          await axios.post('http://127.0.0.1:8000/api/onboarding/', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...storedUser, is_onboarded: true }));
          localStorage.setItem('is_onboarded', 'true');
          localStorage.setItem('token', token);

          setIsPreparing(true);
          setTimeout(() => {
            window.location.href = '/app';
          }, 3000);
          return;
        } catch (retryErr) {
          setError('Imeshindikana kuhifadhi taarifa. Tafadhali jaribu tena.');
        }
      } else {
        const serverError = err.response?.data?.message || err.response?.data?.error;
        setError(serverError || 'Imeshindikana kuhifadhi taarifa. Tafadhali jaribu tena.');
      }
      setLoading(false);
    }
  };

  // =========================================================================
  // 3-SECOND APPLE-STYLE WHITE TRANSITION SPLASH SCREEN
  // =========================================================================
  if (isPreparing) {
    return (
      <div className="min-h-screen bg-[#f3f5f9] flex items-center justify-center p-4">
        <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center">
          
          {/* Animated Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
            <span className="text-3xl animate-bounce">🚀</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tunatayarisha Duka Lako!
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Tunaweka tayari dashibodi yako ya <span className="font-semibold text-slate-800">{formData.business_name || 'Duka Poa'}</span>...
          </p>

          {/* Smooth Animated Loading Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-8">
            <div className="bg-blue-600 h-full rounded-full animate-[pulse_1.5s_ease-in-out_infinite] w-full"></div>
          </div>

          <p className="text-xs text-slate-400 mt-4 font-medium">
            Sekunde chache tu...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // BUSINESS CREDENTIALS FORM (WHITE APPLE THEME)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f3f5f9] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 text-center tracking-tight">
          Karibu Duka Poa 🚀
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2 mb-6">
          Tafadhali weka taarifa za biashara yako ili tuanze.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Jina la Biashara (Business Name)
            </label>
            <input
              type="text"
              name="business_name"
              required
              value={formData.business_name}
              onChange={handleChange}
              placeholder="Mf. Richa Minimart"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder-slate-400"
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Aina ya Biashara (Business Type)
            </label>
            <select
              name="business_type"
              required
              value={formData.business_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            >
              <option value="">Chagua aina ya biashara</option>
              <option value="retail">Duka la Rejareja (Retail Shop)</option>
              <option value="wholesale">Duka la Jumla (Wholesale)</option>
              <option value="grocery">Duka la Vyakula (Grocery / Supermarket)</option>
              <option value="pharmacy">Duka la Dawa (Pharmacy)</option>
              <option value="other">Nyinginezo (Other)</option>
            </select>
          </div>

          {/* Business Goals */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Malengo yako kwenye Biashara Hii (Business Goals)
            </label>
            <textarea
              name="goals"
              rows={3}
              value={formData.goals}
              onChange={handleChange}
              placeholder="Mf. Kuongeza mauzo, kufuatilia bidhaa zinazoisha..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder-slate-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Inahifadhi...' : 'Endelea kwenye Dashboard ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}