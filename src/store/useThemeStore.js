import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('dukapooa_theme') || 'light',
  setTheme: (theme) => {
    localStorage.setItem('dukapooa_theme', theme);
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const next = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('dukapooa_theme', next);
    return { theme: next };
  })
}));