/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				gemini: {
					bg: '#0E1117',
					surface: '#161B22',
					accent: '#4AA9FF',
					secondary: '#D965E0',
					text: '#F0F6FC',
					dim: '#8B949E',
					border: '#30363D'
				},
				primary: {
					'50': '#E6F0FF',
					'100': '#B3D1FF',
					'200': '#80B3FF',
					'300': '#4D94FF',
					'400': '#1A76FF',
					'500': '#0047FF',
					'600': '#0039CC',
					'700': '#002B99',
					'800': '#001D66',
					'900': '#000F33',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				text: {
					primary: '#0C1222',
					secondary: '#4A5568',
					muted: '#718096'
				},
				background: 'hsl(var(--background))',
				error: {
					'50': '#FEF2F2',
					'100': '#FEE2E2',
					'200': '#FECACA',
					'300': '#FCA5A5',
					'400': '#F87171',
					'500': '#FF3B30',
					'600': '#DC2626',
					'700': '#B91C1C',
					'800': '#991B1B',
					'900': '#7F1D1D'
				},
				success: {
					'50': '#F0FDF4',
					'100': '#DCFCE7',
					'200': '#BBF7D0',
					'300': '#86EFAC',
					'400': '#4ADE80',
					'500': '#34C759',
					'600': '#16A34A',
					'700': '#15803D',
					'800': '#166534',
					'900': '#14532D'
				},
				warning: {
					'50': '#FFFBEB',
					'100': '#FEF3C7',
					'200': '#FDE68A',
					'300': '#FCD34D',
					'400': '#FBBF24',
					'500': '#FF9500',
					'600': '#D97706',
					'700': '#B45309',
					'800': '#92400E',
					'900': '#78350F'
				},
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				mono: [
					'var(--font-jetbrains)',
					'monospace'
				],
				vt323: [
					'var(--font-vt323)',
					'monospace'
				],
				poppins: [
					'Poppins',
					'sans-serif'
				],
				inter: [
					'Inter',
					'sans-serif'
				],
				handwritten: [
					'Patrick Hand',
					'cursive'
				]
			},
			boxShadow: {
				soft: '0 4px 6px -1px rgba(12, 18, 34, 0.1), 0 2px 4px -1px rgba(12, 18, 34, 0.06)',
				medium: '0 10px 15px -3px rgba(12, 18, 34, 0.1), 0 4px 6px -2px rgba(12, 18, 34, 0.05)',
				large: '0 20px 25px -5px rgba(12, 18, 34, 0.1), 0 10px 10px -5px rgba(12, 18, 34, 0.04)'
			},
			borderRadius: {
				card: '16px',
				button: '12px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				"shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
				"spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
			},
			keyframes: {
				"shimmer-slide": {
					to: {
						transform: "translate(calc(100cqw - 100%), 0)",
					},
				},
				"spin-around": {
					"0%": {
						transform: "translateZ(0) rotate(0)",
					},
					"15%, 35%": {
						transform: "translateZ(0) rotate(90deg)",
					},
					"65%, 85%": {
						transform: "translateZ(0) rotate(270deg)",
					},
					"100%": {
						transform: "translateZ(0) rotate(360deg)",
					},
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
}