import React from 'react';
import confetti from 'canvas-confetti';

/**
 * Transparent Pink Awareness Ribbon Component
 * Uses the exact transparent PNG ribbon asset requested by the user,
 * with interactive celebratory confetti, glowing ambient effects, and multi-variant support.
 */
export const RibbonSVG = ({
  variant = 'hero',
  className = '',
  size = 380,
  onClick,
  interactive = true,
  glow = true,
}) => {
  const triggerConfetti = (e) => {
    if (onClick) onClick(e);
    if (!interactive) return;

    // Pink and rose petal confetti burst
    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { x, y },
      colors: ['#E0157A', '#EC407A', '#F48FB1', '#FFF1F6', '#AD1457', '#880E4F'],
      shapes: ['circle'],
      scalar: 1.1,
      ticks: 160,
      disableForReducedMotion: true,
    });
  };

  // Heart-shaped ribbon for footer and milestones
  if (variant === 'heart') {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`inline-block transition-transform duration-300 hover:scale-105 ${className}`}
        onClick={triggerConfetti}
        role="img"
        aria-label="Pink Ribbon Heart"
      >
        <defs>
          <linearGradient id="ribbonHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF75B0" />
            <stop offset="40%" stopColor="#E0157A" />
            <stop offset="80%" stopColor="#9D174D" />
            <stop offset="100%" stopColor="#7A0B3F" />
          </linearGradient>
          <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#E0157A" floodOpacity="0.4" />
          </filter>
        </defs>
        <g filter="url(#heartGlow)">
          <path
            d="M50 82 C20 62 10 42 10 28 C10 16 20 8 32 8 C40 8 46 14 50 20 C54 14 60 8 68 8 C80 8 90 16 90 28 C90 42 80 62 50 82 Z"
            fill="none"
            stroke="url(#ribbonHeartGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36 70 L22 92 M64 70 L78 92"
            stroke="url(#ribbonHeartGrad)"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  // Divider wavy ribbon variant
  if (variant === 'divider') {
    return (
      <div className={`w-full overflow-hidden leading-none ${className}`}>
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="w-full h-8 md:h-12 text-pink-500 opacity-80"
        >
          <defs>
            <linearGradient id="dividerRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF1F6" stopOpacity="0" />
              <stop offset="15%" stopColor="#F472A8" />
              <stop offset="50%" stopColor="#E0157A" />
              <stop offset="85%" stopColor="#F472A8" />
              <stop offset="100%" stopColor="#FFF1F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 30 C 150 50, 300 10, 450 30 C 600 50, 750 10, 900 30 C 1050 50, 1150 20, 1200 30"
            fill="none"
            stroke="url(#dividerRibbonGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M0 35 C 200 15, 400 45, 600 25 C 800 5, 1000 40, 1200 35"
            fill="none"
            stroke="#FFC2D9"
            strokeWidth="2"
            strokeDasharray="6,6"
            opacity="0.6"
          />
        </svg>
      </div>
    );
  }

  // Small Logo / Icon Variant (Transparent PNG)
  if (variant === 'logo' || variant === 'icon') {
    const iconWidth = size || 42;
    return (
      <div
        onClick={triggerConfetti}
        className={`relative inline-flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 select-none notranslate ${className}`}
        style={{ width: `${iconWidth}px`, height: `${(iconWidth * 1.45)}px` }}
        title="Pink Hope Awareness Ribbon"
        translate="no"
      >
        <img
          src="/assets/images/pink-ribbon.png"
          alt="Pink Awareness Ribbon"
          className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(224,21,122,0.35)]"
        />
      </div>
    );
  }

  // Hero Ribbon: Exact Transparent Satin Pink Ribbon
  const heroWidth = size || 380;
  return (
    <div
      className={`relative inline-block cursor-pointer select-none group notranslate ${className}`}
      onClick={triggerConfetti}
      title="Click to celebrate hope!"
      translate="no"
    >
      {/* Soft Ambient Pink Glow */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/35 via-pink-400/25 to-transparent blur-3xl rounded-full scale-125 pointer-events-none animate-pulse-glow" />
      )}

      <div
        className="relative z-10 flex items-center justify-center transition-all duration-500 group-hover:scale-105"
        style={{ width: `${heroWidth}px`, maxWidth: '100%', height: `${heroWidth * 1.42}px` }}
      >
        <img
          src="/assets/images/pink-ribbon.png"
          alt="Official Breast Cancer Pink Awareness Ribbon"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(224,21,122,0.4)] group-hover:drop-shadow-[0_28px_56px_rgba(224,21,122,0.6)] transition-all duration-500"
        />
      </div>
    </div>
  );
};
