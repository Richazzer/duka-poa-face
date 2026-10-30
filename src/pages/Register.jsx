import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { sendOtp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Tafadhali jaza barua pepe na neno la siri');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Trigger OTP generation
      await sendOtp(email);
      // Redirect to OTP verification screen
      navigate('/otp-verify', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || 'Imeshindikana kutuma OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    const dummyEmail = `user@${provider.toLowerCase()}.com`;
    sendOtp(dummyEmail).catch(() => {});
    navigate('/otp-verify', { state: { email: dummyEmail } });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
        
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Duka Pooa POS</h1>
          <p className="text-xs text-slate-500">Ingiza barua pepe na neno la siri kusajili</p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5 text-left">
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
              placeholder="Neno la siri jipya"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'Inatuma OTP...' : 'Endelea na OTP'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="shrink mx-3 text-[11px] text-slate-400 font-medium">au jiunge na</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleSocialRegister('Google')} type="button" className="py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-xs text-slate-700">Google</button>
          <button onClick={() => handleSocialRegister('Apple')} type="button" className="py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-xs text-slate-700">Apple</button>
          <button onClick={() => handleSocialRegister('Microsoft')} type="button" className="py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-xs text-slate-700">Microsoft</button>
        </div>

        <div className="pt-2 text-xs text-slate-500">
          Una akaunti tayari?{' '}
          <button onClick={() => navigate('/login')} className="font-bold text-blue-600 hover:underline cursor-pointer">
            Ingia hapa
          </button>
        </div>

      </div>
    </div>
  );
}