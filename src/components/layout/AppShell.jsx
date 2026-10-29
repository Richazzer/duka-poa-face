import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import OfflineBanner from './OfflineBanner';

export default function AppShell({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-slate-900 flex flex-col font-sans antialiased">
      <OfflineBanner isOnline={isOnline} pendingSyncCount={0} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar visible on desktop/tablet */}
        <aside className="hidden md:flex md:w-64 flex-col border-r border-slate-200 bg-slate-100">
          <Sidebar />
        </aside>

        {/* Main content view */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-24 md:pb-0 bg-gradient-to-b from-slate-100 to-slate-200">
          <TopBar />
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar with "Menyu" drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-100/95 backdrop-blur-xl border-t border-slate-200 shadow-lg">
        <MobileNav />
      </div>
    </div>
  );
}