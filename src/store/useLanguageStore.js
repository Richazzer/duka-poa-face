import { create } from 'zustand';

const translations = {
  sw: {
    // Nav & General
    dashboard: 'Dashibodi',
    pos: 'Kaunta ya Mauzo',
    stock: 'Usimamizi wa Stoo',
    customers: 'Wateja & Madeni',
    ai_manager: 'Meneja wa AI',
    settings: 'Mipangilio',
    overview: 'Muhtasari',
    products: 'Bidhaa',
    save: 'Hifadhi Mipangilio',
    cancel: 'Ghairi',
    close: 'Funga',

    // Settings Page
    settings_title: 'Mipangilio ya Mfumo',
    settings_sub: 'Usimamizi wa duka lako, risiti, kodi, usalama na sera za kisheria.',
    language_title: 'Lugha ya Mfumo',
    language_sub: 'Chagua lugha unayopendelea kutumia kwenye duka lako.',
    store_info_title: 'Taarifa za Duka & Muundo wa Risiti',
    store_info_sub: 'Maelezo yatakayoonekana kwenye risiti za wateja.',
    store_name: 'Jina la Duka',
    store_phone: 'Simu ya WhatsApp ya Duka',
    store_location: 'Mahali Duka Lilipo (Location)',
    tin_number: 'Namba ya TIN / Leseni (Hiari)',
    receipt_footer: 'Ujumbe wa Chini ya Risiti (Footer Note)',
    printer_mode: 'Aina ya Uchapishaji (Printer Mode)',
    vat_title: 'Kodi ya Ongezeko la Thamani (VAT - 18%)',
    vat_sub: 'Tenga kodi kwenye hesabu za mauzo kiotomatiki.',
    max_discount_title: 'Ukomo wa Punguzo kwa Kaunta (Max Discount %)',
    max_discount_sub: 'Kiwango cha juu cha punguzo muuzaji anachoweza kutoa.',
    pin_title: 'PIN ya Usalama ya Mmiliki (Master PIN - Namba 4)',
    pin_sub: 'Inahitajika wakati wa kubadilisha bei au kufuta mauzo.',
    backup_title: 'Nakala na Utunzaji wa Data',
    backup_sub: 'Pakua taarifa za biashara yako kwa ajili ya mahesabu ya nje.',
    export_csv: 'Pakua Bidhaa Zote (Excel / CSV)',
    clear_cache: 'Safisha Kumbukumbu ya Muda (Cache)',
    privacy_title: 'Sheria, Masharti & Sera ya Faragha',
    privacy_sub: 'Ulinzi wa data za duka lako chini ya sheria ya Tanzania (PDPA Act 2022).',
    privacy_btn: 'Sera ya Faragha (Privacy)',
    terms_btn: 'Sheria na Masharti (Terms)',
    server_title: 'Anwani ya Seva ya Duka (Cloud Sync Endpoint)',
    settings_saved: 'Mipangilio imehifadhiwa kikamilifu!',
  },
  en: {
    // Nav & General
    dashboard: 'Dashboard',
    pos: 'Point of Sale',
    stock: 'Stock Management',
    customers: 'Customers & Debts',
    ai_manager: 'AI Business Agent',
    settings: 'Settings',
    overview: 'Overview',
    products: 'Products',
    save: 'Save Settings',
    cancel: 'Cancel',
    close: 'Close',

    // Settings Page
    settings_title: 'System Settings',
    settings_sub: 'Manage your shop profile, receipt layouts, taxes, security and legal policies.',
    language_title: 'System Language',
    language_sub: 'Choose your preferred operating language.',
    store_info_title: 'Store Profile & Receipt Design',
    store_info_sub: 'Details that will be printed on customer receipts.',
    store_name: 'Store Name',
    store_phone: 'Store WhatsApp Number',
    store_location: 'Physical Location',
    tin_number: 'TIN / Business License No. (Optional)',
    receipt_footer: 'Receipt Footer Note',
    printer_mode: 'Receipt Printing Mode',
    vat_title: 'Value Added Tax (VAT - 18%)',
    vat_sub: 'Automatically isolate tax on every sale record.',
    max_discount_title: 'Cashier Max Discount Limit (%)',
    max_discount_sub: 'Maximum discount percentage a cashier can grant.',
    pin_title: 'Owner Master Security PIN (4 Digits)',
    pin_sub: 'Required to authorize price changes or void receipts.',
    backup_title: 'Data Backup & Export',
    backup_sub: 'Download your full catalog or reset temporary cache.',
    export_csv: 'Export All Products (Excel / CSV)',
    clear_cache: 'Clear Temporary Cache',
    privacy_title: 'Legal Compliance, Privacy & Terms',
    privacy_sub: 'Your business data is protected under the Tanzania PDPA Act 2022.',
    privacy_btn: 'Privacy Policy',
    terms_btn: 'Terms of Service',
    server_title: 'Cloud Sync Endpoint URL',
    settings_saved: 'Settings saved successfully!',
  }
};

export const useLanguageStore = create((set, get) => ({
  lang: localStorage.getItem('duka_lang') || 'sw',
  
  toggleLang: () => {
    const next = get().lang === 'sw' ? 'en' : 'sw';
    localStorage.setItem('duka_lang', next);
    set({ lang: next });
    window.dispatchEvent(new Event('language_change'));
  },

  t: (key) => {
    const current = get().lang;
    return translations[current]?.[key] || translations['sw']?.[key] || key;
  }
}));
