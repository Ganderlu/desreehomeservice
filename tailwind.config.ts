import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00BFA5',
        accent: '#FF9500',
        secondary: '#003087'
      },
      borderRadius: {
        lg: '16px',
        md: '14px',
        sm: '12px'
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      }
    }
  },
  plugins: []
};
export default config;
