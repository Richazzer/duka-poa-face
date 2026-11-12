import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  MessageSquare,
  RefreshCw,
  Phone,
  Search,
  Clock,
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { api } from '../config';

export default function Customers() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    amount: '',
    phone: '',
    notes: '',
  });

  const fetchDebts = async () => {
    setLoading(true);

    try {
      const res = await api.get('/debts/');
      setDebts(
        Array.isArray(res.data) ? res.data : res.data.results || []
      );
    } catch (error) {
      console.warn('Debts fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();

    const handleSync = () => fetchDebts();

    window.addEventListener('duka_sync', handleSync);
    window.addEventListener('duka_data_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('duka_sync', handleSync);
      window.removeEventListener('duka_data_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleCreateDebt = async (event) => {
    event.preventDefault();
    setLoading(true);

    const amountNum = Number(form.amount) || 0;
    const cleanName = form.customer_name.trim();
    const cleanPhone = form.phone.trim();

    const payload = {
      customer_name: cleanName,
      amount_owed: amountNum,
      phone: cleanPhone,
      notes: form.notes.trim() || 'Deni la bidhaa',
      is_paid: false,
    };

    try {
      const res = await api.post('/debts/', payload);

      setDebts((previous) => [res.data, ...previous]);
      setIsOpen(false);
      setForm({
        customer_name: '',
        amount: '',
        phone: '',
        notes: '',
      });

      window.dispatchEvent(new Event('duka_sync'));
      window.dispatchEvent(new Event('duka_data_updated'));
    } catch (error) {
      console.error('Debt creation failed:', error.response?.data || error);

      const detail = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;

      alert(`Imeshindikana: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await api.patch(`/debts/${id}/`, { is_paid: true });

      setDebts((previous) =>
        previous.map((debt) =>
          debt.id === id ? { ...debt, is_paid: true } : debt
        )
      );

      window.dispatchEvent(new Event('duka_sync'));
    } catch (error) {
      console.error('Could not mark debt as paid:', error);
      await fetchDebts();
    }
  };

  const sendWhatsAppReminder = (debt) => {
    let rawPhone = (debt.phone || debt.customer_phone || '').replace(/\D/g, '');

    if (rawPhone.startsWith('0')) {
      rawPhone = `255${rawPhone.slice(1)}`;
    }

    if (!rawPhone) return;

    const name = debt.customer_name || debt.name || 'Mteja';
    const amount = Number(
      debt.amount_owed ?? debt.amount ?? 0
    ).toLocaleString();

    const message = encodeURIComponent(
      `Habari ${name}, hii ni kumbukumbu kutoka duka letu kuwa una deni la TZS ${amount} kwa bidhaa ulizochukua. Tafadhali karibu dukani kulipia. Ahsante sana!`
    );

    window.open(`https://wa.me/${rawPhone}?text=${message}`, '_blank');
  };

  const unpaidDebts = debts.filter((debt) => !debt.is_paid);

  const totalDebtAmount = unpaidDebts.reduce(
    (sum, debt) => sum + Number(debt.amount_owed ?? debt.amount ?? 0),
    0
  );

  const searchTerm = search.trim().toLowerCase();

  const filteredDebts = unpaidDebts.filter((debt) => {
    const name = (debt.customer_name || debt.name || '').toLowerCase();
    const phone = (debt.phone || debt.customer_phone || '').toLowerCase();

    return name.includes(searchTerm) || phone.includes(searchTerm);
  });

  const inputClassName =
    'w-full rounded-2xl border border-white/60 bg-white/65 px-4 py-3 text-sm font-medium text-slate-900 shadow-inner shadow-white/50 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950/35 dark:text-white dark:shadow-black/10 dark:placeholder:text-slate-500 dark:focus:border-blue-400';

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-3 pb-28 font-sans sm:px-5">
      <section className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/65 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/55 dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-400/10" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/80 px-3 py-1.5 text-xs font-bold text-amber-800 backdrop-blur-xl dark:border-amber-300/15 dark:bg-amber-400/10 dark:text-amber-200">
              <Clock className="h-3.5 w-3.5" />
              Jumla ya Madeni: TZS {totalDebtAmount.toLocaleString()}
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Wateja &amp; Daftari la Madeni
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Daftari la kidijitali la kufuatilia na kukumbusha madeni ya
              wateja.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={fetchDebts}
              disabled={loading}
              title="Sawazisha Madeni"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin text-blue-500' : ''}`}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-blue-400/40 bg-blue-600 px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(37,99,235,0.25)] transition hover:bg-blue-500 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Weka Deni Jipya
            </button>
          </div>
        </div>
      </section>

      <section className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Tafuta mteja kwa jina au namba ya simu..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-2xl border border-white/70 bg-white/65 py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-[0_10px_35px_rgba(15,23,42,0.05)] outline-none backdrop-blur-2xl transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500"
        />
      </section>

      <section className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {filteredDebts.length === 0 ? (
          <div className="col-span-full rounded-[28px] border border-white/70 bg-white/60 p-10 text-center shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/45 dark:shadow-[0_16px_50px_rgba(0,0,0,0.2)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-slate-400 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
              <Users className="h-7 w-7" />
            </div>

            <h2 className="font-bold text-slate-900 dark:text-white">
              Daftari Liko Wazi
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Hakuna madeni yasiyolipwa. Bofya “Weka Deni Jipya” kusajili deni
              la mteja.
            </p>
          </div>
        ) : (
          filteredDebts.map((debt) => {
            const name = debt.customer_name || debt.name || 'Mteja';
            const phone = debt.phone || debt.customer_phone || '';
            const amount = Number(debt.amount_owed ?? debt.amount ?? 0);

            return (
              <article
                key={debt.id}
                className="group relative overflow-hidden rounded-[26px] border border-white/70 bg-white/65 p-5 shadow-[0_14px_45px_rgba(15,23,42,0.06)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-slate-900/50 dark:shadow-[0_14px_45px_rgba(0,0,0,0.22)]"
              >
                <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />

                <div className="relative flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-slate-950 dark:text-white">
                      {name}
                    </h2>

                    <p className="mt-1 text-lg font-black tracking-tight text-amber-600 dark:text-amber-300">
                      TZS {amount.toLocaleString()}
                    </p>

                    {phone && (
                      <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Phone className="h-3.5 w-3.5" />
                        {phone}
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {phone && (
                      <button
                        type="button"
                        onClick={() => sendWhatsAppReminder(debt)}
                        title="Kumbusha kwa WhatsApp"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200/70 bg-emerald-50/80 text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-300/15 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleMarkPaid(debt.id)}
                      className="rounded-xl border border-white/70 bg-white/75 px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-400/40 hover:bg-emerald-600 hover:text-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-emerald-500"
                    >
                      Amelipa ✓
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Weka Deni la Mteja"
      >
        <form onSubmit={handleCreateDebt} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Jina la Mteja
            </label>
            <input
              required
              type="text"
              placeholder="Mf. Juma Mangi"
              value={form.customer_name}
              onChange={(event) =>
                setForm({ ...form, customer_name: event.target.value })
              }
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Kiasi cha Deni (TZS)
            </label>
            <input
              required
              min="0"
              step="1"
              type="number"
              placeholder="Mf. 15000"
              value={form.amount}
              onChange={(event) =>
                setForm({ ...form, amount: event.target.value })
              }
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Namba ya Simu (WhatsApp)
            </label>
            <input
              type="tel"
              placeholder="Mf. 0712345678"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Maelezo ya Deni (Hiari)
            </label>
            <input
              type="text"
              placeholder="Mf. Alichukua mchele na mafuta"
              value={form.notes}
              onChange={(event) =>
                setForm({ ...form, notes: event.target.value })
              }
              className={inputClassName}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl border border-blue-400/40 bg-blue-600 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(37,99,235,0.24)] transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Inahifadhi...' : 'Hifadhi Kwenye Daftari ➔'}
          </button>
        </form>
      </Modal>
    </main>
  );
}
