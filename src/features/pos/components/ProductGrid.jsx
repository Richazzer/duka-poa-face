import React from 'react';
import Card from '../../../components/common/Card';
import { formatTZS } from '../../../utils/currency';
import { Plus, Package } from 'lucide-react';
import { useLanguageStore } from '../../../store/useLanguageStore';

export default function ProductGrid({ products, onAddToCart }) {
  const { t } = useLanguageStore();

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-1" />
        <h4 className="font-bold text-slate-700 text-base">{t('no_products')}</h4>
        <p className="text-xs text-slate-500 mt-1">Unganisha Django API kuleta bidhaa na bei halisi.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="cursor-pointer hover:border-emerald-500 hover:shadow-lg transition-all p-3.5 flex flex-col justify-between active:scale-95 group"
          onClick={() => onAddToCart(product)}
        >
          <div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{product.category || 'Django Data'}</span>
            <h4 className="font-bold text-slate-800 text-sm leading-tight mt-1.5 group-hover:text-emerald-700 transition-colors">{product.name}</h4>
          </div>
          <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <span className="font-black text-slate-900 text-sm">{formatTZS(product.sellingPrice)}</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
