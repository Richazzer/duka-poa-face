import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  Boxes,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { api } from '../config';

export default function ProductsStock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Zote');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', sellingPrice: '', stockQuantity: '' });

  // 1. Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products/');
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

  // 2. Save Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const priceNum = Number(form.sellingPrice) || 0;
    const stockNum = Number(form.stockQuantity) || 0;

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || 'Duka',
      price: priceNum,
      selling_price: priceNum,
      stock: stockNum,
      stock_quantity: stockNum
    };

    try {
      const res = await api.post('/products/', payload);
      setProducts((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setForm({ name: '', category: '', sellingPrice: '', stockQuantity: '' });
    } catch (err) {
      console.error('Save product error:', err);
      if (err.response?.status === 401) {
        alert('Kipindi chako kimeisha. Tafadhali ingia tena kwenye akaunti yako.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
        alert(`Hitilafu: ${errorDetail}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Quick Stock Adjust (+1 / -1)
  const handleAdjustStock = async (product, delta) => {
    const currentStock = product.stock ?? product.stock_quantity ?? 0;
    const newStock = Math.max(0, currentStock + delta);

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock, stock_quantity: newStock } : p))
    );

    try {
      await api.patch(`/products/${product.id}/`, {
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none font-sans pb-32">
      
      {/* Valuation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thamani ya Stoo</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">TZS {totalStockValue.toLocaleString()}</h3>
        </div>

        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jumla ya Bidhaa</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">{products.length} Aina</h3>
        </div>

        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zinazokaribia Kuisha</p>
          <h3 className="text-xl sm:text-2xl font-black text-amber-500 mt-1">{lowStockCount} Bidhaa</h3>
        </div>

        <div className="p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zilizokwisha</p>
          <h3 className="text-xl sm:text-2xl font-black text-rose-500 mt-1">
            {products.filter(p => Number(p.stock ?? p.stock_quantity ?? 0) === 0).length} Bidhaa
          </h3>
        </div>
      </div>

      {/* Action Header */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-4 sm:p-5 rounded-[26px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa stoo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button onClick={fetchProducts} className="p-3 rounded-full bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="py-3 px-6 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap">
            <Plus className="w-4 h-4" /> Ongeza Bidhaa Mpya
          </button>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Boxes className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Hakuna Bidhaa</h3>
            <p className="text-xs sm:text-sm text-slate-500">Bofya "Ongeza Bidhaa Mpya" kusajili bidhaa ya stoo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Jina la Bidhaa</th>
                  <th className="py-4 px-5">Kategoria</th>
                  <th className="py-4 px-5">Bei ya Kuuza</th>
                  <th className="py-4 px-5 text-center">Idadi ya Stoo</th>
                  <th className="py-4 px-6 text-right">Rekebisha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map((item) => {
                  const price = item.price || item.selling_price || 0;
                  const stock = item.stock ?? item.stock_quantity ?? 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{item.category || 'Duka'}</td>
                      <td className="py-4 px-5 font-black text-slate-900 dark:text-white">TZS {Number(price).toLocaleString()}</td>
                      <td className="py-4 px-5 text-center font-black text-sm sm:text-base text-slate-900 dark:text-white">{stock}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <button onClick={() => handleAdjustStock(item, -1)} className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors" title="Punguza 1">
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAdjustStock(item, 1)} className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors" title="Ongeza 1">
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

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Weka Bidhaa Mpya Stoo">
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase">Jina la Bidhaa</label>
            <input required type="text" placeholder="Mf. Unga wa Ngano 2kg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase">Kategoria</label>
            <input type="text" placeholder="Mf. Vyakula, Sabuni" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase">Bei ya Kuuza (TZS)</label>
              <input required type="number" placeholder="3500" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase">Idadi ya Stock</label>
              <input required type="number" placeholder="50" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md transition-all active:scale-95">
            {loading ? 'Inahifadhi...' : 'Hifadhi Bidhaa Kwenye Database ➔'}
          </button>
        </form>
      </Modal>

    </div>
  );
}
