/** @type {import('tailwindcss').Config} */

// Note: This project has been migrated to styled-components.
// This configuration file is kept for compatibility with any remaining Tailwind usage.

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        background: '#F3F4F6',
        card: '#FFFFFF',
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          light: '#9CA3AF',
        },
      },
      animation: {
        spin: 'spin 1.5s linear infinite',
        reverse: 'reverse-spin 1.2s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'reverse-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
} 