import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // use a relative base so it works on GitHub Pages subfolder *and* on Vercel root
  // ``./`` tells Vite to load assets relative to the current HTML file.
  base: './',
  build: {
    sourcemap: false,  // Disable sourcemaps
  },
  define: {
    global: 'globalThis'
  }
})
