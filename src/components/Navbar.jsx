import React, { useState, useEffect } from 'react';
import { RibbonSVG } from './RibbonSVG';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Menu, X, Moon, Sun, HeartHandshake } from 'lucide-react';

export const Navbar = ({ darkMode, setDarkMode }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'send-message', label: 'Send Message', href: '#send-message' },
    { id: 'about', label: 'About Initiative', href: '#about' },
    { id: 'awareness', label: 'Why Awareness Matters', href: '#awareness' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scrollspy calculation
      const sections = navLinks.map((link) => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-nav shadow-soft-pink py-2.5' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-lg p-1"
            aria-label="Breast Cancer Awareness Month Home"
          >
            <div className="relative">
              <RibbonSVG variant="logo" size={38} />
              <div className="absolute -inset-1 bg-pink-400/20 blur rounded-full -z-10 group-hover:scale-125 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg md:text-xl text-burgundy dark:text-pink-200 leading-tight">
                Pink Hope
              </span>
              <span className="text-[10px] tracking-wider text-pink-700 dark:text-pink-400 uppercase font-semibold">
                SGPGI Breast Health
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 dark:bg-pink-950/60 px-4 py-1.5 rounded-full border border-pink-200/70 dark:border-pink-800 shadow-sm backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'text-white bg-pink-600 shadow-sm'
                      : 'text-ink dark:text-pink-100 hover:text-pink-600 dark:hover:text-pink-300 hover:bg-pink-100/60 dark:hover:bg-pink-900/40'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher, Dark Mode, CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher variant="navbar" />

            {/* Dark Rose Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Rose Theme'}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Direct Action Button */}
            <a
              href="#send-message"
              onClick={(e) => handleNavClick(e, '#send-message')}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-700 text-white text-xs font-semibold shadow-glow-pink hover:shadow-glow-ribbon hover:scale-105 active:scale-95 transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Send Message</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-pink-700 dark:text-pink-300"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-pink-800 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-900 focus:outline-none"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 p-4 rounded-2xl glass-card border border-pink-200 dark:border-pink-800 shadow-card-pink animate-in fade-in slide-in-from-top-3">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    activeSection === link.id
                      ? 'bg-pink-600 text-white'
                      : 'text-ink dark:text-pink-100 hover:bg-pink-100 dark:hover:bg-pink-900/60'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-pink-200 dark:border-pink-800 flex items-center justify-between notranslate" translate="no">
                <span className="text-xs text-pink-700 dark:text-pink-300 font-medium notranslate" translate="no">Language:</span>
                <LanguageSwitcher variant="navbar" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
