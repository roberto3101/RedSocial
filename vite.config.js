// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  // Carga .env, por si necesitas usar variables dentro de la config
  loadEnv(mode, process.cwd())

  return {
    // 👉 Ruta base obligatoria para GitHub Pages
    base: '/RedSocial/',
    plugins: [react()],

    /* ───────────── Dev Server ───────────── */
    server: {
      fs: { strict: false },

      /*
       * Durante `npm run dev` todo lo que empiece por
       *   /api, /auth, /uploads, /projects, /chats, /oauth
       * se redirige al backend local que corre en http://localhost:8080
       * (evita CORS mientras desarrollas).
       */
      proxy: {
        '^/(api|auth|uploads|projects|chats|oauth)': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },

    /* ───────────── Build ───────────── */
    build: {
      rollupOptions: {
        input: {
          main:  './index.html',
          admin: './public/admin/index.html',
        },
      },
    },

    // Solo expondrá a import.meta.env.* variables que empiecen por VITE_
    envPrefix: 'VITE_',
  }
})
