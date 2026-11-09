import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { api, getErrorMessage } from '../services/api';
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Boxes,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import Modal from '../components/common/Modal';


const LOW_STOCK_LIMIT = 5;
const EMPTY_FORM = { name: '', category: '', sellingPrice: '', stockQuantity: '' };

// =====================================================================
// HELPERS
// =====================================================================
const getPrice = (p) => Number(p?.selling_price ?? p?.sellingPrice ?? p?.price ?? 0) || 0;
const getStock = (p) => Number(p?.stock_quantity ?? p?.stockQuantity ?? p?.stock ?? 0) || 0;

// Works with plain arrays and DRF paginated responses ({ results: [...] })
const extractList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

export default function ProductsStock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Zote');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // fetching list
  const [saving, setSaving] = useState(false); // saving new product
  const [error, setError] = useState(''); // list-level error banner
  const [formError, setFormError] = useState(''); // modal error
  const [form, setForm] = useState(EMPTY_FORM);

  // Prevents state updates after the component unmounts
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 1. Fetch Real Products from Django
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/products/');
      if (mountedRef.current) setProducts(extractList(res.data));
    } catch (e) {
      console.warn('Stock fetch error:', e);
      if (mountedRef.current) {
        setError(getErrorMessage(e, 'Imeshindikana kupakia bidhaa.'));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. Save New Product to Django
  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setFormError('');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (saving) return;

    const name = form.name.trim();
    const priceNum = Number(form.sellingPrice);
    const stockNum = Number(form.stockQuantity);

    if (!name) {
      setFormError('Andika jina la bidhaa.');
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setFormError('Bei ya kuuza lazima iwe kubwa kuliko 0.');
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      setFormError('Idadi ya stock lazima iwe namba nzima (0 au zaidi).');
      return;
    }

    const payload = {
      name,
      category: form.category.trim() || 'Duka',
      selling_price: priceNum,
      price: priceNum,
      stock_quantity: stockNum,
      stock: stockNum
    };

    setSaving(true);
    setFormError('');
    try {
      const res = await api.post('/products/', payload);
      if (!mountedRef.current) return;
      setProducts((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.warn('Product save error:', err);
      if (mountedRef.current) {
        setFormError(getErrorMessage(err, 'Imeshindikana kuongeza bidhaa. Jaribu tena.'));
      }
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  // 3. Quick Stock Adjust (+1 / -1) directly on the ledger table
  const handleAdjustStock = async (product, delta) => {
    const currentStock = getStock(product);
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;

    // Optimistic UI update (keep every stock key in sync so the display never goes stale)
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock_quantity: newStock, stock: newStock } : p
      )
    );

    try {
      await api.patch(`/products/${product.id}/`, {
        stock_quantity: newStock,
        stock: newStock
      });
    } catch (e) {
      console.warn('Stock adjust error:', e);
      if (mountedRef.current) {
        setError(getErrorMessage(e, 'Imeshindikana kubadilisha idadi ya stoo.'));
      }
      fetchProducts(); // Rollback to server truth
    }
  };

  // Unique Inventory Calculations (Warehouse Valuation)
  const totalStockValue = useMemo(
    () => products.reduce((sum, p) => sum + getPrice(p) * getStock(p), 0),
    [products]
  );

  const lowStockCount = useMemo(
    () =>
      products.filter((p) => {
        const qty = getStock(p);
        return qty > 0 && qty <= LOW_STOCK_LIMIT;
      }).length,
    [products]
  );

  const outOfStockCount = useMemo(
    () => products.filter((p) => getStock(p) === 0).length,
    [products]
  );

  // Dynamic Categories Extract
  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ['Zote', ...Array.from(list)];
  }, [products]);

  // If the selected category no longer exists, go back to "Zote"
  useEffect(() => {
    if (!categories.includes(selectedCategory)) setSelectedCategory('Zote');
  }, [categories, selectedCategory]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = (p.name || '').toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'Zote' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-5 select-none font-sans pb-28">

      {/*
        ========================================================================
        1. INVENTORY VALUATION KPI CARDS (Unique to Stock Tab)
        ========================================================================
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">

        {/* Thamani ya Stoo */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Thamani ya Stoo (TZS)
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            TZS {totalStockValue.toLocaleString()}
          </h3>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1 block">
            Jumla ya thamani ya bidhaa zote
          </span>
        </div>

        {/* Jumla ya Aina za Bidhaa */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Jumla ya Bidhaa
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {products.length} Aina
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            Zilizosajiliwa kwenye database
          </span>
        </div>

        {/* Zinazokaribia Kuisha (<= 5) */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Zinazokaribia Kuisha
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-amber-500 mt-1">
            {lowStockCount} Bidhaa
          </h3>
          <span className="text-[10px] font-bold text-amber-600 mt-1 block">
            Zinahitaji kuagizwa upya
          </span>
        </div>

        {/* Zilizokwisha (0) */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Zilizokwisha Kabisa
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-rose-500 mt-1">
            {outOfStockCount} Bidhaa
          </h3>
          <span className="text-[10px] font-bold text-rose-600 mt-1 block">
            Hazipatikani kwa sasa
          </span>
        </div>

      </div>

      {/*
        ========================================================================
        2. INVENTORY CONTROL HEADER (Search + Categories + Add Button)
        ========================================================================
      */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-4 sm:p-5 rounded-[26px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa stoo kwa jina..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-60"
            title="Sawazisha Stoo"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          <button
            onClick={() => {
              setFormError('');
              setIsModalOpen(true);
            }}
            className="py-2.5 px-5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ongeza Bidhaa Mpya
          </button>
        </div>
      </div>

      {/* Error Banner (list-level) */}
      {error && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-[20px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{error}</p>
          </div>
          <button
            onClick={fetchProducts}
            className="shrink-0 py-1.5 px-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            Jaribu Tena
          </button>
        </div>
      )}

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/*
        ========================================================================
        3. THE INVENTORY LEDGER TABLE (Unique Table Design for Stock)
        ========================================================================
      */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">

        {loading && products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
            <p className="text-xs text-slate-500">Inapakia bidhaa za stoo...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Boxes className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-white">Hakuna Bidhaa Iliyopatikana</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bofya kitufe cha juu "Ongeza Bidhaa Mpya" kusajili bidhaa ya stoo.
            </p>
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
                  <th className="py-3.5 px-4">Hali ya Stoo</th>
                  <th className="py-3.5 px-5 text-right">Rekebisha Idadi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map((item) => {
                  const price = getPrice(item);
                  const stock = getStock(item);

                  // Status badge logic
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Inatosha
                    </span>
                  );

                  if (stock === 0) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-500">
                        <XCircle className="w-3 h-3" /> Imeisha
                      </span>
                    );
                  } else if (stock <= LOW_STOCK_LIMIT) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                        <AlertTriangle className="w-3 h-3" /> Inakaribia
                      </span>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                        {item.category || 'Duka'}
                      </td>
                      <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                        TZS {price.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center font-black text-sm text-slate-900 dark:text-white">
                        {stock}
                      </td>
                      <td className="py-4 px-4">
                        {statusBadge}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleAdjustStock(item, -1)}
                            disabled={stock === 0}
                            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Punguza 1"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAdjustStock(item, 1)}
                            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
                            title="Ongeza 1"
                          >
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

      {/* Modal Add Product to Ledger */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Weka Bidhaa Mpya Stoo">
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
              Jina la Bidhaa
            </label>
            <input
              required
              type="text"
              placeholder="Mf. Azam Biskuti Box"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
              Kategoria
            </label>
            <input
              type="text"
              placeholder="Mf. Vyakula, Sabuni, n.k."
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                Bei ya Kuuza (TZS)
              </label>
              <input
                required
                type="number"
                min="1"
                placeholder="2000"
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                Idadi ya Stock
              </label>
              <input
                required
                type="number"
                min="0"
                step="1"
                placeholder="50"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modal error (replaces the old browser alert) */}
          {formError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{formError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl active:scale-95 transition-all mt-3 cursor-pointer shadow-md shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Inahifadhi...' : 'Hifadhi Bidhaa Kwenye Database ➔'}
          </button>
        </form>
      </Modal>

    </div>
  );
}
