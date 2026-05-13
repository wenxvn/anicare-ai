import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#f5f7fb',
          800: '#ffffff',
          700: '#e8edf5'
        },
        warm: {
          50: '#172033',
          100: '#5d6b82',
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
        '2xl': '0.75rem',
        '3xl': '0.875rem'
      }
    }
  },
  plugins: []
}
export default config
