import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Store, 
  PauseCircle, 
  PlayCircle,
  Printer,
  Share2,
  Clock,
  Receipt,
  FileText
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { api } from '../config';

export default function PointOfSale() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Zote');
  const [loading, setLoading] = useState(false);

  // Held Carts
  const [heldCarts, setHeldCarts] = useState([]);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [pastSales, setPastSales] = useState([]);
  const [viewingPastReceipt, setViewingPastReceipt] = useState(null);

  // Checkout Form States
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Cash, M-Pesa, Airtel Money, Mixx by Yas, Deni
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cashTendered, setCashTendered] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');

  // 1. Fetch Real Products from Database
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

  // 2. Fetch Past Receipts History
  const fetchPastSales = async () => {
    try {
      const res = await api.get('/sales/');
      setPastSales(res.data || []);
    } catch (e) {
      console.warn('Could not fetch sales history:', e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPastSales();
  }, []);

  // 3. Cart Management
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
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price || item.selling_price || 0);
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const discount = Number(discountAmount) || 0;
  const grandTotal = Math.max(0, subtotal - discount);

  // Cash Change (Chenji) Calculator
  const changeDue = useMemo(() => {
    const given = Number(cashTendered) || 0;
    if (given <= 0 || given < grandTotal) return 0;
    return given - grandTotal;
  }, [cashTendered, grandTotal]);

  // Hold Cart Feature
  const handleHoldCart = () => {
    if (cart.length === 0) return;
    setHeldCarts((prev) => [
      ...prev,
      {
        id: `HOLD-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: cart,
        total: grandTotal
      }
    ]);
    setCart([]);
  };

  const handleResumeCart = (heldId) => {
    const target = heldCarts.find((h) => h.id === heldId);
    if (!target) return;
    setCart(target.items);
    setHeldCarts((prev) => prev.filter((h) => h.id !== heldId));
  };

  // =========================================================================
  // 4. THE COMPLETE SALE FUNCTION (WIRED DIRECTLY & EMITS LIVE SYNC)
  // =========================================================================
  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const salePayload = {
      total_amount: grandTotal,
      payment_method: paymentMethod,
      customer_name: customerName.trim() || 'Mteja wa Kawaida',
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: Number(i.price || i.selling_price || 0)
      }))
    };

    try {
      const res = await api.post('/sales/', salePayload);

      // If customer bought on credit (Deni), record in debt ledger
      if (paymentMethod === 'Deni') {
        try {
          await api.post('/debts/', {
            customer_name: salePayload.customer_name,
            amount_owed: grandTotal,
            phone: customerPhone.trim(),
            notes: `Mauzo ya kaunta (Bidhaa ${cart.length})`,
            is_paid: false
          });
        } catch (err) {}
      }

      const receiptData = {
        ...salePayload,
        id: res.data?.id || `RCP-${Date.now()}`,
        subtotal,
        discount,
        change: changeDue,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('sw-TZ')
      };

      setCompletedSale(receiptData);
      setCart([]);
      setIsCheckoutOpen(false);
      setCashTendered('');
      setDiscountAmount('');
      setCustomerName('');
      setCustomerPhone('');

      fetchProducts();
      fetchPastSales();

      // 💥 INSTANT LIVE SYNC TO OVERVIEW TAB 💥
      localStorage.removeItem('duka_cached_overview');
      window.dispatchEvent(new CustomEvent('duka_sync'));

    } catch (err) {
      console.error('Sale failed:', err);
      alert('Imeshindikana kurekodi mauzo. Hakikisha mtandao uko sawa.');
    } finally {
      setLoading(false);
    }
  };

  // Share via WhatsApp
  const handleShareWhatsApp = (sale) => {
    if (!sale) return;
    let cleanPhone = (customerPhone || sale.phone || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '255' + cleanPhone.slice(1);

    const msg = encodeURIComponent(
      `🧾 *RISITI YA DUKA POA*\n` +
      `Risiti Na: #${sale.id}\n` +
      `Tarehe: ${sale.date || 'Leo'} ${sale.time || ''}\n` +
      `Mteja: ${sale.customer_name}\n` +
      `Malipo: ${sale.payment_method}\n` +
      `Jumla: TZS ${Number(sale.total_amount).toLocaleString()}\n` +
      `Ahsante kwa kufanya biashara nasi!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category).filter(Boolean));
    return ['Zote', ...Array.from(list)];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'Zote' || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4 select-none font-sans pb-32 text-slate-100">
      
      {/* 
        ========================================================================
        TOP SPEED BAR: Search, Barcode Input, Receipt History, Live Sync
        ========================================================================
      */}
      <div className="bg-[#131926]/90 backdrop-blur-3xl p-4 rounded-[26px] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa kwa jina au barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-[#1a2336] border border-slate-700/80 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Held Carts Counter */}
          {heldCarts.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{heldCarts.length} Zilizosimama</span>
            </div>
          )}

          {/* 💥 PAST RECEIPTS HISTORY BUTTON (Where every receipt is stored) 💥 */}
          <button
            onClick={() => {
              fetchPastSales();
              setIsHistoryOpen(true);
            }}
            className="py-2.5 px-4 rounded-full bg-[#1a2336] hover:bg-slate-700/70 border border-slate-700/80 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Tazama Risiti Zilizopita"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Risiti ({pastSales.length})</span>
          </button>

          {/* Refresh Products */}
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-full bg-[#1a2336] text-slate-300 hover:text-white hover:bg-slate-700/70 border border-slate-700/80 transition-all cursor-pointer"
            title="Sawazisha Bidhaa"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`py-1.5 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#131926]/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-[#1a2336]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Parked Carts Quick Resume Bar */}
      {heldCarts.length > 0 && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 overflow-x-auto">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 shrink-0">
            <PauseCircle className="w-4 h-4" /> Wateja Waliosimama:
          </span>
          <div className="flex items-center gap-2">
            {heldCarts.map((h) => (
              <button
                key={h.id}
                onClick={() => handleResumeCart(h.id)}
                className="py-1 px-3 bg-[#1a2336] border border-amber-500/40 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{h.time} (TZS {h.total.toLocaleString()})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        MAIN REGISTER GRID: Product Grid (Left) + Cart (Right)
        ========================================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Products Grid */}
        <div className="lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-[28px] bg-[#131926]/90 border border-white/10 space-y-2">
              <Store className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="font-bold text-white">Hakuna Bidhaa Iliyopatikana</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Ingiza bidhaa kwenye tab ya Stoo (📦) ili zianze kuonekana hapa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((prod) => {
                const price = Number(prod.price || prod.selling_price || 0);
                const stock = Number(prod.stock ?? prod.stock_quantity ?? 0);
                const inCart = cart.find((c) => c.id === prod.id);

                return (
                  <div
                    key={prod.id}
                    onClick={() => stock > 0 && addToCart(prod)}
                    className={`relative p-4 rounded-[22px] bg-[#131926]/90 border transition-all ${
                      stock > 0
                        ? inCart
                          ? 'border-blue-500 bg-blue-950/20 shadow-md scale-[1.01]'
                          : 'border-white/10 hover:border-blue-400/50 hover:scale-[1.01] cursor-pointer'
                        : 'opacity-40 cursor-not-allowed border-slate-800'
                    }`}
                  >
                    {inCart && (
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                        {inCart.quantity}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {prod.category || 'Duka'}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1 truncate">{prod.name}</h4>
                    <p className="text-xs font-black text-blue-400 mt-1">TZS {price.toLocaleString()}</p>
                    <span className="text-[10px] text-slate-500 block mt-2">Stock: {stock}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Running Cart Column */}
        <div className="lg:col-span-1 bg-[#131926]/90 backdrop-blur-3xl p-5 rounded-[28px] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.3)] space-y-4 sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-black text-white text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-400" /> Orodha ya Mauzo
            </h2>
            
            {cart.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHoldCart}
                  className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                  title="Simamisha Mauzo haya"
                >
                  <PauseCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCart([])} 
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Futa Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-none">
            {cart.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                Bofya bidhaa upande wa kushoto kuziweka kwenye orodha.
              </p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#192132]">
                  <div className="flex-1 truncate mr-2">
                    <p className="font-bold text-white truncate">{item.name}</p>
                    <p className="text-slate-400 text-[11px]">
                      TZS {Number(item.price || item.selling_price || 0).toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="p-1 rounded-md bg-[#232d42] text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold w-4 text-center text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      className="p-1 rounded-md bg-[#232d42] text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals & Discount */}
          <div className="border-t border-slate-800 pt-3 space-y-2.5">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Jumla Ndogo:</span>
              <span className="font-bold text-white">TZS {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Punguzo (Discount):</span>
              <input
                type="number"
                placeholder="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-24 px-2 py-1 rounded-lg bg-[#192132] border border-slate-700 text-right text-xs text-white outline-none font-bold"
              />
            </div>

            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800/80">
              <span className="font-bold text-slate-300">Jumla ya Kulipa:</span>
              <span className="font-black text-xl text-blue-400">
                TZS {grandTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              disabled={cart.length === 0}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-600/30 disabled:opacity-40 active:scale-95 transition-all cursor-pointer"
            >
              Kamilisha Mauzo ({cart.length}) ➔
            </button>
          </div>
        </div>

      </div>

      {/* 
        ========================================================================
        CHECKOUT MODAL: Payment Options & Instant Chenji Calculator
        ========================================================================
      */}
      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} title="Kamilisha Malipo">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
              Jina la Mteja (Hiari)
            </label>
            <input
              type="text"
              placeholder="Mf. Mama Baraka au Juma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#1a2336] text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Njia ya Malipo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Cash', label: 'Cash' },
                { id: 'M-Pesa', label: 'M-Pesa' },
                { id: 'Airtel Money', label: 'Airtel' },
                { id: 'Mixx by Yas', label: 'Mixx (Tigo)' },
                { id: 'Deni', label: 'Deni (Credit)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                      : 'border-slate-700 text-slate-400 bg-[#192132] hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cash Change Calculator */}
          {paymentMethod === 'Cash' && (
            <div className="p-3.5 bg-[#192132] rounded-2xl space-y-2 border border-slate-700">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pesa Iliyotolewa na Mteja (TZS)
              </label>
              
              <input
                type="number"
                placeholder={`Mf. ${grandTotal.toLocaleString()}`}
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121722] border border-slate-700 text-white font-bold text-sm outline-none"
              />

              <div className="flex gap-1.5 pt-1">
                {[grandTotal, 2000, 5000, 10000, 20000, 50000]
                  .filter((v, i, a) => v >= grandTotal && a.indexOf(v) === i)
                  .slice(0, 4)
                  .map((bill) => (
                    <button
                      key={bill}
                      type="button"
                      onClick={() => setCashTendered(bill.toString())}
                      className="px-2.5 py-1 rounded-lg bg-[#232d42] border border-slate-600 text-[10px] font-bold text-slate-300"
                    >
                      {bill === grandTotal ? 'Kamili' : bill.toLocaleString()}
                    </button>
                  ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-700 text-xs font-bold">
                <span className="text-slate-400">Chenji ya Kurudisha:</span>
                <span className="text-emerald-400 font-mono font-black text-sm">
                  TZS {changeDue.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'Deni' && (
            <div>
              <label className="block text-xs font-bold text-amber-400 mb-1 uppercase tracking-wider">
                Namba ya Simu (WhatsApp ya Mteja)
              </label>
              <input
                type="text"
                placeholder="0712345678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/40 bg-[#1a2336] text-white text-sm outline-none"
              />
            </div>
          )}

          <div className="p-3 bg-blue-950/40 rounded-xl flex justify-between text-xs font-bold border border-blue-800/40">
            <span className="text-slate-300">Jumla ya Mauzo:</span>
            <span className="text-blue-400 text-sm font-black">TZS {grandTotal.toLocaleString()}</span>
          </div>

          {/* 💥 CALLS handleCompleteSale 💥 */}
          <button
            onClick={handleCompleteSale}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-600/30"
          >
            {loading ? 'Inarekodi...' : 'Thibitisha na Toa Risiti ➔'}
          </button>
        </div>
      </Modal>

      {/* 
        ========================================================================
        NEW SALE RECEIPT MODAL
        ========================================================================
      */}
      {completedSale && (
        <Modal isOpen={true} onClose={() => setCompletedSale(null)} title="Risiti ya Mauzo">
          <div className="space-y-4 text-center py-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div>
              <h3 className="font-black text-lg text-white">Mauzo Yamerekodiwa!</h3>
              <p className="text-xs text-slate-400">Risiti Na: #{completedSale.id}</p>
            </div>

            <div className="p-4 bg-[#192132] rounded-2xl text-left text-xs space-y-2 border border-slate-800">
              <div className="flex justify-between"><span className="text-slate-400">Mteja:</span> <span className="font-bold text-white">{completedSale.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Malipo:</span> <span className="font-bold text-white">{completedSale.payment_method}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Jumla:</span> <span className="font-black text-blue-400 text-sm">TZS {completedSale.total_amount.toLocaleString()}</span></div>
              {completedSale.change > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-700 pt-1.5">
                  <span>Chenji:</span> <span>TZS {completedSale.change.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#232d42] hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print
              </button>

              <button
                onClick={() => handleShareWhatsApp(completedSale)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> WhatsApp
              </button>
            </div>

            <button 
              onClick={() => setCompletedSale(null)} 
              className="w-full py-3 bg-white text-slate-900 rounded-full text-xs font-black hover:bg-slate-100 cursor-pointer"
            >
              Mteja Mwingine (Next Sale) ➔
            </button>
          </div>
        </Modal>
      )}

      {/* 
        ========================================================================
        💥 PAST RECEIPTS HISTORY DRAWER (Where all past receipts are stored) 💥
        ========================================================================
      */}
      {isHistoryOpen && (
        <Modal isOpen={true} onClose={() => setIsHistoryOpen(false)} title="Historia ya Risiti Zilizopita">
          <div className="space-y-3">
            <p className="text-xs text-slate-400">Risiti zote zilizorekodiwa kwenye mfumo:</p>

            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-none">
              {pastSales.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Hakuna risiti zilizorekodiwa bado.
                </div>
              ) : (
                pastSales.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-2xl bg-[#192132] border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">#{s.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 font-mono">
                          {s.payment_method || 'Cash'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{s.customer_name || 'Mteja wa Kawaida'}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-sm text-white">
                        TZS {Number(s.total_amount || s.amount || 0).toLocaleString()}
                      </p>
                      <button
                        onClick={() => setViewingPastReceipt(s)}
                        className="text-[11px] font-bold text-blue-400 hover:underline mt-0.5 block"
                      >
                        Tazama Risiti ➔
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setIsHistoryOpen(false)}
              className="w-full py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
            >
              Funga
            </button>
          </div>
        </Modal>
      )}

      {/* Viewing an archived receipt */}
      {viewingPastReceipt && (
        <Modal isOpen={true} onClose={() => setViewingPastReceipt(null)} title={`Risiti #${viewingPastReceipt.id}`}>
          <div className="space-y-4 text-center py-2">
            <div className="p-4 bg-[#192132] rounded-2xl text-left text-xs space-y-2 border border-slate-800">
              <div className="flex justify-between"><span className="text-slate-400">Mteja:</span> <span className="font-bold text-white">{viewingPastReceipt.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Njia ya Malipo:</span> <span className="font-bold text-white">{viewingPastReceipt.payment_method}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Jumla:</span> <span className="font-black text-blue-400 text-sm">TZS {Number(viewingPastReceipt.total_amount || viewingPastReceipt.amount || 0).toLocaleString()}</span></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#232d42] hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={() => handleShareWhatsApp(viewingPastReceipt)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> WhatsApp
              </button>
            </div>

            <button 
              onClick={() => setViewingPastReceipt(null)} 
              className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Funga
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
