import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#D71920',
        ink: '#111111',
        paper: '#f5f5f3',
      },
      boxShadow: {
        card: '0 8px 28px rgba(17,17,17,0.06)',
        float: '0 18px 48px rgba(17,17,17,0.12)',
      },
      borderRadius: {
        card: '18px',
      },
    },
  },
  plugins: [],
};
export default config;
