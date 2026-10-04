/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF1F6',
          100: '#FFE0EC',
          200: '#FFC2D9',
          300: '#FFA3C7',
          400: '#F472A8',
          500: '#EC4899',
          600: '#E0157A', // Ribbon pink
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
        burgundy: '#7A0B3F',
        ink: '#3B1A2B',
        cream: '#FFF8FB',
        rosewood: '#4A1527',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        sans: ['"Poppins"', '"Montserrat"', '"Noto Sans Devanagari"', '"Noto Sans Tamil"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
      },
      boxShadow: {
        'soft-pink': '0 10px 30px -10px rgba(224, 21, 122, 0.15)',
        'glow-pink': '0 0 25px rgba(236, 72, 153, 0.35)',
        'glow-ribbon': '0 0 35px rgba(224, 21, 122, 0.5)',
        'card-pink': '0 20px 40px -15px rgba(122, 11, 63, 0.12)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'ribbon-wave': 'ribbonWave 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        ribbonWave: {
          '0%, 100%': { transform: 'rotate(-2deg) scale(1)' },
          '50%': { transform: 'rotate(2deg) scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
    },
  },
  plugins: [],
}
