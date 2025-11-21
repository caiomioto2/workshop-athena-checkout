/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Retro Terminal / Claude Code Colors
        claude: {
          bg: '#DD8468',
          dark: '#121212',
          accent: '#FF5E3A',
          text: '#F0F0F0',
          dim: '#888888',
          border: '#333333',
        },
        // Cigano Agi Design System Colors
        primary: {
          50: '#E6F0FF',
          100: '#B3D1FF',
          200: '#80B3FF',
          300: '#4D94FF',
          400: '#1A76FF',
          500: '#0047FF', // Electric Blue
          600: '#0039CC',
          700: '#002B99',
          800: '#001D66',
          900: '#000F33',
        },
        text: {
          primary: '#0C1222', // Deep Navy
          secondary: '#4A5568',
          muted: '#718096',
        },
        background: {
          primary: '#FFFFFF', // Pure White
          surface: '#F5F5F7', // Light Grey
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#FF3B30',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#34C759',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FF9500',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        'mono': ['var(--font-jetbrains)', 'monospace'],
        'vt323': ['var(--font-vt323)', 'monospace'],
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'handwritten': ['Patrick Hand', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(12, 18, 34, 0.1), 0 2px 4px -1px rgba(12, 18, 34, 0.06)',
        'medium': '0 10px 15px -3px rgba(12, 18, 34, 0.1), 0 4px 6px -2px rgba(12, 18, 34, 0.05)',
        'large': '0 20px 25px -5px rgba(12, 18, 34, 0.1), 0 10px 10px -5px rgba(12, 18, 34, 0.04)',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
    },
  },
  plugins: [],
}