import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import { formatTZS } from '../../../utils/currency';
import { PAYMENT_METHODS } from '../../../utils/constants';

export default function PaymentModal({ isOpen, onClose, totalAmount, onConfirmPayment }) {
  const [selectedMethod, setSelectedMethod] = useState('cash');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chagua Njia ya Malipo">
      <div className="space-y-4">
        <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 text-center">
          <span className="text-xs text-emerald-700 uppercase tracking-widest font-black">Kiasi cha Kulipwa</span>
          <h2 className="text-3xl font-black text-emerald-600 mt-1">{formatTZS(totalAmount)}</h2>
        </div>

        <div className="space-y-2.5">
          {PAYMENT_METHODS.map((method) => (
            <label 
              key={method.id} 
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === method.id 
                  ? 'border-emerald-500 bg-emerald-50/80 font-bold text-emerald-950 shadow-sm' 
                  : 'border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm font-semibold">{method.label}</span>
              <input 
                type="radio" 
                name="payment" 
                value={method.id} 
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className="accent-emerald-600 w-4 h-4"
              />
            </label>
          ))}
        </div>

        <Button 
          className="w-full py-3.5 mt-4 text-base font-black"
          onClick={() => onConfirmPayment(selectedMethod)}
        >
          Kamilisha na Tuma Django Backend
        </Button>
      </div>
    </Modal>
  );
}
