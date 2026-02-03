import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'   // for React
import tailwindcss from '@tailwindcss/vite' // official Tailwind Vite plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ this is correct
  ],
})
