import React from 'react';

export default function DataTable({ columns, data, emptyMessage = "Hakuna data iliyopo kutoka Django backend" }) {
  return (
    <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold text-xs uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th key={idx} className="py-3.5 px-4">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {data && data.length > 0 ? (
            data.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-emerald-50/30 transition-colors duration-150">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="py-4 px-4 font-medium">
                    {col.accessor ? row[col.accessor] : col.render ? col.render(row) : null}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-slate-400 font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
