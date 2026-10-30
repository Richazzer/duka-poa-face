import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Ingiza barua pepe na neno la siri kununua/kuingia');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Direct login without OTP requirement
      await login(email, password);
      navigate('/welcome');
    } catch (err) {
      setError(err.response?.data?.error || 'Barua pepe au neno la siri siyo sahihi');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    // Quick social sign-in bypasses OTP straight to splash screen
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
        
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Duka Pooa POS</h1>
          <p className="text-xs text-slate-500">Ingiza barua pepe na neno la siri kuingia</p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="barua-pepe@mfano.com"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Neno la siri"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'Inaingia...' : 'Ingia Mfumoni'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="shrink mx-3 text-[11px] text-slate-400 font-medium">au ingia na</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button onClick={handleSocialLogin} type="button" className="py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-xs text-slate-700">Google</button>
          <button onClick={handleSocialLogin} type="button" className="py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-xs text-slate-700">Apple</button>
          <button onClick={handleSocialLogin} type="button" className="py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-xs text-slate-700">Microsoft</button>
        </div>

        <div className="pt-2 text-xs text-slate-500">
          Huna akaunti?{' '}
          <button onClick={() => navigate('/register')} className="font-bold text-blue-600 hover:underline cursor-pointer">
            Fungua akaunti hapa
          </button>
        </div>

      </div>
    </div>
  );
}