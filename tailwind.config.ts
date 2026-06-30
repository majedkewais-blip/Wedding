import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory:    '#F8F2E7',
        champagne:'#EFE3CC',
        warmwhite:'#FBF7EF',
        gold:     '#B0894E',
        goldsoft: '#C4AA70',
        forest:   '#213A2A',
        forest2:  '#2D4936',
        emerald:  '#1F6F54',
        ink:      '#4A4334',
        inksoft:  '#78706A',
        matte:    '#1A1714'
      },
      fontFamily: {
        script: ['var(--font-script)', 'cursive'],
        serif:  ['var(--font-serif)', 'Georgia', 'serif']
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-22px) rotate(6deg)' } },
        shimmer:{ '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }
      },
      animation: {
        floaty: 'floaty 9s ease-in-out infinite',
        shimmer:'shimmer 6s linear infinite'
      }
    }
  },
  plugins: []
};
export default config;
