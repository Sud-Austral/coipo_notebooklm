import { useCallback, useEffect, useMemo, useState } from 'react'
import { PlatformContext, STORAGE_KEY, readStoredPlatform } from '../hooks/platformContext.js'

export default function PlatformProvider({ children }) {
  const [platform, setPlatformState] = useState(readStoredPlatform)

  const setPlatform = useCallback((next) => setPlatformState(next), [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, platform)
    } catch {
      /* sin persistencia, pero la sesion actual funciona igual */
    }
  }, [platform])

  const value = useMemo(() => ({ platform, setPlatform }), [platform, setPlatform])

  return <PlatformContext value={value}>{children}</PlatformContext>
}
