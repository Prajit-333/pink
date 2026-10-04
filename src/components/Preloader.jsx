import React, { useState, useEffect } from 'react';

export const Preloader = () => {
  const [loaded, setLoaded] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Show preloader animation for ~1.4 seconds on initial mount
    const timer = setTimeout(() => {
      setLoaded(true);
      setTimeout(() => setRemoved(true), 600);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream transition-opacity duration-600 ${
        loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center">
        {/* Authentic Transparent Ribbon */}
        <div className="w-32 sm:w-36 h-48 sm:h-54 flex items-center justify-center animate-pulse-glow filter drop-shadow-[0_16px_32px_rgba(224,21,122,0.5)]">
          <img
            src="/assets/images/pink-ribbon.png"
            alt="Breast Cancer Awareness Ribbon"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Loading Tagline */}
        <div className="mt-4 text-center">
          <p className="font-serif font-bold text-lg text-burgundy tracking-wide animate-pulse">
            Pink Hope
          </p>
          <p className="text-[11px] uppercase tracking-widest text-pink-600 font-semibold mt-0.5">
            Breast Cancer Awareness Month
          </p>
        </div>
      </div>
    </div>
  );
};
