/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Custom theme colors che corrispondono alle tue CSS variables
        'base-100': 'var(--color-base-100)',
        'base-200': 'var(--color-base-200)',
        'base-300': 'var(--color-base-300)',
        'base-content': 'var(--color-base-content)',
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'accent': 'var(--color-accent)',
        'neutral': 'var(--color-neutral)',
        'neutral-content': 'var(--color-neutral-content)',
        'info': 'var(--color-info)',
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'error': 'var(--color-error)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
