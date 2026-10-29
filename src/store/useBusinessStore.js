import { create } from 'zustand';

export const useBusinessStore = create((set) => ({
  business: { name: 'Duka Pooa POS', currency: 'TZS' },
  setBusiness: (business) => set({ business })
}));
