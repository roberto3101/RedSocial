// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false
    }
  },
  // 👇 Esto permite que rutas fuera del sistema de React funcionen
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './public/admin/index.html'
      }
    }
  }
})
