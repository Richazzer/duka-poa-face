import { db } from '../dexie';
import api from '../../services/api';

export const recordExpense = async (expense) => {
  const data = {
    ...expense,
    id: expense.id || `EXP-${Date.now()}`,
    date: expense.date || new Date().toISOString().split('T')[0]
  };
  await db.expenses.add(data);
  try {
    await api.post('/expenses/', data);
  } catch (err) {}
  return data;
};

export const getAllExpenses = async () => {
  try {
    const res = await api.get('/expenses/');
    if (res.data) return res.data;
  } catch (err) {}
  return db.expenses.toArray();
};
