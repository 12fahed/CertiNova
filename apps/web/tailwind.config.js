import preset, { content } from 'frappe-ui/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [...content, './index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      // Brand palette "Ocean & Coral". Frappe UI's blue tokens are mapped to it in src/theme.css.
      colors: {
        white: '#FFFFFF',
        canvas: '#F6F9FC',
        edge: { DEFAULT: '#E2E8F0', soft: '#EEF2F7', strong: '#CBD5E1' },
        brand: {
          50: '#F3F8FD',
          100: '#E7F1FB',
          200: '#CFE2F6',
          600: '#0B6BCB',
          700: '#095CAF',
          800: '#0B4F94',
        },
        accent: { 50: '#FFF0E6', 100: '#FFE2CF', 600: '#E8590C', 800: '#9A3412' },
        good: { 50: '#E6F6F4', 600: '#0D9488', 700: '#0F766E', 800: '#115E59' },
        bad: { 50: '#FFE8EC', 25: '#FFF7F8', 600: '#E11D48', 700: '#BE123C', 800: '#9F1239' },
        plum: { 50: '#F3EEFF', 600: '#7C3AED', 800: '#5B21B6' },
        sun: { 50: '#FEF3E2', 600: '#D97706', 800: '#92400E' },
      },
      // The preset replaces the radius scale with numbered steps; keep the usual names too.
      borderRadius: { md: '6px', lg: '8px', xl: '12px', '2xl': '16px' },
      // Heading sizes above the preset's compact type scale.
      fontSize: {
        h1: ['26px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        section: ['30px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        display: ['52px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        lift: '0 12px 32px rgba(16, 24, 40, 0.12)',
      },
    },
  },
}
