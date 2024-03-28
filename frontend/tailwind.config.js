/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      'primary-600': '#3B2826',
      'primary-500': '#62251D',
      'primary-400': '#875D50',
      'primary-300': '#836E6E',
      'primary-200': '#BBAFA2',
      'primary-100': '#F1E3D5',
      red: '#D1104A',
      blue: '#4C76C7',
      'blue-100': '#7ca9ff',
      currentColor: 'currentColor',
    },
    fontSize: {
      // default fontsize from tailwind
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
      xl: ['1.25rem', '2rem'],
      '2xl': ['1.5rem', '2rem'],
      '3xl': ['1.875rem', '2.25rem'],
      '4xl': ['2.25rem', '2.5rem'],
      '5xl': ['3rem', '1rem'],
      '6xl': ['3.75rem', '1rem'],
      '7xl': ['4.5rem', '1rem'],
      '8xl': ['6rem', '1rem'],
      '9xl': ['8rem', '1rem'],
      'heading-h1': [
        '2.25rem',
        {
          fontWeight: 'bold',
          lineHeight: '1.6',
          letterSpacing: '-0.2px',
        },
      ],
      'heading-h2': [
        '1.5rem',
        {
          fontWeight: 'bold',
          lineHeight: '1.35',
          letterSpacing: 'normal',
        },
      ],
      'heading-h3': [
        '1.25rem',
        {
          fontWeight: 'bold',
          lineHeight: '1.25',
          letterSpacing: '0.16px',
        },
      ],
      'heading-h4': [
        '1.125rem',
        {
          fontWeight: 'bold',
          lineHeight: '1.4',
          letterSpacing: '0.28px',
        },
      ],
      'heading-h5': [
        '1rem',
        {
          fontWeight: 'bold',
          lineHeight: '1.3',
          letterSpacing: '0.24px',
        },
      ],
      'paragraph-p1': [
        '1.5rem',
        {
          fontWeight: 'normal',
          lineHeight: '1.25',
          letterSpacing: '0.16px',
        },
      ],
      'paragraph-p2': [
        '1.25rem',
        {
          fontWeight: 'normal',
          lineHeight: '1.25',
          letterSpacing: '0.14px',
        },
      ],
      'paragraph-p3': [
        '1rem',
        {
          fontWeight: 'normal',
          lineHeight: '1.3',
          letterSpacing: '0.12px',
        },
      ],
    },
    extend: {},
  },
  plugins: [],
};
