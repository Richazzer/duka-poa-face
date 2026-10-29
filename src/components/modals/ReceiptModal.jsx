import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Printer, CheckCircle2, Share2 } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, saleData }) {
  if (!saleData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Risiti ya Mauzo (Thermal Preview)">
      <div className="space-y-6 text-slate-800">
        
        {/* Printable Thermal Receipt Container */}
        <div id="thermal-receipt" className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm font-mono text-xs space-y-4 max-w-xs mx-auto text-slate-900">
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
            <h3 className="font-black text-sm uppercase">Duka Pooa General Store</h3>
            <p className="text-[10px] text-slate-500">Dar es Salaam, Tanzania</p>
            <p className="text-[10px] text-slate-500">Simu: +255 712 345 678</p>
          </div>

          <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span>Risiti No:</span>
              <span className="font-bold">{saleData.id || '#DP-8942'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarehe:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Mlipaji:</span>
              <span>{saleData.customerName || 'Mteja wa kawaida'}</span>
            </div>
          </div>

          <div className="space-y-2 pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase">
              <span>Bidhaa</span>
              <span>Jumla</span>
            </div>
            {(saleData.items || [{ name: 'Sukari 1kg', qty: 2, price: 3000 }, { name: 'Mchele 2kg', qty: 1, price: 5000 }]).map((item, i) => (
              <div key={i} className="flex justify-between text-[11px]">
                <span>{item.qty || item.quantity}x {item.name}</span>
                <span>TZS {(item.price * (item.qty || item.quantity)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between font-black text-sm">
              <span>JUMLA KUU:</span>
              <span>TZS {(saleData.total || 11000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Njia ya Malipo:</span>
              <span className="uppercase">{saleData.paymentMethod || 'Cash / M-Pesa'}</span>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-dashed border-slate-300 space-y-1">
            <p className="font-bold text-[10px]">Karibu Tena Duka Pooa!</p>
            <p className="text-[9px] text-slate-400">Powered by Duka Pooa POS</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="flex-1 py-3 text-xs font-bold gap-2">
            <Printer className="w-4 h-4" /> Chapisha Risiti (Print)
          </Button>
          <Button variant="secondary" onClick={onClose} className="py-3 text-xs font-bold">
            Funga
          </Button>
        </div>

      </div>
    </Modal>
  );
}