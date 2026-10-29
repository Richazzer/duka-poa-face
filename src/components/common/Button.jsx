import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md";
  
  const variants = {
    primary: "bg-gradient-to-r from-slate-200 to-slate-400 hover:from-slate-100 hover:to-slate-300 text-slate-950 font-bold shadow-slate-500/10",
    secondary: "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 backdrop-blur-md",
    outline: "border border-slate-600/80 hover:bg-slate-800/50 text-slate-300 backdrop-blur-md",
    danger: "bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50"
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}