import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  Package, 
  Users, 
  Lightbulb, 
  User, 
  ArrowUp,
  CheckCircle2,
  Wrench
} from 'lucide-react';

export default function AiManager() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Habari! Mimi ni Meneja wako wa AI wa Duka Poa. Ninaunganishwa moja kwa moja na database yako ya Django. Unaweza kuniuliza kuhusu mauzo, au kuniagiza kubadilisha bei ya bidhaa, kuongeza stoo, au kusajili malipo ya deni!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [liveInfo, setLiveInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { icon: TrendingUp, title: 'Mauzo ya Leo', prompt: 'Je, mauzo ya leo yanaendaje?' },
    { icon: Package, title: 'Tahadhari ya Stoo', prompt: 'Ni bidhaa gani zinakaribia kuisha stoo?' },
    { icon: Users, title: 'Daftari la Madeni', prompt: 'Ni wateja gani wanaodaiwa zaidi dukani?' },
    { icon: Wrench, title: 'Agiza AI Kubadili Data', prompt: 'Ongeza bei ya unga iwe 4000' }
  ];

  // REAL LIVE API CALL TO DJANGO GEMINI ENDPOINT
  const handleSendMessage = async (textToSend = input) => {
    const text = textToSend.trim();
    if (!text) return;

    // 1. Show user message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 2. Call Django AI Endpoint
      const res = await axios.post('http://127.0.0.1:8000/api/v1/ai/chat/', {
        message: text
      });

      const { reply, action_performed, live_metrics } = res.data;
      if (live_metrics) setLiveInfo(live_metrics);

      // 3. Append AI response
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: reply,
        action: action_performed
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Samahani, kumetokea hitilafu ya mawasiliano na seva ya Django. Hakikisha runserver inafanya kazi.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col font-sans select-none pb-44">
      
      {/* Header */}
      <div className="pt-2 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-[11px] font-bold text-blue-700 dark:text-blue-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          Live Connected • Gemini AI Agent
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300">
          Meneja wa Akili Mnemba (AI)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          AI inayofuatilia kila muamala na yenye uwezo wa kurekebisha bei na stoo moja kwa moja.
        </p>
      </div>

      {/* Suggestion Cards */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {quickPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                className="group p-4 rounded-2xl bg-white/70 dark:bg-[#141a24]/70 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-blue-500/50 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  "{item.prompt}"
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-xl p-4 sm:p-5 rounded-[22px] text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-tr-sm shadow-md'
                  : 'bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm shadow-sm whitespace-pre-wrap'
              }`}
            >
              {msg.text}

              {/* Action Execution Pill Badge */}
              {msg.action && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{msg.action}</span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-9 h-9 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3 justify-start">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 p-4 rounded-[22px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Capsule */}
      <div className="fixed bottom-24 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pointer-events-auto w-full max-w-2xl bg-white/85 dark:bg-[#151c28]/90 backdrop-blur-3xl border border-white/80 dark:border-slate-700/80 rounded-full p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.18)] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Uliza au agiza: 'Weka bei ya unga iwe 3500' au 'Mauzo yakoje?'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 pl-4 pr-2 py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>

    </div>
  );
}