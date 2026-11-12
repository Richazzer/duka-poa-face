import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Store } from 'lucide-react';
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const token =
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken');

    try {
      await axios.post(`${API_BASE_URL}/api/v1/onboarding/`, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      let storedUser = {};
      try {
        storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      } catch {
        storedUser = {};
      }

      const updatedUser = { ...storedUser, is_onboarded: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      localStorage.setItem('is_onboarded', 'true');
      window.dispatchEvent(new Event('duka_auth_changed'));

      navigate('/app');
    } catch (requestError) {
      console.error('Onboarding submission error:', requestError);
      const message =
        requestError.response?.data?.message ||
        requestError.response?.data?.error;
      setError(message || 'Imeshindikana kuhifadhi taarifa. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-white/80 bg-white/55 px-4 py-3 text-sm text-slate-900 shadow-inner outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:focus:border-blue-400';

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-12 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#070a12] dark:text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-12%] h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-blue-300/35 blur-[130px] dark:bg-blue-600/20" />
      <div className="pointer-events-none absolute bottom-[-12%] right-[-8%] h-[400px] w-[400px] rounded-full bg-indigo-300/25 blur-[120px] dark:bg-indigo-600/15" />

      <section className="relative w-full max-w-[480px] overflow-hidden rounded-[34px] border border-white/80 bg-white/60 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.14),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#121724]/65 dark:shadow-[0_24px_70px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.12)] sm:p-9">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/40" />

        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/50 bg-blue-500/10 text-blue-700 shadow-inner dark:border-blue-300/15 dark:text-blue-300">
            <Store className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Karibu Duka Poa
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
            Weka taarifa za biashara yako ili tuanze.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-rose-300/70 bg-rose-100/60 p-3.5 text-center text-xs font-bold text-rose-700 backdrop-blur-xl dark:border-rose-400/20 dark:bg-rose-950/35 dark:text-rose-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Jina la Biashara
            </span>
            <input
              type="text"
              name="business_name"
              required
              value={formData.business_name}
              onChange={handleChange}
              placeholder="Mf. Richimart"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Aina ya Biashara
            </span>
            <select
              name="business_type"
              required
              value={formData.business_type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="retail">Duka la Rejareja (Retail Shop)</option>
              <option value="wholesale">Duka la Jumla (Wholesale)</option>
              <option value="grocery">Duka la Vyakula (Grocery / Supermarket)</option>
              <option value="pharmacy">Duka la Dawa (Pharmacy)</option>
              <option value="other">Nyinginezo (Other)</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Malengo ya Biashara
            </span>
            <textarea
              name="goals"
              rows={3}
              value={formData.goals}
              onChange={handleChange}
              placeholder="Mf. Kuongeza mauzo na kufuatilia bidhaa..."
              className={`${inputClass} resize-none`}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.01] hover:bg-blue-500 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Inahifadhi...
              </>
            ) : (
              'Endelea kwenye Dashboard ➔'
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
