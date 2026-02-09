/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: 'rgb(var(--color-bg) / <alpha-value>)',
          'gradient-start':
            'rgb(var(--color-bg-gradient-start) / <alpha-value>)',
          'gradient-end': 'rgb(var(--color-bg-gradient-end) / <alpha-value>)'
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
          hover: 'rgb(var(--color-surface-hover) / <alpha-value>)'
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)'
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          muted: 'rgb(var(--color-accent-muted) / <alpha-value>)'
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          hover: 'rgb(var(--color-secondary-hover) / <alpha-value>)'
        },
        success: 'rgb(var(--color-success) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)'
      },
      fontFamily: {
        ui: [
          'Poppins',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        data: ['Inter', 'SF Mono', 'Consolas', 'Monaco', 'monospace'],
        // Aliases for compatibility
        sans: [
          'Poppins',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        body: [
          'Poppins',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        display: [
          'Poppins',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        mono: ['Inter', 'SF Mono', 'Consolas', 'Monaco', 'monospace']
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)'
      },
      animation: {
        fadeIn: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        fadeInScale: 'fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        slideInRight: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        slideInLeft: 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        slideUp: 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        scaleIn: 'scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
        glow: 'glow 2s ease-in-out infinite'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
