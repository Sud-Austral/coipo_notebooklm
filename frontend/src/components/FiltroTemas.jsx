export default function FiltroTemas({ temas, activo, onChange }) {
  if (temas.length < 2) return null

  return (
    <div className="filtros" role="group" aria-label="Filtrar por tema">
      <button type="button" aria-pressed={activo === ''} onClick={() => onChange('')}>
        Todos
      </button>
      {temas.map((tema) => (
        <button
          key={tema}
          type="button"
          aria-pressed={activo === tema}
          onClick={() => onChange(tema)}
        >
          {tema}
        </button>
      ))}
    </div>
  )
}
