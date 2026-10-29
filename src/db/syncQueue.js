import { db } from './dexie';

export const addToSyncQueue = async (endpoint, method, payload) => {
  return await db.syncQueue.add({
    endpoint,
    method,
    payload,
    createdAt: new Date().toISOString()
  });
};

export const getPendingSyncs = async () => {
  return await db.syncQueue.toArray();
};

export const clearSyncItem = async (id) => {
  return await db.syncQueue.delete(id);
};
