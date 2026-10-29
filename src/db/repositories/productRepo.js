import { db } from '../dexie';
import api from '../../services/api';

export const getAllProducts = async () => {
  try {
    const res = await api.get('/products/');
    if (res.data && Array.isArray(res.data)) {
      await db.products.bulkPut(res.data);
      return res.data;
    }
  } catch (err) {
    console.warn("Offline or Django API unavailable, loading from local Dexie:", err);
  }
  return db.products.toArray();
};

export const getProductByBarcode = (barcode) => db.products.where('barcode').equals(barcode).first();
export const saveProduct = (product) => db.products.put(product);
