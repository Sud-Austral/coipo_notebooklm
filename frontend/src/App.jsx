import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GROUPS, SECTIONS, SLUGS, bySlug, neighbors } from './content/sections.js'
import { useHashRoute } from './router/useHashRoute.js'
import { useActiveHeading } from './hooks/useActiveHeading.js'
import { useHeadings } from './hooks/useHeadings.js'
import { SectionContext } from './components/SectionContext.js'
import PlatformProvider from './components/PlatformProvider.jsx'
import TopBar from './components/TopBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import TableOfContents from './components/TableOfContents.jsx'
import PagerNav from './components/PagerNav.jsx'
import NotFound from './components/NotFound.jsx'

const NAV_ID = 'nav-secciones'
const SITE = 'Guía de conexión NotebookLM'

export default function App() {
  const { slug, headingId, isKnown } = useHashRoute(SLUGS, SLUGS[0])
  const [navOpen, setNavOpen] = useState(false)

  const articleRef = useRef(null)
  const mainRef = useRef(null)
  const menuRef = useRef(null)

  const section = isKnown ? bySlug(slug) : null
  const { prev, next } = useMemo(() => neighbors(slug), [slug])

  const headings = useHeadings(articleRef, slug)
  const ids = useMemo(() => headings.map((h) => h.id), [headings])
  const activeId = useActiveHeading(ids)

  // Titulo del documento: los deep links se comparten con su nombre correcto.
  useEffect(() => {
    document.title = section ? `${section.title} · ${SITE}` : SITE
  }, [section])

  // Cambio de ruta: mover el foco al contenido y colocar el scroll. Sin esto un
  // lector de pantalla no percibe que la navegacion SPA ha ocurrido.
  useEffect(() => {
    setNavOpen(false)
    mainRef.current?.focus({ preventScroll: true })

    const target = headingId && document.getElementById(headingId)
    if (target) target.scrollIntoView({ block: 'start' })
    else window.scrollTo({ top: 0 })
  }, [slug, headingId])

  // Escape cierra el cajon lateral y devuelve el foco al boton que lo abrio.
  useEffect(() => {
    if (!navOpen) return
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      setNavOpen(false)
      menuRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  const closeNav = useCallback(() => setNavOpen(false), [])
  const toggleNav = useCallback(() => setNavOpen((open) => !open), [])

  const Section = section?.Component

  return (
    <PlatformProvider>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>

      <TopBar navOpen={navOpen} navId={NAV_ID} onToggleNav={toggleNav} menuRef={menuRef} />

      <div className="app">
        <Sidebar
          id={NAV_ID}
          groups={GROUPS}
          sections={SECTIONS}
          currentSlug={slug}
          open={navOpen}
          onNavigate={closeNav}
        />

        {navOpen && (
          <button type="button" className="scrim" aria-label="Cerrar el menú" onClick={closeNav} />
        )}

        <main id="contenido" className="main" ref={mainRef} tabIndex={-1}>
          <article className="prose" ref={articleRef}>
            <p className="sr-only" aria-live="polite">
              {section ? `Sección: ${section.title}` : 'Sección no encontrada'}
            </p>

            {Section ? (
              <SectionContext value={slug}>
                <p className="eyebrow">{section.group}</p>
                <h1>{section.title}</h1>
                <Section />
                <PagerNav prev={prev} next={next} />
              </SectionContext>
            ) : (
              <NotFound slug={slug} firstSlug={SLUGS[0]} />
            )}
          </article>
        </main>

        <TableOfContents headings={headings} activeId={activeId} slug={slug} />
      </div>
    </PlatformProvider>
  )
}
