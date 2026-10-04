import React, { useEffect, useState } from 'react';

/**
 * Desktop Ribbon & Rose Petal Cursor Trail
 * Throttled for silky 60fps performance and disabled on touch/mobile devices
 */
export const RibbonCursorTrail = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let lastTime = 0;
    const throttleMs = 45; // ~22 petals per second max

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      const newPetal = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(Math.random() * 8) + 10,
        rotation: Math.floor(Math.random() * 360),
        color: ['#E0157A', '#F472A8', '#FFA3C7', '#FFC2D9'][Math.floor(Math.random() * 4)],
      };

      setPetals((prev) => [...prev.slice(-15), newPetal]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="cursor-petal"
          style={{
            left: `${petal.x}px`,
            top: `${petal.y}px`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size * 1.3}
            viewBox="0 0 24 32"
            style={{
              transform: `rotate(${petal.rotation}deg)`,
              fill: petal.color,
              filter: 'drop-shadow(0 2px 4px rgba(224,21,122,0.3))',
            }}
          >
            <path d="M12 2 C8 10 2 16 2 24 C2 28 6 30 12 30 C18 30 22 28 22 24 C22 16 16 10 12 2 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
