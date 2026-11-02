import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, RefreshCw, Package, Tag, AlertTriangle } from 'lucide-react';
import Modal from '../components/common/Modal';

export default function ProductsStock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', sellingPrice: '', stockQuantity: '' });

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/v1/products/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data || []);
    } catch (e) {
      console.warn('Stock fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || 'Duka',
      selling_price: Number(form.sellingPrice),
      stock_quantity: Number(form.stockQuantity)
    };

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/products/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setForm({ name: '', category: '', sellingPrice: '', stockQuantity: '' });
    } catch (err) {
      alert('Imeshindikana kuongeza bidhaa.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5 select-none font-sans">
      
      {/* Header with High-Visibility Action Button */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Usimamizi wa Stock
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Orodha na idadi ya bidhaa zilizopo stoo moja kwa moja kutoka Django
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchProducts}
            className="p-3 rounded-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
            title="Sawazisha Stock"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          {/* Clean Prominent Addition Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-6 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ongeza Bidhaa Mpya
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tafuta bidhaa stoo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-[#141a24]/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products Stock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white/80 dark:bg-[#141a24]/80 rounded-[28px] border border-slate-200/80 dark:border-slate-800">
            <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-white">Hakuna Bidhaa Iliyopatikana</h3>
            <p className="text-xs text-slate-500 mt-1">Bofya "Ongeza Bidhaa Mpya" kusajili bidhaa ya stoo.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const price = item.selling_price || item.sellingPrice || item.price || 0;
            const stock = item.stock_quantity ?? item.stockQuantity ?? item.stock ?? 0;
            const isLow = stock <= 5;

            return (
              <div
                key={item.id}
                className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category || 'Duka'}</span>
                    {isLow && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Inakaribia kuisha
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 truncate">{item.name}</h4>
                  <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-1">TZS {Number(price).toLocaleString()}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Stock Baki:</span>
                  <span className={`font-black ${isLow ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>{stock} pcs</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add Product */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Weka Bidhaa Mpya Stoo">
        <form onSubmit={handleSaveProduct} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold mb-1">Jina la Bidhaa</label>
            <input
              required
              type="text"
              placeholder="Mf. Azam Biskuti Box"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Kategoria</label>
            <input
              type="text"
              placeholder="Mf. Vyakula, Sabuni, n.k."
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold mb-1">Bei ya Kuuza (TZS)</label>
              <input
                required
                type="number"
                placeholder="2000"
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Stock Quantity</label>
              <input
                required
                type="number"
                placeholder="50"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl active:scale-95 transition-all mt-2 cursor-pointer"
          >
            {loading ? 'Inahifadhi...' : 'Hifadhi Bidhaa Kwenye Database ➔'}
          </button>
        </form>
      </Modal>

    </div>
  );
}