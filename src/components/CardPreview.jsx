import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Search, Stethoscope, Heart, Users } from 'lucide-react';

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

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;
const NAME_MAX_CHARS = 36;     // fits 2 lines in a row
const MESSAGE_MAX_CHARS = 150; // fits 5 lines in the right column

const clipText = (value, maximum) => {
  const text = String(value || '');
  if (text.length <= maximum) return text;
  return `${Array.from(text).slice(0, maximum - 1).join('').trimEnd()}…`;
};

const wrapSafe = {
  minWidth: 0,
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

const CardCanvas = ({
  canvasRef,
  exportId,
  recipient,
  sender,
  relationship,
  messageText,
  personalNote,
  photoUrl,
  currentStyle,
}) => {
  const rawMessage = personalNote ? `${personalNote} — ${messageText}` : messageText;
  const safeMessage = clipText(rawMessage, MESSAGE_MAX_CHARS);
  const sideItems = [
    { Icon: Search, title: 'Be Aware', sub: 'Know the signs' },
    { Icon: Stethoscope, title: 'Get Checked', sub: 'Regular screening saves' },
    { Icon: Heart, title: 'Support', sub: 'Stand with survivors' },
    { Icon: Users, title: 'Together', sub: 'We make a difference' },
  ];
  const rows = [
  { label: 'To:', value: clipText(recipient || '...', NAME_MAX_CHARS), color: '#3B1A2B' },
  { label: 'From:', value: clipText(sender || '...', NAME_MAX_CHARS), color: '#3B1A2B' },
  { label: 'In:', value: clipText(relationship || 'Friend / Loved One', NAME_MAX_CHARS), color: '#BE185D' },
];

  return (
    <div
      ref={canvasRef}
      id={exportId}
      className={`greeting-card-export bg-gradient-to-br ${currentStyle.bgClass} text-[#3B1A2B] select-none`}
      style={{
        position: 'relative',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        minWidth: CARD_WIDTH,
        maxWidth: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box',
        border: `8px solid ${currentStyle.borderColor}`,
        borderRadius: 42,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 190,
          top: 330,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,114,168,0.22) 0%, rgba(244,114,168,0) 70%)',
        }}
      />

      <div style={{ position: 'absolute', left: 70, top: 70, width: 940, height: 230, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 650 }}>
          <h2 className="font-script" style={{ fontSize: 100, lineHeight: 1.05, color: '#E0157A', margin: 0 }}>
            Breast Cancer
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <span className="font-sans" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '0.22em', color: '#7A0B3F', whiteSpace: 'nowrap' }}>
              AWARENESS MONTH
            </span>
            <span style={{ fontSize: 34, color: '#E0157A' }}>♥</span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 500, color: '#9D174D', margin: '16px 0 0', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            Early Detection | Timely Treatment | Brighter Tomorrows
          </p>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 10, width: 320, textAlign: 'right' }}>
          <p className="font-script" style={{ fontSize: 50, lineHeight: 1.1, color: '#E0157A', margin: 0 }}>
            Stronger Together
          </p>
          <p className="font-serif" style={{ fontSize: 24, fontStyle: 'italic', color: '#7A0B3F', margin: '6px 0 0' }}>
            for a Healthier Tomorrow
          </p>
          <span style={{ fontSize: 28, color: '#E0157A' }}>♡</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 300,
          width: 940,
          height: 620,
          display: 'grid',
          gridTemplateColumns: '290px 350px 300px',
          alignItems: 'center',
        }}
      >
        <div style={{ ...wrapSafe, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {sideItems.map(({ Icon, title, sub }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: '50%', background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E0157A' }}>
                <Icon size={30} />
              </div>
              <div style={{ ...wrapSafe, lineHeight: 1.2 }}>
                <span style={{ display: 'block', fontSize: 30, fontWeight: 700, color: '#7A0B3F' }}>{title}</span>
                <span style={{ display: 'block', fontSize: 22, color: 'rgba(157,23,77,0.85)' }}>{sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', width: 350, height: 540, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 6, left: 4, fontSize: 40, zIndex: 2 }}>🌸</div>
          <div style={{ position: 'absolute', bottom: 6, right: 4, fontSize: 40, zIndex: 2 }}>🌺</div>
          <div style={{ boxSizing: 'border-box', width: 320, height: 500, background: '#fff', padding: '16px 16px 0', borderRadius: 14, border: '2px solid #FBCFE8', boxShadow: '0 10px 30px rgba(224,21,122,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 284, height: 400, flexShrink: 0, borderRadius: 8, overflow: 'hidden', background: 'rgba(252,231,243,0.8)', border: '1px solid #FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {photoUrl ? (
                <img src={photoUrl} alt="Recipient" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#F472B6' }}>
                  <div style={{ width: 84, height: 84, margin: '0 auto 12px', borderRadius: '50%', background: 'rgba(251,207,232,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={42} color="#EC4899" />
                  </div>
                  <span style={{ fontSize: 26, fontWeight: 600, color: '#DB2777' }}>You Are Loved</span>
                </div>
              )}
            </div>
            <p
              className="font-serif"
              style={{
                ...wrapSafe,
                width: 284,
                margin: '14px 0 0',
                fontSize: 28,
                fontStyle: 'italic',
                textAlign: 'center',
                lineHeight: 1.3,
                color: 'rgba(157,23,77,0.85)',
              }}
            >
              {clipText(relationship || 'Together in Hope', 22)}
            </p>
          </div>
        </div>

        <div style={{ width: 300, height: 540, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 250, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/assets/images/pink-ribbon.png" alt="Authentic Pink Awareness Ribbon" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
          <span className="font-script" style={{ fontSize: 44, fontWeight: 700, color: '#E0157A', marginTop: 20, whiteSpace: 'nowrap' }}>
            You Are Strong
          </span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 70, top: 930, width: 940, height: 2, background: 'rgba(249,168,212,0.5)' }} />

      {/* ================= FOOTER CONTENT (950px - 1270px): two equal columns ================= */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 950,
          width: 940,
          height: 320,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: 40,
        }}
      >
        {/* Left column: To / From / In */}
        <div style={{ ...wrapSafe, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                height: 96,
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.85)',
                border: '2px solid #F9A8D4',
                borderRadius: 18,
                minWidth: 0,
              }}
            >
              <span style={{ width: 92, flexShrink: 0, fontSize: 28, lineHeight: 1.3, fontWeight: 700, color: '#7A0B3F' }}>
                {r.label}
              </span>
              <span
                style={{
                  ...wrapSafe,
                  flex: 1,
                  fontSize: 28,
                  lineHeight: 1.25,
                  fontWeight: 500,
                  color: r.color,
                }}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>

        {/* Right column: quote + message */}
        <div style={{ ...wrapSafe, textAlign: 'right' }}>
          <p
            className="font-serif"
            style={{ ...wrapSafe, margin: 0, fontSize: 25, lineHeight: '32px', fontStyle: 'italic', fontWeight: 600, color: '#7A0B3F' }}
          >
            "Your strength inspires, your courage gives hope, your journey matters."
          </p>
          <p
            style={{
              ...wrapSafe,
              margin: '14px 0 0',
              fontSize: 24,
              lineHeight: '32px',
              color: 'rgba(59,26,43,0.92)',
            }}
          >
            {safeMessage}
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 70, top: 1290, width: 940, height: 40, lineHeight: '40px', textAlign: 'right', fontSize: 22, letterSpacing: '0.06em', color: 'rgba(157,23,77,0.7)', whiteSpace: 'nowrap' }}>
        SGPGI Breast Health Program • Lucknow
      </div>
    </div>
  );
};

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
  const currentStyle = CARD_STYLES.find((style) => style.id === styleId) || CARD_STYLES[0];
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return undefined;
    const updateScale = () => setScale(element.clientWidth / CARD_WIDTH);
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sharedProps = { recipient, sender, relationship, messageText, personalNote, photoUrl, currentStyle };

  return (
    <>
      <div ref={wrapRef} className={`relative w-full max-w-[680px] overflow-hidden shadow-card-pink ${className}`} style={{ height: CARD_HEIGHT * scale }}>
        <div style={{ width: CARD_WIDTH, height: CARD_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <CardCanvas {...sharedProps} />
        </div>
      </div>

      <div aria-hidden="true" style={{ position: 'fixed', left: -10000, top: 0, width: CARD_WIDTH, height: CARD_HEIGHT, pointerEvents: 'none' }}>
        <CardCanvas canvasRef={ref} exportId="greeting-card-export" {...sharedProps} />
      </div>
    </>
  );
});

CardPreview.displayName = 'CardPreview';
