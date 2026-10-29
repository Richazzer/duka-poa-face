import React from 'react';
import { formatTZS } from '../../../utils/currency';
import Button from '../../../components/common/Button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useLanguageStore } from '../../../store/useLanguageStore';

export default function CartView({ cart, onUpdateQuantity, onRemove, onClear, onCheckout }) {
  const { t } = useLanguageStore();
  const total = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 flex flex-col h-full shadow-md overflow-hidden">
      <div className="p-4.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-slate-800 text-base">{t('cart')}</h3>
        </div>
        {cart.length > 0 && (
          <button onClick={onClear} className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Futa
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-sm font-semibold">Cart iko wazi.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-xs">
              <div className="flex-1 min-w-0 pr-2">
                <p className="font-bold text-slate-800 text-xs truncate">{item.name}</p>
                <p className="text-xs text-emerald-600 font-extrabold">{formatTZS(item.sellingPrice)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-2xs active:scale-90 transition-transform"
                >
                  <Minus className="w-3 h-3 text-slate-600" />
                </button>
                <span className="font-black text-sm w-5 text-center text-slate-900">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-2xs active:scale-90 transition-transform"
                >
                  <Plus className="w-3 h-3 text-slate-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-5 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-bold text-sm">Jumla Kuu</span>
          <span className="text-2xl font-black text-emerald-600">{formatTZS(total)}</span>
        </div>
        <Button 
          className="w-full py-3.5 text-base font-black tracking-wide" 
          disabled={cart.length === 0}
          onClick={onCheckout}
        >
          {t('checkout')} ({cart.length})
        </Button>
      </div>
    </div>
  );
}
