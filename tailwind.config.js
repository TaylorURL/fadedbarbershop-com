/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm near-black rather than #000: the logo's ink is warm off-white and
        // a neutral black under it reads blue by comparison.
        pitch: { 950: '#070706', 900: '#0b0a09', 850: '#121110', 800: '#1a1817', 700: '#2a2725' },
        // Sampled from the supplied logo artwork.
        bone: { 50: '#fbfaf7', 100: '#e8e1d5', 200: '#c9c1b4', 300: '#9d968b' },
        rust: { DEFAULT: '#a8391f', deep: '#6e1e12', ember: '#c04422' },
        steel: '#8c939b',
      },
      fontFamily: {
        head: ['"Big Shoulders Display"', '"Big Shoulders Fallback"', 'Impact', 'sans-serif'],
        body: ['Archivo', '"Archivo Fallback"', 'system-ui', 'sans-serif'],
        spec: ['"Space Mono"', '"Space Mono Fallback"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { label: '0.3em', spec: '0.18em' },
      opacity: { 2: '0.02', 3: '0.03', 8: '0.08', 12: '0.12', 15: '0.15' },
      maxWidth: { shell: '1360px' },
      keyframes: {
        'ember-pulse': { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
      },
      animation: {
        'ember-pulse': 'ember-pulse 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
