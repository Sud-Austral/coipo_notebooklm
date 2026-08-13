import { createContext, useContext } from 'react'

/** Slug de la seccion que se esta renderizando; lo usan los encabezados para
 *  construir su ancla `#/<slug>/<id>`. */
export const SectionContext = createContext('')

export const useSectionSlug = () => useContext(SectionContext)
