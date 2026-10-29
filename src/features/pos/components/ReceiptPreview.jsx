import React from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import { formatTZS } from '../../../utils/currency';
import { Printer } from 'lucide-react';

export default function ReceiptPreview({ isOpen, onClose, sale }) {
  if (!sale) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stakabadhi (Duka Pooa Receipt)">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-xs space-y-3 shadow-inner">
        <div className="text-center">
          <h3 className="font-black text-base tracking-wider uppercase text-slate-900">Duka Pooa POS</h3>
          <p className="text-slate-500 font-medium">Django Synchronized Receipt</p>
        </div>

        <div className="border-t border-b border-dashed border-slate-300 py-2.5 space-y-1">
          <p><span className="font-bold">Transaction ID:</span> {sale.id}</p>
          <p><span className="font-bold">Tarehe:</span> {new Date(sale.createdAt).toLocaleString()}</p>
          <p><span className="font-bold">Malipo:</span> {sale.paymentMethod}</p>
          <p><span className="font-bold">Hali:</span> {sale.syncStatus === 'synced' ? 'Imefika Django' : 'Imetunzwa Offline'}</p>
        </div>

        <div className="space-y-1.5">
          {sale.items.map((item, idx) => (
            <div key={idx} className="flex justify-between font-medium">
              <span>{item.name} x{item.quantity}</span>
              <span>{formatTZS(item.sellingPrice * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-300 pt-2.5 flex justify-between font-black text-sm text-slate-900">
          <span>JUMLA:</span>
          <span className="text-emerald-600">{formatTZS(sale.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Funga</Button>
        <Button className="flex-1" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Chapisha
        </Button>
      </div>
    </Modal>
  );
}
