import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno sin prefijo (''), útil para usar en define
  const env = loadEnv(mode, process.cwd(), '')

  // Puedes descomentar para debuggear el valor recibido
  // console.log('VITE_API_URL cargada por Vite:', env.VITE_API_URL)

  return {
    // Ruta base para producción en GitHub Pages. Cámbiala si tu subcarpeta es distinta
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
      // Fallback SPA: ¡Vite ya lo maneja automáticamente!
      // Pero si usas un servidor custom para prod, necesitas fallback: 'index.html'
    },
    build: {
      rollupOptions: {
        input: {
          main: './index.html',
          // Si tienes un admin panel o landing extra, agrega aquí
          // admin: './public/admin/index.html',
        },
      },
    },
    envPrefix: 'VITE_',
    define: {
      // Esto permite que las variables .env se reemplacen correctamente en build final
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL),
    },
  }
})
