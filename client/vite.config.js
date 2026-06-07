import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://quiz-app-backend-k92b.onrender.com',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'https://quiz-app-backend-k92b.onrender.com',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
