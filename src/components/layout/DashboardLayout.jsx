import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";

export default function DashboardLayout({ children }) {
  // Sync dark class on mount from saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex h-screen bg-[#f3f5f9] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8 scrollbar-none">
          {children}
        </main>
      </div>

      {/* Mobile Floating Island Nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>

    </div>
  );
}