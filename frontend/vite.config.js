import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginGtag from './vite-plugin-gtag.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginGtag()],
  server: {
    port: 3010,
    proxy: {
      '/api': {
        target: 'http://localhost:3011',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          axios: ['axios']
        }
      }
    }
  }
})
