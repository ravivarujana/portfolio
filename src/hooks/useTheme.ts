import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PALETTE, PALETTES, type Mode, type PaletteId } from '../lib/themes'

const root = document.documentElement

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable: the choice still applies for this visit */
  }
}

export function useTheme() {
  const [mode, setModeState] = useState<Mode>(() => (root.dataset.theme === 'dark' ? 'dark' : 'light'))
  const [palette, setPaletteState] = useState<PaletteId>(() => (root.dataset.palette as PaletteId) ?? DEFAULT_PALETTE)

  useEffect(() => {
    root.dataset.theme = mode
    root.dataset.palette = palette
    const bg = PALETTES.find((p) => p.id === palette)?.bg[mode]
    if (bg) document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', bg))
  }, [mode, palette])

  const setMode = useCallback((m: Mode) => {
    setModeState(m)
    save('theme', m)
  }, [])

  const setPalette = useCallback((p: PaletteId) => {
    setPaletteState(p)
    save('palette', p)
  }, [])

  const toggleMode = useCallback(() => setMode(mode === 'dark' ? 'light' : 'dark'), [mode, setMode])

  return { mode, palette, setMode, setPalette, toggleMode }
}
