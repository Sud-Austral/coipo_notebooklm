import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * `base` sale de VITE_BASE para no atarnos a un destino de publicacion todavia:
 *   raiz de dominio (Netlify, Vercel)  -> sin variable, queda '/'
 *   GitHub Pages de proyecto           -> VITE_BASE=/coipo_notebooklm/
 *
 * El routing es por hash, asi que `base` solo reescribe URLs de assets y nunca
 * afecta a las rutas de la guia.
 */
const normalizeBase = (value) => {
  const raw = String(value ?? '').trim() || '/'
  const withLeading = raw.startsWith('/') || /^https?:\/\//.test(raw) ? raw : `/${raw}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    // process.env primero: CI puede inyectarla sin escribir un .env
    base: normalizeBase(process.env.VITE_BASE ?? env.VITE_BASE ?? '/'),
    plugins: [react()],
  }
})
