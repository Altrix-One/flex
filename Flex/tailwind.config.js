/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4169E1',
        secondary: '#2B65EC',
        accent: '#F0592B',
        success: '#80C243',
        warning: '#F8CA57',
        error: '#CE181E',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #4169E1, #2B65EC)',
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
      backdropBlur: {
        'xl': '15px',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}