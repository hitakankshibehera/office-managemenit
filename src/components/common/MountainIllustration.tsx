import React from 'react';

interface MountainIllustrationProps {
  className?: string;
  theme?: 'dark-navy' | 'golden-dawn' | 'hero-sky';
  subtitle?: string;
  title?: string;
}

export const MountainIllustration: React.FC<MountainIllustrationProps> = ({
  className = '',
  theme = 'golden-dawn',
  title = 'A Great Team',
  subtitle = 'Creates Extraordinary Journeys',
}) => {
  return (
    <div className={`relative overflow-hidden w-full h-full flex flex-col justify-between ${className}`}>
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071A2F] via-[#0B2340] to-[#123157] z-0" />

      {/* Sun / Light Flare Source */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-[#18BFFF]/30 via-[#168BFF]/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-300/25 blur-2xl pointer-events-none" />

      {/* Stars & Ambient Constellations */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-16 right-20 w-1 h-1 bg-cyan-200 rounded-full" />
        <div className="absolute top-28 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full" />
        <div className="absolute top-12 right-1/3 w-1 h-1 bg-amber-100 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute top-36 right-12 w-1 h-1 bg-white rounded-full opacity-60" />
      </div>

      {/* Mountain Layers SVG */}
      <svg
        className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="400" y1="0" x2="400" y2="1000" gradientUnits="userSpaceOnUse">
            <stop stopColor="#071A2F" />
            <stop offset="0.35" stopColor="#0B2A4A" />
            <stop offset="0.65" stopColor="#123B66" />
            <stop offset="0.85" stopColor="#1B4D7E" />
            <stop offset="1" stopColor="#0B2340" />
          </linearGradient>

          <linearGradient id="farPeaks" x1="400" y1="350" x2="400" y2="650" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="1" stopColor="#0B2340" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="midPeaks" x1="400" y1="450" x2="400" y2="850" gradientUnits="userSpaceOnUse">
            <stop stopColor="#168BFF" stopOpacity="0.75" />
            <stop offset="0.5" stopColor="#0E2E52" />
            <stop offset="1" stopColor="#071A2F" />
          </linearGradient>

          <linearGradient id="forePeaks" x1="400" y1="600" x2="400" y2="1000" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0D2746" />
            <stop offset="0.7" stopColor="#071A2F" />
            <stop offset="1" stopColor="#030D18" />
          </linearGradient>

          <linearGradient id="snowGlow" x1="400" y1="250" x2="400" y2="500" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#BAE6FD" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Distant Mountain Silhouettes */}
        <path
          d="M0 580L90 490L220 540L360 410L490 520L630 380L740 480L800 440V1000H0V580Z"
          fill="url(#farPeaks)"
        />

        {/* Distant Snow Highlights */}
        <path
          d="M360 410L390 445L360 435L335 448L360 410Z"
          fill="url(#snowGlow)"
        />
        <path
          d="M630 380L660 420L630 405L600 422L630 380Z"
          fill="url(#snowGlow)"
        />

        {/* Mid-ground Mountain Massif */}
        <path
          d="M0 690L160 520L280 620L440 460L590 600L720 500L800 580V1000H0V690Z"
          fill="url(#midPeaks)"
        />

        {/* Alpine Ridge Light Edge */}
        <path
          d="M440 460L440 750M440 460L390 540M440 460L490 535"
          stroke="rgba(56, 189, 248, 0.45)"
          strokeWidth="2"
        />

        {/* Foreground Dramatic Cliffs */}
        <path
          d="M0 760L140 680L310 820L520 620L680 770L800 690V1000H0V760Z"
          fill="url(#forePeaks)"
        />

        {/* Atmospheric Mist across Valley */}
        <ellipse cx="400" cy="620" rx="350" ry="40" fill="#18BFFF" opacity="0.15" filter="blur(20px)" />
        <ellipse cx="250" cy="740" rx="280" ry="30" fill="#38BDF8" opacity="0.18" filter="blur(25px)" />

        {/* Hiker / Explorer Silhouette on Pinnacle */}
        <g transform="translate(512, 575) scale(0.65)">
          {/* Head & Hat */}
          <circle cx="12" cy="8" r="4.5" fill="#071A2F" />
          <path d="M6 7C6 5 18 5 18 7H6Z" fill="#071A2F" />
          {/* Body & Trekking Backpack */}
          <path d="M9 13L15 13L17 26L7 26L9 13Z" fill="#071A2F" />
          <path d="M5 14C3 14 3 23 6 24L7 16Z" fill="#071A2F" />
          {/* Legs & Boots */}
          <path d="M8 26L5 38M16 26L19 38" stroke="#071A2F" strokeWidth="3" strokeLinecap="round" />
          {/* Trekking Pole */}
          <line x1="22" y1="12" x2="26" y2="40" stroke="#071A2F" strokeWidth="1.5" />
          {/* Subtle rim light on hiker */}
          <path d="M16 8C16 11 16 20 18 24" stroke="#38BDF8" strokeWidth="1.2" opacity="0.8" />
        </g>
      </svg>

      {/* Top Branding Watermark */}
      <div className="relative z-20 p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-cyan-200">
          <span className="w-2 h-2 rounded-full bg-[#18BFFF] animate-pulse" />
          <span>Wonder Light Adventure CMS</span>
        </div>
      </div>

      {/* Bottom Inspiration Quote matching Reference Image */}
      <div className="relative z-20 p-8 lg:p-10 text-white">
        <div className="max-w-md">
          <div className="w-12 h-1 bg-gradient-to-r from-[#18BFFF] to-[#168BFF] rounded-full mb-4" />
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
            {title}
          </h2>
          <p className="text-lg lg:text-xl text-cyan-200/90 font-medium leading-snug">
            {subtitle}
          </p>
          <div className="flex items-center gap-4 mt-6 text-xs text-slate-300">
            <span>Trekking & Expeditions</span>
            <span>·</span>
            <span>Enterprise Management</span>
            <span>·</span>
            <span>Seamless Workflow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
