import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, Send, Check, X, Loader2, AlertCircle } from 'lucide-react';

// ADAPT: base URL and token key to match the rest of your app
const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL) || 'https://duka-poa.onrender.com/api/v1';
const getToken = () => localStorage.getItem('access_token');

async function authPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  let data = {};
  try {
    data = await res.json();
  } catch (_) {
    /* non-JSON error body */
  }
  if (!res.ok) {
    if (res.status === 401) throw new Error('Kipindi chako kimeisha. Tafadhali ingia tena.');
    throw new Error(data.error || data.detail || 'Imeshindikana. Jaribu tena.');
  }
  return data;
}

const WELCOME = {
  role: 'model',
  local: true,
  text: 'Habari! Mimi ni Duka Poa AI Agent. Naweza kuchambua mauzo, faida na stoo yako, na kubadilisha bei au stoo ukiniomba.',
};

const SUGGESTIONS = [
  'Bidhaa gani ina faida kubwa zaidi?',
  'Bidhaa gani zinaisha stoo?',
  'Nipe muhtasari wa mauzo ya wiki hii',
];

export default function AiManager() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    const history = messages
      .filter((m) => !m.local)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const data = await authPost('/ai/chat/', { message, history });
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: data.reply,
          actions: (data.actions || []).map((a) => ({ ...a, status: 'pending' })),
        },
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const setActionStatus = (msgIndex, actionIndex, status, note) => {
    setMessages((prev) =>
      prev.map((m, i) =>
        i !== msgIndex
          ? m
          : {
              ...m,
              actions: m.actions.map((a, j) => (j === actionIndex ? { ...a, status, note } : a)),
            }
      )
    );
  };

  const applyAction = async (msgIndex, actionIndex) => {
    const a = messages[msgIndex].actions[actionIndex];
    setActionStatus(msgIndex, actionIndex, 'applying');
    try {
      await authPost('/ai/apply/', { type: a.type, product_id: a.product_id, value: a.value });
      setActionStatus(msgIndex, actionIndex, 'done');
    } catch (e) {
      setActionStatus(msgIndex, actionIndex, 'error', e.message);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onlyWelcome = messages.length === 1;

  return (
    <div className="relative min-h-[calc(100vh-10rem)] max-w-4xl mx-auto flex items-center justify-center font-sans pb-28">
      {/* Background blurred skeleton (unchanged) */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-25 dark:opacity-20 blur-md pointer-events-none overflow-hidden select-none">
        <div className="space-y-4 pt-4">
          <div className="h-10 w-64 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          <div className="h-6 w-96 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          </div>
        </div>
        <div className="space-y-3 pb-8">
          <div className="h-14 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          <div className="h-14 w-1/2 bg-blue-400 rounded-3xl ml-auto"></div>
          <div className="h-12 w-full bg-slate-300 dark:bg-slate-700 rounded-full mt-4"></div>
        </div>
      </div>

      {/* Glass chat card */}
      <div className="relative z-20 w-full max-w-xl mx-4 h-[calc(100vh-13rem)] min-h-[420px] rounded-[32px] bg-white/80 dark:bg-[#151c28]/90 backdrop-blur-3xl border border-white/80 dark:border-slate-700/70 shadow-[0_25px_60px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.7)] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200/70 dark:border-slate-800">
          <button
            onClick={() => navigate('/app')}
            aria-label="Rudi kwenye Muhtasari wa Duka"
            className="w-9 h-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Duka Poa AI Agent
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Mauzo, faida na stoo yako
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] space-y-2">
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words rounded-3xl ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-lg'
                  }`}
                >
                  {m.text}
                </div>

                {m.actions?.map((a, j) => (
                  <div
                    key={j}
                    className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 space-y-2"
                  >
                    <p className="font-semibold">{a.label}</p>

                    {a.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => applyAction(i, j)}
                          className="flex-1 py-2 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Thibitisha
                        </button>
                        <button
                          onClick={() => setActionStatus(i, j, 'dismissed')}
                          className="px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Acha
                        </button>
                      </div>
                    )}
                    {a.status === 'applying' && (
                      <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Inatekeleza...
                      </p>
                    )}
                    {a.status === 'done' && (
                      <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Imetekelezwa
                      </p>
                    )}
                    {a.status === 'dismissed' && (
                      <p className="text-slate-500 dark:text-slate-400">Haikutekelezwa</p>
                    )}
                    {a.status === 'error' && (
                      <div className="space-y-2">
                        <p className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {a.note}
                        </p>
                        <button
                          onClick={() => applyAction(i, j)}
                          className="px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold active:scale-95 transition-all cursor-pointer"
                        >
                          Jaribu tena
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {onlyWelcome && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3.5 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-3xl rounded-bl-lg bg-slate-100 dark:bg-slate-800 flex gap-1.5" aria-label="AI inaandika">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '120ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '240ms' }} />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-200/70 dark:border-slate-800">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              maxLength={2000}
              placeholder="Uliza au toa agizo, mfano: weka bei ya sukari 3200"
              className="flex-1 resize-none max-h-32 px-4 py-3 rounded-3xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Tuma"
              className="w-11 h-11 shrink-0 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shadow-sm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
