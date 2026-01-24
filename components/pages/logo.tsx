
import React from 'react';

export const Logo: React.FC<{ className?: string, hideText?: boolean, light?: boolean }> = ({ className = "h-10", hideText = false, light = false }) => {
  return (
    <div className={`flex items-center gap-3 transition-opacity hover:opacity-80 cursor-pointer ${className}`}>
      <div className={`relative w-8 h-8 ${light ? 'bg-white' : 'bg-[#1a1a1a]'} rounded-sm p-1 shadow-sm`}>
        <svg viewBox="0 0 100 100" className={`w-full h-full ${light ? 'text-[#1a1a1a]' : 'text-white'}`} fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M15 25C25 20 45 15 60 30C75 45 65 65 45 70C25 75 15 55 20 40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
           <path d="M55 15C70 20 90 25 90 50C90 75 70 95 45 90C20 85 10 65 20 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
           <path d="M35 35C50 40 60 50 55 65C50 80 35 90 20 80" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
      {!hideText && (
        <span className={`text-xl font-extrabold tracking-tighter ${light ? 'text-white' : 'text-[#1a1a1a]'}`}>
          Canvaas<span className="opacity-40">.</span>
        </span>
      )}
    </div>
  );
};
