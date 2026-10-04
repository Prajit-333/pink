import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { RibbonCursorTrail } from './components/RibbonCursorTrail';
import { ScrollRibbon } from './components/ScrollRibbon';
import { RibbonProgress } from './components/RibbonProgress';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MessageWizard } from './components/MessageWizard';
import { About } from './components/About';
import { Awareness } from './components/Awareness';
import { Footer } from './components/Footer';

export function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme_dark') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_dark', 'false');
    }
  }, [darkMode]);

  // Set Message Sending form as the initial landing view, with Home remaining accessible on scroll-up
  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#send-message') {
      const timer = setTimeout(() => {
        const sendSection = document.getElementById('send-message');
        if (sendSection) {
          sendSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen relative selection:bg-pink-500 selection:text-white transition-colors duration-300">
      {/* 1. Preloader Animation */}
      <Preloader />

      {/* 2. Desktop Cursor Trail */}
      <RibbonCursorTrail />

      {/* 3. Progressive Scroll Drawing Ribbon */}
      <ScrollRibbon />

      {/* 4. Bottom-Right Ribbon Progress Indicator & Top Scroll */}
      <RibbonProgress />

      {/* 5. Sticky Glass Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* 6. Main Content Sections */}
      <main>
        {/* Section 1: Hero / Home */}
        <Hero />

        {/* Section 2: Send a Message (Core Feature) */}
        <MessageWizard />

        {/* Section 3: About the Initiative (SGPGIMS Department) */}
        <About />

        {/* Section 4: Why Awareness Matters (Brochure Educational Cards) */}
        <Awareness />
      </main>

      {/* Section 5: Footer & Contact */}
      <Footer />
    </div>
  );
}

export default App;
