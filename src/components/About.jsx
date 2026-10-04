import React from 'react';
import statsConfig from '../data/stats.json';
import { RibbonSVG } from './RibbonSVG';
import { Building2, Phone, Globe, Shield, HeartPulse, Sparkles, Award, Users, CheckCircle2, ChevronRight } from 'lucide-react';

export const About = () => {
  const timelineMilestones = [
    {
      year: 'Vision & Inception',
      title: 'Department Foundation',
      desc: 'Established the dedicated Department of Endocrine & Breast Surgery at SGPGIMS, Lucknow, focusing on holistic, evidence-based breast healthcare.',
    },
    {
      year: 'Community Reach',
      title: 'Statewide Screening Camps',
      desc: 'Launched regular clinical breast screening and awareness initiatives across Uttar Pradesh and surrounding regions.',
    },
    {
      year: 'Advanced Techniques',
      title: 'Oncoplastic & Reconstructive Care',
      desc: 'Pioneered breast-conserving oncoplastic procedures, balancing oncological safety with aesthetic well-being.',
    },
    {
      year: 'Digital Outreach',
      title: 'Pink Hope Public Platform',
      desc: 'Empowering millions with native multilingual awareness tools, BSE guides, and patient support networks.',
    },
  ];

  return (
    <section
      id="about"
      className="py-16 md:py-24 bg-gradient-to-b from-pink-100/30 via-cream to-pink-50/60 dark:from-pink-950 dark:via-pink-900/20 dark:to-pink-950 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-900/60 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5 text-pink-600" />
            <span>PUBLIC HEALTH INITIATIVE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy dark:text-pink-100 mb-4">
            About the Initiative
          </h2>
          <p className="text-sm sm:text-base text-ink/80 dark:text-pink-200/80 leading-relaxed font-light">
            Issued in public interest by the{' '}
            <strong className="font-semibold text-pink-700 dark:text-pink-300">
              Department of Endocrine & Breast Surgery
            </strong>
            , Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS), Lucknow, India.
          </p>
        </div>

        {/* Institution Highlight Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-pink-200 dark:border-pink-800 shadow-card-pink mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Logos & Badges */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-pink-50/80 dark:bg-pink-900/40 rounded-2xl border border-pink-200 dark:border-pink-700 text-center">
              
              {/* SGPGI Breast Health Program Logo */}
              <div className="relative mb-4 group">
                <img
                  src="/assets/logos/sgpgi-breast-health-logo.jpg"
                  alt="SGPGI Breast Health Program Logo - Saving Lives & Breasts"
                  className="w-36 h-36 object-contain rounded-full border-4 border-white dark:border-pink-700 shadow-glow-pink transform group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-2 -right-2 bg-pink-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                  SGPGI
                </div>
              </div>

              <h3 className="font-serif font-bold text-base text-burgundy dark:text-pink-100 mb-1">
                SGPGIMS Lucknow
              </h3>
              <p className="font-serif italic text-xs text-pink-700 dark:text-pink-300 mb-2">
                "आत्मना सर्गो जितः"
              </p>
              <p className="text-[11px] text-ink/70 dark:text-pink-300/80 leading-tight">
                Department of Endocrine & Breast Surgery
              </p>

              {/* Direct Quick Contact Links */}
              <div className="mt-4 pt-4 border-t border-pink-200 dark:border-pink-700 w-full flex flex-col gap-2">
                <a
                  href="tel:05222496200"
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-pink-700 dark:text-pink-300 hover:text-pink-900"
                >
                  <Phone className="w-3.5 h-3.5 text-pink-600" />
                  <span>Helpline: 0522-2496200</span>
                </a>
                <a
                  href="https://www.sgpgibreasthealth.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-pink-600 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>www.sgpgibreasthealth.org.in</span>
                </a>
              </div>
            </div>

            {/* Mission, Vision & Department Scope (Structured copy with TODO placeholders) */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 dark:text-pink-400">
                  OUR MISSION & CLINICAL DEDICATION
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100 mt-1">
                  Pioneering Breast Health, Screening & Oncoplastic Care
                </h3>
              </div>

              {/* TODO: Client Official Mission Statement Placeholder */}
              <p className="text-xs sm:text-sm text-ink/80 dark:text-pink-200/90 leading-relaxed">
                The SGPGI Breast Health Program is committed to demystifying breast diseases, fostering early diagnosis through regular clinical screening and mammography, and delivering comprehensive, individualized surgical treatments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/70 dark:bg-pink-950/50 border border-pink-200/80 dark:border-pink-800">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/60 text-pink-600 flex items-center justify-center mb-2">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-burgundy dark:text-pink-100 mb-1">
                    Screening Camps
                  </h4>
                  <p className="text-[11px] text-ink/70 dark:text-pink-300/80 leading-snug">
                    Educating communities on monthly self-examination and providing clinical evaluations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/70 dark:bg-pink-950/50 border border-pink-200/80 dark:border-pink-800">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/60 text-pink-600 flex items-center justify-center mb-2">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-burgundy dark:text-pink-100 mb-1">
                    Early Detection
                  </h4>
                  <p className="text-[11px] text-ink/70 dark:text-pink-300/80 leading-snug">
                    State-of-the-art diagnostic imaging, mammography guidance, and biopsy protocols.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/70 dark:bg-pink-950/50 border border-pink-200/80 dark:border-pink-800">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/60 text-pink-600 flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-burgundy dark:text-pink-100 mb-1">
                    Multidisciplinary Care
                  </h4>
                  <p className="text-[11px] text-ink/70 dark:text-pink-300/80 leading-snug">
                    Advanced oncoplastic surgery, chemotherapy, radiation, and hormonal therapy coordination.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Animated Statistics Counters (Rendered from data/stats.json) */}
        {statsConfig.showCounters && statsConfig.stats?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {statsConfig.stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 text-center border border-pink-200 dark:border-pink-800 shadow-sm hover:scale-105 transition-transform"
              >
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-pink-600 dark:text-pink-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-burgundy dark:text-pink-100 mb-0.5">
                  {stat.label}
                </div>
                <div className="text-[10px] text-pink-700/80 dark:text-pink-300/70">
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Programme Timeline */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy dark:text-pink-100">
              Milestones in Breast Healthcare Excellence
            </h3>
            <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">
              Committed to saving lives, breasts, and quality of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {timelineMilestones.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 shadow-sm relative overflow-hidden"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-pink-100 dark:bg-pink-900 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                  {m.year}
                </span>
                <h4 className="font-serif font-bold text-sm text-burgundy dark:text-pink-100 mb-1.5">
                  {m.title}
                </h4>
                <p className="text-xs text-ink/75 dark:text-pink-200/80 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* "You Are Not Alone" Butterfly Ribbon Banner */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 bg-gradient-to-r from-pink-700 via-pink-600 to-pink-800 text-white shadow-glow-ribbon">
          {/* Subtle floral background pattern */}
          <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
            <RibbonSVG variant="heart" size={240} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-pink-200 mb-2 block">
              A MESSAGE OF COMPASSION
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
              "You are not alone, we are here for you."
            </h3>
            <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed mb-6 font-light">
              From the initial self-exam to diagnostic imaging, precision surgery, and long-term survivorship — every patient and family is surrounded by clinical excellence and warm human empathy.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#send-message"
                className="px-6 py-2.5 rounded-full bg-white text-pink-700 hover:bg-pink-50 text-xs font-bold shadow-md transition-transform hover:scale-105"
              >
                Send Support Card
              </a>
              <a
                href="#awareness"
                className="px-6 py-2.5 rounded-full bg-pink-800/80 hover:bg-pink-900 text-white text-xs font-semibold border border-pink-400/40 transition-colors"
              >
                Learn Self-Exam Steps
              </a>
            </div>
          </div>
        </div>

        {/* Institutional Affiliates & Partner Strip (Placeholders) */}
        <div className="mt-14 text-center">
          <p className="text-xs uppercase tracking-widest text-pink-600/80 font-bold mb-4">
            Institutional Affiliations & Scientific Outreach
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
            <div className="px-4 py-2 rounded-xl bg-white/60 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-xs font-semibold text-pink-900 dark:text-pink-200 notranslate">
              SGPGIMS Lucknow
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/60 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-xs font-semibold text-pink-900 dark:text-pink-200 notranslate">
              Dept. of Endocrine & Breast Surgery
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/60 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-xs font-semibold text-pink-900 dark:text-pink-200">
              National Cancer Awareness Initiative
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
