import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno (sin prefijo)
  const env = loadEnv(mode, process.cwd(), '')

  // Usa base solo en producción (para GitHub Pages, subcarpeta /RedSocial/)
  // En desarrollo es '/'
  const base = mode === 'production' ? '/RedSocial/' : '/';

  return {
    base,
    plugins: [react()],
    server: {
      fs: { strict: false },
      proxy: {
        '^/(api|auth|uploads|projects|chats|oauth)': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
      // No necesitas historyApiFallback: Vite lo maneja solo
    },
    build: {
      rollupOptions: {
        input: {
          main: './index.html',
          // admin: './public/admin/index.html', // si tienes panel admin, descomenta
        },
      },
    },
    envPrefix: 'VITE_',
    define: {
      // Esto permite usar variables del .env en build final
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL),
    },
  }
})
