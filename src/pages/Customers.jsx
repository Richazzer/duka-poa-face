import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, MessageSquare, CheckCircle2, RefreshCw } from 'lucide-react';
import Modal from '../components/common/Modal';

export default function Customers() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ customer_name: '', amount: '', phone: '', notes: '' });

  const fetchDebts = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/v1/debts/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDebts(res.data || []);
    } catch (e) {
      console.warn('Could not fetch debts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleCreateDebt = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/debts/', {
        customer_name: form.customer_name,
        amount: Number(form.amount),
        phone: form.phone,
        notes: form.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDebts((prev) => [res.data, ...prev]);
      setIsOpen(false);
      setForm({ customer_name: '', amount: '', phone: '', notes: '' });
    } catch (e) {
      alert('Imeshindikana kuongeza deni.');
    }
  };

  const handleMarkPaid = async (id) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    try {
      await axios.patch(`http://127.0.0.1:8000/api/v1/debts/${id}/`, { is_paid: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, is_paid: true } : d)));
    } catch (e) {
      setDebts((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // Direct WhatsApp message (Customer communication, no automated money deductions)
  const sendWhatsAppReminder = (debt) => {
    const phone = (debt.phone || '').replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Habari ${debt.customer_name}, hii ni kumbukumbu kutoka duka letu kuwa una deni la TZS ${Number(debt.amount).toLocaleString()} kwa bidhaa ulizochukua. Karibu dukani kulipia. Ahsante sana!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none font-sans">
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Wateja & Daftari la Madeni
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftari la kidijitali la wateja wenye madeni ya bidhaa dukani
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="py-3 px-6 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Weka Deni Jipya
        </button>
      </div>

      {/* Debts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {debts.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white/80 dark:bg-[#141a24]/80 rounded-[28px] border border-slate-200/80 dark:border-slate-800">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-white">Daftari Liko Wazi</h3>
            <p className="text-xs text-slate-500 mt-1">Hakuna madeni yasiyolipwa kwa sasa.</p>
          </div>
        ) : (
          debts.map((debt) => (
            <div
              key={debt.id}
              className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{debt.customer_name}</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-black mt-0.5">
                  TZS {Number(debt.amount).toLocaleString()}
                </p>
                {debt.phone && <p className="text-[11px] text-slate-400 mt-1">{debt.phone}</p>}
              </div>

              <div className="flex items-center gap-2">
                {debt.phone && (
                  <button
                    onClick={() => sendWhatsAppReminder(debt)}
                    className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                    title="Tuma Ujumbe WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleMarkPaid(debt.id)}
                  className="py-1.5 px-3.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                >
                  Amelipa ✓
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Debt Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Weka Deni la Mteja">
        <form onSubmit={handleCreateDebt} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold mb-1">Jina la Mteja</label>
            <input
              required
              type="text"
              placeholder="Mf. Mama Baraka"
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Kiasi cha Deni (TZS)</label>
            <input
              required
              type="number"
              placeholder="12000"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Namba ya Simu (WhatsApp)</label>
            <input
              type="text"
              placeholder="07xxxxxxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs active:scale-95 transition-all mt-2 cursor-pointer"
          >
            Hifadhi Kwenye Daftari ➔
          </button>
        </form>
      </Modal>

    </div>
  );
}