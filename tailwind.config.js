/** @type {import('tailwindcss').Config} */
// Mapalu Store — "Living Surface" design system
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Botanical green treated as a material, not an accent
        brand: {
          50: '#EDF7F0',
          100: '#D3ECDB',
          200: '#A6D9B8',
          300: '#6FC08F',
          400: '#31A164',
          500: '#01732E', // the original brand green
          600: '#016327',
          700: '#0B4D28',
          800: '#0B3D24',
          900: '#08291A',
          950: '#041A11',
        },
        sand: {
          50: '#FBF6F1',
          100: '#F4E7DA',
          200: '#E7CDB4',
          300: '#D9AE87',
          400: '#CD8F5C', // original accent
          500: '#B87844',
          600: '#985E35',
        },
        ink: {
          DEFAULT: '#0E1311',
          soft: '#1A211E',
          muted: '#5B6661',
        },
        bone: '#F7F6F2',
        stone: '#EFEDE7',
        line: '#E3E0D8',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.45', letterSpacing: '0.08em' }],
        xs: ['0.78rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.55' }],
        base: ['0.9375rem', { lineHeight: '1.65' }],
        lg: ['1.0625rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.22' }],
        '4xl': ['2.4rem', { lineHeight: '1.15' }],
        '5xl': ['3.2rem', { lineHeight: '1.06' }],
        '6xl': ['4.2rem', { lineHeight: '1.02' }],
        '7xl': ['5.6rem', { lineHeight: '0.98' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '16px',
        xl: '22px',
        '2xl': '30px',
        '3xl': '42px',
        pill: '999px',
      },
      maxWidth: {
        container: '1320px',
        wide: '1600px',
      },
      // 6-step elevation scale + brand glow
      boxShadow: {
        e1: '0 1px 2px rgba(8,41,26,0.05), 0 1px 3px rgba(8,41,26,0.04)',
        e2: '0 2px 4px rgba(8,41,26,0.05), 0 4px 10px rgba(8,41,26,0.05)',
        e3: '0 4px 8px rgba(8,41,26,0.05), 0 10px 24px rgba(8,41,26,0.07)',
        e4: '0 8px 16px rgba(8,41,26,0.06), 0 20px 44px rgba(8,41,26,0.09)',
        e5: '0 14px 28px rgba(8,41,26,0.08), 0 34px 76px rgba(8,41,26,0.12)',
        e6: '0 24px 48px rgba(8,41,26,0.10), 0 56px 120px rgba(8,41,26,0.16)',
        glow: '0 10px 30px -6px rgba(1,115,46,0.45)',
        'glow-lg': '0 22px 60px -12px rgba(1,115,46,0.55)',
        sand: '0 12px 34px -8px rgba(205,143,92,0.45)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
        'inset-dark': 'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      transitionTimingFunction: {
        grow: 'cubic-bezier(0.22, 1, 0.36, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.12) translate3d(-1.5%,-1.5%,0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-2%,3%)' },
          '40%': { transform: 'translate(3%,-2%)' },
          '60%': { transform: 'translate(-3%,-3%)' },
          '80%': { transform: 'translate(2%,2%)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        kenburns: 'kenburns 18s ease-out alternate infinite',
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 6s ease-in-out infinite',
        grain: 'grain 8s steps(6) infinite',
      },
      backgroundImage: {
        'brand-deep': 'linear-gradient(160deg, #0B3D24 0%, #08291A 55%, #041A11 100%)',
        'brand-sheen': 'linear-gradient(135deg, #01732E 0%, #31A164 100%)',
        'fade-up': 'linear-gradient(to top, rgba(4,26,17,0.92) 0%, rgba(4,26,17,0.45) 45%, rgba(4,26,17,0) 100%)',
        'fade-down': 'linear-gradient(to bottom, rgba(4,26,17,0.75) 0%, rgba(4,26,17,0) 60%)',
      },
    },
  },
  plugins: [],
};
