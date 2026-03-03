import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
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
  }
})
