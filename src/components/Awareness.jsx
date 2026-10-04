import React, { useState } from 'react';
import awarenessData from '../data/awareness.json';
import { RibbonSVG } from './RibbonSVG';
import {
  Activity,
  Maximize2,
  Layers,
  AlertCircle,
  HeartCrack,
  Droplets,
  ArrowDownRight,
  ShieldAlert,
  CircleDot,
  CalendarCheck,
  HeartPulse,
  Salad,
  Footprints,
  Ban,
  Baby,
  Eye,
  Hand,
  Droplet,
  Bed,
  Scissors,
  Pill,
  Zap,
  ShieldCheck,
  Sparkle,
  HelpCircle,
  CheckCircle,
  XCircle,
  Download,
  Share2,
  ChevronRight,
  Info,
  Calendar,
} from 'lucide-react';

const SYMPTOM_ICONS = {
  Activity,
  Maximize2,
  Layers,
  AlertCircle,
  HeartCrack,
  Droplets,
  ArrowDownRight,
  ShieldAlert,
  CircleDot,
};

const PREVENTION_ICONS = {
  CalendarCheck,
  HeartPulse,
  Salad,
  Footprints,
  Ban,
  Baby,
};

const STEP_ICONS = {
  Eye,
  Hand,
  Droplet,
  Bed,
};

const TREATMENT_ICONS = {
  Scissors,
  Pill,
  Zap,
  ShieldCheck,
  Sparkle,
};

export const Awareness = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [flippedSymptoms, setFlippedSymptoms] = useState({});
  const [flippedMyths, setFlippedMyths] = useState({});

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Toggle Symptom Flip
  const toggleSymptomFlip = (id) => {
    setFlippedSymptoms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Myth Flip
  const toggleMythFlip = (idx) => {
    setFlippedMyths((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Generate & Download .ics Monthly Reminder Calendar File
  const downloadIcsReminder = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SGPGI Breast Health Program//Monthly BSE Reminder//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:🌸 Monthly Breast Self-Examination (BSE)',
      'DESCRIPTION:Take 5 minutes for your monthly breast self-examination. Check in the mirror, shower, and lying down. Early detection saves lives!\\n\\nSGPGI Breast Health Program: www.sgpgibreasthealth.org.in',
      'RRULE:FREQ=MONTHLY;BYMONTHDAY=7',
      'DTSTART:20261007T090000Z',
      'DTEND:20261007T091500Z',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Time for your 5-minute Breast Self-Exam',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Monthly-Breast-Self-Exam-Reminder.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Quiz Answer Selection
  const handleSelectQuizOption = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    awarenessData.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score += 1;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleQuizReset = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // Web Share Awareness
  const handleShareAwareness = async () => {
    const text =
      '🌸 October is Breast Cancer Awareness Month! Learn the symptoms, risk factors, and step-by-step self-examination guide issued by SGPGIMS Lucknow.';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Breast Cancer Awareness - Early Detection Saves Lives',
          text,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Awareness link copied to clipboard! Share it with family and friends.');
    }
  };

  return (
    <section
      id="awareness"
      className="py-16 md:py-24 bg-gradient-to-b from-pink-50/60 via-cream to-pink-100/30 dark:from-pink-950 dark:via-pink-900/20 dark:to-pink-950 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-900/60 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-semibold mb-3">
            <HeartPulse className="w-3.5 h-3.5 text-pink-600" />
            <span>EDUCATIONAL CLINICAL GUIDE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy dark:text-pink-100 mb-4">
            Why Awareness Matters
          </h2>
          <p className="text-sm sm:text-base text-ink/80 dark:text-pink-200/80 leading-relaxed font-light">
            Based on the clinical guidance from the Department of Endocrine & Breast Surgery, SGPGIMS Lucknow. Early detection transforms breast cancer outcomes.
          </p>
        </div>

        {/* --- MODULE A: WHAT IS BREAST CANCER? --- */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-pink-200 dark:border-pink-800 shadow-card-pink mb-16">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 block mb-1">
              {awarenessData.intro.subtitle}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100 mb-4">
              {awarenessData.intro.title}
            </h3>
            <p className="text-sm sm:text-base text-ink/80 dark:text-pink-200/90 leading-relaxed font-light mb-4">
              {awarenessData.intro.description}
            </p>
            <div className="p-3.5 rounded-xl bg-pink-100/60 dark:bg-pink-900/40 border-l-4 border-pink-600 text-xs text-pink-900 dark:text-pink-200 font-medium">
              💡 <strong>Key Takeaway:</strong> When detected at an early localized stage, breast cancer is highly curable with modern oncoplastic and medical treatments.
            </div>
          </div>
        </div>

        {/* --- MODULE B: SYMPTOMS (FLIP CARDS) --- */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
              SIGNS & SYMPTOMS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100 mt-1 mb-2">
              Recognize the Physical Changes
            </h3>
            <p className="text-xs sm:text-sm text-ink/75 dark:text-pink-300/80">
              Tap or hover over any card to understand the clinical signs to monitor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awarenessData.symptoms.map((symptom) => {
              const IconComp = SYMPTOM_ICONS[symptom.icon] || Activity;
              const isFlipped = !!flippedSymptoms[symptom.id];

              return (
                <div
                  key={symptom.id}
                  onClick={() => toggleSymptomFlip(symptom.id)}
                  className="perspective-1000 h-44 cursor-pointer"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d rounded-2xl ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front Face */}
                    <div className="absolute inset-0 backface-hidden glass-card rounded-2xl p-5 border border-pink-200 dark:border-pink-800 shadow-sm flex flex-col justify-between hover:border-pink-400">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/70 text-pink-600 dark:text-pink-300 flex items-center justify-center">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-pink-500 bg-pink-50 dark:bg-pink-900/40 px-2 py-0.5 rounded-full">
                          Tap to Flip ↻
                        </span>
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-burgundy dark:text-pink-100 mb-1">
                          {symptom.title}
                        </h4>
                        <p className="text-xs text-pink-700 dark:text-pink-300">
                          {symptom.short}
                        </p>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-pink-600 to-pink-800 text-white rounded-2xl p-5 flex flex-col justify-between shadow-glow-pink">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-pink-200 block mb-1">
                          CLINICAL DETAIL
                        </span>
                        <h4 className="font-serif font-bold text-sm mb-2">{symptom.title}</h4>
                        <p className="text-xs leading-relaxed text-pink-100 font-light">
                          {symptom.desc}
                        </p>
                      </div>
                      <span className="text-[10px] text-pink-200 text-right">Tap to return</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100/70 dark:bg-pink-900/50 border border-pink-300 dark:border-pink-700 text-xs font-semibold text-burgundy dark:text-pink-200">
              <Info className="w-4 h-4 text-pink-600" />
              <span>
                <strong>Important Note:</strong> Not every lump or pain is cancer, but see a doctor promptly for proper evaluation.
              </span>
            </div>
          </div>
        </div>

        {/* --- MODULE C & D: RISK FACTORS & PREVENTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Risk Factors Grouped */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-pink-200 dark:border-pink-800 shadow-card-pink">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900 text-pink-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy dark:text-pink-100">
                Known Risk Factors
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-2">
                  1. Lifestyle Factors
                </h4>
                <div className="space-y-2">
                  {awarenessData.riskFactors.lifestyle.map((rf, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/60 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60"
                    >
                      <strong className="text-xs text-burgundy dark:text-pink-100 block">{rf.title}</strong>
                      <span className="text-[11px] text-ink/70 dark:text-pink-300/80">{rf.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-2">
                  2. Personal & Family History
                </h4>
                <div className="space-y-2">
                  {awarenessData.riskFactors.personal.map((rf, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/60 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60"
                    >
                      <strong className="text-xs text-burgundy dark:text-pink-100 block">{rf.title}</strong>
                      <span className="text-[11px] text-ink/70 dark:text-pink-300/80">{rf.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-2">
                  3. Hormonal Exposures
                </h4>
                <div className="space-y-2">
                  {awarenessData.riskFactors.hormonal.map((rf, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/60 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60"
                    >
                      <strong className="text-xs text-burgundy dark:text-pink-100 block">{rf.title}</strong>
                      <span className="text-[11px] text-ink/70 dark:text-pink-300/80">{rf.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Prevention Pillars */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-pink-200 dark:border-pink-800 shadow-card-pink flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900 text-pink-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy dark:text-pink-100">
                  Prevention & Screening Steps
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {awarenessData.prevention.map((prevItem, idx) => {
                  const IconC = PREVENTION_ICONS[prevItem.icon] || HeartPulse;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/70 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800/60"
                    >
                      <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/70 text-pink-600 flex items-center justify-center mb-2">
                        <IconC className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-burgundy dark:text-pink-100 mb-1">
                        {prevItem.title}
                      </h4>
                      <p className="text-[11px] text-ink/70 dark:text-pink-300/80 leading-snug">
                        {prevItem.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timely Check Reminder */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-pink-200 block mb-1">
                GOLDEN RULE
              </span>
              <p className="text-xs leading-relaxed">
                Yearly mammography for women over 40 and monthly self-exam for women over 20 create a powerful defense network.
              </p>
            </div>
          </div>

        </div>

        {/* --- MODULE E: BREAST SELF-EXAMINATION (BSE) 4-STEP STEPPER --- */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-pink-200 dark:border-pink-800 shadow-card-pink mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-pink-200 dark:border-pink-800 pb-6 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
                STEP-BY-STEP EMPOWERMENT
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100 mt-1">
                Breast Self-Examination (BSE) Guide
              </h3>
              <p className="text-xs text-ink/75 dark:text-pink-300 mt-1">
                Best performed 5–7 days after menstrual period ends; post-menopause, choose the same date every month.
              </p>
            </div>

            {/* Monthly Calendar Reminder Button */}
            <button
              onClick={downloadIcsReminder}
              className="px-4 py-2.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-glow-pink flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Remind Me Monthly (.ics)</span>
            </button>
          </div>

          {/* Stepper Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {awarenessData.selfExam.map((stepItem, idx) => {
              const StepIcon = STEP_ICONS[stepItem.icon] || Hand;
              const isActive = activeStep === idx;
              return (
                <button
                  key={stepItem.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    isActive
                      ? 'border-pink-600 bg-pink-100/90 dark:bg-pink-900/60 shadow-sm scale-105'
                      : 'border-pink-200 dark:border-pink-800 bg-white/60 dark:bg-pink-950/40 hover:border-pink-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isActive ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-600'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-pink-500 uppercase">
                      Step 0{stepItem.step}
                    </span>
                    <span className="block text-xs font-bold text-burgundy dark:text-pink-100 truncate">
                      {stepItem.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase */}
          <div className="p-6 sm:p-8 rounded-2xl bg-pink-50/70 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-pink-600 text-white font-bold text-sm flex items-center justify-center">
                {awarenessData.selfExam[activeStep].step}
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-burgundy dark:text-pink-100">
                {awarenessData.selfExam[activeStep].title}
              </h4>
            </div>

            <ul className="space-y-3 mb-6">
              {awarenessData.selfExam[activeStep].instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-ink/85 dark:text-pink-100">
                  <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center pt-4 border-t border-pink-200 dark:border-pink-800">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-pink-700 disabled:opacity-30"
              >
                Previous Step
              </button>

              <button
                disabled={activeStep === awarenessData.selfExam.length - 1}
                onClick={() =>
                  setActiveStep((prev) => Math.min(awarenessData.selfExam.length - 1, prev + 1))
                }
                className="px-5 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold shadow hover:bg-pink-700 disabled:opacity-30"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>

        {/* --- MODULE F: TREATMENTS OVERVIEW --- */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
              MODERN ONCOLOGICAL MODALITIES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100 mt-1 mb-2">
              Treatments Overview
            </h3>
            <p className="text-xs sm:text-sm text-ink/75 dark:text-pink-300">
              Early detection makes treatment easier, gentler, and far more effective.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {awarenessData.treatments.map((treatment, idx) => {
              const IconT = TREATMENT_ICONS[treatment.icon] || Scissors;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-5 border border-pink-200 dark:border-pink-800 shadow-sm flex flex-col justify-between hover:scale-105 transition-transform"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900 text-pink-600 flex items-center justify-center mb-3">
                      <IconT className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-pink-500 block mb-1">
                      {treatment.tag}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-burgundy dark:text-pink-100 mb-2">
                      {treatment.title}
                    </h4>
                    <p className="text-[11px] text-ink/70 dark:text-pink-300 leading-relaxed">
                      {treatment.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- MODULE G: "IF YOU FIND SOMETHING UNUSUAL" ACTION FLOW --- */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-pink-200 dark:border-pink-800 shadow-card-pink mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
              CLINICAL ACTION PLAN
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100 mt-1">
              If You Notice Something Unusual
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {awarenessData.actionSteps.map((action, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 shadow-sm relative text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-pink-600 text-white font-serif font-bold text-lg flex items-center justify-center shadow-md mb-3">
                  0{action.step}
                </div>
                <h4 className="font-serif font-bold text-base text-burgundy dark:text-pink-100 mb-2">
                  {action.title}
                </h4>
                <p className="text-xs text-ink/75 dark:text-pink-300 leading-relaxed">
                  {action.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- MODULE H: MYTHS VS FACTS --- */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
              EVIDENCE-BASED CLARITY
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100 mt-1 mb-2">
              Myths vs Facts
            </h3>
            <p className="text-xs text-pink-700 dark:text-pink-300">
              Tap any card to bust the misconception with scientific facts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awarenessData.myths.map((item, idx) => {
              const isFlipped = !!flippedMyths[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleMythFlip(idx)}
                  className="perspective-1000 h-48 cursor-pointer"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d rounded-2xl ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front Face: The Myth */}
                    <div className="absolute inset-0 backface-hidden glass-card rounded-2xl p-5 border border-pink-200 dark:border-pink-800 shadow-sm flex flex-col justify-between hover:border-pink-400">
                      <div>
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <XCircle className="w-4 h-4" />
                          <span>Myth #{idx + 1}</span>
                        </div>
                        <p className="font-serif text-sm font-semibold text-burgundy dark:text-pink-100 leading-snug italic">
                          "{item.myth}"
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-pink-600 bg-pink-100/70 dark:bg-pink-900/50 px-2.5 py-1 rounded-full self-start">
                        Tap to Reveal Fact ↻
                      </span>
                    </div>

                    {/* Back Face: The Fact */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-pink-700 to-pink-900 text-white rounded-2xl p-5 flex flex-col justify-between shadow-glow-pink">
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Scientific Fact</span>
                        </div>
                        <p className="text-xs leading-relaxed text-pink-100">
                          {item.fact}
                        </p>
                      </div>
                      <span className="text-[10px] text-pink-300 text-right">Tap to return</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- MODULE I: "KNOW YOUR BREAST HEALTH" 5-QUESTION QUIZ --- */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-pink-200 dark:border-pink-800 shadow-card-pink mb-16">
          <div className="flex items-center justify-between border-b border-pink-200 dark:border-pink-800 pb-5 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
                INTERACTIVE CHECK
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100 mt-1">
                Know Your Breast Health Quiz
              </h3>
            </div>
            <HelpCircle className="w-6 h-6 text-pink-600" />
          </div>

          {!quizSubmitted ? (
            <div className="space-y-6">
              {awarenessData.quiz.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-2xl bg-white/60 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60">
                  <p className="font-serif font-bold text-sm text-burgundy dark:text-pink-100 mb-3">
                    Q{qIdx + 1}: {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                          className={`p-2.5 rounded-xl text-xs text-left transition-all border ${
                            isSelected
                              ? 'border-pink-600 bg-pink-100/90 dark:bg-pink-900/80 font-bold text-pink-950 dark:text-pink-100'
                              : 'border-pink-200 dark:border-pink-800 bg-white dark:bg-pink-900/20 text-ink dark:text-pink-200 hover:border-pink-400'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={Object.keys(quizAnswers).length < awarenessData.quiz.length}
                  onClick={handleQuizSubmit}
                  className="px-8 py-3 rounded-full bg-pink-600 text-white font-bold text-xs shadow-glow-pink hover:bg-pink-700 transition-all disabled:opacity-40"
                >
                  Submit & Check Knowledge
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-pink-50 dark:bg-pink-900/40 rounded-2xl border border-pink-200 dark:border-pink-700 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-pink-600 text-white font-serif font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-glow-pink">
                {quizScore}/{awarenessData.quiz.length}
              </div>
              <h4 className="font-serif text-2xl font-bold text-burgundy dark:text-pink-100 mb-2">
                {quizScore >= 4 ? '🌸 Outstanding Knowledge Champion!' : '💖 Wonderful Effort! Keep Spreading Hope!'}
              </h4>
              <p className="text-xs text-ink/80 dark:text-pink-200 max-w-md mx-auto mb-6">
                Awareness is the first step towards early detection and saving precious lives.
              </p>
              <button
                type="button"
                onClick={handleQuizReset}
                className="px-6 py-2.5 rounded-full bg-pink-600 text-white text-xs font-bold shadow"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>

        {/* --- SPREAD AWARENESS BANNER & MEDICAL DISCLAIMER --- */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-glow-ribbon flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
              Spread Awareness to Family & Friends
            </h3>
            <p className="text-xs sm:text-sm text-pink-100 leading-relaxed font-light">
              "Early detection can save lives. Let us stand united in spreading knowledge."
            </p>
          </div>

          <button
            type="button"
            onClick={handleShareAwareness}
            className="px-6 py-3 rounded-full bg-white text-pink-700 hover:bg-pink-50 text-xs font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Awareness Platform</span>
          </button>
        </div>

        {/* Medical Disclaimer */}
        <div className="text-center max-w-3xl mx-auto text-[11px] text-pink-700/80 dark:text-pink-400/80 border-t border-pink-200 dark:border-pink-800 pt-6">
          <p>
            <strong>Medical Disclaimer:</strong> This website is for educational and public health awareness only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>

      </div>
    </section>
  );
};
