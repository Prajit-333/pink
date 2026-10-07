import React, { useState } from 'react';
import { RibbonSVG } from './RibbonSVG';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PrivacyModal, TermsModal, MapModal } from './Modals';
import {
  Phone,
  Globe,
  MapPin,
  Heart,
  Share2,
  ArrowUp,
  MessageCircle,
  ExternalLink,
  ShieldAlert,
  Check,
  LockKeyhole,
} from 'lucide-react';

export const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      '🌸 October is Breast Cancer Awareness Month. Early detection saves lives! Send a personalized message of hope and learn self-examination.'
    );

    let shareUrl = '';
    if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <footer
      id="contact"
      className="relative bg-gradient-to-b from-pink-900 via-burgundy to-[#2D0416] text-pink-100 pt-16 pb-12 overflow-hidden"
    >
      {/* Background Decorative Heart Ribbon */}
      <div className="absolute top-0 right-10 opacity-10 pointer-events-none">
        <RibbonSVG variant="heart" size={380} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Emergency / Care Guidance Banner */}
        <div className="mb-12 p-5 rounded-2xl bg-pink-950/70 border border-pink-700/50 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-600/30 flex items-center justify-center text-pink-400 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">
                Clinical Guidance & Consultation
              </h4>
              <p className="text-xs text-pink-300">
                "If you notice any symptoms or unusual breast changes, consult a specialist doctor right away."
              </p>
            </div>
          </div>

          <a
            href="tel:05222496200"
            className="px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-glow-pink flex items-center gap-2 transition-transform hover:scale-105 flex-shrink-0 notranslate"
          >
            <Phone className="w-4 h-4" />
            <span>Call SGPGI Helpline: 0522-2496200</span>
          </a>
        </div>

        {/* Main Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Col 1: Brand & SGPGI Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <RibbonSVG variant="logo" size={42} />
              <div>
                <h3 className="font-serif font-bold text-xl text-white">
                  Pink Hope
                </h3>
                <p className="text-xs text-pink-300">
                  Breast Cancer Awareness Initiative
                </p>
              </div>
            </div>

            <p className="text-xs text-pink-200/80 leading-relaxed font-light">
              Issued in public interest by the{' '}
              <span className="font-semibold text-white notranslate">
                Department of Endocrine & Breast Surgery
              </span>
              , Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS), Lucknow, India.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="flex items-center gap-2 text-pink-300 hover:text-white transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>SGPGIMS, Raebareli Road, Lucknow, UP 226014 (View Map)</span>
              </button>

              <a
                href="https://www.sgpgibreasthealth.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-300 hover:text-white transition-colors notranslate"
              >
                <Globe className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>www.sgpgibreasthealth.org.in</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-pink-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-pink-200/90">
              <li>
                <a href="#home" className="hover:text-pink-400 transition-colors">
                  Home & Overview
                </a>
              </li>
              <li>
                <a href="#send-message" className="hover:text-pink-400 transition-colors">
                  Send Support Greeting Card
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-pink-400 transition-colors">
                  About SGPGI Initiative
                </a>
              </li>
              <li>
                <a href="#awareness" className="hover:text-pink-400 transition-colors">
                  Signs, Symptoms & Risk Factors
                </a>
              </li>
              <li>
                <a href="#awareness" className="hover:text-pink-400 transition-colors">
                  Self-Exam Guide (BSE)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Social Sharing & Community */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-pink-400">
              Spread the Word
            </h4>
            <p className="text-xs text-pink-200/80 leading-relaxed font-light">
              "Awareness brings hope · Detection saves lives · Support gives strength · Together we make a difference."
            </p>

            {/* Social Sharing Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => shareOnSocial('whatsapp')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => shareOnSocial('facebook')}
                className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-xs font-semibold text-white transition-colors"
              >
                Facebook
              </button>

              <button
                type="button"
                onClick={() => shareOnSocial('twitter')}
                className="px-3 py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600 border border-sky-500/40 text-xs font-semibold text-white transition-colors"
              >
                X (Twitter)
              </button>

              <button
                type="button"
                onClick={copyPageLink}
                className="px-3 py-1.5 rounded-xl bg-pink-800/60 hover:bg-pink-700 border border-pink-600/40 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Multilingual Switcher in Footer */}
            <div className="pt-2">
              <LanguageSwitcher variant="footer" />
            </div>
          </div>

        </div>

        {/* Bottom Bar: Modals, Disclaimer, Copyright */}
        <div className="pt-8 border-t border-pink-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-pink-300/80">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Terms of Use
            </button>
            <span>•</span>
            <span className="italic">आत्मना सर्गो जितः</span>
            <span>•</span>
            <a href="/#owner-report" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <LockKeyhole className="h-3 w-3" />
              Owner monitor
            </a>
          </div>

          <div className="flex items-center gap-2 text-center">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 inline" />
            <span>for Breast Cancer Awareness Month (October)</span>
          </div>

          {/* Back to Top Ribbon Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-800/80 hover:bg-pink-700 text-pink-200 hover:text-white transition-all text-xs"
            title="Back to Top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* Popups / Modals */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <MapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} />
    </footer>
  );
};
