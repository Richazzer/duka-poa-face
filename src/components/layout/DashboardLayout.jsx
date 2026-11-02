import React, { useEffect } from 'react';
import FloatingBottomBar from './FloatingBottomBar';

export default function DashboardLayout({ children }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f5f9] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-blue-600 selection:text-white">
      {/* Content wrapper with generous bottom padding so the floating dock never obstructs items */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
        {children}
      </main>

      {/* Floating Bottom VisionOS Dock */}
      <FloatingBottomBar />
    </div>
  );
}