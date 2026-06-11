/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: 'var(--color-cream)',
          light: 'var(--color-cream-light)',
          dark: 'var(--color-cream-dark)',
        },
        blush: {
          DEFAULT: 'var(--color-blush)',
          light: 'var(--color-blush-light)',
          dark: 'var(--color-blush-dark)',
        },
        magenta: {
          DEFAULT: 'var(--color-magenta)',
        },
        green: {
          DEFAULT: 'var(--color-green)',
        },
        olive: {
          DEFAULT: 'var(--color-olive)',
          light: 'var(--color-olive-light)',
          muted: 'var(--color-olive-muted)',
        },
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        heading: ['Suez One', 'system-ui', 'sans-serif'],
        serif: ['Bona Nova', 'Georgia', 'serif'],
        sans: ['Alef', 'Google Sans', 'system-ui', 'sans-serif'],
        handwritten: ['Playpen Sans Hebrew', 'cursive'],
        fredoka: ['Fredoka', 'sans-serif'],
        alef: ['Alef', 'sans-serif'],
        bona: ['Bona Nova', 'serif'],
        suez: ['Suez One', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'page-enter': 'pageEnter 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 40px rgba(0, 0, 0, 0.08)',
      },
      minHeight: {
        'screen-dvh': '100dvh',
        'screen-safe': '100dvh',
      },
    },
  },
  plugins: [],
}
