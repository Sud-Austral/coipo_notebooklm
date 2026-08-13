import { to } from '../router/useHashRoute.js'

export default function Sidebar({ id, groups, sections, currentSlug, open, onNavigate }) {
  return (
    <nav
      id={id}
      className="sidebar"
      data-open={open}
      aria-label="Secciones de la guía"
    >
      {groups.map((group) => (
        <div className="sidebar__group" key={group}>
          <p className="sidebar__label">{group}</p>
          <ul className="sidebar__list">
            {sections
              .filter((section) => section.group === group)
              .map((section) => (
                <li key={section.slug}>
                  <a
                    className="sidebar__link"
                    href={to(section.slug)}
                    aria-current={section.slug === currentSlug ? 'page' : undefined}
                    onClick={onNavigate}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
