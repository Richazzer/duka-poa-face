import React, { useState, useEffect } from 'react';
import { Crown, Bell, CheckCircle2, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../../config';

export default function TopFloatingControls() {
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch real alerts (low stock, sales, debts)
  const fetchAlerts = async () => {
    try {
      const res = await api.get('/analytics/economics/');
      if (res.data?.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchAlerts();
    window.addEventListener('duka_sync', fetchAlerts);
    return () => window.removeEventListener('duka_sync', fetchAlerts);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      {/* 
        ========================================================================
        FLOATING LIQUID GLASS BUTTONS (PERSISTENT OVER EVERY TAB)
        ========================================================================
      */}
      <div className="fixed top-4 inset-x-0 z-40 max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between pointer-events-none select-none">
        
        {/* Left Liquid Glass Circle: KIFURUSHI / PLAN */}
        <button
          onClick={() => setIsPlanOpen(true)}
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#131926]/85 backdrop-blur-3xl border border-white/15 flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-[0_12px_32px_rgba(0,0,0,0.35)] cursor-pointer group"
          title="Kifurushi cha Duka (Plan)"
        >
          <Crown className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Right Liquid Glass Circle: TAARIFA / NOTIFICATIONS */}
        <button
          onClick={() => setIsNotifOpen(true)}
          className="pointer-events-auto relative w-12 h-12 rounded-full bg-[#131926]/85 backdrop-blur-3xl border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-[0_12px_32px_rgba(0,0,0,0.35)] cursor-pointer"
          title="Taarifa za Duka"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-[#131926] animate-pulse"></span>
          )}
        </button>

      </div>

      {/* 
        ========================================================================
        PLAN MODAL (LIQUID GLASS OVERFLOW)
        ========================================================================
      */}
      {isPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-sm p-6 sm:p-7 rounded-[32px] bg-[#131926]/95 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.4)] text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Crown className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Mpango wa Duka Poa</h3>
              <p className="text-xs text-slate-400 mt-1">
                Kifurushi Chako: <strong className="text-emerald-400">Pro Retailer (Bure)</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#192233] text-left text-xs space-y-2.5 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Mauzo na Risiti zisizo na kikomo
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Usimamizi wa Stoo na Arifa za Kuisha
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Daftari la Madeni & WhatsApp
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Mwelekeo wa Mauzo ya Chati
              </div>
            </div>

            <button
              onClick={() => setIsPlanOpen(false)}
              className="w-full py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              Funga
            </button>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        NOTIFICATIONS MODAL (LIQUID GLASS OVERFLOW)
        ========================================================================
      */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-[32px] bg-[#131926]/95 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.4)] space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-black text-white">Taarifa za Duka Lako</h3>
              </div>
              <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto scrollbar-none">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Hakuna taarifa mpya kwa sasa.
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-2xl bg-[#192233] text-xs space-y-1 border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[12px]">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{n.desc}</p>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setIsNotifOpen(false)}
              className="w-full py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              Funga
            </button>

          </div>
        </div>
      )}
    </>
  );
}
