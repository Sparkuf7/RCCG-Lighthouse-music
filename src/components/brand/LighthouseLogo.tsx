import React from 'react';

interface LighthouseLogoProps {
  variant?: 'full' | 'compact' | 'splash' | 'icon-only';
  className?: string;
  showSubtitle?: boolean;
}

export const LighthouseLogo: React.FC<LighthouseLogoProps> = ({
  variant = 'full',
  className = '',
  showSubtitle = true,
}) => {
  // SVG of the RCCG Official Seal
  const RccgSeal = ({ size = 32 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0 drop-shadow-sm select-none"
      aria-label="RCCG Seal"
    >
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#005A9C" strokeWidth="3" />
      <circle cx="50" cy="50" r="43" fill="#005A9C" />
      <circle cx="50" cy="50" r="34" fill="#007A3D" />
      <circle cx="50" cy="50" r="24" fill="#FFFFFF" />

      {/* Dove in center */}
      <path
        d="M50 36 C45 32 40 37 43 43 C40 45 36 50 44 54 C47 52 50 49 50 46 C50 49 53 52 56 54 C64 50 60 45 57 43 C60 37 55 32 50 36 Z"
        fill="#005A9C"
      />
      {/* Holy Bible symbol below dove */}
      <path
        d="M40 55 Q50 52 50 56 Q50 52 60 55 L59 62 Q50 60 50 64 Q50 60 41 62 Z"
        fill="#C99700"
      />
      
      {/* Text circular approximation */}
      <text
        x="50"
        y="18"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="6"
        fontWeight="bold"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        THE REDEEMED
      </text>
      <text
        x="50"
        y="88"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="5"
        fontWeight="bold"
        fontFamily="sans-serif"
        letterSpacing="0.3"
      >
        CHRISTIAN CHURCH OF GOD
      </text>
    </svg>
  );

  // SVG of the Lighthouse Golden Roundel with Beams
  const LighthouseRoundel = ({ size = 32 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0 drop-shadow-sm select-none"
      aria-label="Lighthouse Emblem"
    >
      <defs>
        <linearGradient id="goldRoundel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF2A3" />
          <stop offset="50%" stop-color="#D4AF37" />
          <stop offset="100%" stop-color="#B8860B" />
        </linearGradient>
        <radialGradient id="beaconGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stop-color="#FFF" stop-opacity="0.9" />
          <stop offset="40%" stop-color="#F3D21A" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#D4AF37" stop-opacity="0" />
        </radialGradient>
      </defs>

      {/* Gold Ring/Circle */}
      <circle cx="50" cy="50" r="47" fill="url(#goldRoundel)" stroke="#FFF" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="41" fill="#0B1F1C" />

      {/* Light Beams from lantern */}
      <polygon points="50,30 92,14 92,42" fill="#F3D21A" opacity="0.45" />
      <polygon points="50,30 8,14 8,42" fill="#F3D21A" opacity="0.45" />

      {/* Lighthouse Base */}
      <path d="M30 78 Q50 74 70 78 L73 83 Q50 86 27 83 Z" fill="#D4AF37" />

      {/* Tower */}
      <path d="M43 76 L45 38 L55 38 L57 76 Z" fill="#FFFFFF" />
      {/* Tower stripes */}
      <polygon points="44,48 56,48 55.5,56 44.5,56" fill="#173B2D" />
      <polygon points="43.8,63 56.2,63 56.7,70 43.3,70" fill="#173B2D" />

      {/* Gallery & Lamp Room */}
      <rect x="42" y="34" width="16" height="4" rx="1" fill="#D4AF37" />
      <rect x="44.5" y="27" width="11" height="8" rx="1" fill="#FFFFFF" />
      <circle cx="50" cy="31" r="3.5" fill="#F3D21A" />
      
      {/* Dome */}
      <path d="M43 27 Q50 19 57 27 Z" fill="#D4AF37" />
      <line x1="50" y1="20" x2="50" y2="16" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <LighthouseRoundel size={36} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="flex items-center -space-x-1.5">
          <RccgSeal size={28} />
          <LighthouseRoundel size={30} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold tracking-tight text-[#D4AF37]">RCCG</span>
            <span className="font-brand-script text-base text-white tracking-wide">Light</span>
            <span className="text-xs font-extrabold tracking-widest text-white uppercase">HOUSE</span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.16em] text-[#F3D21A] uppercase leading-none">
            Music Ministry
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'splash') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
            <RccgSeal size={52} />
          </div>
          <div className="p-1 rounded-full bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/40 shadow-lg">
            <LighthouseRoundel size={58} />
          </div>
        </div>

        <div className="text-xs font-bold tracking-[0.22em] text-[#D4AF37] uppercase mb-1">
          The Redeemed Christian Church of God
        </div>

        <div className="flex items-baseline justify-center gap-2 mb-1">
          <span className="font-brand-script text-4xl sm:text-5xl text-white font-medium drop-shadow-md">
            Light
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-white uppercase drop-shadow-md">
            HOUSE
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#24513B]/70 border border-[#D4AF37]/40 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F3D21A] animate-pulse" />
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#F3D21A] uppercase">
            Music Ministry
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F3D21A] animate-pulse" />
        </div>

        {showSubtitle && (
          <p className="text-xs tracking-wider text-[#AAB8B2] uppercase max-w-sm mt-1">
            Music Ministry Management & Development System
          </p>
        )}
      </div>
    );
  }

  // Default 'full' variant for desktop header
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Logos side-by-side as in original flyer */}
      <div className="flex items-center gap-2">
        <RccgSeal size={34} />
        <LighthouseRoundel size={36} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-tight">
          <span className="text-xs font-bold tracking-wider text-[#D4AF37]">RCCG</span>
          <span className="font-brand-script text-xl text-white font-medium">Light</span>
          <span className="text-sm font-black tracking-[0.16em] text-white uppercase">HOUSE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#F3D21A] uppercase">
            Music Ministry
          </span>
          {showSubtitle && (
            <>
              <span className="text-[10px] text-[#AAB8B2] hidden xl:inline">•</span>
              <span className="text-[10px] text-[#AAB8B2] tracking-wider hidden xl:inline font-medium">
                Management & Development System
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
