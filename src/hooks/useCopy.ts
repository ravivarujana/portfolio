import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopy(timeout = 1800) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setState('copied')
      } catch {
        setState('error')
      }
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setState('idle'), timeout)
    },
    [timeout],
  )

  return { state, copy }
}
