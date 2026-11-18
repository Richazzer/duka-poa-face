import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Send, Bot, User, Loader2, TrendingUp, Package } from 'lucide-react';
import { api } from '../config';

export default function AiManager() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Karibu kwenye Duka Poa AI! Mimi ni msaidizi wako wa biashara. Niambie, unataka kuchambua mauzo ya leo, kuangalia bidhaa zilizobaki stoo, au unahitaji ushauri gani wa kukuza biashara yako?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState({ productsCount: 0, salesTotal: 0 });
  const messagesEndRef = useRef(null);

  // Chota muhtasari wa data za duka kutoka localStorage au backend wakati ukurasa unapofunguka
  useEffect(() => {
    async function fetchQuickStoreContext() {
      try {
        const [productsRes, salesRes] = await Promise.allSettled([
          api.get('/products/'),
          api.get('/sales/')
        ]);

        const products = productsRes.status === 'fulfilled' ? (productsRes.value?.data?.results || productsRes.value?.data || []) : [];
        const sales = salesRes.status === 'fulfilled' ? (salesRes.value?.data?.results || salesRes.value?.data || []) : [];

        const totalSalesAmount = sales.reduce((sum, s) => sum + Number(s.total_amount ?? s.amount ?? s.total ?? 0), 0);

        setStoreData({
          productsCount: Array.isArray(products) ? products.length : 0,
          salesTotal: totalSalesAmount
        });
      } catch (err) {
        console.error('Failed to load store context for AI:', err);
      }
    }

    fetchQuickStoreContext();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      // Tuma ujumbe kwenda backend ukiwa na muhtasari wa data za duka (Frontend to AI context)
      const response = await api.post('/ai/assistant/', { 
        message: userText,
        context: {
          total_products: storeData.productsCount,
          total_sales_recorded: storeData.salesTotal
        }
      });

      const aiReply = response.data?.reply || 'Samahani, sikuelewa vizuri. Tafadhali jaribu tena.';
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Kuna tatizo la mtandao limetokea. Tafadhali hakikisha umeunganishwa na ujaribu tena.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] max-w-4xl mx-auto flex items-center justify-center font-sans pb-10">
      
      {/* Background soft glowing effects */}
      <div className="pointer-events-none absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-violet-400/15 blur-[100px] dark:bg-violet-500/15" />
      <div className="pointer-events-none absolute -right-20 bottom-10 -z-10 h-80 w-80 rounded-full bg-blue-300/15 blur-[110px] dark:bg-blue-500/10" />

      {/* Glass card container */}
      <div className="relative z-20 w-full max-w-2xl mx-4 h-[calc(100vh-9rem)] min-h-[550px] rounded-[32px] bg-white/85 dark:bg-[#151c28]/90 backdrop-blur-3xl border border-white/80 dark:border-slate-700/70 shadow-[0_25px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
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
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Inasoma data za duka lako
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Package className="w-3.5 h-3.5 text-blue-500" /> {storeData.productsCount} bidhaa
            </span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                Inachambua stoo na mauzo yako...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200/70 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Uliza mfano: Bidhaa zipi zinastahili kuongezwa stoo?"
              className="flex-1 h-12 px-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="h-12 w-12 shrink-0 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
