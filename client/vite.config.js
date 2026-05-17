import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Injects the lightning-fast Tailwind v4 compiler into Vite
  ],
  server: {
    port: 3000,
    host: true,
    strictPort: true
  }
})