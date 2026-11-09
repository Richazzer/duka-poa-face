import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { api, getErrorMessage } from '../api';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Store,
  AlertTriangle
} from 'lucide-react';
import Modal from '../components/common/Modal';


const DEFAULT_CUSTOMER = 'Mteja wa Kawaida';

const PAYMENT_TYPES = [
  { id: 'Cash', label: 'Cash' },
  { id: 'Simu', label: 'Simu (M-Pesa)' },
  { id: 'Deni', label: 'Deni (Mkopo)' }
];

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

export default function PointOfSale() {
  const [products, setProducts] = useState([]);
  // Cart only stores { id, quantity }. Name, price and stock are always read
  // from the latest product data so they can never go stale.
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false); // fetching products
  const [submitting, setSubmitting] = useState(false); // recording a sale
  const [error, setError] = useState(''); // product list error
  const [notice, setNotice] = useState(''); // short cart hints (stock limit etc.)
  const [checkoutError, setCheckoutError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [retryingDebt, setRetryingDebt] = useState(false);
  const [debtRetryError, setDebtRetryError] = useState('');

  // Form states for checkout
  const [paymentType, setPaymentType] = useState('Cash');
  const [customerName, setCustomerName] = useState('');

  // Refs: block double submits and avoid updates after unmount
  const mountedRef = useRef(true);
  const submittingRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Auto-hide short notices
  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  // 1. Fetch live products from Django
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/products/');
      if (mountedRef.current) setProducts(extractList(res.data));
    } catch (e) {
      console.warn('Could not fetch products:', e);
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

  // 2. Cart Operations (never allow more than what is in stock)
  const addToCart = (product) => {
    const stock = getStock(product);
    const current = cart.find((c) => c.id === product.id)?.quantity ?? 0;

    if (stock <= 0) return;
    if (current + 1 > stock) {
      setNotice(`"${product.name}" ina stoo ya ${stock} tu.`);
      return;
    }

    setCart((prev) => {
      const exists = prev.find((c) => c.id === product.id);
      if (exists) {
        return prev.map((c) => (c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { id: product.id, quantity: 1 }];
    });
  };

  const updateQuantity = (line, delta) => {
    if (delta > 0 && line.quantity + delta > line.stock) {
      setNotice(`"${line.name}" ina stoo ya ${line.stock} tu.`);
      return;
    }

    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id !== line.id) return c;
          const next = c.quantity + delta;
          return next > 0 ? { ...c, quantity: next } : null;
        })
        .filter(Boolean)
    );
  };

  // Cart lines joined with live product data
  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const cartLines = useMemo(
    () =>
      cart
        .map((c) => {
          const p = productMap.get(c.id);
          if (!p) return null;
          const stock = getStock(p);
          return {
            id: c.id,
            name: p.name,
            price: getPrice(p),
            stock,
            quantity: c.quantity,
            overStock: c.quantity > stock
          };
        })
        .filter(Boolean),
    [cart, productMap]
  );

  const cartTotal = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [cartLines]
  );

  const hasStockIssue = cartLines.some((l) => l.overStock);

  const closeCheckout = () => {
    if (submitting) return;
    setIsCheckoutOpen(false);
    setCheckoutError('');
  };

  // 3. Complete Sale in Django (Records transaction & decrements stock)
  const handleRecordSale = async () => {
    if (submittingRef.current || cartLines.length === 0) return;

    const name = customerName.trim();

    if (hasStockIssue) {
      setCheckoutError('Baadhi ya bidhaa zimezidi stoo iliyopo. Punguza idadi kisha jaribu tena.');
      return;
    }
    if (cartTotal <= 0) {
      setCheckoutError('Jumla ya mauzo lazima iwe kubwa kuliko 0.');
      return;
    }
    if (paymentType === 'Deni' && !name) {
      setCheckoutError('Andika jina la mteja ili kurekodi deni.');
      return;
    }

    const customer = name || DEFAULT_CUSTOMER;

    const payload = {
      total_amount: cartTotal,
      amount: cartTotal,
      total: cartTotal,
      payment_method: paymentType,
      customer_name: customer,
      items: cartLines.map((l) => ({
        id: l.id,
        product_id: l.id,
        name: l.name,
        quantity: l.quantity,
        qty: l.quantity,
        price: l.price
      }))
    };

    const debtPayload = {
      customer_name: customer,
      name: customer,
      amount_owed: cartTotal,
      amount: cartTotal,
      notes: `Mauzo ya bidhaa ${cartLines.length}`,
      is_paid: false
    };

    submittingRef.current = true;
    setSubmitting(true);
    setCheckoutError('');

    try {
      const res = await api.post('/sales/', payload);
      if (!mountedRef.current) return;

      // If marked as Deni, write to customer debt ledger automatically
      let debtSynced = true;
      if (paymentType === 'Deni') {
        try {
          await api.post('/debts/', debtPayload);
        } catch (debtErr) {
          console.warn('Debt sync failed:', debtErr);
          debtSynced = false;
        }
      }
      if (!mountedRef.current) return;

      setCompletedSale({
        ...payload,
        id: res.data?.id ?? `RCP-${Date.now()}`,
        debtSynced,
        debtPayload: paymentType === 'Deni' ? debtPayload : null
      });
      setDebtRetryError('');
      setCart([]);
      setIsCheckoutOpen(false);
      setCustomerName('');
      setPaymentType('Cash'); // next sale never starts as "Deni" by accident
      fetchProducts(); // Auto-refreshes database stock
    } catch (err) {
      console.error('Sale error:', err.response?.data || err);
      if (mountedRef.current) {
        setCheckoutError(getErrorMessage(err, 'Imeshindikana kurekodi mauzo. Jaribu tena.'));
      }
    } finally {
      submittingRef.current = false;
      if (mountedRef.current) setSubmitting(false);
    }
  };

  // Retry saving the debt if the sale went through but the debt did not
  const handleRetryDebt = async () => {
    if (!completedSale?.debtPayload || retryingDebt) return;
    setRetryingDebt(true);
    setDebtRetryError('');
    try {
      await api.post('/debts/', completedSale.debtPayload);
      if (mountedRef.current) {
        setCompletedSale((prev) => (prev ? { ...prev, debtSynced: true } : prev));
      }
    } catch (err) {
      console.warn('Debt retry failed:', err);
      if (mountedRef.current) {
        setDebtRetryError(getErrorMessage(err, 'Imeshindikana kuhifadhi deni. Jaribu tena.'));
      }
    } finally {
      if (mountedRef.current) setRetryingDebt(false);
    }
  };

  // Safe filter logic
  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => (p.name || '').toLowerCase().includes(q));
  }, [products, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-4 select-none font-sans pb-32">

      {/* Top Search & Refresh Bar */}
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
          disabled={loading}
          className="p-2.5 rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-60"
          title="Sawazisha Bidhaa"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
        </button>
      </div>

      {/* Error Banner (product list) */}
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

      {/* Main POS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Products Grid (Left) */}
        <div className="lg:col-span-2">
          {loading && products.length === 0 ? (
            <div className="bg-white/80 dark:bg-[#151c28]/80 rounded-[28px] p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
              <p className="text-xs text-slate-500">Inapakia bidhaa...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white/80 dark:bg-[#151c28]/80 rounded-[28px] p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
              <Store className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-white">Hakuna Bidhaa</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Weka bidhaa kwenye tab ya Stock (📦) ili zianze kuonekana hapa kwenye POS.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((prod) => {
                const price = getPrice(prod);
                const stock = getStock(prod);
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
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 truncate">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 mt-1">
                      TZS {price.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      Stock: {stock}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Cart (Right) */}
        <div className="lg:col-span-1 bg-white/85 dark:bg-[#151c28]/85 backdrop-blur-2xl p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" /> Orodha ya Mauzo
            </h2>
            {cartLines.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
              >
                Futa
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto scrollbar-none">
            {cartLines.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                Bofya bidhaa upande wa kushoto kuziweka hapa.
              </p>
            ) : (
              cartLines.map((line) => (
                <div
                  key={line.id}
                  className={`flex items-center justify-between text-xs p-2 rounded-xl ${
                    line.overStock
                      ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60'
                      : 'bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="flex-1 truncate mr-2">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{line.name}</p>
                    <p className="text-slate-400 text-[11px]">
                      TZS {line.price.toLocaleString()} x {line.quantity}
                    </p>
                    {line.overStock && (
                      <p className="text-rose-500 text-[10px] font-bold">
                        Stoo iliyopo: {line.stock}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(line, -1)}
                      className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 cursor-pointer"
                      title={line.quantity === 1 ? 'Ondoa' : 'Punguza 1'}
                    >
                      {line.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="font-bold w-4 text-center text-slate-900 dark:text-white">{line.quantity}</span>
                    <button
                      onClick={() => updateQuantity(line, 1)}
                      className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 cursor-pointer"
                      title="Ongeza 1"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
            {notice && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{notice}</p>
              </div>
            )}

            {hasStockIssue && (
              <p className="text-[11px] font-bold text-rose-500">
                Stoo imebadilika. Punguza idadi ya bidhaa zilizozidi ili kuendelea.
              </p>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-500">Jumla Kuu:</span>
              <span className="font-black text-lg text-slate-900 dark:text-white">
                TZS {cartTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                setCheckoutError('');
                setIsCheckoutOpen(true);
              }}
              disabled={cartLines.length === 0 || hasStockIssue}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 disabled:opacity-40 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Kamilisha Mauzo ({cartLines.length}) ➔
            </button>
          </div>
        </div>

      </div>

      {/*
        ========================================================================
        CHECKOUT MODAL: HIGH-CONTRAST TEXT & CLEAR BUTTONS
        ========================================================================
      */}
      <Modal isOpen={isCheckoutOpen} onClose={closeCheckout} title="Kamilisha Mauzo">
        <div className="space-y-4">

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
              {paymentType === 'Deni' ? 'Jina la Mteja (Lazima)' : 'Jina la Mteja (Hiari)'}
            </label>
            <input
              type="text"
              placeholder="Mf. Mteja wa Kawaida au Juma Ali"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2332] text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 caret-blue-500"
            />
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wider">
              Aina ya Mauzo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_TYPES.map((m) => (
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

          {/* Summary Box */}
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex justify-between text-xs font-bold border border-blue-200 dark:border-blue-900/40">
            <span className="text-slate-700 dark:text-slate-300">Jumla ya Mauzo:</span>
            <span className="text-blue-600 dark:text-blue-400 text-sm font-black">
              TZS {cartTotal.toLocaleString()}
            </span>
          </div>

          {/* Checkout error (replaces the old browser alert) */}
          {checkoutError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{checkoutError}</p>
            </div>
          )}

          <button
            onClick={handleRecordSale}
            disabled={submitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Inarekodi...' : 'Hifadhi Mauzo na Toa Risiti ➔'}
          </button>
        </div>
      </Modal>

      {/*
        ========================================================================
        DIGITAL RECEIPT PREVIEW MODAL
        ========================================================================
      */}
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
                  TZS {Number(completedSale.total_amount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Debt not saved: tell the cashier and let them retry */}
            {completedSale.debtPayload && !completedSale.debtSynced && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-left space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Mauzo yamerekodiwa, lakini deni halijahifadhiwa kwenye orodha ya madeni.
                    Bofya hapa chini kujaribu tena kabla ya kufunga risiti.
                  </p>
                </div>
                {debtRetryError && (
                  <p className="text-[11px] font-bold text-rose-500">{debtRetryError}</p>
                )}
                <button
                  onClick={handleRetryDebt}
                  disabled={retryingDebt}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {retryingDebt ? 'Inahifadhi...' : 'Hifadhi Deni Tena'}
                </button>
              </div>
            )}

            {completedSale.debtPayload && completedSale.debtSynced && (
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Deni limehifadhiwa kwenye orodha ya madeni.
              </p>
            )}

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
