# 🌸 Breast Cancer Awareness Month (October) — Pink Hope Platform

> **"Awareness brings hope · Detection saves lives · Support gives strength · Together we make a difference"**

A complete, production-ready, accessible, and responsive single-page web platform created for **Breast Cancer Awareness Month (October)** in public interest with the **Department of Endocrine & Breast Surgery, Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS), Lucknow, India**.

The platform empowers visitors to send personalized awareness & support greeting cards with voice notes, photos, and native multilingual messages, while educating the public with interactive breast self-examination (BSE) guides, symptom flip cards, and evidence-based clinical knowledge.

---

## ✨ Key Features & Highlights

### 1. 🎀 Signature Satin Pink Ribbon System
- **Hero Satin Ribbon**: Custom SVG with dynamic stroke drawing animation on load (`animate-draw-ribbon`), silk sheen highlight, breathing floating physics, and interactive pink petal/confetti burst on click.
- **Scroll-Linked Progressive Ribbon**: An SVG path running down the page that dynamically draws itself based on user scroll position, weaving between sections and culminating in a ribbon heart at the footer.
- **Scroll Progress Indicator**: Fixed bottom-right ribbon icon filling with pink vertically from bottom to top as you scroll, with a one-click scroll-to-top feature.
- **Desktop Cursor Trail**: Lightweight, throttled rose petal/ribbon sparkle trail following desktop mouse movements (disabled on touch devices).
- **Preloader & Dividers**: Smooth ribbon-drawing preloader on first page load, silk-ribbon SVG wave section dividers, ribbon favicon, and ribbon badges throughout.

### 2. 💌 Heartfelt Support Message Wizard (3-Step Generator)
- **Step 1: Choose Message**:
  - 5 Categorized tabs: *Awareness & Early Detection*, *Encouragement & Courage*, *Support & Love*, *Survivor Celebration*, *Caregiver & Family*.
  - 40+ native pre-written messages authored in **English**, **Hindi (हिन्दी)**, and **Tamil (தமிழ்)** (not machine-translated).
  - Live character counter (300 limit) + emoji picker for custom personal notes.
  - Gentle early detection awareness nudge checkbox.
- **Step 2: Personalise**:
  - Dedicated recipient, sender, and relationship selectors (*Mother, Sister, Daughter, Wife, Friend, Colleague, Survivor Warrior, etc.*).
  - **Photo Attachment**: Drag-and-drop uploader with client-side canvas compression/cropping.
  - **Voice Note Recording**: Browser `MediaRecorder` API with timer, animated audio waveform, pause/resume, playback, and file upload fallback.
  - **4 Card Themes**: *Classic Satin Pink*, *Sakura Watercolor*, *Golden Hope*, *Lavender Rose*.
- **Step 3: Multi-Channel Delivery & High-Res PNG Export**:
  - Live greeting card rendered in pure DOM matching the authentic reference layout.
  - One-click high-resolution PNG card download via `html2canvas`.
  - **Multi-Channel Dispatch**:
    - **WhatsApp**: Direct link pre-filled with formatted message (`https://wa.me/...`).
    - **SMS**: Pre-filled SMS link (`sms:...`).
    - **Email**: Pre-filled Mail client (`mailto:...`).
    - **Web Share API**: Directly shares image files and voice notes to mobile apps on supported devices.
  - **Layer A (Client-Side)**: 100% functional with zero backend requirement.
  - **Layer B (Backend API)**: Optional Node/Express backend with Nodemailer and Twilio adapters.
  - Privacy commitment with consent verification.

### 3. 🏥 About the Initiative & SGPGIMS Department
- Details for the **Department of Endocrine & Breast Surgery, SGPGIMS Lucknow, India**.
- SGPGI Breast Health Program official logo (`Saving Lives & Breasts`) and motto *"आत्मना सर्गो जितः"*.
- Verified configurable statistics counters (`src/data/stats.json`).
- Timeline of milestones in screening, breast conservation, and oncoplastic surgery.
- Helpline link `tel:05222496200` and official website `www.sgpgibreasthealth.org.in`.

### 4. 🩺 Educational & Brochure-Based Awareness Modules
- **Interactive Symptom 3D Flip Cards**: 9 clinical symptoms with icon representations and doctor recommendations.
- **Grouped Risk Factors**: Lifestyle, Personal & Family history, and Hormonal exposures.
- **Prevention Guidelines**: Yearly mammography for women > 40, monthly self-exam for women > 20, balanced diet, 30 min daily activity.
- **Breast Self-Examination (BSE) 4-Step Stepper**:
  - Step 1: *In Front of the Mirror*
  - Step 2: *With Your Hands (Standing)*
  - Step 3: *In the Shower*
  - Step 4: *Lying Down in Bed*
  - **"Remind Me Monthly" Calendar Button**: Generates and downloads a `.ics` recurring monthly calendar event.
- **Treatments Overview**: Oncoplastic Surgery, Chemotherapy, Radiation, Hormonal Therapy, Immunotherapy.
- **Action Plan**: 3-step guide if an unusual change is noticed (*Don't Panic → Consult Specialist → Diagnostic Tests*).
- **Myths vs Facts 3D Flip Cards**: 6 evidence-based misconceptions debunked with medical facts.
- **"Know Your Breast Health" Quiz**: 5 interactive questions with instant scoring and encouraging feedback.
- **Web Share Awareness** button & clear Medical Disclaimer.

### 5. 🌐 Multilingual & Dark-Rose Theme
- Custom pink language switcher (EN | हिन्दी | தமிழ்) synchronized with Google Website Translator.
- Automatically sets `googtrans` cookie and suppresses Google's default top banner to prevent layout shifts.
- Switches pre-written cards to native Hindi / Tamil text.
- Dark-Rose night mode toggle with persistent state.

---

## 🎨 Design System & Palette

| Token | Hex Code | Description |
|---|---|---|
| `--pink-50` | `#FFF1F6` | Light background blush |
| `--pink-100` | `#FFE0EC` | Soft card background |
| `--pink-200` | `#FFC2D9` | Border & subtle accents |
| `--pink-400` | `#F472A8` | Highlights & badges |
| `--pink-500` | `#EC4899` | Primary pink |
| `--pink-600` | `#E0157A` | **Signature Ribbon Pink** |
| `--pink-800` | `#9D174D` | Deep rose accents |
| `--burgundy` | `#7A0B3F` | Headings & high-contrast text |
| `--ink` | `#3B1A2B` | Accessible body text |
| `--cream` | `#FFF8FB` | Page base background |

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized static build will be generated in the `dist/` directory.

### 4. Run Optional Backend Server (Layer B)
```bash
cp .env.example .env
npm run server
```

### 5. Owner Message Report
The backend records only anonymous send events: total messages, unique browsers, daily totals, and channel totals. It does not store message text, names, phone numbers, or email addresses.

1. Set a long random `ADMIN_REPORT_TOKEN` in `.env`.
2. Keep the report store persistent in production. The default file is `server/message-report.json`; set `REPORT_DATA_FILE` to a mounted persistent path when the host has ephemeral disks.
3. Open the website with `#owner-report` (for example, `https://your-domain.example/#owner-report`) and enter the token.

The protected API is also available at `GET /api/admin/message-report` with `Authorization: Bearer <ADMIN_REPORT_TOKEN>`. This is an anonymous usage report, not a true authenticated-user count; “unique browsers” is an estimate of distinct visitors who sent a message from a browser.

---

## 📦 Project Structure

```
breast_cancer/
├── public/
│   ├── assets/
│   │   ├── images/          # Reference assets & banner artwork
│   │   └── logos/           # SGPGI Breast Health Program logo
│   ├── favicon.svg          # Ribbon SVG favicon
│   ├── manifest.json        # PWA Web App Manifest
│   ├── robots.txt           # Search engine indexing rules
│   └── sitemap.xml          # XML sitemap
├── server/
│   └── index.js             # Optional Express backend with Nodemailer & Twilio adapters
├── src/
│   ├── components/
│   │   ├── About.jsx            # Section 3: SGPGI Initiative & Department Details
│   │   ├── Awareness.jsx        # Section 4: Educational Guide, BSE Stepper, Quiz, Myths
│   │   ├── CardPreview.jsx      # Printable/Exportable Greeting Card Preview
│   │   ├── Footer.jsx           # Section 5: Footer, Contact, Google Maps, Social Links
│   │   ├── Hero.jsx             # Section 1: Hero, October Countdown, Key Lines Stack
│   │   ├── LanguageSwitcher.jsx # Multilingual Switcher (EN | हिन्दी | தமிழ்)
│   │   ├── MessageWizard.jsx    # Section 2: 3-Step Greeting Card & Support Generator
│   │   ├── Modals.jsx           # Privacy Policy, Terms, and Embedded Google Map
│   │   ├── Navbar.jsx           # Sticky Glass Navbar with Scrollspy & Dark Toggle
│   │   ├── PhotoUploader.jsx    # Client-side Image Crop & Compression
│   │   ├── Preloader.jsx        # Ribbon-drawing page preloader
│   │   ├── RibbonCursorTrail.jsx# Desktop mouse rose petal trail
│   │   ├── RibbonProgress.jsx   # Scroll progress indicator + Back to Top
│   │   ├── RibbonSVG.jsx        # Multi-variant Ribbon component with Confetti
│   │   ├── ScrollRibbon.jsx     # Scroll-linked flowing SVG Ribbon
│   │   └── VoiceRecorder.jsx    # Audio MediaRecorder component with waveforms
│   ├── data/
│   │   ├── awareness.json       # Brochure-verified medical data, symptoms, BSE steps, quiz
│   │   ├── messages.json        # 40+ native EN/HI/TA messages across 5 categories
│   │   └── stats.json           # Configurable clinical statistics
│   ├── App.jsx                  # Main Application container
│   ├── index.css                # Tailwind & Custom CSS variables, Glassmorphism, animations
│   └── main.jsx                 # Application entry point
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🚢 Deployment Options

- **Vercel**: Run `vercel deploy` or connect your GitHub repository.
- **Netlify**: Run `netlify deploy --prod --dir=dist`.
- **Cloudflare Pages**: Set build command to `npm run build` and output directory to `dist`.
- **Docker / Static Web Server**: Serve the `dist/` directory with Nginx or Caddy.

---

## 🩺 Medical Disclaimer
*This website is issued in public interest for educational and awareness purposes. It does not provide medical diagnoses or replace professional consultations with certified breast surgeons or healthcare specialists.*
