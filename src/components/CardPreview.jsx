import React, { forwardRef } from 'react';
import { Search, Stethoscope, Heart, Users, Sparkles } from 'lucide-react';

export const CARD_STYLES = [
  {
    id: 'satin-pink',
    name: 'Classic Satin Pink',
    bgClass: 'from-[#FFF0F5] via-[#FFE4EE] to-[#FFD6E7]',
    accentColor: '#E0157A',
    borderColor: '#FFB8D2',
  },
  {
    id: 'sakura-blush',
    name: 'Sakura Watercolor',
    bgClass: 'from-[#FFF8FA] via-[#FFEDF3] to-[#FFDCE8]',
    accentColor: '#EC4899',
    borderColor: '#FF99C8',
  },
  {
    id: 'golden-hope',
    name: 'Golden Hope',
    bgClass: 'from-[#FFFBF5] via-[#FFEBF2] to-[#FFD8E6]',
    accentColor: '#9D174D',
    borderColor: '#F6C90E',
  },
  {
    id: 'lavender-rose',
    name: 'Lavender Rose',
    bgClass: 'from-[#FBF5FF] via-[#FCEAF3] to-[#FCDAE8]',
    accentColor: '#831843',
    borderColor: '#E9D5FF',
  },
];

export const CardPreview = forwardRef(({
  recipient = 'Beloved Mother',
  sender = 'With All My Heart',
  relationship = 'Mother',
  messageText = 'Your strength inspires everyone around you. You are not alone — we are with you every step of this journey.',
  personalNote = '',
  photoUrl = '',
  styleId = 'satin-pink',
  className = '',
}, ref) => {
  const currentStyle = CARD_STYLES.find((s) => s.id === styleId) || CARD_STYLES[0];

  return (
    <div
      ref={ref}
      id="greeting-card-export"
      className={`relative w-full max-w-[680px] min-h-[380px] sm:min-h-[420px] rounded-3xl overflow-hidden p-6 sm:p-8 shadow-card-pink border-2 bg-gradient-to-br ${currentStyle.bgClass} select-none text-[#3B1A2B] flex flex-col justify-between ${className}`}
      style={{ borderColor: currentStyle.borderColor }}
    >
      {/* Background Watermark Ribbon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h2 className="font-script text-3xl sm:text-4xl text-[#E0157A] leading-none">
            Breast Cancer
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-sans font-extrabold tracking-[0.25em] text-xs sm:text-sm text-[#7A0B3F] uppercase">
              AWARENESS MONTH
            </span>
            <span className="text-[#E0157A] text-xs">♥</span>
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium text-[#9D174D]/90 mt-1 tracking-wider">
            Early Detection | Timely Treatment | Brighter Tomorrows
          </p>
        </div>

        {/* Right Corner Script Tagline */}
        <div className="text-right hidden sm:block">
          <p className="font-script text-xl sm:text-2xl text-[#E0157A] leading-tight">
            Stronger Together
          </p>
          <p className="font-serif italic text-[11px] text-[#7A0B3F]">
            for a Healthier Tomorrow
          </p>
          <span className="text-[#E0157A] text-xs">♡</span>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center my-3 relative z-10">
        
        {/* Left Column: 4 Core Icons */}
        <div className="col-span-4 sm:col-span-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-pink-500/15 flex items-center justify-center text-[#E0157A] flex-shrink-0">
              <Search className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-bold text-[#7A0B3F]">Be Aware</span>
              <span className="block text-[9px] text-[#9D174D]/80">Know the signs</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-pink-500/15 flex items-center justify-center text-[#E0157A] flex-shrink-0">
              <Stethoscope className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-bold text-[#7A0B3F]">Get Checked</span>
              <span className="block text-[9px] text-[#9D174D]/80">Regular screening saves</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-pink-500/15 flex items-center justify-center text-[#E0157A] flex-shrink-0">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-bold text-[#7A0B3F]">Support</span>
              <span className="block text-[9px] text-[#9D174D]/80">Stand with survivors</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-pink-500/15 flex items-center justify-center text-[#E0157A] flex-shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-bold text-[#7A0B3F]">Together</span>
              <span className="block text-[9px] text-[#9D174D]/80">We make a difference</span>
            </div>
          </div>
        </div>

        {/* Center: Photo Frame with Satin Ribbon Weaving */}
        <div className="col-span-4 sm:col-span-4 flex justify-center relative">
          
          {/* Decorative Floral Cherry Blossoms around frame */}
          <div className="absolute -top-3 -left-3 text-[#E0157A] opacity-90 z-20 pointer-events-none">
            🌸
          </div>
          <div className="absolute -bottom-2 -right-2 text-[#EC4899] opacity-90 z-20 pointer-events-none">
            🌺
          </div>

          {/* Polaroid-style photo frame */}
          <div className="relative bg-white p-2 sm:p-2.5 pb-4 sm:pb-5 rounded-lg shadow-lg border border-pink-200 transform -rotate-1 hover:rotate-0 transition-transform duration-300 w-28 sm:w-36">
            <div className="w-full aspect-[4/5] bg-pink-100/60 rounded overflow-hidden flex items-center justify-center border border-pink-100">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Recipient"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center text-pink-400">
                  <div className="w-10 h-10 rounded-full bg-pink-200/60 flex items-center justify-center mb-1">
                    <Heart className="w-5 h-5 text-pink-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-pink-600">You Are Loved</span>
                </div>
              )}
            </div>
            <p className="text-[9px] font-serif italic text-center text-pink-800/80 mt-1">
              {relationship || 'Together in Hope'}
            </p>
          </div>
        </div>

        {/* Right Column: Ribbon & Hope Symbol */}
        <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-center relative">
          <div className="w-28 sm:w-36 md:w-40 h-36 sm:h-48 md:h-52 flex items-center justify-center">
            <img
              src="/assets/images/pink-ribbon.png"
              alt="Authentic Pink Awareness Ribbon"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(224,21,122,0.35)] transform hover:scale-105 transition-transform"
            />
          </div>
          <div className="text-center mt-0.5">
            <span className="text-[12px] sm:text-sm font-script text-[#E0157A] block font-bold">
              You Are Strong
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Row: Dedication Box (Left) & Inspiring Message (Right) */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 items-end relative z-10 pt-2 border-t border-pink-300/40">
        
        {/* Dedication Fill-in Fields (Left) */}
        <div className="col-span-6 bg-white/70 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl border border-pink-200/80 shadow-sm space-y-1">
          <div className="flex items-center text-[10px] sm:text-[11px]">
            <span className="font-bold text-[#7A0B3F] w-12">To:</span>
            <span className="font-medium text-[#3B1A2B] truncate border-b border-pink-300 flex-1">
              {recipient || '...'}
            </span>
          </div>
          <div className="flex items-center text-[10px] sm:text-[11px]">
            <span className="font-bold text-[#7A0B3F] w-12">From:</span>
            <span className="font-medium text-[#3B1A2B] truncate border-b border-pink-300 flex-1">
              {sender || '...'}
            </span>
          </div>
          <div className="flex items-center text-[10px] sm:text-[11px]">
            <span className="font-bold text-[#7A0B3F] w-12">In:</span>
            <span className="font-medium text-pink-700 truncate border-b border-pink-300 flex-1">
              {relationship || 'Friend / Loved One'}
            </span>
          </div>
        </div>

        {/* Heartfelt Message (Right) */}
        <div className="col-span-6 text-right">
          <p className="font-serif italic text-[11px] sm:text-xs text-[#7A0B3F] font-semibold leading-tight">
            "Your strength inspires, your courage gives hope, your journey matters."
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#3B1A2B]/90 mt-1 line-clamp-3 leading-snug">
            {personalNote ? `${personalNote} — ${messageText}` : messageText}
          </p>
        </div>

      </div>

      {/* Official SGPGI Initiative Small Footer Stamp */}
      <div className="absolute bottom-1 right-3 text-[8px] text-[#9D174D]/60 tracking-wider">
        SGPGI Breast Health Program • Lucknow
      </div>
    </div>
  );
});

CardPreview.displayName = 'CardPreview';
