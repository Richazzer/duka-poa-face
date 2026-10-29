import { db } from '../dexie';
import api from '../../services/api';

export const getAllCustomers = async () => {
  try {
    const res = await api.get('/customers/');
    if (res.data) return res.data;
  } catch (err) {}
  return db.customers.toArray();
};

export const saveCustomer = (customer) => db.customers.put(customer);
