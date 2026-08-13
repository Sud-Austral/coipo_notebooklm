export default function TableOfContents({ headings, activeId, slug }) {
  if (headings.length < 2) return <aside className="toc" aria-hidden="true" />

  return (
    <aside className="toc">
      <nav aria-label="Índice de la página">
        <p className="toc__title">En esta página</p>
        <ul>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#/${slug}/${heading.id}`}
                data-level={heading.level}
                aria-current={heading.id === activeId ? 'true' : undefined}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
