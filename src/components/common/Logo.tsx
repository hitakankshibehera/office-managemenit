import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'brand',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-sm', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  };

  const isLight = variant === 'light'; // Light text for dark backgrounds

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official WLA Monogram Image Badge */}
      <div className={`relative shrink-0 overflow-hidden rounded-full drop-shadow-md transition-transform duration-200 hover:scale-105 bg-[#1C1C1F] ${sizeMap[size].icon}`}>
        <img
          src="/logo.png"
          alt="Wonder Light Adventure Company Logo"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* External Typography Header */}
      {showSubtitle && (
        <div className="flex flex-col tracking-tight leading-none">
          <span
            className={`font-extrabold uppercase tracking-wider ${sizeMap[size].text} ${
              isLight ? 'text-white' : 'text-[#0F172A]'
            }`}
            style={{ letterSpacing: '0.06em' }}
          >
            Wonder Light
          </span>
          <span
            className={`font-semibold tracking-[0.2em] uppercase mt-1 ${sizeMap[size].sub} ${
              isLight ? 'text-[#38BDF8]' : 'text-[#0284C7]'
            }`}
          >
            Adventure Co.
          </span>
        </div>
      )}
    </div>
  );
};
