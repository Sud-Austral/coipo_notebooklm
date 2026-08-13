export default function Badge({ tone = 'neutral', children }) {
  return (
    <span className="badge" data-tone={tone}>
      {children}
    </span>
  )
}
