import React, { useState, useEffect } from 'react';
import ProductGrid from '../features/pos/components/ProductGrid';
import CartView from '../features/pos/components/CartView';
import BarcodeScannerModal from '../features/pos/components/BarcodeScannerModal';
import PaymentModal from '../features/pos/components/PaymentModal';
import ReceiptPreview from '../features/pos/components/ReceiptPreview';
import Button from '../components/common/Button';
import { useCart } from '../features/pos/hooks/useCart';
import { recordSale } from '../db/repositories/saleRepo';
import { getAllProducts } from '../db/repositories/productRepo';
import { Camera, Search } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export default function PointOfSale() {
  const { t } = useLanguageStore();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [products, setProducts] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  useEffect(() => {
    getAllProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const handleConfirmPayment = async (method) => {
    const saleData = {
      items: cart,
      totalAmount: total,
      paymentMethod: method
    };
    const saved = await recordSale(saleData);
    setIsPaymentOpen(false);
    clearCart();
    setCompletedSale(saved);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-2 flex flex-col space-y-4">
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200/80 bg-white focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>
          <Button variant="outline" onClick={() => setIsScannerOpen(true)}>
            <Camera className="w-4 h-4 text-emerald-600" /> Scan
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ProductGrid products={products} onAddToCart={addToCart} />
        </div>
      </div>

      <div className="lg:col-span-1 h-full">
        <CartView 
          cart={cart} 
          onUpdateQuantity={updateQuantity} 
          onRemove={removeFromCart} 
          onClear={clearCart} 
          onCheckout={() => setIsPaymentOpen(true)} 
        />
      </div>

      <BarcodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        totalAmount={total}
        onConfirmPayment={handleConfirmPayment}
      />
      <ReceiptPreview 
        isOpen={!!completedSale} 
        onClose={() => setCompletedSale(null)} 
        sale={completedSale} 
      />
    </div>
  );
}
