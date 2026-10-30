import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, DollarSign, 
  Users, Bot, BarChart3, Shield, Settings, Truck, ArrowLeft 
} from 'lucide-react';

export default function MenuPage() {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Biashara & Mauzo',
      items: [
        { path: '/app', label: 'Overview', desc: 'Muhtasari wa mauzo na takwimu', icon: LayoutDashboard },
        { path: '/app/pos', label: 'Point of Sale (POS)', desc: 'Sajili mauzo na kutoa risiti', icon: ShoppingCart },
        { path: '/app/products', label: 'Bidhaa na Stock', desc: 'Simamia bidhaa na idadi ya stoko', icon: Package },
        { path: '/app/purchasing', label: 'Ununuzi & OCR', desc: 'Changanua invoice za wauzaji', icon: Truck },
      ]
    },
    {
      title: 'Akaunti na Wateja',
      items: [
        { path: '/app/money', label: 'Pesa na Madeni', desc: 'Fuatilia madeni na mapato', icon: DollarSign },
        { path: '/app/customers', label: 'Wateja (Customers)', desc: 'Orodha ya wateja wako', icon: Users },
        { path: '/app/ai-manager', label: 'Meneja wa AI', desc: 'Msaidizi wa akili mbandia', icon: Bot, highlight: true },
      ]
    },
    {
      title: 'Ripoti na Mipangilio',
      items: [
        { path: '/app/reports', label: 'Ripoti na Chati', desc: 'Uchanganuzi wa kina wa biashara', icon: BarChart3 },
        { path: '/app/staff', label: 'Wafanyakazi & Logs', desc: 'Simamia wafanyakazi na haki', icon: Shield },
        { path: '/app/settings', label: 'Mipangilio (Settings)', desc: 'Badili mfumo na API endpoint', icon: Settings },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300 text-slate-100 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="glass-pill p-3 rounded-2xl text-slate-200 hover:text-white transition-all duration-300 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Menyu ya Mfumo</h1>
          <p className="text-sm text-indigo-200 drop-shadow-sm">Chagua kipengele chochote kufungua</p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="space-y-8">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-300/80 px-2 drop-shadow-sm">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-start gap-4 p-5 rounded-3xl text-left transition-all duration-300 cursor-pointer active:scale-95 ${
                      item.highlight 
                        ? 'glass-card-light text-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-liquid-glow' 
                        : 'glass-card-dark text-slate-200 hover:bg-white/5 hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    <div className={`p-3.5 rounded-2xl shrink-0 ${
                      item.highlight ? 'bg-blue-500/20 text-blue-700' : 'glass-pill text-indigo-300'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1 mt-1">
                      <h3 className={`text-base font-black tracking-wide ${item.highlight ? 'text-slate-900' : 'text-white'}`}>
                        {item.label}
                      </h3>
                      <p className={`text-xs mt-1 font-medium ${item.highlight ? 'text-slate-700' : 'text-indigo-200/70'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}