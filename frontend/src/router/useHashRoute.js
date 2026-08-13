import { useSyncExternalStore } from 'react'

/**
 * Router por hash. Formato: #/<slug> y #/<slug>/<headingId>
 *
 * Se usa hash y no History API a proposito: el sitio se publica como estatico y
 * el destino aun no esta decidido. Con hash los deep links funcionan en
 * cualquier hosting sin fallback de servidor, y bajo cualquier `base` de Vite.
 */

const subscribe = (onChange) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const getSnapshot = () => window.location.hash
const getServerSnapshot = () => ''

/** '#/instalacion/venv' -> { slug: 'instalacion', headingId: 'venv' } */
export function parseHash(hash) {
  const raw = String(hash || '').replace(/^#\/?/, '')
  if (!raw) return { slug: '', headingId: '' }
  const [slug = '', headingId = ''] = raw.split('/')
  return { slug: decodeURIComponent(slug), headingId: decodeURIComponent(headingId) }
}

export function useHashRoute(slugs, fallbackSlug) {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const { slug, headingId } = parseHash(hash)

  if (!slug) return { slug: fallbackSlug, headingId: '', isKnown: true, isHome: true }
  const isKnown = slugs.includes(slug)
  return { slug, headingId, isKnown, isHome: false }
}

/** Enlace interno. SIEMPRE relativo (`#/x`), nunca `/#/x`: con base en
 *  subdirectorio, la barra inicial rompe la ruta. */
export const to = (slug, headingId) =>
  headingId ? `#/${slug}/${headingId}` : `#/${slug}`
