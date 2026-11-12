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

  // 1. Fetch Products & Listen to Real-Time Sync
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products/');
      setProducts(Array.isArray(res.data) ? res.data : (res.data.results || []));
    } catch (e) {
      console.warn('Stock fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const handleSync = () => fetchProducts();
    window.addEventListener('duka_sync', handleSync);
    window.addEventListener('duka_data_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('duka_sync', handleSync);
      window.removeEventListener('duka_data_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // 2. Save Product & Broadcast Sync
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

      // Broadcast real-time updates to POS and Overview
      window.dispatchEvent(new Event('duka_sync'));
      window.dispatchEvent(new Event('duka_data_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Save product error:', err);
      const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert(`Hitilafu: ${errorDetail}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Quick Stock Adjust (+1 / -1) & Sync
  const handleAdjustStock = async (product, delta) => {
    const currentStock = Number(product.stock ?? product.stock_quantity ?? 0);
    const newStock = Math.max(0, currentStock + delta);

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock, stock_quantity: newStock } : p))
    );

    try {
      await api.patch(`/products/${product.id}/`, {
        stock: newStock,
        stock_quantity: newStock
      });
      window.dispatchEvent(new Event('duka_sync'));
      window.dispatchEvent(new Event('duka_data_updated'));
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

  const liquidGlassCard = "p-4 rounded-[22px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 select-none font-sans text-slate-100 pb-36">
      
      {/* Valuation Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={liquidGlassCard}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thamani ya Stoo</p>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1">TZS {totalStockValue.toLocaleString()}</h3>
        </div>

        <div className={liquidGlassCard}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jumla ya Bidhaa</p>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1">{products.length} Aina</h3>
        </div>

        <div className={liquidGlassCard}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zinazokaribia Kuisha</p>
          <h3 className="text-lg sm:text-xl font-black text-amber-400 mt-1">{lowStockCount} Bidhaa</h3>
        </div>

        <div className={liquidGlassCard}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zilizokwisha</p>
          <h3 className="text-lg sm:text-xl font-black text-rose-400 mt-1">
            {products.filter(p => Number(p.stock ?? p.stock_quantity ?? 0) === 0).length} Bidhaa
          </h3>
        </div>
      </div>

      {/* Action Header */}
      <div className={`${liquidGlassCard} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa stoo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white/[0.06] border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button onClick={fetchProducts} className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 transition-all cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="py-2.5 px-5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Ongeza Bidhaa Mpya
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      {categories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Table */}
      <div className={`${liquidGlassCard} overflow-hidden p-0`}>
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Boxes className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-bold text-white text-sm">Hakuna Bidhaa</h3>
            <p className="text-xs text-slate-400">Bofya "Ongeza Bidhaa Mpya" kusajili bidhaa ya stoo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] border-b border-white/10 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Jina la Bidhaa</th>
                  <th className="py-3 px-4">Kategoria</th>
                  <th className="py-3 px-4">Bei ya Kuuza</th>
                  <th className="py-3 px-4 text-center">Idadi ya Stoo</th>
                  <th className="py-3 px-4 text-right">Rekebisha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item) => {
                  const price = Number(item.price || item.selling_price || 0);
                  const stock = Number(item.stock ?? item.stock_quantity ?? 0);
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-all">
                      <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{item.category || 'Duka'}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-400">TZS {price.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white">{stock}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button onClick={() => handleAdjustStock(item, -1)} className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 cursor-pointer">
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAdjustStock(item, 1)} className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 cursor-pointer">
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
        <form onSubmit={handleSaveProduct} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">Jina la Bidhaa</label>
            <input required type="text" placeholder="Mf. Unga wa Ngano 2kg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.06] text-white text-xs outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">Kategoria</label>
            <input type="text" placeholder="Mf. Vyakula, Sabuni" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.06] text-white text-xs outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">Bei ya Kuuza (TZS)</label>
              <input required type="number" placeholder="3500" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.06] text-white text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase">Idadi ya Stock</label>
              <input required type="number" placeholder="50" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.06] text-white text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md transition-all active:scale-95">
            {loading ? 'Inahifadhi...' : 'Hifadhi Bidhaa Kwenye Database ➔'}
          </button>
        </form>
      </Modal>

    </div>
  );
}
