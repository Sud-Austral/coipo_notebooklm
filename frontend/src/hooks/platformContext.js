import { createContext, useContext } from 'react'

export const STORAGE_KEY = 'coipo-docs-platform'

/** 'windows' | 'posix' */
export const PlatformContext = createContext({
  platform: 'windows',
  setPlatform: () => {},
})

export const usePlatform = () => useContext(PlatformContext)

export function readStoredPlatform() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'windows' || saved === 'posix') return saved
  } catch {
    /* localStorage puede estar bloqueado; el default sirve igual */
  }
  return navigator.userAgent.includes('Windows') ? 'windows' : 'posix'
}
