import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'react-hot-toast'],
          socket: ['socket.io-client']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://your-app-name.vercel.app'
          : 'http://localhost:5001',
        changeOrigin: true,
        secure: true
      },
      '/socket.io': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://your-app-name.vercel.app'
          : 'http://localhost:5001',
        changeOrigin: true,
        secure: true,
        ws: true
      }
    }
  },
  define: {
    'process.env': process.env
  }
})
