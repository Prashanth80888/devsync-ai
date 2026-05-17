import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Fixed industry-standard port for development frontends
    host: true, // Exposes the server to local network interfaces
    strictPort: true // Prevents Vite from auto-switching ports if 3000 is occupied
  }
})