import Dexie from 'dexie';

export const db = new Dexie('DukaPooaDatabase');

db.version(1).stores({
  products: 'id, barcode, name, category, stockQuantity, sellingPrice',
  sales: 'id, createdAt, totalAmount, paymentMethod, syncStatus',
  customers: 'id, name, phone, debtBalance',
  expenses: 'id, date, category, amount',
  syncQueue: '++id, endpoint, payload, method, createdAt'
});
