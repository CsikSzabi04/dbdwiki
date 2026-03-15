import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - separate chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Firebase - large dependency, separate chunk
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        }
      }
    }
  },
  server: {
    proxy: {
      '/api-steam': {
        target: 'https://api.steampowered.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-steam/, '')
      },
      '/api-tricky': {
        target: 'https://dbd.tricky.lol',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-tricky/, ''),
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true
  }
})

