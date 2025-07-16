import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Should include your component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config