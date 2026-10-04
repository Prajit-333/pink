import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Fixed Ribbon Scroll Progress Indicator & Back to Top Button
 * Displays a ribbon that fills with pink vertically from bottom to top as page is scrolled.
 */
export const RibbonProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
        setScrollPercent(pct);
        setVisible(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Page navigation tools"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2 group transition-all duration-300"
    >
      <button
        onClick={scrollToTop}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white/90 dark:bg-pink-900/90 shadow-glow-pink border border-pink-200 dark:border-pink-700 backdrop-blur-md hover:scale-110 active:scale-95 transition-transform"
        title="Scroll to Top"
        aria-label="Back to Top"
      >
        {/* SVG Ribbon with clipPath based on scroll percent */}
        <svg
          viewBox="0 0 320 460"
          className="w-8 h-10 transition-all duration-200"
        >
          <defs>
            <clipPath id="progressClip">
              <rect
                x="0"
                y={460 - (460 * scrollPercent) / 100}
                width="320"
                height={(460 * scrollPercent) / 100}
              />
            </clipPath>
          </defs>

          {/* Background Ribbon Outline */}
          <path
            d="M 160 18 C 215 18 245 85 220 185 L 290 350 L 225 425 L 140 250 C 160 210 185 155 178 110 C 172 75 155 60 140 60 Z"
            fill="#FFE0EC"
            className="dark:fill-pink-950"
          />
          <path
            d="M 160 18 C 105 18 75 85 100 185 L 30 350 L 95 425 L 210 170 C 220 145 225 105 210 65 C 198 35 180 18 160 18 Z"
            fill="#FFD2E4"
            className="dark:fill-pink-900"
          />

          {/* Active Filled Ribbon (Filled bottom-to-top) */}
          <g clipPath="url(#progressClip)">
            <path
              d="M 160 18 C 215 18 245 85 220 185 L 290 350 L 225 425 L 140 250 C 160 210 185 155 178 110 C 172 75 155 60 140 60 Z"
              fill="#BE185D"
            />
            <path
              d="M 160 18 C 105 18 75 85 100 185 L 30 350 L 95 425 L 210 170 C 220 145 225 105 210 65 C 198 35 180 18 160 18 Z"
              fill="#E0157A"
            />
          </g>
        </svg>

        {/* Floating Tooltip Arrow on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-pink-600/90 text-white rounded-full transition-opacity">
          <ArrowUp className="w-5 h-5 animate-bounce" />
        </div>
      </button>

      {/* Percentage Pill */}
      <span className="text-[10px] font-bold text-pink-700 dark:text-pink-300 bg-white/90 dark:bg-pink-900/90 px-2 py-0.5 rounded-full shadow-sm border border-pink-100 dark:border-pink-800">
        {Math.round(scrollPercent)}%
      </span>
    </aside>
  );
};
