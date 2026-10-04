import React, { useEffect, useState, useRef } from 'react';

/**
 * ScrollRibbon - Flowing SVG ribbon that weaves dynamically down the page
 * and draws progressively along with user scroll, terminating in the heart at the footer.
 */
export const ScrollRibbon = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const current = Math.min(1, Math.max(0, window.scrollY / totalHeight));
            setScrollProgress(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 hidden lg:block overflow-hidden opacity-40 hover:opacity-60 transition-opacity">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 3000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="flowingScrollRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA3C7" stopOpacity="0.2" />
            <stop offset="20%" stopColor="#EC4899" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#E0157A" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#BE185D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7A0B3F" stopOpacity="0.9" />
          </linearGradient>

          <filter id="ribbonBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Faint Background Track */}
        <path
          d="M 120 100 
             C 280 400, 80 800, 200 1200 
             C 320 1600, 1300 1900, 1250 2400 
             C 1200 2700, 780 2850, 720 2950"
          stroke="#FFE0EC"
          strokeWidth="3"
          strokeDasharray="4 6"
          opacity="0.4"
        />

        {/* Dynamic Progressive Drawn Ribbon */}
        <path
          ref={pathRef}
          d="M 120 100 
             C 280 400, 80 800, 200 1200 
             C 320 1600, 1300 1900, 1250 2400 
             C 1200 2700, 780 2850, 720 2950"
          stroke="url(#flowingScrollRibbon)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="3500"
          strokeDashoffset={3500 * (1 - scrollProgress)}
          filter="url(#ribbonBlur)"
        />
      </svg>
    </div>
  );
};
