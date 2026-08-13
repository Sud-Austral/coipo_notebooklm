import { to } from '../router/useHashRoute.js'

export default function NotFound({ slug, firstSlug }) {
  return (
    <div className="notfound">
      <h1>Esa sección no existe</h1>
      <p>
        No hay ninguna sección con el identificador <code>{slug}</code>.
      </p>
      <p>
        <a href={to(firstSlug)}>Volver al principio de la guía</a>
      </p>
    </div>
  )
}
