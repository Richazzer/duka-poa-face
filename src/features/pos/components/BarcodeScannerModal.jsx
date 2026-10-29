import React from 'react';
import Modal from '../../../components/common/Modal';
import { Camera } from 'lucide-react';

export default function BarcodeScannerModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Scan Barcode (Duka Pooa Camera)">
      <div className="text-center py-10 bg-slate-950 text-white rounded-2xl relative overflow-hidden border border-slate-800">
        <Camera className="w-12 h-12 mx-auto mb-3 text-emerald-400 animate-pulse" />
        <p className="text-sm font-bold">Inafungua kamera ya kifaa...</p>
        <p className="text-xs text-slate-400 mt-1">Elekeza kamera kwenye barcode ya bidhaa</p>
      </div>
    </Modal>
  );
}
