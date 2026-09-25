import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let loading: Promise<TurnstileApi> | null = null

function loadTurnstile() {
  loading ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile)
    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile unavailable')))
    s.onerror = () => {
      loading = null
      reject(new Error('Turnstile failed to load'))
    }
    document.head.appendChild(s)
  })
  return loading
}

export type TurnstileHandle = { reset: () => void }

/**
 * Cloudflare Turnstile: proves a human is submitting, usually without any visible challenge.
 * The token it produces is checked server-side in functions/api/contact.ts.
 */
export function Turnstile({
  siteKey,
  theme,
  onToken,
  ref,
}: {
  siteKey: string
  theme: 'light' | 'dark'
  onToken: (token: string | null) => void
  ref?: Ref<TurnstileHandle>
}) {
  const el = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const api = useRef<TurnstileApi | null>(null)
  const tokenCb = useRef(onToken)
  tokenCb.current = onToken

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (api.current && widget.current) api.current.reset(widget.current)
      tokenCb.current(null)
    },
  }))

  useEffect(() => {
    let cancelled = false
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !el.current) return
        api.current = ts
        widget.current = ts.render(el.current, {
          sitekey: siteKey,
          theme,
          appearance: 'interaction-only',
          callback: (t: string) => tokenCb.current(t),
          'expired-callback': () => tokenCb.current(null),
          'error-callback': () => tokenCb.current(null),
        })
      })
      .catch(() => tokenCb.current(null))
    return () => {
      cancelled = true
      if (api.current && widget.current) api.current.remove(widget.current)
      widget.current = null
    }
  }, [siteKey, theme])

  return <div ref={el} className="empty:hidden" />
}
