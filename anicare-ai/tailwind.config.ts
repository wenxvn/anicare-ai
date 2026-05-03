import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#f8f5f0',
          800: '#ffffff',
          700: '#f3efe8'
        },
        warm: {
          50: '#1a1615',
          100: '#5c524a',
          500: '#0d9488'
        },
        accent: {
          green: '#16a34a',
          amber: '#d97706',
          red: '#dc2626'
        },
        orange: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#14b8a6',
          300: '#0d9488',
          400: '#14b8a6',
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
          800: '#134e4a',
          900: '#042f2e'
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem'
      }
    }
  },
  plugins: []
}
export default config