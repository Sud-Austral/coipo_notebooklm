import { useEffect, useState } from 'react'

/**
 * Scroll-spy sobre los encabezados de la pagina actual.
 *
 * Dos detalles que suelen romperse:
 *  - StrictMode de React 19 monta los efectos dos veces en dev; el observer
 *    tiene que desconectarse en el cleanup o parpadea.
 *  - Al llegar al final del documento el ultimo encabezado nunca cruza el
 *    umbral superior, asi que se fuerza a mano.
 */
export function useActiveHeading(ids) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!ids.length) {
      setActiveId('')
      return
    }

    const visible = new Set()

    const pick = () => {
      const scroller = document.scrollingElement || document.documentElement
      const atBottom =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 4
      if (atBottom) {
        setActiveId(ids[ids.length - 1])
        return
      }
      const first = ids.find((id) => visible.has(id))
      if (first) setActiveId(first)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        pick()
      },
      { rootMargin: '-72px 0px -68% 0px', threshold: 0 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    setActiveId(ids[0])
    window.addEventListener('scroll', pick, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', pick)
    }
  }, [ids])

  return activeId
}
