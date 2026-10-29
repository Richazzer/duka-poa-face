import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';

export default function Card({ children, className = '', ...props }) {
  const { theme } = useThemeStore();
  
  return (
    <div className={`rounded-2xl p-5 transition-all duration-300 ${
      theme === 'dark' ? 'dark-card' : 'app-card'
    } ${className}`} {...props}>
      {children}
    </div>
  );
}