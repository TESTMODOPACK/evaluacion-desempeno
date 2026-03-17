import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        sand: '#f8fafc',
        accent: '#0f766e',
      },
    },
  },
  plugins: [],
} satisfies Config;
