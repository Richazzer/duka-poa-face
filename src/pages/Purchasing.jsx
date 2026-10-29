import React, { useState, useRef } from 'react';
import { Camera, FileText, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export default function InvoiceScanner() {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToastStore();

  const handleCaptureOrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    addToast('Inachambua invoice kupitia OCR...', 'info');

    // Simulate OCR processing and Django backend sync
    setTimeout(() => {
      setScanning(false);
      setScannedData({
        supplier: 'Azam Grain Millers',
        date: new Date().toLocaleDateString(),
        items: [
          { name: 'Unga wa Ngano 25kg', qty: 10, price: 35000 },
          { name: 'Sukari 50kg', qty: 5, price: 120000 }
        ],
        total: 950000
      });
      addToast('Invoice imesomwa na kuhifadhiwa kikamilifu!', 'success');
    }, 2500);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-inner">
          <FileText className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-black text-slate-900">Django OCR Invoice Scanner</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Tumia kamera ya simu yako kuchanganua invoice na kusoma bidhaa moja kwa moja.
        </p>
      </div>

      {/* Hidden file input with mobile camera capture support */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleCaptureOrUpload} 
        className="hidden" 
      />

      {/* SYMBOL / ICON TRIGGER INSTEAD OF TEXT BUTTON */}
      <div className="flex justify-center pt-2">
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={scanning}
          className="w-20 h-20 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl cursor-pointer transition-transform active:scale-95 disabled:opacity-50 group border-4 border-slate-100"
          title="Fungua Kamera / Chagua Picha"
        >
          {scanning ? (
            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
          ) : (
            <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {scannedData && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Imefanikiwa Kusomwa
            </span>
            <span className="text-[10px] font-mono text-slate-400">{scannedData.date}</span>
          </div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-slate-800">Muuzaji: {scannedData.supplier}</p>
            <p className="text-slate-600">Bidhaa {scannedData.items.length} zimetambuliwa</p>
            <p className="font-black text-slate-900 pt-1">Jumla: TZS {scannedData.total.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}