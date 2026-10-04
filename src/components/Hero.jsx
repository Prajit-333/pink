import React, { useState, useEffect } from 'react';
import { RibbonSVG } from './RibbonSVG';
import { HeartHandshake, BookOpen, ChevronDown, Sparkles, Calendar, Heart } from 'lucide-react';

export const Hero = () => {
  const [octoberStatus, setOctoberStatus] = useState({ isOctober: true, dayOrDays: 1 });

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 9 is October (0-indexed)
    const currentDay = now.getDate();
    const currentYear = now.getFullYear();

    if (currentMonth === 9) {
      // It's October!
      setOctoberStatus({ isOctober: true, dayOrDays: currentDay });
    } else {
      // Calculate days until next Oct 1
      let targetYear = currentYear;
      if (currentMonth > 9) targetYear += 1;
      const nextOct1 = new Date(targetYear, 9, 1);
      const diffTime = Math.abs(nextOct1 - now);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setOctoberStatus({ isOctober: false, dayOrDays: diffDays });
    }
  }, []);

  const fourKeyLines = [
    { title: 'AWARENESS', subtitle: 'BRINGS HOPE', icon: Sparkles },
    { title: 'DETECTION', subtitle: 'SAVES LIVES', icon: Heart },
    { title: 'SUPPORT', subtitle: 'GIVES STRENGTH', icon: HeartHandshake },
    { title: 'TOGETHER', subtitle: 'WE MAKE A DIFFERENCE', icon: Sparkles },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 md:pt-28 pb-16 flex flex-col justify-center overflow-hidden bg-gradient-to-b from-pink-50 via-pink-100/40 to-cream dark:from-pink-950 dark:via-pink-900/30 dark:to-pink-950"
    >
      {/* Decorative Floating Watercolor Petals & Butterflies */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Background Radial Light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-300/25 dark:bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-10 left-10 w-48 h-48 bg-pink-200/40 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl animate-float-medium" />

        {/* Floating Butterflies (SVGs) */}
        <div className="absolute top-28 left-[12%] animate-float-slow opacity-75 hidden md:block">
          <svg width="42" height="42" viewBox="0 0 100 100" fill="#F472A8">
            <path d="M50 50 C40 30 10 20 20 50 C10 80 40 70 50 50 Z M50 50 C60 30 90 20 80 50 C90 80 60 70 50 50 Z" />
            <ellipse cx="50" cy="50" rx="3" ry="15" fill="#BE185D" />
          </svg>
        </div>
        <div className="absolute top-44 right-[15%] animate-float-medium opacity-70 hidden md:block">
          <svg width="34" height="34" viewBox="0 0 100 100" fill="#EC4899">
            <path d="M50 50 C40 30 10 20 20 50 C10 80 40 70 50 50 Z M50 50 C60 30 90 20 80 50 C90 80 60 70 50 50 Z" />
            <ellipse cx="50" cy="50" rx="2.5" ry="12" fill="#7A0B3F" />
          </svg>
        </div>
        <div className="absolute bottom-24 left-[20%] animate-float-slow opacity-60">
          <svg width="30" height="30" viewBox="0 0 100 100" fill="#FFA3C7">
            <path d="M50 50 C40 30 10 20 20 50 C10 80 40 70 50 50 Z M50 50 C60 30 90 20 80 50 C90 80 60 70 50 50 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Top Awareness Month Banner / Countdown */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-pink-900/60 border border-pink-200 dark:border-pink-700 shadow-soft-pink backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
            <Calendar className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <span className="text-xs md:text-sm font-semibold text-pink-800 dark:text-pink-200">
              {octoberStatus.isOctober
                ? `Day ${octoberStatus.dayOrDays} of Breast Cancer Awareness Month`
                : `Next Awareness Month Begins in ${octoberStatus.dayOrDays} Days`}
            </span>
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          </div>
        </div>

        {/* Hero Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left / Center Column: Headings & Ribbon */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            <div className="inline-block">
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-pink-600 dark:text-pink-400 mb-2 block font-sans">
                OCTOBER INITIATIVE
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-burgundy dark:text-pink-100 leading-[1.1] mb-3">
                BREAST <span className="text-pink-600 dark:text-pink-400">CANCER</span> <br />
                <span className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-pink-900/80 dark:text-pink-200/80">
                  AWARENESS MONTH
                </span>
              </h1>
            </div>

            {/* Script Tagline */}
            <div className="my-4">
              <p className="font-script text-3xl sm:text-4xl md:text-5xl text-pink-600 dark:text-pink-300 leading-tight">
                Stay Aware. Stay Positive.
              </p>
              <p className="font-serif italic text-sm sm:text-base text-pink-800/80 dark:text-pink-200/70 mt-1">
                Together for a Brighter Tomorrow
              </p>
            </div>

            {/* Core Message / Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg text-ink/80 dark:text-pink-100/90 font-light mb-8 leading-relaxed">
              "You are not alone, we are here for you." <br className="hidden sm:inline" />
              <span className="font-semibold text-pink-700 dark:text-pink-300">
                Early Detection | Timely Treatment | Brighter Tomorrows
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href="#send-message"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 via-pink-500 to-pink-700 text-white font-semibold text-sm md:text-base shadow-glow-ribbon hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <HeartHandshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Send a Message of Support</span>
              </a>

              <a
                href="#awareness"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/80 dark:bg-pink-950/80 text-pink-800 dark:text-pink-200 border border-pink-300 dark:border-pink-700 font-semibold text-sm md:text-base shadow-soft-pink hover:bg-pink-50 dark:hover:bg-pink-900/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <span>Learn the Signs</span>
              </a>
            </div>

            {/* Department Note */}
            <div className="mt-8 pt-4 border-t border-pink-200/60 dark:border-pink-800/60 flex items-center gap-2 text-xs text-pink-700/80 dark:text-pink-300/80">
              <span className="font-semibold notranslate">SGPGIMS Lucknow</span>
              <span>•</span>
              <span>Dept. of Endocrine & Breast Surgery</span>
              <span>•</span>
              <span className="italic">आत्मना सर्गो जितः</span>
            </div>
          </div>

          {/* Right Column: Hero Satin Pink Ribbon & 4-Pillar Stack */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* The Large Glossy Animated Pink Ribbon */}
            <div className="relative mb-6 transform hover:scale-105 transition-transform duration-500 flex flex-col items-center">
              <RibbonSVG variant="hero" size={440} className="w-[300px] sm:w-[380px] md:w-[440px]" />
              <div className="text-center mt-3">
                <span className="text-xs font-semibold tracking-wider text-pink-700 dark:text-pink-300 uppercase bg-pink-100/90 dark:bg-pink-900/80 px-4 py-1.5 rounded-full border border-pink-200 dark:border-pink-700 shadow-sm notranslate" translate="no">
                  ✨ Tap ribbon for hope
                </span>
              </div>
            </div>

            {/* Stack of Four Key Lines */}
            <div className="w-full max-w-sm space-y-2.5">
              {fourKeyLines.map((line, idx) => {
                const IconComponent = line.icon;
                return (
                  <div
                    key={line.title}
                    style={{ animationDelay: `${idx * 150}ms` }}
                    className="glass-card rounded-xl p-3 px-4 flex items-center justify-between border border-pink-200/80 dark:border-pink-800 shadow-sm hover:border-pink-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 flex items-center justify-center">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-bold tracking-widest text-burgundy dark:text-pink-100 font-sans">
                          {line.title}
                        </span>
                        <span className="block text-[11px] font-medium text-pink-700 dark:text-pink-300">
                          {line.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-pink-400 font-serif italic">0{idx + 1}</span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Animated Scroll Down Cue */}
        <div className="flex justify-center mt-12">
          <a
            href="#send-message"
            className="flex flex-col items-center gap-1 text-xs text-pink-600 dark:text-pink-400 font-medium hover:text-pink-800 transition-colors"
            aria-label="Scroll to Send Message section"
          >
            <span>Explore & Send Message</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>

      </div>

      {/* Decorative Ribbon Divider Bottom */}
      <RibbonSVG variant="divider" className="mt-8 -mb-4" />
    </section>
  );
};
