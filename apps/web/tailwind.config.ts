import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0f172a',
          light: '#334155',
          dark: '#020617',
        },
        sand: {
          DEFAULT: '#f8fafc',
          dark: '#f1f5f9',
        },
        accent: {
          DEFAULT: '#0f766e', // Teal corporativo
          hover: '#0d9488',
          light: '#ccfbf1',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config;
