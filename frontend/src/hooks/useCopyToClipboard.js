import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copiar al portapapeles con estado de feedback.
 *
 * navigator.clipboard solo existe en contexto seguro (https o localhost). Si el
 * preview se sirve por IP de LAN no esta disponible, asi que hay que degradar a
 * un mensaje util en vez de romperse en silencio.
 */
export function useCopyToClipboard(resetMs = 2000) {
  const [state, setState] = useState('idle') // idle | copied | error
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (value) => {
      clearTimeout(timer.current)
      try {
        if (!navigator.clipboard) throw new Error('clipboard no disponible')
        await navigator.clipboard.writeText(value)
        setState('copied')
      } catch {
        setState('error')
      }
      timer.current = setTimeout(() => setState('idle'), resetMs)
    },
    [resetMs],
  )

  return { state, copy }
}
