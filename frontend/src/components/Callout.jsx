const PREFIX = {
  info: 'Nota:',
  tip: 'Consejo:',
  warning: 'Advertencia:',
  danger: 'Peligro:',
  success: 'Verificado:',
}

const PATH = {
  info: 'M12 16v-5m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  tip: 'M12 3a6 6 0 0 0-3 11.2V17h6v-2.8A6 6 0 0 0 12 3ZM9.5 21h5',
  warning: 'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  danger: 'M12 8v5m0 4h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
  success: 'm8 12.5 2.8 2.8L16.5 9.6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
}

export default function Callout({ type = 'info', title, children }) {
  return (
    <aside className="callout" data-type={type}>
      <svg
        className="callout__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={PATH[type]} />
      </svg>
      <div className="callout__body">
        <span className="sr-only">{PREFIX[type]} </span>
        {title && <p className="callout__title">{title}</p>}
        {children}
      </div>
    </aside>
  )
}
