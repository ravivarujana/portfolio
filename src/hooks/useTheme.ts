import { useCallback, useEffect, useState } from 'react'

export type Mode = 'light' | 'dark'

const root = document.documentElement
const THEME_BG: Record<Mode, string> = { light: '#fbfbfa', dark: '#0a0a0a' }

export function useTheme() {
  const [mode, setModeState] = useState<Mode>(() => (root.dataset.theme === 'dark' ? 'dark' : 'light'))

  useEffect(() => {
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', THEME_BG[mode]))
  }, [mode])

  /** Switch theme; with View Transitions, reveal the new theme as a circle growing from `origin`. */
  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Mode = mode === 'dark' ? 'light' : 'dark'
      const apply = () => {
        root.dataset.theme = next
        setModeState(next)
      }
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* storage unavailable: theme still applies for this visit */
      }

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduce || !origin) return apply()

      const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y))
      document.startViewTransition(apply).ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${r}px at ${origin.x}px ${origin.y}px)`] },
          { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
    },
    [mode],
  )

  return { mode, toggle }
}
