import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', short: 'EN' },
  { code: 'hi', label: 'हिन्दी', native: 'हिन्दी', short: 'HI' },
  { code: 'ta', label: 'தமிழ்', native: 'தமிழ்', short: 'TA' },
  { code: 'kn', label: 'ಕನ್ನಡ', native: 'ಕನ್ನಡ', short: 'KN' },
];

export const LanguageSwitcher = ({ variant = 'navbar', className = '' }) => {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Read saved language from localStorage or cookie
    const getCookieLang = () => {
      const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/i);
      return match ? match[1].toLowerCase() : null;
    };

    const initialLang = getCookieLang() || localStorage.getItem('site_lang') || 'en';
    setCurrentLang(initialLang);
    document.documentElement.lang = initialLang;

    // Listen for custom cross-component language change events
    const handleLangEvent = (e) => {
      if (e.detail && e.detail.lang) {
        setCurrentLang(e.detail.lang);
        document.documentElement.lang = e.detail.lang;
      }
    };
    window.addEventListener('app_language_change', handleLangEvent);
    return () => window.removeEventListener('app_language_change', handleLangEvent);
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('site_lang', langCode);
    document.documentElement.lang = langCode;

    // Set Google Translate cookie across all domain levels and paths
    const cookieValue = `/en/${langCode}`;
    const hostname = window.location.hostname;
    
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
    
    // For domain sub-levels (e.g. localhost or example.com)
    const domainParts = hostname.split('.');
    if (domainParts.length > 1) {
      const rootDomain = '.' + domainParts.slice(-2).join('.');
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${rootDomain};`;
    }

    // Dispatch custom event so native message components update instantly
    window.dispatchEvent(new CustomEvent('app_language_change', { detail: { lang: langCode } }));

    // Trigger Google Translate select dropdown element if present
    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change', { bubbles: true }));
      selectElem.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // Reload page so Google Translate reads the new cookie and translates the whole page
      window.location.reload();
    }
  };

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-2 notranslate ${className}`} translate="no">
        <Globe className="w-4 h-4 text-pink-600 dark:text-pink-400" />
        <span className="text-xs font-medium text-pink-800 dark:text-pink-300 mr-1 notranslate" translate="no">
          Language / भाषा / மொழி / ಕನ್ನಡ:
        </span>
        <div className="flex bg-pink-100/80 dark:bg-pink-900/60 p-1 rounded-full border border-pink-200 dark:border-pink-700 notranslate" translate="no">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              translate="no"
              onClick={() => changeLanguage(lang.code)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 notranslate ${
                currentLang === lang.code
                  ? 'bg-pink-600 text-white shadow-sm scale-105'
                  : 'text-pink-800 dark:text-pink-200 hover:text-pink-950 dark:hover:text-white'
              }`}
            >
              <span className="notranslate" translate="no">{lang.native}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Navbar Switcher
  return (
    <div
      className={`flex items-center bg-pink-100/90 dark:bg-pink-900/60 p-1 rounded-full border border-pink-200/80 dark:border-pink-700 shadow-sm notranslate ${className}`}
      translate="no"
    >
      <Globe className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 ml-1.5 mr-1" />
      <div className="flex gap-0.5 notranslate" translate="no">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            translate="no"
            onClick={() => changeLanguage(lang.code)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 notranslate ${
              currentLang === lang.code
                ? 'bg-pink-600 text-white shadow-sm scale-105'
                : 'text-pink-900 dark:text-pink-200 hover:text-pink-950 hover:bg-pink-200/50 dark:hover:bg-pink-800/40'
            }`}
            title={`Translate entire website to ${lang.label}`}
          >
            <span className="notranslate" translate="no">{lang.native}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
