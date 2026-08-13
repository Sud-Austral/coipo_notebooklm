import { useSectionSlug } from './SectionContext.js'

function Anchor({ id }) {
  const slug = useSectionSlug()
  return (
    <a className="heading-anchor" href={`#/${slug}/${id}`} aria-label="Enlace a esta sección">
      #
    </a>
  )
}

export function H2({ id, children }) {
  return (
    <h2 id={id} data-toc-text={typeof children === 'string' ? children : undefined}>
      {children}
      <Anchor id={id} />
    </h2>
  )
}

export function H3({ id, children }) {
  return (
    <h3 id={id} data-toc-text={typeof children === 'string' ? children : undefined}>
      {children}
      <Anchor id={id} />
    </h3>
  )
}
