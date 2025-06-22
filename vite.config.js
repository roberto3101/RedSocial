import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  // Cargar todas las variables (sin prefijo) para usarlas en define
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/RedSocial/',
    plugins: [react()],
    server: {
      fs: { strict: false },
      proxy: {
        '^/(api|auth|uploads|projects|chats|oauth)': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        input: {
          main:  './index.html',
          admin: './public/admin/index.html',
        },
      },
    },
    envPrefix: 'VITE_',
    // 🔥 REEMPLAZA todas las referencias a estas vars en el JS final por el valor real
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL),
    },
  }
})
