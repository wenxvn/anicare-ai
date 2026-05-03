import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0f1115',
          800: '#16181d',
          700: '#1d1f26'
        },
        warm: {
          50: '#fff8f1',
          100: '#ffecd6',
          500: '#e07d3c'
        },
        accent: {
          green: '#9fb08c',
          amber: '#d6a243',
          red: '#d95d39'
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