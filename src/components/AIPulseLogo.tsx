import React from 'react';

interface AIPulseLogoProps {
  variant?: 'full' | 'icon';
  size?: number;
  className?: string;
}

export const AIPulseLogo = ({ variant = 'full', size = 24, className = '' }: AIPulseLogoProps) => {
  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pulse-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5CFF" />
          <stop offset="1" stopColor="#00C8FF" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
        stroke="url(#pulse-gradient)"
        strokeWidth="1.5"
      />
      <path
        d="M12 7v1M12 16v1M17 12h-1M8 12H7M14.5 9.5l.707-.707M8.793 15.207l.707-.707M14.5 14.5l.707.707M8.793 8.793l.707.707"
        stroke="url(#pulse-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" fill="url(#pulse-gradient)" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className="flex items-center justify-center">{icon}</div>;
  }

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
        <div className="relative">
          {icon}
        </div>
      </div>
      <span className="text-lg font-display font-bold text-white/90">AI Pulse</span>
    </div>
  );
};
