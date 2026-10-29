import { create } from 'zustand';

const translations = {
  sw: {
    overview: "Muhtasari",
    pos: "Point of Sale",
    products: "Bidhaa na Stock",
    purchasing: "Ununuzi",
    money: "Pesa na Madeni",
    customers: "Wateja",
    ai_manager: "Meneja wa AI",
    reports: "Ripoti na Chati",
    staff: "Wafanyakazi & Logs",
    settings: "Mipangilio",
    cart: "Orodha ya Mauzo",
    checkout: "Kamilisha Malipo",
    add_product: "Ongeza Bidhaa",
    search_placeholder: "Tafuta bidhaa, mauzo, au mteja...",
    total_sales: "Mauzo Yaliyorekodiwa",
    estimated_profit: "Makadirio ya Faida",
    customer_debts: "Madeni ya Wateja",
    no_products: "Hakuna bidhaa kutoka Django backend bado.",
    no_sales: "Hakuna miamala iliyorekodiwa bado."
  },
  en: {
    overview: "Overview",
    pos: "Point of Sale",
    products: "Products & Stock",
    purchasing: "Purchasing",
    money: "Money & Debts",
    customers: "Customers",
    ai_manager: "AI Manager",
    reports: "Reports & Margins",
    staff: "Staff & Audit Logs",
    settings: "Settings",
    cart: "Sales Cart",
    checkout: "Complete Payment",
    add_product: "Add Product",
    search_placeholder: "Search products, sales, or customers...",
    total_sales: "Total Recorded Sales",
    estimated_profit: "Estimated Gross Profit",
    customer_debts: "Customer Debts",
    no_products: "No products from Django backend yet.",
    no_sales: "No transactions recorded yet."
  }
};

export const useLanguageStore = create((set, get) => ({
  lang: 'sw',
  setLang: (lang) => set({ lang }),
  toggleLang: () => set((state) => ({ lang: state.lang === 'sw' ? 'en' : 'sw' })),
  t: (key) => translations[get().lang]?.[key] || key
}));
