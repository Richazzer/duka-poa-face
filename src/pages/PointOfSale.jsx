import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, Plus, RefreshCw, ShoppingCart, Minus, PlusCircle, CheckCircle2, Store
} from 'lucide-react';
import Modal from '../components/common/Modal';

export default function PointOfSale() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  // Form states
  const [paymentNote, setPaymentNote] = useState('Cash'); // Cash, Simu, Deni (Record only)
  const [customerName, setCustomerName] = useState('');
  const [quickForm, setQuickForm] = useState({ name: '', sellingPrice: '', stockQuantity: '', category: 'Duka' });

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/v1/products/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data || []);
    } catch (e) {
      console.warn('Could not fetch products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = Number(item.selling_price || item.sellingPrice || item.price || 0);
      return acc + price * item.quantity;
    }, 0);
  }, [cart]);

  // Record Sale in Database (Decrements stock, zero money transfers)
  const handleRecordSale = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const salePayload = {
      total_amount: cartTotal,
      payment_method: paymentNote,
      customer_name: customerName || 'Mteja wa Kawaida',
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: Number(i.selling_price || i.sellingPrice || 0)
      }))
    };

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/sales/', salePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // If marked as Deni, write to customer debt ledger automatically
      if (paymentNote === 'Deni') {
        try {
          await axios.post('http://127.0.0.1:8000/api/v1/debts/', {
            customer_name: customerName || 'Mteja wa Deni',
            amount: cartTotal,
            notes: `Mauzo ya bidhaa ${cart.length}`
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (e) {}
      }

      setCompletedSale({ ...salePayload, id: res.data.id || `RCP-${Date.now()}` });
      setCart([]);
      setIsCheckoutOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Imeshindikana kurekodi mauzo. Hakikisha seva ya Django iko wazi.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Add Product directly from POS screen
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const payload = {
      name: quickForm.name.trim(),
      category: quickForm.category.trim() || 'Duka',
      selling_price: Number(quickForm.sellingPrice),
      stock_quantity: Number(quickForm.stockQuantity)
    };

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/products/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts((prev) => [res.data, ...prev]);
      setIsQuickAddOpen(false);
      setQuickForm({ name: '', sellingPrice: '', stockQuantity: '', category: 'Duka' });
    } catch (err) {
      alert('Imeshindikana kuongeza bidhaa.');
    }
  };

  const filtered = products.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4 select-none font-sans">
      
      {/* Top Action Bar with Prominent "Ongeza Bidhaa" Button */}
      <div className="bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_25px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa kuanza mauzo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={fetchProducts}
          className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
          title="Sawazisha Bidhaa"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
        </button>

        {/* Clean Positioned Addition Button */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="py-2.5 px-5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Ongeza Bidhaa
        </button>
      </div>

      {/* Main Grid: Catalog Left, Live Cart Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Products Grid */}
        <div className="lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="bg-white/80 dark:bg-[#141a24]/80 rounded-[28px] p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Store className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-white">Hakuna Bidhaa Kwenye Orodha</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bofya kitufe cha juu "Ongeza Bidhaa" kuweka bidhaa yako ya kwanza kuanza kuuza.
              </p>
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="py-2.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                + Weka Bidhaa Sasa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((prod) => {
                const price = prod.selling_price || prod.sellingPrice || prod.price || 0;
                const stock = prod.stock_quantity ?? prod.stockQuantity ?? prod.stock ?? 0;
                return (
                  <div
                    key={prod.id}
                    onClick={() => stock > 0 && addToCart(prod)}
                    className={`p-4 rounded-2xl bg-white/80 dark:bg-[#141a24]/80 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all ${
                      stock > 0 
                        ? 'hover:scale-[1.02] cursor-pointer hover:border-blue-500/50' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{prod.name}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-extrabold mt-1">TZS {Number(price).toLocaleString()}</p>
                    <span className="text-[10px] text-slate-400 block mt-2">Stock: {stock}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Cart Column */}
        <div className="lg:col-span-1 bg-white/80 dark:bg-[#141a24]/80 backdrop-blur-2xl p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" /> Orodha ya Mauzo
            </h2>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-rose-500 hover:text-rose-600 font-bold">
                Futa Zote
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-none">
            {cart.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Chagua bidhaa kuziweka kwenye orodha.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex-1 truncate mr-2">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-slate-400">TZS {Number(item.selling_price || item.sellingPrice || 0).toLocaleString()} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <PlusCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-500">Jumla Kuu:</span>
              <span className="font-black text-lg text-slate-900 dark:text-white">TZS {cartTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              disabled={cart.length === 0}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-sm disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
            >
              Rekodi Mauzo ({cart.length}) ➔
            </button>
          </div>
        </div>

      </div>

      {/* Record Sale Modal (No payment gateway, just recording transaction note) */}
      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} title="Rekodi Mauzo ya Duka">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Jina la Mteja (Hiari)</label>
            <input
              type="text"
              placeholder="Mf. Juma Ali"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Aina ya Mauzo</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Cash', label: 'Cash (Taslimu)' },
                { id: 'Simu', label: 'Simu (M-Pesa/Tigo)' },
                { id: 'Deni', label: 'Deni (Mkopo)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentNote(m.id)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    paymentNote === m.id
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between text-xs font-bold">
            <span>Kiasi Kilichorekodiwa:</span>
            <span className="text-blue-600">TZS {cartTotal.toLocaleString()}</span>
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            {loading ? 'Inahifadhi...' : 'Hifadhi Mauzo na Toa Risiti ➔'}
          </button>
        </div>
      </Modal>

      {/* Quick Add Product Modal */}
      <Modal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} title="Weka Bidhaa Mpya">
        <form onSubmit={handleQuickAdd} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold mb-1">Jina la Bidhaa</label>
            <input
              required
              type="text"
              placeholder="Mf. Unga wa Ngano 2kg"
              value={quickForm.name}
              onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold mb-1">Bei ya Kuuza (TZS)</label>
              <input
                required
                type="number"
                placeholder="3500"
                value={quickForm.sellingPrice}
                onChange={(e) => setQuickForm({ ...quickForm, sellingPrice: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Idadi ya Stock</label>
              <input
                required
                type="number"
                placeholder="20"
                value={quickForm.stockQuantity}
                onChange={(e) => setQuickForm({ ...quickForm, stockQuantity: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl active:scale-95 transition-all mt-2 cursor-pointer"
          >
            Hifadhi Bidhaa ➔
          </button>
        </form>
      </Modal>

      {/* Receipt Preview */}
      {completedSale && (
        <Modal isOpen={true} onClose={() => setCompletedSale(null)} title="Risiti ya Mauzo">
          <div className="space-y-3 text-center py-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Mauzo Yamerekodiwa!</h3>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-left text-xs space-y-1">
              <div className="flex justify-between"><span>Aina:</span> <span className="font-bold">{completedSale.payment_method}</span></div>
              <div className="flex justify-between"><span>Mteja:</span> <span className="font-bold">{completedSale.customer_name}</span></div>
              <div className="flex justify-between"><span>Jumla:</span> <span className="font-bold text-emerald-600">TZS {completedSale.total_amount?.toLocaleString()}</span></div>
            </div>
            <button onClick={() => setCompletedSale(null)} className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer">
              Funga Risiti
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}