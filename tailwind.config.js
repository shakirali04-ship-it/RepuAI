/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#04080F', 900: '#070D1A', 800: '#0D1829',
          700: '#132038', 600: '#1A2D4F', 500: '#243d6b',
        },
        brand: {
          blue: '#1E6FE8', cyan: '#00C2E0', gold: '#F5A623',
          green: '#10B981', red: '#EF4444', purple: '#8B5CF6', indigo: '#4F46E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
