import type { Config } from "tailwindcss";

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app-old/**/*.{js,jsx,ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          base: 'var(--color-bg-base)',
          1: 'var(--color-bg-1)',
          2: 'var(--color-bg-2)',
          brand: 'var(--color-bg-brand)',
          support1: 'var(--color-bg-support-1)',
          support2: 'var(--color-bg-support-2)',
        },
        text: {
          accent: 'var(--color-text-accent)',
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          disabled: 'var(--color-text-disabled)',
        },
        shape: {
          accent: 'var(--color-shape-accent)',
          primary: 'var(--color-shape-primary)',
          secondary: 'var(--color-shape-secondary)',
          tertiary: 'var(--color-shape-tertiary)',
          disabled: 'var(--color-shape-disabled)',
        },
        line: {
          accent: 'var(--color-line-accent)',
          primary: 'var(--color-line-primary)',
          secondary: 'var(--color-line-secondary)',
          disabled: 'var(--color-line-disabled)',
        },
        primary: 'var(--color-shape-primary)',
        'primary-foreground': 'var(--color-bg-base)',
        secondary: 'var(--color-bg-1)',
        'secondary-foreground': 'var(--color-text-primary)',
        accent: 'var(--color-shape-accent)',
        'accent-foreground': 'var(--color-bg-base)',
        muted: 'var(--color-shape-tertiary)',
        'muted-foreground': 'var(--color-text-tertiary)',
      },
      borderColor: {
        DEFAULT: 'var(--color-line-secondary)',
        accent: 'var(--color-line-accent)',
        muted: 'var(--color-line-disabled)',
      },
      ringColor: {
        DEFAULT: 'var(--color-line-accent)',
      },
      fontFamily: {
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(-100%)' },
          '45%': { transform: 'translateX(100%)' },
          '55%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        wave: 'wave 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
      },
      backgroundImage: {
        'footer-gradient-light': `linear-gradient(
          to bottom, 
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        ),
        linear-gradient(
          50deg,
          transparent 0%,
          rgba(255, 255, 255, 0) 10%,
          rgb(57, 146, 255, 0.2) 30%,
          rgb(107, 217, 104, 0.2) 40%,
          rgb(254, 204, 27, 0.3) 50%,
          rgb(216, 59, 210, 0.2) 60%,
          rgb(244, 66, 80, 0.2) 70%,
          rgba(255, 255, 255, 0) 90%,
          transparent 100%
        )`,
        'footer-gradient-dark': `linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0) 20%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0) 80%,
          transparent 100%
        )`,
      },
    },
  },
  plugins: [],
} satisfies Config;
