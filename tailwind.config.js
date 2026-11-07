// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        // map CSS variables to Tailwind color utilities
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        surface: 'var(--bg-surface)',
        muted: 'var(--bg-muted)',
        borderSubtle: 'var(--border-subtle)',
        borderStrong: 'var(--border-strong)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',
        accentBlue: 'var(--accent-blue)',
        accentGold: 'var(--accent-gold)',
      },
    },
  },
  plugins: [],
};
