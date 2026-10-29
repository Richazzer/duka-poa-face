import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { QrCode, Printer } from 'lucide-react';

export default function LabelGenerator() {
  return (
    <Card className="rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-slate-800">Tengeneza Barcode Labels</h3>
        </div>
        <Button variant="outline" className="text-xs">
          <Printer className="w-3.5 h-3.5" /> Chapisha
        </Button>
      </div>
    </Card>
  );
}
