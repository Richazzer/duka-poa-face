import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { FileText, Upload } from 'lucide-react';

export default function InvoiceScanner() {
  return (
    <Card className="border-dashed border-2 border-emerald-400 bg-emerald-50/20 text-center py-10 rounded-3xl">
      <FileText className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
      <h3 className="font-extrabold text-slate-800 text-base">Django OCR Supplier Invoice Scanner</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
        Pakia picha ya invoice kutuma kwenye Django backend kwa uchambuzi wa bidhaa.
      </p>
      <Button className="mx-auto">
        <Upload className="w-4 h-4" /> Pakia Picha Ya Invoice
      </Button>
    </Card>
  );
}
