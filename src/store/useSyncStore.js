import { create } from 'zustand';

export const useSyncStore = create((set) => ({
  isSyncing: false,
  pendingCount: 0,
  setIsSyncing: (isSyncing) => set({ isSyncing }),
  setPendingCount: (pendingCount) => set({ pendingCount })
}));
