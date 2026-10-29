import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import { Send, Bot } from 'lucide-react';
import { queryAiAssistant } from '../services/aiService';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const query = input;
    setInput('');

    try {
      const res = await queryAiAssistant(query);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.answer }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'ai', text: "Inasubiri majibu kutoka Django AI backend..." }]);
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
      <div className="p-4.5 border-b border-slate-100 bg-slate-900 text-white flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm tracking-wide">Duka Pooa AI Assistant</h3>
          <p className="text-xs text-slate-400">Powered by Django AI Backend</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4.5 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Bot className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-sm font-semibold">Andika swali lako kupata uchambuzi kutoka Django backend.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                msg.sender === 'user' 
                  ? 'bg-emerald-500 text-white rounded-br-none shadow-sm' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3.5 border-t border-slate-100 flex gap-2 bg-slate-50">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Uliza mfano: 'Mauzo ya leo ni kiasi gani?'"
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
        />
        <Button onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
