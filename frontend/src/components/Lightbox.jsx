import { useEffect, useRef } from 'react'

/** Visor a pantalla completa para las infografías. */
export default function Lightbox({ item, onClose, onPrev, onNext }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    // Evita que el fondo siga desplazándose mientras el visor está abierto.
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [onClose, onPrev, onNext])

  if (!item) return null

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.tema}>
      <div className="lightbox__bar">
        <p className="lightbox__title">
          {item.tema}
          <span className="lightbox__meta">
            {item.estilo}
            {item.orientacion ? ` · ${item.orientacion}` : ''}
          </span>
        </p>
        <a className="copybtn" href={item.src} download>
          Descargar
        </a>
        <button type="button" className="copybtn" onClick={onClose} ref={closeRef}>
          Cerrar
        </button>
      </div>

      <button type="button" className="lightbox__nav lightbox__nav--prev"
              onClick={onPrev} aria-label="Anterior">
        ‹
      </button>

      <img className="lightbox__img" src={item.src} alt={`Infografía: ${item.tema}`} />

      <button type="button" className="lightbox__nav lightbox__nav--next"
              onClick={onNext} aria-label="Siguiente">
        ›
      </button>
    </div>
  )
}
