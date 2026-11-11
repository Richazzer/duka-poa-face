import React, { useEffect } from 'react';
import FloatingBottomBar from './FloatingBottomBar';
import TopFloatingControls from './TopFloatingControls'; // <--- GLOBAL FLOATING CIRCLES

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
    <div className="min-h-screen bg-[#090d16] text-white transition-colors duration-300 font-sans selection:bg-blue-600 selection:text-white relative">
      
      {/* 1. Global Top Left & Right Liquid Glass Circles (Plan & Notification) */}
      <TopFloatingControls />

      {/* 2. Main Content Area */}
      <main className="max-w-md mx-auto px-4 pt-20 pb-36">
        {children}
      </main>

      {/* 3. Global Floating Bottom Dock */}
      <FloatingBottomBar />

    </div>
  );
}
