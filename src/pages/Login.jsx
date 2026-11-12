import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight,
  Lock,
  Mail,
  Store,
  Loader2,
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const saveSession = ({ access_token, refresh_token, user }) => {
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('token', access_token);
  localStorage.setItem('refresh_token', refresh_token);

  if (user) {
    const serializedUser = JSON.stringify(user);
    localStorage.setItem('user', serializedUser);
    localStorage.setItem('user_data', serializedUser);
  }

  window.dispatchEvent(new Event('duka_auth_changed'));
};

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleGoogleLogin = () => {
    if (!window.google) {
      alert('Tafadhali subiri sekunde chache Google ipakie kisha jaribu tena.');
      return;
    }

    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '825907989396-placeholder.apps.googleusercontent.com';

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (googleResponse) => {
        setLoading(true);
        setError('');

        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/v1/auth/google/`,
            {
              credential: googleResponse.credential,
              mode: 'login',
            }
          );

          saveSession(response.data);
          navigate(response.data.is_onboarded ? '/app' : '/welcome');
        } catch {
          setError('Imeshindikana kuingia kupitia Google. Tafadhali jaribu tena.');
        } finally {
          setLoading(false);
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/login/`,
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      saveSession(response.data);
      navigate(response.data.is_onboarded ? '/app' : '/welcome');
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.error ||
          'Barua pepe au nenosiri si sahihi.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-full border border-white/80 bg-white/55 py-3 pl-11 pr-4 text-sm text-slate-900 shadow-inner outline-none backdrop-blur-xl transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:focus:border-blue-400';

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-12 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#070a12] dark:text-slate-100">
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-blue-300/35 blur-[130px] dark:bg-blue-600/20" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-8%] h-[420px] w-[420px] rounded-full bg-indigo-300/25 blur-[130px] dark:bg-indigo-600/15" />

      <section className="relative w-full max-w-[440px] overflow-hidden rounded-[34px] border border-white/80 bg-white/60 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.14),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#121724]/65 dark:shadow-[0_24px_70px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.12)] sm:p-10">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/40" />

        <div className="mb-6 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/60 bg-blue-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-800 dark:border-blue-400/20 dark:text-blue-300">
            <Store className="h-3.5 w-3.5" />
            Duka Poa POS
          </span>
          <h1 className="text-3xl font-black tracking-tight">Ingia Dukani</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Weka barua pepe na nenosiri lako kuendelea na mauzo.
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

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-white/80 bg-white/55 px-4 py-3 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-xl transition hover:bg-white/85 active:scale-[0.99] disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/10"
        >
          <span className="text-base font-black text-blue-600" aria-hidden="true">G</span>
          Ingia kupitia Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-300/70 dark:bg-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">au</span>
          <span className="h-px flex-1 bg-slate-300/70 dark:bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Barua Pepe au Jina
            </span>
            <span className="relative flex items-center">
              <Mail className="absolute left-4 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="email"
                required
                autoComplete="username"
                placeholder="mfano@dukapoa.co.tz"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Nenosiri
            </span>
            <span className="relative flex items-center">
              <Lock className="absolute left-4 h-4 w-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Weka nenosiri lako"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.01] hover:bg-blue-500 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Inaingia...
              </>
            ) : (
              <>
                Ingia Kwenye Akaunti
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 border-t border-slate-200/70 pt-5 text-center text-xs text-slate-600 dark:border-white/10 dark:text-slate-400">
          Huna akaunti bado?{' '}
          <Link to="/register" className="font-bold text-blue-700 hover:underline dark:text-blue-300">
            Sajili duka bure
          </Link>
        </p>
      </section>
    </main>
  );
}
