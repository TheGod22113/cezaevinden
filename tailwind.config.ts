import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Logodaki renkler
        navy: {
          50:  '#eef1fb',
          100: '#d5dcf5',
          200: '#aab9eb',
          300: '#7f96e1',
          400: '#5473d7',
          500: '#2950cd',
          600: '#1d3fa4',
          700: '#1B2B6B', // Ana marka rengi
          800: '#142054',
          900: '#0d153d',
        },
        crimson: {
          500: '#e8192c',
          600: '#CC2229', // Logo kırmızısı
          700: '#a81b21',
        },
        gold: {
          400: '#f5c842',
          500: '#F5A623', // Logo altını
          600: '#d4891a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
