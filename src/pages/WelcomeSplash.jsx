import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const hasSession = () => {
  try {
    return Boolean(localStorage.getItem('access_token') || localStorage.getItem('token'));
  } catch {
    return false;
  }
};

export default function WelcomeSplash() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // If not authenticated, redirect to register
    if (!hasSession()) {
      navigate('/register', { replace: true });
      return;
    }

    // Smooth percentage progression from 0% to 100% over 2.6 seconds
    const duration = 2600;
    const intervalTime = 26;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/onboarding/splash', { replace: true });
          }, 250);
          return 100;
        }
        return Math.min(100, Math.round(prev + step));
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [navigate]);

  // 12 Radial Spoke Lines for the Classic Apple Loading Wheel
  const spokes = Array.from({ length: 12 });

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center select-none font-sans text-white overflow-hidden">
      
      {/* 
        ========================================================================
        APPLE-STYLE SPOKE WHEEL + CENTERED PERCENTAGE PROGRESS (EXACT PHOTO MATCH)
        ========================================================================
      */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* SVG Radiating Segment Wheel */}
        <svg 
          className="w-48 h-48 sm:w-56 sm:h-56 animate-[spin_1.2s_linear_infinite]" 
          viewBox="0 0 100 100"
        >
          {spokes.map((_, i) => {
            const angle = i * 30;
            // Opacity decay creates the iconic stepping light trail
            const opacity = ((i + 1) / 12).toFixed(2);
            return (
              <line
                key={i}
                x1="50"
                y1="10"
                x2="50"
                y2="24"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
                opacity={opacity}
              />
            );
          })}
        </svg>

        {/* Centered Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {percent}%
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-300 mt-1 tracking-wide">
            Loading...
          </span>
        </div>

      </div>

    </main>
  );
}
