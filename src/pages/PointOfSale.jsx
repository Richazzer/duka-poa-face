import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Store 
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { api } from '../config';

export default function PointOfSale() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  const [paymentType, setPaymentType] = useState('Cash');
  const [customerName, setCustomerName] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products/');
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
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
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
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price || item.selling_price || 0);
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const handleRecordSale = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const payload = {
      total_amount: cartTotal,
      payment_method: paymentType,
      customer_name: customerName.trim() || 'Mteja wa Kawaida',
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: Number(i.price || i.selling_price || 0)
      }))
    };

    try {
      const res = await api.post('/sales/', payload);

      if (paymentType === 'Deni') {
        try {
          await api.post('/debts/', {
            customer_name: payload.customer_name,
            amount_owed: cartTotal,
            notes: `Mauzo ya bidhaa ${cart.length}`,
            is_paid: false
          });
        } catch (err) {}
      }

      setCompletedSale({ ...payload, id: res.data.id || `RCP-${Date.now()}` });
      setCart([]);
      setIsCheckoutOpen(false);
      setCustomerName('');
      fetchProducts();
    } catch (err) {
      alert('Imeshindikana kurekodi mauzo. Hakikisha umeingia kwenye akaunti yako.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4 select-none font-sans pb-28">
      {/* Top Bar */}
      <div className="bg-white/85 dark:bg-[#151c28]/85 backdrop-blur-2xl p-4 rounded-[26px] border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_25px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa kuanza mauzo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={fetchProducts}
          className="p-2.5 rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="bg-white/80 dark:bg-[#151c28]/80 rounded-[28px] p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
              <Store className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-white">Hakuna Bidhaa</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Weka bidhaa kwenye tab ya Stock (📦) ili zianze kuonekana hapa kwenye POS.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((prod) => {
                const price = prod.price || prod.selling_price || 0;
                const stock = prod.stock ?? prod.stock_quantity ?? 0;
                const inCart = cart.find((c) => c.id === prod.id);

                return (
                  <div
                    key={prod.id}
                    onClick={() => stock > 0 && addToCart(prod)}
                    className={`relative p-4 rounded-2xl bg-white/85 dark:bg-[#151c28]/85 border transition-all ${
                      stock > 0
                        ? inCart
                          ? 'border-blue-500 shadow-sm scale-[1.01]'
                          : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-400 cursor-pointer'
                        : 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {inCart && (
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                        {inCart.quantity}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {prod.category || 'Duka'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 truncate">{prod.name}</h4>
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 mt-1">TZS {Number(price).toLocaleString()}</p>
                    <span className="text-[10px] text-slate-400 block mt-2">Stock: {stock}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="lg:col-span-1 bg-white/85 dark:bg-[#151c28]/85 backdrop-blur-2xl p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" /> Orodha ya Mauzo
            </h2>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-rose-500 hover:text-rose-600 font-bold cursor-pointer">
                Futa
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto scrollbar-none">
            {cart.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Bofya bidhaa upande wa kushoto kuziweka hapa.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex-1 truncate mr-2">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-slate-400 text-[11px]">TZS {Number(item.price || item.selling_price || 0).toLocaleString()} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 cursor-pointer">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 cursor-pointer">
                      <Plus className="w-3 h-3" />
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
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 disabled:opacity-40 active:scale-95 transition-all cursor-pointer"
            >
              Kamilisha Mauzo ({cart.length}) ➔
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} title="Kamilisha Mauzo">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Jina la Mteja (Hiari)</label>
            <input
              type="text"
              placeholder="Mf. Juma Ali"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">Aina ya Mauzo</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Cash', label: 'Cash' },
                { id: 'Simu', label: 'Simu (M-Pesa)' },
                { id: 'Deni', label: 'Deni (Mkopo)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentType(m.id)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    paymentType === m.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex justify-between text-xs font-bold border border-blue-200 dark:border-blue-900/40">
            <span className="text-slate-700 dark:text-slate-300">Jumla ya Mauzo:</span>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-black">TZS {cartTotal.toLocaleString()}</span>
          </div>

          <button
            onClick={handleRecordSale}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-600/30"
          >
            {loading ? 'Inarekodi...' : 'Hifadhi Mauzo na Toa Risiti ➔'}
          </button>
        </div>
      </Modal>

      {/* Receipt Modal */}
      {completedSale && (
        <Modal isOpen={true} onClose={() => setCompletedSale(null)} title="Risiti ya Mauzo">
          <div className="space-y-4 text-center py-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Mauzo Yamerekodiwa!</h3>
              <p className="text-xs text-slate-400">Risiti Na: #{completedSale.id}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Mteja:</span> 
                <span className="font-bold text-slate-800 dark:text-white">{completedSale.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Aina:</span> 
                <span className="font-bold text-slate-800 dark:text-white">{completedSale.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jumla Kuu:</span> 
                <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                  TZS {completedSale.total_amount?.toLocaleString()}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setCompletedSale(null)} 
              className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer"
            >
              Mteja Mwingine (Next) ➔
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
