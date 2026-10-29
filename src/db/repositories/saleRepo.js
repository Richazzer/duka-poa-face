import { db } from '../dexie';
import api from '../../services/api';

export const recordSale = async (saleData) => {
  const saleWithMeta = {
    ...saleData,
    id: saleData.id || `SALE-${Date.now()}`,
    createdAt: new Date().toISOString(),
    syncStatus: 'pending'
  };

  await db.sales.add(saleWithMeta);

  try {
    await api.post('/sales/', saleWithMeta);
    saleWithMeta.syncStatus = 'synced';
  } catch (err) {
    // Graceful offline fallback
  }

  for (const item of saleData.items) {
    const product = await db.products.get(item.id);
    if (product) {
      await db.products.update(item.id, {
        stockQuantity: Math.max(0, product.stockQuantity - item.quantity)
      });
    }
  }

  return saleWithMeta;
};

export const getAllSales = async () => {
  try {
    const res = await api.get('/sales/');
    if (res.data && Array.isArray(res.data)) return res.data;
  } catch (err) {
    // Fallback to local Dexie storage when Django is offline
    return db.sales.toArray();
  }
};