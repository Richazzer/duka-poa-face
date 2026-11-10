import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Boxes,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { API_BASE_URL } from '../config'; // <--- FIXED: CONNECTS TO LIVE BACKEND

export default function ProductsStock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Zote');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', sellingPrice: '', stockQuantity: '' });

  // 1. Fetch Real Products from Live Render Backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/products/`);
      setProducts(res.data || []);
    } catch (e) {
      console.warn('Stock fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Save New Product to Live Render Backend
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const priceNum = Number(form.sellingPrice) || 0;
    const stockNum = Number(form.stockQuantity) || 0;

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || 'Duka',
      selling_price: priceNum,
      price: priceNum,
      stock_quantity: stockNum,
      stock: stockNum
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/products/`, payload);
      setProducts((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setForm({ name: '', category: '', sellingPrice: '', stockQuantity: '' });
    } catch (err) {
      console.error('Save product error:', err);
      alert('Imeshindikana kuongeza bidhaa. Hakikisha seva iko wazi.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Quick Stock Adjust
  const handleAdjustStock = async (product, delta) => {
    const currentStock = product.stock_quantity ?? product.stock ?? 0;
    const newStock = Math.max(0, currentStock + delta);

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock, stock_quantity: newStock } : p))
    );

    try {
      await axios.patch(`${API_BASE_URL}/api/v1/products/${product.id}/`, {
        stock: newStock,
        stock_quantity: newStock
      });
    } catch (e) {
      fetchProducts();
    }
  };

  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => {
      const price = Number(p.price || p.selling_price || 0);
      const qty = Number(p.stock ?? p.stock_quantity ?? 0);
      return sum + price * qty;
    }, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => {
      const qty = Number(p.stock ?? p.stock_quantity ?? 0);
      return qty > 0 && qty <= 5;
    }).length;
  }, [products]);

  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ['Zote', ...Array.from(list)];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'Zote' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-5 select-none font-sans pb-28">
      
      {/* Valuation Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thamani ya Stoo</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">TZS {totalStockValue.toLocaleString()}</h3>
        </div>

        <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jumla ya Bidhaa</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">{products.length} Aina</h3>
        </div>

        <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zinazokaribia Kuisha</p>
          <h3 className="text-xl sm:text-2xl font-black text-amber-500 mt-1">{lowStockCount} Bidhaa</h3>
        </div>

        <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zilizokwisha</p>
          <h3 className="text-xl sm:text-2xl font-black text-rose-500 mt-1">
            {products.filter(p => Number(p.stock ?? p.stock_quantity ?? 0) === 0).length} Bidhaa
          </h3>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-4 sm:p-5 rounded-[26px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa stoo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button onClick={fetchProducts} className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="py-2.5 px-5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Ongeza Bidhaa Mpya
          </button>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Boxes className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-white">Hakuna Bidhaa</h3>
            <p className="text-xs text-slate-500">Bofya "Ongeza Bidhaa Mpya" kusajili bidhaa ya stoo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-5">Jina la Bidhaa</th>
                  <th className="py-3.5 px-4">Kategoria</th>
                  <th className="py-3.5 px-4">Bei ya Kuuza</th>
                  <th className="py-3.5 px-4 text-center">Idadi ya Stoo</th>
                  <th className="py-3.5 px-5 text-right">Rekebisha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map((item) => {
                  const price = item.price || item.selling_price || 0;
                  const stock = item.stock ?? item.stock_quantity ?? 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{item.category || 'Duka'}</td>
                      <td className="py-4 px-4 font-black text-slate-900 dark:text-white">TZS {Number(price).toLocaleString()}</td>
                      <td className="py-4 px-4 text-center font-black text-sm text-slate-900 dark:text-white">{stock}</td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button onClick={() => handleAdjustStock(item, -1)} className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer">
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAdjustStock(item, 1)} className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer">
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Weka Bidhaa Mpya Stoo">
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase">Jina la Bidhaa</label>
            <input required type="text" placeholder="Mf. Unga wa Ngano 2kg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase">Kategoria</label>
            <input type="text" placeholder="Mf. Vyakula, Sabuni" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase">Bei ya Kuuza (TZS)</label>
              <input required type="number" placeholder="3500" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase">Idadi ya Stock</label>
              <input required type="number" placeholder="50" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white text-sm outline-none" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md">
            {loading ? 'Inahifadhi...' : 'Hifadhi Bidhaa Kwenye Database ➔'}
          </button>
        </form>
      </Modal>

    </div>
  );
}
