import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'epic-primary': '#5B8FAD',
        'epic-red': '#E63946',
        'epic-navy': '#1D3557',
        'epic-light-blue': '#D6E8F0',
        'epic-gray': '#808080',
        'epic-light-gray': '#C4C4C4',
        'status-optimal': '#2E7D32',
        'status-effective': '#7CB342',
        'status-improving': '#FFA726',
        'status-sub': '#FF8A65',
        'status-stressed': '#E63946',
      },
    },
  },
  plugins: [],
}
export default config
