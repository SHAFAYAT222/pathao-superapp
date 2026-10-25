/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pathao: {
          red: '#EE2A24',
          redDark: '#C81813',
          redHover: '#D41E18',
          redLight: '#FFF0F0',
          redSoft: '#FEE7E6',
          black: '#191A1D',
          dark: '#24272C',
          charcoal: '#373E47',
          gray: '#6B7280',
          border: '#E5E7EB',
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          green: '#10B981',
          greenDark: '#059669',
          yellow: '#F59E0B',
          amber: '#D97706',
          blue: '#2563EB',
        },
        bkash: {
          pink: '#E2136E',
          hover: '#C20F5D',
          light: '#FCE7F1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sheet': '0 -8px 32px rgba(0, 0, 0, 0.12)',
        'modal': '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
        'glow-red': '0 8px 24px -4px rgba(238, 42, 36, 0.35)',
        'glow-bkash': '0 8px 24px -4px rgba(226, 19, 110, 0.35)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'radar-1': 'radar 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'radar-2': 'radar 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite 0.8s',
        'radar-3': 'radar 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.6s',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.4)', opacity: '0.9' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        }
      }
    },
  },
  plugins: [],
}
