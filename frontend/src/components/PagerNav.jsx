import { to } from '../router/useHashRoute.js'

export default function PagerNav({ prev, next }) {
  if (!prev && !next) return null

  return (
    <nav className="pager" aria-label="Navegación entre secciones">
      {prev && (
        <a href={to(prev.slug)}>
          <span className="pager__dir">Anterior</span>
          {prev.title}
        </a>
      )}
      {next && (
        <a href={to(next.slug)} className="pager__next">
          <span className="pager__dir">Siguiente</span>
          {next.title}
        </a>
      )}
    </nav>
  )
}
