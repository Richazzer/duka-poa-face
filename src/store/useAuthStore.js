import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // Waiting for Django Authentication Session / Token
  token: localStorage.getItem('dukapooa_token') || null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem('dukapooa_token', token);
    else localStorage.removeItem('dukapooa_token');
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('dukapooa_token');
    set({ user: null, token: null });
  }
}));
