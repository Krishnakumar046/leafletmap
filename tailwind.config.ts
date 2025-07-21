import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./src/app/**/.{js,ts,jsx,tsx,mdx,html}",
"./src/components//*.{js,ts,jsx,tsx,mdx,html}",
"./src/context//*.{js,ts,jsx,tsx,mdx,html}", // Should include your component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config