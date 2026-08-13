import { usePlatform } from '../hooks/platformContext.js'
import Badge from './Badge.jsx'

export default function TopBar({ navOpen, navId, onToggleNav, menuRef }) {
  const { platform, setPlatform } = usePlatform()

  return (
    <header className="topbar">
      <button
        type="button"
        className="iconbtn"
        aria-expanded={navOpen}
        aria-controls={navId}
        aria-label={navOpen ? 'Cerrar el menú de secciones' : 'Abrir el menú de secciones'}
        onClick={onToggleNav}
        ref={menuRef}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {navOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <a className="topbar__brand" href="#/">
        <span>NotebookLM · guía de conexión</span>
      </a>
      <span className="topbar__badge">
        <Badge tone="warning">Cliente no oficial</Badge>
      </span>

      <div className="topbar__spacer" />

      <div className="platform" role="group" aria-label="Sistema operativo de los ejemplos">
        <button type="button" aria-pressed={platform === 'windows'}
                onClick={() => setPlatform('windows')}>
          Windows
        </button>
        <button type="button" aria-pressed={platform === 'posix'}
                onClick={() => setPlatform('posix')}>
          {/* La etiqueta larga no cabe en pantallas estrechas y dejaba el
              boton cortado fuera de la barra. */}
          <span className="platform__long">macOS / Linux</span>
          <span className="platform__short" aria-hidden="true">Unix</span>
        </button>
      </div>
    </header>
  )
}
