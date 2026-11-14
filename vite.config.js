import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Vite 8 / Rolldown expects a function, not an object map
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react-router') || id.includes('/react-dom') || id.includes('/react/')) {
            return 'vendor-react'
          }
          if (id.includes('axios')) {
            return 'vendor-axios'
          }
          if (id.includes('lucide-react')) {
            return 'vendor-icons'
          }
        },
      },
    },
  },
})
