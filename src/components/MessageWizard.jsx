import React, { useState, useEffect, useRef } from 'react';
import messagesData from '../data/messages.json';
import { CardPreview, CARD_STYLES } from './CardPreview';
import { PhotoUploader } from './PhotoUploader';
import { RibbonSVG } from './RibbonSVG';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Send,
  MessageCircle,
  Mail,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Smile,
  Copy,
  RefreshCw,
} from 'lucide-react';

const COMMON_EMOJIS = ['💖', '🌸', '🎀', '🌺', '✨', '💐', '🕊️', '💪', '🤗', '🌟', '🙏', '❤️'];

const RELATIONSHIPS = [
  'Mother',
  'Sister',
  'Daughter',
  'Wife',
  'Friend',
  'Colleague',
  'Aunt',
  'Grandmother',
  'Survivor Warrior',
  'Other',
];

export const MessageWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState('awareness');
  const [selectedMessageId, setSelectedMessageId] = useState('aw-1');
  const [currentLang, setCurrentLang] = useState('en');

  // Form Fields
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [personalNote, setPersonalNote] = useState('');
  const [includeNudge, setIncludeNudge] = useState(true);
  const [cardStyle, setCardStyle] = useState('satin-pink');
  const [photoDataUrl, setPhotoDataUrl] = useState('');

  // Send Step Fields
  const [channel, setChannel] = useState('whatsapp');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);

  // Status & UI States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [sendError, setSendError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessageText, setCopiedMessageText] = useState(false);
  const [copiedCardImage, setCopiedCardImage] = useState(false);
  const [cardImageClipboardError, setCardImageClipboardError] = useState('');
  const [cardImageForClipboard, setCardImageForClipboard] = useState(null);
  const [generatedLinks, setGeneratedLinks] = useState({
    whatsapp: '',
    gmail: '',
    outlook: '',
    mailto: '',
    sms: '',
    fullText: '',
  });

  const cardRef = useRef(null);

  // Sync language with global language switcher
  useEffect(() => {
    const savedLang = localStorage.getItem('site_lang') || 'en';
    setCurrentLang(savedLang);

    const handleLangChange = (e) => {
      if (e.detail?.lang) {
        setCurrentLang(e.detail.lang);
      }
    };
    window.addEventListener('app_language_change', handleLangChange);
    return () => window.removeEventListener('app_language_change', handleLangChange);
  }, []);

  // Retrieve current active category messages (exactly 4 rich messages)
  const currentCategoryMessages = messagesData.messages[activeCategory] || [];
  const activeMessageObj =
    currentCategoryMessages.find((m) => m.id === selectedMessageId) ||
    currentCategoryMessages[0] || { en: '', hi: '', ta: '', kn: '' };

  const activeMessageText =
    activeMessageObj[currentLang] || activeMessageObj.en || '';

  const finalFormattedMessage = `${activeMessageText}${
    includeNudge
      ? currentLang === 'hi'
        ? '\n\n(याद रखें: जल्दी पहचान जीवन बचाती है — कृपया नियमित जांच कराएं)'
        : currentLang === 'ta'
        ? '\n\n(நினைவூட்டல்: முன்கூட்டியே கண்டறிவது உயிரைக் காக்கும் — வழக்கமான பரிசோதனை செய்யுங்கள்)'
        : currentLang === 'kn'
        ? '\n\n(ನೆನಪಿರಲಿ: ಆರಂಭಿಕ ಪತ್ತೆಯು ಜೀವಗಳನ್ನು ಉಳಿಸುತ್ತದೆ — ದಯವಿಟ್ಟು ನಿಯಮಿತ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ)'
        : '\n\n(Reminder: Early detection saves lives — please get checked regularly.)'
      : ''
  }`;

  // Helper to append emoji
  const addEmoji = (emoji) => {
    if (personalNote.length + emoji.length <= 300) {
      setPersonalNote((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  // Export card to PNG canvas in memory
  const generateCardImageBlob = async () => {
    if (!cardRef.current) return null;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFF1F6',
      });
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
      });
    } catch (err) {
      console.error('Canvas export error:', err);
      return null;
    }
  };

  const copyCardImageToClipboard = async () => {
    setCardImageClipboardError('');
    if (!cardImageForClipboard) {
      setCardImageClipboardError('The card image is not available to copy.');
      return;
    }
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
      setCardImageClipboardError('Image clipboard is not supported in this browser. Download the card and attach it manually.');
      return;
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [cardImageForClipboard.type || 'image/png']: cardImageForClipboard }),
      ]);
      setCopiedCardImage(true);
      setTimeout(() => setCopiedCardImage(false), 3000);
    } catch (err) {
      console.error('Image clipboard copy failed:', err);
      setCardImageClipboardError('The browser blocked image clipboard access. Download the card and attach it manually.');
    }
  };

  // Core Send Action: Direct dispatch to designated mail or mobile number without downloading locally
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!consentGiven) {
      alert('Please agree to the privacy & consent terms before sending.');
      return;
    }

    if (!recipient.trim()) {
      alert('Please enter the recipient name (To).');
      return;
    }

    if (!sender.trim()) {
      alert('Please enter your name (From).');
      return;
    }

    setIsSending(true);
    setSendError('');

    // Generate Card PNG Blob in memory for transmission
    const cardBlob = await generateCardImageBlob();
    let cardFile = null;
    if (cardBlob) {
      cardFile = new File([cardBlob], `Pink-Hope-Card-${recipient}.png`, { type: 'image/png' });
    }
    setCardImageForClipboard(cardFile);

    // Clean Phone Number & Full Formatted Text
    const rawNumber = `${countryCode}${phoneNumber}`.replace(/[^0-9]/g, '');
    const cleanPhone = rawNumber.startsWith('0') ? rawNumber.replace(/^0+/, '') : rawNumber;

    const fullTextBody = `🎀 *October Breast Cancer Awareness Month*\n\nTo: ${recipient}\nFrom: ${sender} (${relationship})\n\n"${personalNote ? personalNote + '\n\n' : ''}${finalFormattedMessage}"\n\n🌸 *SGPGIMS Breast Health Program* - www.sgpgibreasthealth.org.in\nHelpline: 0522-2496200`;
    const encodedBody = encodeURIComponent(fullTextBody);
    const emailSubject = encodeURIComponent(`Breast Cancer Awareness & Hope Card for ${recipient}`);

    // WhatsApp Universal Link
    const waAppUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedBody}`
      : `https://api.whatsapp.com/send?text=${encodedBody}`;

    // Webmail Links
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${emailSubject}&body=${encodedBody}`;
    const defaultMailUrl = `mailto:${emailAddress}?subject=${emailSubject}&body=${encodedBody}`;

    // SMS URL
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsSeparator = isIOS ? '&' : '?';
    const smsUrl = `sms:${cleanPhone}${smsSeparator}body=${encodedBody}`;

    // Store generated URLs for modal quick access
    setGeneratedLinks({
      whatsapp: waAppUrl,
      gmail: gmailUrl,
      outlook: '',
      mailto: defaultMailUrl,
      sms: smsUrl,
      fullText: fullTextBody,
    });

    // 1. Try Backend API first (Twilio WhatsApp / SendGrid Email)
    let sentViaBackend = false;
    try {
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const backendUrl = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5001/api' : '/api');

      const formData = new FormData();
      formData.append('channel', channel);
      formData.append('recipient', recipient);
      formData.append('sender', sender);
      formData.append('relationship', relationship);
      formData.append('message', `${personalNote ? personalNote + '\n\n' : ''}${finalFormattedMessage}`);
      formData.append('messageText', `${personalNote ? personalNote + '\n\n' : ''}${finalFormattedMessage}`);
      formData.append('phoneNumber', `${countryCode}${phoneNumber}`);
      formData.append('phone', `${countryCode}${phoneNumber}`);
      formData.append('email', emailAddress);
      formData.append('emailAddress', emailAddress);
      if (cardFile) {
        formData.append('cardImage', cardFile, `Pink-Hope-Card-${recipient}.png`);
      }

      const response = await fetch(`${backendUrl}/send-card`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Pink Hope] Card dispatched via backend:', data);
        sentViaBackend = channel === 'whatsapp' ? data.result?.mediaAttached === true : true;
        if (channel === 'whatsapp' && !sentViaBackend) {
          setSendError('Twilio did not attach the card image. Check the Render and Twilio logs, then try again.');
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.warn('[Pink Hope] Backend dispatch response error:', errData);
        if (channel === 'whatsapp') {
          setSendError(errData.error || 'Twilio WhatsApp delivery failed.');
        }
      }
    } catch (err) {
      console.warn('[Pink Hope] Backend connection error, proceeding with confirmation:', err);
      if (channel === 'whatsapp') {
        setSendError('The Twilio backend could not be reached. WhatsApp was not opened.');
      }
    }

    // 2. Client-side direct transmission (Web Share API with image file on mobile, or direct app launch)
    if (!sentViaBackend && channel !== 'whatsapp') {
      let sharedViaWebShare = false;
      const shareFiles = [];
      if (cardFile) shareFiles.push(cardFile);

      if (
        navigator.canShare &&
        navigator.canShare({ files: shareFiles }) &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      ) {
        try {
          await navigator.share({
            title: `Breast Cancer Awareness Card for ${recipient}`,
            text: fullTextBody,
            files: shareFiles,
          });
          sharedViaWebShare = true;
        } catch (err) {
          if (err.name !== 'AbortError') console.error('Web share error:', err);
        }
      }

      if (!sharedViaWebShare) {
        if (channel === 'whatsapp') {
          const popup = window.open(waAppUrl, '_blank');
          if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            window.location.href = waAppUrl;
          }
        } else if (channel === 'sms') {
          window.location.href = smsUrl;
        }
        // Note: For 'email', no external mailto handler is launched. Backend handles delivery seamlessly.
      }
    }

    setIsSending(false);
    if (channel === 'whatsapp' && !sentViaBackend) {
      return;
    }
    setSuccessModalOpen(true);

    // Confetti burst
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#E0157A', '#F472A8', '#FFC2D9', '#FFF1F6', '#BE185D'],
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section
      id="send-message"
      className="py-16 md:py-24 bg-gradient-to-b from-cream via-pink-50/70 to-pink-100/30 dark:from-pink-950 dark:via-pink-900/20 dark:to-pink-950 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Scroll Up to Home Indicator */}
        <div className="flex justify-center mb-6">
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-pink-900/60 hover:bg-pink-100 dark:hover:bg-pink-800 text-pink-700 dark:text-pink-300 text-xs font-semibold shadow-soft-pink border border-pink-200/80 dark:border-pink-800 backdrop-blur-sm transition-all group"
          >
            <ChevronUp className="w-4 h-4 text-pink-500 group-hover:-translate-y-0.5 transition-transform" />
            <span>Scroll up to view Overview & SGPGI Initiative</span>
          </a>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-900/60 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>PERSONALIZED GREETING & AWARENESS CARD</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy dark:text-pink-100 mb-3">
            Send a Message of Strength & Hope
          </h2>
          <p className="text-sm sm:text-base text-ink/80 dark:text-pink-200/80 leading-relaxed font-light">
            Choose an inspiring message, attach an optional picture, add your names, and send the complete card directly to their WhatsApp, SMS, or Email.
          </p>
        </div>

        {/* 2-Step Stepper Navigation */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-pink-200 dark:bg-pink-800 -z-0" />
            
            {[
              { num: 1, label: '1. Choose Message & Photo' },
              { num: 2, label: '2. Personalise, Preview & Send' },
            ].map((step) => {
              const isCompleted = currentStep > step.num;
              const isActive = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className="flex flex-col items-center gap-1.5 relative z-10 focus:outline-none group"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-pink-600 text-white shadow-glow-pink scale-110'
                        : isCompleted
                        ? 'bg-pink-500 text-white'
                        : 'bg-white dark:bg-pink-900 text-pink-400 border-2 border-pink-300 dark:border-pink-700'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isActive
                        ? 'text-pink-700 dark:text-pink-300 font-bold'
                        : 'text-pink-900/70 dark:text-pink-300/70'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wizard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Current Wizard Step */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-pink-200/80 dark:border-pink-800 shadow-card-pink">
              
              {/* ================= STEP 1: CHOOSE MESSAGE & PHOTO ================= */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-pink-200 dark:border-pink-800 pb-3">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy dark:text-pink-100">
                      Step 1: Choose Your Message & Photo
                    </h3>
                    <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">
                      Select one of the 4 inspiring messages below and attach an optional photo.
                    </p>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {messagesData.categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(cat.id);
                          const first = messagesData.messages[cat.id]?.[0];
                          if (first) setSelectedMessageId(first.id);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          activeCategory === cat.id
                            ? 'bg-pink-600 text-white shadow-sm scale-105'
                            : 'bg-pink-100/70 dark:bg-pink-900/40 text-pink-800 dark:text-pink-200 hover:bg-pink-200'
                        }`}
                      >
                        {cat.name[currentLang] || cat.name.en}
                      </button>
                    ))}
                  </div>

                  {/* 4 Messages in 2x2 Grid with Starting Glimpse & Hover Full Reveal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCategoryMessages.map((msg, index) => {
                      const isSelected = selectedMessageId === msg.id;
                      const text = msg[currentLang] || msg.en;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedMessageId(msg.id)}
                          className={`group relative p-3 rounded-xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-pink-600 bg-pink-50/95 dark:bg-pink-900/60 shadow-md scale-[1.01]'
                              : 'border-pink-200 dark:border-pink-800/60 bg-white/70 dark:bg-pink-950/40 hover:border-pink-400 hover:bg-pink-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                                Message #{index + 1}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                              )}
                            </div>
                            {/* 2-line Starting Glimpse */}
                            <p className="text-xs text-ink dark:text-pink-100 leading-snug font-serif italic line-clamp-2 group-hover:line-clamp-none transition-all">
                              "{text}"
                            </p>
                          </div>
                          
                          <span className="text-[9px] text-pink-500/80 mt-1.5 self-end opacity-70 group-hover:opacity-100">
                            Hover to read full ▾
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Personal Words & Emoji Picker (Compact) */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-pink-900 dark:text-pink-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                        <span>Add Your Personal Words (Optional)</span>
                      </label>
                      <span className="text-[10px] text-pink-500 font-mono">
                        {personalNote.length}/300
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        value={personalNote}
                        onChange={(e) => setPersonalNote(e.target.value.slice(0, 300))}
                        placeholder="Add your own personal blessing, memory, or loving note..."
                        rows={2}
                        className="w-full p-2.5 pr-10 rounded-xl bg-white/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-xs text-ink dark:text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-pink-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute right-2 top-2 p-1.5 rounded-lg text-pink-500 hover:bg-pink-100 dark:hover:bg-pink-800 transition-colors"
                        title="Add emoji"
                      >
                        <Smile className="w-4 h-4" />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute right-0 bottom-full mb-2 p-2 bg-white dark:bg-pink-900 rounded-xl shadow-lg border border-pink-200 dark:border-pink-700 flex flex-wrap gap-1 w-48 z-30">
                          {COMMON_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => addEmoji(emoji)}
                              className="text-lg p-1 hover:scale-125 transition-transform"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Integrated Compact Photo Uploader */}
                  <PhotoUploader
                    photoDataUrl={photoDataUrl}
                    setPhotoDataUrl={setPhotoDataUrl}
                  />

                  {/* Early Detection Nudge Checkbox (Compact) */}
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-pink-100/50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeNudge}
                      onChange={(e) => setIncludeNudge(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-pink-600 focus:ring-pink-500 border-pink-300"
                    />
                    <div className="text-[11px]">
                      <span className="font-semibold text-pink-900 dark:text-pink-100">
                        Include early detection reminder:
                      </span>
                      <span className="text-pink-600 dark:text-pink-300 ml-1">
                        "Early detection saves lives — please get checked regularly."
                      </span>
                    </div>
                  </label>

                  {/* Step 1 Continue Button */}
                  <div className="flex justify-end pt-4 border-t border-pink-200 dark:border-pink-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm font-bold shadow-glow-pink flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                    >
                      <span>Continue to Personalise & Send</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: PERSONALISE, PREVIEW & SEND ================= */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-pink-200 dark:border-pink-800 pb-3">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy dark:text-pink-100">
                      Step 2: Add Names, Style & Send Card
                    </h3>
                    <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">
                      Fill in recipient and sender details to appear on the card, select your delivery channel, and send.
                    </p>
                  </div>

                  {/* Names & Relationship Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-pink-900 dark:text-pink-200 mb-1">
                        To (Recipient Name) *
                      </label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="e.g. Amma, Priya, Dr. Anita"
                        className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-xs sm:text-sm text-ink dark:text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-pink-900 dark:text-pink-200 mb-1">
                        From (Your Name) *
                      </label>
                      <input
                        type="text"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        placeholder="e.g. Rahul, Sneha, Your Family"
                        className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-xs sm:text-sm text-ink dark:text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-pink-900 dark:text-pink-200 mb-1">
                        Relationship
                      </label>
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-xs sm:text-sm text-ink dark:text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {RELATIONSHIPS.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Card Theme Picker */}
                  <div>
                    <label className="block text-xs font-bold text-pink-900 dark:text-pink-200 mb-2">
                      Choose Card Style Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {CARD_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setCardStyle(style.id)}
                          className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                            cardStyle === style.id
                              ? 'border-pink-600 bg-pink-100 dark:bg-pink-900 shadow-sm scale-105'
                              : 'border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950/40 hover:border-pink-400'
                          }`}
                        >
                          <div
                            className={`w-full h-4 rounded-md mb-1.5 bg-gradient-to-r ${style.bgClass}`}
                          />
                          <span className="text-[11px] font-bold text-pink-900 dark:text-pink-100 block truncate">
                            {style.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Channel Selection */}
                  <div>
                    <label className="block text-xs font-bold text-pink-900 dark:text-pink-200 mb-2">
                      Select Delivery Channel
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setChannel('whatsapp')}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          channel === 'whatsapp'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-sm scale-105'
                            : 'border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950/40 text-pink-800 hover:border-emerald-300'
                        }`}
                      >
                        <MessageCircle className="w-6 h-6 text-emerald-500" />
                        <span className="text-xs font-bold">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChannel('sms')}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          channel === 'sms'
                            ? 'border-pink-600 bg-pink-100 dark:bg-pink-900/60 text-pink-900 dark:text-pink-100 shadow-sm scale-105'
                            : 'border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950/40 text-pink-800 hover:border-pink-400'
                        }`}
                      >
                        <Smartphone className="w-6 h-6 text-pink-600" />
                        <span className="text-xs font-bold">SMS Text</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChannel('email')}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          channel === 'email'
                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 shadow-sm scale-105'
                            : 'border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-950/40 text-pink-800 hover:border-sky-300'
                        }`}
                      >
                        <Mail className="w-6 h-6 text-sky-500" />
                        <span className="text-xs font-bold">Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Channel Inputs */}
                  {channel === 'whatsapp' || channel === 'sms' ? (
                    <div>
                      <label className="block text-xs font-bold text-pink-900 dark:text-pink-200 mb-1">
                        Recipient Mobile Number *
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="p-2.5 rounded-xl bg-white/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-xs font-semibold text-pink-900 dark:text-pink-100 focus:outline-none"
                        >
                          <option value="+91">🇮🇳 +91 (India)</option>
                          <option value="+1">🇺🇸 +1 (USA/Can)</option>
                          <option value="+44">🇬🇧 +44 (UK)</option>
                          <option value="+971">🇦🇪 +971 (UAE)</option>
                          <option value="+65">🇸🇬 +65 (SG)</option>
                          <option value="+61">🇦🇺 +61 (AU)</option>
                        </select>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="flex-1 p-2.5 rounded-xl bg-white/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-xs sm:text-sm text-ink dark:text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <p className="text-[11px] text-pink-500 mt-1">
                        Dispatches the greeting card and message directly to the recipient.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-pink-900 dark:text-pink-200 mb-1">
                        Recipient Email Address *
                      </label>
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="e.g. lovedone@example.com"
                        className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-xs sm:text-sm text-ink dark:text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <p className="text-[11px] text-pink-500 mt-1">
                        Sends the greeting card along with message to the designated email.
                      </p>
                    </div>
                  )}

                  {/* Privacy & Consent Note */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-pink-800 dark:text-pink-300 pt-1">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-pink-600 focus:ring-pink-500 border-pink-300"
                    />
                    <span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                      <strong>Privacy Commitment:</strong> We respect your privacy. Messages and names are transmitted securely and never sold or stored beyond delivery.
                    </span>
                  </label>

                  {sendError && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
                      {sendError}
                    </p>
                  )}

                  {/* Step 2 Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-pink-200 dark:border-pink-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-full text-pink-700 dark:text-pink-300 text-xs font-semibold hover:bg-pink-100 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back to Step 1</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSending}
                      onClick={handleSendMessage}
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-glow-ribbon flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {isSending ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>
                        {channel === 'whatsapp'
                          ? 'Send Card via WhatsApp'
                          : channel === 'sms'
                          ? 'Send Card via SMS'
                          : 'Send Card via Email'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Live Card Preview (With Prominent To & From) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full mb-3 flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-900 dark:text-pink-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Live Greeting Card Preview</span>
              </span>
              <span className="text-[11px] text-pink-500 font-medium">Included in Delivery</span>
            </div>

            {/* Live Interactive Greeting Card Component */}
            <div className="w-full flex justify-center sticky top-24">
              <CardPreview
                ref={cardRef}
                recipient={recipient}
                sender={sender}
                relationship={relationship}
                messageText={activeMessageText}
                personalNote={personalNote}
                photoUrl={photoDataUrl}
                styleId={cardStyle}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-[11px] text-pink-600/80 dark:text-pink-400">
                ✨ From and To details are automatically rendered onto the greeting card.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-pink-950 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center border border-pink-200 dark:border-pink-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/80 text-pink-600 mx-auto flex items-center justify-center mb-4 shadow-inner">
              <RibbonSVG variant="icon" size={32} />
            </div>

            <h3 className="font-serif text-2xl font-bold text-burgundy dark:text-pink-100 mb-5">
              {channel === 'email' ? 'Email sent successfully' : 'Your Message of Hope is on its Way!'}
            </h3>
            {channel !== 'email' && (
              <>
                <p className="text-xs sm:text-sm text-ink/80 dark:text-pink-200/80 mb-5 leading-relaxed">
                  Your greeting card and personal dedication for <strong className="text-pink-700 dark:text-pink-300">{recipient}</strong> have been processed for delivery.
                </p>

                {/* Quick Actions */}
                <div className="space-y-2.5 mb-6 text-left">
                  {cardImageForClipboard && (
                    <>
                      <button
                        type="button"
                        onClick={copyCardImageToClipboard}
                        className="w-full py-3 px-4 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center justify-between shadow-md transition-all hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-2">
                          {copiedCardImage ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedCardImage ? 'Card Image Copied' : 'Copy Card Image'}</span>
                        </div>
                        <span className="text-[10px] bg-pink-700/80 px-2 py-0.5 rounded-full">
                          {copiedCardImage ? 'Paste in WhatsApp' : 'Copy'}
                        </span>
                      </button>
                      {cardImageClipboardError && (
                        <p className="text-[11px] text-red-600 dark:text-red-300 px-1" role="alert">
                          {cardImageClipboardError}
                        </p>
                      )}
                    </>
                  )}

                  {generatedLinks.whatsapp && (
                    <a
                      href={generatedLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow-md transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Open in WhatsApp (Direct Chat)</span>
                      </div>
                      <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full">Launch ↗</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLinks.fullText);
                      setCopiedMessageText(true);
                      setTimeout(() => setCopiedMessageText(false), 2500);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-pink-50 dark:bg-pink-900/40 border border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200 font-semibold text-xs flex items-center justify-between hover:bg-pink-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {copiedMessageText ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-pink-600" />}
                      <span>{copiedMessageText ? 'Message Copied!' : 'Copy Formatted Message Text'}</span>
                    </div>
                    <span className="text-[10px] text-pink-500 font-normal">Copy</span>
                  </button>
                </div>
              </>
            )}

            {/* Secondary Action */}
            <div className="space-y-2 pt-2 border-t border-pink-200 dark:border-pink-800">
              <button
                type="button"
                onClick={() => {
                  setSuccessModalOpen(false);
                  setCurrentStep(1);
                  setPersonalNote('');
                  setPhotoDataUrl('');
                }}
                className="w-full py-2.5 rounded-full bg-pink-600 text-white font-bold text-xs shadow-glow-pink hover:bg-pink-700 transition-colors"
              >
                {channel === 'email' ? 'Close' : 'Send Another Message'}
              </button>

              {channel !== 'email' && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2 rounded-full text-pink-700 dark:text-pink-300 font-semibold text-xs hover:bg-pink-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? 'Website Link Copied!' : 'Share Website Link'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
