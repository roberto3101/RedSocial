// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false
    },
    proxy: {
      "/api": "http://localhost:3001", // <--- Agregado: Proxy solo para llamadas /api
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './public/admin/index.html'
      }
    }
  }
})
