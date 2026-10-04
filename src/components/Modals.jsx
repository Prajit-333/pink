import React from 'react';
import { X, ShieldCheck, FileText, MapPin, ExternalLink } from 'lucide-react';

export const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-pink-950 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-pink-200 dark:border-pink-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-pink-600 dark:text-pink-400 hover:bg-pink-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 text-pink-600">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="font-serif text-2xl font-bold text-burgundy dark:text-pink-100">
            Privacy Policy & Data Ethics
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-ink/85 dark:text-pink-200/90 leading-relaxed">
          <p>
            <strong>1. Zero Data Retention for Personal Messages:</strong> Our Pink Hope greeting card generator processes all personal dedication texts, uploaded pictures, and recorded voice notes directly on your local device (client-side). We do not store or inspect your private messages.
          </p>
          <p>
            <strong>2. Direct Sharing via Native Apps:</strong> When you send via WhatsApp, SMS, or Email, the data passes directly from your device to the target messaging app using native URLs or the browser's Web Share API.
          </p>
          <p>
            <strong>3. Cookies & Analytics:</strong> This website is cookie-free by default, except for standard multilingual preferences (e.g., storing your selected language in local storage and the Google Translate cookie).
          </p>
          <p>
            <strong>4. Contact Information:</strong> For any privacy inquiries relating to the SGPGI Breast Health Program, please reach out directly to the Department of Endocrine & Breast Surgery, SGPGIMS Lucknow.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-pink-200 dark:border-pink-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-pink-600 text-white text-xs font-bold hover:bg-pink-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-pink-950 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-pink-200 dark:border-pink-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-pink-600 dark:text-pink-400 hover:bg-pink-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 text-pink-600">
          <FileText className="w-6 h-6" />
          <h3 className="font-serif text-2xl font-bold text-burgundy dark:text-pink-100">
            Terms of Use & Medical Notice
          </h3>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-ink/85 dark:text-pink-200/90 leading-relaxed">
          <p>
            <strong>1. Public Awareness Purpose:</strong> This platform is designed exclusively for public interest health education and to foster compassionate emotional support during Breast Cancer Awareness Month (October).
          </p>
          <p>
            <strong>2. Not Medical Advice:</strong> Information provided regarding symptoms, BSE guidelines, and risk factors is for general educational awareness only. It must never substitute for a formal clinical consultation, mammographic screening, or biopsy with a certified physician.
          </p>
          <p>
            <strong>3. Responsible Use:</strong> Users agree to use the greeting card generator respectfully and not transmit unlawful, defamatory, or abusive content.
          </p>
          <p>
            <strong>4. Intellectual Integrity:</strong> Brochure clinical guidelines are referenced from the Department of Endocrine & Breast Surgery, SGPGIMS Lucknow, India.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-pink-200 dark:border-pink-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-pink-600 text-white text-xs font-bold hover:bg-pink-700"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export const MapModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-pink-950 rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-pink-200 dark:border-pink-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-pink-600 dark:text-pink-400 hover:bg-pink-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 text-pink-600">
          <MapPin className="w-6 h-6" />
          <h3 className="font-serif text-2xl font-bold text-burgundy dark:text-pink-100">
            SGPGIMS Lucknow Location
          </h3>
        </div>

        <div className="mb-4">
          <p className="text-xs text-ink/80 dark:text-pink-200">
            Department of Endocrine & Breast Surgery, Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS), Raebareli Road, Lucknow, Uttar Pradesh 226014.
          </p>
        </div>

        {/* Embedded Google Maps iframe (No API Key required) */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-pink-200 dark:border-pink-800 shadow-inner mb-4">
          <iframe
            title="SGPGIMS Lucknow Location Map"
            src="https://maps.google.com/maps?q=Sanjay+Gandhi+Postgraduate+Institute+of+Medical+Sciences+Lucknow&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div className="flex justify-between items-center">
          <a
            href="https://maps.google.com/?q=Sanjay+Gandhi+Postgraduate+Institute+of+Medical+Sciences+Lucknow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-pink-600 hover:underline flex items-center gap-1"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-pink-600 text-white text-xs font-bold hover:bg-pink-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
