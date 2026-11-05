import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  RefreshCw, 
  Phone, 
  Search, 
  Clock 
} from 'lucide-react';
import Modal from '../components/common/Modal';

export default function Customers() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ 
    customer_name: '', 
    amount: '', 
    phone: '', 
    notes: '' 
  });

  // 1. Fetch live debts from Django API
  const fetchDebts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/v1/debts/');
      setDebts(res.data || []);
    } catch (e) {
      console.warn('Debts fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  // 2. Save new debt using amount_owed
  const handleCreateDebt = async (e) => {
    e.preventDefault();
    setLoading(true);

    const amountNum = Number(form.amount) || 0;
    const cleanName = form.customer_name.trim();
    const cleanPhone = form.phone.trim();

    // Payload includes amount_owed to match Django model requirements
    const payload = {
      customer_name: cleanName,
      name: cleanName,
      amount_owed: amountNum, // Django required field
      amount: amountNum,
      phone: cleanPhone,
      customer_phone: cleanPhone,
      notes: form.notes?.trim() || 'Deni la bidhaa',
      is_paid: false
    };

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/debts/', payload);
      setDebts((prev) => [res.data, ...prev]);
      setIsOpen(false);
      setForm({ customer_name: '', amount: '', phone: '', notes: '' });
    } catch (err) {
      console.error('Debt creation failed:', err.response?.data || err);
      const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert(`Imeshindikana: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Mark debt as paid
  const handleMarkPaid = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/v1/debts/${id}/`, { is_paid: true });
      setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, is_paid: true } : d)));
    } catch (e) {
      // Optimistic update fallback
      setDebts((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // 4. 1-Click WhatsApp debt reminder
  const sendWhatsAppReminder = (debt) => {
    let rawPhone = (debt.phone || debt.customer_phone || '').replace(/\D/g, '');
    if (rawPhone.startsWith('0')) {
      rawPhone = '255' + rawPhone.slice(1);
    }
    const name = debt.customer_name || debt.name || 'Mteja';
    const amountVal = Number(debt.amount_owed ?? debt.amount ?? 0).toLocaleString();
    const msg = encodeURIComponent(
      `Habari ${name}, hii ni kumbukumbu kutoka duka letu kuwa una deni la TZS ${amountVal} kwa bidhaa ulizochukua. Tafadhali karibu dukani kulipia. Ahsante sana!`
    );
    window.open(`https://wa.me/${rawPhone}?text=${msg}`, '_blank');
  };

  // Filter unpaid debts and calculate totals safely
  const unpaidDebts = debts.filter((d) => !d.is_paid);
  const totalDebtAmount = unpaidDebts.reduce(
    (sum, d) => sum + Number(d.amount_owed ?? d.amount ?? 0), 
    0
  );

  const filtered = unpaidDebts.filter((d) => {
    const name = (d.customer_name || d.name || '').toLowerCase();
    const phone = (d.phone || d.customer_phone || '').toLowerCase();
    return name.includes(search.toLowerCase()) || phone.includes(search.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 select-none font-sans pb-28">
      
      {/* 
        ========================================================================
        1. HEADER SUMMARY & QUICK ADD BUTTON
        ========================================================================
      */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-[11px] font-bold text-amber-700 dark:text-amber-300 mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Jumla ya Madeni: TZS {totalDebtAmount.toLocaleString()}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Wateja & Daftari la Madeni
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftari la kidijitali la kufuatilia na kukumbusha madeni ya wateja
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchDebts}
            className="p-3 rounded-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
            title="Sawazisha Madeni"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Weka Deni Jipya
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        2. SEARCH BAR
        ========================================================================
      */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tafuta mteja kwa jina au namba ya simu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-[#141a24]/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 
        ========================================================================
        3. DEBTS CARDS LIST
        ========================================================================
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white/80 dark:bg-[#141a24]/80 rounded-[28px] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-white">Daftari Liko Wazi</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hakuna madeni yasiyolipwa. Bofya "Weka Deni Jipya" kusajili deni la mteja.
            </p>
          </div>
        ) : (
          filtered.map((debt) => {
            const name = debt.customer_name || debt.name || 'Mteja';
            const phone = debt.phone || debt.customer_phone || '';
            const amount = Number(debt.amount_owed ?? debt.amount ?? 0);

            return (
              <div
                key={debt.id}
                className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{name}</h4>
                  <p className="text-sm font-black text-amber-500 mt-1">
                    TZS {amount.toLocaleString()}
                  </p>
                  {phone && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <Phone className="w-3 h-3" /> {phone}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* WhatsApp Reminder Button */}
                  {phone && (
                    <button
                      onClick={() => sendWhatsAppReminder(debt)}
                      className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all cursor-pointer shadow-xs"
                      title="Kumbusha kwa WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  )}

                  {/* Mark Debt Paid Button */}
                  <button
                    onClick={() => handleMarkPaid(debt.id)}
                    className="py-2 px-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    Amelipa ✓
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 
        ========================================================================
        4. HIGH-CONTRAST ADD DEBT MODAL
        ========================================================================
      */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Weka Deni la Mteja">
        <form onSubmit={handleCreateDebt} className="space-y-4">
          
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
              Jina la Mteja
            </label>
            <input
              required
              type="text"
              placeholder="Mf. Juma Mangi"
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 caret-blue-500"
            />
          </div>

          {/* Amount Owed */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
              Kiasi cha Deni (TZS)
            </label>
            <input
              required
              type="number"
              placeholder="Mf. 15000"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 caret-blue-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
              Namba ya Simu (WhatsApp)
            </label>
            <input
              type="text"
              placeholder="Mf. 0712345678"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 caret-blue-500"
            />
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
              Maelezo ya Deni (Hiari)
            </label>
            <input
              type="text"
              placeholder="Mf. Alichukua mchele na mafuta"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 caret-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl active:scale-95 transition-all mt-3 cursor-pointer shadow-md shadow-blue-600/30"
          >
            {loading ? 'Inahifadhi...' : 'Hifadhi Kwenye Daftari ➔'}
          </button>
        </form>
      </Modal>

    </div>
  );
}