import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js'

const LABELS = {
  idle: 'Copiar',
  copied: 'Copiado',
  error: 'Selecciona y copia',
}

export default function CopyButton({ value, label }) {
  const { state, copy } = useCopyToClipboard()

  return (
    <>
      <button
        type="button"
        className="copybtn"
        data-state={state}
        onClick={() => copy(value)}
      >
        {state === 'idle' ? (label ?? LABELS.idle) : LABELS[state]}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === 'copied' ? 'Copiado al portapapeles' : ''}
        {state === 'error' ? 'No se pudo copiar automáticamente' : ''}
      </span>
    </>
  )
}
