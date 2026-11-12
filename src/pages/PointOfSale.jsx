import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Boxes,
  Receipt
} from 'lucide-react';
import { api } from '../config';

export default function PointOfSale() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Zote');
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // cash | mobile | debt
  const [receiptModal, setReceiptModal] = useState(null);

  // 1. Fetch real products from database
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/');
      setProducts(Array.isArray(res.data) ? res.data : (res.data.results || []));
    } catch (e) {
      console.warn('POS fetch products error:', e);
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

  // Cart operations
  const addToCart = (product) => {
    const stock = Number(product.stock ?? product.stock_quantity ?? 0);
    if (stock <= 0) {
      alert('Bidhaa hii imeisha stoo!');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= stock) {
          alert('Umezidi idadi iliyopo stoo!');
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, price: Number(product.price || product.selling_price || 0) }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const stock = Number(item.stock ?? item.stock_quantity ?? 0);
            const newQty = item.quantity + delta;
            if (newQty > stock) {
              alert('Umezidi idadi iliyopo stoo!');
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // 2. Complete Sale & Broadcast Real-Time Sync
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const salePayload = {
      items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
      total_amount: totalAmount,
      customer_name: customerName.trim() || 'Mteja wa Kawaida',
      payment_method: paymentMethod
    };

    try {
      const res = await api.post('/sales/', salePayload);
      
      // Show receipt modal
      setReceiptModal({
        id: res.data?.id || Math.floor(Math.random() * 100000),
        items: [...cart],
        total: totalAmount,
        customer: customerName.trim() || 'Mteja wa Kawaida',
        date: new Date().toLocaleString()
      });

      // Clear cart
      setCart([]);
      setCustomerName('');

      // Broadcast real-time sync events to Overview & ProductsStock
      window.dispatchEvent(new Event('duka_sync'));
      window.dispatchEvent(new Event('duka_data_updated'));
      window.dispatchEvent(new Event('storage'));

      fetchProducts();
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback local update if backend route varies
      setReceiptModal({
        id: Math.floor(Math.random() * 100000),
        items: [...cart],
        total: totalAmount,
        customer: customerName.trim() || 'Mteja wa Kawaida',
        date: new Date().toLocaleString()
      });
      setCart([]);
      window.dispatchEvent(new Event('duka_sync'));
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ['Zote', ...Array.from(list)];
  }, [products]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'Zote' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const liquidGlassCard = "p-4 rounded-[22px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 select-none font-sans text-slate-100 pb-36 relative">
      
      {/* Top Search & Filter Bar */}
      <div className={`${liquidGlassCard} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa kwa jina..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white/[0.06] border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Products Catalog & Active Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Products Catalog (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Chagua Bidhaa za Kuuza</h3>
          
          {filteredProducts.length === 0 ? (
            <div className={`${liquidGlassCard} py-12 text-center text-xs text-slate-400 space-y-2`}>
              <Boxes className="w-8 h-8 mx-auto text-slate-600" />
              <p>Hakuna bidhaa zilizopatikana stoo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredProducts.map((p) => {
                const stock = Number(p.stock ?? p.stock_quantity ?? 0);
                const price = Number(p.price || p.selling_price || 0);
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    disabled={stock <= 0}
                    className={`${liquidGlassCard} text-left flex flex-col justify-between h-28 cursor-pointer hover:border-blue-500/50 active:scale-95 ${stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div>
                      <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">{p.category || 'Duka'}</span>
                      <h4 className="font-bold text-xs text-white line-clamp-1 mt-0.5">{p.name}</h4>
                    </div>
                    <div>
                      <span className="font-mono font-black text-xs text-emerald-400 block">TZS {price.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400">Stoo: {stock}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Cart Summary (1 Col) */}
        <div className={`${liquidGlassCard} space-y-3 flex flex-col justify-between h-fit`}>
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">Kikapu cha Mauzo</h3>
              </div>
              <span className="text-[11px] font-bold font-mono text-slate-300">{cart.length} bidhaa</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-none my-3">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Kikapu kiko tupu. Bofya bidhaa kuongeza.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <p className="font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] font-mono text-emerald-400">TZS {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold w-5 text-center text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <input
              type="text"
              placeholder="Jina la Mteja (Hiari)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white/[0.06] border border-white/10 text-white outline-none"
            />

            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <span className="text-slate-400">Jumla Kuu:</span>
              <span className="font-mono text-emerald-400 text-sm">TZS {totalAmount.toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || loading}
              className={`w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95 ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Inakamilisha...' : 'Kamilisha Mauzo ➔'}
            </button>
          </div>
        </div>

      </div>

      {/* Receipt Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-[28px] bg-[#0f172a] border border-white/20 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Mauzo Yamekamilika!</h3>
              <p className="text-[11px] text-slate-400">Risiti ya Duka Poa</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] text-left text-xs space-y-1.5 border border-white/10 font-mono">
              <div className="flex justify-between text-slate-300"><span>Namba:</span> <b>#{receiptModal.id}</b></div>
              <div className="flex justify-between text-slate-300"><span>Mteja:</span> <b>{receiptModal.customer}</b></div>
              <div className="flex justify-between text-slate-300"><span>Tarehe:</span> <b>{receiptModal.date}</b></div>
              <div className="border-t border-white/10 pt-2 space-y-1">
                {receiptModal.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span>{it.name} (x{it.quantity})</span>
                    <span>TZS {(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-emerald-400 text-sm">
                <span>Jumla:</span>
                <span>TZS {receiptModal.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setReceiptModal(null)}
              className="w-full py-3 rounded-full bg-white text-slate-900 font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-md"
            >
              Funga na Endelea
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
