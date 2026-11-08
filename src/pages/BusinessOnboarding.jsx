import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function BusinessOnboarding() {
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'retail',
    goals: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    try {
      // 1. Sends to your live Render backend (WORKS ON ALL PHONES)
      await axios.post(
        `${API_BASE_URL}/api/v1/onboarding/`,
        formData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // 2. Mark user as onboarded in browser storage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, is_onboarded: true }));
      localStorage.setItem('is_onboarded', 'true');

      // 3. Enter Dashboard
      navigate('/app');

    } catch (err) {
      console.error('Onboarding submission error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error;
      setError(msg || 'Imeshindikana kuhifadhi taarifa. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f9] dark:bg-[#0a0e17] flex items-center justify-center p-4 py-12 font-sans select-none">
      <div className="w-full max-w-[460px] bg-white dark:bg-[#151c28] rounded-3xl p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-slate-200/80 dark:border-slate-800 flex flex-col">
        
        {/* Title */}
        <h1 className="text-2xl font-black text-slate-900 dark:text-white text-center tracking-tight">
          Karibu Duka Poa 🚀
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mt-2 mb-6">
          Tafadhali weka taarifa za biashara yako ili tuanze.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Jina la Biashara (Business Name)
            </label>
            <input
              type="text"
              name="business_name"
              required
              value={formData.business_name}
              onChange={handleChange}
              placeholder="Mf. Richimart"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Aina ya Biashara (Business Type)
            </label>
            <select
              name="business_type"
              required
              value={formData.business_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="retail">Duka la Rejareja (Retail Shop)</option>
              <option value="wholesale">Duka la Jumla (Wholesale)</option>
              <option value="grocery">Duka la Vyakula (Grocery / Supermarket)</option>
              <option value="pharmacy">Duka la Dawa (Pharmacy)</option>
              <option value="other">Nyinginezo (Other)</option>
            </select>
          </div>

          {/* Business Goals */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
              Malengo yako kwenye Biashara Hii (Business Goals)
            </label>
            <textarea
              name="goals"
              rows={3}
              value={formData.goals}
              onChange={handleChange}
              placeholder="Mf. Kuongeza mauzo na kufuatilia bidhaa..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Inahifadhi...' : 'Endelea kwenye Dashboard ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}