export function Steps({ children }) {
  return <ol className="steps">{children}</ol>
}

export function Step({ title, children }) {
  return (
    <li>
      {title && <p className="steps__title">{title}</p>}
      {children}
    </li>
  )
}
