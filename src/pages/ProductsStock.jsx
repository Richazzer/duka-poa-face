import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { formatTZS } from '../utils/currency';
import { getAllProducts, saveProduct } from '../db/repositories/productRepo';
import { Plus } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export default function ProductsStock() {
  const { t } = useLanguageStore();
  const [products, setProducts] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', sellingPrice: '', stockQuantity: '' });

  const loadProducts = () => {
    getAllProducts().then(setProducts).catch(() => setProducts([]));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await saveProduct({
      id: `PROD-${Date.now()}`,
      name: form.name,
      category: form.category || 'Duka',
      sellingPrice: Number(form.sellingPrice),
      stockQuantity: Number(form.stockQuantity)
    });
    setIsAddOpen(false);
    setForm({ name: '', category: '', sellingPrice: '', stockQuantity: '' });
    loadProducts();
  };

  const columns = [
    { header: 'Jina la Bidhaa', accessor: 'name' },
    { header: 'Kipengele', accessor: 'category' },
    { header: 'Bei ya Kuuza', render: (row) => formatTZS(row.sellingPrice) },
    { header: 'Stock Baki', accessor: 'stockQuantity' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('products')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Bidhaa zote zinatoka moja kwa moja kupitia Django API</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}><Plus className="w-4 h-4" /> {t('add_product')}</Button>
      </div>

      <DataTable columns={columns} data={products} emptyMessage="Hakuna bidhaa kutoka Django backend. Ongeza bidhaa mpya au unganisha Django API." />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Ongeza Bidhaa Mpya (Django Sync)">
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jina la Bidhaa</label>
            <input 
              required
              type="text" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kipengele (Category)</label>
            <input 
              type="text" 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bei ya Kuuza (TZS)</label>
              <input 
                required
                type="number" 
                value={form.sellingPrice} 
                onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
              <input 
                required
                type="number" 
                value={form.stockQuantity} 
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4 py-3 font-bold">Hifadhi na Tuma Django</Button>
        </form>
      </Modal>
    </div>
  );
}
