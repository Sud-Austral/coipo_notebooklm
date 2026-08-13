import { useEffect, useState } from 'react'

/**
 * Deriva el indice de la pagina del DOM ya renderizado, en vez de declararlo a
 * mano en cada seccion: asi no se puede desincronizar del contenido.
 */
export function useHeadings(containerRef, deps) {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const found = [...root.querySelectorAll('h2[id], h3[id]')].map((el) => ({
      id: el.id,
      text: el.dataset.tocText || el.textContent.replace(/#$/, '').trim(),
      level: Number(el.tagName[1]),
    }))
    setHeadings(found)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, deps])

  return headings
}
