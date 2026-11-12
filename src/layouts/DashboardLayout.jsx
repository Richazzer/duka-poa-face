import React, { useEffect } from 'react';
import FloatingBottomBar from './FloatingBottomBar';
import TopFloatingControls from './TopFloatingControls';

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
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white relative overflow-x-hidden">
      
      {/* 1. Global Floating Liquid Glass Circles: Plan (Left) & Notifications (Right) */}
      <TopFloatingControls />

      {/* 2. Responsive Main Container: Scales beautifully from Mobile to 4K Displays */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-36 transition-all duration-300">
        {children}
      </main>

      {/* 3. Floating Bottom Navigation Dock */}
      <FloatingBottomBar />

    </div>
  );
}
