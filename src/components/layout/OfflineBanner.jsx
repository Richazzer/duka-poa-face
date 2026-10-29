import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBanner({ isOnline, pendingSyncCount }) {
  if (isOnline && pendingSyncCount === 0) return null;

  return (
    <div className={`px-4 py-2 text-xs font-bold flex items-center justify-between transition-all ${
      !isOnline ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>Mode ya Nje ya Mtandao (Offline) — Data zote zitapokelewa na kusawazishwa na Django mara tu mtandao utakapokaa sawa.</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Inasawazisha na Django backend ({pendingSyncCount})...</span>
          </>
        )}
      </div>
      <span className="underline cursor-pointer hover:opacity-80">Hali ya Django API</span>
    </div>
  );
}
